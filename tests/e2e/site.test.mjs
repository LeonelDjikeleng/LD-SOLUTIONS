// Tests de bout en bout dans Chromium (Playwright) sur le site construit (dist/).
// Lancement : npm run test:e2e
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { creerApplication } from "../../server/app.mjs";
import { ouvrirBase } from "../../server/lib/db.mjs";

const require = createRequire(import.meta.url);
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const DIST = path.resolve("dist");

let serveur, base, navigateur, depot, app;
const notifications = [];

before(async () => {
  depot = ouvrirBase(":memory:");
  app = creerApplication({
    env: {},
    depot,
    config: { dossierPublic: DIST, https: false, delaiMinimumMs: 0, limiteDemandes: { nombre: 1000, fenetreMs: 60_000 } },
    courrielleur: { configure: true, notifier: async (d) => { notifications.push(d); return "envoyee"; } },
  });
  serveur = http.createServer(app);
  await new Promise((r) => serveur.listen(0, "127.0.0.1", r));
  base = `http://127.0.0.1:${serveur.address().port}`;
  navigateur = await chromium.launch();
});

after(async () => {
  await navigateur?.close();
  app.arreter();
  await new Promise((r) => serveur.close(r));
});

const PAGES = [
  "/", "/creation-site-web/", "/refonte-amelioration/", "/maintenance/", "/services-complementaires/",
  "/tarifs/", "/audit/", "/demonstrations/", "/secteurs/entrepreneurs-construction/",
  "/secteurs/services-automobiles/", "/secteurs/services-professionnels/", "/a-propos/", "/faq/",
  "/contact/", "/conditions-de-service/", "/politique-de-confidentialite/", "/mentions-legales/", "/accessibilite/",
];

async function nouvellePage(options = {}) {
  const ctx = await navigateur.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, ...options });
  const page = await ctx.newPage();
  page.erreurs = [];
  page.tiers = new Set();
  page.on("pageerror", (e) => page.erreurs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") page.erreurs.push(m.text()); });
  page.on("request", (r) => { const h = new URL(r.url()).host; if (!r.url().startsWith(base) && !r.url().startsWith("data:")) page.tiers.add(h); });
  return { ctx, page };
}

test("chaque page : 200, un seul H1, titre, description, canonique, aucune erreur, aucun tiers, aucun débordement", async () => {
  for (const largeur of [320, 390, 768, 1024, 1440]) {
    const { ctx, page } = await nouvellePage({ viewport: { width: largeur, height: 900 }, isMobile: largeur < 800, hasTouch: largeur < 800 });
    for (const chemin of PAGES) {
      const r = await page.goto(base + chemin, { waitUntil: "load" });
      assert.equal(r.status(), 200, chemin);
      if (largeur === 390) {
        const info = await page.evaluate(() => ({
          h1: document.querySelectorAll("h1").length,
          titre: document.title,
          description: document.querySelector('meta[name="description"]')?.content || "",
          canonique: document.querySelector('link[rel="canonical"]')?.href || "",
          lang: document.documentElement.lang,
          imagesSansAlt: [...document.querySelectorAll("img:not([alt])")].length,
          sautsTitres: (() => {
            let prec = 1, saut = null;
            for (const h of document.querySelectorAll("main h1, main h2, main h3, main h4")) {
              const n = Number(h.tagName[1]);
              if (n > prec + 1 && !h.closest(".visuellement-cache")) saut = `${h.tagName}: ${h.textContent.trim().slice(0, 40)}`;
              prec = n;
            }
            return saut;
          })(),
        }));
        assert.equal(info.h1, 1, `${chemin} : un seul H1`);
        assert.ok(info.titre.length > 10 && info.titre.length <= 70, `${chemin} : titre « ${info.titre} » (${info.titre.length})`);
        assert.ok(info.description.length >= 70 && info.description.length <= 165, `${chemin} : description (${info.description.length})`);
        assert.ok(info.canonique.endsWith(chemin), `${chemin} : canonique`);
        assert.equal(info.lang, "fr-CA");
        assert.equal(info.imagesSansAlt, 0);
        assert.equal(info.sautsTitres, null, `${chemin} : saut de niveau de titre ${info.sautsTitres}`);
      }
      const debord = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      assert.ok(debord <= 0, `${chemin} @${largeur}px : débordement horizontal de ${debord}px`);
    }
    assert.deepEqual(page.erreurs, [], `erreurs console @${largeur}`);
    assert.deepEqual([...page.tiers], [], `requêtes vers des tiers @${largeur}`);
    await ctx.close();
  }
});

test("tous les liens internes mènent à une page existante", async () => {
  const { ctx, page } = await nouvellePage();
  const liens = new Set();
  for (const chemin of PAGES) {
    await page.goto(base + chemin);
    for (const href of await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")))) {
      if (href.startsWith("/") ) liens.add(href.split("#")[0].split("?")[0] || "/");
    }
  }
  for (const lien of liens) {
    const r = await fetch(base + lien, { redirect: "manual" });
    assert.ok([200].includes(r.status), `${lien} -> ${r.status}`);
  }
  await ctx.close();
});

test("accessibilité (axe-core, WCAG 2.1 A/AA) : aucune violation sérieuse ou critique", async () => {
  const { ctx, page } = await nouvellePage({ viewport: { width: 1280, height: 900 }, isMobile: false, hasTouch: false, reducedMotion: "reduce", bypassCSP: true });
  const problemes = [];
  for (const chemin of PAGES) {
    await page.goto(base + chemin);
    await page.addScriptTag({ content: AXE });
    const resultat = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const r = await axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] } });
      return r.violations.filter((v) => ["serious", "critical"].includes(v.impact)).map((v) => `${v.id} (${v.nodes.length}) : ${v.nodes.slice(0, 2).map((n) => n.target.join(" ")).join(" | ")}`);
    });
    for (const p of resultat) problemes.push(`${chemin} → ${p}`);
  }
  await ctx.close();
  assert.deepEqual(problemes, []);
});

test("menu mobile : ouverture, focus, Échap, fermeture", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/");
  const bouton = page.locator(".bouton-menu");
  await bouton.click();
  assert.equal(await bouton.getAttribute("aria-expanded"), "true");
  assert.ok(await page.locator("#menu-mobile").isVisible());
  assert.equal(await page.evaluate(() => document.activeElement.closest("#menu-mobile") !== null), true);
  await page.keyboard.press("Escape");
  assert.equal(await bouton.getAttribute("aria-expanded"), "false");
  assert.equal(await page.locator("#menu-mobile").isVisible(), false);
  // Tiroir : bouton « Fermer » et toucher sur le voile
  await bouton.click();
  await page.locator("[data-fermer-menu]").click();
  assert.equal(await page.locator("#menu-mobile").isVisible(), false);
  await bouton.click();
  await page.mouse.click(195, 120);
  assert.equal(await page.locator("#menu-mobile").isVisible(), false, "toucher le voile ferme le tiroir");
  await bouton.click();
  await page.locator("#menu-mobile a", { hasText: "Tarifs" }).click();
  await page.waitForURL(/\/tarifs\/$/);
  await ctx.close();
});

test("parcours A : estimateur → contact pré-rempli → demande enregistrée avec la sélection", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/tarifs/#estimateur");
  await page.locator('label[for="est-depart"]').click();
  await page.locator("#est-opt-page-sup").check();
  await page.locator("#qte-page-sup").fill("2");
  await page.locator("#est-opt-rendez-vous").check();
  const total = await page.locator("[data-total]").textContent();
  assert.equal(total.replace(/\s/g, ""), "2020$", "1 490 + 2 × 190 + 150");
  await page.locator("[data-lien-devis]").click();
  await page.waitForURL(/\/contact\/\?/);
  assert.ok(await page.locator("[data-selection-estimateur]").isVisible());
  assert.equal(await page.locator("#fc-formule").inputValue(), "depart");
  await page.fill("#fc-nom", "Paul Essai");
  await page.fill("#fc-entreprise", "Plomberie Essai");
  await page.fill("#fc-courriel", "paul@exemple.ca");
  await page.locator("[data-bouton-envoyer]").click();
  const succes = page.locator(".message-formulaire--succes");
  await succes.waitFor();
  const texte = await succes.textContent();
  const ref = texte.match(/LD-\d{6}-[A-Z0-9]{5}/)[0];
  const d = depot.lireParReference(ref);
  assert.ok(d, "demande enregistrée");
  const details = JSON.parse(d.details);
  assert.equal(details.formule, "depart");
  assert.equal(details.estimation, 2020);
  assert.match(details.options, /Page supplémentaire × 2/);
  assert.equal(d.page_origine, "/contact/");
  await ctx.close();
});

test("parcours B : audit, validation des champs puis envoi", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/audit/");
  await page.locator("#demande-audit [data-bouton-envoyer]").click();
  // Erreurs affichées, focus sur le premier champ invalide, rien d'enregistré
  assert.ok(await page.locator("#fa-site-a-err").isVisible());
  assert.equal(await page.evaluate(() => document.activeElement.id), "fa-site-a");
  await page.fill("#fa-site-a", "www.garage-essai.ca");
  await page.locator('input[name="formule_audit"][value="audit-complet"]').check();
  await page.fill("#fa-nom", "Lise Essai");
  await page.fill("#fa-courriel", "lise@exemple.ca");
  await page.locator("#demande-audit [data-bouton-envoyer]").click();
  await page.locator(".message-formulaire--succes").waitFor();
  const texte = await page.locator(".message-formulaire--succes").textContent();
  assert.match(texte, /5 jours ouvrables/, "étapes propres à l'audit complet");
  const ref = texte.match(/LD-\d{6}-[A-Z0-9]{5}/)[0];
  const d = depot.lireParReference(ref);
  assert.equal(d.type, "audit");
  assert.equal(d.site_actuel, "https://www.garage-essai.ca/");
  await ctx.close();
});

test("parcours C et D : changement de type, champs conditionnels", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/contact/?type=maintenance&niveau=professionnelle");
  assert.ok(await page.locator('fieldset[data-pour="maintenance"]').isVisible());
  assert.equal(await page.locator('fieldset[data-pour="creation"]').isVisible(), false);
  assert.equal(await page.locator("#fc-niveau").inputValue(), "professionnelle");
  await page.locator('label[for="fc-type-discussion"]').click();
  assert.ok(await page.locator('fieldset[data-pour="discussion"]').isVisible());
  assert.equal(await page.locator('fieldset[data-pour="maintenance"]').isVisible(), false);
  await page.fill("#fc-nom", "Ana Essai");
  await page.fill("#fc-courriel", "ana@exemple.ca");
  await page.locator("[data-bouton-envoyer]").click();
  assert.ok(await page.locator("#fc-message-err").isVisible(), "message obligatoire pour une discussion");
  await page.fill("#fc-message", "J'aimerais discuter d'une refonte au printemps.");
  await page.locator("[data-bouton-envoyer]").click();
  await page.locator(".message-formulaire--succes").waitFor();
  await ctx.close();
});

test("échec du serveur : aucune fausse confirmation, réponses conservées, solution de secours par courriel", async () => {
  const { ctx, page } = await nouvellePage();
  await page.route("**/api/demandes", (route) => route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ ok: false, message: "Votre demande n'a pas pu être enregistrée." }) }));
  await page.goto(base + "/contact/");
  await page.fill("#fc-nom", "Erreur Essai");
  await page.fill("#fc-courriel", "erreur@exemple.ca");
  await page.fill("#fc-message", "Message à conserver");
  await page.locator("[data-bouton-envoyer]").click();
  const erreur = page.locator(".message-formulaire--erreur");
  await erreur.waitFor();
  assert.match(await erreur.textContent(), /n'a pas été envoyée/);
  assert.equal(await page.locator(".message-formulaire--succes").count(), 0);
  assert.equal(await page.inputValue("#fc-message"), "Message à conserver");
  assert.match(await erreur.locator("a").getAttribute("href"), /^mailto:ldjikeleng@gmail\.com/);
  await page.unroute("**/api/demandes");
  await page.route("**/api/demandes", (route) => route.abort());
  await page.locator("[data-bouton-envoyer]").click();
  await page.waitForFunction(() => /connexion a échoué/.test(document.querySelector(".message-formulaire--erreur")?.textContent || ""));
  await ctx.close();
});

test("sans JavaScript : le formulaire fonctionne et la confirmation affiche la référence", async () => {
  const { ctx, page } = await nouvellePage({ javaScriptEnabled: false, reducedMotion: "reduce" });
  await page.goto(base + "/contact/");
  await page.fill("#fc-nom", "Sans Script");
  await page.fill("#fc-courriel", "sansjs@exemple.ca");
  await page.locator("[data-bouton-envoyer]").click();
  await page.waitForURL(/\/merci\/\?ref=/);
  const texte = await page.locator("main").textContent();
  assert.match(texte, /LD-\d{6}-[A-Z0-9]{5}/);
  assert.match(texte, /bien enregistrée/);
  // Le contenu essentiel reste lisible sans JavaScript
  await page.goto(base + "/tarifs/");
  assert.match(await page.locator("main").textContent(), /1\s490\s\$/);
  await ctx.close();
});

test("réduction des animations : tout le contenu visible immédiatement", async () => {
  const { ctx, page } = await nouvellePage({ reducedMotion: "reduce" });
  await page.goto(base + "/");
  const invisibles = await page.evaluate(() => [...document.querySelectorAll("main *")].filter((el) => {
    const s = getComputedStyle(el);
    return el.getClientRects().length && parseFloat(s.opacity) < 0.99 && !el.closest("[aria-hidden='true'], .plan-calque");
  }).length);
  assert.equal(invisibles, 0);
  await ctx.close();
});

test("barre d'action mobile : cachée sur le hero, visible ensuite, cachée près du formulaire final", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/creation-site-web/");
  const barre = page.locator("[data-barre-mobile]");
  assert.equal(await barre.evaluate((b) => b.classList.contains("est-visible")), false);
  await page.mouse.wheel(0, 1600);
  await page.waitForTimeout(400);
  assert.equal(await barre.evaluate((b) => b.classList.contains("est-visible")), true);
  await page.evaluate(() => document.querySelector(".pied").scrollIntoView({ behavior: "instant" }));
  await page.waitForTimeout(400);
  assert.equal(await barre.evaluate((b) => b.classList.contains("est-visible")), false);
  await ctx.close();
});

test("carrousels sur téléphone : glisser fait avancer le compteur, cote d'écran exacte", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/");
  assert.equal(await page.locator("[data-largeur-ecran]").textContent(), "390");
  const piste = page.locator("#offres .defilant__piste");
  await piste.evaluate((el) => el.scrollTo({ left: el.scrollWidth, behavior: "instant" }));
  await page.waitForTimeout(200);
  assert.match(await page.locator("#offres [data-defilant-position]").textContent(), /3 \/ 3/);
  await ctx.close();
});

test("sommaire des pages : chaque pastille mène à une section existante, pastille active, en-tête masqué en lisant", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/tarifs/");
  const liens = page.locator("[data-sommaire] a");
  assert.ok(await liens.count() >= 3);
  for (const href of await liens.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
    assert.equal(await page.locator(href).count(), 1, `cible manquante : ${href}`);
  }
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => document.body.classList.contains("entete-masquee")), true);
  const cible = await liens.nth(2).getAttribute("href");
  await liens.nth(2).click();
  await page.waitForTimeout(1200);
  assert.equal(await page.locator(`[data-sommaire] a[href="${cible}"]`).getAttribute("aria-current"), "true");
  const haut = await page.locator(cible).evaluate((el) => el.getBoundingClientRect().top);
  assert.ok(haut > 0 && haut < 260, `section mal placée sous le sommaire (${haut}px)`);
  await ctx.close();
});

test("mesure anonyme : pages vues comptées, aucun témoin déposé", async () => {
  const { ctx, page } = await nouvellePage();
  await page.goto(base + "/tarifs/");
  await page.waitForTimeout(300);
  const cookies = await ctx.cookies();
  assert.deepEqual(cookies, []);
  const st = depot.statistiques();
  assert.ok(st.parPage.some((p) => p.page === "/tarifs/"));
  await ctx.close();
});

test("fichiers SEO : plan du site, robots.txt, 404", async () => {
  const sitemap = await (await fetch(base + "/sitemap.xml")).text();
  for (const p of PAGES) assert.ok(sitemap.includes(`${p}</loc>`), `sitemap contient ${p}`);
  assert.ok(!sitemap.includes("/merci/"));
  const robots = await (await fetch(base + "/robots.txt")).text();
  assert.match(robots, /Disallow: \/admin/);
  assert.match(robots, /Sitemap: /);
  const r = await fetch(base + "/page-inexistante");
  assert.equal(r.status, 404);
  assert.match((await r.text()).replace(/<[^>]+>/g, ""), /Cette page s.est égarée/);
});
