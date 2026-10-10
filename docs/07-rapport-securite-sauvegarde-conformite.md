# Rapport de sécurité, de sauvegarde et de conformité · 10 octobre 2026

Compétences : Serveur 2.0 (sécurité, sauvegarde), Moi 2.0 (conformité Québec). Ce rapport décrit ce qui est **en place dans le code et vérifié par des tests**, et ce qui reste à faire en production.

## 1. Sécurité de l'application

| Mesure | État | Preuve |
|---|---|---|
| Aucun secret dans le dépôt ; `.env` ignoré ; `.env.example` sans valeurs | ✅ | Revue du dépôt |
| Mot de passe administrateur stocké en empreinte scrypt (sel aléatoire), jamais en clair | ✅ | `server/lib/securite.mjs`, test de connexion |
| Session : jeton aléatoire de 256 bits, seule son empreinte SHA-256 est en base ; cookie `HttpOnly`, `SameSite=Strict`, `Secure` en production, limité à `/admin`, 8 h | ✅ | Test « connexion » |
| Jeton CSRF sur toutes les actions d'administration ; vérification de l'origine sur l'API | ✅ | Tests 403 |
| Limitation : 5 connexions / 15 min ; 5 demandes / 10 min par adresse IP ; 120 événements / min | ✅ | Tests 429 |
| Validation côté serveur de chaque champ (listes fermées, longueurs, URL, caractères de contrôle, aucun retour à la ligne dans les champs d'une ligne) | ✅ | 11 tests de validation |
| Échappement de toute donnée affichée dans l'administration (XSS) ; CSV protégé contre l'injection de formules | ✅ | Tests XSS et CSV |
| En-têtes : CSP stricte (`'self'` seulement, aucun script en ligne), HSTS en HTTPS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP | ✅ | Test en-têtes |
| Service des fichiers : traversée de dossier bloquée, `/admin` et `/api` en `noindex` | ✅ | Tests |
| Taille des requêtes limitée (32 Ko), délais d'expiration du serveur | ✅ | Test 413 |
| Dépendances : 1 seule en production (`nodemailer` 10.0.10), `npm audit` : 0 vulnérabilité | ✅ | `npm install` |
| Service système durci (utilisateur dédié, `ProtectSystem=strict`, écriture limitée au dossier de données, `UMask 0077`) | 🟡 Prêt | `deploy/ld-solutions.service`, à installer |
| Pare-feu (22, 80, 443), mises à jour automatiques du système | 🟡 Prêt | `docs/05-deploiement.md` §3 |
| Accès SSH par clé seulement, sans mot de passe | ⬜ À faire | Lors de la création du VPS |

**Risques résiduels** : 🟠 la sécurité de la boîte Gmail (activer la validation en deux étapes, obligatoire pour le mot de passe d'application) ; 🟡 une seule instance du serveur (la limitation de débit est en mémoire et se réinitialise au redémarrage, acceptable à ce volume) ; 🟡 module SQLite de Node encore marqué « expérimental » (stable en pratique ; à surveiller lors des mises à jour de Node).

## 2. Sauvegarde et restauration

| Élément | État |
|---|---|
| Sauvegarde cohérente à chaud (`VACUUM INTO`), nom horodaté, jamais d'écrasement | ✅ testée |
| Manifeste SHA-256 + `PRAGMA integrity_check` + comptage des demandes | ✅ testé |
| Détection d'une copie altérée (empreinte différente, code de sortie 2) | ✅ testée |
| Restauration (lecture des demandes depuis la copie) | ✅ testée |
| Rotation : 30 sauvegardes conservées | ✅ |
| Planification quotidienne (timer systemd) | 🟡 Prête, à installer |
| Copie hors serveur chiffrée (rclone crypt vers Google Drive) | ⬜ À configurer |
| Test de restauration trimestriel | ⬜ À planifier |

Stratégie 3-2-1 et procédures : `docs/05-deploiement.md` §6 à §8.

## 3. Conformité (fiche à conserver)

**Ce qui a été mis en place**
- Site entièrement en français (fr-CA) ; aucune autre version.
- Politique de confidentialité complète (Loi 25) : responsable par son titre et ses coordonnées, renseignements recueillis, finalités, conservation (24 mois), fournisseurs et lieux, droits (accès, rectification, suppression, portabilité, retrait), recours à la CAI ; lien dans le pied de chaque page.
- **Aucun témoin ni traceur chez les visiteurs**, aucun contenu tiers (polices hébergées sur le site, aucune carte ni vidéo externe) : aucun bandeau de consentement nécessaire. Vérifié par les tests (0 requête tierce, 0 témoin).
- Mesure d'audience anonyme maison (totaux par jour, sans IP ni identifiant) ; respect du signal Global Privacy Control.
- Formulaires : données minimales, finalité indiquée à côté du bouton, aucune case précochée, aucune inscription à une liste d'envoi.
- Suppression d'une demande depuis l'administration (droit à l'effacement) ; purge automatisable après 24 mois.
- Prix complets, avant taxes seulement ; promotions réelles avec conditions et date de fin réelle ; aucun faux avis, aucun prix barré fictif, aucun compte à rebours.
- Démonstrations identifiées comme fictives sur chaque maquette et dans les mentions légales.
- Accessibilité WCAG 2.1 AA visée, déclaration publiée, tests axe-core.
- Conditions de service publiques, cohérentes avec les prix et le modèle de devis-contrat.

**Ce que vous devez faire**
- Faire valider les textes légaux (conditions, confidentialité) par un conseiller juridique : `docs/juridique/00-fiche-et-points-a-valider.md`.
- Compléter le nom légal, l'hébergeur et son lieu (`site.config.mjs`) : ils s'affichent automatiquement dans les pages légales.
- Réaliser et conserver une évaluation des facteurs relatifs à la vie privée pour Gmail (hors Québec) et pour l'hébergeur s'il est hors Québec.
- Tenir un registre des incidents de confidentialité, même vide.
- Adopter une courte politique interne de gouvernance des renseignements personnels (qui accède aux demandes, durée, suppression).
- Prospection par courriel : respecter la LCAP (identification, désabonnement, base de consentement notée dans le CRM).

**Ce que vous devez nous signaler** : tout nouvel outil qui recueille des données (analytique, pixel, clavardage, prise de rendez-vous, infolettre), tout changement de prix ou de coordonnées.

**Rappel** : ce site a été conçu selon les exigences connues au 10 octobre 2026 ; il ne constitue pas une attestation de conformité juridique.
