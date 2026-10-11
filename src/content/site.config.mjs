// Identité et coordonnées de Leonel Djikeleng (entreprise individuelle exploitée sous son propre nom).
// Les champs à null ne s'affichent pas sur le site : rien de provisoire n'est montré aux visiteurs.
// `npm run check:prelaunch` liste ceux qui doivent être remplis avant la mise en production.

export const site = {
  nom: "Leonel Djikeleng",
  // Signature courte sous le nom, dans l'en-tête
  signature: "Sites web · Québec",
  // Adresse publique finale du site (sans barre oblique finale). Sert aux balises canoniques,
  // au plan du site et aux données structurées. À REMPLACER par le domaine réel avant la mise en ligne.
  url: process.env.SITE_URL || "https://leoneldjikeleng.example",
  courriel: "ldjikeleng@gmail.com",
  langue: "fr-CA",
  zoneServie: "Québec",
  // ---- À COMPLÉTER avant la mise en ligne (voir docs/09-informations-a-fournir.md) ----
  // Exploitée sous les nom et prénom de l'exploitant : pas de nom d'entreprise distinct (voir docs/09).
  nomLegal: "Leonel Djikeleng, travailleur autonome (entreprise individuelle)",
  exploitant: "Leonel Djikeleng", // affiché dans le pied de page et la page À propos
  neq: null, // Numéro d'entreprise du Québec, s'il existe
  adressePostale: "Case postale 202, Québec (Québec) G1E 2G4", // fournie par Leonel Djikeleng le 11 octobre 2026
  telephone: "418 255-7236", // affiché tel quel ; un bouton « Appeler » apparaît
  telephoneLien: "+14182557236", // format international pour les liens tel:
  whatsapp: null, // numéro international sans espaces, ex. 15145550123 ; active le bouton WhatsApp
  lienRendezVous: null, // URL d'un outil de prise de rendez-vous (Cal.com, Calendly…) ; active le bouton
  responsableRP: {
    titre: "Propriétaire de l'entreprise",
    nom: "Leonel Djikeleng",
    courriel: "ldjikeleng@gmail.com",
  },
  // Choix recommandé (docs/05-deploiement.md). À ajuster si un autre hébergeur est finalement souscrit.
  hebergeur: { nom: "OVHcloud", lieu: "serveur privé virtuel situé à Beauharnois, au Québec" },
  districtJudiciaire: "Québec", // district des tribunaux compétents dans les conditions de service
  inscriptionTaxes: false, // non inscrit (petit fournisseur), confirmé le 11 octobre 2026 ; « taxes en sus, le cas échéant » reste exact
  paiement: "Virement Interac ou lien de paiement sécurisé",
  heuresOuvrables: "Lundi au vendredi, 9 h à 17 h (heure de l'Est)",
};
