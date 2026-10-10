// Gabarit commun à toutes les pages : <head> SEO, en-tête, menu mobile, pied de page, barre d'action mobile.
import { site } from "./content/site.config.mjs";

export const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const LOGO_SVG = `<svg viewBox="0 0 34 34" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="31" height="31" fill="none" stroke="currentColor" stroke-opacity=".55"/><path d="M1.5 25.5h4M28.5 8.5h4" stroke="currentColor" stroke-opacity=".55"/><path d="M9 9v16h6.4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"/><path d="M18.6 9h1.4a8 8 0 0 1 0 16h-1.4z" fill="none" stroke="#FFCE3A" stroke-width="2.4"/></svg>`;

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
  return `<header class="entete">
  <div class="conteneur entete__barre">
    <a class="logo" href="/">${LOGO_SVG}<span class="logo__texte">LD <span>SOLUTIONS</span></span><span class="visuellement-cache">, accueil</span></a>
    <nav class="nav-principale" aria-label="Navigation principale"><ul>${liens}</ul></nav>
    <div class="entete__actions">
      <a class="bouton bouton--petit entete__cta" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis</a>
      <button class="bouton-menu" type="button" aria-expanded="false" aria-controls="menu-mobile"><span class="bouton-menu__icone" aria-hidden="true"></span><span class="bouton-menu__libelle">Menu</span></button>
    </div>
  </div>
  <div class="menu-mobile" id="menu-mobile" hidden>
    <div class="menu-mobile__poignee"><span>Plan du site</span><button class="menu-mobile__fermer" type="button" data-fermer-menu>Fermer</button></div>
    <nav aria-label="Navigation mobile"><ul>${liensMobile}</ul></nav>
    <a class="bouton bouton--plein-largeur" href="/contact/?type=creation" data-evenement="clic_devis">Demander un devis</a>
    <a class="bouton bouton--contour bouton--plein-largeur" href="/audit/" data-evenement="clic_audit">Demander mon audit</a>
    <div class="menu-mobile__secondaire"><a href="/contact/">Contact</a><a href="mailto:${site.courriel}" data-evenement="clic_courriel">${site.courriel}</a></div>
  </div>
</header>`;
}

function libellePlanche(p) {
  if (p.chemin === "/") return "Accueil";
  return String(p.titre).split(/\s[:·|]\s|,/)[0].trim().slice(0, 40);
}

function piedDePage(p) {
  const maintenant = new Date();
  const annee = maintenant.getFullYear();
  const maj = maintenant.toLocaleDateString("fr-CA", { month: "long", year: "numeric" });
  const lignesIdentite = [
    site.exploitant ? esc(site.exploitant) : null,
    site.neq ? `NEQ ${esc(site.neq)}` : null,
    site.adressePostale ? esc(site.adressePostale) : null,
  ].filter(Boolean).join(" · ");
  return `<footer class="pied">
  <div class="conteneur">
    <p class="pied__signature" aria-hidden="true">LD<span>/</span>Solutions</p>
    <div class="pied__grille">
      <div class="pied__marque">
        <h2>Atelier</h2>
        <p>Création, amélioration et maintenance de sites web pour les entreprises du ${esc(site.zoneServie)}. Prix publiés, contrat écrit, site à votre nom.</p>
        <p><a href="mailto:${site.courriel}" data-evenement="clic_courriel">${site.courriel}</a>${site.telephone ? `<br><a href="tel:${esc(site.telephone.replace(/[^0-9+]/g, ""))}" data-evenement="clic_telephone">${esc(site.telephone)}</a>` : ""}</p>
      </div>
      <div><h2>Services</h2><ul>
        <li><a href="/creation-site-web/">Création</a></li>
        <li><a href="/refonte-amelioration/">Refonte</a></li>
        <li><a href="/maintenance/">Maintenance</a></li>
        <li><a href="/services-complementaires/">Options</a></li>
        <li><a href="/audit/">Audit</a></li>
        <li><a href="/tarifs/">Tarifs</a></li>
      </ul></div>
      <div><h2>Entreprise</h2><ul>
        <li><a href="/a-propos/">À propos</a></li>
        <li><a href="/demonstrations/">Démonstrations</a></li>
        <li><a href="/secteurs/entrepreneurs-construction/">Entrepreneurs</a></li>
        <li><a href="/secteurs/services-automobiles/">Automobile</a></li>
        <li><a href="/secteurs/services-professionnels/">Professionnels</a></li>
        <li><a href="/faq/">Questions</a></li>
        <li><a href="/contact/">Contact</a></li>
      </ul></div>
      <div><h2>Informations</h2><ul>
        <li><a href="/conditions-de-service/">Conditions de service</a></li>
        <li><a href="/politique-de-confidentialite/">Confidentialité</a></li>
        <li><a href="/mentions-legales/">Mentions légales</a></li>
        <li><a href="/accessibilite/">Accessibilité</a></li>
      </ul></div>
    </div>
    <div class="pied__bas">
      <span>Projet<b>LD SOLUTIONS</b></span>
      <span>Planche<b>${esc(libellePlanche(p))}</b></span>
      <span>Lieu<b>Québec</b></span>
      <span>Mise à jour<b>${esc(maj)}</b></span>
      <span>© ${annee} LD SOLUTIONS${lignesIdentite ? ` · ${lignesIdentite}` : ""} · Prix en dollars canadiens, taxes en sus le cas échéant · Aucun témoin de suivi.</span>
    </div>
  </div>
</footer>`;
}

function barreMobile(cta) {
  if (!cta) return "";
  return `<div class="barre-mobile" data-barre-mobile aria-hidden="true">
  <a class="bouton" href="${cta.href}" tabindex="-1" data-evenement="${cta.evenement || "clic_devis"}">${cta.libelle}</a>
  <a class="bouton bouton--contour barre-mobile__secondaire" href="mailto:${site.courriel}" tabindex="-1" data-evenement="clic_courriel">Courriel</a>
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
  const titreComplet = p.chemin === "/" ? p.titre : `${p.titre} | LD SOLUTIONS`;
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
<meta name="theme-color" content="#0e2563">
<meta property="og:type" content="website">
<meta property="og:locale" content="fr_CA">
<meta property="og:site_name" content="LD SOLUTIONS">
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
<link rel="preload" href="/assets/fonts/big-shoulders-display.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/ibm-plex-sans.woff2" as="font" type="font/woff2" crossorigin>
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
${p.corps}
</main>
${piedDePage(p)}
${barreMobile(cta)}
</body>
</html>
`;
}
