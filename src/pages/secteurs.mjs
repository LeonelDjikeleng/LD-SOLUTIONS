// Pages sectorielles : distinctes par leurs problèmes et leurs exigences, réutilisables en prospection.
import { creation, formatPrix } from "../content/offres.mjs";
import { heroPage, surtitre, fleche, faq, faqJsonLd, appelFinal, jsonldService, jsonldAriane } from "../composants.mjs";
import { esc } from "../gabarit.mjs";

function pageSecteur(s) {
  const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: s.nomCourt, href: s.chemin }];
  const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: `Secteur · ${s.nomCourt}`,
  titre: s.h1,
  intro: s.intro,
  boutons: `<a class="bouton" href="/contact/?type=creation&amp;secteur=${s.secteurForm}" data-evenement="clic_devis">Demander un devis ${fleche}</a><a class="bouton bouton--contour" href="/audit/" data-evenement="clic_audit">Faire analyser mon site</a>`,
})}

<section class="section section--clair" aria-labelledby="titre-pb-${s.cle}">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Ce que nous observons souvent")}<h2 id="titre-pb-${s.cle}">${esc(s.titreProblemes)}</h2></div>
    <ul class="constats">
      ${s.problemes.map(([t, d], i) => `<li class="revele"><span class="constats__num">0${i + 1}</span><div><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`).join("")}
    </ul>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-rep-${s.cle}">
  <div class="hero__fond grille-plan grille-plan--fondu" aria-hidden="true"></div>
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>${surtitre("Ce que votre site doit faire")}<h2 id="titre-rep-${s.cle}">${esc(s.titreReponse)}</h2></div>
      <ul class="liste-coches">${s.reponses.map((r) => `<li><span>${r}</span></li>`).join("")}</ul>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-offre-${s.cle}">
  <div class="conteneur">
    <div class="deux-colonnes">
      <div>
        ${surtitre("Formule recommandée")}
        <h2 id="titre-offre-${s.cle}">${esc(s.offre.titre)}</h2>
        <p class="texte-secondaire mt-4">${s.offre.texte}</p>
        <p class="prix-ligne mt-5">${s.offre.prix} <small>taxes en sus</small></p>
        <div class="groupe-boutons mt-5"><a class="bouton" href="/contact/?type=creation&amp;formule=${s.offre.id}" data-evenement="clic_offre">Choisir cette formule ${fleche}</a><a class="lien-fleche" href="/tarifs/">Comparer les formules</a></div>
      </div>
      <div class="carte-simple">
        <h3>${esc(s.verifier.titre)}</h3>
        <p class="texte-secondaire">Posez-vous ces questions en regardant votre site actuel sur votre téléphone :</p>
        <ul class="liste-coches mt-4">${s.verifier.items.map((v) => `<li><span>${esc(v)}</span></li>`).join("")}</ul>
        <p class="mt-5 mb-0">Une réponse « non » ? <a href="/audit/">Le diagnostic express est offert.</a></p>
      </div>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-faq-${s.cle}">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Questions fréquentes")}<h2 id="titre-faq-${s.cle}">${esc(s.titreFaq)}</h2></div>
    ${faq(s.faq)}
    ${s.demo ? `<p class="mt-6"><a class="lien-fleche" href="/demonstrations/">Voir notre démonstration « ${esc(s.demo)} » (entreprise fictive) ${fleche}</a></p>` : ""}
  </div>
</section>

${appelFinal()}
`;
  return {
    chemin: s.chemin,
    titre: s.titre,
    description: s.description,
    navActif: "secteurs",
    corps,
    jsonld: [
      jsonldService({ nom: s.titre, description: s.description, chemin: s.chemin }),
      jsonldAriane(ARIANE),
      faqJsonLd(s.faq),
    ],
  };
}

export default [
  pageSecteur({
    cle: "construction",
    chemin: "/secteurs/entrepreneurs-construction/",
    nomCourt: "Entrepreneurs et métiers",
    secteurForm: "construction",
    titre: "Site web pour entrepreneurs, plombiers, électriciens",
    description: "Sites web pour entrepreneurs en construction, plomberie, électricité, rénovation et toiture au Québec : demandes de soumission, licence RBQ, affichage mobile.",
    h1: "Un site conçu pour faire sonner le téléphone pendant que vous êtes sur le chantier.",
    intro: "Plombiers, électriciens, couvreurs, entrepreneurs en rénovation ou en paysagement : vos clients vous cherchent sur leur téléphone, souvent dans l'urgence. Votre site doit les rassurer en quelques secondes et rendre l'appel ou la demande de soumission évidents.",
    titreProblemes: "Ce qui fait perdre des contrats à un entrepreneur.",
    problemes: [
      ["Le numéro est introuvable sur téléphone.", "Le client a une fuite ou un projet pressant. S'il doit chercher comment vous joindre, il appelle le suivant dans les résultats."],
      ["Les services ne sont pas clairs.", "« Rénovation générale » ne dit pas si vous faites les salles de bain, les toitures ou les fondations. Le client veut se reconnaître."],
      ["Aucune preuve visible de sérieux.", "Licence RBQ, assurances, zone desservie, photos de vrais chantiers : ce sont les premiers critères de confiance."],
      ["Les demandes arrivent incomplètes.", "Sans questions sur le type de travaux, l'adresse ou l'échéance, chaque soumission commence par trois appels."],
    ],
    titreReponse: "Rassurer vite, qualifier la demande, vous faire gagner du temps.",
    reponses: [
      "<strong>Bouton d'appel toujours visible</strong> sur téléphone, et formulaire de soumission accessible en un geste.",
      "<strong>Une page par service</strong> (plomberie d'urgence, chauffe-eau, salle de bain…) pour que le client se reconnaisse et que Google vous associe à ces recherches.",
      "<strong>Licence RBQ affichée</strong> (vous nous fournissez le numéro), zones desservies et heures de service.",
      "<strong>Formulaire de soumission qualifié</strong> : type de travaux, échéance, photos jointes en option. Vous rappelez avec les bonnes informations.",
      "<strong>Vos vraies photos de chantiers</strong> mises en valeur. Nous vous indiquons quoi photographier.",
    ],
    offre: {
      id: "professionnel",
      titre: "Professionnel : une page par service, un formulaire qui qualifie.",
      texte: "Jusqu'à 7 pages, rédaction incluse, référencement local par service. Pour un travailleur autonome qui démarre, la formule Départ peut suffire.",
      prix: formatPrix(creation[1].prix),
    },
    verifier: {
      titre: "Votre site passe-t-il le test du chantier ?",
      items: [
        "Votre numéro est-il cliquable dès l'ouverture de la page ?",
        "Un client comprend-il en 5 secondes quels travaux vous faites ?",
        "Votre licence RBQ et votre zone desservie sont-elles visibles ?",
        "Votre formulaire demande-t-il le type de travaux et l'échéance ?",
      ],
    },
    titreFaq: "Pour les entrepreneurs.",
    faq: [
      { q: "Dois-je afficher ma licence RBQ sur mon site ?", r: "<p>La Régie du bâtiment du Québec encadre l'affichage du numéro de licence dans la publicité des entrepreneurs. Nous prévoyons son emplacement sur toutes les pages ; vérifiez auprès de la RBQ les exigences qui s'appliquent à votre situation. Nous n'inventons jamais un numéro : vous nous le fournissez.</p>" },
      { q: "Je n'ai pas de photos professionnelles. Est-ce un problème ?", r: "<p>Non. Des photos prises au téléphone sur vos chantiers, bien choisies et bien cadrées, valent mieux que des images de banque. Nous vous envoyons une liste de prises de vue simple.</p>" },
      { q: "Puis-je recevoir des photos des clients avec leurs demandes ?", r: "<p>Oui, avec l'option « formulaire avancé » (pièces jointes). Les fichiers sont conservés de façon sécurisée et la politique de confidentialité l'indique.</p>" },
    ],
    demo: "Nordet Toitures",
  }),
  pageSecteur({
    cle: "automobile",
    chemin: "/secteurs/services-automobiles/",
    nomCourt: "Services automobiles",
    secteurForm: "automobile",
    titre: "Site web pour garages et services automobiles",
    description: "Sites web pour garages, carrosseries, esthétique auto et centres de pneus au Québec : rendez-vous en ligne, saison des pneus, services clairs, affichage mobile.",
    h1: "Moins d'appels pour rien, plus de rendez-vous confirmés.",
    intro: "Garages, carrosseries, esthétique automobile, centres de pneus : vos clients veulent savoir si vous réparez leur véhicule, quand ils peuvent venir et à quoi s'attendre. Votre site doit répondre avant qu'ils décrochent le téléphone.",
    titreProblemes: "Ce qui fatigue un atelier, et ses clients.",
    problemes: [
      ["Le téléphone sonne sans arrêt en saison.", "Pose de pneus, inspections : les mêmes questions reviennent cent fois, pendant que les mécaniciens travaillent."],
      ["Les heures et l'adresse sont difficiles à trouver.", "Le client sur la route veut l'itinéraire et l'heure de fermeture, maintenant."],
      ["Les services sont noyés dans une liste.", "Alignement, freins, diagnostic, climatisation : le client veut vérifier en un coup d'œil que vous faites ce dont il a besoin."],
      ["La confiance se joue avant la visite.", "Les clients craignent les surprises sur la facture : expliquer votre façon de faire les rassure."],
    ],
    titreReponse: "Informer, planifier, rassurer.",
    reponses: [
      "<strong>Prise de rendez-vous en ligne</strong> avec votre outil existant, ou formulaire de demande de rendez-vous avec plages préférées.",
      "<strong>Heures, adresse et itinéraire</strong> visibles sur téléphone, sans carte qui ralentit la page (chargée seulement au clic).",
      "<strong>Services classés par besoin</strong> : entretien, pneus, freins, diagnostic, carrosserie.",
      "<strong>Votre façon de travailler expliquée</strong> : évaluation écrite avant les travaux, garanties sur les pièces et la main-d'œuvre que vous offrez réellement.",
      "<strong>Page saisonnière</strong> pour les pneus d'hiver, mise à jour chaque automne en quelques minutes.",
    ],
    offre: {
      id: "professionnel",
      titre: "Professionnel, avec l'intégration de votre outil de rendez-vous.",
      texte: "Jusqu'à 7 pages, services classés, référencement local. Intégration d'un outil de rendez-vous en option (150 $).",
      prix: formatPrix(creation[1].prix),
    },
    verifier: {
      titre: "Votre site passe-t-il le test de la route ?",
      items: [
        "Vos heures d'ouverture sont-elles visibles sans défiler sur téléphone ?",
        "Peut-on demander un rendez-vous sans téléphoner ?",
        "Vos services principaux sont-ils listés clairement ?",
        "La page se charge-t-elle vite en 4G, sur la route ?",
      ],
    },
    titreFaq: "Pour les ateliers.",
    faq: [
      { q: "J'utilise déjà un logiciel de rendez-vous. Pouvez-vous l'intégrer ?", r: "<p>Dans la plupart des cas, oui : nous intégrons le lien ou le module fourni par votre logiciel. Nous vérifions d'abord comment il traite les données de vos clients, pour l'indiquer dans votre politique de confidentialité.</p>" },
      { q: "Pouvez-vous afficher nos avis Google ?", r: "<p>Oui, de vrais avis, avec un lien vers votre fiche Google. Nous n'affichons jamais d'avis rédigés ou choisis hors contexte. Nous privilégions un lien ou une sélection mise à jour par vous plutôt qu'un module externe qui ralentit le site et dépose des témoins.</p>" },
      { q: "Faut-il afficher nos prix ?", r: "<p>Ce n'est pas obligatoire, mais des prix « à partir de » pour les services courants (pose de pneus, changement d'huile) réduisent les appels. S'ils sont affichés, ils doivent être exacts et complets : seules les taxes peuvent s'y ajouter.</p>" },
    ],
    demo: "Garage Pivot",
  }),
  pageSecteur({
    cle: "professionnels",
    chemin: "/secteurs/services-professionnels/",
    nomCourt: "Services professionnels",
    secteurForm: "services-professionnels",
    titre: "Site web pour consultants et services professionnels",
    description: "Sites web pour consultants, cabinets, comptables et entreprises de services B2B au Québec : crédibilité, méthode claire, prise de rendez-vous, prospection.",
    h1: "Gagner la confiance avant le premier appel.",
    intro: "Consultants, cabinets, comptables, firmes de services aux entreprises : vos mandats se décident sur la crédibilité. Votre site doit présenter votre expertise avec précision, expliquer votre méthode et faciliter un premier échange.",
    titreProblemes: "Ce qui freine un client professionnel.",
    problemes: [
      ["Un discours trop général.", "« Solutions sur mesure pour votre entreprise » ne dit rien. Le client cherche un spécialiste de son problème."],
      ["Aucune idée de la façon de travailler.", "Combien de rencontres, quels livrables, quels délais : sans réponse, la décision est repoussée."],
      ["Un site qui ne soutient pas la prospection.", "Après un premier contact, le prospect visite votre site : il doit y retrouver exactement ce que vous lui avez dit."],
      ["Un premier pas trop engageant.", "« Contactez-nous » intimide. Un appel de découverte de 20 minutes, réservé en ligne, est plus simple à accepter."],
    ],
    titreReponse: "Préciser, structurer, faciliter le premier échange.",
    reponses: [
      "<strong>Une page par expertise</strong>, écrite pour le problème du client plutôt que pour la liste de vos compétences.",
      "<strong>Votre méthode en étapes</strong> : ce qui se passe après le premier appel, les livrables, les délais.",
      "<strong>Prise de rendez-vous</strong> pour un appel de découverte, intégrée à votre agenda.",
      "<strong>Pages par secteur client</strong> (formule Sur mesure) que vous pouvez envoyer à vos prospects.",
      "<strong>Respect des règles de votre ordre professionnel</strong> en matière de publicité, si vous en êtes membre : vous nous les indiquez, nous les appliquons.",
    ],
    offre: {
      id: "sur-mesure",
      titre: "Professionnel ou Sur mesure, selon votre prospection.",
      texte: `La formule Professionnel (${formatPrix(creation[1].prix)}) convient à un cabinet qui présente quelques expertises. La formule Sur mesure ajoute des pages par secteur client et un parcours de conversion pour soutenir une prospection active.`,
      prix: `dès ${formatPrix(creation[2].prix)}`,
    },
    verifier: {
      titre: "Votre site soutient-il votre prospection ?",
      items: [
        "Un prospect comprend-il quel problème précis vous résolvez ?",
        "Votre méthode de travail est-elle expliquée étape par étape ?",
        "Peut-on réserver un premier appel sans échange de courriels ?",
        "Pouvez-vous envoyer une page précise à un prospect d'un secteur donné ?",
      ],
    },
    titreFaq: "Pour les professionnels.",
    faq: [
      { q: "Je suis membre d'un ordre professionnel. Y a-t-il des règles particulières ?", r: "<p>Plusieurs ordres encadrent la publicité de leurs membres (allégations, témoignages, titres). Vous connaissez les règles de votre ordre : vous nous les transmettez et nous en tenons compte dans les textes. Pour les cas délicats, la validation reste la vôtre.</p>" },
      { q: "Pouvez-vous rédiger les textes de mes expertises ?", r: "<p>Oui, à partir d'un entretien et de vos documents. La rédaction est incluse dans les formules Professionnel et Sur mesure ; vous validez chaque texte avant la mise en ligne.</p>" },
      { q: "Mon site peut-il être bilingue ?", r: "<p>Oui, sur devis. Au Québec, la version française doit rester au moins aussi complète et accessible que la version anglaise.</p>" },
    ],
    demo: "Lumen Conseil",
  }),
];
