// Estimateur de prix (page Tarifs). Les prix sont injectés dans le HTML depuis content/offres.mjs.
(function () {
  "use strict";
  var racine = document.querySelector("[data-estimateur]");
  if (!racine) return;
  racine.hidden = false;
  var substitut = document.querySelector("[data-estimateur-sans-js]");
  if (substitut) substitut.hidden = true;

  var fmt = function (n) { return Math.round(n).toLocaleString("fr-CA").replace(/ /g, " ") + " $"; };
  var sortieTotal = racine.querySelector("[data-total]");
  var sortieDetail = racine.querySelector("[data-detail]");
  var sortiePromo = racine.querySelector("[data-promo]");
  var sortieMaint = racine.querySelector("[data-maintenance]");
  var lien = racine.querySelector("[data-lien-devis]");
  var promoPct = Number(racine.getAttribute("data-promo-pct") || 0);
  var promoFin = racine.getAttribute("data-promo-fin");
  var promoActive = promoPct > 0 && promoFin && Date.now() <= new Date(promoFin + "T23:59:59-05:00").getTime();
  var utilise = false;

  function calculer() {
    var base = racine.querySelector('input[name="base"]:checked');
    var prixBase = base ? Number(base.getAttribute("data-prix")) : 0;
    var lignes = base ? [base.getAttribute("data-nom") + " : " + fmt(prixBase)] : [];
    var total = prixBase;
    var choisies = [];
    racine.querySelectorAll("input[data-option]").forEach(function (c) {
      var qteChamp = racine.querySelector('[data-qte-pour="' + c.id + '"]');
      if (qteChamp) qteChamp.disabled = !c.checked;
      if (!c.checked) return;
      var qte = qteChamp ? Math.max(1, Math.min(20, Number(qteChamp.value) || 1)) : 1;
      var montant = Number(c.getAttribute("data-prix")) * qte;
      total += montant;
      var libelle = c.getAttribute("data-nom") + (qte > 1 ? " × " + qte : "");
      lignes.push(libelle + " : " + fmt(montant));
      choisies.push(libelle);
    });
    sortieTotal.textContent = fmt(total);
    sortieDetail.textContent = lignes.join(" · ");
    if (sortiePromo) {
      if (promoActive && base) {
        var rabais = prixBase * promoPct / 100;
        sortiePromo.textContent = "Avec l'offre de lancement (-" + promoPct + " % sur la formule, projet signé au plus tard le " + new Date(promoFin + "T12:00:00Z").toLocaleDateString("fr-CA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) + ") : " + fmt(total - rabais) + ".";
        sortiePromo.hidden = false;
      } else sortiePromo.hidden = true;
    }
    var maint = racine.querySelector('input[name="maintenance"]:checked');
    if (sortieMaint) {
      var pm = maint ? Number(maint.getAttribute("data-prix")) : 0;
      sortieMaint.textContent = pm ? "Puis maintenance " + maint.getAttribute("data-nom") + " : " + fmt(pm) + " par mois (3 premiers mois de la formule Essentielle offerts avec une création)." : "Sans maintenance : vous gérez le site après les 30 jours de corrections inclus.";
    }
    var p = new URLSearchParams({ type: "creation" });
    if (base) p.set("formule", base.value);
    if (choisies.length) p.set("options", choisies.join(", "));
    if (maint && maint.value) p.set("options", (choisies.length ? choisies.join(", ") + ", " : "") + "Maintenance " + maint.getAttribute("data-nom"));
    p.set("estimation", String(Math.round(total)));
    lien.href = "/contact/?" + p.toString();
  }

  racine.addEventListener("input", function () {
    calculer();
    if (!utilise) { utilise = true; if (window.ldMesurer) window.ldMesurer("estimateur_utilise"); }
  });
  racine.addEventListener("change", calculer);
  calculer();
})();
