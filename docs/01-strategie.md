# LD SOLUTIONS — Stratégie du site (phases A à C)

Document de travail interne. Il synthétise les sept compétences consultées et sert de référence pour toutes les décisions du site. Date : 10 octobre 2026.

> **Légende** — FAIT : vérifié (source indiquée) · HYPOTHÈSE : retenue faute d'information, à confirmer · RECOMMANDATION : décision proposée.

---

## 1. Compétences utilisées et rôle réel de chacune

| Compétence | Lue | Ce qui a été appliqué concrètement |
|---|---|---|
| **Moi 2.0** (direction créative) | Oui, avec `direction-artistique`, `qa`, `performance`, `motion`, `conformite-quebec` | Triage (mode, niveau d'immersion), brief DA, storyboard, partition motion, registre des faits, conformité Loi 25 / Charte / LPC intégrée pendant la construction, script `qa_capture.mjs` |
| **10k website** | Oui | Standards techniques : défilement natif, aucun blocage du premier affichage, budgets de performance, revue du texte (tirets cadratins et mots creux), une action principale par page. **Non appliqué** : son pipeline imposé (vidéo Higgsfield + déploiement Hostinger) — génération payante non validée et aucun accès Hostinger dans cette session. Voir §9. |
| **Vente 2.0** | Oui | Diagnostic marché, segmentation, proposition de valeur, positionnement, unit economics, plan d'acquisition |
| **Sales 2.0** | Oui | Parcours de vente (découverte → proposition → closing), qualification (champs du formulaire), objections traitées dans la FAQ, structure des offres et du prix |
| **Prospecteur 2.0** | Oui | Segments prioritaires et scoring, pages sectorielles réutilisables en prospection, pipeline de statuts dans l'administration, kit de messages conformes LCAP |
| **Maître 2.0-contrat** | Oui | Conditions de service (niveau PROTECTEUR), modèle de devis-contrat, cohérence prix/site/contrat, repères C.c.Q. (art. 2125, 2129, 1474, 1623), points à faire valider |
| **Serveur 2.0** | Oui | Audit de l'environnement, classement des risques, sauvegarde 3-2-1, secrets hors du code, procédure de déploiement et de retour arrière, contrôles post-déploiement |

---

## 2. Triage (Moi 2.0, §4)

| Élément | Décision |
|---|---|
| Mode | 1 (création premium) + 7 (conversion premium) + 10 (direction de création complète) |
| Niveau fonctionnel | **Vitrine interactive** : formulaires qualifiés, estimateur de prix, administration des demandes. Pas de paiement en ligne au lancement (§8). |
| Niveau d'immersion | **2,5** — « premium rassurant » avec touches éditoriales. Justification : la clientèle cible (PME, métiers) doit comprendre vite et agir ; un site d'agence doit pourtant démontrer un savoir-faire visuel. Un seul moment signature, pas de WebGL, pas de vidéo lourde. |
| Sources disponibles | Nom commercial, courriel. Aucun logo, aucune photo, aucun projet client, aucun site existant. |
| Environnement | Dépôt Git vide, Node 22 (SQLite intégré), Chromium + Playwright, réseau filtré (npm accessible). Pas de connecteur d'hébergement. Connecteur Higgsfield présent (génération payante). |
| Bloquants réels | Aucun pour construire. Plusieurs informations nécessaires **avant la mise en ligne** (§10). |

---

## 3. Registre des faits (Moi 2.0, §9)

| Information | Source | Fiabilité |
|---|---|---|
| Nom commercial : LD SOLUTIONS | Mandat | Confirmée |
| Courriel officiel : ldjikeleng@gmail.com | Mandat | Confirmée |
| Activités : créer, améliorer, entretenir des sites web | Mandat | Confirmée |
| Marché géographique | Réponse du 10 octobre 2026 | Confirmée : Québec ; établissement dans la région de Québec |
| Statut juridique | Réponse de Leonel Djikeleng (10 octobre 2026) | Confirmée : entreprise individuelle de Leonel Djikeleng, nom d'affaires LD SOLUTIONS |
| NEQ, adresse d'affaires | — | Manquants |
| Nom de domaine | — | Aucun choisi pour le moment |
| Hébergement | Recommandation acceptée (« le meilleur possible ») | VPS OVHcloud à Beauharnois (Québec), à souscrire |
| Grille tarifaire et offre de lancement | Réponse du 10 octobre 2026 | Validées |
| Inscription TPS/TVQ | — | Manquante → prix affichés « taxes en sus, le cas échéant » |
| Téléphone, WhatsApp | — | Manquants → non affichés (champs prévus dans la configuration) |
| Années d'expérience, équipe, clients, témoignages, certifications | — | Manquants → **rien n'est affiché**, aucune invention |
| Responsable de la protection des renseignements personnels | Statut d'entreprise individuelle | Leonel Djikeleng, propriétaire |

---

## 4. Marché et hypothèse géographique

**CONFIRMÉ le 10 octobre 2026 : marché principal le Québec, en français, prix en dollars canadiens. Entreprise établie dans la région de Québec. Service offert à distance dans toute la province.**

Pourquoi : l'ensemble des compétences fournies (Moi 2.0, Vente 2.0, Sales 2.0, Maître 2.0) est calibré pour le cadre québécois, qui est aussi le plus exigeant au Canada (Loi 25, Charte de la langue française, LPC). Construire pour le Québec rend le site compatible avec un marché francophone plus large ; l'inverse n'est pas vrai.

Ce qui changerait si l'hypothèse est fausse : devise, grille de prix (le pouvoir d'achat diffère fortement, par exemple en Afrique francophone), mentions légales, droit applicable des conditions de service. Tout est centralisé dans `src/content/site.config.mjs` et `src/content/offres.mjs` pour être modifié en un seul endroit.

Aucune adresse locale ni page de ville n'est créée : il n'existe pas d'adresse vérifiée, et des pages de villes sans présence réelle seraient trompeuses.

### Faits observés sur les prix (recherche du 10 octobre 2026)

| Source | Observation | Nature |
|---|---|---|
| [Inteltek](https://inteltek.net/creation-de-site-web-3/) | Site vitrine 1-3 pages : 1 497 $ ; 5-8 pages : 2 497 $ | Prix publié par un prestataire québécois |
| [Mistral Design](https://mistraldesign.ca/forfaits-cle-en-main/) | 5 pages + hébergement 1 an : 3 000 $ ; page supplémentaire dès 250 $ | Prix publié |
| [Idée Création Web](https://www.ideecreationweb.com/forfaits-conception-site-web) | Une page : 895 $ + taxes | Prix publié |
| [Conception Graphica](https://conceptiongraphica.com/combien-coute-site-web-quebec/) | Essentiel dès 800 $ ; Affaires dès 1 800 $ (jusqu'à 10 pages) | Prix publié |
| [Stéphane Roy](https://stephaneroy.ca/combien-coute-un-site-web-au-quebec-en-2025-tarifs-hebergement-refonte-seo/) | Site WordPress professionnel : 1 200 à 3 500 $ | Estimation d'un prestataire |
| h1site (guide Montréal 2026, via résultat de recherche ; page non consultable depuis cet environnement) | Pigistes seniors 75-125 $/h ; agences boutiques 100-175 $/h | Estimation d'un prestataire, non vérifiée directement |
| [La Fabrique du Net](https://www.lafabriquedunet.fr/blog/cout-site-web/) | France : médiane d'un site vitrine ≈ 3 800 € | Référence hors marché, pour ordre de grandeur seulement |
| [Seahawk](https://seahawkmedia.com/fr/wordpress/forfaits-de-maintenance-wordpress/) | Maintenance : 25 $ à 600 $+/mois | Fourchette générale, non québécoise |

**Lecture** : le marché québécois des petits sites est encombré entre 800 $ et 3 000 $ (pigistes, gabarits) ; les agences boutiques facturent nettement plus. Il existe un espace pour une offre **sur mesure, transparente et orientée demandes de clients**, au prix d'un pigiste senior plutôt que d'une agence. La tarification détaillée est dans `docs/02-tarification.md`.

---

## 5. Segments de clientèle (Vente 2.0 §11, Prospecteur 2.0)

Critères : valeur d'un client pour l'entreprise ciblée (donc valeur d'une demande), faiblesse fréquente des sites actuels, rapidité de décision, accessibilité par la prospection, capacité de payer.

| Rang | Segment | Pourquoi | Score |
|---|---|---|---|
| 1 | **Entrepreneurs et métiers** (plomberie, électricité, rénovation, toiture, paysagement, nettoyage commercial) | Un seul contrat obtenu vaut souvent plus que le site. Recherche locale sur téléphone, décision par le propriétaire, sites souvent vieillissants. Particularité québécoise : licence RBQ à afficher. | 🔥 |
| 2 | **Services automobiles** (garages, carrosseries, esthétique auto, pneus) | Forte saisonnalité (pneus, hiver), besoin de prise de rendez-vous, avis Google déterminants. | 🔥 |
| 3 | **Services professionnels et B2B** (consultants, comptables, cabinets, entreprises de services) | Panier plus élevé, besoin de crédibilité ; cycle de décision plus long. | 🟠 |
| 4 | Restaurants et commerces | Budgets serrés, dépendance aux plateformes de réservation et de livraison. À traiter au cas par cas. | 🟡 |
| 5 | Immobilier | Courtiers souvent liés au site d'une bannière, règles OACIQ. Peu prioritaire au lancement. | ⚪ |

**RECOMMANDATION** : trois pages sectorielles au lancement (rangs 1 à 3), distinctes par leurs problèmes, pas des copies. Les autres secteurs sont servis par les pages générales.

---

## 6. Proposition de valeur et positionnement

- **Pour qui** : PME, entrepreneurs et travailleurs autonomes du Québec dont le site ne leur apporte pas (ou plus) de demandes.
- **Problème** : site absent, daté, illisible sur téléphone, sans parcours clair vers une demande, ou laissé sans entretien.
- **Solution** : un site conçu pour l'action (demander un devis, appeler, réserver), construit sur mesure, rapide, puis entretenu.
- **Bénéfice** : une présence qui inspire confiance et qui rend la prise de contact évidente, avec des prix connus d'avance.
- **Pourquoi nous** : prix publiés et périmètres écrits ; conception sur mesure sans gabarit ; conformité québécoise (Loi 25, français) incluse ; le client est propriétaire de son site et de son domaine ; un seul interlocuteur du premier appel à l'entretien.
- **Pourquoi maintenant** : la plupart des recherches de services locaux se font sur téléphone ; un site lent ou illisible fait perdre des demandes chaque semaine (constat qualitatif, aucun chiffre avancé sur le site).

**Positionnement** : *le partenaire web transparent des PME* — qualité d'agence, prix de pigiste senior, transparence totale. On n'est ni le moins cher, ni une grande agence.

**Promesse du site (titre principal)** : « Un site web qui travaille pendant que vous travaillez. »
Elle parle directement à l'entrepreneur qui est sur un chantier ou dans son atelier, et elle annonce un résultat (des demandes) sans le garantir.

---

## 7. Architecture du site

```
/                                   Accueil                     CTA : Demander un devis
/creation-site-web/                 Créer                       CTA : Créer mon site web
/refonte-amelioration/              Améliorer                   CTA : Améliorer mon site
/maintenance/                       Entretenir                  CTA : Choisir une formule
/services-complementaires/          Options et intégrations     CTA : Discuter de mon projet
/tarifs/                            Tarifs + estimateur         CTA : Choisir une formule
/audit/                             Audit de site               CTA : Demander mon audit
/demonstrations/                    Démonstrations (fictives, identifiées)  CTA : Demander un devis
/secteurs/entrepreneurs-construction/
/secteurs/services-automobiles/
/secteurs/services-professionnels/
/a-propos/                          Approche et engagements
/faq/                               Questions fréquentes
/contact/                           Demande de projet (4 parcours)
/conditions-de-service/  /politique-de-confidentialite/  /mentions-legales/  /accessibilite/
/merci/  /404.html  /admin (privé, non indexé)
```

Choix assumés :
- **Pas de portfolio** : aucun projet client réel n'existe. Une page « Démonstrations » montre trois concepts codés, chacun marqué « entreprise fictive ».
- **Pas d'espace client** ni de paiement en ligne au lancement : les projets sur mesure passent par devis + contrat + facture d'acompte (Sales 2.0, Maître 2.0).
- **Une seule administration**, minimale : lister les demandes, suivre leur statut commercial, exporter en CSV, voir la mesure anonyme.

### Parcours de conversion (mission §9)

| Parcours | Entrée | Formulaire | Après l'envoi |
|---|---|---|---|
| A — Nouveau site | Accueil, Création, Tarifs (estimateur) | `/contact/?type=creation` (formule et options pré-remplies) | Référence affichée, prochaine étape : appel découverte de 30 min sous 2 jours ouvrables |
| B — Site existant | Accueil, Refonte, Audit, pages sectorielles | `/audit/` (type audit) | Diagnostic express ou proposition d'audit complet |
| C — Maintenance | Maintenance, Tarifs | `/contact/?type=maintenance` | Vérification du site et proposition de formule |
| D — Discuter | Partout (lien secondaire), À propos | `/contact/?type=discussion` | Réponse et proposition d'un moment d'appel |

---

## 8. Paiement en ligne (mission §9.3)

**RECOMMANDATION : pas de paiement direct sur le site au lancement.**
- Les offres de création dépendent du contenu et des besoins : un achat immédiat créerait des malentendus de périmètre (Maître 2.0 §18-19).
- Le flux recommandé : demande → appel → devis-contrat signé → facture d'acompte payable par virement Interac ou par lien de paiement (Stripe Payment Links ou Square, sans développement, aucune carte stockée par LD SOLUTIONS).
- Candidat futur au paiement direct : l'**Audit complet** (prix fixe, périmètre fermé). À activer seulement quand le compte de paiement existe ; rien n'est simulé sur le site.

---

## 9. Brief de direction artistique (version 2, 10 octobre 2026)

La version 1 (fond presque noir, cyan, orange, grille quadrillée, cartes arrondies) a été jugée trop proche des sites « tech » générés en série. La version 2 garde le concept et change l'exécution.

```
CONCEPT : « La planche. » Chaque page est un jeu de plans d'architecte : tirage bleu
          (cyanotype), papier calque, cotes, cartouche, et un seul trait de surligneur
          jaune pour ce qui demande une action. Créer = tracer · Améliorer = rénover ·
          Entretenir = inspecter. Le langage visuel des entrepreneurs (segment n° 1).
ARCHÉTYPE : Architectural + local premium · immersion 2,5
PERSONNALITÉ : précis, franc, artisanal · à éviter : le « tech » sombre générique
PALETTE (tokens par rôle) :
  plan        #14307A  bleu de tirage cyanotype (héros, sections fortes)
  plan-nuit   #0E2563  bleu profond (pied de page, contrastes)
  calque      #EEF1F3  papier calque légèrement bleuté (fond courant)
  feuille     #FFFFFF  feuilles posées sur le calque (offres, formulaires)
  encre       #0C1424  texte ; graphite #4A5363 texte secondaire
  trait       #1F44A8  liens et tracés sur papier
  surligneur  #FFCE3A  ACTION uniquement (boutons, trait sous un mot clé)
  Aucun noir pur, aucun dégradé décoratif.
TYPOGRAPHIE : Big Shoulders Display (titres en capitales étroites, comme les titres
              de planches) · IBM Plex Sans (texte) · IBM Plex Mono (annotations, cotes,
              prix). Licences OFL, polices hébergées sur le site.
FORMES : angles vifs (0 à 2 px), filets de 1 px, aucune ombre sauf la barre flottante.
DÉTAILS SIGNATURE :
  1. Cartouche : chaque page s'ouvre et se ferme sur un cartouche de plan
     (projet, planche, échelle, lieu). Le pied de page est un cartouche complet.
  2. Planches numérotées : chaque section porte son numéro de planche (PL. 01, 02…),
     calculé automatiquement, qui encode l'ordre réel de lecture.
  3. Cote vivante : sous le titre de l'accueil, une ligne de cote mesure la largeur
     réelle de l'écran du visiteur (« 390 px »). Vrai, et propre à ce métier.
  4. Surligneur : le mot clé du titre est souligné au surligneur jaune, tracé à l'arrivée.
  5. Grain de papier et traits de construction (arcs de compas, lignes d'axe) sur le bleu.
MOBILE : menu en tiroir depuis le bas (atteignable au pouce), offres et démonstrations
         en carrousels à défilement natif avec compteur, barre d'action flottante,
         transitions de page natives (View Transitions) en amélioration progressive.
FINITIONS : typographie française (espaces fines insécables avant : ; ! ? et dans les
            guillemets), chiffres tabulaires pour les prix, aucun mot orphelin dans les titres.
```

## 10. Ce qui n'a pas été fait volontairement

- **Vidéo ou images générées par IA** (pipeline 10k / Higgsfield) : consomme des crédits payants → nécessite votre validation. Pour une agence web, la meilleure preuve visuelle est un site réellement codé ; la direction retenue n'en a pas besoin. Option possible plus tard.
- **Déploiement en production** : aucun hébergement ni domaine n'est fourni. Procédure prête dans `docs/05-deploiement.md`.
- **Faux témoignages, chiffres, logos clients** : interdits. La crédibilité repose sur la transparence, les démonstrations et l'audit offert.
