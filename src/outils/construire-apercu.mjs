// Construit une version d'aperçu autonome du site (dist-apercu/), publiable sans serveur :
// pages à plat (tarifs.html…), CSS, JS et polices intégrés dans chaque page, formulaires en mode aperçu
// (rien n'est envoyé, et c'est dit clairement). Usage : npm run build && node src/outils/construire-apercu.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dist = path.join(racine, "dist");
const sortie = path.join(racine, "dist-apercu");
const EXCLUS = new Set(["/merci/"]);
const TITRE_PRINCIPAL = "Site Leonel Djikeleng";

const lire = (f) => fs.readFileSync(path.join(dist, f), "utf8");
const police = (f) => "data:font/woff2;base64," + fs.readFileSync(path.join(dist, "assets/fonts", f)).toString("base64");
const css = lire("assets/css/site.css").replace(/url\("\/assets\/fonts\/([^"]+)"\)/g, (_, f) => `url("${police(f)}")`);
const cssSansJs = lire("assets/css/sans-js.css");
const js = {
  "site.js": lire("assets/js/site.js"),
  "formulaire.js": lire("assets/js/formulaire.js"),
  "estimateur.js": lire("assets/js/estimateur.js").replace('"/contact/?"', '"contact.html?"'),
};

// Inventaire des pages : chemin public -> fichier à plat
const pages = [];
(function parcourir(dossier) {
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory() && e.name !== "assets") parcourir(p);
    else if (e.name === "index.html") {
      const chemin = "/" + path.relative(dist, path.dirname(p)).split(path.sep).filter(Boolean).join("/") + (p === path.join(dist, "index.html") ? "" : "/");
      if (!EXCLUS.has(chemin)) pages.push({ chemin, source: p });
    }
  }
})(dist);
const plat = (chemin) => chemin === "/" ? "index.html" : chemin.replace(/^\/|\/$/g, "").replace(/\//g, "-") + ".html";
const connus = new Set(pages.map((p) => p.chemin));

function lienApercu(href) {
  const m = href.match(/^([^?#]*)(.*)$/);
  let chemin = m[1] || "/";
  if (!chemin.endsWith("/")) chemin += "/";
  if (chemin === "//") chemin = "/";
  return connus.has(chemin) ? plat(chemin) + m[2] : href;
}

const BANDEAU = `<div class="bandeau-apercu">Aperçu privé du site Leonel Djikeleng · les formulaires seront actifs à la mise en ligne définitive</div>`;

fs.rmSync(sortie, { recursive: true, force: true });
fs.mkdirSync(sortie, { recursive: true });

for (const p of pages) {
  let html = fs.readFileSync(p.source, "utf8");
  const scripts = [...html.matchAll(/<script src="\/assets\/js\/([a-z]+\.js)\?v=[^"]+" defer><\/script>/g)].map((m) => m[1]);
  html = html
    .replace(/<script src="\/assets\/js\/[^"]+" defer><\/script>\n?/g, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?/g, "")
    .replace(/<link rel="(preload|manifest|icon|apple-touch-icon|canonical)"[^>]*>\n?/g, "")
    .replace(/<meta (property|name)="(og:[^"]+|twitter:[^"]+)"[^>]*>\n?/g, "")
    .replace(/<link rel="stylesheet" href="\/assets\/css\/site\.css\?v=[^"]+">/, `<meta name="robots" content="noindex, nofollow">\n<style>${css}</style>`)
    .replace(/<noscript><link rel="stylesheet" href="\/assets\/css\/sans-js\.css"><\/noscript>/, `<noscript><style>${cssSansJs}</style></noscript>`)
    .replace(/action="\/api\/demandes"/g, 'action="#"')
    // Images du site intégrées dans la page (l'aperçu est publié sans dossier d'images)
    .replace(/src="\/assets\/img\/([^"]+\.(webp|png|svg))"/g, (_, f, ext) => `src="data:image/${ext === "svg" ? "svg+xml" : ext};base64,${fs.readFileSync(path.join(dist, "assets/img", f)).toString("base64")}"`)
    .replace(/href="(\/[^"]*)"/g, (_, h) => `href="${lienApercu(h)}"`);

  const scriptsFin = `<script>window.LD_APERCU = true; document.documentElement.lang = "fr-CA";</script>\n` +
    scripts.map((s) => `<script>${js[s]}</script>`).join("\n");

  if (p.chemin === "/") {
    // Page principale : le service d'hébergement fournit lui-même <html>, <head> et <body>.
    const tete = html.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>\n?|<meta name="viewport"[^>]*>\n?/g, "")
      .replace(/<title>[^<]*<\/title>/, `<title>${TITRE_PRINCIPAL}</title>`);
    const corpsOuvrant = html.match(/<body([^>]*)>/)[1];
    const corps = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
    const classe = (corpsOuvrant.match(/class="([^"]*)"/) || [])[1];
    html = `${tete.trim()}\n${BANDEAU}\n${corps.trim()}\n${scriptsFin}\n` +
      (classe ? `<script>document.body.classList.add(${JSON.stringify(classe)});</script>\n` : "");
  } else {
    html = html.replace(/(<body[^>]*>)/, `$1\n${BANDEAU}`).replace("</body>", `${scriptsFin}\n</body>`);
  }
  fs.writeFileSync(path.join(sortie, plat(p.chemin)), html);
}

const fichiers = fs.readdirSync(sortie);
const total = fichiers.reduce((n, f) => n + fs.statSync(path.join(sortie, f)).size, 0);
console.log(`${fichiers.length} pages d'aperçu dans dist-apercu/ (${(total / 1024 / 1024).toFixed(1)} Mo au total)`);
