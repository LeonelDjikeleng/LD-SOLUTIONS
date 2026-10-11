// Leonel Djikeleng : interactions communes. Le contenu et les liens fonctionnent sans ce script.
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mesure anonyme (sans témoin, sans identifiant) ---------- */
  var chemin = location.pathname;
  function mesurer(nom) {
    if (navigator.globalPrivacyControl || window.LD_APERCU) return;
    var corps = JSON.stringify({ nom: nom, page: chemin });
    try {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/evenements", new Blob([corps], { type: "text/plain" }));
      else fetch("/api/evenements", { method: "POST", body: corps, headers: { "Content-Type": "text/plain" }, keepalive: true });
    } catch (e) { /* la mesure ne doit jamais gêner la navigation */ }
  }
  window.ldMesurer = mesurer;
  if (!/^\/admin/.test(chemin)) mesurer("page_vue");
  document.addEventListener("click", function (e) {
    var cible = e.target.closest && e.target.closest("[data-evenement]");
    if (cible) mesurer(cible.getAttribute("data-evenement"));
  });

  /* ---------- Menu mobile ---------- */
  var bouton = document.querySelector(".bouton-menu");
  var menu = document.getElementById("menu-mobile");
  function fermerMenu(rendreFocus) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    bouton.setAttribute("aria-expanded", "false");
    bouton.querySelector(".bouton-menu__libelle").textContent = "Menu";
    document.body.classList.remove("menu-ouvert");
    if (rendreFocus) bouton.focus();
  }
  if (bouton && menu) {
    bouton.addEventListener("click", function () {
      if (!menu.hidden) return fermerMenu(true);
      menu.hidden = false;
      bouton.setAttribute("aria-expanded", "true");
      bouton.querySelector(".bouton-menu__libelle").textContent = "Fermer";
      document.body.classList.add("menu-ouvert");
      var premier = menu.querySelector("a");
      if (premier) premier.focus();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") fermerMenu(true); });
    var fermer = menu.querySelector("[data-fermer-menu]");
    if (fermer) fermer.addEventListener("click", function () { fermerMenu(true); });
    // Toucher en dehors du tiroir (sur le voile) le referme
    document.addEventListener("click", function (e) {
      if (menu.hidden || menu.contains(e.target) || bouton.contains(e.target)) return;
      fermerMenu(false);
    });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) fermerMenu(false); });
    // Piège du focus dans le menu ouvert
    menu.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var focusables = [bouton].concat(Array.prototype.slice.call(menu.querySelectorAll("a, button")));
      var premier = focusables[0], dernier = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === menu.querySelector("a")) { e.preventDefault(); premier.focus(); }
      else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
    });
    window.matchMedia("(min-width: 1080px)").addEventListener("change", function (m) { if (m.matches) fermerMenu(false); });
  }

  /* ---------- Apparitions au défilement (seulement sous la ligne de flottaison) ---------- */
  // Les titres de section et les éléments de listes se posent les uns après les autres.
  var GROUPES = ".constats > li, .grille-cartes > *, .liste-etapes > li, .faq > details, .engagements > li, .promos > .promo, .processus > li, .liste-prix > li, .portes > a, .piliers > a, .piliers > div, .demo, .offre, .carte-simple.isolee, .projets > a, .chiffres > li, .fiche-projet > div";
  document.querySelectorAll("main .section .entete-section").forEach(function (el) { el.classList.add("revele"); });
  document.querySelectorAll(GROUPES).forEach(function (el) { if (!el.closest(".hero")) el.classList.add("revele"); });
  var reveles = document.querySelectorAll(".revele");
  if ("IntersectionObserver" in window && reveles.length) {
    var hauteur = window.innerHeight;
    var obs = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("est-visible"); obs.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.08 });
    reveles.forEach(function (el) {
      if (!reduit && el.getBoundingClientRect().top > hauteur) {
        el.classList.add("revele--attente");
        var rang = Array.prototype.indexOf.call(el.parentNode.children, el);
        if (rang > 0) el.style.transitionDelay = Math.min(rang, 5) * 70 + "ms";
      } else {
        el.classList.add("est-visible");
      }
      obs.observe(el);
    });
  } else {
    reveles.forEach(function (el) { el.classList.add("est-visible"); });
  }

  /* ---------- En-tête qui s'efface en descendant, revient en remontant (téléphone, tablette) ---------- */
  // Le même passage met aussi à jour le fil de lecture vert sous l'en-tête.
  var petitEcran = window.matchMedia("(max-width: 1079px)");
  var fil = document.querySelector("[data-progression]");
  var dernierY = window.scrollY, enAttente = false;
  var surDefilement = function () {
    if (enAttente) return;
    enAttente = true;
    window.requestAnimationFrame(function () {
      var y = window.scrollY, delta = y - dernierY;
      var corps = document.body;
      corps.classList.toggle("a-defile", y > 8);
      if (fil) {
        var course = document.documentElement.scrollHeight - window.innerHeight;
        fil.style.transform = "scaleX(" + (course > 0 ? Math.min(1, y / course) : 0).toFixed(4) + ")";
      }
      if (!petitEcran.matches || corps.classList.contains("menu-ouvert") || y < 90) corps.classList.remove("entete-masquee");
      else if (delta > 6) corps.classList.add("entete-masquee");
      else if (delta < -6) corps.classList.remove("entete-masquee");
      dernierY = y;
      enAttente = false;
    });
  };
  window.addEventListener("scroll", surDefilement, { passive: true });
  surDefilement();
  document.addEventListener("focusin", function (e) {
    if (e.target.closest && e.target.closest(".entete")) document.body.classList.remove("entete-masquee");
  });

  /* ---------- Sommaire collant : la pastille active suit la lecture ---------- */
  var sommaire = document.querySelector("[data-sommaire]");
  if (sommaire && "IntersectionObserver" in window) {
    var liens = Array.prototype.slice.call(sommaire.querySelectorAll("a"));
    var liste = sommaire.querySelector(".sommaire__liste");
    var cibles = liens.map(function (a) {
      var titre = document.getElementById(a.getAttribute("href").slice(1));
      return titre ? (titre.closest("section") && !titre.closest(".prose") ? titre.closest("section") : titre) : null;
    });
    var activer = function (i) {
      liens.forEach(function (a, j) { if (j === i) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
      var a = liens[i];
      if (a) liste.scrollTo({ left: a.offsetLeft - liste.clientWidth / 2 + a.offsetWidth / 2, behavior: reduit ? "auto" : "smooth" });
    };
    var obsS = new IntersectionObserver(function () {
      // La section active est la dernière dont le haut a dépassé le premier tiers de l'écran
      var limite = window.innerHeight * 0.35, actif = -1;
      cibles.forEach(function (c, i) { if (c && c.getBoundingClientRect().top <= limite) actif = i; });
      if (actif === -1) liens.forEach(function (a) { a.removeAttribute("aria-current"); });
      else if (liens[actif].getAttribute("aria-current") !== "true") activer(actif);
    }, { rootMargin: "-35% 0px -60% 0px", threshold: [0, 1] });
    cibles.forEach(function (c) { if (c) obsS.observe(c); });
    liens.forEach(function (a, i) { a.addEventListener("click", function () { activer(i); }); });
  }

  /* ---------- Barre d'action mobile : visible après le hero, masquée près des formulaires et du pied ---------- */
  var barre = document.querySelector("[data-barre-mobile]");
  var hero = document.querySelector(".hero");
  if (barre && "IntersectionObserver" in window) {
    var heroVisible = true, cacheurVisible = false;
    var maj = function () { barre.classList.toggle("est-visible", !heroVisible && !cacheurVisible); };
    if (hero) new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; maj(); }).observe(hero);
    else heroVisible = false;
    var cacheurs = document.querySelectorAll(".pied, form, .appel-final, .estimateur__total");
    var visibles = new Set();
    var obsC = new IntersectionObserver(function (entrees) {
      entrees.forEach(function (en) { if (en.isIntersecting) visibles.add(en.target); else visibles.delete(en.target); });
      cacheurVisible = visibles.size > 0; maj();
    });
    cacheurs.forEach(function (c) { obsC.observe(c); });
    maj();
  }

  /* ---------- Cote vivante : la largeur réelle de l'écran du visiteur ---------- */
  var cote = document.querySelector("[data-cote-ecran]");
  if (cote) {
    var valeur = cote.querySelector("[data-largeur-ecran]");
    var mesurerEcran = function () { valeur.textContent = String(Math.round(document.documentElement.clientWidth)); };
    mesurerEcran();
    cote.hidden = false;
    window.addEventListener("resize", function () { window.requestAnimationFrame(mesurerEcran); }, { passive: true });
  }

  /* ---------- Carrousels natifs : compteur et barre de progression ---------- */
  document.querySelectorAll("[data-defilant]").forEach(function (bloc) {
    var piste = bloc.querySelector(".defilant__piste");
    var position = bloc.querySelector("[data-defilant-position]");
    var barre = bloc.querySelector("[data-defilant-barre]");
    var n = piste.children.length;
    if (barre) barre.style.width = (100 / n) + "%";
    var maj = function () {
      var max = piste.scrollWidth - piste.clientWidth;
      var ratio = max > 0 ? piste.scrollLeft / max : 0;
      var index = Math.min(n, Math.round(ratio * (n - 1)) + 1);
      if (position) position.textContent = index + " / " + n;
      if (barre) barre.style.transform = "translateX(" + (ratio * (n - 1) * 100) + "%)";
    };
    piste.addEventListener("scroll", function () { window.requestAnimationFrame(maj); }, { passive: true });
    maj();
  });

  /* ---------- Copier l'adresse courriel ---------- */
  document.querySelectorAll("[data-copier]").forEach(function (b) {
    if (!navigator.clipboard) return;
    b.hidden = false;
    b.addEventListener("click", function () {
      navigator.clipboard.writeText(b.getAttribute("data-copier")).then(function () {
        var avant = b.textContent;
        b.textContent = "Adresse copiée";
        mesurer("copie_courriel");
        setTimeout(function () { b.textContent = avant; }, 2200);
      }).catch(function () {
        // Copie refusée par le navigateur : on sélectionne l'adresse affichée à côté pour une copie manuelle
        var texte = b.parentNode && b.parentNode.querySelector(".courriel-affiche");
        if (texte && window.getSelection) { var r = document.createRange(); r.selectNodeContents(texte); var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
      });
    });
  });

  /* ---------- Promotions datées : masquées automatiquement après leur date de fin ---------- */
  document.querySelectorAll("[data-fin-promo]").forEach(function (el) {
    var fin = new Date(el.getAttribute("data-fin-promo") + "T23:59:59-05:00");
    if (Date.now() > fin.getTime()) el.hidden = true;
  });
})();
