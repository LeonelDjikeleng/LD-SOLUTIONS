import { TAUX_HORAIRE, TAUX_URGENCE } from "../content/offres.mjs";
import { heroPage, surtitre, fleche, tableauOptions, appelFinal, jsonldAriane } from "../composants.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Services complémentaires", href: "/services-complementaires/" }];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "Options et intégrations",
  titre: "Les compléments utiles, rien de superflu.",
  intro: "Référencement local, prise de rendez-vous, formulaires avancés, automatisations : ajoutés seulement quand ils servent votre objectif. Nous distinguons ce qui a un prix fixe de ce qui demande une étude.",
  boutons: `<a class="bouton" href="/contact/?type=discussion" data-evenement="clic_devis">Discuter de mon projet ${fleche}</a><a class="bouton bouton--contour" href="/tarifs/#estimateur">Estimer avec les options</a>`,
})}

<section class="section section--clair" aria-labelledby="titre-services">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Ce que nous proposons")}
      <h2 id="titre-services">Quatre familles de services.</h2>
    </div>
    <div class="grille-cartes">
      <article class="carte-simple revele"><span class="statut statut--disponible">Disponible</span><h3>Référencement local</h3><p>Configuration de votre fiche Google Business Profile et de Google Search Console, recherche des mots que vos clients tapent vraiment, pages par service. Nous ne promettons aucune position : nous mettons en place ce qui aide Google à vous comprendre.</p></article>
      <article class="carte-simple revele"><span class="statut statut--disponible">Disponible</span><h3>Prise de contact facilitée</h3><p>Bouton d'appel, de courriel ou WhatsApp (inclus), intégration de votre outil de rendez-vous en ligne, formulaires en plusieurs étapes qui posent les bonnes questions selon la demande.</p></article>
      <article class="carte-simple revele"><span class="statut statut--etude">Après étude</span><h3>Automatisations simples</h3><p>Exemple : chaque demande reçue alimente un tableau de suivi et déclenche un courriel de confirmation. Nous vérifions d'abord que l'automatisation vous fait gagner du temps et que les outils choisis respectent vos obligations (Loi 25).</p></article>
      <article class="carte-simple revele"><span class="statut statut--etude">Après étude</span><h3>Intégrations de services tiers</h3><p>Gestion de la relation client, infolettre, paiement en ligne. Chiffré après une étude, parce que tout dépend de l'outil, de son prix et de l'endroit où il conserve vos données.</p></article>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-grille-options">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">
      ${surtitre("Prix")}
      <h2 id="titre-grille-options">Grille des options.</h2>
      <p class="intro">Montants avant taxes. Les options « après étude » sont chiffrées par écrit avant tout travail.</p>
    </div>
    ${tableauOptions()}
    <div class="deux-colonnes mt-7">
      <div class="carte-simple"><h3>Assistance hors forfait</h3><p>${TAUX_HORAIRE} $ l'heure, facturée par tranche de 15 minutes, estimée et approuvée par vous avant le début du travail.</p></div>
      <div class="carte-simple"><h3>Intervention urgente</h3><p>${TAUX_URGENCE} $ l'heure, minimum 1 heure, en dehors des heures ouvrables et selon disponibilité. Aucun délai n'est garanti en dehors d'une formule de maintenance.</p></div>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-principe">
  <div class="conteneur conteneur--etroit">
    ${surtitre("Notre principe")}
    <h2 id="titre-principe">Pas de supplément artificiel.</h2>
    <p class="texte-secondaire mt-4">Ce qui est essentiel au fonctionnement d'un site professionnel (affichage mobile, formulaire qui fonctionne, HTTPS, référencement de base, politique de confidentialité) est inclus dans chaque formule de création. Les options ci-dessus répondent à des besoins réels mais particuliers. Si une option ne vous apporte rien, nous vous le dirons.</p>
  </div>
</section>

${appelFinal()}
`;

export default {
  chemin: "/services-complementaires/",
  titre: "Options : SEO local, rendez-vous, automatisations",
  description: "Options pour votre site web : référencement local, Google Business Profile, prise de rendez-vous, formulaires avancés, automatisations. Prix fixes ou après étude.",
  navActif: "services",
  cta: { href: "/contact/?type=discussion", libelle: "Discuter de mon projet" },
  corps,
  jsonld: [jsonldAriane(ARIANE)],
};
