// Service des fichiers du site construit (dist/), avec URL propres, compression et cache.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const TYPES_MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};
const COMPRESSIBLES = new Set([".html", ".css", ".js", ".mjs", ".json", ".webmanifest", ".xml", ".txt", ".svg"]);

export function creerServeurStatique(dossier) {
  const racine = path.resolve(dossier);
  const cache = new Map(); // chemin -> { mtime, brut, br, gz }

  function resoudre(urlChemin) {
    let chemin;
    try { chemin = decodeURIComponent(urlChemin); } catch { return null; }
    if (chemin.includes("\0")) return null;
    const complet = path.resolve(racine, "." + path.posix.normalize("/" + chemin));
    if (complet !== racine && !complet.startsWith(racine + path.sep)) return null; // traversée de dossier
    return complet;
  }

  function lire(fichier) {
    const stat = fs.statSync(fichier);
    const entree = cache.get(fichier);
    if (entree && entree.mtime === stat.mtimeMs) return entree;
    const brut = fs.readFileSync(fichier);
    const ext = path.extname(fichier).toLowerCase();
    const nouvelle = { mtime: stat.mtimeMs, brut, br: null, gz: null, ext };
    if (COMPRESSIBLES.has(ext) && brut.length > 1024) {
      nouvelle.br = zlib.brotliCompressSync(brut, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 10 } });
      nouvelle.gz = zlib.gzipSync(brut, { level: 9 });
    }
    cache.set(fichier, nouvelle);
    return nouvelle;
  }

  function envoyer(req, res, fichier, statut = 200) {
    const f = lire(fichier);
    const ext = f.ext;
    const entetes = { "Content-Type": TYPES_MIME[ext] || "application/octet-stream", Vary: "Accept-Encoding" };
    const avecVersion = /[?&]v=/.test(req.url);
    if (ext === ".html") entetes["Cache-Control"] = "no-cache";
    else if (avecVersion || ext === ".woff2") entetes["Cache-Control"] = "public, max-age=31536000, immutable";
    else entetes["Cache-Control"] = "public, max-age=86400";
    let corps = f.brut;
    const accepte = String(req.headers["accept-encoding"] || "");
    if (f.br && /\bbr\b/.test(accepte)) { corps = f.br; entetes["Content-Encoding"] = "br"; }
    else if (f.gz && /\bgzip\b/.test(accepte)) { corps = f.gz; entetes["Content-Encoding"] = "gzip"; }
    entetes["Content-Length"] = corps.length;
    res.writeHead(statut, entetes);
    res.end(req.method === "HEAD" ? undefined : corps);
  }

  return function servir(req, res, urlChemin) {
    const complet = resoudre(urlChemin);
    if (!complet) return false;
    let fichier = complet;
    try {
      const stat = fs.statSync(fichier);
      if (stat.isDirectory()) {
        if (!urlChemin.endsWith("/")) {
          const requete = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";
          res.writeHead(301, { Location: urlChemin + "/" + requete });
          res.end();
          return true;
        }
        fichier = path.join(fichier, "index.html");
        fs.statSync(fichier);
      }
    } catch {
      return false;
    }
    envoyer(req, res, fichier);
    return true;
  };
}

export function envoyerPage404(req, res, dossier) {
  const fichier = path.join(dossier, "404.html");
  const corps = fs.existsSync(fichier) ? fs.readFileSync(fichier) : Buffer.from("<h1>Page introuvable</h1>");
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" });
  res.end(req.method === "HEAD" ? undefined : corps);
}
