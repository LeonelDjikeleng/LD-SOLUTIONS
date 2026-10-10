import { site } from "../content/site.config.mjs";
import { heroPage, surtitre, fleche, processus, engagements, appelFinal, jsonldAriane } from "../composants.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "À propos", href: "/a-propos/" }];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "À propos",
  titre: "Un partenaire web, pas un fournisseur de pages.",
  intro: "LD SOLUTIONS accompagne les PME, les entrepreneurs et les travailleurs autonomes dans la création, l'amélioration et l'entretien de leur site web. Notre mesure du succès est simple : votre site vous aide-t-il à obtenir des clients ?",
  boutons: `<a class="bouton" href="/contact/?type=discussion" data-evenement="clic_devis">Discuter de mon projet ${fleche}</a>`,
})}

<section class="section section--clair" aria-labelledby="titre-approche">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>${surtitre("Notre approche")}<h2 id="titre-approche">Le site au service de la vente.</h2></div>
      <div class="prose">
        <p>Un site d'entreprise n'est pas une brochure. C'est souvent le premier contact entre vous et un futur client, et parfois le seul avant qu'il choisisse quelqu'un d'autre. Nous le concevons donc à partir de trois questions : qui sont vos clients, qu'est-ce qui les fait hésiter, et quelle action doivent-ils faire ensuite ?</p>
        <p>Le design, la vitesse, le référencement et la conformité découlent de ces réponses. Un beau site qui ne génère aucune demande n'a pas fait son travail ; un site efficace mais négligé finit par perdre la confiance de ses visiteurs. Nous visons les deux.</p>
        <p>Nous travaillons aussi dans la durée : un site se crée, s'améliore et s'entretient. C'est pourquoi nos trois activités forment un seul service, avec un seul interlocuteur.</p>
      </div>
    </div>
  </div>
</section>

${site.exploitant ? `<section class="section section--blanc section--compacte" aria-labelledby="titre-qui">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>${surtitre("Qui est derrière LD SOLUTIONS")}<h2 id="titre-qui">Un seul interlocuteur, du premier appel à l'entretien.</h2></div>
      <div class="prose">
        <p>LD SOLUTIONS est l'entreprise de ${site.exploitant}. Vous travaillez directement avec la personne qui conçoit, construit et entretient votre site : pas d'intermédiaire, pas de transfert de dossier entre plusieurs équipes.</p>
        <p>Ce fonctionnement a une conséquence pratique : le nombre de projets menés en même temps est limité, pour que chaque demande reçoive une réponse sous 2 jours ouvrables et que chaque site soit testé avant sa mise en ligne.</p>
      </div>
    </div>
  </div>
</section>` : ""}

<section class="section section--sombre" aria-labelledby="titre-principes">
  <div class="hero__fond grille-plan grille-plan--fondu" aria-hidden="true"></div>
  <div class="conteneur">
    <div class="entete-section">${surtitre("Nos principes")}<h2 id="titre-principes">Quatre règles que nous ne négocions pas.</h2></div>
    <div class="grille-cartes">
      <article class="carte-simple revele"><h3>Clarté</h3><p>Un visiteur doit comprendre en cinq secondes ce que vous faites et quoi faire ensuite. Nos devis suivent la même règle : périmètre, prix, délais, sans zone grise.</p></article>
      <article class="carte-simple revele"><h3>Vitesse</h3><p>Un effet visuel qui ralentit le téléphone de vos clients n'est pas premium. Nous mesurons la vitesse et nous arbitrons en faveur de l'expérience.</p></article>
      <article class="carte-simple revele"><h3>Vérité</h3><p>Aucun faux avis, aucune statistique inventée, aucune garantie impossible, sur votre site comme sur le nôtre. La confiance se construit sur ce qui est vérifiable.</p></article>
      <article class="carte-simple revele"><h3>Propriété</h3><p>Votre nom de domaine, votre hébergement et votre site sont à vous. Vous pouvez partir quand vous voulez, avec tout ce qui vous appartient.</p></article>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-engagements-ap">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Engagements")}<h2 id="titre-engagements-ap">Ce que vous pouvez vérifier.</h2></div>
    ${engagements()}
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-methode-ap">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Méthode")}<h2 id="titre-methode-ap">Comment nous travaillons ensemble.</h2></div>
    ${processus()}
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-pas">
  <div class="conteneur">
    <div class="deux-colonnes">
      <div>${surtitre("Ce que nous refusons")}<h2 id="titre-pas">Ce que vous ne verrez jamais chez nous.</h2></div>
      <ul class="liste-moins">
        <li>Des avis, des témoignages ou des logos de clients inventés.</li>
        <li>Une « première position sur Google » promise.</li>
        <li>Des frais cachés révélés après la signature.</li>
        <li>Un site ou un nom de domaine enregistré à notre nom pour vous retenir.</li>
        <li>Des témoins de suivi installés sur votre site sans le consentement de vos visiteurs.</li>
        <li>Des pages remplies de mots-clés pour tromper les moteurs de recherche.</li>
      </ul>
    </div>
  </div>
</section>

${appelFinal()}
`;

export default {
  chemin: "/a-propos/",
  titre: "À propos de LD SOLUTIONS",
  description: "LD SOLUTIONS crée, améliore et entretient des sites web pour les PME du Québec. Notre approche, nos principes et nos engagements vérifiables.",
  navActif: "a-propos",
  cta: { href: "/contact/?type=discussion", libelle: "Discuter de mon projet" },
  corps,
  jsonld: [jsonldAriane(ARIANE)],
};
