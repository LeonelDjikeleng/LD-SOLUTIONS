// Sauvegarde cohérente de la base (VACUUM INTO, à chaud) + manifeste SHA-256 + vérification.
// Usage : npm run sauvegarde            -> crée et vérifie une nouvelle sauvegarde horodatée
//         npm run sauvegarde -- --verifier <fichier.sqlite>
// Ne remplace jamais une sauvegarde existante. Conserve les 30 plus récentes (KEEP_BACKUPS).
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { lireConfig } from "../config.mjs";

process.removeAllListeners("warning");
const { DatabaseSync } = await import("node:sqlite");
const config = lireConfig();

function sha256(fichier) {
  return crypto.createHash("sha256").update(fs.readFileSync(fichier)).digest("hex");
}

export function verifier(fichier) {
  const manifeste = fichier + ".sha256";
  const resultat = { fichier, existe: fs.existsSync(fichier), integrite: null, empreinte: null, demandes: null };
  if (!resultat.existe) return resultat;
  if (fs.existsSync(manifeste)) {
    const attendu = fs.readFileSync(manifeste, "utf8").split(/\s+/)[0];
    resultat.empreinte = attendu === sha256(fichier) ? "conforme" : "DIFFÉRENTE";
  } else resultat.empreinte = "manifeste absent";
  const db = new DatabaseSync(fichier, { readOnly: true });
  resultat.integrite = db.prepare("PRAGMA integrity_check").get().integrity_check;
  resultat.demandes = db.prepare("SELECT COUNT(*) AS n FROM demandes").get().n;
  db.close();
  return resultat;
}

function sauvegarder() {
  if (!fs.existsSync(config.cheminBase)) {
    console.error(`Base introuvable : ${config.cheminBase}`);
    process.exit(1);
  }
  fs.mkdirSync(config.dossierSauvegardes, { recursive: true });
  const horodatage = new Date().toISOString().replace(/[:]/g, "").replace(/\..+/, "");
  const cible = path.join(config.dossierSauvegardes, `ld-solutions_site_prod_db_${horodatage}.sqlite`);
  if (fs.existsSync(cible)) { console.error("Une sauvegarde porte déjà ce nom : abandon."); process.exit(1); }
  const db = new DatabaseSync(config.cheminBase);
  db.exec(`VACUUM INTO '${cible.replace(/'/g, "''")}'`);
  db.close();
  fs.chmodSync(cible, 0o600);
  fs.writeFileSync(cible + ".sha256", `${sha256(cible)}  ${path.basename(cible)}\n`, { mode: 0o600 });
  const v = verifier(cible);
  console.log(JSON.stringify(v, null, 2));
  if (v.integrite !== "ok" || v.empreinte !== "conforme") { console.error("ÉCHEC de vérification de la sauvegarde."); process.exit(2); }

  const garder = Number(process.env.KEEP_BACKUPS || 30);
  const existantes = fs.readdirSync(config.dossierSauvegardes).filter((f) => f.endsWith(".sqlite")).sort();
  for (const f of existantes.slice(0, Math.max(0, existantes.length - garder))) {
    fs.rmSync(path.join(config.dossierSauvegardes, f));
    fs.rmSync(path.join(config.dossierSauvegardes, f + ".sha256"), { force: true });
  }
  console.log(`Sauvegarde vérifiée : ${cible}`);
}

const i = process.argv.indexOf("--verifier");
if (i > -1) {
  const v = verifier(path.resolve(process.argv[i + 1] || ""));
  console.log(JSON.stringify(v, null, 2));
  process.exit(v.existe && v.integrite === "ok" && v.empreinte === "conforme" ? 0 : 2);
} else {
  sauvegarder();
}
