# Rapport de tests · 10 octobre 2026

Tous les résultats ci-dessous ont été **réellement exécutés** dans l'environnement de développement (Node 22.22, Chromium 141 via Playwright 1.56.1), sur le site construit et servi par le vrai serveur. Ils ne remplacent pas les vérifications à refaire **sur le site en ligne** (voir §6).

## 1. Synthèse

| Domaine | Résultat |
|---|---|
| Tests serveur et validation (`npm test`) | **29 / 29 réussis** |
| Tests de bout en bout dans Chromium (`npm run test:e2e`) | **15 / 15 réussis** |
| Accessibilité axe-core (WCAG 2.1 A/AA, 18 pages) | **0 violation sérieuse ou critique** (1 contraste corrigé pendant les tests) |
| Lighthouse mobile (local) | Performance **98 à 100**, Accessibilité **100**, Bonnes pratiques **100**, SEO **100** |
| Débordement horizontal (320, 360, 390, 768, 1024, 1440 px) | **Aucun**, sur les 18 pages |
| Requêtes vers des tiers au chargement | **Aucune** |
| Erreurs JavaScript en console | **Aucune** |
| Revue du texte (tirets cadratins, mots creux) | Aucun tiret ; 1 occurrence volontaire (citation d'un mauvais exemple) |

## 2. Serveur (`tests/unit/`)

Vrai serveur HTTP, base SQLite en mémoire, **vrai serveur SMTP local** pour la réception des courriels.

- Demande valide → 201, référence `LD-AAMMJJ-XXXXX`, enregistrée, **notification SMTP reçue** par ldjikeleng@gmail.com (adresse de destination) + accusé de réception au prospect.
- Demande invalide → 422 avec un message par champ, rien d'enregistré.
- Champ piège rempli → enregistrée comme « pourriel », aucune notification (rien n'est perdu en silence).
- Envoi sans JavaScript → redirection 303 vers `/merci/` qui affiche la référence ; référence inconnue non affichée.
- Origine étrangère → 403 ; dépassement de la limite → 429 ; corps > 32 Ko → 413.
- **Base en panne → 500 avec « n'a pas pu être enregistrée »** : jamais de fausse confirmation.
- **Courriel en échec → la demande reste enregistrée**, l'échec est noté et programmé pour 5 nouvelles tentatives.
- En-têtes de sécurité (CSP stricte, nosniff, DENY, Referrer-Policy) ; URL propres ; compression Brotli ; **traversée de dossier impossible** (3 variantes testées).
- Mesure anonyme : événement compté, nom inconnu ignoré.
- Administration : refus sans session, mot de passe faux refusé, connexion → cookie `HttpOnly; SameSite=Strict` ; **modification refusée sans jeton CSRF** ; export CSV avec **formules neutralisées** ; connexion bloquée après 5 essais ; **XSS échappé**.
- Validation : courriels, URL dangereuses (`javascript:`), listes fermées, caractères de contrôle, longueurs maximales, retours à la ligne interdits dans les champs d'une ligne (injection d'en-têtes de courriel, défaut trouvé en relecture et corrigé).

## 3. Navigateur (`tests/e2e/`)

1. 18 pages × 5 largeurs : statut 200, un seul H1, hiérarchie de titres sans saut, titre ≤ 70 caractères, description 70-165 caractères, canonique, `lang="fr-CA"`, aucune image sans `alt`, aucun débordement, aucune erreur, aucun tiers.
2. Tous les liens internes répondent 200.
3. axe-core sur les 18 pages.
4. Menu mobile : ouverture, focus dans le menu, Échap, navigation.
5. **Parcours A** : estimateur (Départ + 2 pages + rendez-vous = 2 020 $) → contact pré-rempli → envoi → demande enregistrée avec formule, options et estimation.
6. **Parcours B** : audit, erreurs affichées et focus sur le premier champ invalide (défaut trouvé et corrigé pendant les tests), envoi, étapes propres à l'audit complet.
7. **Parcours C et D** : changement de type, champs conditionnels, message obligatoire pour une discussion.
8. **Panne serveur simulée et coupure réseau** : message d'échec, aucune confirmation, réponses conservées, lien courriel de secours prérempli.
9. **Sans JavaScript** : envoi réel et page de confirmation avec la référence ; prix lisibles.
10. Réduction des animations : aucun élément invisible.
11. Barre d'action mobile : cachée sur le hero, visible ensuite, cachée près du pied de page.
12. Aucun témoin déposé chez le visiteur ; pages vues comptées.
13. `sitemap.xml` (18 pages, sans `/merci/`), `robots.txt`, page 404.

## 4. Performance (mesures locales, Lighthouse 12.8.2 mobile, 4G simulée)

| Page | Perf. | LCP | CLS | TBT | Poids total |
|---|---|---|---|---|---|
| Accueil | 100 | 1,7 s | 0 | 40 ms | 121 Ko |
| Tarifs | 98 | 1,7 s | 0 | 170 ms | 123 Ko |
| Contact | 100 | 1,5 s | 0 | 30 ms | 121 Ko |
| Création | 100 | 1,7 s | 0 | 0 ms | 119 Ko |

Poids compressés (Brotli) : HTML de l'accueil 8,9 Ko, CSS 10,8 Ko, JavaScript 1,7 à 3,6 Ko par fichier, polices 92 Ko au total (3 fichiers WOFF2 hébergés sur le site). Aucune image lourde : les démonstrations sont codées en HTML/CSS.

*Limite* : mesures sur un serveur local. Les valeurs réelles dépendront de l'hébergeur et du réseau ; à remesurer avec PageSpeed Insights une fois en ligne.

## 4 bis. Refonte visuelle v2 « La planche » (mesures du 10 octobre 2026)

| Page | Perf. | Access. | Bonnes pratiques | SEO | LCP | CLS | TBT | Poids |
|---|---|---|---|---|---|---|---|---|
| Accueil | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms | 141 Ko |
| Tarifs | 97 | 100 | 100 | 100 | 1,8 s | 0 | 190 ms | 143 Ko |
| Contact | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms | 141 Ko |

Défaut trouvé et corrigé pendant la refonte : l'animation du téléphone de l'accueil recalculait les styles d'une vingtaine d'éléments à chaque image (≈ 500 ms de calcul sur un téléphone moyen, performance 88). Réécrite pour n'animer que l'opacité et la position : performance 99, blocage 0 ms. Un 14e test vérifie le tiroir de menu (bouton « Fermer », toucher sur le voile) et le compteur des carrousels.

## 4 ter. Pages intérieures sur téléphone (mesures du 10 octobre 2026)

| Page | Perf. | Access. | Bonnes pratiques | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Tarifs | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms |
| Questions fréquentes | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms |
| Création | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms |

Parcours lus à la molette sur 390 px (script `tests/qa/parcours-mobile.mjs`) pour 12 pages : tarifs, FAQ, création, refonte, maintenance, audit, options, démonstrations, à propos, contact, secteur, confidentialité ; aucune erreur JavaScript. Un 15e test de bout en bout vérifie que chaque pastille du sommaire mène à une section existante, que la pastille active suit la lecture, que la section arrive sous le sommaire (pas cachée dessous) et que l'en-tête s'efface en lisant. Défauts trouvés et corrigés : libellé de cartouche coupé en plein mot (« Démonstrations de sites web (entreprises »), double parenthèse dans les heures ouvrables de la page Contact, texte visible à travers l'en-tête translucide.

## 4 quater. Refonte v3 « Le sur-mesure » (blanc et vert, 10 octobre 2026)

| Page | Perf. | Access. | Bonnes pratiques | SEO | LCP | CLS | TBT | Poids |
|---|---|---|---|---|---|---|---|---|
| Accueil | 99 | 100 | 100 | 100 | 1,8 s | 0 | 120 ms | 160 Ko |
| Tarifs | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms | 162 Ko |
| Questions fréquentes | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms | 158 Ko |
| Contact | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms | 160 Ko |
| Création | 99 | 100 | 100 | 100 | 1,8 s | 0 | 0 ms | 158 Ko |

Tests : 29 / 29 (serveur et validation) et 15 / 15 (bout en bout, dont axe-core). Défauts trouvés et corrigés pendant la refonte : contraste du laiton en petit texte (axe-core), texte visible à travers l'en-tête translucide (en-tête rendu opaque), flèche de lien isolée en bout de ligne, points séparateurs orphelins dans l'étiquette du pied de page, titre d'appel final avec un mot seul en dernière ligne, libellé « Le plus choisi pour une PME » remplacé par « Recommandée pour une PME » (le premier laissait entendre une statistique de ventes qui n'existe pas). Mesures avant/après détaillées dans `docs/11-diagnostic-v3.md`.

## 5. Revue visuelle (Creative QA, Moi 2.0)

Captures vérifiées à 390 et 1440 px (accueil, tarifs, contact, audit, démonstrations, secteur, administration) et script `qa_capture.mjs` de Moi 2.0 (360, 390, 768, 1440 : tout vert). Défauts trouvés et corrigés : bouton secondaire invisible sur fond sombre, annotations du hero qui chevauchaient le titre, texte surdimensionné dans une démo, estimateur collant qui masquait le contenu sur mobile, texte d'étape coupé, liens fléchés qui se repliaient mal.

| Bloc | Note /5 | Commentaire |
|---|---|---|
| Direction artistique | 4,5 | Univers « plan d'architecte » reconnaissable sans logo ; un seul accent pour l'action |
| Images | 4 | Démonstrations codées, nettes et cohérentes ; de vraies réalisations clients les remplaceront |
| Motion | 4 | Un moment signature (le plan devient site), apparitions discrètes, réduit respecté |
| UX et conversion | 4,5 | Action principale visible sans défiler sur mobile, prix et étapes clairs |
| Mobile | 4,5 | Conçu pour le pouce : barre d'action, formulaires 16 px, cartes lisibles |
| Cohérence | 4,5 | Un seul système de composants sur 20 pages |

## 6. Ce qui n'a PAS pu être testé ici (à faire après la mise en ligne)

| Élément | Pourquoi | Procédure |
|---|---|---|
| Envoi réel vers Gmail | Pas d'identifiants SMTP dans cette session | Remplir `SMTP_*`, envoyer une demande, vérifier la réception et le dossier pourriel |
| HTTPS, DNS, redirections | Aucun domaine ni serveur | `docs/05-deploiement.md` §5 |
| Vitesse réelle | Réseau et hébergeur réels | PageSpeed Insights mobile sur 4 pages |
| Vrais téléphones (iPhone, Android) | Pas d'appareil physique | Ouvrir le site, remplir un formulaire, tester le menu |
| Safari et Firefox | Seul Chromium est disponible ici | Navigation et formulaire sur chaque navigateur |
| Copie de sauvegarde hors serveur | rclone non configuré | `docs/05-deploiement.md` §6 |

## 7. Relancer les tests

```bash
npm install
npm test            # serveur et validation
npm run test:e2e    # construit le site puis lance Chromium
```
