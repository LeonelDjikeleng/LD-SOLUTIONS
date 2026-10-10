// Formulaire de demande : parcours conditionnels, validation, envoi honnête.
// Sans JavaScript, le formulaire s'envoie normalement et le serveur valide tout.
(function () {
  "use strict";
  var COURRIEL = /^[^\s@<>()[\]\\,;:"]{1,64}@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;
  var LIBELLES_FORMULE = { depart: "Départ", professionnel: "Professionnel", "sur-mesure": "Sur mesure" };
  var ETAPES = {
    creation: [
      "Nous lisons votre demande et préparons nos questions.",
      "Nous vous écrivons sous 2 jours ouvrables pour fixer un appel découverte de 30 minutes.",
      "Après l'appel, vous recevez une proposition écrite (prix, périmètre, calendrier) sous 3 jours ouvrables.",
    ],
    "audit:diagnostic-express": [
      "Nous analysons votre site sur téléphone et sur ordinateur.",
      "Vous recevez par écrit vos 5 problèmes prioritaires et une piste de correction pour chacun, sous 3 jours ouvrables.",
    ],
    "audit:audit-complet": [
      "Nous vous écrivons sous 2 jours ouvrables pour confirmer le périmètre et vous envoyer la facture (390 $, taxes en sus).",
      "Le rapport est remis sous 5 jours ouvrables après le paiement, puis présenté lors d'un appel de 45 minutes.",
      "Le montant est crédité si vous signez un projet de création ou de refonte dans les 60 jours.",
    ],
    maintenance: [
      "Nous examinons votre site : plateforme, mises à jour en retard, sauvegardes existantes.",
      "Nous vous répondons sous 2 jours ouvrables avec la formule recommandée et, s'il y a lieu, les travaux de remise à niveau à prévoir.",
    ],
    discussion: [
      "Nous vous répondons sous 2 jours ouvrables, par le moyen que vous avez choisi.",
    ],
  };

  function echapper(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  document.querySelectorAll("[data-formulaire-demande]").forEach(function (form) {
    var params = new URLSearchParams(location.search);
    var zoneMessage = form.querySelector("[data-message-formulaire]");
    var boutonEnvoyer = form.querySelector("[data-bouton-envoyer]");
    var texteBouton = boutonEnvoyer.innerHTML;
    var commence = false;

    form.elements.t.value = String(Date.now());
    form.elements.page_origine.value = location.pathname;

    function typeCourant() {
      var r = form.querySelector('input[name="type"]:checked') || form.querySelector('input[name="type"]');
      return r ? r.value : "creation";
    }

    /* Pré-remplissage depuis l'adresse (?type=…&formule=…&niveau=…&options=…&estimation=…) */
    var typeParam = params.get("type");
    if (typeParam) {
      var radio = form.querySelector('input[name="type"][value="' + typeParam.replace(/[^a-z]/g, "") + '"]');
      if (radio) radio.checked = true;
    }
    function choisir(nom, valeur) {
      if (!valeur) return;
      var champ = form.querySelector('[name="' + nom + '"]');
      if (champ && champ.tagName === "SELECT" && champ.querySelector('option[value="' + valeur.replace(/[^a-z0-9-]/g, "") + '"]')) champ.value = valeur;
    }
    choisir("formule", params.get("formule"));
    choisir("niveau_maintenance", params.get("niveau"));
    choisir("secteur", params.get("secteur"));
    var audit = params.get("audit");
    if (audit) {
      var ra = form.querySelector('input[name="formule_audit"][value="' + audit.replace(/[^a-z-]/g, "") + '"]');
      if (ra) ra.checked = true;
    }
    var opts = (params.get("options") || "").slice(0, 500);
    var estimation = (params.get("estimation") || "").replace(/[^0-9]/g, "").slice(0, 6);
    if (opts || estimation) {
      form.elements.options.value = opts;
      form.elements.estimation.value = estimation;
      var resume = form.querySelector("[data-selection-estimateur]");
      if (resume) {
        var f = params.get("formule");
        resume.innerHTML = "<strong>Votre sélection depuis l'estimateur</strong>" +
          (f && LIBELLES_FORMULE[f] ? "Formule " + echapper(LIBELLES_FORMULE[f]) : "") +
          (opts ? (f ? " · " : "") + "Options : " + echapper(opts) : "") +
          (estimation ? "<br>Estimation : " + Number(estimation).toLocaleString("fr-CA") + " $ avant taxes (confirmée dans le devis)" : "");
        resume.hidden = false;
      }
    }

    /* Parcours conditionnels : seuls les champs du type choisi sont actifs */
    function appliquerType() {
      var type = typeCourant();
      form.querySelectorAll("fieldset[data-pour]").forEach(function (fs) {
        var actif = fs.getAttribute("data-pour") === type;
        fs.hidden = !actif;
        fs.disabled = !actif;
      });
      form.querySelectorAll("[data-requis-pour]").forEach(function (champ) {
        champ.required = champ.getAttribute("data-requis-pour") === type && !champ.closest("fieldset[disabled]");
      });
      var facultatif = form.querySelector("[data-message-facultatif]");
      if (facultatif) facultatif.hidden = type === "discussion";
      var resume = form.querySelector("[data-selection-estimateur]");
      if (resume && (opts || estimation)) resume.hidden = type !== "creation";
    }
    form.addEventListener("change", function (e) {
      if (e.target.name === "type") appliquerType();
    });
    appliquerType();

    form.addEventListener("input", function (e) {
      if (!commence) { commence = true; if (window.ldMesurer) window.ldMesurer("debut_formulaire"); }
      if (e.target.getAttribute("aria-invalid") === "true") afficherErreur(e.target, "");
    });

    function erreurDe(champ) {
      var id = champ.getAttribute("aria-describedby") || "";
      var cible = null;
      id.split(" ").forEach(function (x) { if (/-err$/.test(x)) cible = document.getElementById(x); });
      return cible;
    }
    function afficherErreur(champ, message) {
      var zone = erreurDe(champ);
      champ.setAttribute("aria-invalid", message ? "true" : "false");
      if (zone) { zone.textContent = message; zone.hidden = !message; }
    }

    function valider() {
      var erreurs = [];
      var type = typeCourant();
      var nom = form.elements.nom;
      if (nom.value.trim().length < 2) erreurs.push([nom, "Indiquez votre nom."]);
      var courriel = form.elements.courriel;
      if (!COURRIEL.test(courriel.value.trim())) erreurs.push([courriel, "Indiquez une adresse courriel valide, par exemple nom@entreprise.ca."]);
      var tel = form.elements.telephone;
      if (tel.value.trim() && !/^[0-9+().\-\s]{7,30}$/.test(tel.value.trim())) erreurs.push([tel, "Ce numéro de téléphone ne semble pas valide."]);
      form.querySelectorAll("[data-requis-pour]").forEach(function (champ) {
        if (champ.getAttribute("data-requis-pour") !== type) return;
        if (champ.name === "message" && champ.value.trim().length < 10) erreurs.push([champ, "Décrivez en quelques mots ce dont vous voulez discuter."]);
        if (champ.name === "site_actuel" && !/\w+\.\w{2,}/.test(champ.value.trim())) erreurs.push([champ, "Indiquez l'adresse de votre site, par exemple www.monentreprise.ca."]);
      });
      form.querySelectorAll("[aria-invalid]").forEach(function (c) { afficherErreur(c, ""); });
      erreurs.forEach(function (e) { afficherErreur(e[0], e[1]); });
      // Le focus va au premier champ invalide dans l'ordre de lecture du formulaire
      erreurs.sort(function (a, b) { return a[0].compareDocumentPosition(b[0]) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; });
      if (erreurs.length) erreurs[0][0].focus();
      return erreurs.length === 0;
    }

    function afficherMessage(html, classe) {
      zoneMessage.innerHTML = '<div class="message-formulaire ' + classe + '" tabindex="-1">' + html + "</div>";
      var bloc = zoneMessage.firstChild;
      bloc.focus();
    }

    function mailtoSecours() {
      var lignes = ["Type : " + typeCourant(), "Nom : " + form.elements.nom.value, "Entreprise : " + form.elements.entreprise.value, "Téléphone : " + form.elements.telephone.value, "", form.elements.message.value];
      return "mailto:ldjikeleng@gmail.com?subject=" + encodeURIComponent("Demande depuis le site Leonel Djikeleng") + "&body=" + encodeURIComponent(lignes.join("\n"));
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!valider()) return;
      // Version d'aperçu (sans serveur) : rien n'est envoyé, et on le dit clairement.
      if (window.LD_APERCU) {
        afficherMessage(
          "<p><strong>Aperçu du site : cette demande n'a pas été envoyée.</strong> Les formulaires seront actifs dès la mise en ligne définitive.</p>" +
          "<p>Pour une vraie demande dès maintenant, écrivez à <strong>ldjikeleng@gmail.com</strong>.</p>",
          "message-formulaire--erreur"
        );
        return;
      }
      var donnees = {};
      new FormData(form).forEach(function (v, k) { if (typeof v === "string") donnees[k] = v; });
      boutonEnvoyer.disabled = true;
      boutonEnvoyer.textContent = "Envoi en cours…";
      zoneMessage.innerHTML = "";

      var controleur = "AbortController" in window ? new AbortController() : null;
      var minuterie = setTimeout(function () { if (controleur) controleur.abort(); }, 20000);

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(donnees),
        signal: controleur ? controleur.signal : undefined,
      }).then(function (rep) {
        return rep.json().catch(function () { return {}; }).then(function (corps) { return { statut: rep.status, corps: corps }; });
      }).then(function (r) {
        clearTimeout(minuterie);
        if (r.statut === 201 && r.corps.ok) {
          var cle = donnees.type === "audit" ? "audit:" + (donnees.formule_audit || "diagnostic-express") : donnees.type;
          var etapes = (ETAPES[cle] || ETAPES.discussion).map(function (t) { return "<li>" + echapper(t) + "</li>"; }).join("");
          form.querySelectorAll("fieldset, .note-confidentialite, [data-bouton-envoyer]").forEach(function (el) { el.hidden = true; });
          afficherMessage(
            "<h3>Merci, votre demande est bien enregistrée.</h3>" +
            "<p>Votre numéro de référence : <span class=\"reference\">" + echapper(r.corps.reference) + "</span>. Gardez-le pour toute question.</p>" +
            "<p><strong>La suite :</strong></p><ol>" + etapes + "</ol>" +
            "<p>Une précision à ajouter ? Écrivez à <a href=\"mailto:ldjikeleng@gmail.com?subject=" + encodeURIComponent("Demande " + r.corps.reference) + "\">ldjikeleng@gmail.com</a> en indiquant votre référence.</p>",
            "message-formulaire--succes"
          );
          return;
        }
        boutonEnvoyer.disabled = false;
        boutonEnvoyer.innerHTML = texteBouton;
        if (r.statut === 422 && r.corps.erreurs) {
          var premier = null;
          Object.keys(r.corps.erreurs).forEach(function (nomChamp) {
            var champ = form.querySelector('fieldset:not([disabled]) [name="' + nomChamp + '"], :scope > [name="' + nomChamp + '"]') || form.querySelector('[name="' + nomChamp + '"]');
            if (champ && champ.type !== "hidden") { afficherErreur(champ, r.corps.erreurs[nomChamp]); premier = premier || champ; }
          });
          afficherMessage("<p><strong>Votre demande n'a pas été envoyée.</strong> Vérifiez les champs signalés.</p>", "message-formulaire--erreur");
          if (premier) premier.focus();
          return;
        }
        afficherMessage(
          "<p><strong>Votre demande n'a pas été envoyée.</strong> " + echapper(r.corps.message || "Le serveur n'a pas pu l'enregistrer.") + "</p>" +
          "<p>Vos réponses sont toujours dans le formulaire : réessayez dans un instant, ou <a href=\"" + mailtoSecours() + "\">envoyez-les par courriel</a> à ldjikeleng@gmail.com.</p>",
          "message-formulaire--erreur"
        );
      }).catch(function () {
        clearTimeout(minuterie);
        boutonEnvoyer.disabled = false;
        boutonEnvoyer.innerHTML = texteBouton;
        afficherMessage(
          "<p><strong>Votre demande n'a pas été envoyée</strong> : la connexion a échoué.</p>" +
          "<p>Vos réponses sont toujours dans le formulaire : vérifiez votre connexion et réessayez, ou <a href=\"" + mailtoSecours() + "\">envoyez-les par courriel</a> à ldjikeleng@gmail.com.</p>",
          "message-formulaire--erreur"
        );
      });
    });
  });
})();
