// Génère l'image de partage (1200×630) et l'icône Apple (180×180) à partir de la charte.
// Usage : node src/outils/generer-images.mjs  (nécessite Playwright)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ici = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(ici, "../assets");
const police = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(assets, "fonts", f)).toString("base64");
const logo = `<svg viewBox="0 0 34 34" width="__T__" height="__T__"><rect x="1" y="1" width="32" height="32" rx="8" fill="#0D1424" stroke="#3CD7FF" stroke-opacity=".55"/><path d="M8.6 9.2v15.6h6.6" fill="none" stroke="#E9EEF7" stroke-width="2.6" stroke-linecap="square"/><path d="M18.4 9.2h1.6a7.8 7.8 0 0 1 0 15.6h-1.6z" fill="none" stroke="#3CD7FF" stroke-width="2.6"/></svg>`;
const base = `<style>
@font-face{font-family:B;src:url(${police("bricolage-grotesque.woff2")});font-weight:200 800}
@font-face{font-family:G;src:url(${police("geist.woff2")});font-weight:100 900}
@font-face{font-family:M;src:url(${police("geist-mono.woff2")});font-weight:100 900}
*{margin:0;box-sizing:border-box}body{background:#070b14}
.grille{position:absolute;inset:0;background-image:linear-gradient(rgba(60,215,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(60,215,255,.18) 1px,transparent 1px),linear-gradient(rgba(60,215,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(60,215,255,.06) 1px,transparent 1px);background-size:96px 96px,96px 96px,24px 24px,24px 24px;-webkit-mask-image:radial-gradient(ellipse 80% 90% at 80% 20%,#000 30%,transparent 80%)}
</style>`;

const og = `<!doctype html><html><head><meta charset="utf-8">${base}<style>
.c{position:relative;width:1200px;height:630px;overflow:hidden;color:#e9eef7;font-family:G;padding:72px 80px}
.l{position:absolute;width:900px;height:900px;right:-300px;top:-420px;background:radial-gradient(circle,rgba(31,95,224,.4),transparent 62%)}
.m{display:flex;align-items:center;gap:16px;font-family:B;font-weight:750;font-size:34px}
.m span{font-family:M;font-weight:500;font-size:18px;letter-spacing:.22em;color:#3cd7ff}
h1{font-family:B;font-weight:750;font-size:82px;line-height:1.02;letter-spacing:-.035em;margin-top:70px;max-width:900px}
h1 em{font-style:normal;color:#3cd7ff}
p{font-family:M;font-size:22px;letter-spacing:.08em;color:#a3b0c5;position:absolute;left:80px;bottom:64px;text-transform:uppercase}
.b{position:absolute;right:80px;bottom:52px;background:#ff7a33;color:#070b14;font-weight:700;font-size:26px;padding:18px 28px;border-radius:12px}
</style></head><body><div class="c"><div class="grille"></div><div class="l"></div>
<div class="m">${logo.replace(/__T__/g, "52")}LD <span>SOLUTIONS</span></div>
<h1>Un site web qui <em>travaille</em> pendant que vous travaillez.</h1>
<p>Créer · Améliorer · Entretenir · Québec</p><div class="b">Prix publiés</div></div></body></html>`;

const icone = `<!doctype html><html><head><meta charset="utf-8">${base}</head><body style="width:180px;height:180px;display:grid;place-items:center;background:#0d1424">${logo.replace(/__T__/g, "150")}</body></html>`;

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
