// Notifications par courriel (SMTP). Fonctionne avec Gmail (mot de passe d'application),
// ou tout fournisseur SMTP. Sans configuration, rien n'est envoyé et l'état « non-configure » est noté.
import nodemailer from "nodemailer";
import { TYPES } from "./validation.mjs";

const LIBELLES = {
  formule: "Formule souhaitée", echeance: "Échéance", budget: "Budget", options: "Options choisies",
  estimation: "Estimation affichée ($, avant taxes)", objectif_audit: "Objectif de l'audit", formule_audit: "Formule d'audit",
  plateforme: "Plateforme", niveau_maintenance: "Niveau de maintenance", preference_contact: "Préférence de contact",
};

export function creerCourrielleur(config, transportPersonnalise = null) {
  const configure = Boolean(transportPersonnalise || (config.smtp.hote && config.courrielExpediteur));
  const transport = transportPersonnalise || (configure
    ? nodemailer.createTransport({
        host: config.smtp.hote,
        port: config.smtp.port,
        secure: config.smtp.securise,
        auth: config.smtp.utilisateur ? { user: config.smtp.utilisateur, pass: config.smtp.motDePasse } : undefined,
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })
    : null);

  function corpsNotification(d) {
    const lignes = [
      `Nouvelle demande reçue par le site Leonel Djikeleng`,
      ``,
      `Référence : ${d.reference}`,
      `Type : ${TYPES[d.type] || d.type}`,
      `Nom : ${d.nom}`,
      d.entreprise ? `Entreprise : ${d.entreprise}` : null,
      `Courriel : ${d.courriel}`,
      d.telephone ? `Téléphone : ${d.telephone}` : null,
      d.secteur ? `Secteur : ${d.secteur}` : null,
      d.site_actuel ? `Site actuel : ${d.site_actuel}` : null,
      ...Object.entries(d.details || {}).map(([k, v]) => `${LIBELLES[k] || k} : ${v}`),
      d.page_origine ? `Page d'origine : ${d.page_origine}` : null,
      ``,
      d.message ? `Message :\n${d.message}` : `(aucun message)`,
      ``,
      config.urlSite ? `Suivi : ${config.urlSite}/admin/demandes/${d.id}` : null,
      `Objectif de réponse : 2 jours ouvrables.`,
    ].filter((l) => l !== null);
    return lignes.join("\n");
  }

  function corpsAccuse(d) {
    return [
      `Bonjour ${d.nom},`,
      ``,
      `Nous avons bien reçu votre demande (référence ${d.reference}).`,
      `Nous vous répondrons sous 2 jours ouvrables pour convenir de la suite.`,
      ``,
      `Vous pouvez répondre directement à ce courriel pour ajouter une précision.`,
      ``,
      `Leonel Djikeleng`,
      config.courrielNotification,
      ``,
      `Vous recevez ce message parce que vous avez envoyé une demande sur notre site. Aucune autre communication commerciale ne vous sera envoyée sans votre accord.`,
    ].join("\n");
  }

  return {
    configure,
    async notifier(demande) {
      if (!configure) return "non-configure";
      try {
        await transport.sendMail({
          from: config.courrielExpediteur,
          to: config.courrielNotification,
          replyTo: demande.courriel,
          subject: `[${TYPES[demande.type] || demande.type}] ${demande.entreprise || demande.nom} · ${demande.reference}`,
          text: corpsNotification(demande),
        });
        if (config.envoyerAccuse) {
          try {
            await transport.sendMail({
              from: config.courrielExpediteur,
              to: demande.courriel,
              replyTo: config.courrielNotification,
              subject: `Leonel Djikeleng · demande ${demande.reference} bien reçue`,
              text: corpsAccuse(demande),
            });
          } catch { /* l'accusé est secondaire : la notification interne a réussi */ }
        }
        return "envoyee";
      } catch (e) {
        return `echec: ${String(e.code || e.message || e).slice(0, 120)}`;
      }
    },
    corpsNotification,
  };
}
