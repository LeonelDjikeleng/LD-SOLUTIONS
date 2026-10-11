import { maintenance, TAUX_HORAIRE, TAUX_URGENCE } from "../content/offres.mjs";
import {
  heroPage, surtitre, fleche, grilleMaintenance, horsForfaitMaintenance, faq, faqJsonLd, appelFinal,
  jsonldService, jsonldAriane, formulaireDemande,
} from "../composants.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Maintenance", href: "/maintenance/" }];

export const FAQ_MAINTENANCE = [
  { q: "Quelle différence entre une mise à jour, une correction et une modification ?", r: "<p><strong>Mise à jour</strong> : installer les nouvelles versions du système et des extensions (incluse). <strong>Correction</strong> : réparer ce qui ne fonctionne plus comme avant ; incluse si la cause est une de nos interventions. <strong>Modification</strong> : changer un texte, une image, ajouter un élément ; comptée dans les heures incluses de votre formule, puis à " + TAUX_HORAIRE + " $ l'heure, approuvée par vous avant.</p>" },
  { q: "Garantissez-vous que mon site ne tombera jamais en panne ?", r: "<p>Non : personne ne peut le garantir honnêtement. Nous réduisons fortement les risques (mises à jour, sauvegardes, surveillance) et, en cas de panne, nous sommes avertis automatiquement et nous intervenons dans le délai de votre formule, en heures ouvrables.</p>" },
  { q: "Et si mon site est piraté ?", r: "<p>Nous le restaurons à partir de la dernière sauvegarde saine. La remise en état est incluse si la cause relève de notre entretien (par exemple une mise à jour que nous aurions dû appliquer). Si elle vient d'un accès partagé ou d'un mot de passe compromis de votre côté, elle est facturée au taux horaire, avec votre accord préalable.</p>" },
  { q: "Puis-je arrêter quand je veux ?", r: "<p>Oui. Les formules sont mensuelles, sans durée minimale : un préavis de 30 jours suffit. Nous vous remettons alors vos accès et une dernière sauvegarde.</p>" },
  { q: "Entretenez-vous des sites que vous n'avez pas créés ?", r: "<p>Oui, après une vérification de départ. Si le site a pris du retard (mises à jour en attente, extensions abandonnées), nous vous indiquons d'abord les travaux de remise à niveau et leur prix.</p>" },
];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "03 · Entretenir",
  titre: "Un site entretenu reste un site qui rapporte.",
  intro: "Mises à jour, sauvegardes vérifiées, surveillance et petites modifications. Des formules mensuelles claires, sans durée minimale, avec ce qui est inclus et ce qui ne l'est pas.",
  boutons: `<a class="bouton" href="#formules-maintenance">Choisir une formule ${fleche}</a><a class="bouton bouton--contour" href="#demande-maintenance">Faire vérifier mon site</a>`,
})}

<section class="section section--clair" aria-labelledby="titre-roles">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Ce que couvre l'entretien")}
      <h2 id="titre-roles">Six tâches que l'on oublie, jusqu'au jour où elles manquent.</h2>
    </div>
    <div class="grille-cartes grille-cartes--3">
      <article class="carte-simple revele"><h3>Mises à jour</h3><p>Système, extensions et dépendances à jour, testés après chaque passage. Les failles connues sont la première porte d'entrée des pirates.</p></article>
      <article class="carte-simple revele"><h3>Sauvegardes</h3><p>Copies régulières, dont une hors du serveur, et vérifiées. Une sauvegarde jamais testée n'est qu'un espoir.</p></article>
      <article class="carte-simple revele"><h3>Surveillance</h3><p>Le site est vérifié automatiquement plusieurs fois par heure. En cas de panne, nous sommes alertés avant vos clients.</p></article>
      <article class="carte-simple revele"><h3>Renouvellements</h3><p>Certificat HTTPS et nom de domaine suivis : un domaine expiré peut faire disparaître votre site et vos courriels.</p></article>
      <article class="carte-simple revele"><h3>Corrections et modifications</h3><p>Petits changements de textes, d'images ou de prix, compris dans les heures incluses de votre formule.</p></article>
      <article class="carte-simple revele"><h3>Rapport</h3><p>Ce qui a été fait, ce qui a été détecté, ce que nous recommandons. Trimestriel ou mensuel selon la formule.</p></article>
    </div>
  </div>
</section>

<section class="section section--blanc" id="formules-maintenance" aria-labelledby="titre-formules-m">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Formules")}
      <h2 id="titre-formules-m">Trois niveaux, mois par mois.</h2>
      <p class="intro">Prix avant taxes. Paiement annuel possible : 12 mois pour le prix de 10.</p>
    </div>
    ${grilleMaintenance()}
    ${horsForfaitMaintenance()}
    <p class="note-prix">Intervention urgente en dehors des heures ouvrables : ${TAUX_URGENCE} $ l'heure, minimum 1 heure, selon disponibilité (sans garantie de délai).</p>
  </div>
</section>

<section class="section section--clair" id="demande-maintenance" aria-labelledby="titre-demande-m">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>
        ${surtitre("Demande")}
        <h2 id="titre-demande-m">Faites vérifier votre site.</h2>
        <p class="texte-secondaire mt-4">Indiquez l'adresse de votre site et, si vous la connaissez, sa plateforme. Nous examinons son état et nous vous recommandons la formule adaptée, avec les éventuels travaux de remise à niveau.</p>
      </div>
      <div class="panneau-formulaire">${formulaireDemande({ typeDefaut: "maintenance", typesVisibles: ["maintenance"], idPrefixe: "fm", titre: "Demande de maintenance" })}</div>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-faq-m">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Questions fréquentes")}<h2 id="titre-faq-m">Sur la maintenance.</h2></div>
    ${faq(FAQ_MAINTENANCE)}
  </div>
</section>

${appelFinal()}
`;

export default {
  chemin: "/maintenance/",
  titre: "Maintenance de site web dès 69 $ par mois",
  description: "Maintenance de site web au Québec : mises à jour, sauvegardes vérifiées, surveillance, modifications. Formules de 69 $ à 269 $ par mois, sans durée minimale.",
  navActif: "maintenance",
  cta: { href: "#formules-maintenance", libelle: "Choisir une formule", evenement: "clic_offre" },
  formulaire: true,
  corps,
  jsonld: [
    jsonldService({ nom: "Maintenance de sites web", description: "Mises à jour, sauvegardes, surveillance et modifications de sites web.", chemin: "/maintenance/", offres: maintenance.map((m) => ({ nom: "Maintenance " + m.nom + " (par mois)", prix: m.prixMois })) }),
    jsonldAriane(ARIANE),
    faqJsonLd(FAQ_MAINTENANCE),
  ],
};
