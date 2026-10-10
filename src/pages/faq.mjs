import { heroPage, surtitre, fleche, faq, faqJsonLd, appelFinal, jsonldAriane } from "../composants.mjs";
import { FAQ_ACCUEIL } from "./accueil.mjs";
import { FAQ_CREATION } from "./creation.mjs";
import { FAQ_REFONTE } from "./refonte.mjs";
import { FAQ_MAINTENANCE } from "./maintenance.mjs";
import { FAQ_PRIX } from "./tarifs.mjs";
import { FAQ_AUDIT } from "./audit.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Questions fréquentes", href: "/faq/" }];

const FAQ_CONTRAT = [
  { q: "Signons-nous un contrat ?", r: "<p>Oui, toujours. Le devis-contrat décrit le périmètre, le prix, les étapes de paiement, le nombre de révisions, le calendrier et ce qui se passe en cas de changement. Nos <a href=\"/conditions-de-service/\">conditions de service</a> s'y ajoutent et sont publiques.</p>" },
  { q: "Et si je veux arrêter le projet en cours de route ?", r: "<p>Vous pouvez y mettre fin à tout moment. Vous payez alors le travail réalisé et les frais engagés jusque-là, et vous recevez ce qui a été produit. Les détails sont dans nos conditions de service.</p>" },
  { q: "Travaillez-vous partout au Québec ?", r: "<p>Oui. Le travail se fait à distance : appels vidéo ou téléphoniques, courriels et partage d'écran. Vous n'avez pas à vous déplacer.</p>" },
  { q: "Que faites-vous de mes données et de celles de mes clients ?", r: "<p>Nous les utilisons seulement pour réaliser le travail demandé et les protégeons conformément à la Loi 25. Pour votre site, nous préparons une politique de confidentialité adaptée à ce qu'il collecte réellement. Voir notre <a href=\"/politique-de-confidentialite/\">politique de confidentialité</a>.</p>" },
];

const GROUPES = [
  { id: "general", titre: "Questions générales", items: FAQ_ACCUEIL },
  { id: "prix", titre: "Prix et paiement", items: FAQ_PRIX },
  { id: "creation", titre: "Création de site", items: FAQ_CREATION },
  { id: "refonte", titre: "Refonte et amélioration", items: FAQ_REFONTE },
  { id: "audit", titre: "Audit", items: FAQ_AUDIT },
  { id: "maintenance", titre: "Maintenance", items: FAQ_MAINTENANCE },
  { id: "contrat", titre: "Contrat et confidentialité", items: FAQ_CONTRAT },
];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "Questions fréquentes",
  titre: "Les réponses, avant même de nous écrire.",
  intro: "Prix, délais, propriété du site, contrat, maintenance : si votre question n'est pas ici, écrivez-nous, nous l'ajouterons.",
  boutons: GROUPES.map((g) => `<a class="bouton bouton--contour bouton--petit" href="#${g.id}">${g.titre}</a>`).join(""),
})}
${GROUPES.map((g, i) => `
<section class="section section--compacte ${i % 2 ? "section--blanc" : "section--clair"}" id="${g.id}" aria-labelledby="titre-faq-${g.id}">
  <div class="conteneur conteneur--etroit">
    ${surtitre(String(i + 1).padStart(2, "0"))}
    <h2 id="titre-faq-${g.id}" class="mb-5">${g.titre}</h2>
    ${faq(g.items)}
  </div>
</section>`).join("")}
${appelFinal({ titre: "Une autre question ?", intro: `Écrivez-nous : réponse sous 2 jours ouvrables. <a class="lien-fleche" href="/contact/?type=discussion">Poser ma question ${fleche}</a>` })}
`;

export default {
  chemin: "/faq/",
  titre: "Questions fréquentes : prix, délais, contrat",
  description: "Réponses aux questions fréquentes sur la création de site web, les prix, les délais, la propriété du site, l'audit, la maintenance et le contrat.",
  navActif: "faq",
  corps,
  jsonld: [jsonldAriane(ARIANE), faqJsonLd(GROUPES.flatMap((g) => g.items))],
};
