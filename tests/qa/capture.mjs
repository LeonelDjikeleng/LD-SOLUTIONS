// Capture rapide d'une ou plusieurs pages à plusieurs largeurs. Usage : node tests/qa/capture.mjs <url> <sortie> [largeurs]
import { chromium } from "playwright";
const [url, sortie = "qa-captures", largeursArg = "390,1440"] = process.argv.slice(2);
const largeurs = largeursArg.split(",").map(Number);
const navigateur = await chromium.launch();
for (const l of largeurs) {
  const ctx = await navigateur.newContext({ viewport: { width: l, height: l < 800 ? 844 : 900 }, deviceScaleFactor: 1, reducedMotion: process.env.ANIM ? "no-preference" : "reduce", isMobile: l < 800, hasTouch: l < 800 });
  const page = await ctx.newPage();
  const erreurs = [];
  page.on("pageerror", (e) => erreurs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") erreurs.push(m.text()); });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const nom = url.replace(/^https?:\/\/[^/]+/, "").replace(/[^a-z0-9]+/gi, "_") || "accueil";
  await page.screenshot({ path: `${sortie}/${nom}-${l}-haut.png` });
  if (!process.env.HAUT) await page.screenshot({ path: `${sortie}/${nom}-${l}-complet.png`, fullPage: true });
  const debord = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(`${l}px : débordement=${debord}px, erreurs=${erreurs.length ? erreurs.join(" | ") : "aucune"}`);
  await ctx.close();
}
await navigateur.close();
