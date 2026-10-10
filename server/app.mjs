// Application HTTP : site statique + API des demandes + mesure anonyme + administration.
// Aucune dépendance de framework ; testable sans réseau (voir tests/unit).
import fs from "node:fs";
import path from "node:path";
import { lireConfig } from "./config.mjs";
import { ouvrirBase } from "./lib/db.mjs";
import { validerDemande, validerEvenement, TYPES } from "./lib/validation.mjs";
import { creerCourrielleur } from "./lib/courriel.mjs";
import { creerServeurStatique, envoyerPage404 } from "./lib/statique.mjs";
import { creerAdmin } from "./lib/admin.mjs";
import { entetesSecurite, creerLimiteur, ipClient, origineAutorisee, echapperHtml } from "./lib/securite.mjs";

const TAILLE_MAX_CORPS = 32 * 1024;

class ErreurHttp extends Error {
  constructor(statut, message) { super(message); this.statut = statut; }
}

async function lireCorps(req) {
  const morceaux = [];
  let taille = 0;
  for await (const m of req) {
    taille += m.length;
    if (taille > TAILLE_MAX_CORPS) throw new ErreurHttp(413, "Requête trop volumineuse.");
    morceaux.push(m);
  }
  const brut = Buffer.concat(morceaux).toString("utf8");
  const type = String(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
  if (type === "application/json" || (type === "text/plain" && brut.trim().startsWith("{"))) {
    try {
      const obj = JSON.parse(brut || "{}");
      return obj && typeof obj === "object" && !Array.isArray(obj) ? obj : {};
    } catch {
      throw new ErreurHttp(400, "JSON invalide.");
    }
  }
  if (type === "application/x-www-form-urlencoded" || type === "") {
    const params = new URLSearchParams(brut);
    const obj = {};
    for (const [k, v] of params) {
      // Champs homonymes (ex. site_actuel dans deux parcours) : on garde les valeurs non vides.
      if (obj[k] === undefined || obj[k] === "") obj[k] = v;
      else if (v !== "") obj[k] = `${obj[k]}, ${v}`;
    }
    return obj;
  }
  throw new ErreurHttp(415, "Type de contenu non pris en charge.");
}

function json(res, statut, objet) {
  res.writeHead(statut, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" });
  res.end(JSON.stringify(objet));
}

/** Page HTML minimale pour les navigateurs sans JavaScript (erreurs de formulaire). */
function pageErreurFormulaire(erreurs, courriel) {
  const items = Object.values(erreurs).map((m) => `<li>${echapperHtml(m)}</li>`).join("");
  return `<!doctype html><html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Demande incomplète · LD SOLUTIONS</title><link rel="stylesheet" href="/assets/css/site.css"></head>
<body><main class="section"><div class="conteneur conteneur--etroit"><div class="message-formulaire message-formulaire--erreur" role="alert">
<h1>Votre demande n'a pas été envoyée</h1><p>Il manque des informations :</p><ul>${items}</ul>
<p>Utilisez le bouton « Retour » de votre navigateur pour compléter le formulaire (vos réponses sont normalement conservées), <a href="/contact/">ouvrez un nouveau formulaire</a> ou écrivez-nous à <a href="mailto:${echapperHtml(courriel)}">${echapperHtml(courriel)}</a>.</p>
</div></div></main></body></html>`;
}

export function creerApplication(options = {}) {
  const config = { ...lireConfig(options.env || process.env), ...(options.config || {}) };
  const depot = options.depot || ouvrirBase(config.cheminBase);
  const courrielleur = options.courrielleur || creerCourrielleur(config);
  const servirStatique = creerServeurStatique(config.dossierPublic);
  const limiteurDemandes = creerLimiteur(config.limiteDemandes);
  const limiteurEvenements = creerLimiteur({ nombre: 120, fenetreMs: 60_000 });
  const limiteurConnexion = creerLimiteur({ nombre: 5, fenetreMs: 15 * 60 * 1000 });
  const ipDe = (req) => ipClient(req, config.faireConfianceProxy);
  const securite = entetesSecurite(config);
  const admin = creerAdmin({ config, depot, limiteurConnexion, lireCorps, ipDe });
  const enCours = new Set();

  async function notifier(id) {
    const demande = depot.lireDemande(id);
    if (!demande || demande.suspect) return;
    const etat = await courrielleur.notifier(demande);
    depot.majNotification(id, etat);
    if (etat.startsWith("echec")) console.error(`[courriel] échec pour ${demande.reference} : ${etat}`);
  }

  // Relance périodique des notifications échouées (maximum 5 essais par demande).
  const relance = setInterval(() => {
    for (const d of depot.demandesARelancer()) {
      const p = notifier(d.id).catch(() => {});
      enCours.add(p); p.finally(() => enCours.delete(p));
    }
  }, 10 * 60 * 1000);
  relance.unref?.();

  async function apiDemandes(req, res) {
    const veutJson = String(req.headers.accept || "").includes("application/json");
    if (req.method !== "POST") { res.setHeader("Allow", "POST"); return json(res, 405, { ok: false, message: "Méthode non autorisée." }); }
    if (!origineAutorisee(req, config.faireConfianceProxy)) return json(res, 403, { ok: false, message: "Origine refusée." });
    if (!limiteurDemandes.autoriser(ipDe(req))) {
      return json(res, 429, { ok: false, message: "Trop de demandes envoyées en peu de temps. Réessayez dans quelques minutes ou écrivez-nous directement par courriel." });
    }
    const corps = await lireCorps(req);
    const resultat = validerDemande(corps, { delaiMinimumMs: config.delaiMinimumMs });
    if (!resultat.ok) {
      if (veutJson) return json(res, 422, { ok: false, message: "Certaines informations sont manquantes ou invalides.", erreurs: resultat.erreurs });
      res.writeHead(422, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(pageErreurFormulaire(resultat.erreurs, config.courrielNotification));
    }
    // 1. Enregistrer d'abord : si l'écriture échoue, une erreur 500 est renvoyée et le visiteur en est informé.
    const { id, reference } = depot.enregistrerDemande(resultat.donnees);
    if (!resultat.donnees.suspect) depot.compterEvenement("demande_" + resultat.donnees.type, resultat.donnees.page_origine || "/");
    // 2. Notifier ensuite, sans faire attendre le visiteur. L'état est noté et visible dans l'administration.
    const p = notifier(id).catch((err) => console.error("[courriel]", err));
    enCours.add(p); p.finally(() => enCours.delete(p));
    if (veutJson) return json(res, 201, { ok: true, reference, type: resultat.donnees.type, libelleType: TYPES[resultat.donnees.type] });
    res.writeHead(303, { Location: `/merci/?ref=${encodeURIComponent(reference)}&type=${encodeURIComponent(resultat.donnees.type)}`, "Cache-Control": "no-store" });
    res.end();
  }

  async function apiEvenements(req, res) {
    if (req.method !== "POST") return json(res, 405, { ok: false });
    if (!origineAutorisee(req, config.faireConfianceProxy)) return json(res, 403, { ok: false });
    if (!limiteurEvenements.autoriser(ipDe(req))) { res.writeHead(204); return res.end(); }
    const corps = await lireCorps(req);
    const ev = validerEvenement(corps);
    if (ev) depot.compterEvenement(ev.nom, ev.page);
    res.writeHead(204, { "Cache-Control": "no-store" });
    res.end();
  }

  // Page de confirmation pour les navigateurs sans JavaScript : la référence y est insérée côté serveur.
  function pageMerci(req, res, url) {
    let html;
    try { html = fs.readFileSync(path.join(config.dossierPublic, "merci", "index.html"), "utf8"); }
    catch { return envoyerPage404(req, res, config.dossierPublic); }
    const ref = url.searchParams.get("ref") || "";
    if (/^LD-\d{6}-[A-Z0-9]{5}$/.test(ref) && depot.lireParReference(ref)) {
      html = html.replace('<p class="ref-ligne" hidden>', '<p class="ref-ligne">').replace("<!--REF-->", echapperHtml(ref));
    }
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" });
    res.end(req.method === "HEAD" ? undefined : html);
  }

  async function gerer(req, res) {
    for (const [k, v] of Object.entries(securite)) res.setHeader(k, v);
    let url;
    try { url = new URL(req.url, "http://localhost"); } catch { res.writeHead(400); return res.end(); }
    const chemin = url.pathname;
    try {
      if (chemin === "/api/demandes") return await apiDemandes(req, res);
      if (chemin === "/api/evenements") return await apiEvenements(req, res);
      if (chemin === "/sante") {
        const ok = depot.sante();
        return json(res, ok ? 200 : 503, { ok, base: ok, courriel: courrielleur.configure ? "configure" : "non-configure" });
      }
      if (chemin === "/admin" || chemin.startsWith("/admin/")) return await admin(req, res, url);
      if (chemin.startsWith("/api/")) return json(res, 404, { ok: false, message: "Introuvable." });
      if (req.method !== "GET" && req.method !== "HEAD") { res.setHeader("Allow", "GET, HEAD"); res.writeHead(405); return res.end(); }
      if (chemin === "/merci/") return pageMerci(req, res, url);
      if (servirStatique(req, res, chemin)) return;
      return envoyerPage404(req, res, config.dossierPublic);
    } catch (err) {
      const statut = err instanceof ErreurHttp ? err.statut : 500;
      if (statut === 500) console.error("[erreur]", err);
      if (res.headersSent) return res.end();
      if (chemin.startsWith("/api/")) {
        return json(res, statut, {
          ok: false,
          message: statut === 500
            ? "Votre demande n'a pas pu être enregistrée à cause d'une erreur de notre côté. Rien n'a été envoyé. Réessayez ou écrivez-nous directement par courriel."
            : err.message,
        });
      }
      res.writeHead(statut, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(statut === 500 ? "Erreur du serveur." : err.message);
    }
  }

  gerer.depot = depot;
  gerer.config = config;
  gerer.attendreNotifications = () => Promise.allSettled([...enCours]);
  gerer.arreter = () => { clearInterval(relance); };
  return gerer;
}
