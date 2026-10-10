// Validation côté serveur des demandes. Le navigateur valide aussi, mais seul ce module fait foi.

export const TYPES = {
  creation: "Création de site",
  audit: "Audit / amélioration",
  maintenance: "Maintenance",
  discussion: "Discussion",
};

const SECTEURS = new Set([
  "", "construction", "automobile", "services-professionnels", "nettoyage-entretien",
  "restauration-commerce", "immobilier", "sante-bien-etre", "autre",
]);
const FORMULES = new Set(["", "depart", "professionnel", "sur-mesure", "je-ne-sais-pas"]);
const NIVEAUX_MAINTENANCE = new Set(["", "essentielle", "professionnelle", "prioritaire", "conseil"]);
const PLATEFORMES = new Set(["", "wordpress", "wix", "squarespace", "shopify", "sur-mesure", "autre", "inconnue"]);
const OBJECTIFS_AUDIT = new Set(["", "plus-de-demandes", "mobile", "vitesse", "referencement", "modernisation", "autre"]);
const ECHEANCES = new Set(["", "des-que-possible", "1-mois", "1-3-mois", "plus-tard"]);
const BUDGETS = new Set(["", "moins-1500", "1500-3000", "3000-6000", "plus-6000", "a-definir"]);
const PREFERENCES = new Set(["", "courriel", "telephone"]);

const COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
const TELEPHONE = /^[0-9+().\-\s]{7,30}$/;

function texte(v, max) {
  if (v === undefined || v === null) return "";
  // Supprime les caractères de contrôle (sauf saut de ligne et tabulation) et normalise.
  return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);
}

// Champs d'une seule ligne : aucun retour à la ligne (empêche l'injection d'en-têtes dans les courriels).
function ligne(v, max) {
  return texte(v, max * 2).replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim().slice(0, max);
}

export function normaliserUrl(v) {
  let s = texte(v, 300);
  if (!s) return "";
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (!["http:", "https:"].includes(u.protocol) || !u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

/**
 * Valide et nettoie une demande.
 * @returns {{ ok: true, donnees: object } | { ok: false, erreurs: Record<string,string> }}
 */
export function validerDemande(brut, { maintenant = Date.now(), delaiMinimumMs = 2500 } = {}) {
  const erreurs = {};
  const type = texte(brut.type, 20);
  if (!TYPES[type]) erreurs.type = "Choisissez le type de demande.";

  const nom = ligne(brut.nom, 100);
  if (nom.length < 2) erreurs.nom = "Indiquez votre nom.";

  const courriel = ligne(brut.courriel, 254).toLowerCase();
  if (!COURRIEL.test(courriel)) erreurs.courriel = "Indiquez une adresse courriel valide, par exemple nom@entreprise.ca.";

  const telephone = ligne(brut.telephone, 30);
  if (telephone && !TELEPHONE.test(telephone)) erreurs.telephone = "Ce numéro de téléphone ne semble pas valide.";

  const entreprise = ligne(brut.entreprise, 150);
  const secteur = texte(brut.secteur, 40);
  if (!SECTEURS.has(secteur)) erreurs.secteur = "Secteur inconnu.";

  const message = texte(brut.message, 5000);
  let site_actuel = "";
  if (brut.site_actuel) {
    const u = normaliserUrl(brut.site_actuel);
    if (u === null) erreurs.site_actuel = "Indiquez l'adresse de votre site, par exemple www.monentreprise.ca.";
    else site_actuel = u;
  }

  const details = {};
  const choix = (cle, ensemble, max = 40) => {
    const v = texte(brut[cle], max);
    if (!ensemble.has(v)) { erreurs[cle] = "Choix invalide."; return ""; }
    if (v) details[cle] = v;
    return v;
  };

  if (type === "creation") {
    choix("formule", FORMULES);
    choix("echeance", ECHEANCES);
    choix("budget", BUDGETS);
    const options = ligne(brut.options, 500);
    if (options) details.options = options;
    const estimation = texte(brut.estimation, 20);
    if (/^\d{1,6}$/.test(estimation)) details.estimation = Number(estimation);
  } else if (type === "audit") {
    if (!site_actuel && !erreurs.site_actuel) erreurs.site_actuel = "Indiquez l'adresse du site à analyser.";
    choix("objectif_audit", OBJECTIFS_AUDIT);
    choix("echeance", ECHEANCES);
    const formuleAudit = texte(brut.formule_audit, 30);
    if (["diagnostic-express", "audit-complet", ""].includes(formuleAudit)) { if (formuleAudit) details.formule_audit = formuleAudit; }
    else erreurs.formule_audit = "Choix invalide.";
  } else if (type === "maintenance") {
    if (!site_actuel && !erreurs.site_actuel) erreurs.site_actuel = "Indiquez l'adresse du site à entretenir.";
    choix("plateforme", PLATEFORMES);
    choix("niveau_maintenance", NIVEAUX_MAINTENANCE);
  } else if (type === "discussion") {
    if (message.length < 10) erreurs.message = "Décrivez en quelques mots ce dont vous voulez discuter.";
    choix("preference_contact", PREFERENCES);
  }

  if (Object.keys(erreurs).length) return { ok: false, erreurs };

  // Signaux de pourriel : la demande est quand même enregistrée (marquée), jamais perdue en silence.
  let suspect = false;
  let raison_suspect = "";
  if (texte(brut.adresse_complementaire, 200)) { suspect = true; raison_suspect = "champ piège rempli"; }
  const t = Number(brut.t);
  if (!suspect && Number.isFinite(t) && t > 0 && maintenant - t < delaiMinimumMs) {
    suspect = true; raison_suspect = "envoi trop rapide";
  }
  const liens = (message.match(/https?:\/\//gi) || []).length;
  if (!suspect && liens > 3) { suspect = true; raison_suspect = "trop de liens dans le message"; }

  let page_origine = texte(brut.page_origine, 120);
  if (!page_origine.startsWith("/")) page_origine = "";

  return {
    ok: true,
    donnees: { type, nom, entreprise, courriel, telephone, secteur, site_actuel, message, details, page_origine, suspect, raison_suspect },
  };
}

const EVENEMENTS = new Set([
  "page_vue", "clic_offre", "debut_formulaire", "clic_courriel", "copie_courriel",
  "estimateur_utilise", "clic_devis", "clic_audit", "clic_telephone", "clic_whatsapp",
]);

export function validerEvenement(brut) {
  const nom = texte(brut?.nom, 40);
  let page = texte(brut?.page, 120).split("?")[0].split("#")[0];
  if (!EVENEMENTS.has(nom)) return null;
  if (!/^\/[a-z0-9\-/]*$/i.test(page)) page = "/";
  return { nom, page };
}
