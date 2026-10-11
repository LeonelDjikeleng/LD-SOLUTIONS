import { amelioration } from "../content/offres.mjs";
import {
  defilant, heroPage, surtitre, fleche, carteAmelioration, faq, faqJsonLd, appelFinal, promosHTML,
  jsonldService, jsonldAriane,
} from "../composants.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Refonte et amélioration", href: "/refonte-amelioration/" }];

export const FAQ_REFONTE = [
  { q: "Faut-il tout refaire ?", r: "<p>Rarement. Un site peut avoir un bon contenu et un bon référencement, mais un affichage mobile ou un formulaire qui fait perdre des demandes. Le diagnostic ou l'audit sert justement à distinguer ce qu'il faut garder, corriger ou remplacer.</p>" },
  { q: "Vais-je perdre mon référencement Google ?", r: "<p>Une refonte mal préparée peut le faire baisser. Nous conservons les adresses des pages qui fonctionnent, nous redirigeons les autres vers leur nouvelle adresse et nous vérifions l'indexation après la mise en ligne.</p>" },
  { q: "Pouvez-vous travailler sur un site WordPress, Wix ou Shopify ?", r: "<p>Oui pour les corrections et l'optimisation sur WordPress et sur un site codé. Sur Wix, Squarespace ou Shopify, les possibilités dépendent de la plateforme : l'audit vous dit précisément ce qui est faisable et ce qui ne l'est pas.</p>" },
  { q: "Mon site n'a pas été fait par vous. Est-ce un problème ?", r: "<p>Non. Il nous faut seulement les accès (administration, hébergement, nom de domaine). Si personne ne les retrouve, nous vous aidons à les récupérer auprès des fournisseurs.</p>" },
];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "02 · Améliorer",
  titre: "Votre site existe. Faisons-le travailler.",
  intro: "Modernisation, affichage mobile, vitesse, formulaires, référencement : nous corrigeons ce qui empêche vos visiteurs de vous contacter. Tout commence par un diagnostic, pour traiter les priorités dans le bon ordre.",
  boutons: `<a class="bouton" href="/audit/" data-evenement="clic_audit">Améliorer mon site ${fleche}</a><a class="bouton bouton--contour" href="#offres-refonte">Voir les prix</a>`,
})}

<section class="section section--clair" aria-labelledby="titre-symptomes">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Ce que nous corrigeons")}
      <h2 id="titre-symptomes">Six problèmes qui coûtent des demandes.</h2>
    </div>
    <div class="grille-cartes grille-cartes--3">
      <article class="carte-simple revele"><h3>Affichage mobile</h3><p>Textes minuscules, boutons trop petits, menus qui débordent. Nous adaptons le site au pouce et à l'écran du téléphone.</p></article>
      <article class="carte-simple revele"><h3>Lenteur</h3><p>Images trop lourdes, extensions inutiles, polices externes. Nous mesurons, puis nous allégeons ce qui ralentit.</p></article>
      <article class="carte-simple revele"><h3>Formulaire qui ne convertit pas</h3><p>Trop de champs, aucune confirmation, demandes perdues. Nous simplifions et nous vérifions que chaque envoi arrive.</p></article>
      <article class="carte-simple revele"><h3>Message flou</h3><p>Le visiteur ne comprend pas ce que vous faites ni où il doit cliquer. Nous clarifions le titre, l'offre et l'action principale.</p></article>
      <article class="carte-simple revele"><h3>Référencement technique</h3><p>Titres en double, pages non indexées, absence de données structurées. Nous remettons les bases en ordre.</p></article>
      <article class="carte-simple revele"><h3>Image datée</h3><p>Le site ne reflète plus votre niveau de travail. Une refonte visuelle modernise sans tout reconstruire.</p></article>
    </div>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-methode">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>
        ${surtitre("Méthode")}
        <h2 id="titre-methode">Diagnostiquer avant de proposer.</h2>
        <p class="texte-secondaire mt-4">Proposer une refonte sans avoir regardé votre site serait deviner. L'audit établit les priorités ; la proposition s'appuie sur ce qu'il a réellement trouvé.</p>
      </div>
      <ol class="liste-etapes">
        <li><span><strong>Diagnostic express (offert) ou audit complet.</strong> Mesures réelles sur téléphone et ordinateur, examen du parcours de demande.</span></li>
        <li><span><strong>Priorités classées.</strong> Ce qui bloque des demandes d'abord, ce qui améliore l'image ensuite, ce qui peut attendre.</span></li>
        <li><span><strong>Proposition chiffrée.</strong> Optimisation ciblée, refonte visuelle ou refonte complète, selon ce qui est justifié.</span></li>
        <li><span><strong>Travaux et vérification.</strong> Nous mesurons à nouveau après les corrections, pour comparer avant et après.</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--blanc" id="offres-refonte" aria-labelledby="titre-offres-r">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Prix")}
      <h2 id="titre-offres-r">Du diagnostic à la refonte complète.</h2>
      <p class="intro">Les montants sont avant taxes. L'audit complet est déduit de tout projet signé dans les 60 jours.</p>
    </div>
    ${defilant(amelioration.map(carteAmelioration).join(""), amelioration.length, "Offres d'amélioration", "offres")}
    <div class="mt-6">${promosHTML({ ids: ["audit-credite"] })}</div>
    <div class="groupe-boutons mt-6"><a class="bouton" href="/audit/" data-evenement="clic_audit">Demander mon audit ${fleche}</a><a class="bouton bouton--contour" href="/contact/?type=discussion">Discuter de mon projet</a></div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-faq-r">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Questions fréquentes")}<h2 id="titre-faq-r">Sur la refonte.</h2></div>
    ${faq(FAQ_REFONTE)}
  </div>
</section>

${appelFinal({ titre: "Commençons par regarder votre site.", intro: "Le diagnostic express est offert : 5 problèmes prioritaires et une piste de correction pour chacun, par écrit, sous 3 jours ouvrables." })}
`;

export default {
  chemin: "/refonte-amelioration/",
  titre: "Refonte et amélioration de site web au Québec",
  description: "Refonte de site web, optimisation mobile, vitesse et conversion pour PME du Québec. Diagnostic express offert, audit complet 390 $ crédité, refonte dès 2 790 $.",
  navActif: "refonte",
  cta: { href: "/audit/", libelle: "Améliorer mon site", evenement: "clic_audit" },
  corps,
  jsonld: [
    jsonldService({ nom: "Refonte et amélioration de sites web", description: "Audit, optimisation et refonte de sites web existants.", chemin: "/refonte-amelioration/", offres: amelioration.filter((a) => a.prix) }),
    jsonldAriane(ARIANE),
    faqJsonLd(FAQ_REFONTE),
  ],
};
