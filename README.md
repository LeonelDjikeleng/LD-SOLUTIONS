# LD SOLUTIONS · site web

Site commercial de LD SOLUTIONS : création, amélioration et maintenance de sites web pour les PME du Québec.
Français (fr-CA), mobile d'abord, aucun témoin de suivi, formulaires réellement enregistrés, administration des demandes.

## Démarrer en local

```bash
npm install            # Node.js 22.13 ou plus récent
npm run build          # construit le site dans dist/
npm start              # http://127.0.0.1:3000
```
Pour activer l'administration en local : `npm run admin:mot-de-passe`, copier la ligne obtenue dans un fichier `.env` (voir `.env.example`), relancer, puis ouvrir `/admin`.

## Tests

```bash
npm test               # 29 tests serveur et validation (dont un vrai envoi SMTP vers un serveur de test)
npm run test:e2e       # 13 scénarios dans Chromium : parcours, sans JavaScript, accessibilité axe-core, mobile
npm run check:prelaunch  # ce qui manque avant la mise en production
```

## Structure

```
src/
  content/offres.mjs        ← SOURCE UNIQUE des prix et des offres (pages, estimateur, données structurées)
  content/site.config.mjs   ← identité, coordonnées, champs à compléter
  pages/*.mjs               ← contenu des 20 pages
  composants.mjs, gabarit.mjs, build.mjs
  assets/                   ← CSS (tokens), JS (menu, formulaire, estimateur), polices OFL hébergées, images
server/
  app.mjs                   ← HTTP : fichiers, API des demandes, mesure anonyme, administration
  lib/                      ← base SQLite, validation, sécurité, courriel (SMTP), administration
  scripts/                  ← mot de passe admin, sauvegarde vérifiée, purge 24 mois
deploy/                     ← Caddy (HTTPS), systemd (service + sauvegarde quotidienne), script de déploiement avec retour arrière
tests/                      ← unit/, e2e/, qa/ (captures)
docs/                       ← stratégie, tarifs, déploiement, rapports, juridique, commercial
```

## Documentation

| Document | Contenu |
|---|---|
| [`docs/01-strategie.md`](docs/01-strategie.md) | Compétences utilisées, marché, segments, positionnement, architecture, direction artistique |
| [`docs/02-tarification.md`](docs/02-tarification.md) | Grille recommandée, coûts, marges, promotions, taxes |
| [`docs/05-deploiement.md`](docs/05-deploiement.md) | Hébergement, installation, DNS, HTTPS, sauvegarde 3-2-1, restauration, retour arrière, maintenance |
| [`docs/06-rapport-tests.md`](docs/06-rapport-tests.md) | Résultats réels des tests, performances, limites |
| [`docs/07-rapport-securite-sauvegarde-conformite.md`](docs/07-rapport-securite-sauvegarde-conformite.md) | Sécurité, sauvegardes, fiche de conformité Loi 25 |
| [`docs/08-couts-recurrents-et-integrations.md`](docs/08-couts-recurrents-et-integrations.md) | Coûts mensuels, intégrations actives et à configurer |
| [`docs/09-informations-a-fournir.md`](docs/09-informations-a-fournir.md) | Ce qu'il manque avant la mise en ligne |
| [`docs/10-mesure-et-plan-amelioration.md`](docs/10-mesure-et-plan-amelioration.md) | Mesure des conversions, plan à 1, 3 et 6 mois |
| [`docs/juridique/`](docs/juridique/) | Points à valider, devis-contrat, avenant, procès-verbal, entente de maintenance |
| [`docs/commercial/`](docs/commercial/) | Kit de prospection, CRM Prospecteur 2.0 |

## Modifier le site

1. Prix : `src/content/offres.mjs`. Textes : `src/pages/`. Coordonnées : `src/content/site.config.mjs`.
2. `npm run build && npm test && npm run test:e2e`
3. Déployer : `deploy/deployer.sh` (sauvegarde, tests, bascule, vérification de santé, retour arrière automatique).

## Licences

Code et contenus : © LD SOLUTIONS. Polices Bricolage Grotesque, Geist et Geist Mono : SIL Open Font License 1.1 (fichiers de licence dans `src/assets/fonts/`).
