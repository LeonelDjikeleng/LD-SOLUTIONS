// Point d'entrée : `npm start`. Charge .env s'il existe (Node 22 : --env-file-if-exists dans package.json).
import http from "node:http";
import { creerApplication } from "./app.mjs";

const app = creerApplication();
const { port, hote, production } = app.config;

const serveur = http.createServer(app);
serveur.requestTimeout = 15_000;
serveur.headersTimeout = 10_000;
serveur.keepAliveTimeout = 5_000;

serveur.listen(port, hote, () => {
  console.log(`LD SOLUTIONS : serveur ${production ? "production" : "développement"} sur http://${hote}:${port}`);
  if (!app.config.adminHashMotDePasse) console.warn("Administration désactivée : ADMIN_PASSWORD_HASH absent.");
  if (!app.config.smtp.hote) console.warn("Notifications par courriel désactivées : SMTP_HOST absent (les demandes sont quand même enregistrées).");
});

function arreter(signal) {
  console.log(`${signal} reçu : arrêt propre.`);
  app.arreter();
  serveur.close(async () => {
    await app.attendreNotifications();
    app.depot.fermer();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => arreter("SIGTERM"));
process.on("SIGINT", () => arreter("SIGINT"));
