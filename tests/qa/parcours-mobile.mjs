// Captures d'une lecture réelle sur téléphone (défilement à la molette, animations actives).
// Usage : node tests/qa/parcours-mobile.mjs <url> <prefixe>
import { chromium } from "playwright";
const [url, prefixe] = process.argv.slice(2);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const erreurs = [];
p.on("pageerror", (e) => erreurs.push(e.message));
await p.goto(url, { waitUntil: "networkidle" });
await p.waitForTimeout(1200);
await p.screenshot({ path: `qa-captures/${prefixe}-1.png` });
for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(120); }
await p.waitForTimeout(1300);
await p.screenshot({ path: `qa-captures/${prefixe}-2.png` });
for (let i = 0; i < 10; i++) { await p.mouse.wheel(0, 400); await p.waitForTimeout(120); }
await p.waitForTimeout(1300);
await p.screenshot({ path: `qa-captures/${prefixe}-3.png` });
await p.mouse.wheel(0, -300); await p.waitForTimeout(900);
await p.screenshot({ path: `qa-captures/${prefixe}-4.png` });
console.log(prefixe, erreurs.length ? erreurs : "aucune erreur");
await b.close();
