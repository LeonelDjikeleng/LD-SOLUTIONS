// Réalisations : le portfolio. La première réalisation est le site lui-même ; les projets clients
// s'ajouteront ici, avec l'accord écrit de chaque client. Aucune réalisation n'est inventée.
import { heroPage, surtitre, fleche, appelFinal, defilant, jsonldAriane } from "../composants.mjs";
import { DEMOS } from "../composants.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Réalisations", href: "/realisations/" }];
const ARIANE_ETUDE = [...ARIANE, { nom: "Mon propre site", href: "/realisations/site-leonel-djikeleng/" }];
const IMG = "/assets/img/realisations";

// Mesures réelles du 10 octobre 2026 (docs/06-rapport-tests.md) : Lighthouse 12.8 mobile, 4G simulée, serveur local.
const MESURES = [
  { valeur: "100", libelle: "Accessibilité", detail: "Lighthouse, toutes les pages mesurées" },
  { valeur: "93–100", libelle: "Performance mobile", detail: "Accueil 93 à 100 selon la mesure ; Tarifs et Contact 100" },
  { valeur: "1,3 s", libelle: "Affichage du contenu principal", detail: "1,3 à 1,4 s sur un réseau 4G simulé" },
  { valeur: "60 Ko", libelle: "Poids d'une page", detail: "Polices et scripts compris" },
  { valeur: "44", libelle: "Tests automatisés", detail: "29 côté serveur, 15 parcours dans un vrai navigateur" },
  { valeur: "0", libelle: "Témoin de suivi", detail: "Mesure d'audience anonyme, sans bandeau de consentement" },
];

const VERSIONS = [
  { n: "v1", titre: "Version 1 · « Tech » sombre", texte: "Efficace, mais trop proche des sites générés en série : fond presque noir, cyan, orange.", statut: "Écartée" },
  { n: "v2", titre: "Version 2 · Le plan d'architecte", texte: "Forte personnalité, mais chargée : de 32 à 61 % de la surface en bleu foncé, jusqu'à 95 textes en majuscules par page.", statut: "Écartée" },
  { n: "v3", titre: "Version 3 · Le sur-mesure", texte: "Blanc dominant, vert sapin, une seule police. Calme, lisible, haut de gamme.", statut: "Retenue" },
];

const capture = (n, alt, { chargement = "lazy" } = {}) =>
  `<img src="${IMG}/site-${n}-mobile.webp" width="600" height="1298" alt="${alt}" loading="${chargement}" decoding="async">`;

/* ---------- Page portfolio ---------- */
const index = {
  chemin: "/realisations/",
  titre: "Réalisations : sites web conçus et livrés",
  description: "Les réalisations de Leonel Djikeleng : son propre site, étudié en détail avec des mesures réelles, et trois démonstrations pour des entreprises fictives.",
  navActif: "realisations",
  corps: `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "Réalisations",
  titre: "Le travail, montré tel qu'il est.",
  intro: "L'entreprise démarre : ma première réalisation est mon propre site, conçu avec la même méthode que celle que je vous propose. Les projets clients s'ajouteront ici, toujours avec leur accord.",
})}

<section class="section section--blanc" aria-labelledby="titre-projets">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Projets")}
      <h2 id="titre-projets">Une réalisation, trois démonstrations.</h2>
    </div>
    <div class="projets">
      <a class="projet projet--vedette" href="/realisations/site-leonel-djikeleng/">
        <div class="projet__visuel">
          <img src="${IMG}/site-v3-bureau.webp" width="1200" height="750" alt="Page d'accueil du site de Leonel Djikeleng sur ordinateur : titre « Un site web qui travaille pendant que vous travaillez » et démonstration au téléphone." loading="lazy" decoding="async">
        </div>
        <div class="projet__texte">
          <span class="projet__k">Réalisation 01 · Site vitrine et demandes de devis</span>
          <h3>Mon propre site</h3>
          <p>Trois directions visuelles, un estimateur de prix, quatre formulaires, une administration. Toutes les mesures sont publiées.</p>
          <span class="lien-fleche">Lire l'étude de cas ${fleche}</span>
        </div>
      </a>
      <a class="projet" href="/demonstrations/">
        <div class="projet__texte">
          <span class="projet__k">Démonstrations · Entreprises fictives</span>
          <h3>${DEMOS.map((d) => d.nom).join(", ")}</h3>
          <p>Trois maquettes pour des métiers différents, avec les choix de conception expliqués. Les entreprises n'existent pas, et c'est indiqué.</p>
          <span class="lien-fleche">Voir les démonstrations ${fleche}</span>
        </div>
      </a>
      <a class="projet projet--vide" href="/contact/?type=creation" data-evenement="clic_devis">
        <div class="projet__texte">
          <span class="projet__k">Réalisation 02</span>
          <h3>Votre projet ?</h3>
          <p>Les premiers clients bénéficient de l'offre de lancement, en échange de leur accord pour présenter leur site ici.</p>
          <span class="lien-fleche">Demander un devis ${fleche}</span>
        </div>
      </a>
    </div>
  </div>
</section>

${appelFinal()}`,
  jsonld: [jsonldAriane(ARIANE)],
};

/* ---------- Étude de cas : le site lui-même ---------- */
const etude = {
  chemin: "/realisations/site-leonel-djikeleng/",
  titre: "Étude de cas : mon propre site web",
  description: "Comment le site de Leonel Djikeleng a été conçu : diagnostic, trois directions visuelles, fonctions construites et résultats mesurés (Lighthouse, poids, tests).",
  navActif: "realisations",
  corps: `
${heroPage({
  arianeItems: ARIANE_ETUDE,
  surtitreTexte: "Réalisation 01",
  titre: "Mon propre site, construit comme celui d'un client.",
  intro: "Avant de vous proposer un site, j'ai construit le mien avec la même méthode : diagnostic chiffré, trois directions visuelles, tests automatisés et mesures publiées. Voici ce qui a été fait, et les vrais chiffres.",
  boutons: `<a class="bouton" href="/contact/?type=creation" data-evenement="clic_devis">Le même soin pour mon site ${fleche}</a>`,
})}

<section class="section section--blanc section--compacte" aria-labelledby="titre-fiche">
  <div class="conteneur">
    <h2 id="titre-fiche" class="visuellement-cache">Fiche du projet</h2>
    <dl class="fiche-projet">
      <div><dt>Client</dt><dd>Leonel Djikeleng (moi-même)</dd></div>
      <div><dt>Type</dt><dd>Site vitrine avec demandes de devis</dd></div>
      <div><dt>Ampleur</dt><dd>Une vingtaine de pages, 4 parcours de demande</dd></div>
      <div><dt>Livré</dt><dd>Octobre 2026</dd></div>
    </dl>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-depart">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div class="entete-section">
        ${surtitre("Le point de départ")}
        <h2 id="titre-depart">Inspirer confiance sans rien inventer.</h2>
      </div>
      <div class="prose">
        <p>Une entreprise qui démarre n'a ni avis clients, ni logos à montrer. Le site devait pourtant rassurer en quelques secondes, sur un téléphone, des entrepreneurs qui comparent plusieurs prestataires.</p>
        <p>Trois règles ont guidé chaque choix :</p>
        <ul class="liste-coches">
          <li><span><strong>Tout afficher</strong> : les prix, ce qui est inclus et ce qui ne l'est pas.</span></li>
          <li><span><strong>Ne rien inventer</strong> : aucun faux témoignage, aucun chiffre gonflé, aucune fausse urgence.</span></li>
          <li><span><strong>Rendre la demande évidente</strong> : un geste pour demander un devis ou appeler, depuis n'importe quelle page.</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-directions">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Trois directions, une seule retenue")}
      <h2 id="titre-directions">Le design a été refait deux fois.</h2>
      <p class="intro">Chaque version a été mesurée sur téléphone avant d'être gardée ou écartée. Captures recréées à partir du code de chaque version, avec le nom actuel.</p>
    </div>
    ${defilant(VERSIONS.map((v) => `<figure class="version${v.statut === "Retenue" ? " version--retenue" : ""}">
      <div class="version__ecran">${capture(v.n, `${v.titre} : page d'accueil sur téléphone.`)}</div>
      <figcaption><span class="version__statut">${v.statut}</span><strong>${v.titre}</strong>${v.texte}</figcaption>
    </figure>`).join(""), VERSIONS.length, "Versions successives du design", "versions")}
    <p class="mt-6"><a class="lien-fleche" href="/realisations/site-leonel-djikeleng/#titre-methode-r">Comment j'ai tranché ${fleche}</a></p>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-construit">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Ce qui a été construit")}
      <h2 id="titre-construit">Plus qu'une vitrine : un outil de travail.</h2>
    </div>
    <ul class="grille-cartes grille-cartes--3">
      <li class="carte-simple"><h3>Estimateur de prix</h3><p>Le visiteur choisit une formule et des options : le total s'ajuste en direct et accompagne sa demande.</p></li>
      <li class="carte-simple"><h3>Quatre parcours de demande</h3><p>Création, amélioration, maintenance ou simple question : chaque formulaire ne pose que les questions utiles.</p></li>
      <li class="carte-simple"><h3>Demandes vraiment enregistrées</h3><p>Chaque demande est conservée avec un numéro de référence. En cas d'échec, le site le dit et propose le courriel.</p></li>
      <li class="carte-simple"><h3>Administration</h3><p>Un espace protégé pour suivre les demandes, de « nouvelle » à « gagnée », depuis un téléphone.</p></li>
      <li class="carte-simple"><h3>Sauvegardes vérifiées</h3><p>Une sauvegarde quotidienne, contrôlée et restaurable, avec retour arrière automatique en cas de mise à jour ratée.</p></li>
      <li class="carte-simple"><h3>Conformité québécoise</h3><p>Site en français, politique de confidentialité (Loi 25), aucun témoin de suivi, accessibilité visée WCAG 2.1 AA.</p></li>
    </ul>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-resultats">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Résultats mesurés")}
      <h2 id="titre-resultats">Les chiffres, sans arrondi flatteur.</h2>
    </div>
    <ul class="chiffres">${MESURES.map((m) => `<li><b>${m.valeur}</b><span>${m.libelle}</span><small>${m.detail}</small></li>`).join("")}</ul>
    <p class="note-prix">Mesures du 10 octobre 2026 avec Lighthouse 12.8 (mode mobile, réseau 4G simulé), sur un serveur de test. Elles seront refaites une fois le site en ligne, sur l'hébergement réel.</p>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-methode-r">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">
      ${surtitre("La méthode")}
      <h2 id="titre-methode-r">La même méthode pour votre site.</h2>
    </div>
    <ol class="liste-etapes">
      <li><span><strong>Diagnostic chiffré</strong> : couleurs, typographie, encombrement, navigation au pouce et mouvement, mesurés sur un vrai téléphone.</span></li>
      <li><span><strong>Directions visuelles</strong> : une proposition argumentée, ajustée avec vous jusqu'à la bonne.</span></li>
      <li><span><strong>Construction testée</strong> : chaque parcours de demande est vérifié automatiquement avant la mise en ligne.</span></li>
      <li><span><strong>Mesures à la remise</strong> : vitesse, accessibilité et référencement, chiffres à l'appui.</span></li>
    </ol>
  </div>
</section>

${appelFinal({ titre: "Votre site mérite la même attention." })}`,
  jsonld: [jsonldAriane(ARIANE_ETUDE)],
};

export default [index, etude];
