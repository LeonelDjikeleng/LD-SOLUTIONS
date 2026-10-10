// Construit le site statique dans dist/ : pages, plan du site, robots.txt, manifeste, ressources versionnées.
// Usage : npm run build   (SITE_URL=https://www.domaine.ca npm run build pour l'adresse finale)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const ici = path.dirname(fileURLToPath(import.meta.url));
const racine = path.resolve(ici, "..");
const dist = path.join(racine, "dist");

const { site } = await import("./content/site.config.mjs");
const { gabarit } = await import("./gabarit.mjs");

function copierDossier(source, cible) {
  fs.mkdirSync(cible, { recursive: true });
  for (const entree of fs.readdirSync(source, { withFileTypes: true })) {
    const s = path.join(source, entree.name);
    const c = path.join(cible, entree.name);
    if (entree.isDirectory()) copierDossier(s, c);
    else fs.copyFileSync(s, c);
  }
}

const empreinte = (fichier) => crypto.createHash("sha256").update(fs.readFileSync(fichier)).digest("hex").slice(0, 10);

// 1. Nettoyer et copier les ressources
fs.rmSync(dist, { recursive: true, force: true });
copierDossier(path.join(ici, "assets"), path.join(dist, "assets"));
const versions = {
  css: empreinte(path.join(dist, "assets/css/site.css")),
  js: empreinte(path.join(dist, "assets/js/site.js")),
  formulaire: empreinte(path.join(dist, "assets/js/formulaire.js")),
  estimateur: empreinte(path.join(dist, "assets/js/estimateur.js")),
};

// 2. Charger les pages (chaque module exporte un objet page ou un tableau de pages)
const pages = [];
for (const fichier of fs.readdirSync(path.join(ici, "pages")).filter((f) => f.endsWith(".mjs")).sort()) {
  const mod = await import(pathToFileURL(path.join(ici, "pages", fichier)).href);
  pages.push(...[].concat(mod.default));
}

// Typographie française : espaces insécables (fines avant ; ! ? : et dans les guillemets,
// normales entre un nombre et son unité). Appliquée au texte seulement, jamais aux balises ni aux scripts.
const FINE = "\u202F", INSEC = "\u00A0";
function typographie(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/).map((morceau, i) => {
    if (i % 2 === 1) return morceau;
    return morceau
      .replace(/ ([:;!?»])/g, FINE + "$1")
      .replace(/« /g, "«" + FINE)
      .replace(/(\d) (\$|%|h\b|min\b|jours?\b|mois\b|ans?\b|semaines?\b|pages?\b|heures?\b|minutes?\b|Ko\b|Mo\b|px\b|mots\b|points?\b|rondes?\b)/g, "$1" + INSEC + "$2");
  }).join("");
}

// 3. Écrire chaque page
const chemins = new Set();
const avertissements = [];
for (const p of pages) {
  if (chemins.has(p.chemin)) throw new Error(`Chemin en double : ${p.chemin}`);
  chemins.add(p.chemin);
  const html = typographie(gabarit({ ...p, versions }));
  const sortie = p.fichier ? path.join(dist, p.fichier) : path.join(dist, p.chemin, "index.html");
  fs.mkdirSync(path.dirname(sortie), { recursive: true });
  fs.writeFileSync(sortie, html);
  // Garde-fous éditoriaux (revue du texte, compétence 10k website)
  const texteVisible = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]+>/g, " ");
  if (texteVisible.includes("—")) avertissements.push(`${p.chemin} : tiret cadratin (—) dans le texte`);
  if (/lorem ipsum|À COMPLÉTER|TODO/i.test(texteVisible)) avertissements.push(`${p.chemin} : texte provisoire visible`);
  if (p.description.length > 165) avertissements.push(`${p.chemin} : description de ${p.description.length} caractères (> 165)`);
}

// 4. Plan du site, robots.txt, manifeste
const aujourdhui = new Date().toISOString().slice(0, 10);
const indexables = pages.filter((p) => !p.noindex && !p.fichier);
fs.writeFileSync(path.join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexables.map((p) => `  <url><loc>${site.url}${p.chemin}</loc><lastmod>${aujourdhui}</lastmod></url>`).join("\n")}
</urlset>
`);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /merci/

Sitemap: ${site.url}/sitemap.xml
`);
fs.writeFileSync(path.join(dist, "site.webmanifest"), JSON.stringify({
  name: "LD SOLUTIONS", short_name: "LD SOLUTIONS", lang: "fr-CA", start_url: "/", display: "browser",
  background_color: "#070b14", theme_color: "#070b14",
  icons: [{ src: "/assets/img/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, { src: "/assets/img/favicon.svg", sizes: "any", type: "image/svg+xml" }],
}, null, 2));

console.log(`${pages.length} pages construites dans dist/ (${site.url}).`);
if (avertissements.length) {
  console.warn("Avertissements :\n - " + avertissements.join("\n - "));
  if (process.env.STRICT === "1") process.exit(1);
}
