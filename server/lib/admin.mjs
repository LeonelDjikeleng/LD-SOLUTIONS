// Administration minimale et sécurisée : liste et suivi commercial des demandes, export CSV, mesure.
// Rendu côté serveur, tout est échappé. Aucune dépendance au JavaScript du navigateur.
import { STATUTS } from "./db.mjs";
import { TYPES } from "./validation.mjs";
import { echapperHtml as e, verifierMotDePasse, jetonAleatoire, hacherJeton, egaliteSure } from "./securite.mjs";

const NOM_COOKIE = "ld_admin";
const LIBELLES_STATUT = Object.fromEntries(STATUTS.map((s) => [s.id, s.libelle]));
const LIBELLES_DETAILS = {
  formule: "Formule", echeance: "Échéance", budget: "Budget", options: "Options", estimation: "Estimation ($)",
  objectif_audit: "Objectif", formule_audit: "Formule d'audit", plateforme: "Plateforme",
  niveau_maintenance: "Niveau", preference_contact: "Préférence de contact",
};

function lireCookies(req) {
  const out = {};
  for (const morceau of String(req.headers.cookie || "").split(";")) {
    const i = morceau.indexOf("=");
    if (i > 0) out[morceau.slice(0, i).trim()] = decodeURIComponent(morceau.slice(i + 1).trim());
  }
  return out;
}

function page(titre, corps, { session } = {}) {
  return `<!doctype html>
<html lang="fr-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow"><title>${e(titre)} · Administration LD SOLUTIONS</title>
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/css/admin.css"></head>
<body><header class="a-entete"><a href="/admin" class="a-logo">LD SOLUTIONS <span>administration</span></a>
${session ? `<nav><a href="/admin">Demandes</a><a href="/admin/mesures">Mesures</a><a href="/admin/export.csv">Export CSV</a>
<form method="post" action="/admin/deconnexion"><input type="hidden" name="csrf" value="${e(session.jeton_csrf)}"><button type="submit">Se déconnecter</button></form></nav>` : ""}
</header><main class="a-main">${corps}</main></body></html>`;
}

function badge(statut) {
  return `<span class="a-badge a-badge--${e(statut)}">${e(LIBELLES_STATUT[statut] || statut)}</span>`;
}

function dateLocale(iso) {
  try {
    return new Date(iso).toLocaleString("fr-CA", { timeZone: "America/Toronto", dateStyle: "medium", timeStyle: "short" });
  } catch { return iso; }
}

function csvCellule(v) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // neutralise les formules (injection CSV)
  return `"${s.replace(/"/g, '""')}"`;
}

export function creerAdmin({ config, depot, limiteurConnexion, lireCorps, ipDe }) {
  const actif = Boolean(config.adminHashMotDePasse);

  function session(req) {
    const jeton = lireCookies(req)[NOM_COOKIE];
    if (!jeton) return null;
    return depot.lireSession(hacherJeton(jeton));
  }

  function poserCookie(res, valeur, maxAge) {
    const attributs = [`${NOM_COOKIE}=${encodeURIComponent(valeur)}`, "Path=/admin", "HttpOnly", "SameSite=Strict", `Max-Age=${maxAge}`];
    if (config.https) attributs.push("Secure");
    res.setHeader("Set-Cookie", attributs.join("; "));
  }

  function html(res, statut, contenu) {
    res.writeHead(statut, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" });
    res.end(contenu);
  }

  function rediriger(res, ou) {
    res.writeHead(303, { Location: ou, "Cache-Control": "no-store" });
    res.end();
  }

  function pageConnexion(message = "") {
    return page("Connexion", `<section class="a-carte a-connexion"><h1>Connexion</h1>
${message ? `<p class="a-erreur" role="alert">${e(message)}</p>` : ""}
<form method="post" action="/admin/connexion"><label for="mdp">Mot de passe</label>
<input id="mdp" name="mot_de_passe" type="password" autocomplete="current-password" required>
<button type="submit">Se connecter</button></form></section>`);
  }

  function listeDemandes(req, s, url) {
    const type = TYPES[url.searchParams.get("type")] ? url.searchParams.get("type") : "";
    const statut = LIBELLES_STATUT[url.searchParams.get("statut")] ? url.searchParams.get("statut") : "";
    const recherche = (url.searchParams.get("q") || "").slice(0, 80);
    const demandes = depot.listerDemandes({ type, statut, recherche });
    const compte = Object.fromEntries(depot.compterParStatut().map((r) => [r.statut, r.n]));
    const options = (liste, courant) => liste.map(([v, l]) => `<option value="${e(v)}"${v === courant ? " selected" : ""}>${e(l)}</option>`).join("");
    const lignes = demandes.map((d) => `<tr>
<td><a href="/admin/demandes/${d.id}">${e(d.reference)}</a></td>
<td>${e(dateLocale(d.cree_le))}</td>
<td>${e(TYPES[d.type] || d.type)}</td>
<td><strong>${e(d.nom)}</strong>${d.entreprise ? `<br><span class="a-gris">${e(d.entreprise)}</span>` : ""}</td>
<td>${badge(d.statut)}${d.notification.startsWith("echec") ? ` <span class="a-alerte" title="${e(d.notification)}">courriel non envoyé</span>` : ""}</td>
<td>${e(d.prochaine_action || "")}</td></tr>`).join("");
    const pipeline = STATUTS.filter((st) => st.id !== "pourriel").map((st) => `<li><span>${e(st.libelle)}</span><b>${compte[st.id] || 0}</b></li>`).join("");
    return page("Demandes", `<h1>Demandes</h1>
<ul class="a-pipeline">${pipeline}</ul>
<form class="a-filtres" method="get" action="/admin">
<label>Type <select name="type"><option value="">Tous</option>${options(Object.entries(TYPES), type)}</select></label>
<label>Statut <select name="statut"><option value="">Tous (sauf pourriel)</option>${options(STATUTS.map((x) => [x.id, x.libelle]), statut)}</select></label>
<label>Recherche <input name="q" value="${e(recherche)}" placeholder="nom, entreprise, courriel, référence"></label>
<button type="submit">Filtrer</button></form>
<div class="a-tableau"><table><thead><tr><th>Référence</th><th>Reçue le</th><th>Type</th><th>Contact</th><th>Statut</th><th>Prochaine action</th></tr></thead>
<tbody>${lignes || `<tr><td colspan="6">Aucune demande pour ces critères.</td></tr>`}</tbody></table></div>`, { session: s });
  }

  function detailDemande(s, d) {
    const details = Object.entries(d.details || {}).map(([k, v]) => `<dt>${e(LIBELLES_DETAILS[k] || k)}</dt><dd>${e(v)}</dd>`).join("");
    const optionsStatut = STATUTS.map((st) => `<option value="${e(st.id)}"${st.id === d.statut ? " selected" : ""}>${e(st.libelle)}</option>`).join("");
    return page(d.reference, `<p><a href="/admin">← Toutes les demandes</a></p>
<h1>${e(d.reference)} ${badge(d.statut)}</h1>
<div class="a-grille"><section class="a-carte"><h2>${e(TYPES[d.type] || d.type)}</h2><dl>
<dt>Reçue le</dt><dd>${e(dateLocale(d.cree_le))}</dd>
<dt>Nom</dt><dd>${e(d.nom)}</dd>
${d.entreprise ? `<dt>Entreprise</dt><dd>${e(d.entreprise)}</dd>` : ""}
<dt>Courriel</dt><dd><a href="mailto:${e(d.courriel)}?subject=${encodeURIComponent("Votre demande " + d.reference + " · LD SOLUTIONS")}">${e(d.courriel)}</a></dd>
${d.telephone ? `<dt>Téléphone</dt><dd><a href="tel:${e(d.telephone.replace(/[^0-9+]/g, ""))}">${e(d.telephone)}</a></dd>` : ""}
${d.secteur ? `<dt>Secteur</dt><dd>${e(d.secteur)}</dd>` : ""}
${d.site_actuel ? `<dt>Site actuel</dt><dd><a href="${e(d.site_actuel)}" rel="noopener noreferrer nofollow" target="_blank">${e(d.site_actuel)}</a></dd>` : ""}
${details}
${d.page_origine ? `<dt>Page d'origine</dt><dd>${e(d.page_origine)}</dd>` : ""}
<dt>Notification</dt><dd>${e(d.notification)}</dd>
${d.suspect ? `<dt>Pourriel probable</dt><dd>${e(d.raison_suspect)}</dd>` : ""}
</dl>${d.message ? `<h3>Message</h3><p class="a-message">${e(d.message)}</p>` : ""}</section>
<section class="a-carte"><h2>Suivi commercial</h2>
<form method="post" action="/admin/demandes/${d.id}"><input type="hidden" name="csrf" value="${e(s.jeton_csrf)}">
<label for="statut">Statut</label><select id="statut" name="statut">${optionsStatut}</select>
<label for="prochaine_action">Prochaine action (date ou note courte)</label><input id="prochaine_action" name="prochaine_action" maxlength="120" value="${e(d.prochaine_action || "")}">
<label for="note">Notes internes</label><textarea id="note" name="note" rows="8" maxlength="5000">${e(d.note || "")}</textarea>
<button type="submit">Enregistrer</button></form>
<details class="a-danger"><summary>Supprimer cette demande (demande d'effacement)</summary>
<form method="post" action="/admin/demandes/${d.id}/supprimer"><input type="hidden" name="csrf" value="${e(s.jeton_csrf)}">
<label><input type="checkbox" name="confirmer" value="oui" required> Je confirme la suppression définitive</label>
<button type="submit" class="a-bouton-danger">Supprimer définitivement</button></form></details></section></div>`, { session: s });
  }

  function mesures(s) {
    const st = depot.statistiques();
    const tableau = (lignes, col1, col2) => `<table><thead><tr><th>${col1}</th><th>${col2}</th></tr></thead><tbody>${
      lignes.map((l) => `<tr><td>${e(Object.values(l)[0])}</td><td>${e(Object.values(l)[1])}</td></tr>`).join("") || `<tr><td colspan="2">Aucune donnée.</td></tr>`
    }</tbody></table>`;
    return page("Mesures", `<h1>Mesures des 30 derniers jours</h1>
<p class="a-gris">Comptages anonymes depuis le ${e(st.depuis)} : aucun témoin, aucune adresse IP, aucun identifiant n'est conservé. Un clic n'est pas une demande ; une demande n'est pas une vente : seul le statut « Gagné » compte comme vente.</p>
<div class="a-grille"><section class="a-carte"><h2>Demandes reçues par type</h2>${tableau(st.demandesParType.map((r) => ({ a: TYPES[r.type] || r.type, b: r.n })), "Type", "Demandes")}</section>
<section class="a-carte"><h2>Demandes par statut</h2>${tableau(st.demandesParStatut.map((r) => ({ a: LIBELLES_STATUT[r.statut] || r.statut, b: r.n })), "Statut", "Demandes")}</section>
<section class="a-carte"><h2>Événements</h2>${tableau(st.parEvenement, "Événement", "Total")}</section>
<section class="a-carte"><h2>Pages vues</h2>${tableau(st.parPage, "Page", "Vues")}</section></div>`, { session: s });
  }

  function exportCsv(res) {
    const demandes = depot.listerDemandes({ limite: 100000 });
    const entetes = ["reference", "cree_le", "type", "statut", "nom", "entreprise", "courriel", "telephone", "secteur", "site_actuel", "details", "message", "prochaine_action", "note"];
    const lignes = [entetes.join(",")].concat(
      demandes.map((d) => entetes.map((k) => csvCellule(k === "details" ? JSON.stringify(d.details) : d[k])).join(","))
    );
    res.writeHead(200, {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="demandes-ld-solutions-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    });
    res.end("﻿" + lignes.join("\r\n"));
  }

  return async function gerer(req, res, url) {
    const chemin = url.pathname.replace(/\/+$/, "") || "/admin";
    if (!actif) {
      html(res, 503, page("Administration désactivée", `<section class="a-carte"><h1>Administration désactivée</h1><p>Définissez la variable ADMIN_PASSWORD_HASH (voir docs/05-deploiement.md) puis redémarrez le serveur.</p></section>`));
      return;
    }
    const s = session(req);

    if (chemin === "/admin/connexion" && req.method === "POST") {
      const ip = ipDe(req);
      if (!limiteurConnexion.autoriser(ip)) {
        depot.journaliser("connexion-bloquee", ip);
        return html(res, 429, pageConnexion("Trop de tentatives. Réessayez dans 15 minutes."));
      }
      const corps = await lireCorps(req);
      if (verifierMotDePasse(corps.mot_de_passe, config.adminHashMotDePasse)) {
        limiteurConnexion.reinitialiser(ip);
        const jeton = jetonAleatoire();
        const duree = config.dureeSessionHeures * 3600;
        depot.purgerSessions();
        depot.creerSession(hacherJeton(jeton), jetonAleatoire(24), Date.now() + duree * 1000);
        depot.journaliser("connexion", "");
        poserCookie(res, jeton, duree);
        return rediriger(res, "/admin");
      }
      depot.journaliser("connexion-echec", "");
      return html(res, 401, pageConnexion("Mot de passe incorrect."));
    }

    if (!s) {
      if (req.method !== "GET" && req.method !== "HEAD") return html(res, 401, pageConnexion("Session expirée. Reconnectez-vous."));
      return html(res, 200, pageConnexion());
    }

    if (req.method === "POST") {
      const corps = await lireCorps(req);
      if (!egaliteSure(corps.csrf || "", s.jeton_csrf)) return html(res, 403, page("Refusé", `<p>Jeton de sécurité invalide. Rechargez la page.</p>`, { session: s }));

      if (chemin === "/admin/deconnexion") {
        depot.supprimerSession(hacherJeton(lireCookies(req)[NOM_COOKIE]));
        poserCookie(res, "", 0);
        return rediriger(res, "/admin");
      }
      let m = chemin.match(/^\/admin\/demandes\/(\d+)$/);
      if (m) {
        const id = Number(m[1]);
        if (!depot.lireDemande(id)) return html(res, 404, page("Introuvable", "<p>Demande introuvable.</p>", { session: s }));
        const statut = LIBELLES_STATUT[corps.statut] ? corps.statut : "nouveau";
        depot.majSuivi(id, {
          statut,
          note: String(corps.note || "").slice(0, 5000),
          prochaine_action: String(corps.prochaine_action || "").slice(0, 120),
        });
        depot.journaliser("suivi", `demande ${id} -> ${statut}`);
        return rediriger(res, `/admin/demandes/${id}`);
      }
      m = chemin.match(/^\/admin\/demandes\/(\d+)\/supprimer$/);
      if (m && corps.confirmer === "oui") {
        depot.supprimerDemande(Number(m[1]));
        depot.journaliser("suppression", `demande ${m[1]}`);
        return rediriger(res, "/admin");
      }
      return html(res, 400, page("Requête invalide", "<p>Action non reconnue.</p>", { session: s }));
    }

    if (chemin === "/admin") return html(res, 200, listeDemandes(req, s, url));
    if (chemin === "/admin/mesures") return html(res, 200, mesures(s));
    if (chemin === "/admin/export.csv") return exportCsv(res);
    const m = chemin.match(/^\/admin\/demandes\/(\d+)$/);
    if (m) {
      const d = depot.lireDemande(Number(m[1]));
      if (!d) return html(res, 404, page("Introuvable", "<p>Demande introuvable.</p>", { session: s }));
      return html(res, 200, detailDemande(s, d));
    }
    return html(res, 404, page("Introuvable", "<p>Page introuvable.</p>", { session: s }));
  };
}
