// Gabarit commun à toutes les pages : <head> SEO, en-tête, menu mobile, pied de page, barre d'action mobile.
import { site } from "./content/site.config.mjs";

// Typographie française : espaces insécables (fines avant ; ! ? : et dans les guillemets,
// normales entre un nombre et son unité). Appliquée au texte seulement, jamais aux balises ni aux scripts.
const FINE = "\u202F", INSEC = "\u00A0";
export function typographie(html) {
  return html.split(/(<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>)/).map((morceau, i) => {
    if (i % 2 === 1) return morceau;
    return morceau
      .replace(/ ([:;!?»])/g, FINE + "$1")
      .replace(/« /g, "«" + FINE)
      .replace(/(\d) (\$|%|h\b|min\b|jours?\b|mois\b|ans?\b|semaines?\b|pages?\b|heures?\b|minutes?\b|Ko\b|Mo\b|px\b|mots\b|points?\b|rondes?\b)/g, "$1" + INSEC + "$2");
  }).join("");
}

/** Titre principal en « rideau » : chaque mot est placé dans un masque pour monter à son tour. */
export function titreRideau(html) {
  let rang = 0;
  return html.replace(/(<h1\b[^>]*>)([\s\S]*?)(<\/h1>)/, (_, ouv, contenu, ferm) => {
    const morceaux = typographie(contenu).split(/(<[^>]+>)/);
    const sortie = morceaux.map((m, i) => {
      if (i % 2 === 1 || !m.trim()) return m;
      return m.split(/( +)/).map((mot) => {
        if (!mot.trim()) return mot;
        rang += 1;
        return `<span class="mot m${Math.min(rang, 14)}"><span>${mot}</span></span>`;
      }).join("");
    }).join("");
    return ouv + sortie + ferm;
  });
}

export const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const LOGO_SVG = `<svg class="monogramme" viewBox="0 0 34 34" aria-hidden="true" focusable="false"><circle cx="17" cy="17" r="15.9" fill="none" stroke="currentColor" stroke-width=".9"/><path fill="currentColor" d="M8.6 10h2.2v11.4h5.6v2.2H8.6z"/><path class="monogramme__d" fill="#A8844A" d="M17.6 10h2.2v13.6h-2.2zM19.8 10h.8a6.8 6.8 0 0 1 0 13.6h-.8v-2.2h.8a4.6 4.6 0 0 0 0-9.2h-.8z"/></svg>`;

const NAV = [
  { href: "/creation-site-web/", libelle: "Créer", cle: "creation", detail: "01" },
  { href: "/refonte-amelioration/", libelle: "Améliorer", cle: "refonte", detail: "02" },
  { href: "/maintenance/", libelle: "Entretenir", cle: "maintenance", detail: "03" },
  { href: "/tarifs/", libelle: "Tarifs", cle: "tarifs" },
  { href: "/audit/", libelle: "Audit", cle: "audit" },
  { href: "/a-propos/", libelle: "À propos", cle: "a-propos" },
];
const NAV_MOBILE_PLUS = [
  { href: "/demonstrations/", libelle: "Démonstrations", cle: "demonstrations" },
  { href: "/services-complementaires/", libelle: "Services complémentaires", cle: "services" },
  { href: "/faq/", libelle: "Questions fréquentes", cle: "faq" },
];

function entete(navActif) {
  const liens = NAV.map((n) => `<li><a href="${n.href}"${n.cle === navActif ? ' aria-current="page"' : ""}>${n.libelle}</a></li>`).join("");
  const liensMobile = [...NAV, ...NAV_MOBILE_PLUS].map((n) =>
    `<li><a class="menu-mobile__lien" href="${n.href}"${n.cle === navActif ? ' aria-current="page"' : ""}>${n.libelle}${n.detail ? `<small>${n.detail}</small>` : ""}</a></li>`).join("");
  const enveloppe = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="m4 6.5 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>`;
  return `<header class="entete">
  <div class="conteneur entete__barre">
    <a class="logo" href="/">${LOGO_SVG}<span class="logo__texte">${esc(site.nom)}<span>${esc(site.signature)}</span></span><span class="visuellement-cache">, accueil</span></a>
    <nav class="nav-principale" aria-label="Navigation principale"><ul>${liens}</ul></nav>
    <div class="entete__actions">
      <a class="bouton bouton--petit entete__cta" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis</a>
      <button class="bouton-menu" type="button" aria-expanded="false" aria-controls="menu-mobile"><span class="bouton-menu__icone" aria-hidden="true"></span><span class="bouton-menu__libelle">Menu</span></button>
    </div>
  </div>
  <div class="menu-mobile" id="menu-mobile" hidden>
    <div class="menu-mobile__poignee"><span>Menu</span><button class="menu-mobile__fermer" type="button" data-fermer-menu>Fermer</button></div>
    <nav aria-label="Navigation mobile"><ul>${liensMobile}</ul></nav>
    <a class="bouton bouton--plein-largeur" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis</a>
    <a class="bouton bouton--contour bouton--plein-largeur" href="/audit/" data-evenement="clic_audit">Demander mon audit</a>
    <div class="menu-mobile__secondaire"><a href="/contact/">Contact</a>${site.telephone ? `<a href="tel:${esc(site.telephoneLien)}" data-evenement="clic_telephone">${esc(site.telephone)}</a>` : ""}<a href="mailto:${site.courriel}" data-evenement="clic_courriel">${enveloppe}${site.courriel}</a></div>
  </div>
  <div class="progression" aria-hidden="true"><i data-progression></i></div>
</header>`;
}

// Libellés courts du sommaire collant (pastilles), par identifiant de titre de section.
const SOMMAIRE = {
  "titre-approche": "Approche", "titre-qui": "Qui", "titre-principes": "Principes", "titre-engagements-ap": "Engagements", "titre-methode-ap": "Méthode", "titre-pas": "Nos refus",
  "titre-domaines": "Ce qu'on examine", "titre-formules-a": "Formules", "titre-apres": "Après l'audit", "titre-demande-a": "Demande", "titre-faq-a": "Questions",
  "titre-types": "Types de sites", "titre-formules": "Formules", "titre-base": "Inclus", "titre-fournir": "À fournir", "titre-processus-c": "Étapes", "titre-limites": "Limites", "titre-faq-c": "Questions",
  "titre-demo-toiture": "Toiture", "titre-demo-garage": "Garage", "titre-demo-conseil": "Cabinet-conseil", "titre-demo-vous": "Votre site",
  "titre-faq-general": "Générales", "titre-faq-prix": "Prix", "titre-faq-creation": "Création", "titre-faq-refonte": "Refonte", "titre-faq-audit": "Audit", "titre-faq-maintenance": "Maintenance", "titre-faq-contrat": "Contrat",
  "titre-roles": "Ce qui est couvert", "titre-formules-m": "Formules", "titre-demande-m": "Demande", "titre-faq-m": "Questions",
  "titre-symptomes": "Problèmes", "titre-methode": "Méthode", "titre-offres-r": "Prix", "titre-faq-r": "Questions",
  "titre-services": "Services", "titre-grille-options": "Prix", "titre-principe": "Principe",
  "titre-t-creation": "Création", "titre-estimateur": "Estimateur", "titre-t-amelioration": "Refonte", "titre-t-maintenance": "Maintenance", "titre-t-options": "Options", "titre-t-promos": "Avantages", "titre-modalites": "Paiement", "titre-faq-t": "Questions",
};
const SOMMAIRE_PREFIXES = { "titre-pb-": "Constats", "titre-rep-": "Votre site", "titre-offre-": "Formule", "titre-faq-": "Questions" };

const slug = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48);

/** Ajoute des identifiants aux titres de texte long (pages légales) et construit le sommaire collant. */
function sommaire(corps, chemin) {
  if (chemin === "/" || chemin === "/contact/") return corps;
  // Pages légales : les intertitres de la prose reçoivent un identifiant
  corps = corps.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, t) => `<h2 id="s-${slug(t)}">${t}</h2>`);
  const entrees = [];
  for (const m of corps.matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)) {
    const [, id, titre] = m;
    let libelle = SOMMAIRE[id];
    if (!libelle) {
      const prefixe = Object.keys(SOMMAIRE_PREFIXES).find((k) => id.startsWith(k));
      if (prefixe) libelle = SOMMAIRE_PREFIXES[prefixe];
    }
    if (!libelle && id.startsWith("s-")) {
      libelle = titre.replace(/<[^>]+>/g, "").replace(/^\s*\d+\.\s*/, "").trim();
      if (libelle.length > 24 && libelle.includes(",")) libelle = libelle.split(",")[0];
      if (libelle.length > 30) libelle = libelle.slice(0, 28).replace(/\s+\S*$/, "") + "…";
    }
    if (libelle) entrees.push({ id, libelle });
  }
  if (entrees.length < 3) return corps;
  const nav = `<nav class="sommaire" aria-label="Sur cette page" data-sommaire>
  <ol class="sommaire__liste">${entrees.map((e) => `<li><a href="#${e.id}">${esc(e.libelle)}</a></li>`).join("")}</ol>
</nav>`;
  const fin = corps.indexOf("</section>");
  return fin === -1 ? corps : corps.slice(0, fin + 10) + "\n" + nav + corps.slice(fin + 10);
}

function piedDePage(p) {
  const annee = new Date().getFullYear();
  const lignesIdentite = [
    site.neq ? `NEQ ${esc(site.neq)}` : null,
    site.adressePostale ? esc(site.adressePostale) : null,
  ].filter(Boolean).join(" · ");
  const groupe = (titre, liens) => `<div class="pied__groupe"><h2>${titre}</h2><ul>${liens.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join("")}</ul></div>`;
  return `<footer class="pied">
  <div class="conteneur">
    <div class="pied__tete">
      <a class="pied__signature" href="/">${LOGO_SVG}<span>Leonel <em>Djikeleng</em></span><span class="visuellement-cache">, accueil</span></a>
      <p>Atelier web à ${esc(site.ville || "Québec")}. Créer, améliorer, entretenir des sites pour les entreprises du ${esc(site.zoneServie)}.</p>
      <p class="pied__contact"><a href="mailto:${site.courriel}" data-evenement="clic_courriel">${site.courriel}</a>${site.telephone ? ` · <a href="tel:${esc(site.telephoneLien)}" data-evenement="clic_telephone">${esc(site.telephone)}</a>` : ""}</p>
    </div>
    <div class="pied__liens">
      ${groupe("Services", [["/creation-site-web/", "Création"], ["/refonte-amelioration/", "Refonte"], ["/maintenance/", "Maintenance"], ["/services-complementaires/", "Options"], ["/audit/", "Audit"], ["/tarifs/", "Tarifs"]])}
      ${groupe("Atelier", [["/a-propos/", "À propos"], ["/demonstrations/", "Démonstrations"], ["/secteurs/entrepreneurs-construction/", "Entrepreneurs"], ["/secteurs/services-automobiles/", "Automobile"], ["/secteurs/services-professionnels/", "Professionnels"], ["/faq/", "Questions"], ["/contact/", "Contact"]])}
      ${groupe("Informations", [["/conditions-de-service/", "Conditions de service"], ["/politique-de-confidentialite/", "Confidentialité"], ["/mentions-legales/", "Mentions légales"], ["/accessibilite/", "Accessibilité"]])}
    </div>
    <p class="pied__etiquette"><span>Conçu à Québec</span><span>Prix en dollars canadiens, taxes en sus le cas échéant</span><span>Aucun témoin de suivi</span><span>© ${annee} ${esc(site.nom)}${lignesIdentite ? ` · ${lignesIdentite}` : ""}</span></p>
  </div>
</footer>`;
}

function barreMobile(cta) {
  if (!cta) return "";
  return `<div class="barre-mobile" data-barre-mobile aria-hidden="true">
  <a class="bouton" href="${cta.href}" tabindex="-1" data-evenement="${cta.evenement || "clic_devis"}">${cta.libelle}</a>
  ${site.telephone
    ? `<a class="barre-mobile__secondaire" href="tel:${esc(site.telephoneLien)}" tabindex="-1" data-evenement="clic_telephone" title="Appeler le ${esc(site.telephone)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6.6 3.5h2.6l1.4 4.1-2 1.5a12.5 12.5 0 0 0 6.3 6.3l1.5-2 4.1 1.4v2.6a1.6 1.6 0 0 1-1.7 1.6C11.5 18.6 5.4 12.5 5 5.2a1.6 1.6 0 0 1 1.6-1.7z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg></a>`
    : `<a class="barre-mobile__secondaire" href="mailto:${site.courriel}" tabindex="-1" data-evenement="clic_courriel" title="Écrire un courriel"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="m4 6.5 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a>`}
</div>`;
}

/**
 * @param {object} p
 * @param {string} p.chemin  ex. "/tarifs/"
 * @param {string} p.titre   balise <title> (sans le nom de marque)
 * @param {string} p.description
 * @param {string} p.corps   HTML du <main>
 * @param {object[]} [p.jsonld]
 * @param {string} [p.navActif]
 * @param {{href:string, libelle:string, evenement?:string}|null} [p.cta]  barre d'action mobile
 * @param {boolean} [p.noindex]
 * @param {object} p.versions  empreintes des fichiers (cache)
 */
export function gabarit(p) {
  const url = site.url + p.chemin;
  // Le nom suit le titre seulement s'il tient dans les 70 caractères affichés par les moteurs de recherche
  const avecNom = `${p.titre} | ${site.nom}`;
  const titreComplet = p.chemin === "/" || avecNom.length > 70 ? p.titre : avecNom;
  const jsonld = (p.jsonld || []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n");
  const cta = p.cta === undefined ? { href: "/contact/?type=creation", libelle: "Demander un devis" } : p.cta;
  return `<!doctype html>
<html lang="fr-CA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titreComplet)}</title>
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${esc(url)}">`}
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_CA">
<meta property="og:site_name" content="Leonel Djikeleng">
<meta property="og:title" content="${esc(p.ogTitre || titreComplet)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(site.url)}/assets/img/og-ld-solutions.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/geist.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=${p.versions.css}">
<script src="/assets/js/site.js?v=${p.versions.js}" defer></script>
${p.formulaire ? `<script src="/assets/js/formulaire.js?v=${p.versions.formulaire}" defer></script>` : ""}
${p.estimateur ? `<script src="/assets/js/estimateur.js?v=${p.versions.estimateur}" defer></script>
<noscript><link rel="stylesheet" href="/assets/css/sans-js.css"></noscript>` : ""}
${jsonld}
</head>
<body${cta ? ' class="a-barre-mobile"' : ""}>
<a class="lien-evitement" href="#contenu">Aller au contenu</a>
${entete(p.navActif)}
<main id="contenu" tabindex="-1">
${sommaire(titreRideau(p.corps), p.chemin)}
</main>
${piedDePage(p)}
${barreMobile(cta)}
</body>
</html>
`;
}
