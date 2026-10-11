import { site } from "../content/site.config.mjs";
import { creation, maintenance, formatPrix, DELAI_REPONSE } from "../content/offres.mjs";
import {
  surtitre, fleche, telephoneHero, grilleCreation, demonstrations, processus, engagements,
  faq, faqJsonLd, appelFinal, ICONES, promosHTML, jsonldOrganisation,
} from "../composants.mjs";

export const FAQ_ACCUEIL = [
  { q: "Combien coûte un site web ?", r: `<p>Nos formules de création commencent à ${formatPrix(creation[0].prix)} (jusqu'à 3 pages), ${formatPrix(creation[1].prix)} pour un site complet de 7 pages, et à partir de ${formatPrix(creation[2].prix)} pour un projet sur mesure. Taxes en sus, le cas échéant. L'<a href="/tarifs/#estimateur">estimateur de la page Tarifs</a> calcule votre total avec les options.</p>` },
  { q: "Combien de temps faut-il pour créer mon site ?", r: "<p>Environ 2 semaines pour la formule Départ, 4 à 5 semaines pour la formule Professionnel et 6 à 10 semaines pour un projet sur mesure, à partir de la réception de votre contenu. Le calendrier exact est écrit dans le devis.</p>" },
  { q: "Est-ce que le site m'appartient ?", r: "<p>Oui. Le nom de domaine et l'hébergement sont à votre nom. Au paiement complet, les droits sur le design, les textes et le code créés pour vous vous sont cédés. Les outils que nous utilisions déjà avant votre projet restent à nous, mais vous recevez le droit de les utiliser pour toujours avec votre site.</p>" },
  { q: "Que dois-je fournir ?", r: "<p>Votre logo si vous en avez un, les informations sur vos services, vos zones desservies et, idéalement, de vraies photos de votre travail. Nous vous envoyons une liste simple après l'appel découverte. Si vous manquez de textes, la rédaction est incluse dans la formule Professionnel ou offerte en option.</p>" },
  { q: "Pouvez-vous garantir la première position sur Google ?", r: "<p>Non, et personne ne peut honnêtement le garantir. Nous livrons une base technique solide (vitesse, structure, données structurées, contenu par service) et nous vous aidons à configurer votre fiche Google Business Profile. Le classement dépend aussi de la concurrence, de vos avis et du temps.</p>" },
  { q: "Que se passe-t-il après la mise en ligne ?", r: "<p>Les corrections sont incluses pendant 30 jours (60 jours en formule Sur mesure). Ensuite, vous pouvez gérer le site vous-même, choisir une <a href=\"/maintenance/\">formule de maintenance</a> à partir de 49 $ par mois, ou nous confier des interventions ponctuelles à 85 $ l'heure, toujours approuvées par vous avant.</p>" },
];

const corps = `
<section class="hero hero--accueil" aria-labelledby="titre-accueil">
  <div class="conteneur hero__grille">
    <div class="hero__texte">
      <p class="hero__etiquette entree">Atelier web · Québec</p>
      <h1 id="titre-accueil">Un site web qui <em>travaille</em> pendant que vous travaillez.</h1>
      <p class="cote-ecran" aria-hidden="true" data-cote-ecran hidden><span class="cote-ecran__ligne"></span><span>pris à votre mesure : <b data-largeur-ecran></b> px</span></p>
      <p class="hero__intro entree entree--3">Création, amélioration et entretien de sites web pour les PME et les entrepreneurs du Québec. <strong>Clairs sur téléphone, rapides</strong>, et pensés pour transformer une visite en demande de devis.</p>
      <div class="groupe-boutons entree entree--4">
        <a class="bouton" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis ${fleche}</a>
        <a class="lien-fleche" href="/audit/" data-evenement="clic_audit">Faire analyser mon site ${fleche}</a>
      </div>
      <ul class="hero__garanties entree entree--5">
        <li>Prix publiés <b>dès ${formatPrix(creation[0].prix)}</b></li>
        <li>Première réponse <b>${DELAI_REPONSE}</b></li>
        <li>Propriété du site <b>à votre nom</b></li>
      </ul>
    </div>
    <div class="hero__demo entree entree--5">${telephoneHero()}</div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-constats">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Ce que vivent beaucoup d'entrepreneurs")}
      <h2 id="titre-constats">Votre site devrait vous apporter des clients. Souvent, il fait l'inverse.</h2>
    </div>
    <ul class="constats">
      <li class="revele"><span class="constats__num">01</span><div><h3>Il faut zoomer pour lire votre site sur un téléphone.</h3><p>Vos clients cherchent depuis leur cellulaire. S'ils doivent pincer l'écran, ils reviennent aux résultats et appellent le suivant.</p></div></li>
      <li class="revele"><span class="constats__num">02</span><div><h3>Personne ne remplit votre formulaire.</h3><p>Trop de champs, un bouton caché, aucune confirmation : la demande se perd avant de vous arriver.</p></div></li>
      <li class="revele"><span class="constats__num">03</span><div><h3>Votre site ne ressemble plus à votre travail.</h3><p>Le premier jugement se fait en quelques secondes. Un site daté fait douter d'une entreprise qui travaille bien.</p></div></li>
      <li class="revele"><span class="constats__num">04</span><div><h3>Plus personne ne sait qui a les accès.</h3><p>Nom de domaine, hébergement, mises à jour : un site sans responsable finit par tomber en panne au mauvais moment.</p></div></li>
    </ul>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-piliers">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Trois savoir-faire, un seul interlocuteur")}
      <h2 id="titre-piliers">Créer. Améliorer. Entretenir.</h2>
      <p class="intro">Comme un vêtement fait sur mesure, un site se coupe, se retouche et s'entretient. Nous faisons les trois, avec le même soin et un seul interlocuteur.</p>
    </div>
    <div class="piliers">
      <a class="pilier revele" href="/creation-site-web/">
        <span class="pilier__num">01 · La coupe</span>${ICONES.creer}
        <h3>Créer</h3>
        <p>Un nouveau site, construit pour votre clientèle et ce qu'elle doit faire en arrivant.</p>
        <ul><li>Design sur mesure, pensé d'abord pour le téléphone</li><li>Formulaire de devis qui fonctionne vraiment</li><li>Référencement de base inclus</li></ul>
        <span class="lien-fleche">Créer mon site web ${fleche}</span>
      </a>
      <a class="pilier revele" href="/refonte-amelioration/">
        <span class="pilier__num">02 · Les retouches</span>${ICONES.ameliorer}
        <h3>Améliorer</h3>
        <p>Votre site existe : on corrige ce qui empêche les visiteurs de vous contacter.</p>
        <ul><li>Diagnostic express offert</li><li>Vitesse, affichage mobile, parcours de demande</li><li>Refonte visuelle ou complète</li></ul>
        <span class="lien-fleche">Améliorer mon site ${fleche}</span>
      </a>
      <a class="pilier revele" href="/maintenance/">
        <span class="pilier__num">03 · Le soin</span>${ICONES.entretenir}
        <h3>Entretenir</h3>
        <p>Mises à jour, sauvegardes et surveillance, pour que votre site reste fiable dans le temps.</p>
        <ul><li>Dès ${formatPrix(maintenance[0].prixMois)} par mois</li><li>Sauvegardes vérifiées, copie hors serveur</li><li>Sans durée minimale</li></ul>
        <span class="lien-fleche">Choisir une formule ${fleche}</span>
      </a>
    </div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-demos">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Démonstrations")}
      <h2 id="titre-demos">Ce que nous construisons, montré honnêtement.</h2>
      <p class="intro">L'entreprise démarre. Plutôt que d'afficher des logos de clients que nous n'avons pas encore, voici trois démonstrations conçues pour des entreprises fictives. Chacune répond à un vrai problème de son secteur.</p>
    </div>
    ${demonstrations()}
    <div class="groupe-boutons mt-6"><a class="lien-fleche" href="/realisations/site-leonel-djikeleng/">Ma première réalisation : ce site, en chiffres ${fleche}</a><a class="lien-fleche" href="/demonstrations/">Les choix derrière chaque démonstration ${fleche}</a></div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-offres" id="offres">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Tarifs")}
      <h2 id="titre-offres">Des prix publiés. Un périmètre écrit.</h2>
      <p class="intro">Choisissez une formule ou décrivez votre projet : le devis reprend ces prix et précise tout ce qui est inclus.</p>
    </div>
    ${grilleCreation()}
    <p class="note-prix">Maintenance dès ${formatPrix(maintenance[0].prixMois)} par mois · Audit complet 390 $, crédité sur un projet signé · Prix en dollars canadiens, taxes en sus le cas échéant.</p>
    <div class="mt-6">${promosHTML({ ids: ["lancement", "creation-entretien", "audit-credite"] })}</div>
    <p class="mt-6"><a class="lien-fleche" href="/tarifs/">Comparer toutes les offres et estimer mon projet ${fleche}</a></p>
  </div>
</section>

<section class="section section--sombre" aria-labelledby="titre-processus">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Comment ça se passe")}
      <h2 id="titre-processus">Cinq étapes, sans surprise.</h2>
      <p class="intro">Vous savez à chaque moment où en est votre projet, ce que nous attendons de vous et ce qui vient ensuite.</p>
    </div>
    ${processus()}
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-engagements">
  <div class="conteneur">
    <div class="entete-section">
      ${surtitre("Transparence")}
      <h2 id="titre-engagements">Ce sur quoi vous pouvez compter.</h2>
    </div>
    ${engagements()}
    <div class="encadre-verite"><p><strong>Pourquoi aucun témoignage sur cette page ?</strong> L'entreprise lance ses activités. Nous n'inventons ni avis, ni chiffres, ni logos de clients. Les premiers témoignages apparaîtront quand de vrais clients les auront écrits. D'ici là, jugez sur pièces : nos démonstrations, notre <a href="/audit/">diagnostic express offert</a> et la clarté de nos prix.</p></div>
  </div>
</section>

<section class="section section--blanc" aria-labelledby="titre-faq">
  <div class="conteneur conteneur--etroit">
    <div class="entete-section">
      ${surtitre("Questions fréquentes")}
      <h2 id="titre-faq">Les réponses avant de nous écrire.</h2>
    </div>
    ${faq(FAQ_ACCUEIL)}
    <p class="mt-6"><a class="lien-fleche" href="/faq/">Toutes les questions fréquentes ${fleche}</a></p>
  </div>
</section>

${appelFinal()}
`;

export default {
  chemin: "/",
  titre: "Leonel Djikeleng · Création et refonte de sites web, Québec",
  description: "Sites web pour PME et entrepreneurs du Québec : création dès 1 490 $, refonte, audit et maintenance dès 49 $ par mois. Prix publiés, réponse sous 2 jours ouvrables.",
  navActif: "accueil",
  corps,
  jsonld: [
    jsonldOrganisation(),
    { "@context": "https://schema.org", "@type": "WebSite", name: "Leonel Djikeleng", url: site.url + "/", inLanguage: "fr-CA", publisher: { "@id": site.url + "/#entreprise" } },
    faqJsonLd(FAQ_ACCUEIL),
  ],
};
