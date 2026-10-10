// Génère la valeur de ADMIN_PASSWORD_HASH sans jamais écrire le mot de passe en clair.
// Usage : npm run admin:mot-de-passe   (le mot de passe est demandé sans être affiché)
import readline from "node:readline";
import { hacherMotDePasse } from "../lib/securite.mjs";

function demander(question) {
  return new Promise((resoudre) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, (r) => { rl.close(); process.stdout.write("\n"); resoudre(r); });
  });
}

const mdp = process.env.MOT_DE_PASSE || (await demander("Nouveau mot de passe administrateur (12 caractères minimum) : "));
if (!mdp || mdp.length < 12) {
  console.error("Mot de passe trop court : 12 caractères minimum.");
  process.exit(1);
}
console.log("\nAjoutez cette ligne à votre fichier .env (ou aux variables de l'hébergeur) :\n");
console.log(`ADMIN_PASSWORD_HASH='${hacherMotDePasse(mdp)}'`);
