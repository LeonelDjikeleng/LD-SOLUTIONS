// Captures d'états précis sur téléphone : menu ouvert, sections clés, pages secondaires.
// Usage : node tests/qa/etats-mobile.mjs <base-url>
import { chromium } from "playwright";
const base = process.argv[2] || "http://127.0.0.1:4194";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: "reduce" });
const p = await ctx.newPage();
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(e.message));
const vue = async (url, nom, avant) => {
  await p.goto(base + url, { waitUntil: "networkidle" });
  if (avant) await avant();
  await p.waitForTimeout(300);
  await p.screenshot({ path: `qa-captures/e-${nom}.png` });
};
const section = (sel) => async () => { await p.locator(sel).first().evaluate((el) => el.scrollIntoView({ block: "start" })); await p.mouse.wheel(0, -1); await p.waitForTimeout(250); };
await vue("/", "menu", async () => { await p.click(".bouton-menu"); await p.waitForTimeout(500); });
await vue("/", "piliers", section("#titre-piliers"));
await vue("/", "offres", section("#offres .offre--recommandee"));
await vue("/", "appel", section(".appel-final"));
await vue("/a-propos/", "a-propos", section("main .section:nth-of-type(3)"));
await vue("/tarifs/", "estimateur", section(".estimateur__total"));
await vue("/mentions-legales/", "mentions", section(".prose h2"));
await vue("/404.html", "404");
console.log(erreurs.length ? erreurs : "aucune erreur");
await b.close();
