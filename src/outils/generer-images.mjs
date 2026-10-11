// Génère l'image de partage (1200×630) et l'icône Apple (180×180) à partir de la charte v3.
// Usage : node src/outils/generer-images.mjs  (nécessite Playwright)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ici = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(ici, "../assets");
const police = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(assets, "fonts", f)).toString("base64");
const monogramme = (taille, trait, d) => `<svg viewBox="0 0 34 34" width="${taille}" height="${taille}"><circle cx="17" cy="17" r="15.9" fill="none" stroke="${trait}" stroke-width=".9"/><path fill="${trait}" d="M8.6 10h2.2v11.4h5.6v2.2H8.6z"/><path fill="${d}" d="M17.6 10h2.2v13.6h-2.2zM19.8 10h.8a6.8 6.8 0 0 1 0 13.6h-.8v-2.2h.8a4.6 4.6 0 0 0 0-9.2h-.8z"/></svg>`;
const base = `<style>
@font-face{font-family:D;src:url(${police("geist.woff2")});font-weight:100 900}
@font-face{font-family:S;src:url(${police("geist.woff2")});font-weight:100 900}
*{margin:0;box-sizing:border-box}body{background:#fff}
</style>`;

const og = `<!doctype html><html><head><meta charset="utf-8">${base}<style>
.c{position:relative;width:1200px;height:630px;overflow:hidden;color:#121a16;font-family:S;padding:64px 80px;background:#fff}
.c::after{content:"";position:absolute;right:0;top:0;bottom:0;width:300px;background:#eff4f0}
.c::before{content:"";position:absolute;right:14px;top:14px;bottom:14px;width:272px;border:1px dashed rgba(15,77,58,.32);border-radius:22px;z-index:1}
.m{position:relative;display:flex;align-items:center;gap:16px;font-family:D;font-weight:700;font-size:38px;letter-spacing:-.03em;color:#121a16}
.m span{font-family:S;font-weight:600;font-size:15px;letter-spacing:.26em;color:#56605b}
.k{position:relative;margin-top:54px;font-weight:600;font-size:17px;letter-spacing:.22em;text-transform:uppercase;color:#0f4d3a;display:flex;align-items:center;gap:14px}
.k::before{content:"";width:40px;height:1px;background:#a8844a}
h1{position:relative;font-family:D;font-weight:500;font-size:80px;line-height:1.04;letter-spacing:-.045em;margin-top:22px;max-width:760px}
h1 em{font-style:normal;color:#0f4d3a}
.b{position:absolute;left:80px;bottom:60px;background:#0f4d3a;color:#fff;font-weight:600;font-size:22px;padding:16px 30px;border-radius:999px}
.g{position:absolute;right:62px;top:50%;transform:translateY(-50%);z-index:2}
</style></head><body><div class="c">
<div class="m">${monogramme(54, "#0f4d3a", "#a8844a")}Leonel Djikeleng <span>SITES WEB · QUÉBEC</span></div>
<p class="k">Créer · Améliorer · Entretenir</p>
<h1>Un site web qui <em>travaille</em> pendant que vous travaillez.</h1>
<div class="b">Prix publiés, dès 1 595 $</div>
<div class="g">${monogramme(176, "#0f4d3a", "#a8844a")}</div></div></body></html>`;

const icone = `<!doctype html><html><head><meta charset="utf-8">${base}</head><body style="width:180px;height:180px;display:grid;place-items:center;background:#0f4d3a">${monogramme(132, "#ffffff", "#d7bc8a")}</body></html>`;

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
