// Contrôle avant mise en production : liste ce qui manque encore. Ne modifie rien.
// Usage : npm run check:prelaunch   (code de sortie 1 s'il reste un bloquant)
import fs from "node:fs";
import { site } from "./content/site.config.mjs";
import { promotions } from "./content/offres.mjs";

const bloquants = [];
const avertissements = [];
const env = process.env;

if (!site.url || site.url.includes("example")) bloquants.push("SITE_URL : adresse publique définitive du site (balises canoniques, plan du site).");
if (!site.nomLegal) bloquants.push("site.config.mjs › nomLegal : nom légal de l'entreprise (mentions légales, conditions de service).");
if (!site.hebergeur?.nom) bloquants.push("site.config.mjs › hebergeur : nom et lieu de l'hébergeur (politique de confidentialité, Loi 25).");
if (!site.districtJudiciaire) avertissements.push("site.config.mjs › districtJudiciaire : district des tribunaux compétents (conditions de service).");
if (!site.adressePostale) avertissements.push("site.config.mjs › adressePostale : adresse d'affaires (identification du commerçant).");
if (!site.neq) avertissements.push("site.config.mjs › neq : numéro d'entreprise du Québec, s'il existe.");
if (site.inscriptionTaxes === null) avertissements.push("site.config.mjs › inscriptionTaxes : statut TPS/TVQ à confirmer.");
if (!site.telephone) avertissements.push("site.config.mjs › telephone : facultatif, active le bouton « Appeler ».");
for (const p of promotions.filter((x) => x.aValider)) avertissements.push(`offres.mjs › promotion « ${p.titre} » : décision commerciale à confirmer (aValider).`);
if (!env.ADMIN_PASSWORD_HASH) bloquants.push("ADMIN_PASSWORD_HASH (variable de production) : générer avec `npm run admin:mot-de-passe`.");
if (!env.SMTP_HOST) bloquants.push("SMTP_HOST, SMTP_USER, SMTP_PASSWORD, MAIL_FROM : notifications par courriel des nouvelles demandes.");
if (!fs.existsSync("dist/index.html")) bloquants.push("dist/ absent : lancez `npm run build` avec SITE_URL défini.");
else if (fs.readFileSync("dist/index.html", "utf8").includes("leoneldjikeleng.example")) bloquants.push("dist/ construit avec l'adresse provisoire : relancez `SITE_URL=https://… npm run build`.");

console.log("\nContrôle avant mise en ligne · Leonel Djikeleng\n");
console.log(bloquants.length ? "BLOQUANTS :\n - " + bloquants.join("\n - ") : "Aucun bloquant.");
if (avertissements.length) console.log("\nÀ VÉRIFIER :\n - " + avertissements.join("\n - "));
console.log("\nRappel : faire valider les textes légaux (conditions, confidentialité) par un conseiller juridique.\n");
process.exit(bloquants.length ? 1 : 0);
