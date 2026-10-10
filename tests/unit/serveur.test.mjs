// Tests d'intégration du serveur : vrai serveur HTTP sur un port libre, base SQLite en mémoire,
// et un vrai serveur SMTP de test local pour vérifier l'envoi des notifications.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import net from "node:net";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { creerApplication } from "../../server/app.mjs";
import { ouvrirBase } from "../../server/lib/db.mjs";
import { hacherMotDePasse } from "../../server/lib/securite.mjs";
import { creerCourrielleur } from "../../server/lib/courriel.mjs";

/* ---------- Serveur SMTP minimal (réception seulement) ---------- */
function demarrerSmtp() {
  const messages = [];
  const serveur = net.createServer((socket) => {
    let enDonnees = false, tampon = "", courant = { rcpt: [] };
    socket.write("220 test ESMTP\r\n");
    socket.on("data", (d) => {
      tampon += d.toString("utf8");
      while (true) {
        if (enDonnees) {
          const fin = tampon.indexOf("\r\n.\r\n");
          if (fin === -1) return;
          courant.data = tampon.slice(0, fin);
          tampon = tampon.slice(fin + 5);
          messages.push(courant); courant = { rcpt: [] }; enDonnees = false;
          socket.write("250 OK\r\n");
          continue;
        }
        const i = tampon.indexOf("\r\n");
        if (i === -1) return;
        const ligne = tampon.slice(0, i); tampon = tampon.slice(i + 2);
        const cmd = ligne.slice(0, 4).toUpperCase();
        if (cmd === "EHLO" || cmd === "HELO") socket.write("250-test\r\n250 OK\r\n");
        else if (cmd === "MAIL") { courant.from = ligne; socket.write("250 OK\r\n"); }
        else if (cmd === "RCPT") { courant.rcpt.push(ligne); socket.write("250 OK\r\n"); }
        else if (cmd === "DATA") { enDonnees = true; socket.write("354 Go\r\n"); }
        else if (cmd === "QUIT") { socket.write("221 Bye\r\n"); socket.end(); return; }
        else socket.write("250 OK\r\n");
      }
    });
  });
  return new Promise((r) => serveur.listen(0, "127.0.0.1", () => r({ serveur, messages, port: serveur.address().port })));
}

let smtp, serveur, base, app, depot, dossierPublic;
const MDP = "mot-de-passe-de-test-123";

before(async () => {
  smtp = await demarrerSmtp();
  dossierPublic = fs.mkdtempSync(path.join(os.tmpdir(), "ld-public-"));
  fs.writeFileSync(path.join(dossierPublic, "index.html"), "<h1>Accueil</h1>");
  fs.writeFileSync(path.join(dossierPublic, "404.html"), "<h1>404</h1>");
  fs.mkdirSync(path.join(dossierPublic, "merci"));
  fs.writeFileSync(path.join(dossierPublic, "merci", "index.html"), '<p class="ref-ligne" hidden>Réf. <span><!--REF--></span></p>');
  fs.mkdirSync(path.join(dossierPublic, "tarifs"));
  fs.writeFileSync(path.join(dossierPublic, "tarifs", "index.html"), "<h1>Tarifs</h1>" + "x".repeat(3000));
  depot = ouvrirBase(":memory:");
  const config = {
    dossierPublic, https: false, adminHashMotDePasse: hacherMotDePasse(MDP), delaiMinimumMs: 2500,
    smtp: { hote: "127.0.0.1", port: smtp.port, securise: false, utilisateur: "", motDePasse: "" },
    courrielExpediteur: "Leonel Djikeleng <site@exemple.ca>", courrielNotification: "ldjikeleng@gmail.com",
    envoyerAccuse: true, limiteDemandes: { nombre: 100, fenetreMs: 60_000 },
  };
  const courrielleur = creerCourrielleur({ ...config, smtp: { ...config.smtp } }, null);
  // nodemailer : désactive STARTTLS opportuniste pour le serveur de test
  app = creerApplication({ env: {}, config, depot, courrielleur });
  serveur = http.createServer(app);
  await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${serveur.address().port}`;
});

after(async () => {
  app.arreter();
  await app.attendreNotifications();
  await new Promise((r) => serveur.close(r));
  smtp.serveur.close();
  fs.rmSync(dossierPublic, { recursive: true, force: true });
});

const ipSuivante = (() => { let n = 10; return () => `203.0.113.${n++}`; })();
async function envoyer(corps, { json = true, entetes = {} } = {}) {
  return fetch(base + "/api/demandes", {
    method: "POST",
    redirect: "manual",
    headers: json
      ? { "Content-Type": "application/json", Accept: "application/json", ...entetes }
      : { "Content-Type": "application/x-www-form-urlencoded", ...entetes },
    body: json ? JSON.stringify(corps) : new URLSearchParams(corps).toString(),
  });
}
const valide = () => ({ type: "creation", nom: "Jean Test", entreprise: "Toitures Test", courriel: "jean@exemple.ca", formule: "professionnel", message: "Bonjour", t: String(Date.now() - 10_000) });

test("une demande valide est enregistrée, puis notifiée par SMTP", async () => {
  const avant = smtp.messages.length;
  const r = await envoyer(valide());
  assert.equal(r.status, 201);
  const corps = await r.json();
  assert.equal(corps.ok, true);
  assert.match(corps.reference, /^LD-\d{6}-[A-Z0-9]{5}$/);
  await app.attendreNotifications();
  const d = depot.lireParReference(corps.reference);
  assert.ok(d, "demande enregistrée");
  assert.equal(d.notification, "envoyee");
  const nouveaux = smtp.messages.slice(avant);
  assert.equal(nouveaux.length, 2, "notification interne + accusé de réception");
  assert.ok(nouveaux[0].rcpt.join().includes("ldjikeleng@gmail.com"));
  assert.ok(nouveaux[0].data.includes(corps.reference));
  assert.ok(nouveaux[1].rcpt.join().includes("jean@exemple.ca"));
});

test("une demande invalide renvoie 422 et n'est pas enregistrée", async () => {
  const total = depot.listerDemandes({ limite: 1000 }).length;
  const r = await envoyer({ type: "creation", nom: "", courriel: "pas-un-courriel" });
  assert.equal(r.status, 422);
  const corps = await r.json();
  assert.ok(corps.erreurs.nom && corps.erreurs.courriel);
  assert.equal(depot.listerDemandes({ limite: 1000 }).length, total);
});

test("le champ piège enregistre la demande comme pourriel, sans notification", async () => {
  const avant = smtp.messages.length;
  const r = await envoyer({ ...valide(), adresse_complementaire: "http://spam" }, { entetes: { "X-Forwarded-For": ipSuivante() } });
  assert.equal(r.status, 201);
  const { reference } = await r.json();
  await app.attendreNotifications();
  const d = depot.lireParReference(reference);
  assert.equal(d.statut, "pourriel");
  assert.equal(d.notification, "ignoree");
  assert.equal(smtp.messages.length, avant);
});

test("envoi sans JavaScript : redirection 303 vers /merci/ avec la référence affichée", async () => {
  const r = await envoyer({ ...valide(), t: "" }, { json: false });
  assert.equal(r.status, 303);
  const lieu = r.headers.get("location");
  assert.match(lieu, /^\/merci\/\?ref=LD-/);
  const page = await (await fetch(base + lieu)).text();
  const ref = new URL(base + lieu).searchParams.get("ref");
  assert.ok(page.includes(ref) && !page.includes("hidden"), "référence insérée et visible");
  const faux = await (await fetch(base + "/merci/?ref=LD-000000-AAAAA")).text();
  assert.ok(faux.includes("hidden"), "référence inconnue non affichée");
});

test("erreur de formulaire sans JavaScript : page HTML explicite", async () => {
  const r = await envoyer({ type: "audit", nom: "A", courriel: "x" }, { json: false });
  assert.equal(r.status, 422);
  const html = await r.text();
  assert.ok(html.includes("n'a pas été envoyée"));
});

test("une origine étrangère est refusée", async () => {
  const r = await envoyer(valide(), { entetes: { Origin: "https://pirate.example" } });
  assert.equal(r.status, 403);
});

test("limitation de débit : la demande au-delà de la limite est refusée (429)", async () => {
  const ip = "198.51.100.7";
  // TRUST_PROXY est désactivé : l'IP est celle de la connexion, commune à ce test. On utilise une app dédiée.
  const appLimitee = creerApplication({ env: {}, depot: ouvrirBase(":memory:"), config: { dossierPublic, https: false, limiteDemandes: { nombre: 2, fenetreMs: 60_000 } }, courrielleur: { configure: false, notifier: async () => "non-configure" } });
  const s = http.createServer(appLimitee);
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${s.address().port}/api/demandes`;
  const statuts = [];
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "X-Forwarded-For": ip }, body: JSON.stringify(valide()) });
    statuts.push(r.status);
  }
  appLimitee.arreter();
  await new Promise((r) => s.close(r));
  assert.deepEqual(statuts, [201, 201, 429]);
});

test("si l'enregistrement échoue, le visiteur reçoit une erreur 500 honnête", async () => {
  const depotEnPanne = { ...ouvrirBase(":memory:"), enregistrerDemande() { throw new Error("disque plein"); } };
  const a = creerApplication({ env: {}, depot: depotEnPanne, config: { dossierPublic, https: false }, courrielleur: { configure: false, notifier: async () => "non-configure" } });
  const s = http.createServer(a);
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  const origErr = console.error; console.error = () => {};
  const r = await fetch(`http://127.0.0.1:${s.address().port}/api/demandes`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(valide()) });
  console.error = origErr;
  a.arreter();
  await new Promise((res) => s.close(res));
  assert.equal(r.status, 500);
  const corps = await r.json();
  assert.equal(corps.ok, false);
  assert.match(corps.message, /n'a pas pu être enregistrée/);
});

test("si le courriel échoue, la demande reste enregistrée et l'échec est noté", async () => {
  const d = ouvrirBase(":memory:");
  const a = creerApplication({ env: {}, depot: d, config: { dossierPublic, https: false }, courrielleur: { configure: true, notifier: async () => "echec: ECONNREFUSED" } });
  const s = http.createServer(a);
  await new Promise((r) => s.listen(0, "127.0.0.1", r));
  const origErr = console.error; console.error = () => {};
  const r = await fetch(`http://127.0.0.1:${s.address().port}/api/demandes`, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(valide()) });
  await a.attendreNotifications();
  console.error = origErr;
  a.arreter();
  await new Promise((res) => s.close(res));
  assert.equal(r.status, 201);
  const { reference } = await r.json();
  assert.match(d.lireParReference(reference).notification, /^echec/);
  assert.equal(d.demandesARelancer().length, 1, "programmée pour une nouvelle tentative");
});

test("corps trop volumineux : 413", async () => {
  const r = await envoyer({ ...valide(), message: "x".repeat(40_000) });
  assert.equal(r.status, 413);
});

test("en-têtes de sécurité présents", async () => {
  const r = await fetch(base + "/");
  assert.equal(r.status, 200);
  assert.match(r.headers.get("content-security-policy"), /default-src 'self'/);
  assert.equal(r.headers.get("x-content-type-options"), "nosniff");
  assert.equal(r.headers.get("x-frame-options"), "DENY");
  assert.ok(r.headers.get("referrer-policy"));
});

test("fichiers statiques : URL propres, compression, traversée de dossier impossible", async () => {
  const r1 = await fetch(base + "/tarifs", { redirect: "manual" });
  assert.equal(r1.status, 301);
  assert.equal(r1.headers.get("location"), "/tarifs/");
  const r2 = await fetch(base + "/tarifs/", { headers: { "Accept-Encoding": "br" } });
  assert.equal(r2.headers.get("content-encoding"), "br");
  for (const chemin of ["/../package.json", "/%2e%2e/package.json", "/..%2fpackage.json"]) {
    const r = await fetch(base + chemin);
    assert.equal(r.status, 404, chemin);
  }
  const r404 = await fetch(base + "/nexiste-pas/");
  assert.equal(r404.status, 404);
});

test("mesure anonyme : événement compté, nom inconnu ignoré", async () => {
  const r = await fetch(base + "/api/evenements", { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ nom: "clic_offre", page: "/tarifs/" }) });
  assert.equal(r.status, 204);
  await fetch(base + "/api/evenements", { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ nom: "inconnu", page: "/" }) });
  const st = depot.statistiques();
  assert.ok(st.parEvenement.some((e) => e.nom === "clic_offre" && e.total >= 1));
  assert.ok(!st.parEvenement.some((e) => e.nom === "inconnu"));
});

test("santé du service", async () => {
  const r = await fetch(base + "/sante");
  assert.equal(r.status, 200);
  assert.equal((await r.json()).base, true);
});

/* ---------- Administration ---------- */
async function connexion(motDePasse) {
  return fetch(base + "/admin/connexion", { method: "POST", redirect: "manual", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ mot_de_passe: motDePasse }).toString() });
}

test("administration : accès refusé sans session, mot de passe faux refusé", async () => {
  const r = await fetch(base + "/admin");
  const html = await r.text();
  assert.ok(html.includes("Connexion") && !html.includes("jean@exemple.ca"));
  assert.equal(r.headers.get("x-robots-tag"), "noindex, nofollow");
  const r2 = await connexion("mauvais");
  assert.equal(r2.status, 401);
});

test("administration : connexion, liste, suivi protégé par jeton CSRF, export CSV neutralisé", async () => {
  await envoyer({ ...valide(), nom: "=CMD()", courriel: "csv@exemple.ca" });
  const r = await connexion(MDP);
  assert.equal(r.status, 303);
  const cookie = r.headers.get("set-cookie");
  assert.match(cookie, /HttpOnly/);
  assert.match(cookie, /SameSite=Strict/);
  const jeton = cookie.split(";")[0];
  const liste = await (await fetch(base + "/admin", { headers: { Cookie: jeton } })).text();
  assert.ok(liste.includes("jean@exemple.ca") || liste.includes("Jean Test"));
  assert.ok(liste.includes("&#61;CMD()") || liste.includes("=CMD()"));
  const id = liste.match(/\/admin\/demandes\/(\d+)/)[1];
  const detail = await (await fetch(base + "/admin/demandes/" + id, { headers: { Cookie: jeton } })).text();
  const csrf = detail.match(/name="csrf" value="([^"]+)"/)[1];
  const sansJeton = await fetch(base + "/admin/demandes/" + id, { method: "POST", redirect: "manual", headers: { Cookie: jeton, "Content-Type": "application/x-www-form-urlencoded" }, body: "statut=qualifie" });
  assert.equal(sansJeton.status, 403);
  const avecJeton = await fetch(base + "/admin/demandes/" + id, { method: "POST", redirect: "manual", headers: { Cookie: jeton, "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ csrf, statut: "qualifie", note: "Rappeler lundi" }).toString() });
  assert.equal(avecJeton.status, 303);
  assert.equal(depot.lireDemande(Number(id)).statut, "qualifie");
  const csv = await (await fetch(base + "/admin/export.csv", { headers: { Cookie: jeton } })).text();
  assert.ok(csv.includes(`"'=CMD()"`), "formule neutralisée dans le CSV");
  const mesures = await fetch(base + "/admin/mesures", { headers: { Cookie: jeton } });
  assert.equal(mesures.status, 200);
});

test("administration : connexions limitées à 5 essais", async () => {
  const statuts = [];
  for (let i = 0; i < 6; i++) statuts.push((await connexion("faux-" + i)).status);
  assert.equal(statuts.at(-1), 429);
});

test("le XSS dans une demande est échappé dans l'administration", async () => {
  const r = await envoyer({ ...valide(), nom: "<script>alert(1)</script>", courriel: "xss@exemple.ca" });
  assert.equal(r.status, 201);
  // nouvelle session (le limiteur de connexion a été saturé par le test précédent : on crée la session directement)
  const { jetonAleatoire, hacherJeton } = await import("../../server/lib/securite.mjs");
  const jeton = jetonAleatoire();
  depot.creerSession(hacherJeton(jeton), "csrf-test", Date.now() + 60_000);
  const html = await (await fetch(base + "/admin", { headers: { Cookie: "ld_admin=" + jeton } })).text();
  assert.ok(!html.includes("<script>alert(1)</script>"));
  assert.ok(html.includes("&lt;script&gt;"));
});
