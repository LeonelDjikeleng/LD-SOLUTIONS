import { creation, amelioration, maintenance, options, promotions, formatPrix, promotionActive, TAUX_HORAIRE } from "../content/offres.mjs";
import { site } from "../content/site.config.mjs";
import {
  heroPage, surtitre, fleche, grilleCreation, grilleMaintenance, carteAmelioration, tableauOptions,
  promosHTML, faq, faqJsonLd, appelFinal, jsonldAriane, jsonldOrganisation,
} from "../composants.mjs";
import { esc } from "../gabarit.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Tarifs", href: "/tarifs/" }];
const lancement = promotions.find((p) => p.id === "lancement");
const lancementActif = lancement && promotionActive(lancement);

export const FAQ_PRIX = [
  { q: "Pourquoi ne pas proposer un site à 500 $ ?", r: "<p>À ce prix, un site se résume à un gabarit rempli rapidement, sans réflexion sur vos clients ni vérification du formulaire. Nos prix rémunèrent la conception, les tests et la mise en ligne. Si votre budget est serré, la formule Départ résout l'essentiel et peut évoluer ensuite.</p>" },
  { q: "Le prix peut-il changer en cours de projet ?", r: "<p>Le prix écrit dans le devis signé est fixe pour le périmètre décrit. Il ne change que si vous demandez quelque chose de nouveau (une page, une fonction) : nous vous envoyons alors un avenant chiffré, que vous acceptez ou non, avant tout travail.</p>" },
  { q: "Puis-je payer en plusieurs fois ?", r: "<p>Oui : chaque formule est payée en 2 ou 3 étapes liées à l'avancement (signature, maquette, mise en ligne). Paiement par virement Interac ou par lien de paiement sécurisé. Aucune carte bancaire n'est conservée par LD SOLUTIONS.</p>" },
  { q: "Les taxes sont-elles incluses ?", r: "<p>Non : les prix sont affichés avant taxes. La TPS et la TVQ s'ajoutent si LD SOLUTIONS y est inscrite au moment de la facturation ; le devis indique toujours le montant total exact.</p>" },
  { q: "Pourquoi ne puis-je pas payer directement sur le site ?", r: "<p>Parce qu'un site se construit avec votre contenu et vos objectifs : un appel de 30 minutes et un devis écrit évitent les malentendus. Vous payez après avoir signé un document qui décrit précisément ce que vous recevez.</p>" },
];

const optEstimateur = options.filter((o) => o.estimateur);
const parPage = new Set(["page-sup", "page-redigee", "redaction"]);

const estimateur = `
<div class="estimateur" data-estimateur ${lancementActif ? `data-promo-pct="${lancement.pourcentage}" data-promo-fin="${lancement.finLe}"` : ""}>
  <div class="estimateur__choix">
    <fieldset class="formulaire">
      <legend>1. La formule de base</legend>
      <div class="estimateur__bases">
        ${creation.map((o, i) => `<div class="base-choix"><input type="radio" name="base" id="est-${o.id}" value="${o.id}" data-prix="${o.prix}" data-nom="${esc(o.nom)}"${o.recommande ? " checked" : ""}><label for="est-${o.id}"><b>${esc(o.nom)}</b><span>${o.prefixe ? "dès " : ""}${formatPrix(o.prix)}</span></label></div>`).join("")}
      </div>
    </fieldset>
    <fieldset class="formulaire">
      <legend>2. Les options utiles <span class="facultatif">(facultatif)</span></legend>
      <div>
        ${optEstimateur.map((o) => `<div class="option-ligne">
          <input type="checkbox" id="est-opt-${o.id}" data-option data-prix="${o.prix}" data-nom="${esc(o.nom.split(" (")[0])}">
          <label for="est-opt-${o.id}">${esc(o.nom)}${o.statut === "etude" ? " <span class=\"facultatif\">(prix minimal, confirmé après étude)</span>" : ""}</label>
          ${parPage.has(o.id) ? `<label class="visuellement-cache" for="qte-${o.id}">Nombre de pages pour ${esc(o.nom)}</label><input class="qte" type="number" id="qte-${o.id}" min="1" max="20" value="1" inputmode="numeric" data-qte-pour="est-opt-${o.id}" disabled>` : `<span class="prix-o">${o.prefixe ? "dès " : ""}${formatPrix(o.prix)}</span>`}
        </div>`).join("")}
      </div>
    </fieldset>
    <fieldset class="formulaire">
      <legend>3. L'entretien après la mise en ligne <span class="facultatif">(facultatif, facturé au mois)</span></legend>
      <div class="cases">
        <label class="case"><input type="radio" name="maintenance" value="" data-prix="0" checked><span>Pas de maintenance pour l'instant</span></label>
        ${maintenance.map((m) => `<label class="case"><input type="radio" name="maintenance" value="${m.id}" data-prix="${m.prixMois}" data-nom="${esc(m.nom)}"><span>Maintenance ${esc(m.nom)} · ${formatPrix(m.prixMois)} par mois</span></label>`).join("")}
      </div>
    </fieldset>
  </div>
  <aside class="estimateur__total" aria-live="polite" aria-label="Estimation">
    <small>Estimation du projet, avant taxes</small>
    <span class="estimateur__montant" data-total>${formatPrix(creation[1].prix)}</span>
    <p class="estimateur__detail" data-detail></p>
    <p class="estimateur__detail" data-promo hidden></p>
    <p class="estimateur__detail" data-maintenance></p>
    <a class="bouton" href="/contact/?type=creation" data-lien-devis data-evenement="clic_devis">Demander un devis avec cette sélection ${fleche}</a>
    <small>Estimation indicative : le devis écrit, après notre appel, fait foi.</small>
  </aside>
</div>
<p class="texte-secondaire" data-estimateur-sans-js hidden>L'estimateur interactif nécessite JavaScript. Tous les prix sont détaillés ci-dessous, et vous pouvez <a href="/contact/?type=creation">demander un devis</a> directement.</p>`;

const comparatif = `
<details class="comparatif-details"><summary>Comparer les trois formules point par point</summary>
<table class="comparatif mt-5">
  <caption class="visuellement-cache">Comparer les formules de création</caption>
  <thead><tr><th scope="col">Élément</th>${creation.map((o) => `<th scope="col">${esc(o.nom)}</th>`).join("")}</tr></thead>
  <tbody>
    ${[
      ["Prix (taxes en sus)", (o) => `${o.prefixe ? "dès " : ""}${formatPrix(o.prix)}`],
      ["Pages", (o) => ({ depart: "Jusqu'à 3", professionnel: "Jusqu'à 7", "sur-mesure": "8 à 15" })[o.id]],
      ["Design", (o) => ({ depart: "Adapté à votre identité", professionnel: "Maquette d'accueil validée", "sur-mesure": "Direction artistique complète" })[o.id]],
      ["Textes", (o) => ({ depart: "Révision et mise en forme", professionnel: "Rédaction incluse", "sur-mesure": "Rédaction incluse" })[o.id]],
      ["Formulaire", (o) => ({ depart: "Demande simple", professionnel: "Devis qualifié", "sur-mesure": "Plusieurs étapes, estimateur" })[o.id]],
      ["Référencement", (o) => ({ depart: "Base technique", professionnel: "Local par service", "sur-mesure": "Pages par secteur ou région" })[o.id]],
      ["Révisions", (o) => o.revisions],
      ["Délai", (o) => o.delai],
      ["Paiement", (o) => o.paiement],
      ["Corrections après", (o) => o.garantie],
    ].map(([lib, f]) => `<tr><th scope="row">${esc(lib)}</th>${creation.map((o) => `<td data-label="${esc(o.nom)}">${esc(f(o))}</td>`).join("")}</tr>`).join("")}
  </tbody>
</table></details>`;

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "Tarifs",
  titre: "Tous nos prix, avant même de nous parler.",
  intro: "Création, amélioration, maintenance, options : tout est ici, avec ce qui est inclus et ce qui ne l'est pas. Estimez votre projet en une minute, puis demandez un devis qui reprend ces montants.",
  boutons: `<a class="bouton" href="#estimateur">Estimer mon projet ${fleche}</a><a class="bouton bouton--contour" href="#creation">Voir les formules</a>`,
})}

<section class="section section--clair" id="creation" aria-labelledby="titre-t-creation">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Création de sites")}<h2 id="titre-t-creation">Trois formules, un périmètre précis.</h2></div>
    ${grilleCreation()}
    ${comparatif}
  </div>
</section>

<section class="section section--blanc" id="estimateur" aria-labelledby="titre-estimateur">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Estimateur")}<h2 id="titre-estimateur">Votre projet, chiffré en une minute.</h2><p class="intro">Choisissez une base, ajoutez ce qui vous sert : le total s'ajuste. Le bouton transmet votre sélection avec votre demande.</p></div>
    ${estimateur}
  </div>
</section>

<section class="section section--clair" id="amelioration" aria-labelledby="titre-t-amelioration">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Amélioration et refonte")}<h2 id="titre-t-amelioration">Pour les sites qui existent déjà.</h2></div>
    <div class="offres offres--3">${amelioration.slice(0, 3).map(carteAmelioration).join("")}</div>
    <div class="offres offres--2 mt-5">${amelioration.slice(3).map(carteAmelioration).join("")}</div>
  </div>
</section>

<section class="section section--blanc" id="maintenance" aria-labelledby="titre-t-maintenance">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Maintenance")}<h2 id="titre-t-maintenance">L'entretien, au mois ou à l'année.</h2><p class="intro">Sans durée minimale, préavis de 30 jours. Paiement annuel : 12 mois pour le prix de 10.</p></div>
    ${grilleMaintenance({ complet: false })}
    <p class="mt-6"><a class="lien-fleche" href="/maintenance/">Le détail de ce qui est inclus et exclu ${fleche}</a></p>
  </div>
</section>

<section class="section section--clair" id="options" aria-labelledby="titre-t-options">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Options")}<h2 id="titre-t-options">À ajouter selon vos besoins.</h2></div>
    ${tableauOptions()}
    <p class="note-prix">Assistance hors forfait : ${TAUX_HORAIRE} $ l'heure, par tranche de 15 minutes, toujours approuvée avant le travail.</p>
  </div>
</section>

<section class="section section--sombre" id="promotions" aria-labelledby="titre-t-promos">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Avantages en cours")}<h2 id="titre-t-promos">Des avantages réels, avec leurs conditions.</h2><p class="intro">Pas de prix barré inventé ni de compte à rebours : chaque avantage indique sa valeur, ses conditions et, s'il y a lieu, sa date de fin réelle.</p></div>
    ${promosHTML()}
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-modalites">
  <div class="conteneur">
    <div class="deux-colonnes">
      <div>${surtitre("Modalités")}<h2 id="titre-modalites">Comment se passent les paiements.</h2></div>
      <ul class="liste-coches">
        <li><span>Prix en dollars canadiens, <strong>avant taxes</strong>. TPS et TVQ ajoutées si applicables ; le devis indique le total exact.</span></li>
        <li><span>Paiement par étapes liées à l'avancement : 50/50 (Départ), 40/40/20 (Professionnel), 30/40/30 (Sur mesure).</span></li>
        <li><span>${esc(site.paiement)}. Factures payables sous 15 jours.</span></li>
        <li><span>Devis valable 30 jours. Le prix signé ne change pas sans avenant accepté par vous.</span></li>
        <li><span>Le site vous est cédé au paiement complet. Détails dans nos <a href="/conditions-de-service/">conditions de service</a>.</span></li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-faq-t">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Questions sur les prix")}<h2 id="titre-faq-t">Ce que l'on nous demande souvent.</h2></div>
    ${faq(FAQ_PRIX)}
  </div>
</section>

${appelFinal()}
`;

export default {
  chemin: "/tarifs/",
  titre: "Tarifs : création de site web, refonte, maintenance",
  description: "Tous les prix de LD SOLUTIONS : sites web dès 1 490 $, audit 390 $, maintenance dès 49 $ par mois. Estimateur en ligne, périmètres écrits, taxes en sus.",
  navActif: "tarifs",
  cta: { href: "#estimateur", libelle: "Estimer mon projet", evenement: "clic_offre" },
  estimateur: true,
  corps,
  jsonld: [jsonldOrganisation(), jsonldAriane(ARIANE), faqJsonLd(FAQ_PRIX)],
};
