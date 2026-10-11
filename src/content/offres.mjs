// Source unique des offres et des prix de Leonel Djikeleng.
// Toutes les pages, l'estimateur et les données structurées lisent ce fichier :
// un prix modifié ici est modifié partout. Montants en dollars canadiens, taxes en sus.
// Analyse des coûts et des marges : docs/02-tarification.md
// Prix alignés le 11 octobre 2026 sur le modèle financier (Finance-LD-SOLUTIONS.xlsx) : milieu entre prix plancher et prix cible.

export const TAUX_HORAIRE = 85; // assistance hors forfait, par tranche de 15 min
export const TAUX_URGENCE = 125; // hors heures ouvrables, selon disponibilité, minimum 1 h
export const DELAI_REPONSE = "2 jours ouvrables"; // première réponse à une demande reçue par le site

export const creation = [
  {
    id: "depart",
    nom: "Départ",
    prix: 1595,
    prefixe: "",
    accroche: "Une présence professionnelle, claire et rapide.",
    pourQui: "Travailleurs autonomes et petites entreprises qui n'ont pas encore de site, ou un site à remplacer simplement.",
    probleme: "Vos clients vous cherchent en ligne et ne trouvent rien de convaincant.",
    perimetre: "Jusqu'à 3 pages (ou une page d'accueil longue de 6 sections)",
    inclus: [
      "Design adapté à votre identité (couleurs, logo, ton), sans gabarit acheté",
      "Conçu d'abord pour le téléphone, puis tablette et ordinateur",
      "Formulaire de demande : chaque message enregistré et transmis par courriel",
      "Boutons d'appel, de courriel ou de message selon vos préférences",
      "Référencement de base : titres, descriptions, plan du site, données structurées",
      "Politique de confidentialité de base (Loi 25), en français",
      "Tests sur téléphone, tablette et ordinateur, test des formulaires",
      "Mise en ligne et vérification du HTTPS",
      "Mise en forme et révision de vos textes",
    ],
    revisions: "2 rondes de révisions",
    delai: "Environ 2 semaines après réception de votre contenu complet",
    paiement: "50 % à la signature, 50 % avant la mise en ligne",
    garantie: "30 jours de corrections après la mise en ligne",
    exclusions: [
      "Rédaction complète des textes (option)",
      "Photos et logo",
      "Frais d'hébergement et de nom de domaine",
      "Boutique en ligne, espace client, version anglaise",
    ],
  },
  {
    id: "professionnel",
    nom: "Professionnel",
    prix: 2990,
    prefixe: "",
    recommande: true,
    accroche: "Un site complet qui transforme les visites en demandes.",
    pourQui: "PME et entreprises de services qui veulent présenter tous leurs services et recevoir des demandes de devis qualifiées.",
    probleme: "Votre site existe, mais il ne vous apporte pas de demandes, ou il ne présente pas assez bien vos services.",
    perimetre: "Jusqu'à 7 pages (accueil, services, à propos, contact…)",
    inclus: [
      "Tout ce que comprend l'offre Départ",
      "Maquette de la page d'accueil validée avant la construction",
      "Une page par service principal, rédigée pour vos clients",
      "Rédaction et optimisation des textes à partir de vos informations",
      "Formulaire de devis qualifié (questions adaptées au type de demande)",
      "Référencement local : structure par service, données structurées, Google Search Console",
      "Conseils pour votre fiche Google Business Profile",
      "Intégration de votre outil de rendez-vous ou de WhatsApp, si vous en utilisez un",
      "Mesure des demandes sans témoins de suivi",
    ],
    revisions: "3 rondes de révisions",
    delai: "4 à 5 semaines après réception de votre contenu",
    paiement: "40 % à la signature, 40 % à la validation de la maquette, 20 % à la mise en ligne",
    garantie: "30 jours de corrections après la mise en ligne",
    exclusions: [
      "Photos professionnelles et logo",
      "Frais d'hébergement et de nom de domaine",
      "Boutique en ligne, espace client, version anglaise (sur devis)",
    ],
  },
  {
    id: "sur-mesure",
    nom: "Sur mesure",
    prix: 5900,
    prefixe: "À partir de",
    accroche: "Une expérience pensée pour vendre, de la première visite à la demande.",
    pourQui: "Entreprises en croissance, plusieurs services ou secteurs, besoin d'un parcours de conversion plus élaboré.",
    probleme: "Votre site doit qualifier les demandes, rassurer des clients exigeants et soutenir votre prospection.",
    perimetre: "8 à 15 pages, périmètre précisé dans le devis",
    inclus: [
      "Tout ce que comprend l'offre Professionnel",
      "Direction artistique complète : planche d'ambiance, maquettes téléphone et ordinateur",
      "Pages par secteur ou par service pour votre prospection",
      "Parcours de conversion : estimateur, formulaires en plusieurs étapes",
      "Intégrations (rendez-vous, CRM, automatisations simples) après étude",
      "Animations sur mesure, respectueuses de la vitesse et de l'accessibilité",
      "Séance de prise en main (45 min) pour gérer vos demandes",
    ],
    revisions: "3 rondes de révisions + 1 ronde finale",
    delai: "6 à 10 semaines selon le périmètre",
    paiement: "30 % à la signature, 40 % à la validation des maquettes, 30 % à la mise en ligne",
    garantie: "60 jours de corrections après la mise en ligne",
    exclusions: [
      "Photos, vidéos et logo (production possible sur devis avec des partenaires)",
      "Frais d'hébergement, de nom de domaine et de licences d'outils tiers",
      "Boutique en ligne complexe (étude préalable)",
    ],
  },
];

export const amelioration = [
  {
    id: "diagnostic-express",
    nom: "Diagnostic express",
    prix: 0,
    affichage: "Offert",
    description: "Les 5 problèmes prioritaires de votre site, analysés sur téléphone, avec une piste de correction pour chacun. Réponse écrite sous 3 jours ouvrables.",
    conditions: "Pour une entreprise qui possède un site en ligne. Un diagnostic par entreprise.",
  },
  {
    id: "audit-complet",
    nom: "Audit complet",
    prix: 390,
    description: "Plus de 30 points vérifiés : mobile, vitesse mesurée, référencement technique, parcours de demande, accessibilité, sécurité de base, conformité visible (Loi 25). Rapport écrit priorisé et appel de 45 minutes pour le présenter. Remis sous 5 jours ouvrables.",
    conditions: "Montant crédité à 100 % sur un projet de création ou de refonte signé dans les 60 jours.",
  },
  {
    id: "optimisation-ciblee",
    nom: "Optimisation ciblée",
    prix: 690,
    description: "8 heures de corrections prioritaires choisies avec vous : vitesse, affichage mobile, formulaire, appels à l'action, référencement de base. Idéal après un diagnostic ou un audit.",
    conditions: "Site accessible (accès administrateur ou code source). Heures non utilisées non remboursables, mais reportables 60 jours.",
  },
  {
    id: "refonte-visuelle",
    nom: "Refonte visuelle",
    prix: 2790,
    prefixe: "À partir de",
    description: "Nouvelle direction visuelle appliquée à votre contenu et à votre structure, jusqu'à 7 pages. Adresses des pages conservées ou redirigées pour protéger votre référencement.",
    conditions: "Prix final confirmé après le diagnostic ou l'audit.",
  },
  {
    id: "refonte-complete",
    nom: "Refonte complète",
    prix: null,
    affichage: "Sur devis",
    description: "Nouveau site, nouvelle structure, nouveaux textes, migration du contenu utile et redirections. Les prix des offres de création servent de repère.",
    conditions: "Chiffrée après un audit (crédité) : c'est lui qui fixe les priorités.",
  },
];

export const maintenance = [
  {
    id: "essentielle",
    nom: "Essentielle",
    prixMois: 69,
    prixAn: 690,
    accroche: "Votre site reste à jour, sauvegardé et surveillé.",
    inclus: [
      "Mises à jour mensuelles (système, extensions, dépendances)",
      "Sauvegarde hebdomadaire conservée 30 jours, dont une copie hors du serveur",
      "Surveillance automatique de la disponibilité, alerte en cas de panne",
      "Vérification du certificat HTTPS et de l'échéance du nom de domaine",
      "Correction incluse si une de nos mises à jour cause un problème",
      "Rapport trimestriel",
    ],
    tempsInclus: "Aucune heure de modification incluse",
    reponse: "Première réponse sous 2 jours ouvrables",
  },
  {
    id: "professionnelle",
    nom: "Professionnelle",
    prixMois: 159,
    prixAn: 1590,
    recommande: true,
    accroche: "Entretien complet et petites modifications sans devis.",
    inclus: [
      "Tout ce que comprend la formule Essentielle",
      "Sauvegarde quotidienne conservée 30 jours",
      "Mises à jour de sécurité critiques appliquées sous 2 jours ouvrables",
      "Test mensuel des formulaires et contrôle de la vitesse",
      "Rapport mensuel",
    ],
    tempsInclus: "1 h de modifications par mois (non cumulable)",
    reponse: "Première réponse sous 1 jour ouvrable",
  },
  {
    id: "prioritaire",
    nom: "Prioritaire",
    prixMois: 269,
    prixAn: 2690,
    accroche: "Pour les sites qui génèrent une part importante de vos demandes.",
    inclus: [
      "Tout ce que comprend la formule Professionnelle",
      "Sauvegardes quotidiennes conservées 90 jours",
      "Test de restauration trimestriel",
      "Revue trimestrielle de la conversion et du référencement (appel de 30 min)",
      "Incident bloquant signalé avant 12 h : prise en charge le jour ouvrable même",
    ],
    tempsInclus: "2 h de modifications par mois (non cumulables)",
    reponse: "Première réponse le jour ouvrable même (signalement avant 12 h)",
  },
];

export const maintenanceCommun = {
  engagement: "Sans durée minimale : mois par mois, résiliable avec 30 jours de préavis.",
  annuel: "Paiement annuel : 12 mois pour le prix de 10.",
  horsForfait: [
    "Nouvelles fonctionnalités, nouvelles pages, refonte",
    "Rédaction ou remplacement important de contenu",
    "Pannes ou limites de l'hébergeur (nous coordonnons avec lui)",
    "Frais d'hébergement, de nom de domaine et de licences",
    "Remise en état après un piratage lié à des accès partagés par le client",
  ],
  heuresOuvrables: "Lundi au vendredi, 9 h à 17 h (heure de l'Est), hors jours fériés du Québec",
};

// Options proposées dans l'estimateur et sur la page des services complémentaires.
// statut : "disponible" (prix fixe) ou "etude" (chiffré après une étude du besoin)
export const options = [
  { id: "page-sup", nom: "Page supplémentaire (mise en page de vos textes)", prix: 190, unite: "par page", statut: "disponible", estimateur: true },
  { id: "page-redigee", nom: "Page supplémentaire rédigée et optimisée", prix: 290, unite: "par page", statut: "disponible", estimateur: true },
  { id: "redaction", nom: "Rédaction de contenu", prix: 120, unite: "par page (jusqu'à 600 mots)", statut: "disponible", estimateur: true },
  { id: "formulaire-avance", nom: "Formulaire avancé (plusieurs étapes, questions conditionnelles, pièces jointes)", prix: 390, unite: "", statut: "disponible", estimateur: true },
  { id: "rendez-vous", nom: "Intégration de votre outil de rendez-vous", prix: 150, unite: "", statut: "disponible", estimateur: true },
  { id: "google-business", nom: "Configuration Google Business Profile et Search Console", prix: 190, unite: "", statut: "disponible", estimateur: true },
  { id: "mots-cles", nom: "Recherche de mots-clés et plan de contenu", prix: 350, unite: "", statut: "disponible", estimateur: true },
  { id: "automatisation", nom: "Automatisation simple (demande → tableau de suivi + courriel de confirmation)", prix: 390, unite: "", prefixe: "À partir de", statut: "etude", estimateur: true },
  { id: "integration", nom: "Intégration d'un service tiers (CRM, infolettre, paiement)", prix: null, unite: "", statut: "etude", estimateur: false },
  { id: "anglais", nom: "Version anglaise du site", prix: null, unite: "", statut: "etude", estimateur: false },
  { id: "inclus-contact", nom: "Boutons d'appel, de courriel ou WhatsApp", prix: 0, unite: "", statut: "inclus", estimateur: false },
];

export const promotions = [
  {
    id: "audit-credite",
    titre: "Audit crédité à 100 %",
    texte: "L'audit complet (390 $) est entièrement déduit d'un projet de création ou de refonte signé dans les 60 jours suivant sa remise.",
    prixNormal: 390,
    prixPromo: 0,
    conditions: "Projet signé dans les 60 jours suivant la remise du rapport.",
    actif: true,
  },
  {
    id: "creation-entretien",
    titre: "Création + entretien : 3 mois offerts",
    texte: "Les 3 premiers mois de maintenance Essentielle sont offerts quand elle démarre à la mise en ligne de votre nouveau site (valeur de 207 $). Ensuite 69 $ par mois, résiliable avec 30 jours de préavis.",
    prixNormal: 207,
    prixPromo: 0,
    conditions: "Avec une offre de création ; maintenance démarrée à la mise en ligne.",
    actif: true,
  },
  {
    id: "lancement",
    titre: "Offre de lancement : 10 % sur la création",
    texte: "10 % de rabais sur les offres de création pour les projets signés au plus tard le 31 mars 2027, en échange de votre accord pour présenter le projet comme réalisation de Leonel Djikeleng.",
    pourcentage: 10,
    conditions: "Projet signé au plus tard le 31 mars 2027. Présentation du projet soumise à votre approbation du contenu publié.",
    // Date réelle de fin : l'offre disparaît automatiquement du site après cette date (vérifiée à la construction et dans le navigateur).
    finLe: "2027-03-31",
    actif: true,
    aValider: false, // validée par Leonel Djikeleng le 10 octobre 2026
  },
];

export function formatPrix(n) {
  if (n === null || n === undefined) return "Sur devis";
  if (n === 0) return "Offert";
  return new Intl.NumberFormat("fr-CA", { maximumFractionDigits: 0 }).format(n).replace(/ | /g, " ") + " $";
}

export function promotionActive(promo, date = new Date()) {
  if (!promo.actif) return false;
  if (!promo.finLe) return true;
  return date <= new Date(promo.finLe + "T23:59:59-05:00");
}
