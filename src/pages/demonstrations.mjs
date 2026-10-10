import { heroPage, surtitre, fleche, DEMOS, appelFinal, jsonldAriane } from "../composants.mjs";
import { esc } from "../gabarit.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Démonstrations", href: "/demonstrations/" }];

const CHOIX = {
  toiture: [
    "Le titre parle de la saison (« avant l'hiver ») : c'est le moment où la demande se décide.",
    "La promesse est vérifiable : soumission écrite en 48 h, garantie détaillée. Pas de « meilleur prix garanti ».",
    "Bande hachurée jaune et marine : le vocabulaire visuel du chantier, sans photo de banque.",
    "Licence RBQ prévue en évidence : au Québec, c'est un critère de confiance et une obligation d'affichage.",
    "Bouton d'appel fixé en bas de l'écran : un client avec une fuite appelle, il ne remplit pas un formulaire.",
  ],
  garage: [
    "Les plages de rendez-vous sont visibles d'emblée : le client choisit sans téléphoner.",
    "Fond graphite et rouge signal : l'univers de l'atelier, lisible en plein soleil comme le soir.",
    "La roue dessinée en code remplace une photo : légère, nette, et propre à ce garage.",
    "Une seule action par écran : confirmer le rendez-vous.",
  ],
  conseil: [
    "Ton posé, typographie à empattements : l'autorité d'un cabinet, sans froideur.",
    "La méthode en trois étapes rassure : le client sait ce qui va se passer après l'appel.",
    "L'action proposée est un appel de découverte, adaptée à une décision réfléchie.",
    "Vert profond et papier chaud : sobriété et confiance, loin du bleu « corporatif » habituel.",
  ],
};

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "Démonstrations",
  titre: "Trois entreprises fictives, trois vrais problèmes.",
  intro: "Ces maquettes ont été conçues par LD SOLUTIONS pour montrer notre façon de travailler. Les entreprises n'existent pas : les noms, les textes et les informations affichées sont inventés pour l'exemple. Les choix de conception, eux, sont ceux que nous faisons pour de vrais clients.",
  boutons: `<a class="bouton" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis ${fleche}</a>`,
})}

${DEMOS.map((d, i) => `
<section class="section ${i % 2 ? "section--blanc" : "section--clair"}" aria-labelledby="titre-demo-${d.cls}">
  <div class="conteneur">
    <div class="deux-colonnes ${i % 2 ? "deux-colonnes--7-5" : "deux-colonnes--5-7"}">
      <div class="demo demo--${d.cls}">
        <div class="demo__cadre" role="img" aria-label="Maquette d'écran de téléphone pour ${esc(d.nom)}, entreprise fictive.">
          <span class="demo__badge">Démo · entreprise fictive</span>
          <div class="demo__ecran" aria-hidden="true">${d.ecran}</div>
        </div>
      </div>
      <div>
        ${surtitre(`Démonstration 0${i + 1} · ${esc(d.secteur)}`)}
        <h2 id="titre-demo-${d.cls}">${esc(d.nom)}</h2>
        <p class="texte-secondaire mt-4"><strong>L'enjeu :</strong> ${esc(d.probleme)}</p>
        <h3 class="mt-6 mb-5">Nos choix, et pourquoi</h3>
        <ul class="liste-coches">${CHOIX[d.cls].map((c) => `<li><span>${esc(c)}</span></li>`).join("")}</ul>
      </div>
    </div>
  </div>
</section>`).join("")}

<section class="section section--sombre" aria-labelledby="titre-demo-vous">
  <div class="conteneur conteneur--etroit">
    ${surtitre("Et pour votre entreprise ?")}
    <h2 id="titre-demo-vous">Votre site ne ressemblera à aucune de ces démonstrations.</h2>
    <p class="texte-secondaire mt-4">Chaque direction visuelle part de votre métier, de vos clients et de ce que vous voulez qu'ils fassent. Pour un prospect, nous pouvons aussi préparer une maquette de démonstration de sa page d'accueil, clairement identifiée comme non officielle, avant tout engagement.</p>
    <div class="groupe-boutons mt-6"><a class="bouton" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis ${fleche}</a><a class="bouton bouton--contour" href="/audit/">Faire analyser mon site actuel</a></div>
  </div>
</section>
`;

export default {
  chemin: "/demonstrations/",
  titre: "Démonstrations de sites web (entreprises fictives)",
  description: "Trois démonstrations de sites web conçues par LD SOLUTIONS pour des entreprises fictives : entrepreneur en toiture, garage, cabinet-conseil. Nos choix expliqués.",
  navActif: "demonstrations",
  corps,
  jsonld: [jsonldAriane(ARIANE)],
};
