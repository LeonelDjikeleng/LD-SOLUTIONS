import { amelioration } from "../content/offres.mjs";
import {
  heroPage, surtitre, fleche, faq, faqJsonLd, formulaireDemande, jsonldService, jsonldAriane, ICONES,
} from "../composants.mjs";
import { esc } from "../gabarit.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Audit de site web", href: "/audit/" }];
const express = amelioration.find((a) => a.id === "diagnostic-express");
const complet = amelioration.find((a) => a.id === "audit-complet");

export const FAQ_AUDIT = [
  { q: "Avez-vous besoin de mes accès ?", r: "<p>Non pour le diagnostic express et l'essentiel de l'audit : nous analysons ce que voient vos visiteurs et Google. Pour l'audit complet, un accès en lecture à Google Search Console (si vous l'utilisez) permet d'aller plus loin ; nous vous expliquons comment le partager sans donner votre mot de passe.</p>" },
  { q: "Suis-je obligé de vous confier les corrections ?", r: "<p>Non. Le rapport vous appartient : vous pouvez l'appliquer vous-même ou le remettre à votre prestataire actuel. Si vous nous confiez un projet dans les 60 jours, l'audit complet est déduit de son prix.</p>" },
  { q: "Pourquoi le diagnostic express est-il offert ?", r: "<p>Parce qu'il nous permet de vous montrer notre façon de travailler sur votre propre site, plutôt qu'avec des promesses. Il reste volontairement court : 5 constats, les plus importants.</p>" },
  { q: "Que contient exactement l'audit complet ?", r: "<p>Plus de 30 vérifications réparties en six domaines (ci-dessus), avec des mesures réelles de vitesse sur téléphone, des captures annotées, une liste de corrections classées par priorité et par effort, et un appel de 45 minutes pour en discuter.</p>" },
];

const DOMAINES = [
  ["Affichage mobile", "Lisibilité sans zoom, taille des boutons, menus, débordements, formulaires sur petit écran."],
  ["Vitesse", "Mesures réelles sur téléphone (chargement, réactivité, stabilité), poids des images et des scripts."],
  ["Parcours de demande", "Clarté du message, visibilité de l'action principale, test réel du formulaire et de la confirmation."],
  ["Référencement technique", "Indexation, titres et descriptions, structure des pages, données structurées, liens brisés."],
  ["Accessibilité", "Contrastes, navigation au clavier, textes alternatifs, étiquettes de formulaires."],
  ["Sécurité et conformité visibles", "HTTPS, en-têtes de sécurité, politique de confidentialité, témoins chargés avant consentement (Loi 25)."],
];

const corps = `
${heroPage({
  arianeItems: ARIANE,
  surtitreTexte: "Audit de site web",
  titre: "Ce qui empêche votre site de vous apporter des clients.",
  intro: "Un regard extérieur, des mesures réelles et une liste de priorités claire. Commencez par le diagnostic express offert, ou demandez l'audit complet pour un plan de corrections détaillé.",
  boutons: `<a class="bouton" href="#demande-audit" data-evenement="clic_audit">Demander mon audit ${fleche}</a><a class="bouton bouton--contour" href="#formules-audit">Comparer les deux formules</a>`,
  aside: `<div class="carte-simple sombre"><p class="surtitre">Ce que vous recevez</p><ul class="liste-coches"><li><span>Les problèmes classés par impact sur vos demandes</span></li><li><span>Une piste de correction concrète pour chacun</span></li><li><span>Des mesures, pas des impressions</span></li><li><span>Aucune obligation de nous confier les travaux</span></li></ul></div>`,
})}

<section class="section section--clair" aria-labelledby="titre-domaines">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Ce que nous examinons")}<h2 id="titre-domaines">Six domaines, du point de vue de votre client.</h2></div>
    <div class="grille-cartes grille-cartes--3">
      ${DOMAINES.map(([t, d], i) => `<article class="carte-simple revele"><p class="constats__num">0${i + 1}</p><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join("")}
    </div>
  </div>
</section>

<section class="section section--blanc" id="formules-audit" aria-labelledby="titre-formules-a">
  <div class="conteneur">
    <div class="entete-section">${surtitre("Deux formules")}<h2 id="titre-formules-a">Le bon niveau de détail pour décider.</h2></div>
    <div class="offres offres--2">
      <article class="offre">
        <h3 class="offre__nom">${esc(express.nom)}</h3>
        <div class="offre__prix"><span class="montant">Offert</span></div>
        <p class="offre__accroche">5 constats prioritaires, par écrit.</p>
        <ul class="liste-coches"><li>Analyse de votre page d'accueil sur téléphone et ordinateur</li><li>Les 5 problèmes qui coûtent le plus de demandes</li><li>Une piste de correction pour chacun</li><li>Réponse sous 3 jours ouvrables</li></ul>
        <p class="offre__perimetre">${esc(express.conditions)}</p>
        <a class="bouton bouton--contour" href="#demande-audit" data-evenement="clic_audit">Demander le diagnostic</a>
      </article>
      <article class="offre offre--recommandee">
        <span class="offre__ruban">Pour un plan d'action</span>
        <h3 class="offre__nom">${esc(complet.nom)}</h3>
        <div class="offre__prix"><span class="montant">390&nbsp;$</span><span class="suffixe">taxes en sus</span></div>
        <p class="offre__accroche">Plus de 30 points, rapport priorisé et appel.</p>
        <ul class="liste-coches"><li>Les six domaines examinés en détail, sur plusieurs pages</li><li>Mesures de vitesse sur téléphone et captures annotées</li><li>Corrections classées par impact et par effort</li><li>Appel de 45 minutes pour présenter le rapport</li><li>Remis sous 5 jours ouvrables après le paiement</li></ul>
        <p class="offre__perimetre">${esc(complet.conditions)}</p>
        <a class="bouton" href="?audit=audit-complet#demande-audit" data-evenement="clic_audit" data-choisir-audit="audit-complet">Choisir l'audit complet</a>
      </article>
    </div>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-apres">
  <div class="hero__fond grille-plan grille-plan--fondu" aria-hidden="true"></div>
  <div class="conteneur">
    <div class="entete-section">${surtitre("Après l'audit")}<h2 id="titre-apres">Trois façons d'utiliser les résultats.</h2></div>
    <div class="piliers">
      <div class="pilier"><span class="pilier__num">Option A</span>${ICONES.creer}<h3>Vous corrigez</h3><p>Le rapport est rédigé pour être compris et appliqué sans nous, par vous ou par votre prestataire actuel.</p></div>
      <div class="pilier"><span class="pilier__num">Option B</span>${ICONES.ameliorer}<h3>Optimisation ciblée</h3><p>8 heures de corrections prioritaires (690 $), choisies avec vous à partir du rapport.</p></div>
      <div class="pilier"><span class="pilier__num">Option C</span>${ICONES.entretenir}<h3>Refonte</h3><p>Si les fondations ne tiennent plus, une refonte visuelle ou complète. L'audit est déduit du prix.</p></div>
    </div>
  </div>
</section>

<section class="section section--clair" id="demande-audit" aria-labelledby="titre-demande-a">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--5-7">
      <div>
        ${surtitre("Demande")}
        <h2 id="titre-demande-a">Demander mon audit.</h2>
        <p class="texte-secondaire mt-4">Il nous faut l'adresse de votre site et un moyen de vous répondre. Le reste nous aide à cibler l'analyse.</p>
        <ol class="liste-etapes mt-6">
          <li><span><strong>Vous envoyez la demande</strong> (2 minutes).</span></li>
          <li><span><strong>Nous analysons votre site</strong> sur téléphone et ordinateur.</span></li>
          <li><span><strong>Vous recevez les résultats</strong> par écrit, avec les priorités.</span></li>
        </ol>
      </div>
      <div class="panneau-formulaire">${formulaireDemande({ typeDefaut: "audit", typesVisibles: ["audit"], idPrefixe: "fa", titre: "Demande d'audit" })}</div>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-faq-a">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">${surtitre("Questions fréquentes")}<h2 id="titre-faq-a">Sur l'audit.</h2></div>
    ${faq(FAQ_AUDIT)}
  </div>
</section>
`;

export default {
  chemin: "/audit/",
  titre: "Audit de site web : diagnostic express offert",
  description: "Audit de site web pour PME : mobile, vitesse, formulaires, SEO technique, accessibilité, Loi 25. Diagnostic express offert ou audit complet à 390 $, crédité.",
  navActif: "audit",
  cta: { href: "#demande-audit", libelle: "Demander mon audit", evenement: "clic_audit" },
  formulaire: true,
  corps,
  jsonld: [
    jsonldService({ nom: "Audit de site web", description: "Analyse de site web : mobile, vitesse, conversion, référencement technique, accessibilité.", chemin: "/audit/", offres: [{ nom: "Audit complet", prix: 390 }, { nom: "Diagnostic express", prix: 0 }] }),
    jsonldAriane(ARIANE),
    faqJsonLd(FAQ_AUDIT),
  ],
};
