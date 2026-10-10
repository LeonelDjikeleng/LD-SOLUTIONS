# Grille tarifaire recommandée — analyse interne

Statut : **grille validée par LD SOLUTIONS le 10 octobre 2026.** Elle n'a pas été testée auprès de vrais prospects ; elle repose sur des prix publiés par des concurrents québécois (voir `01-strategie.md` §4) et sur des estimations de temps.

Source unique dans le code : `src/content/offres.mjs`. Toute modification s'y fait, et se répercute sur toutes les pages, l'estimateur et les données structurées.

## 1. Hypothèses

| Hypothèse | Valeur | Commentaire |
|---|---|---|
| Marché | Québec, B2B surtout | Prix en dollars canadiens, taxes en sus le cas échéant |
| Taux horaire effectif visé | 70 à 85 $/h | Bas de la fourchette « pigiste senior » observée (75-125 $/h), cohérent pour une entreprise qui lance son portfolio |
| Taux affiché hors forfait | 85 $/h, par tranche de 15 min | |
| Coûts directs par projet | ≈ 0 à 30 $ | Outils gratuits ou déjà payés ; l'hébergement et le domaine sont payés par le client |
| Coûts fixes mensuels estimés | 40 à 80 $ | Hébergement du site LD SOLUTIONS, domaine, outils (voir `08-couts-recurrents.md`) |
| Temps non facturable | ≈ 30 % | Prospection, appels, devis, administration |

## 2. Création de sites

| Offre | Prix | Heures estimées | Taux effectif | Marché observé | Lecture |
|---|---|---|---|---|---|
| Départ (≤ 3 pages) | 1 490 $ | 18-22 h | 68-83 $/h | 800-1 500 $ pour 1-3 pages | Au niveau des offres « Essentiel » publiées, avec plus inclus (formulaire enregistré, Loi 25, tests) |
| Professionnel (≤ 7 pages) | 2 990 $ | 38-42 h | 71-79 $/h | 2 500-3 000 $ pour 5-8 pages | Offre recommandée, cœur de la rentabilité |
| Sur mesure (8-15 pages) | dès 5 900 $ | 70-80 h | 74-84 $/h | Agences boutiques nettement plus haut | Devis final après l'appel découverte |

**Pourquoi pas moins cher** : sous 1 200 $, le temps de conception sur mesure n'est plus rémunéré et le site attire des clients qui comparent seulement le prix (Sales 2.0 §13). **Pourquoi pas plus cher** : sans portfolio réel, un prix d'agence serait difficile à justifier ; la transparence et l'audit offert compensent l'absence de références.

Garde-fous de marge : nombre de pages et de rondes de révisions plafonné, contenu attendu du client avec un délai (sinon le calendrier glisse), demandes hors périmètre traitées par avenant.

## 3. Refonte et amélioration

| Offre | Prix | Heures | Taux | Rôle commercial |
|---|---|---|---|---|
| Diagnostic express | Offert | ≈ 45 min | — | Aimant à prospects pour les entreprises qui ont déjà un site ; sert aussi d'ouverture de prospection |
| Audit complet | 390 $ | ≈ 5 h | ≈ 78 $/h | Porte d'entrée payante ; crédité sur projet signé → transforme l'audit en découverte payée |
| Optimisation ciblée | 690 $ | 8 h | ≈ 86 $/h | Vente rapide après un audit |
| Refonte visuelle | dès 2 490 $ | 30-34 h | 73-83 $/h | |
| Refonte complète | sur devis | — | — | Toujours précédée d'un audit |

## 4. Maintenance

| Formule | Mois | An (12 pour 10) | Temps mensuel estimé | Taux | Commentaire |
|---|---|---|---|---|---|
| Essentielle | 49 $ | 490 $ | ≈ 45 min (automatisé en grande partie) | ≈ 65 $/h | Revenu récurrent de base |
| Professionnelle | 119 $ | 1 190 $ | ≈ 1 h 45 (dont 1 h incluse) | ≈ 68 $/h | Recommandée |
| Prioritaire | 229 $ | 2 290 $ | ≈ 3 h (dont 2 h incluses) | ≈ 76 $/h | Délai de réponse renforcé, en heures ouvrables seulement |

Engagements volontairement réalistes : surveillance **automatique** 24/7, mais intervention **en heures ouvrables** ; aucun « 99,9 % garanti », aucune sécurité absolue. Les heures incluses ne se cumulent pas (évite la dette d'heures).

**Valeur récurrente** : 10 clients en Professionnelle = 1 190 $/mois. C'est l'objectif de rétention prioritaire (Vente 2.0 §28).

## 5. Options

Prix fixes pour ce qui est maîtrisé (pages, rédaction, formulaire avancé, rendez-vous, Google Business Profile, mots-clés). **Sur étude** pour ce qui dépend d'outils tiers (CRM, infolettre, paiement, version anglaise, automatisations). Les boutons d'appel, de courriel et WhatsApp sont **inclus** : ce sont des éléments essentiels, pas des suppléments artificiels.

## 6. Promotions

| Promotion | Prix normal | Prix promo | Économie réelle | Conditions | Durée | Effet sur la marge |
|---|---|---|---|---|---|---|
| Audit crédité | 390 $ | 0 $ si projet signé | 390 $ | Projet signé dans les 60 jours | Permanente | Neutre : l'audit remplace la phase de découverte du projet |
| Création + 3 mois d'entretien | 147 $ | 0 $ | 147 $ | Avec une création, maintenance démarrée à la mise en ligne | Permanente | ≈ 2 h offertes contre un revenu récurrent probable |
| Lancement −10 % | 1 490 / 2 990 / 5 900 $ | 1 341 / 2 691 / 5 310 $ | 149 / 299 / 590 $ | Signé au plus tard le 31 mars 2027 + accord pour présenter le projet | Date réelle, l'offre disparaît du site automatiquement après | Taux effectif ≈ 61-76 $/h ; contrepartie : un portfolio réel |
| Maintenance annuelle | 12 mois | 10 mois | 98 à 458 $ | Paiement annuel d'avance | Permanente | Trésorerie avancée, baisse du taux de départ |

Aucun prix barré fictif, aucun compte à rebours, aucun nombre de places inventé. Grille et offre de lancement **validées par LD SOLUTIONS le 10 octobre 2026**.

## 7. Modalités de paiement

- Départ : 50 % / 50 %. Professionnel : 40 / 40 / 20. Sur mesure : 30 / 40 / 30.
- Factures payables à 15 jours ; virement Interac ou lien de paiement sécurisé (à configurer).
- Mise en ligne après paiement de l'étape correspondante ; propriété transférée au paiement complet.
- Maintenance payable d'avance, mensuellement ou annuellement.

## 8. Taxes

Les prix sont affichés **avant taxes**. Si LD SOLUTIONS est inscrite à la TPS/TVQ (obligatoire au-delà de 30 000 $ de ventes taxables sur quatre trimestres consécutifs, selon la règle du petit fournisseur), la TPS (5 %) et la TVQ (9,975 %) s'ajoutent. **À confirmer** avec votre statut fiscal ; la mention « taxes en sus, le cas échéant » couvre les deux situations.

## 9. Ce qui ferait changer la grille

- Taux de conversion des devis > 60 % sur 10 propositions → les prix sont probablement trop bas : +10 %.
- Taux < 20 % avec l'objection « trop cher » dominante → revoir la présentation de la valeur avant de baisser le prix ; envisager une offre Départ à périmètre réduit.
- Temps réel supérieur de 25 % aux estimations sur 3 projets → ajuster le périmètre ou le prix.
