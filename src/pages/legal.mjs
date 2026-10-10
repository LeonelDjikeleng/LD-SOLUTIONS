// Pages légales. Bases de travail rédigées avec soin, à faire valider par un conseiller juridique
// avant la mise en production (voir docs/juridique/). Aucune information inventée : les champs
// manquants de site.config.mjs sont formulés de façon générique et listés par `npm run check:prelaunch`.
import { site } from "../content/site.config.mjs";
import { TAUX_HORAIRE } from "../content/offres.mjs";
import { heroPage, jsonldAriane } from "../composants.mjs";
import { esc } from "../gabarit.mjs";

const MAJ = "10 octobre 2026";
const rp = site.responsableRP;
const identite = [
  site.nomLegal ? esc(site.nomLegal) : "LD SOLUTIONS",
  site.neq ? `NEQ ${esc(site.neq)}` : null,
  site.adressePostale ? esc(site.adressePostale) : null,
].filter(Boolean).join(", ");
const hebergeur = site.hebergeur?.nom
  ? `${esc(site.hebergeur.nom)}${site.hebergeur.lieu ? ` (${esc(site.hebergeur.lieu)})` : ""}`
  : "notre fournisseur d'hébergement web";
const tribunal = site.districtJudiciaire ? `du district judiciaire de ${esc(site.districtJudiciaire)}` : "du district judiciaire où LD SOLUTIONS a son établissement";

function pageLegale({ chemin, titre, description, intro, contenu }) {
  const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: titre, href: chemin }];
  return {
    chemin, titre, description,
    corps: `${heroPage({ arianeItems: ARIANE, surtitreTexte: "Informations", titre, intro })}
<section class="section section--blanc"><div class="conteneur conteneur--etroit"><div class="prose">
<p class="maj">Dernière mise à jour : ${MAJ}</p>
${contenu}
</div></div></section>`,
    jsonld: [jsonldAriane(ARIANE)],
  };
}

const confidentialite = pageLegale({
  chemin: "/politique-de-confidentialite/",
  titre: "Politique de confidentialité",
  description: "Comment LD SOLUTIONS collecte, utilise, conserve et protège vos renseignements personnels, et comment exercer vos droits (Loi 25).",
  intro: "Ce que nous recueillons, pourquoi, combien de temps, avec qui nous le partageons et comment exercer vos droits. En termes simples.",
  contenu: `
<h2>1. Qui est responsable</h2>
<p>Ce site est exploité par ${identite}. La personne responsable de la protection des renseignements personnels est le <strong>${esc(rp.titre)}</strong>${rp.nom ? ` (${esc(rp.nom)})` : ""}, joignable à <a href="mailto:${esc(rp.courriel)}">${esc(rp.courriel)}</a>.</p>

<h2>2. Ce que nous recueillons</h2>
<table>
<thead><tr><th>Source</th><th>Renseignements</th><th>Pourquoi</th></tr></thead>
<tbody>
<tr><td>Formulaires de demande</td><td>Nom, courriel ; facultativement entreprise, téléphone, secteur, adresse de votre site, détails du projet, message.</td><td>Répondre à votre demande, préparer un diagnostic, un audit ou une proposition, et en assurer le suivi.</td></tr>
<tr><td>Courriels que vous nous envoyez</td><td>Votre adresse et le contenu du message.</td><td>Vous répondre.</td></tr>
<tr><td>Mesure de fréquentation</td><td>Comptages anonymes : page consultée, type de clic (par exemple « clic sur une offre »), date. <strong>Aucun témoin, aucun identifiant, aucune adresse IP n'est conservé avec ces comptages.</strong></td><td>Savoir quelles pages sont utiles et améliorer le site.</td></tr>
<tr><td>Fonctionnement technique</td><td>Adresse IP, gardée en mémoire quelques minutes pour limiter les envois abusifs ; journaux techniques de l'hébergement.</td><td>Sécurité du site et prévention des abus.</td></tr>
</tbody></table>
<p>Nous ne recueillons que ce qui est nécessaire. Les champs facultatifs le sont réellement.</p>

<h2>3. Témoins (cookies)</h2>
<p>Ce site n'utilise <strong>aucun témoin de suivi, de publicité ou de mesure d'audience</strong>, et ne charge aucun contenu de tiers (polices, cartes, vidéos, réseaux sociaux) lors de votre visite. Le seul témoin existant sert à la connexion de l'administrateur du site ; il n'est jamais déposé chez les visiteurs. Aucun bandeau de consentement n'est donc nécessaire. Si un outil soumis à consentement est ajouté un jour, il sera désactivé par défaut et vous pourrez le refuser aussi facilement que l'accepter.</p>
<p>Si votre navigateur transmet le signal « Global Privacy Control », même les comptages anonymes ne sont pas envoyés.</p>

<h2>4. Utilisation</h2>
<p>Vos renseignements servent uniquement aux fins indiquées ci-dessus. Ils ne sont <strong>ni vendus, ni loués, ni utilisés pour de la publicité</strong>. Nous ne vous inscrivons à aucune liste d'envoi : toute communication commerciale ultérieure exigerait votre consentement distinct. Aucune décision n'est prise à votre sujet de façon entièrement automatisée.</p>

<h2>5. Qui y a accès, et où sont-ils conservés</h2>
<p>Seule la personne qui traite votre demande chez LD SOLUTIONS y a accès. Pour fonctionner, nous utilisons les fournisseurs suivants :</p>
<ul>
<li><strong>Hébergement du site et de la base de demandes</strong> : ${hebergeur}.</li>
<li><strong>Courriel</strong> : Google (Gmail), utilisé pour recevoir les notifications de demandes et correspondre avec vous. Ses serveurs peuvent être situés hors du Québec, notamment aux États-Unis.</li>
</ul>
<p>Avant de confier des renseignements à un fournisseur hors du Québec, LD SOLUTIONS évalue les facteurs relatifs à la vie privée et s'assure d'une protection adéquate par contrat ou par les engagements du fournisseur.</p>

<h2>6. Combien de temps</h2>
<ul>
<li>Demandes sans suite : au plus <strong>24 mois</strong> après notre dernier échange, puis suppression.</li>
<li>Clients : pendant la relation d'affaires, puis le temps exigé par les lois fiscales et comptables.</li>
<li>Comptages anonymes : conservés sous forme de totaux par jour, sans renseignement personnel.</li>
</ul>

<h2>7. Sécurité</h2>
<p>Connexion chiffrée (HTTPS), accès à l'administration protégé par mot de passe et limité, sauvegardes à accès restreint, validation de toutes les données reçues, aucune donnée personnelle dans les adresses des pages. Aucune mesure n'offre une sécurité absolue ; en cas d'incident de confidentialité présentant un risque de préjudice sérieux, nous aviserons les personnes concernées et la Commission d'accès à l'information, comme la loi l'exige.</p>

<h2>8. Vos droits</h2>
<p>Vous pouvez demander l'accès à vos renseignements, leur rectification, leur suppression, leur transmission dans un format technologique structuré et couramment utilisé, ou retirer votre consentement à leur utilisation. Écrivez à <a href="mailto:${esc(rp.courriel)}">${esc(rp.courriel)}</a> ; nous répondons dans un délai de 30 jours. Si vous n'êtes pas satisfait de notre réponse, vous pouvez vous adresser à la <a href="https://www.cai.gouv.qc.ca/" rel="noopener">Commission d'accès à l'information du Québec</a>.</p>

<h2>9. Modifications</h2>
<p>Nous mettrons cette politique à jour si nos pratiques changent. La date en haut de la page indique la dernière version.</p>`,
});

const conditions = pageLegale({
  chemin: "/conditions-de-service/",
  titre: "Conditions de service",
  description: "Conditions de service de LD SOLUTIONS : devis, paiements, révisions, livraison, propriété du site, maintenance, responsabilité et résiliation.",
  intro: "Les règles du jeu, écrites clairement. Elles s'appliquent avec le devis signé, qui précise le périmètre et le prix de chaque projet.",
  contenu: `
<h2>1. Champ d'application</h2>
<p>Ces conditions encadrent les services de LD SOLUTIONS (${identite}) : création, amélioration, audit et maintenance de sites web, ainsi que les options associées. Elles s'appliquent avec le devis accepté par le client (le « devis-contrat »). En cas de contradiction, le devis-contrat signé l'emporte sur ces conditions, et ces conditions l'emportent sur les informations générales du site. Lorsque le client est un consommateur au sens de la Loi sur la protection du consommateur, les droits que cette loi lui accorde s'appliquent en priorité.</p>

<h2>2. Devis, prix et taxes</h2>
<ul>
<li>Chaque projet fait l'objet d'un devis écrit précisant le périmètre, les livrables, le nombre de rondes de révisions, le calendrier, le prix et les étapes de paiement. Le devis est valable 30 jours.</li>
<li>Les prix sont en dollars canadiens, avant taxes. La TPS et la TVQ s'ajoutent lorsqu'elles s'appliquent ; le montant total figure sur le devis et les factures.</li>
<li>Le prix signé ne change pas pour le périmètre décrit. Toute demande hors périmètre fait l'objet d'un avenant écrit, chiffré et accepté avant d'être réalisée.</li>
</ul>

<h2>3. Paiement</h2>
<ul>
<li>Le paiement se fait par étapes liées à l'avancement, selon le devis (par exemple 40 % à la signature, 40 % à la validation de la maquette, 20 % avant la mise en ligne).</li>
<li>Le premier versement réserve la période de production et couvre la planification et le travail de départ.</li>
<li>Les factures sont payables dans les 15 jours. Le devis-contrat peut prévoir des intérêts sur les sommes en retard. Après un avis écrit resté sans effet pendant 10 jours, LD SOLUTIONS peut suspendre les travaux en cours ; le calendrier est alors décalé d'autant.</li>
<li>La mise en ligne a lieu après le paiement de l'étape qui la précède.</li>
</ul>

<h2>4. Collaboration et contenu</h2>
<ul>
<li>Le client fournit le contenu prévu (textes ou informations, logo, photos, accès) et désigne une personne qui valide les étapes. Le calendrier démarre à la réception du contenu complet.</li>
<li>Le client garantit qu'il détient les droits sur le contenu qu'il fournit et qu'il est exact (prix, permis, coordonnées).</li>
<li>Si le projet est en attente du client pendant plus de 30 jours, LD SOLUTIONS peut le replanifier selon ses disponibilités ; au-delà de 60 jours, le travail réalisé jusque-là peut être facturé.</li>
</ul>

<h2>5. Révisions, livraison et acceptation</h2>
<ul>
<li>Une ronde de révisions regroupe les commentaires du client sur une version donnée. Le nombre de rondes est indiqué dans le devis ; les rondes supplémentaires sont facturées au taux horaire de ${TAUX_HORAIRE} $, sur approbation.</li>
<li>À la livraison, le client dispose de 10 jours ouvrables pour signaler par écrit tout <strong>défaut</strong>, c'est-à-dire un écart par rapport à ce qui était convenu. Sans signalement dans ce délai, ou dès la mise en ligne à la demande du client, le livrable est considéré comme accepté.</li>
<li>Une nouvelle idée ou une modification de ce qui était convenu n'est pas un défaut : elle suit la procédure d'avenant.</li>
<li>Les défauts signalés pendant la période de corrections incluse (30 jours, ou 60 jours selon la formule) sont corrigés sans frais.</li>
</ul>

<h2>6. Propriété</h2>
<ul>
<li>Le nom de domaine, l'hébergement et les comptes des services utilisés sont enregistrés au nom du client, qui en conserve la maîtrise.</li>
<li><strong>Au paiement complet</strong>, LD SOLUTIONS cède au client les droits d'auteur sur les éléments créés spécifiquement pour lui (design, textes rédigés, code propre au projet).</li>
<li>Les outils, composants et méthodes que LD SOLUTIONS possédait avant le projet ou développe de façon générale restent sa propriété ; le client reçoit une licence perpétuelle, non exclusive et gratuite pour les utiliser avec son site.</li>
<li>Les polices, images et outils de tiers restent soumis à leurs propres licences, indiquées au client.</li>
<li>LD SOLUTIONS peut présenter le projet dans ses réalisations seulement avec l'accord du client.</li>
</ul>

<h2>7. Maintenance</h2>
<ul>
<li>Les formules de maintenance sont mensuelles, sans durée minimale, payables d'avance, et résiliables par l'une ou l'autre partie avec un préavis écrit de 30 jours. Le paiement annuel couvre 12 mois pour le prix de 10 ; en cas de résiliation, les mois non entamés sont remboursés au prix mensuel normal, déduction faite de l'avantage annuel.</li>
<li>Les heures incluses ne sont pas cumulables. Les interventions hors forfait sont estimées et approuvées par le client avant d'être réalisées.</li>
<li>Les délais de réponse indiqués s'entendent en heures ouvrables. La surveillance est automatique ; LD SOLUTIONS ne garantit pas une disponibilité permanente du site, qui dépend aussi de l'hébergeur et d'autres fournisseurs.</li>
</ul>

<h2>8. Engagements et limites</h2>
<ul>
<li>LD SOLUTIONS s'engage à exécuter les services avec prudence et compétence, selon les règles de l'art. Sauf mention écrite contraire, il s'agit d'une obligation de moyens : aucun résultat commercial, aucun nombre de demandes et aucun classement dans les moteurs de recherche n'est garanti.</li>
<li>Dans la mesure permise par la loi, la responsabilité de LD SOLUTIONS est limitée au montant payé par le client pour le service en cause au cours des 12 derniers mois, et ne couvre pas les pertes indirectes (par exemple les profits perdus). Cette limite ne s'applique pas en cas de faute intentionnelle ou de faute lourde, ni au préjudice corporel ou moral.</li>
<li>LD SOLUTIONS n'est pas responsable des interruptions ou défaillances des fournisseurs tiers (hébergeur, registraire, outils externes), ni des conséquences d'un contenu fourni par le client.</li>
</ul>

<h2>9. Confidentialité et renseignements personnels</h2>
<p>Chaque partie protège les informations confidentielles de l'autre. Lorsque LD SOLUTIONS traite des renseignements personnels pour le compte du client (par exemple les demandes reçues par son site), elle le fait uniquement pour réaliser le service, selon les instructions du client et avec des mesures de sécurité raisonnables. Le client demeure responsable des renseignements recueillis par son site et de sa politique de confidentialité.</p>

<h2>10. Fin du contrat</h2>
<ul>
<li>Le client peut mettre fin au contrat à tout moment par écrit. Il paie alors le travail réalisé, les frais engagés et la valeur de ce qui lui a été fourni, et reçoit les éléments produits jusque-là, dans la mesure où ils ont été payés.</li>
<li>LD SOLUTIONS peut mettre fin au contrat pour un motif sérieux (par exemple un défaut de paiement persistant), sans causer de préjudice au client, en remettant les éléments payés.</li>
<li>À la fin de la maintenance, LD SOLUTIONS remet au client ses accès et une sauvegarde récente du site.</li>
</ul>

<h2>11. Force majeure</h2>
<p>Aucune partie n'est responsable d'un retard causé par un événement hors de son contrôle raisonnable. Les délais sont prolongés d'autant ; si l'empêchement dure plus de 60 jours, chaque partie peut mettre fin au contrat, le travail réalisé restant payable.</p>

<h2>12. Droit applicable et litiges</h2>
<p>Ces conditions sont régies par les lois du Québec et les lois fédérales du Canada qui s'y appliquent. Les parties tentent d'abord de régler tout différend à l'amiable, puis par médiation si elles le souhaitent. À défaut, les tribunaux ${tribunal} sont compétents, sous réserve des droits du consommateur. Les parties ont choisi que ces conditions et les documents du contrat soient rédigés en français.</p>

<h2>13. Modifications</h2>
<p>LD SOLUTIONS peut mettre à jour ces conditions. La version applicable à un projet est celle en vigueur à la signature de son devis-contrat.</p>`,
});

const mentions = pageLegale({
  chemin: "/mentions-legales/",
  titre: "Mentions légales",
  description: "Éditeur du site, hébergement, propriété intellectuelle, crédits et démonstrations fictives du site LD SOLUTIONS.",
  intro: "Qui édite ce site, où il est hébergé et à qui appartiennent ses contenus.",
  contenu: `
<h2>Éditeur</h2>
<p>${identite}<br>Courriel : <a href="mailto:${site.courriel}">${site.courriel}</a>${site.telephone ? `<br>Téléphone : ${esc(site.telephone)}` : ""}</p>
<h2>Hébergement</h2>
<p>Le site est hébergé par ${hebergeur}.</p>
<h2>Propriété intellectuelle</h2>
<p>Les textes, le design, les illustrations et le code de ce site sont la propriété de LD SOLUTIONS, sauf mention contraire. Toute reproduction sans autorisation est interdite.</p>
<h2>Crédits</h2>
<ul>
<li>Polices de caractères : Bodoni Moda et Instrument Sans, sous licence SIL Open Font License 1.1, hébergées sur ce site.</li>
<li>Illustrations, icônes et maquettes : conçues et codées par LD SOLUTIONS. Aucune image de banque n'est utilisée.</li>
</ul>
<h2>Démonstrations</h2>
<p>Les entreprises présentées dans les démonstrations (Nordet Toitures, Garage Pivot, Lumen Conseil) sont <strong>fictives</strong>. Leurs noms, textes et informations sont inventés pour illustrer notre travail. Toute ressemblance avec une entreprise existante serait fortuite.</p>
<h2>Liens externes</h2>
<p>Les liens vers des sites tiers sont fournis à titre informatif ; LD SOLUTIONS n'est pas responsable de leur contenu.</p>
<h2>Renseignements personnels</h2>
<p>Voir la <a href="/politique-de-confidentialite/">politique de confidentialité</a>. Ce site n'utilise aucun témoin de suivi.</p>`,
});

const accessibilite = pageLegale({
  chemin: "/accessibilite/",
  titre: "Déclaration d'accessibilité",
  description: "Les mesures d'accessibilité du site LD SOLUTIONS (WCAG 2.1 AA visé), leurs limites connues et comment signaler un problème.",
  intro: "Nous voulons que ce site soit utilisable par tous, y compris au clavier, avec un lecteur d'écran ou avec les animations réduites.",
  contenu: `
<h2>Objectif</h2>
<p>Ce site vise le niveau AA des Règles pour l'accessibilité des contenus Web (WCAG) 2.1. Il n'a pas fait l'objet d'un audit indépendant ; cette déclaration décrit les mesures prises et vérifiées par nos propres tests.</p>
<h2>Mesures en place</h2>
<ul>
<li>Contrastes de couleurs vérifiés pour le texte et les boutons.</li>
<li>Navigation complète au clavier, focus visible, lien « Aller au contenu ».</li>
<li>Structure de titres hiérarchique, zones de page identifiées, fil d'Ariane.</li>
<li>Formulaires avec étiquettes visibles, messages d'erreur explicites et annoncés.</li>
<li>Respect du réglage « réduire les animations » de votre appareil : tout le contenu reste visible immédiatement.</li>
<li>Zones tactiles d'au moins 44 pixels, texte agrandissable sans perte de contenu.</li>
<li>Contenu essentiel et formulaires utilisables sans JavaScript.</li>
</ul>
<h2>Limites connues</h2>
<ul>
<li>Les maquettes de démonstration sont des illustrations décoratives : leur contenu est résumé par un texte alternatif, pas lu élément par élément.</li>
</ul>
<h2>Signaler un problème</h2>
<p>Un obstacle sur ce site ? Écrivez à <a href="mailto:${site.courriel}">${site.courriel}</a> en décrivant la page et le problème. Nous répondons sous 2 jours ouvrables et proposons une autre façon d'obtenir l'information si nécessaire.</p>`,
});

export default [confidentialite, conditions, mentions, accessibilite];
