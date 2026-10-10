// Composants réutilisables. Les prix viennent toujours de content/offres.mjs.
import { site } from "./content/site.config.mjs";
import {
  creation, amelioration, maintenance, maintenanceCommun, options, promotions,
  formatPrix, promotionActive, DELAI_REPONSE, TAUX_HORAIRE,
} from "./content/offres.mjs";
import { esc } from "./gabarit.mjs";

/* ---------- Petits éléments ---------- */
export const surtitre = (t) => `<p class="surtitre">${t}</p>`;
export const fleche = `<span class="fleche" aria-hidden="true">→</span>`;

export function ariane(items) {
  const li = items.map((it, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(it.nom)}</span></li>`
    : `<li><a href="${it.href}">${esc(it.nom)}</a></li>`).join("");
  return `<nav class="ariane" aria-label="Fil d'Ariane"><ol>${li}</ol></nav>`;
}

export function heroPage({ arianeItems, surtitreTexte, titre, intro, boutons = "", aside = "" }) {
  return `<section class="hero hero--page sombre">
  <div class="hero__fond grille-plan grille-plan--fondu" aria-hidden="true"></div>
  <div class="hero__lueur" aria-hidden="true"></div>
  <div class="conteneur hero__grille">
    <div class="hero__texte">
      ${arianeItems ? ariane(arianeItems) : ""}
      ${surtitreTexte ? `<p class="surtitre entree">${surtitreTexte}</p>` : ""}
      <h1 class="entree entree--2">${titre}</h1>
      <p class="hero__intro entree entree--3">${intro}</p>
      ${boutons ? `<div class="groupe-boutons entree entree--4">${boutons}</div>` : ""}
    </div>
    ${aside ? `<div class="entree entree--5">${aside}</div>` : ""}
  </div>
</section>`;
}

/* ---------- Téléphone de démonstration du hero (moment signature) ---------- */
export function telephoneHero() {
  return `<div class="scene-appareils">
  <div class="telephone assemblage" role="img" aria-label="Démonstration : la maquette d'un site d'entrepreneur en toiture passe du plan filaire au site fini, puis une demande de soumission arrive. Entreprise fictive.">
    <div class="telephone__ecran">
      <div class="telephone__encoche"></div>
      <div class="mini" aria-hidden="true">
        <div class="mini__nav"><span class="mini__logo">Nordet<b>.</b></span><span class="mini__burger"></span></div>
        <div class="mini__hero">
          <div class="mini__tag">Toitures · Rive-Sud</div>
          <div class="mini__titre">Votre toit, refait avant l'hiver.</div>
          <div class="mini__texte">Inspection gratuite, soumission écrite en 48 h, garantie de main-d'œuvre détaillée.</div>
          <div class="mini__btn">Demander une soumission</div>
        </div>
        <div class="mini__cartes">
          <div class="mini__carte"><i></i><b>Bardeaux</b>Réfection complète</div>
          <div class="mini__carte"><i></i><b>Toit plat</b>Membrane élastomère</div>
          <div class="mini__carte"><i></i><b>Urgence</b>Fuites et dégâts</div>
          <div class="mini__carte"><i></i><b>Inspection</b>Rapport photo</div>
        </div>
        <div class="mini__infos"><span>Longueuil · Brossard · Chambly</span><span>Lun-ven · 7 h à 17 h</span></div>
        <div class="mini__barre">Appeler maintenant</div>
        <div class="mini__notif"><i></i><div><strong>Nouvelle demande de soumission</strong><small>Réfection · bardeaux · reçue à l'instant</small></div></div>
      </div>
      <div class="plan-calque" aria-hidden="true"></div>
    </div>
    <span class="etiquette-demo">Démo · entreprise fictive</span>
  </div>
  <ol class="legende-demo" aria-label="Ce que montre la démonstration">
    <li><b>01</b> Un titre compris en 5 secondes</li>
    <li><b>02</b> Des services lisibles au pouce</li>
    <li><b>03</b> Une action évidente</li>
  </ol>
</div>`;
}

/* ---------- Offres ---------- */
export function prixHTML(prix, prefixe = "", suffixe = "") {
  return `<div class="offre__prix">${prefixe ? `<span class="prefixe">${esc(prefixe)}</span>` : ""}<span class="montant">${formatPrix(prix)}</span>${suffixe ? `<span class="suffixe">${suffixe}</span>` : ""}</div>`;
}

export function carteCreation(o, { complet = false } = {}) {
  const faits = `<dl class="offre__faits">
    <div><dt>Révisions</dt><dd>${esc(o.revisions)}</dd></div>
    <div><dt>Délai</dt><dd>${esc(o.delai)}</dd></div>
    <div><dt>Paiement</dt><dd>${esc(o.paiement)}</dd></div>
    <div><dt>Après</dt><dd>${esc(o.garantie)}</dd></div>
  </dl>`;
  return `<article class="offre${o.recommande ? " offre--recommandee" : ""}" id="offre-${o.id}">
  ${o.recommande ? `<span class="offre__ruban">Le plus choisi pour une PME</span>` : ""}
  <h3 class="offre__nom">${esc(o.nom)}</h3>
  ${prixHTML(o.prix, o.prefixe, "taxes en sus")}
  <p class="offre__accroche">${esc(o.accroche)}</p>
  <p class="offre__pourqui">${esc(o.pourQui)}</p>
  <p class="offre__perimetre">${esc(o.perimetre)}</p>
  <ul class="liste-coches">${(complet ? o.inclus : o.inclus.slice(0, 5)).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  ${complet ? faits + `<details><summary>Non inclus</summary><ul class="liste-moins">${o.exclusions.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>`
    : `<details><summary>Tout le détail</summary><ul class="liste-coches">${o.inclus.slice(5).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>${faits}<ul class="liste-moins mt-4">${o.exclusions.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></details>`}
  <a class="bouton${o.recommande ? "" : " bouton--contour"}" href="/contact/?type=creation&amp;formule=${o.id}" data-evenement="clic_offre">Choisir ${esc(o.nom)} ${"<span class=\"fleche\" aria-hidden=\"true\">→</span>"}</a>
</article>`;
}

export function grilleCreation(opts = {}) {
  return `<div class="offres offres--3">${creation.map((o) => carteCreation(o, opts)).join("")}</div>`;
}

export function carteMaintenance(m, { complet = true } = {}) {
  return `<article class="offre${m.recommande ? " offre--recommandee" : ""}" id="maintenance-${m.id}">
  ${m.recommande ? `<span class="offre__ruban">Recommandée</span>` : ""}
  <h3 class="offre__nom">Maintenance ${esc(m.nom)}</h3>
  ${prixHTML(m.prixMois, "", "par mois, taxes en sus")}
  <p class="offre__pourqui">ou ${formatPrix(m.prixAn)} par an (12 mois pour le prix de 10)</p>
  <p class="offre__accroche">${esc(m.accroche)}</p>
  <ul class="liste-coches">${(complet ? m.inclus : m.inclus.slice(0, 4)).map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  <dl class="offre__faits">
    <div><dt>Temps inclus</dt><dd>${esc(m.tempsInclus)}</dd></div>
    <div><dt>Réponse</dt><dd>${esc(m.reponse)}</dd></div>
    <div><dt>Engagement</dt><dd>Mois par mois, préavis de 30 jours</dd></div>
  </dl>
  <a class="bouton${m.recommande ? "" : " bouton--contour"}" href="/contact/?type=maintenance&amp;niveau=${m.id}" data-evenement="clic_offre">Choisir ${esc(m.nom)} ${fleche}</a>
</article>`;
}

export function grilleMaintenance(opts = {}) {
  return `<div class="offres offres--3">${maintenance.map((m) => carteMaintenance(m, opts)).join("")}</div>`;
}

export function horsForfaitMaintenance() {
  return `<div class="deux-colonnes mt-7">
  <div><h3 class="mb-5">Facturé en supplément</h3><ul class="liste-moins">${maintenanceCommun.horsForfait.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>
  <div><h3 class="mb-5">Bon à savoir</h3><ul class="liste-coches">
    <li>${esc(maintenanceCommun.engagement)}</li>
    <li>${esc(maintenanceCommun.annuel)}</li>
    <li>Interventions hors forfait : ${TAUX_HORAIRE} $ l'heure, par tranche de 15 minutes, toujours approuvées par vous avant.</li>
    <li>Heures ouvrables : ${esc(maintenanceCommun.heuresOuvrables)}. La surveillance est automatique 24 h sur 24 ; les interventions se font en heures ouvrables.</li>
  </ul></div>
</div>`;
}

export function carteAmelioration(a) {
  const prix = a.prix === null ? (a.affichage || "Sur devis") : a.prix === 0 ? (a.affichage || "Offert") : formatPrix(a.prix);
  return `<article class="offre offre--compacte" id="${a.id}">
  <h3 class="offre__nom">${esc(a.nom)}</h3>
  <div class="offre__prix">${a.prefixe ? `<span class="prefixe">${esc(a.prefixe)}</span>` : ""}<span class="montant">${esc(prix)}</span>${a.prix ? `<span class="suffixe">taxes en sus</span>` : ""}</div>
  <p class="offre__pourqui">${esc(a.description)}</p>
  <p class="offre__perimetre">${esc(a.conditions)}</p>
</article>`;
}

export function promosHTML({ ids } = {}) {
  const actives = promotions.filter((p) => promotionActive(p) && (!ids || ids.includes(p.id)));
  if (!actives.length) return "";
  return `<div class="promos">${actives.map((p) => `<div class="promo"${p.finLe ? ` data-fin-promo="${p.finLe}"` : ""}>
    <p class="promo__titre">${esc(p.titre)}</p>
    <p>${esc(p.texte)}</p>
    <small>Conditions : ${esc(p.conditions)}</small>
  </div>`).join("")}</div>`;
}

export function tableauOptions() {
  const lignes = options.map((o) => {
    const prix = o.statut === "inclus" ? "Inclus" : o.prix === null ? "Sur devis après étude" : `${o.prefixe ? o.prefixe.toLowerCase() + " " : ""}${formatPrix(o.prix)}${o.unite ? " " + o.unite : ""}`;
    const statut = { disponible: "Prix fixe", etude: "Après étude", inclus: "Inclus" }[o.statut];
    return `<tr><th scope="row">${esc(o.nom)}</th><td data-label="Prix">${esc(prix)}</td><td data-label="Modalité">${statut}</td></tr>`;
  }).join("");
  return `<table class="comparatif"><caption class="visuellement-cache">Options et services complémentaires</caption>
<thead><tr><th scope="col">Option</th><th scope="col">Prix (taxes en sus)</th><th scope="col">Modalité</th></tr></thead><tbody>${lignes}</tbody></table>`;
}

/* ---------- Processus ---------- */
export const ETAPES = [
  { t: "Appel découverte", d: "30 minutes pour comprendre votre entreprise, vos clients et ce que le site doit produire.", duree: "Gratuit · sans engagement" },
  { t: "Proposition écrite", d: "Périmètre, prix, calendrier et conditions sur un seul document. Vous signez seulement si tout est clair.", duree: "Sous 3 jours ouvrables" },
  { t: "Maquette", d: "Vous voyez la page d'accueil sur téléphone et ordinateur avant la construction du site.", duree: "Semaine 1 à 2" },
  { t: "Construction et révisions", d: "Le site est construit, testé, puis ajusté selon vos commentaires, dans le nombre de rondes prévu.", duree: "Selon la formule" },
  { t: "Mise en ligne et suivi", d: "Vérifications finales, mise en ligne, prise en main, puis corrections incluses pendant 30 jours.", duree: "Le jour J et après" },
];

export function processus() {
  return `<ol class="processus">${ETAPES.map((e) => `<li><h3>${e.t}</h3><p>${e.d}</p><span class="duree">${e.duree}</span></li>`).join("")}</ol>`;
}

/* ---------- Engagements (confiance sans fausse preuve) ---------- */
export const ENGAGEMENTS = [
  { k: "01", t: "Prix publiés", d: "Nos tarifs sont sur le site. Le devis reprend ces prix et précise tout ce qui est inclus et exclu." },
  { k: "02", t: "Contrat écrit", d: "Périmètre, nombre de révisions, délais et paiements sont écrits avant le début du travail." },
  { k: "03", t: "Votre site vous appartient", d: "Nom de domaine et hébergement à votre nom. Au paiement complet, le site et ses contenus vous sont cédés." },
  { k: "04", t: `Réponse sous ${DELAI_REPONSE}`, d: "Chaque demande reçue par le site obtient une première réponse dans ce délai, en heures ouvrables." },
  { k: "05", t: "Conformité québécoise incluse", d: "Site en français, politique de confidentialité, aucun témoin de suivi sans consentement (Loi 25)." },
  { k: "06", t: "Aucune fausse promesse", d: "Pas de « première position sur Google garantie », pas de faux avis. Des engagements que nous pouvons tenir." },
];

export function engagements(liste = ENGAGEMENTS) {
  return `<ul class="engagements engagements--3">${liste.map((e) => `<li class="engagement"><h3><span>${e.k}</span>${e.t}</h3><p>${e.d}</p></li>`).join("")}</ul>`;
}

/* ---------- Démonstrations ---------- */
export const DEMOS = [
  {
    cls: "toiture", nom: "Nordet Toitures", secteur: "Entrepreneur en toiture",
    probleme: "Les clients comparent trois entrepreneurs sur leur téléphone, souvent le soir.",
    reponse: "Services en liste courte, demande de soumission en un geste, licence RBQ visible.",
    ecran: `<div class="demo__site ds-a"><div class="ds-a__top"><div class="ds-a__k">TOITURES · RIVE-SUD</div><div class="ds-a__t">Votre toit, refait avant l'hiver.</div><span class="ds-a__b">Demander une soumission</span></div><div class="ds-a__l"><span>Bardeaux d'asphalte <i>→</i></span><span>Toit plat élastomère <i>→</i></span><span>Réparation d'urgence <i>→</i></span><span>Inspection avec rapport <i>→</i></span></div><div class="ds-a__rbq">LICENCE RBQ AFFICHÉE ICI</div></div>`,
  },
  {
    cls: "garage", nom: "Garage Pivot", secteur: "Atelier de mécanique",
    probleme: "Le téléphone sonne sans arrêt pendant la saison des pneus.",
    reponse: "Plages de rendez-vous visibles, prise de rendez-vous en ligne, horaires clairs.",
    ecran: `<div class="demo__site ds-b"><div class="ds-b__top"><div class="ds-b__k">MÉCANIQUE GÉNÉRALE</div><div class="ds-b__t">Pneus d'hiver : réservez.</div></div><div class="ds-b__roue"></div><div class="ds-b__creneaux"><span>LUN 8 h</span><span class="on">MAR 10 h</span><span>MAR 14 h</span><span>MER 9 h</span><span>JEU 13 h</span><span>VEN 8 h</span></div><div class="ds-b__b">Confirmer le rendez-vous</div></div>`,
  },
  {
    cls: "conseil", nom: "Lumen Conseil", secteur: "Cabinet de services-conseils",
    probleme: "Les mandats se gagnent sur la confiance, avant même le premier appel.",
    reponse: "Ton posé, méthode en étapes, prise de rendez-vous pour un appel de découverte.",
    ecran: `<div class="demo__site ds-c"><div class="ds-c__top"><div class="ds-c__k">GESTION ET FINANCES</div><div class="ds-c__t">Des décisions claires pour les PME en croissance.</div><p class="ds-c__p">Diagnostic, plan d'action, suivi trimestriel.</p></div><div class="ds-c__etapes"><span>Diagnostic de départ</span><span>Plan sur 90 jours</span><span>Suivi et ajustements</span></div><div class="ds-c__b">Réserver un appel</div></div>`,
  },
];

export function demonstrations({ detaille = false } = {}) {
  return `<div class="demos">${DEMOS.map((d) => `<article class="demo demo--${d.cls}">
  <div class="demo__cadre" role="img" aria-label="Maquette d'écran de téléphone pour ${esc(d.nom)}, entreprise fictive (${esc(d.secteur.toLowerCase())}).">
    <span class="demo__badge">Démo · fictive</span>
    <div class="demo__ecran" aria-hidden="true">${d.ecran}</div>
  </div>
  <h3>${esc(d.nom)}</h3>
  <dl><dt>Secteur</dt><dd>${esc(d.secteur)}</dd><dt>Enjeu</dt><dd>${esc(d.probleme)}</dd><dt>Réponse</dt><dd>${esc(d.reponse)}</dd></dl>
</article>`).join("")}</div>`;
}

/* ---------- FAQ ---------- */
export function faq(items) {
  return `<div class="faq">${items.map((q) => `<details><summary>${q.q}</summary><div class="reponse">${q.r}</div></details>`).join("")}</div>`;
}

export function faqJsonLd(items) {
  const texte = (h) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: texte(q.q), acceptedAnswer: { "@type": "Answer", text: texte(q.r) } })),
  };
}

/* ---------- Appel final (deux portes) ---------- */
export function appelFinal({ titre = "Prochaine étape : une conversation de 30 minutes.", intro = `Dites-nous où vous en êtes. Vous recevez une première réponse sous ${DELAI_REPONSE}, sans engagement.` } = {}) {
  return `<section class="section section--sombre appel-final" aria-labelledby="appel-final-titre">
  <div class="hero__fond grille-plan grille-plan--fondu" aria-hidden="true"></div>
  <div class="conteneur">
    ${surtitre("Passer à l'action")}
    <h2 id="appel-final-titre">${titre}</h2>
    <p class="texte-secondaire mt-4">${intro}</p>
    <div class="portes">
      <a class="porte" href="/contact/?type=creation" data-evenement="clic_devis">
        <span class="porte__k">Vous n'avez pas de site, ou il faut le remplacer</span>
        <strong>Créer mon site web</strong>
        <span class="texte-secondaire">Formules à partir de ${formatPrix(creation[0].prix)}, prix publiés.</span>
        <span class="bouton faux-bouton">Demander un devis ${fleche}</span>
      </a>
      <a class="porte" href="/audit/" data-evenement="clic_audit">
        <span class="porte__k">Vous avez déjà un site</span>
        <strong>Améliorer mon site</strong>
        <span class="texte-secondaire">Diagnostic express offert : 5 problèmes prioritaires et leurs pistes de correction.</span>
        <span class="bouton bouton--contour faux-bouton">Demander mon audit ${fleche}</span>
      </a>
    </div>
    <div class="contact-direct">
      <span class="texte-secondaire">Vous préférez écrire ?</span>
      <a class="courriel-affiche" href="mailto:${site.courriel}" data-evenement="clic_courriel">${site.courriel}</a>
      <button class="bouton-copier" type="button" data-copier="${site.courriel}" hidden>Copier l'adresse</button>
    </div>
  </div>
</section>`;
}

/* ---------- Icônes de plan (tracés) ---------- */
export const ICONES = {
  creer: `<svg class="icone-trace" viewBox="0 0 56 56" aria-hidden="true"><rect x="8" y="10" width="40" height="36" rx="3"/><line x1="8" y1="18" x2="48" y2="18"/><rect x="14" y="24" width="16" height="10" rx="1.5"/><line x1="34" y1="25" x2="42" y2="25"/><line x1="34" y1="30" x2="42" y2="30"/><line x1="14" y1="40" x2="42" y2="40"/><polyline points="4,6 4,4 6,4"/><polyline points="50,4 52,4 52,6"/></svg>`,
  ameliorer: `<svg class="icone-trace" viewBox="0 0 56 56" aria-hidden="true"><rect x="8" y="12" width="40" height="32" rx="3"/><path d="M14 36 L22 28 L28 32 L40 20"/><polyline points="34,20 40,20 40,26"/><line x1="8" y1="50" x2="48" y2="50"/></svg>`,
  entretenir: `<svg class="icone-trace" viewBox="0 0 56 56" aria-hidden="true"><path d="M28 6 L46 13 V27 C46 38 38 46 28 50 C18 46 10 38 10 27 V13 Z"/><polyline points="20,28 26,34 37,22"/></svg>`,
};

/* ---------- Formulaire de demande (4 parcours) ---------- */
const TYPES_FORM = [
  { id: "creation", titre: "Créer un site", texte: "Nouveau site ou remplacement" },
  { id: "audit", titre: "Améliorer mon site", texte: "Audit, corrections, refonte" },
  { id: "maintenance", titre: "Maintenance", texte: "Entretien de mon site" },
  { id: "discussion", titre: "Discuter", texte: "Une question, un projet à préciser" },
];

const opt = (liste, choisi = "") => liste.map(([v, l]) => `<option value="${v}"${v === choisi ? " selected" : ""}>${l}</option>`).join("");

export function formulaireDemande({ typeDefaut = "creation", typesVisibles = null, titre = "Votre demande", idPrefixe = "f", formuleAudit = "" } = {}) {
  const types = typesVisibles ? TYPES_FORM.filter((t) => typesVisibles.includes(t.id)) : TYPES_FORM;
  const p = idPrefixe;
  const choixTypes = types.length > 1 ? `<fieldset>
    <legend>Que souhaitez-vous faire ?</legend>
    <div class="choix-types">${types.map((t) => `<div class="choix-type"><input type="radio" id="${p}-type-${t.id}" name="type" value="${t.id}"${t.id === typeDefaut ? " checked" : ""}><label for="${p}-type-${t.id}"><b>${t.titre}</b><span>${t.texte}</span></label></div>`).join("")}</div>
  </fieldset>` : `<input type="hidden" name="type" value="${types[0].id}">`;

  return `<form class="formulaire" action="/api/demandes" method="post" novalidate data-formulaire-demande data-type-defaut="${typeDefaut}">
  <h2 class="visuellement-cache">${esc(titre)}</h2>
  ${choixTypes}
  <div class="selection-estimateur" data-selection-estimateur hidden></div>

  <fieldset data-pour="creation">
    <legend>Votre projet de site</legend>
    <div class="champ"><label for="${p}-formule">Formule envisagée <span class="facultatif">(facultatif)</span></label>
      <select id="${p}-formule" name="formule">${opt([["", "Choisir…"], ["depart", `Départ · ${formatPrix(creation[0].prix)}`], ["professionnel", `Professionnel · ${formatPrix(creation[1].prix)}`], ["sur-mesure", `Sur mesure · dès ${formatPrix(creation[2].prix)}`], ["je-ne-sais-pas", "Je ne sais pas encore"]])}</select></div>
    <div class="rangee-champs">
      <div class="champ"><label for="${p}-echeance-c">Échéance souhaitée <span class="facultatif">(facultatif)</span></label>
        <select id="${p}-echeance-c" name="echeance">${opt([["", "Choisir…"], ["des-que-possible", "Dès que possible"], ["1-mois", "D'ici un mois"], ["1-3-mois", "Dans 1 à 3 mois"], ["plus-tard", "Plus tard"]])}</select></div>
      <div class="champ"><label for="${p}-budget">Budget prévu <span class="facultatif">(facultatif)</span></label>
        <select id="${p}-budget" name="budget">${opt([["", "Choisir…"], ["moins-1500", "Moins de 1 500 $"], ["1500-3000", "1 500 $ à 3 000 $"], ["3000-6000", "3 000 $ à 6 000 $"], ["plus-6000", "Plus de 6 000 $"], ["a-definir", "À définir ensemble"]])}</select></div>
    </div>
    <input type="hidden" name="options" value="">
    <input type="hidden" name="estimation" value="">
  </fieldset>

  <fieldset data-pour="audit">
    <legend>Le site à analyser</legend>
    <div class="champ"><label for="${p}-site-a">Adresse de votre site</label>
      <input id="${p}-site-a" name="site_actuel" type="text" inputmode="url" autocomplete="url" placeholder="www.monentreprise.ca" data-requis-pour="audit" aria-describedby="${p}-site-a-err"><p class="erreur" id="${p}-site-a-err" hidden></p></div>
    <div class="champ"><span class="etiquette" id="${p}-fa-lbl">Formule</span>
      <div class="cases" role="radiogroup" aria-labelledby="${p}-fa-lbl">
        <label class="case"><input type="radio" name="formule_audit" value="diagnostic-express"${formuleAudit !== "audit-complet" ? " checked" : ""}><span><strong>Diagnostic express (offert)</strong> : 5 problèmes prioritaires, réponse écrite sous 3 jours ouvrables</span></label>
        <label class="case"><input type="radio" name="formule_audit" value="audit-complet"${formuleAudit === "audit-complet" ? " checked" : ""}><span><strong>Audit complet (390 $)</strong> : plus de 30 points, rapport priorisé et appel de 45 minutes, crédité sur un projet signé</span></label>
      </div></div>
    <div class="rangee-champs">
      <div class="champ"><label for="${p}-objectif">Objectif principal <span class="facultatif">(facultatif)</span></label>
        <select id="${p}-objectif" name="objectif_audit">${opt([["", "Choisir…"], ["plus-de-demandes", "Recevoir plus de demandes"], ["mobile", "Améliorer l'affichage sur téléphone"], ["vitesse", "Rendre le site plus rapide"], ["referencement", "Être mieux trouvé sur Google"], ["modernisation", "Moderniser l'image"], ["autre", "Autre"]])}</select></div>
      <div class="champ"><label for="${p}-echeance-a">Échéance <span class="facultatif">(facultatif)</span></label>
        <select id="${p}-echeance-a" name="echeance">${opt([["", "Choisir…"], ["des-que-possible", "Dès que possible"], ["1-mois", "D'ici un mois"], ["1-3-mois", "Dans 1 à 3 mois"], ["plus-tard", "Plus tard"]])}</select></div>
    </div>
  </fieldset>

  <fieldset data-pour="maintenance">
    <legend>Le site à entretenir</legend>
    <div class="champ"><label for="${p}-site-m">Adresse de votre site</label>
      <input id="${p}-site-m" name="site_actuel" type="text" inputmode="url" autocomplete="url" placeholder="www.monentreprise.ca" data-requis-pour="maintenance" aria-describedby="${p}-site-m-err"><p class="erreur" id="${p}-site-m-err" hidden></p></div>
    <div class="rangee-champs">
      <div class="champ"><label for="${p}-plateforme">Plateforme <span class="facultatif">(si vous la connaissez)</span></label>
        <select id="${p}-plateforme" name="plateforme">${opt([["", "Choisir…"], ["wordpress", "WordPress"], ["wix", "Wix"], ["squarespace", "Squarespace"], ["shopify", "Shopify"], ["sur-mesure", "Développement sur mesure"], ["autre", "Autre"], ["inconnue", "Je ne sais pas"]])}</select></div>
      <div class="champ"><label for="${p}-niveau">Formule <span class="facultatif">(facultatif)</span></label>
        <select id="${p}-niveau" name="niveau_maintenance">${opt([["", "Choisir…"], ["essentielle", "Essentielle · 49 $/mois"], ["professionnelle", "Professionnelle · 119 $/mois"], ["prioritaire", "Prioritaire · 229 $/mois"], ["conseil", "Conseillez-moi"]])}</select></div>
    </div>
  </fieldset>

  <fieldset data-pour="discussion">
    <legend>Pour vous répondre au mieux</legend>
    <div class="champ"><span class="etiquette" id="${p}-pref-lbl">Vous préférez être contacté par</span>
      <div class="cases" role="radiogroup" aria-labelledby="${p}-pref-lbl">
        <label class="case"><input type="radio" name="preference_contact" value="courriel" checked><span>Courriel</span></label>
        <label class="case"><input type="radio" name="preference_contact" value="telephone"><span>Téléphone (indiquez votre numéro ci-dessous)</span></label>
      </div></div>
  </fieldset>

  <fieldset>
    <legend>Vos coordonnées</legend>
    <div class="rangee-champs">
      <div class="champ"><label for="${p}-nom">Nom</label>
        <input id="${p}-nom" name="nom" type="text" autocomplete="name" required maxlength="100" aria-describedby="${p}-nom-err"><p class="erreur" id="${p}-nom-err" hidden></p></div>
      <div class="champ"><label for="${p}-entreprise">Entreprise <span class="facultatif">(facultatif)</span></label>
        <input id="${p}-entreprise" name="entreprise" type="text" autocomplete="organization" maxlength="150"></div>
    </div>
    <div class="rangee-champs">
      <div class="champ"><label for="${p}-courriel">Courriel</label>
        <input id="${p}-courriel" name="courriel" type="email" autocomplete="email" required maxlength="254" aria-describedby="${p}-courriel-err"><p class="erreur" id="${p}-courriel-err" hidden></p></div>
      <div class="champ"><label for="${p}-telephone">Téléphone <span class="facultatif">(facultatif)</span></label>
        <input id="${p}-telephone" name="telephone" type="tel" autocomplete="tel" maxlength="30" aria-describedby="${p}-telephone-err"><p class="erreur" id="${p}-telephone-err" hidden></p></div>
    </div>
    <div class="champ"><label for="${p}-secteur">Secteur d'activité <span class="facultatif">(facultatif)</span></label>
      <select id="${p}-secteur" name="secteur">${opt([["", "Choisir…"], ["construction", "Construction, rénovation, métiers"], ["automobile", "Services automobiles"], ["services-professionnels", "Services professionnels, B2B"], ["nettoyage-entretien", "Nettoyage, entretien"], ["restauration-commerce", "Restauration, commerce"], ["immobilier", "Immobilier, location"], ["sante-bien-etre", "Santé, bien-être"], ["autre", "Autre"]])}</select></div>
    <div class="champ"><label for="${p}-message">Votre message <span class="facultatif" data-message-facultatif>(facultatif)</span></label>
      <p class="aide" id="${p}-message-aide">Ce que fait votre entreprise, ce qui ne va pas aujourd'hui, ce que vous aimeriez obtenir.</p>
      <textarea id="${p}-message" name="message" rows="5" maxlength="5000" data-requis-pour="discussion" aria-describedby="${p}-message-aide ${p}-message-err"></textarea><p class="erreur" id="${p}-message-err" hidden></p></div>
  </fieldset>

  <div class="piege" aria-hidden="true"><label for="${p}-piege">Ne pas remplir ce champ</label><input id="${p}-piege" name="adresse_complementaire" type="text" tabindex="-1" autocomplete="off"></div>
  <input type="hidden" name="t" value="">
  <input type="hidden" name="page_origine" value="">

  <p class="note-confidentialite">Vos renseignements servent uniquement à répondre à cette demande. Ils sont conservés au plus 24 mois si aucun contrat ne suit, ne sont ni vendus ni partagés, et vous pouvez en demander la suppression à tout moment. <a href="/politique-de-confidentialite/">Politique de confidentialité</a>.</p>
  <div data-message-formulaire aria-live="polite"></div>
  <button class="bouton bouton--plein-largeur" type="submit" data-bouton-envoyer>Envoyer ma demande ${fleche}</button>
  <p class="note-confidentialite">Réponse sous ${DELAI_REPONSE}. Vous pouvez aussi écrire directement à <a href="mailto:${site.courriel}" data-evenement="clic_courriel">${site.courriel}</a>.</p>
</form>`;
}

/* ---------- Données structurées ---------- */
export function jsonldOrganisation() {
  const org = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": site.url + "/#entreprise",
    name: "LD SOLUTIONS",
    url: site.url + "/",
    email: site.courriel,
    logo: site.url + "/assets/img/apple-touch-icon.png",
    image: site.url + "/assets/img/og-ld-solutions.png",
    description: "Création, amélioration et maintenance de sites web pour les PME et entrepreneurs du Québec.",
    areaServed: { "@type": "AdministrativeArea", name: "Québec" },
    knowsLanguage: "fr-CA",
    priceRange: "$$",
    makesOffer: creation.map((o) => ({
      "@type": "Offer",
      name: `Site web ${o.nom}`,
      price: o.prix,
      priceCurrency: "CAD",
      ...(o.prefixe ? { priceSpecification: { "@type": "PriceSpecification", minPrice: o.prix, priceCurrency: "CAD" } } : {}),
      url: site.url + "/tarifs/#offre-" + o.id,
    })),
  };
  if (site.telephone) org.telephone = site.telephone;
  return org;
}

export function jsonldService({ nom, description, chemin, offres = [] }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nom,
    description,
    url: site.url + chemin,
    provider: { "@id": site.url + "/#entreprise" },
    areaServed: { "@type": "AdministrativeArea", name: "Québec" },
    ...(offres.length ? { offers: offres.map((o) => ({ "@type": "Offer", name: o.nom, price: o.prix, priceCurrency: "CAD" })) } : {}),
  };
}

export function jsonldAriane(items) {
  return {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.nom, item: site.url + it.href })),
  };
}
