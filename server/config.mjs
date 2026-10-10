// Configuration lue dans les variables d'environnement (voir .env.example).
// Aucun secret n'est écrit dans le code.
import path from "node:path";
import { fileURLToPath } from "node:url";

const racine = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function bool(v, defaut = false) {
  if (v === undefined || v === "") return defaut;
  return ["1", "true", "oui", "yes"].includes(String(v).toLowerCase());
}

export function lireConfig(env = process.env) {
  const production = env.NODE_ENV === "production";
  return {
    racine,
    production,
    port: Number(env.PORT || 3000),
    hote: env.HOST || "127.0.0.1",
    dossierPublic: path.resolve(racine, env.PUBLIC_DIR || "dist"),
    cheminBase: path.resolve(racine, env.DATABASE_PATH || "data/ld-solutions.sqlite"),
    dossierSauvegardes: path.resolve(racine, env.BACKUP_DIR || "data/sauvegardes"),
    faireConfianceProxy: bool(env.TRUST_PROXY, false),
    https: bool(env.HTTPS, production),
    // Administration
    adminHashMotDePasse: env.ADMIN_PASSWORD_HASH || "",
    dureeSessionHeures: Number(env.ADMIN_SESSION_HOURS || 8),
    // Courriel (SMTP). Sans SMTP_HOST, les demandes sont enregistrées mais aucune notification n'est envoyée.
    smtp: {
      hote: env.SMTP_HOST || "",
      port: Number(env.SMTP_PORT || 465),
      securise: bool(env.SMTP_SECURE, true),
      utilisateur: env.SMTP_USER || "",
      motDePasse: env.SMTP_PASSWORD || "",
    },
    courrielExpediteur: env.MAIL_FROM || "",
    courrielNotification: env.NOTIFY_TO || "ldjikeleng@gmail.com",
    envoyerAccuse: bool(env.SEND_ACKNOWLEDGEMENT, false),
    urlSite: env.SITE_URL || "",
    // Anti-pourriel
    delaiMinimumMs: Number(env.FORM_MIN_DELAY_MS || 2500),
    limiteDemandes: { nombre: Number(env.FORM_RATE_LIMIT || 5), fenetreMs: 10 * 60 * 1000 },
  };
}
