# Informations à fournir avant la mise en ligne

Mise à jour du 10 octobre 2026 après les réponses de Leonel Djikeleng. `npm run check:prelaunch` vérifie automatiquement les points bloquants.

## Réglé

| Information | Réponse | Où c'est appliqué |
|---|---|---|
| Statut juridique | Entreprise individuelle exploitée sous les prénom et nom de Leonel Djikeleng (décision du 10 octobre 2026 : pas de nom commercial pour le moment) | `site.config.mjs`, mentions légales, conditions, confidentialité, devis-contrat |
| Responsable de la protection des renseignements personnels | Leonel Djikeleng, propriétaire | Politique de confidentialité |
| Hébergement | **Hostinger** (déjà payé : 202 $ pour 2 ans), décision du 11 octobre 2026 à la place du VPS OVHcloud | `site.config.mjs`, politique de confidentialité, mentions légales, `05-deploiement.md` §2 bis |
| Grille tarifaire et offre de lancement | Validées | `offres.mjs` |
| Marché | Québec, dollars canadiens | Tout le site |
| Téléphone | 418 255-7236 | En-tête du menu, barre d'appel sur téléphone, page Contact, pied de page, mentions légales, données structurées |
| Nom affiché | Leonel Djikeleng (sans nom commercial, donc sans immatriculation pour le moment) | Tout le site, image de partage, courriels, contrats |
| Lieu d'établissement | Région de Québec | Conditions de service : district judiciaire de Québec |

## Reste à fournir

| # | Information | Pourquoi | Bloquant ? |
|---|---|---|---|
| 1 | **Nom de domaine** (à réserver à votre nom) | Adresse du site, HTTPS, plan du site | Oui |
| 2 | **Hostinger** : (a) vérifier que le menu « Node.js Web Apps » existe dans hPanel (forfait Business ou Cloud) ; (b) recopier l'emplacement du centre de données dans `site.config.mjs › hebergeur.lieu` ; (c) s'il est hors du Québec, faire l'évaluation des facteurs relatifs à la vie privée avant la mise en ligne | Politique de confidentialité exacte (Loi 25) ; sans Node.js, le site ne peut pas tourner sur ce forfait | Oui |
| 3 | Mot de passe d'application Gmail (dans le `.env` du serveur, jamais dans une conversation) | Notifications des demandes | Oui |
| 4 | Immatriculation et NEQ | Plus nécessaire tant que l'activité est exercée sous « Leonel Djikeleng » seulement : la Loi sur la publicité légale des entreprises vise la personne qui exploite sous un nom qui ne comprend pas ses prénom et nom (à confirmer auprès du Registraire). Si un nom commercial (ex. « LD SOLUTIONS ») est utilisé plus tard, sur le site, une facture ou une carte, l'immatriculation redevient obligatoire | Non |
| 5 | ~~Adresse d'affaires~~ : **Case postale 202, Québec (Québec) G1E 2G4** (fournie le 11 octobre 2026) | Identification du commerçant | Réglé |
| 6 | ~~Statut TPS/TVQ~~ : **non inscrit** (petit fournisseur, confirmé le 11 octobre 2026) | Mention exacte des taxes | Réglé |
| 7 | WhatsApp, lien de rendez-vous (facultatifs) | Active les boutons correspondants | Non |
| 8 | Vos vrais projets, avec l'accord des clients | Remplacer les démonstrations fictives par de vraies réalisations | Non |

**Ce que j'ai supposé, à confirmer** : service offert à distance ; capacité de répondre sous 2 jours ouvrables ; les automatisations et intégrations tierces restent « après étude » par prudence.
