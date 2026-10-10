import { creation, formatPrix } from "../content/offres.mjs";
import {
  heroPage, surtitre, fleche, grilleCreation, processus, faq, faqJsonLd, appelFinal, promosHTML,
  jsonldService, jsonldAriane,
} from "../composants.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Création de sites web", href: "/creation-site-web/" }];

export const FAQ_CREATION = [
  { q: "Qu'est-ce qu'une « ronde de révisions » ?", r: "<p>Vous regroupez vos commentaires sur une version du site (ou de la maquette) et nous les appliquons en une fois. Une ronde peut contenir plusieurs corrections. Les rondes supplémentaires ou les demandes qui changent le périmètre (nouvelle page, nouvelle fonction) font l'objet d'un avenant chiffré avant d'être réalisées.</p>" },
  { q: "Utilisez-vous WordPress, Wix ou autre chose ?", r: "<p>Nous choisissons l'outil selon votre besoin : un site codé sur mesure (le plus rapide et le plus sûr, sans extensions à mettre à jour) ou un système de gestion de contenu si vous voulez modifier vous-même vos textes souvent. Le choix est expliqué et écrit dans la proposition.</p>" },
  { q: "Combien coûtent l'hébergement et le nom de domaine ?", r: "<p>Ils sont payés directement par vous, à votre nom, au fournisseur choisi. À titre indicatif, un nom de domaine .ca ou .com coûte souvent entre 15 $ et 40 $ par an, et un hébergement adapté à un site de PME entre 5 $ et 30 $ par mois selon le fournisseur et les besoins. Nous vous aidons à choisir et à tout configurer.</p>" },
  { q: "Que se passe-t-il si mon contenu n'est pas prêt ?", r: "<p>Le calendrier démarre à la réception de votre contenu complet. Si vous manquez de temps pour écrire, la rédaction est incluse dans la formule Professionnel et disponible en option (120 $ par page) dans la formule Départ.</p>" },
];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "01 · Créer",
  titre: "Un site conçu pour vos clients, pas pour un gabarit.",
  intro: "Nous concevons des sites professionnels, rapides et clairs sur téléphone. Ils expliquent ce que vous faites en quelques secondes et rendent la demande de devis évidente. Prix publiés, périmètre écrit.",
  boutons: `<a class="bouton" href="/contact/?type=creation" data-evenement="clic_devis">Créer mon site web ${fleche}</a><a class="bouton bouton--contour" href="#formules">Voir les formules</a>`,
})}

<section class="section section--clair" aria-labelledby="titre-types">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Quel site pour quelle entreprise")}
      <h2 id="titre-types">Trois types de sites, selon ce qu'il doit accomplir.</h2>
    </div>
    <div class="grille-cartes grille-cartes--3">
      <article class="carte-simple revele"><span class="statut statut--disponible">Formule Départ</span><h3>Le site vitrine</h3><p>Une à trois pages pour être trouvé, inspirer confiance et être joint facilement. Idéal pour un travailleur autonome ou une entreprise qui démarre.</p><p class="prix-ligne">${formatPrix(creation[0].prix)} <small>taxes en sus</small></p></article>
      <article class="carte-simple revele"><span class="statut statut--disponible">Formule Professionnel</span><h3>Le site de services</h3><p>Une page par service, un formulaire de devis qui pose les bonnes questions et un référencement local structuré. Le choix le plus fréquent pour une PME.</p><p class="prix-ligne">${formatPrix(creation[1].prix)} <small>taxes en sus</small></p></article>
      <article class="carte-simple revele"><span class="statut statut--etude">Formule Sur mesure</span><h3>Le site de conversion</h3><p>Pages par secteur ou par région de service, estimateur, formulaires en plusieurs étapes, intégrations. Pour les entreprises qui prospectent activement.</p><p class="prix-ligne">dès ${formatPrix(creation[2].prix)} <small>taxes en sus</small></p></article>
    </div>
  </div>
</section>

<section class="section section--blanc" id="formules" aria-labelledby="titre-formules">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Formules")}
      <h2 id="titre-formules">Ce qui est inclus, noir sur blanc.</h2>
      <p class="intro">Chaque formule précise le nombre de pages, de révisions, le délai et les étapes de paiement. Pas d'« illimité » qui cache des limites.</p>
    </div>
    ${grilleCreation({ complet: true })}
    <p class="note-prix">Prix en dollars canadiens, taxes en sus le cas échéant. Besoin d'une page de plus, d'un formulaire avancé ou d'une prise de rendez-vous ? <a href="/services-complementaires/">Voir les options</a> ou <a href="/tarifs/#estimateur">estimer votre projet</a>.</p>
    <div class="mt-6">${promosHTML({ ids: ["lancement", "creation-entretien"] })}</div>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-base">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Dans chaque site, sans supplément")}
      <h2 id="titre-base">Les fondations ne sont pas des options.</h2>
    </div>
    <div class="deux-colonnes">
      <ul class="liste-coches">
        <li><span><strong>Pensé d'abord pour le téléphone.</strong> Textes lisibles sans zoom, boutons faciles à toucher, formulaires simples à remplir.</span></li>
        <li><span><strong>Rapide.</strong> Images optimisées, polices hébergées sur le site, aucun outil lourd inutile. Nous mesurons la vitesse avant la mise en ligne.</span></li>
        <li><span><strong>Un formulaire qui ne perd rien.</strong> Chaque demande est enregistrée, vous êtes averti par courriel, et le visiteur reçoit une confirmation honnête.</span></li>
        <li><span><strong>Boutons d'appel, de courriel ou WhatsApp</strong> selon votre façon de travailler.</span></li>
      </ul>
      <ul class="liste-coches">
        <li><span><strong>Référencement de base.</strong> Titres, descriptions, plan du site, données structurées : Google comprend qui vous êtes et ce que vous offrez.</span></li>
        <li><span><strong>Sécurité.</strong> HTTPS, en-têtes de sécurité, protection contre les envois automatisés.</span></li>
        <li><span><strong>Conformité québécoise.</strong> Site en français, politique de confidentialité, aucun témoin de suivi sans consentement (Loi 25).</span></li>
        <li><span><strong>Accessibilité.</strong> Contrastes, navigation au clavier, textes alternatifs, selon les critères WCAG 2.1 AA visés.</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-fournir">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>
        ${surtitre("Pour démarrer")}
        <h2 id="titre-fournir">Ce qu'il nous faut de votre part.</h2>
        <p class="texte-secondaire mt-4">Le calendrier démarre à la réception de votre contenu complet. Nous vous envoyons une liste simple après l'appel découverte.</p>
      </div>
      <ol class="liste-etapes">
        <li><span><strong>Votre logo</strong> (idéalement en SVG ou PDF). Pas de logo ? Nous pouvons composer un logotype typographique simple (sur devis) ou vous orienter vers un graphiste.</span></li>
        <li><span><strong>Vos services et vos zones desservies</strong>, même en notes : nous les mettons en forme.</span></li>
        <li><span><strong>De vraies photos</strong> de votre travail, de votre équipe ou de vos locaux. Elles font plus pour la confiance que n'importe quelle image de banque. Nous fournissons une liste de prises de vue.</span></li>
        <li><span><strong>Vos numéros de licence ou de permis</strong> s'ils doivent être affichés (par exemple la licence RBQ).</span></li>
        <li><span><strong>Un accès à votre nom de domaine</strong>, ou nous vous aidons à en réserver un à votre nom.</span></li>
        <li><span><strong>Une personne qui valide</strong> les étapes, pour éviter les allers-retours.</span></li>
      </ol>
    </div>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-processus-c">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Déroulement")}
      <h2 id="titre-processus-c">De l'appel à la mise en ligne.</h2>
    </div>
    ${processus()}
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-limites">
  <div class="conteneur">
    <div class="deux-colonnes">
      <div>
        ${surtitre("Limites, dites franchement")}
        <h2 id="titre-limites">Ce que les formules ne couvrent pas.</h2>
      </div>
      <ul class="liste-moins">
        <li>Les boutiques en ligne avec catalogue, stocks et paiement : elles demandent une étude préalable et un devis séparé.</li>
        <li>La création d'une identité visuelle complète (logo, charte graphique) : nous travaillons avec votre logo existant ou un logotype simple.</li>
        <li>Les séances photo et vidéo : nous vous indiquons quoi photographier, ou nous coordonnons avec un photographe sur devis.</li>
        <li>Les frais d'hébergement, de nom de domaine et de licences d'outils tiers, payés directement par vous à votre nom.</li>
        <li>La version anglaise du site, chiffrée sur devis. La version française reste toujours au moins aussi complète.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-faq-c">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Questions fréquentes")}<h2 id="titre-faq-c">Avant de vous lancer.</h2></div>
    ${faq(FAQ_CREATION)}
  </div>
</section>

${appelFinal({ titre: "Votre futur site commence par un appel de 30 minutes." })}
`;

export default {
  chemin: "/creation-site-web/",
  titre: "Création de site web pour PME au Québec, dès 1 490 $",
  description: "Création de sites web professionnels pour PME et entrepreneurs du Québec : mobile d'abord, rapides, formulaire de devis. Formules dès 1 490 $, périmètre écrit.",
  navActif: "creation",
  cta: { href: "/contact/?type=creation", libelle: "Créer mon site web" },
  corps,
  jsonld: [
    jsonldService({ nom: "Création de sites web", description: "Conception et développement de sites web professionnels pour PME.", chemin: "/creation-site-web/", offres: creation }),
    jsonldAriane(ARIANE),
    faqJsonLd(FAQ_CREATION),
  ],
};
