// Vérifie la version d'aperçu (dist-apercu/) comme si elle était publiée : aucune ressource externe,
// navigation entre pages, formulaires en mode aperçu, pas de débordement. Usage : node tests/qa/tester-apercu.mjs
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const dossier = path.resolve("dist-apercu");
const BASE = "https://apercu.test/";
const navigateur = await chromium.launch();
const problemes = [];

async function contexte(options) {
  const ctx = await navigateur.newContext(options);
  await ctx.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== new URL(BASE).origin) { problemes.push("requête externe : " + url.href); return route.abort(); }
    const fichier = path.join(dossier, url.pathname.slice(1) || "index.html");
    if (!fs.existsSync(fichier)) { problemes.push("introuvable : " + url.pathname); return route.fulfill({ status: 404, body: "" }); }
    let corps = fs.readFileSync(fichier, "utf8");
    // La plateforme enveloppe la page principale dans un squelette de document
    if (path.basename(fichier) === "index.html") corps = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>${corps}</body></html>`;
    return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: corps });
  });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => problemes.push("erreur JS : " + e.message));
  page.on("console", (m) => { if (m.type() === "error") problemes.push("console : " + m.text()); });
  return { ctx, page };
}

for (const [largeur, mobile] of [[390, true], [1440, false]]) {
  const { ctx, page } = await contexte({ viewport: { width: largeur, height: 900 }, isMobile: mobile, hasTouch: mobile });
  for (const f of fs.readdirSync(dossier)) {
    await page.goto(BASE + f, { waitUntil: "load" });
    const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (d > 0) problemes.push(`${f} @${largeur} : débordement ${d}px`);
    const police = await page.evaluate(() => document.fonts.check('700 32px "Bricolage Grotesque"'));
    if (!police) problemes.push(`${f} : police de titre non chargée`);
  }
  await ctx.close();
}

const { ctx, page } = await contexte({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto(BASE + "index.html");
await page.locator(".bouton-menu").click();
await page.locator("#menu-mobile a", { hasText: "Tarifs" }).click();
await page.waitForURL(/tarifs\.html/);
await page.locator('label[for="est-depart"]').click();
const total = (await page.locator("[data-total]").textContent()).replace(/\s/g, "");
if (total !== "1490$") problemes.push("estimateur : total inattendu " + total);
await page.goto(BASE + "contact.html");
await page.fill("#fc-nom", "Essai Apercu");
await page.fill("#fc-courriel", "essai@exemple.ca");
await page.locator("[data-bouton-envoyer]").click();
const msg = await page.locator(".message-formulaire").textContent();
if (!/n'a pas été envoyée/.test(msg)) problemes.push("formulaire : message d'aperçu absent");
if (await page.locator(".message-formulaire--succes").count()) problemes.push("formulaire : fausse confirmation");
await page.screenshot({ path: "qa-captures/apercu-formulaire.png" });
await ctx.close();
await navigateur.close();

console.log(problemes.length ? "PROBLÈMES :\n - " + problemes.join("\n - ") : "Aperçu conforme : 18 pages, 2 largeurs, navigation, estimateur et formulaire vérifiés.");
process.exit(problemes.length ? 1 : 0);
