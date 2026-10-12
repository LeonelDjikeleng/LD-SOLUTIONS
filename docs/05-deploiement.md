# Installation, déploiement, sauvegarde et retour arrière

Compétence appliquée : **Serveur 2.0**. Ligne d'état : client Leonel Djikeleng · projet site vitrine · environnement : **aucune production existante** · mode : **ANALYSE pour le serveur** (aucun accès à un hébergeur, un domaine ou un DNS dans cette session) · risque global : 🟢 (création, rien à migrer).

> Rien n'a été mis en ligne. Les commandes ci-dessous sont à exécuter par vous (ou par moi dans une session qui aura accès au serveur), après votre validation des étapes 🟠 et 🔴.

## 1. Audit de l'environnement (état initial, 10 octobre 2026)

| Point | Constat |
|---|---|
| Dépôt Git | `leoneldjikeleng/ld-solutions`, branche de travail `claude/sweet-bohr-9oblqg`, aucun historique antérieur |
| Production, DNS, domaine | Inexistants (non vérifiables ici) |
| Base de données | SQLite (fichier), créée au premier démarrage, migrations versionnées dans `server/lib/db.mjs` |
| Secrets | Aucun dans le dépôt. Attendus en variables d'environnement : `ADMIN_PASSWORD_HASH`, `SMTP_*` (voir `.env.example`). `.env` est ignoré par Git. |
| Dépendances | Node.js ≥ 22.13 ; une seule dépendance de production (`nodemailer`, version figée) |

## 2. Hébergement recommandé

**Recommandation : un petit serveur virtuel (VPS) situé au Québec**, par exemple OVHcloud à Beauharnois ([page VPS Canada](https://www.ovhcloud.com/fr-ca/vps/vps-canada/)).

Pourquoi :
- Les demandes de vos prospects restent au Québec : la politique de confidentialité est plus simple et l'évaluation des facteurs relatifs à la vie privée (Loi 25) aussi.
- Node.js + SQLite + Caddy tiennent sur la plus petite offre (1 à 2 vCPU, 2 à 4 Go de mémoire).
- Coût estimé : environ 6 à 15 $ par mois selon l'offre (**prix à vérifier dans le configurateur**, non confirmé par ma recherche).

| Option | Coût estimé | Pour | Contre |
|---|---|---|---|
| **VPS au Québec (recommandé)** | 6-15 $/mois | Données au Québec, contrôle complet, aucune limite d'usage | Vous (ou nous) gérez les mises à jour du serveur |
| Hébergement Node.js géré (Hostinger, Render, Railway…) | 5-25 $/mois | Moins d'administration | Données souvent hors Québec ; disque persistant parfois payant |
| Site statique seul (sans serveur) | 0-5 $/mois | Gratuit ou presque | Pas d'enregistrement des demandes ni d'administration : il faudrait un service de formulaires tiers. Déconseillé. |

## 2 bis. Décision du 11 octobre 2026 : Hostinger (déjà payé)

Leonel Djikeleng a déjà payé un hébergement Hostinger (202 $ pour 2 ans). Souscrire en plus un VPS ajouterait un abonnement avant le premier encaissement : **le site ira donc sur Hostinger** (décision DEC-2, Business Architect 2.0). Le VPS ci-dessous reste l'option de repli.

Conditions vérifiées sur la documentation de Hostinger le 11 octobre 2026 : les applications Node.js (versions 18, 20, 22 et 24) sont offertes sur les forfaits **Business** et **Cloud** ; le forfait Premium n'est pas mentionné ([support Hostinger](https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger)). Les dossiers `hbuilds/` et `public_html` sont réécrits à chaque déploiement.

| # | Étape | Niveau |
|---|---|---|
| 1 | hPanel : vérifier que « Node.js Web Apps » est proposé. Sinon (forfait Premium) : **ne pas changer de forfait sans décision** ; choisir entre la mise à niveau Hostinger et le VPS de la section 3 | 🟠 |
| 2 | Créer l'application depuis le dépôt Git, Node 22, commande de construction `npm ci && npm run build`, fichier d'entrée `server/index.mjs` | 🟡 |
| 3 | Variables d'environnement : `NODE_ENV=production`, `SITE_URL`, `TRUST_PROXY=1`, `ADMIN_PASSWORD_HASH`, `SMTP_*`, et **`DATABASE_PATH` et `BACKUP_DIR` vers un dossier hors de `hbuilds/` et `public_html`** (sinon la base des demandes serait effacée au déploiement suivant). Si l'application ne répond pas, ajouter `HOST=0.0.0.0` | 🟠 |
| 4 | Vérifier qu'un fichier écrit dans ce dossier survit à un redéploiement (envoyer une demande d'essai, redéployer, la retrouver dans `/admin`). **Non vérifié à ce jour** : bloquant | 🟠 |
| 5 | Sauvegarde : tâche planifiée (cron de hPanel) qui lance `npm run sauvegarde` chaque jour, plus les sauvegardes de Hostinger | 🟡 |
| 6 | Recopier l'emplacement du centre de données dans `site.config.mjs › hebergeur.lieu` (le contrôle avant mise en ligne bloque tant qu'il est vide) | 🟠 |
| 7 | Domaine, HTTPS (géré par Hostinger), puis vérifications de la section 5 | 🔴 |

## 3. Installation sur un VPS Ubuntu 24.04 (≈ 1 heure)

Niveau 🟡 (nouveau serveur, aucune donnée existante).

```bash
# Paquets de base, pare-feu, mises à jour automatiques
sudo apt update && sudo apt -y upgrade
sudo apt -y install ufw unattended-upgrades git curl sqlite3 rclone
sudo ufw allow OpenSSH && sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw enable
# Node.js 22 (dépôt officiel NodeSource) et Caddy (dépôt officiel) : suivre leurs instructions d'installation
# Utilisateur dédié et dossiers
sudo adduser --system --group --home /srv/ld-solutions ldsite
sudo -u ldsite mkdir -p /srv/ld-solutions/{releases,shared/data}
sudo -u ldsite cp .env.example /srv/ld-solutions/shared/.env   # puis le remplir
sudo chmod 600 /srv/ld-solutions/shared/.env
```

Remplir `/srv/ld-solutions/shared/.env` : `SITE_URL`, `ADMIN_PASSWORD_HASH` (généré avec `npm run admin:mot-de-passe` sur votre ordinateur), `SMTP_*`.

**Notifications par Gmail** : activez la validation en deux étapes sur le compte ldjikeleng@gmail.com, créez un « mot de passe d'application » (Compte Google › Sécurité), puis `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`, `SMTP_SECURE=1`, `SMTP_USER=ldjikeleng@gmail.com`, `SMTP_PASSWORD=<mot de passe d'application>`. Vous ne saisissez jamais ce mot de passe dans une conversation : seulement dans le fichier `.env` du serveur.

```bash
# Services
sudo cp deploy/ld-solutions.service deploy/ld-solutions-sauvegarde.{service,timer} /etc/systemd/system/
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile     # après avoir remplacé votre-domaine.ca
sudo systemctl daemon-reload
# Premier déploiement
sudo -u ldsite /srv/ld-solutions/deploy/deployer.sh main   # ou le script copié depuis le dépôt
sudo systemctl enable --now ld-solutions ld-solutions-sauvegarde.timer
sudo systemctl reload caddy
```

## 4. Nom de domaine et DNS (🔴 à valider : rend le site public)

1. Réservez le domaine **à votre nom** (ex. un .ca auprès d'un registraire canadien).
2. Enregistrements : `A` (et `AAAA` si IPv6) pour `votre-domaine.ca` et `www` vers l'adresse IP du VPS.
3. Caddy obtient le certificat HTTPS automatiquement dès que le DNS répond.
4. Courriel : si vous gardez Gmail, aucune modification MX. Si vous créez une adresse au nom du domaine plus tard, configurez SPF, DKIM et DMARC avant d'envoyer.

## 5. Vérifications après mise en ligne (à faire, puis cocher)

```bash
curl -sI https://www.votre-domaine.ca | head -20        # 200, HSTS, CSP
curl -sI http://votre-domaine.ca                         # redirection 301/308 vers https://www.
curl -s https://www.votre-domaine.ca/sante               # {"ok":true,"base":true,"courriel":"configure"}
```
- [ ] HTTPS valide, redirections http → https et domaine nu → www
- [ ] Envoyer une vraie demande depuis un téléphone : confirmation à l'écran, courriel reçu sur ldjikeleng@gmail.com, demande visible dans `/admin`
- [ ] `/admin` : connexion, changement de statut, export CSV
- [ ] PageSpeed Insights mobile sur l'accueil et les tarifs
- [ ] Google Search Console : propriété validée, `sitemap.xml` soumis
- [ ] Sauvegarde : `sudo systemctl start ld-solutions-sauvegarde` puis vérifier le fichier et sa copie hors serveur

## 6. Sauvegarde 3-2-1

| Copie | Où | Fréquence | Vérification |
|---|---|---|---|
| 1. Base en service | VPS, `/srv/ld-solutions/shared/data/` | Continue | `/sante` |
| 2. Sauvegardes locales | VPS, `shared/data/sauvegardes/` (30 conservées) | Quotidienne (timer) | Empreinte SHA-256 + `PRAGMA integrity_check`, automatiques |
| 3. Copie hors serveur, chiffrée | Google Drive via `rclone crypt` (remote `ld-chiffre`) | Quotidienne | Test de restauration trimestriel |
| (Code) | GitHub | À chaque modification | — |

Configurer rclone une fois : `rclone config` → un remote Google Drive, puis un remote `crypt` nommé `ld-chiffre` qui le chiffre (gardez le mot de passe de chiffrement dans votre gestionnaire de mots de passe : sans lui, la copie est illisible, même pour vous). Activez aussi, si l'offre le permet, la sauvegarde automatique du VPS proposée par l'hébergeur.

## 7. Restauration (testée dans cette session sur une copie)

```bash
sudo systemctl stop ld-solutions
cd /srv/ld-solutions/current
node server/scripts/sauvegarde.mjs --verifier /srv/ld-solutions/shared/data/sauvegardes/<fichier>.sqlite   # doit afficher integrite: ok, empreinte: conforme
cp /srv/ld-solutions/shared/data/ld-solutions.sqlite /srv/ld-solutions/shared/data/avant-restauration-$(date +%F-%H%M).sqlite
cp /srv/ld-solutions/shared/data/sauvegardes/<fichier>.sqlite /srv/ld-solutions/shared/data/ld-solutions.sqlite
rm -f /srv/ld-solutions/shared/data/ld-solutions.sqlite-wal /srv/ld-solutions/shared/data/ld-solutions.sqlite-shm
sudo systemctl start ld-solutions && curl -s http://127.0.0.1:3000/sante
```
Niveau 🔴 en production : la base courante est d'abord copiée (jamais écrasée sans copie).

## 8. Retour arrière d'une version du site

Le script `deploy/deployer.sh` garde les 5 dernières versions et revient automatiquement à la précédente si la vérification de santé échoue. Retour manuel :
```bash
ls -1dt /srv/ld-solutions/releases/*        # choisir la version précédente
ln -sfn /srv/ld-solutions/releases/<version> /srv/ld-solutions/current && sudo systemctl restart ld-solutions
```
Les données (`shared/data`) ne sont jamais touchées par un changement de version. Les migrations de base sont additives ; toute future migration destructive devra suivre le circuit 🔴 (sauvegarde vérifiée, validation, plan de retour).

## 9. Maintenance courante

| Fréquence | Tâche | Commande |
|---|---|---|
| Chaque semaine | Lire les nouvelles demandes, mettre à jour les statuts | `/admin` |
| Chaque mois | Mises à jour du serveur (automatiques) et de Node.js ; vérifier `npm audit` | `npm audit --omit=dev` |
| Chaque trimestre | Test de restauration depuis la copie hors serveur | §7 sur une copie |
| Chaque année | Renouvellement du domaine ; relecture des textes légaux et des prix | — |
| Tous les 24 mois | Purge des demandes sans suite (durée annoncée) | `npm run purger -- --confirmer` (après sauvegarde) |

## 10. Modifier le contenu

- **Prix et offres** : `src/content/offres.mjs` (une seule source pour tout le site).
- **Coordonnées, nom légal, hébergeur** : `src/content/site.config.mjs`.
- **Textes** : `src/pages/*.mjs`. Puis `npm run build`, `npm test`, `npm run test:e2e`, et déployer.
