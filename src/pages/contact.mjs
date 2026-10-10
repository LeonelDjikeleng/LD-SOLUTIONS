import { site } from "../content/site.config.mjs";
import { DELAI_REPONSE } from "../content/offres.mjs";
import { heroPage, surtitre, fleche, formulaireDemande, jsonldAriane } from "../composants.mjs";
import { esc } from "../gabarit.mjs";

const ARIANE = [{ nom: "Accueil", href: "/" }, { nom: "Contact", href: "/contact/" }];

const contactsOptionnels = [
  site.telephone ? `<li><a class="lien-fleche" href="tel:${esc(site.telephone.replace(/[^0-9+]/g, ""))}" data-evenement="clic_telephone">Appeler le ${esc(site.telephone)}</a></li>` : "",
  site.whatsapp ? `<li><a class="lien-fleche" href="https://wa.me/${esc(site.whatsapp)}" rel="noopener" data-evenement="clic_whatsapp">Écrire sur WhatsApp</a></li>` : "",
  site.lienRendezVous ? `<li><a class="lien-fleche" href="${esc(site.lienRendezVous)}" rel="noopener">Réserver un appel de 30 minutes</a></li>` : "",
].join("");

const contact = {
  chemin: "/contact/",
  titre: "Contact et demande de projet",
  description: "Demandez un devis, un audit, une maintenance ou posez une question à LD SOLUTIONS. Réponse sous 2 jours ouvrables. Courriel : ldjikeleng@gmail.com.",
  navActif: "contact",
  cta: null,
  formulaire: true,
  corps: `
<section class="hero hero--page sombre">
  <div class="hero__fond grille-plan grille-plan--fondu" aria-hidden="true"></div>
  <div class="conteneur hero__grille">
    <div class="hero__texte">
      ${"" /* fil d'Ariane */}
      <nav class="ariane" aria-label="Fil d'Ariane"><ol><li><a href="/">Accueil</a></li><li><span aria-current="page">Contact</span></li></ol></nav>
      <p class="surtitre entree">Contact</p>
      <h1 class="entree entree--2">Parlons de votre site.</h1>
      <p class="hero__intro entree entree--3">Décrivez votre besoin en deux minutes. Vous recevez une première réponse sous ${DELAI_REPONSE}, sans engagement.</p>
    </div>
  </div>
</section>

<section class="section section--clair" aria-labelledby="titre-formulaire">
  <div class="conteneur">
    <div class="deux-colonnes deux-colonnes--7-5">
      <div class="panneau-formulaire">
        <h2 id="titre-formulaire" class="mb-5">Votre demande</h2>
        ${formulaireDemande({ typeDefaut: "creation", idPrefixe: "fc", titre: "Formulaire de demande" })}
      </div>
      <aside>
        ${surtitre("Directement")}
        <h2 class="mb-5">Vous préférez écrire ?</h2>
        <p><a class="courriel-affiche" href="mailto:${site.courriel}" data-evenement="clic_courriel">${site.courriel}</a></p>
        <button class="bouton-copier" type="button" data-copier="${site.courriel}" hidden>Copier l'adresse</button>
        ${contactsOptionnels ? `<ul class="mt-5">${contactsOptionnels}</ul>` : ""}
        <h3 class="mt-7 mb-5">Ce qui se passe ensuite</h3>
        <ol class="liste-etapes">
          <li><span><strong>Réponse sous ${DELAI_REPONSE}</strong>, en heures ouvrables (${esc(site.heuresOuvrables)}).</span></li>
          <li><span><strong>Appel découverte de 30 minutes</strong> si votre projet s'y prête, par téléphone ou en vidéo.</span></li>
          <li><span><strong>Proposition écrite</strong> : périmètre, prix, calendrier. Vous décidez ensuite, sans pression.</span></li>
        </ol>
        <p class="note-confidentialite mt-6">Nous ne vous inscrirons à aucune liste d'envoi. Vos renseignements servent uniquement à répondre à votre demande.</p>
      </aside>
    </div>
  </div>
</section>`,
  jsonld: [jsonldAriane(ARIANE)],
};

const merci = {
  chemin: "/merci/",
  titre: "Demande enregistrée",
  description: "Votre demande a bien été enregistrée par LD SOLUTIONS.",
  noindex: true,
  cta: null,
  corps: `
<section class="section section--clair">
  <div class="conteneur conteneur--etroit">
    <div class="message-formulaire message-formulaire--succes">
      <h1 class="mb-5">Merci, votre demande est bien enregistrée.</h1>
      <p class="ref-ligne" hidden>Votre numéro de référence : <span class="reference"><!--REF--></span>. Gardez-le pour toute question.</p>
      <p><strong>La suite :</strong> nous vous écrivons sous ${DELAI_REPONSE} pour convenir de la prochaine étape (appel découverte, diagnostic ou proposition, selon votre demande).</p>
      <p>Une précision à ajouter ? Écrivez à <a href="mailto:${site.courriel}">${site.courriel}</a>.</p>
    </div>
    <div class="groupe-boutons mt-6"><a class="bouton bouton--contour" href="/">Retour à l'accueil</a><a class="lien-fleche" href="/demonstrations/">Voir nos démonstrations ${fleche}</a></div>
  </div>
</section>`,
};

const page404 = {
  chemin: "/404",
  fichier: "404.html",
  titre: "Page introuvable",
  description: "Cette page n'existe pas ou a été déplacée.",
  noindex: true,
  corps: `
${heroPage({
  surtitreTexte: "Erreur 404",
  titre: "Ce plan ne mène nulle part.",
  intro: "La page demandée n'existe pas ou a été déplacée. Voici les chemins les plus utiles :",
  boutons: `<a class="bouton" href="/">Retour à l'accueil</a><a class="bouton bouton--contour" href="/tarifs/">Voir les tarifs</a><a class="bouton bouton--contour" href="/contact/">Nous écrire</a>`,
})}`,
};

export default [contact, merci, page404];
