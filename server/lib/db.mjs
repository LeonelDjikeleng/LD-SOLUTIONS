// Stockage SQLite (module intégré à Node 22). Un seul fichier, sauvegardable à chaud par VACUUM INTO.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Le module SQLite de Node affiche un avertissement « expérimental » : on le masque, le reste passe.
const emettreOrigine = process.emitWarning;
process.emitWarning = function (avertissement, ...reste) {
  const texte = typeof avertissement === "string" ? avertissement : avertissement?.message;
  if (texte && texte.includes("SQLite")) return;
  return emettreOrigine.call(process, avertissement, ...reste);
};
const { DatabaseSync } = await import("node:sqlite");

export const STATUTS = [
  { id: "nouveau", libelle: "Nouveau" },
  { id: "contacte", libelle: "Contacté" },
  { id: "qualifie", libelle: "Qualifié" },
  { id: "proposition", libelle: "Proposition envoyée" },
  { id: "gagne", libelle: "Gagné" },
  { id: "perdu", libelle: "Perdu" },
  { id: "sans-suite", libelle: "Sans suite" },
  { id: "pourriel", libelle: "Pourriel" },
];

const MIGRATIONS = [
  `CREATE TABLE demandes (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     reference TEXT NOT NULL UNIQUE,
     cree_le TEXT NOT NULL,
     type TEXT NOT NULL,
     nom TEXT NOT NULL,
     entreprise TEXT,
     courriel TEXT NOT NULL,
     telephone TEXT,
     secteur TEXT,
     site_actuel TEXT,
     details TEXT NOT NULL DEFAULT '{}',
     message TEXT,
     page_origine TEXT,
     statut TEXT NOT NULL DEFAULT 'nouveau',
     note TEXT,
     prochaine_action TEXT,
     suspect INTEGER NOT NULL DEFAULT 0,
     raison_suspect TEXT,
     notification TEXT NOT NULL DEFAULT 'en-attente',
     notification_essais INTEGER NOT NULL DEFAULT 0,
     maj_le TEXT NOT NULL
   );
   CREATE INDEX idx_demandes_cree ON demandes(cree_le);
   CREATE INDEX idx_demandes_statut ON demandes(statut);
   CREATE TABLE evenements (
     jour TEXT NOT NULL,
     nom TEXT NOT NULL,
     page TEXT NOT NULL,
     total INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (jour, nom, page)
   );
   CREATE TABLE sessions (
     hash_jeton TEXT PRIMARY KEY,
     jeton_csrf TEXT NOT NULL,
     expire_le INTEGER NOT NULL
   );
   CREATE TABLE journal (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     le TEXT NOT NULL,
     action TEXT NOT NULL,
     detail TEXT
   );`,
];

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function nouvelleReference(date = new Date()) {
  const aa = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const jj = String(date.getDate()).padStart(2, "0");
  const octets = crypto.randomBytes(5);
  let suffixe = "";
  for (const o of octets) suffixe += ALPHABET[o % ALPHABET.length];
  return `LD-${aa}${mm}${jj}-${suffixe}`;
}

export function ouvrirBase(chemin) {
  if (chemin !== ":memory:") fs.mkdirSync(path.dirname(chemin), { recursive: true });
  const db = new DatabaseSync(chemin);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  const version = db.prepare("PRAGMA user_version").get().user_version;
  for (let i = version; i < MIGRATIONS.length; i++) {
    db.exec("BEGIN");
    try {
      db.exec(MIGRATIONS[i]);
      db.exec(`PRAGMA user_version = ${i + 1}`);
      db.exec("COMMIT");
    } catch (e) {
      db.exec("ROLLBACK");
      throw e;
    }
  }
  if (chemin !== ":memory:") {
    try { fs.chmodSync(chemin, 0o600); } catch { /* système sans permissions POSIX */ }
  }
  return creerDepot(db);
}

function creerDepot(db) {
  const maintenant = () => new Date().toISOString();
  const q = {
    inserer: db.prepare(`INSERT INTO demandes
      (reference, cree_le, type, nom, entreprise, courriel, telephone, secteur, site_actuel, details, message, page_origine, statut, suspect, raison_suspect, notification, maj_le)
      VALUES (:reference, :cree_le, :type, :nom, :entreprise, :courriel, :telephone, :secteur, :site_actuel, :details, :message, :page_origine, :statut, :suspect, :raison_suspect, :notification, :maj_le)`),
    parId: db.prepare("SELECT * FROM demandes WHERE id = ?"),
    parReference: db.prepare("SELECT * FROM demandes WHERE reference = ?"),
    majNotification: db.prepare("UPDATE demandes SET notification = ?, notification_essais = notification_essais + 1, maj_le = ? WHERE id = ?"),
    aRelancer: db.prepare("SELECT * FROM demandes WHERE notification LIKE 'echec%' AND notification_essais < 5 AND suspect = 0 ORDER BY id LIMIT 20"),
    majSuivi: db.prepare("UPDATE demandes SET statut = ?, note = ?, prochaine_action = ?, maj_le = ? WHERE id = ?"),
    supprimer: db.prepare("DELETE FROM demandes WHERE id = ?"),
    evenement: db.prepare(`INSERT INTO evenements (jour, nom, page, total) VALUES (?, ?, ?, 1)
      ON CONFLICT(jour, nom, page) DO UPDATE SET total = total + 1`),
    creerSession: db.prepare("INSERT INTO sessions (hash_jeton, jeton_csrf, expire_le) VALUES (?, ?, ?)"),
    lireSession: db.prepare("SELECT * FROM sessions WHERE hash_jeton = ? AND expire_le > ?"),
    supprimerSession: db.prepare("DELETE FROM sessions WHERE hash_jeton = ?"),
    purgerSessions: db.prepare("DELETE FROM sessions WHERE expire_le <= ?"),
    journaliser: db.prepare("INSERT INTO journal (le, action, detail) VALUES (?, ?, ?)"),
  };

  return {
    db,
    fermer() { db.close(); },

    enregistrerDemande(d) {
      const ligne = {
        reference: nouvelleReference(),
        cree_le: maintenant(),
        type: d.type,
        nom: d.nom,
        entreprise: d.entreprise || null,
        courriel: d.courriel,
        telephone: d.telephone || null,
        secteur: d.secteur || null,
        site_actuel: d.site_actuel || null,
        details: JSON.stringify(d.details || {}),
        message: d.message || null,
        page_origine: d.page_origine || null,
        statut: d.suspect ? "pourriel" : "nouveau",
        suspect: d.suspect ? 1 : 0,
        raison_suspect: d.raison_suspect || null,
        notification: d.suspect ? "ignoree" : "en-attente",
        maj_le: maintenant(),
      };
      // Collision de référence quasi impossible ; on réessaie au besoin.
      for (let essai = 0; essai < 3; essai++) {
        try {
          const r = q.inserer.run(ligne);
          return { id: Number(r.lastInsertRowid), reference: ligne.reference };
        } catch (e) {
          if (!String(e.message).includes("UNIQUE") || essai === 2) throw e;
          ligne.reference = nouvelleReference();
        }
      }
    },

    lireDemande(id) {
      const d = q.parId.get(id);
      return d ? { ...d, details: JSON.parse(d.details || "{}") } : null;
    },

    lireParReference(reference) {
      return q.parReference.get(reference) || null;
    },

    listerDemandes({ type, statut, recherche, limite = 200 } = {}) {
      const conditions = [];
      const params = {};
      if (type) { conditions.push("type = :type"); params.type = type; }
      if (statut) { conditions.push("statut = :statut"); params.statut = statut; }
      else { conditions.push("statut != 'pourriel'"); }
      if (recherche) {
        conditions.push("(nom LIKE :r OR entreprise LIKE :r OR courriel LIKE :r OR reference LIKE :r)");
        params.r = `%${recherche}%`;
      }
      const where = conditions.length ? "WHERE " + conditions.join(" AND ") : "";
      params.limite = limite;
      return db.prepare(`SELECT * FROM demandes ${where} ORDER BY id DESC LIMIT :limite`).all(params)
        .map((d) => ({ ...d, details: JSON.parse(d.details || "{}") }));
    },

    compterParStatut() {
      return db.prepare("SELECT statut, COUNT(*) AS n FROM demandes GROUP BY statut").all();
    },

    majNotification(id, etat) { q.majNotification.run(etat, maintenant(), id); },
    demandesARelancer() { return q.aRelancer.all().map((d) => ({ ...d, details: JSON.parse(d.details || "{}") })); },

    majSuivi(id, { statut, note, prochaine_action }) {
      q.majSuivi.run(statut, note || null, prochaine_action || null, maintenant(), id);
    },

    supprimerDemande(id) { return q.supprimer.run(id).changes; },

    purgerAvant(dateIso) {
      return db.prepare("DELETE FROM demandes WHERE cree_le < ? AND statut NOT IN ('gagne')").run(dateIso).changes;
    },

    compterEvenement(nom, page, jour = maintenant().slice(0, 10)) { q.evenement.run(jour, nom, page); },

    statistiques({ depuis } = {}) {
      const d = depuis || new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      return {
        parEvenement: db.prepare("SELECT nom, SUM(total) AS total FROM evenements WHERE jour >= ? GROUP BY nom ORDER BY total DESC").all(d),
        parPage: db.prepare("SELECT page, SUM(total) AS total FROM evenements WHERE jour >= ? AND nom = 'page_vue' GROUP BY page ORDER BY total DESC LIMIT 30").all(d),
        demandesParType: db.prepare("SELECT type, COUNT(*) AS n FROM demandes WHERE cree_le >= ? AND suspect = 0 GROUP BY type").all(d),
        demandesParStatut: db.prepare("SELECT statut, COUNT(*) AS n FROM demandes WHERE cree_le >= ? GROUP BY statut").all(d),
        depuis: d,
      };
    },

    creerSession(hashJeton, jetonCsrf, expireLe) { q.creerSession.run(hashJeton, jetonCsrf, expireLe); },
    lireSession(hashJeton) { return q.lireSession.get(hashJeton, Date.now()) || null; },
    supprimerSession(hashJeton) { q.supprimerSession.run(hashJeton); },
    purgerSessions() { q.purgerSessions.run(Date.now()); },

    journaliser(action, detail = "") { q.journaliser.run(maintenant(), action, String(detail).slice(0, 500)); },

    sante() { return db.prepare("SELECT 1 AS ok").get().ok === 1; },
  };
}
