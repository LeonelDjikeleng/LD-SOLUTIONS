// Applique la durée de conservation annoncée dans la politique de confidentialité :
// les demandes non converties de plus de 24 mois sont supprimées.
// Usage : npm run purger            (simulation : affiche le nombre sans supprimer)
//         npm run purger -- --confirmer
import { lireConfig } from "../config.mjs";
import { ouvrirBase } from "../lib/db.mjs";

const mois = Number(process.env.RETENTION_MONTHS || 24);
const limite = new Date();
limite.setMonth(limite.getMonth() - mois);
const depot = ouvrirBase(lireConfig().cheminBase);
const iso = limite.toISOString();
const n = depot.db.prepare("SELECT COUNT(*) AS n FROM demandes WHERE cree_le < ? AND statut != 'gagne'").get(iso).n;
if (!process.argv.includes("--confirmer")) {
  console.log(`${n} demande(s) antérieure(s) au ${iso.slice(0, 10)} seraient supprimées. Relancez avec --confirmer (après une sauvegarde).`);
} else {
  const supprimees = depot.purgerAvant(iso);
  depot.journaliser("purge", `${supprimees} demandes avant ${iso}`);
  console.log(`${supprimees} demande(s) supprimée(s).`);
}
depot.fermer();
