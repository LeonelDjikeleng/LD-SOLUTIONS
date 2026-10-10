// Identité et coordonnées de LD SOLUTIONS.
// Les champs à null ne s'affichent pas sur le site : rien de provisoire n'est montré aux visiteurs.
// `npm run check:prelaunch` liste ceux qui doivent être remplis avant la mise en production.

export const site = {
  nom: "LD SOLUTIONS",
  // Adresse publique finale du site (sans barre oblique finale). Sert aux balises canoniques,
  // au plan du site et aux données structurées. À REMPLACER par le domaine réel avant la mise en ligne.
  url: process.env.SITE_URL || "https://ldsolutions.example",
  courriel: "ldjikeleng@gmail.com",
  langue: "fr-CA",
  zoneServie: "Québec",
  // ---- À COMPLÉTER avant la mise en ligne (voir docs/09-informations-a-fournir.md) ----
  nomLegal: null, // ex. « Leonel Djikeleng, faisant affaire sous le nom LD SOLUTIONS » ou raison sociale
  neq: null, // Numéro d'entreprise du Québec, s'il existe
  adressePostale: null, // adresse d'affaires (peut être une case postale) ; jamais inventée
  telephone: null, // format 514 555-0123 ; s'il est renseigné, un bouton « Appeler » apparaît
  whatsapp: null, // numéro international sans espaces, ex. 15145550123 ; active le bouton WhatsApp
  lienRendezVous: null, // URL d'un outil de prise de rendez-vous (Cal.com, Calendly…) ; active le bouton
  responsableRP: {
    titre: "Propriétaire de LD SOLUTIONS",
    nom: null, // facultatif : la Loi 25 exige le titre et les coordonnées
    courriel: "ldjikeleng@gmail.com",
  },
  hebergeur: { nom: null, lieu: null }, // ex. { nom: "Hostinger International Ltd.", lieu: "centre de données aux États-Unis" }
  districtJudiciaire: null, // ex. « Montréal » : district des tribunaux compétents dans les conditions de service
  inscriptionTaxes: null, // true / false une fois le statut TPS/TVQ connu ; null = « taxes en sus, le cas échéant »
  paiement: "Virement Interac ou lien de paiement sécurisé",
  heuresOuvrables: "Lundi au vendredi, 9 h à 17 h (heure de l'Est)",
};
