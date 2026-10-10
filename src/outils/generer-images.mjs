// Génère l'image de partage (1200×630) et l'icône Apple (180×180) à partir de la charte.
// Usage : node src/outils/generer-images.mjs  (nécessite Playwright)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ici = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(ici, "../assets");
const police = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(assets, "fonts", f)).toString("base64");
const logo = `<svg viewBox="0 0 34 34" width="__T__" height="__T__"><rect x="1.5" y="1.5" width="31" height="31" fill="none" stroke="#F4F6FC" stroke-opacity=".55"/><path d="M1.5 25.5h4M28.5 8.5h4" stroke="#F4F6FC" stroke-opacity=".55"/><path d="M9 9v16h6.4" fill="none" stroke="#F4F6FC" stroke-width="2.4" stroke-linecap="square"/><path d="M18.6 9h1.4a8 8 0 0 1 0 16h-1.4z" fill="none" stroke="#FFCE3A" stroke-width="2.4"/></svg>`;
const base = `<style>
@font-face{font-family:B;src:url(${police("big-shoulders-display.woff2")});font-weight:100 900}
@font-face{font-family:P;src:url(${police("ibm-plex-sans.woff2")});font-weight:100 700}
@font-face{font-family:M;src:url(${police("ibm-plex-mono-500.woff2")});font-weight:500}
*{margin:0;box-sizing:border-box}body{background:#14307a}
</style>`;
const traits = `<svg style="position:absolute;inset:0" width="1200" height="630" viewBox="0 0 1200 630"><g fill="none" stroke="#F4F6FC" stroke-opacity=".2"><circle cx="980" cy="380" r="330"/><circle cx="980" cy="380" r="200" stroke-dasharray="3 8"/><line x1="0" y1="380" x2="1200" y2="380" stroke-dasharray="18 6 3 6"/><line x1="980" y1="0" x2="980" y2="630" stroke-dasharray="18 6 3 6"/></g></svg>`;

const og = `<!doctype html><html><head><meta charset="utf-8">${base}<style>
.c{position:relative;width:1200px;height:630px;overflow:hidden;color:#f4f6fc;font-family:P;padding:60px 72px}
.m{position:relative;display:flex;align-items:center;gap:16px;font-family:B;font-weight:800;font-size:44px;letter-spacing:.02em}
.m span{font-family:M;font-size:16px;letter-spacing:.24em;color:#b9c5e6}
h1{position:relative;font-family:B;font-weight:800;font-size:104px;line-height:.9;text-transform:uppercase;margin-top:48px;max-width:860px}
h1 em{font-style:normal;background:linear-gradient(#ffce3a,#ffce3a) no-repeat 0 86%/100% .2em}
p{position:absolute;left:72px;bottom:56px;font-family:M;font-size:19px;letter-spacing:.14em;color:#b9c5e6;text-transform:uppercase}
.b{position:absolute;right:72px;bottom:44px;background:#ffce3a;color:#0c1424;font-weight:600;font-size:24px;padding:16px 26px}
</style></head><body><div class="c">${traits}
<div class="m">${logo.replace(/__T__/g, "56")}LD <span>SOLUTIONS</span></div>
<h1>Un site web qui <em>travaille</em> pendant que vous travaillez.</h1>
<p>Créer · Améliorer · Entretenir · Québec</p><div class="b">Prix publiés</div></div></body></html>`;

const icone = `<!doctype html><html><head><meta charset="utf-8">${base}</head><body style="width:180px;height:180px;display:grid;place-items:center;background:#14307a">${logo.replace(/__T__/g, "140")}</body></html>`;

const nav = await chromium.launch();
const p = await nav.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(og, { waitUntil: "load" });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(assets, "img", "og-ld-solutions.png") });
await p.setViewportSize({ width: 180, height: 180 });
await p.setContent(icone, { waitUntil: "load" });
await p.screenshot({ path: path.join(assets, "img", "apple-touch-icon.png") });
await nav.close();
console.log("Images générées.");
