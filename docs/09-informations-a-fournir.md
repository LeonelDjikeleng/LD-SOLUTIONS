# Informations à fournir avant la mise en ligne

Mise à jour du 10 octobre 2026 après les réponses de Leonel Djikeleng. `npm run check:prelaunch` vérifie automatiquement les points bloquants.

## Réglé

| Information | Réponse | Où c'est appliqué |
|---|---|---|
| Statut juridique | Entreprise individuelle de Leonel Djikeleng, nom d'affaires LD SOLUTIONS | `site.config.mjs`, mentions légales, conditions, confidentialité, devis-contrat |
| Responsable de la protection des renseignements personnels | Leonel Djikeleng, propriétaire | Politique de confidentialité |
| Hébergement | Recommandation retenue : VPS OVHcloud à Beauharnois (Québec) | `site.config.mjs`, politique de confidentialité, mentions légales, `05-deploiement.md` |
| Grille tarifaire et offre de lancement | Validées | `offres.mjs` |
| Marché | Québec, dollars canadiens | Tout le site |
| Lieu d'établissement | Région de Québec | Conditions de service : district judiciaire de Québec |

## Reste à fournir

| # | Information | Pourquoi | Bloquant ? |
|---|---|---|---|
| 1 | **Nom de domaine** (à réserver à votre nom) | Adresse du site, HTTPS, plan du site | Oui |
| 2 | **Souscription du VPS OVHcloud** (ou indication d'un autre choix) | Mise en ligne ; si un autre hébergeur est choisi, la politique de confidentialité change | Oui |
| 3 | Mot de passe d'application Gmail (dans le `.env` du serveur, jamais dans une conversation) | Notifications des demandes | Oui |
| 4 | Immatriculation et NEQ | Au Québec, une entreprise individuelle qui exerce sous un nom autre que celui de son exploitant (« LD SOLUTIONS ») doit s'immatriculer au Registraire des entreprises (à vérifier) | Non pour le site, oui pour être en règle |
| 5 | Adresse d'affaires (une case postale suffit) | Identification du commerçant | Non |
| 6 | Statut TPS/TVQ | Mention exacte des taxes | Non |
| 7 | Téléphone, WhatsApp, lien de rendez-vous (facultatifs) | Active les boutons correspondants | Non |
| 8 | Vos vrais projets, avec l'accord des clients | Remplacer les démonstrations fictives par de vraies réalisations | Non |

**Ce que j'ai supposé, à confirmer** : service offert à distance ; capacité de répondre sous 2 jours ouvrables ; les automatisations et intégrations tierces restent « après étude » par prudence.
