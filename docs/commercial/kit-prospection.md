# Kit de prospection Leonel Djikeleng

Compétences appliquées : Prospecteur 2.0 (ciblage, messages, séquence, CRM), Sales 2.0 (découverte, objections, closing), Vente 2.0 (segments, plan). Les messages réutilisent exactement les offres et les prix du site (`src/content/offres.mjs`).

> **Règles qui ne plient pas** : vous envoyez vous-même chaque message, depuis votre messagerie. Chaque courriel commercial vous identifie et offre un moyen simple de refuser les prochains envois (LCAP). Aucune fausse urgence, aucune promesse de résultat, aucun « Re : » trompeur. Une demande de non-contact s'enregistre immédiatement et définitivement.

---

## 1. Qui contacter en premier

| Priorité | Segment | Signal qui justifie le contact (à vérifier et noter dans le CRM) | Offre d'entrée |
|---|---|---|---|
| 🔥 A | Entrepreneurs et métiers (plomberie, électricité, toiture, rénovation, paysagement, nettoyage) | Pas de site ; site non lisible sur cellulaire ; numéro non cliquable ; licence RBQ absente ; formulaire cassé | Diagnostic express offert → Professionnel (2 990 $) |
| 🔥 A | Services automobiles | Pas de prise de rendez-vous en ligne ; heures introuvables ; site lent | Diagnostic express → Professionnel + rendez-vous |
| 🟠 B | Services professionnels / B2B | Site daté, discours générique, aucune méthode expliquée | Audit complet (390 $, crédité) → Professionnel ou Sur mesure |
| 🟡 C | Restaurants, commerces | Site absent mais forte activité sur les réseaux | Départ (1 595 $) |

**Score rapide sur 100** (à inscrire dans le CRM) : besoin visible (0-30) + valeur d'un client pour eux (0-25) + décideur joignable (0-20) + capacité de payer probable (0-15) + proximité de saison (0-10). Contacter à partir de 60.

Chaque constat est noté « vérifié » (avec la date et la source) ou « hypothèse ». Ne jamais affirmer à un prospect un problème non constaté.

---

## 2. Premier courriel (60 à 120 mots)

Objet conseillé : 3 à 7 mots, précis, sans piège.

### A. Entrepreneur dont le site est difficile à lire sur cellulaire (recommandé pour le segment n° 1)

> **Objet :** Votre site sur un cellulaire
>
> Bonjour [Prénom],
>
> En cherchant un [service, ex. couvreur] à [ville], je suis tombé sur votre site. Sur mon cellulaire, il faut zoomer pour lire vos services et le numéro n'est pas cliquable : un client pressé risque d'appeler le suivant.
>
> J'aide les entrepreneurs à avoir un site clair sur téléphone, avec un bouton d'appel et un formulaire de soumission qui fonctionne. Je peux vous envoyer gratuitement les 5 corrections prioritaires pour votre site, par écrit.
>
> Ça vous intéresse ?
>
> Leonel Djikeleng · Sites web · 418 255-7236 · ldjikeleng@gmail.com · [site]
> Si vous ne souhaitez plus recevoir de message de ma part, répondez simplement « stop ».

*Pourquoi celui-ci* : un fait vérifiable dans les deux premières lignes, un résultat avant le moyen, une seule demande à faible engagement (le diagnostic offert).

### B. Entreprise sans site

> **Objet :** [Entreprise] sur Google
>
> Bonjour [Prénom],
>
> Votre fiche Google affiche [X] avis, mais aucun site web : quand un client veut voir vos services ou vous écrire le soir, il n'a nulle part où aller.
>
> Je crée des sites simples et rapides pour les entreprises comme la vôtre, à prix publié (dès 1 595 $, tout est détaillé sur [domaine]/tarifs/). Seriez-vous disponible 15 minutes jeudi ou vendredi pour voir si c'est pertinent pour vous ?
>
> [Signature + désabonnement]

### C. Garage : saison des pneus

> **Objet :** Rendez-vous pneus en ligne ?
>
> Bonjour [Prénom],
>
> À l'approche de la saison des pneus, j'ai regardé votre site : on n'y trouve pas de moyen de demander un rendez-vous sans téléphoner.
>
> J'intègre la prise de rendez-vous en ligne aux sites des ateliers, pour que le téléphone sonne moins pour les mêmes questions. Voulez-vous que je vous montre en 15 minutes à quoi ça ressemblerait pour [Entreprise] ?
>
> [Signature + désabonnement]

### D. Service professionnel

> **Objet :** Une question sur votre site
>
> Bonjour [Prénom],
>
> Votre site présente bien vos compétences en [domaine], mais on n'y voit pas comment se passe un mandat avec vous (étapes, livrables, premier rendez-vous). C'est souvent ce qui fait hésiter un client B2B.
>
> Je réalise des audits de sites (390 $, entièrement déduits si un projet suit) avec des priorités claires. Seriez-vous ouvert à un échange de 15 minutes la semaine prochaine ?
>
> [Signature + désabonnement]

---

## 3. Relances (40 à 80 mots, chacune apporte quelque chose)

| Étape | Délai | Message type |
|---|---|---|
| Relance 1 | J+3 | « Bonjour [Prénom], un exemple concret : [observation précise n° 2 sur leur site]. Je peux vous envoyer les 5 points prioritaires par écrit, sans engagement. Je vous les envoie ? » |
| Relance 2 | J+7 (appel si possible) | « Bonjour, ici Leonel Djikeleng. Je vous avais écrit au sujet de votre site sur cellulaire. Avez-vous deux minutes ? » puis une question : « Aujourd'hui, la plupart de vos nouveaux clients vous trouvent comment ? » |
| Relance 3 (rupture) | J+14 | « Bonjour [Prénom], je ne veux pas encombrer votre boîte. Dois-je fermer le dossier, ou est-ce simplement le mauvais moment ? Dans les deux cas, merci de me le dire en un mot. » |
| Mise en sommeil | après J+14 | Plus rien pendant environ 90 jours, puis une seule reprise avec un élément nouveau (saison, nouvelle observation). |

Commandes CRM correspondantes (exemples). Le CRM vit dans `Documents\LD SOLUTIONS` sur l'ordinateur de Leonel Djikeleng, **jamais dans ce dépôt public** (il contient des renseignements personnels) :
```
python3 scripts/crm.py interaction Prospecteur-CRM.xlsx P-0001 --type "Premier contact" --canal Courriel --resume "Message A, site illisible sur cellulaire"
python3 scripts/crm.py interaction Prospecteur-CRM.xlsx P-0001 --type "Réponse du prospect" --canal Courriel --resultat "Réponse positive" --resume "Veut le diagnostic"
python3 scripts/crm.py noncontact Prospecteur-CRM.xlsx P-0001 --canal Courriel --portee entreprise --note "A répondu stop"
```
(Le moteur `crm.py` est fourni par la compétence Prospecteur 2.0.)

---

## 4. Appel découverte de 30 minutes (Sales 2.0, SPIN)

1. **Ouverture (2 min)** : remercier, rappeler l'objectif : « comprendre votre situation et voir si je peux vous aider ; si ce n'est pas le cas, je vous le dirai ».
2. **Situation (5 min)** : Que vend l'entreprise ? Qui sont les meilleurs clients ? D'où viennent les nouveaux clients aujourd'hui ?
3. **Problème (8 min)** : Qu'est-ce qui ne fonctionne pas avec le site actuel ? Depuis quand ? Avez-vous déjà essayé de le corriger ?
4. **Implication (5 min)** : Combien vaut un nouveau client pour vous ? Que se passe-t-il si rien ne change d'ici [saison] ?
5. **Besoin et critères (5 min)** : À quoi ressemblerait un bon résultat dans 6 mois ? Qui décide ? Échéance ? Budget prévu ou fourchette ?
6. **Prochaine étape (5 min)** : résumer en trois phrases, annoncer la proposition écrite sous 3 jours ouvrables, fixer la date du suivi.

**Après l'appel** : changer le statut dans l'administration du site (Qualifié) et dans le CRM ; préparer le devis avec `docs/juridique/modele-devis-contrat.md`.

---

## 5. Objections (comprendre avant de répondre, jamais de rabais automatique)

| Objection | Ce qu'elle peut signifier | Réponse | Prochaine action |
|---|---|---|---|
| « C'est trop cher. » | Valeur pas claire, budget réel plus bas, comparaison avec un gabarit | « Par rapport à quoi ? » puis rappeler ce qui est inclus et le prix d'un client gagné. Proposer de réduire le **périmètre** (Départ, moins de pages), pas le taux. | Si le budget est réellement < 1 595 $ : Départ plus tard, ou diagnostic seulement. |
| « J'ai déjà quelqu'un. » | Satisfait, ou relation affective (« mon neveu ») | « Très bien. Le diagnostic express peut quand même vous servir avec lui. » | Offrir le diagnostic ; relance dans 90 jours. |
| « Envoyez-moi de l'information. » | Politesse pour couper court, ou intérêt réel | « Avec plaisir. Pour vous envoyer ce qui vous concerne : votre priorité, c'est plus d'appels ou un site plus moderne ? » | Envoyer la page sectorielle correspondante + 1 constat précis. |
| « Je dois réfléchir. » | Une crainte non dite | « Bien sûr. Qu'est-ce qui vous ferait hésiter : le prix, le moment, ou le résultat ? » | Date de suivi précise. |
| « Je peux le faire moi-même avec Wix. » | Coût, autonomie | « C'est possible. La différence tient au temps que vous y passez et au parcours de demande : voulez-vous les 5 points à vérifier pour le faire vous-même ? » | Diagnostic ; rester une ressource. |
| « Pas le temps en ce moment. » | Saison chargée | « Quel serait le bon moment ? Je vous écris à cette date. » | `--resultat "Report demandé" --date-prochaine …` |

---

## 6. Modèle de diagnostic express (offert, ≈ 45 minutes)

> **Diagnostic express · [Entreprise] · [date]**
> Site analysé : [adresse] · sur un iPhone ou Android de taille moyenne et sur ordinateur.
>
> **1. [Constat le plus coûteux]** — ce que voit le client → pourquoi ça fait perdre des demandes → la correction.
> **2.** …
> **3.** …
> **4.** …
> **5.** …
>
> **Mesures** : vitesse mobile (PageSpeed Insights, date) · présence du HTTPS · formulaire testé : oui / non, résultat.
>
> **Ce que je recommande** : [corriger vous-même / optimisation ciblée 690 $ / refonte]. Si vous souhaitez aller plus loin, l'audit complet (390 $) est déduit de tout projet signé dans les 60 jours.
>
> [Signature + coordonnées]

(N'utilisez pas de tiret cadratin dans la version envoyée si vous préférez la règle du site ; ici il sépare seulement les colonnes du modèle.)

---

## 7. Suivi : administration du site et CRM

| Statut dans l'administration du site | Équivalent CRM Prospecteur 2.0 | Action |
|---|---|---|
| Nouveau | Réponse reçue (prospect entrant) | Répondre sous 2 jours ouvrables |
| Contacté | En attente de réponse | Relance J+3 |
| Qualifié | Besoin à analyser / Rendez-vous confirmé | Appel découverte |
| Proposition envoyée | Proposition envoyée | Relances J+3, J+7, J+14 centrées sur la décision |
| Gagné | Gagné | Contrat, facture d'acompte, démarrage |
| Perdu / Sans suite | Perdu / Clôturé | Noter le motif réel (apprentissage) |

Les demandes entrantes du site vivent dans l'administration (`/admin`) ; la prospection sortante vit dans `Prospecteur-CRM.xlsx`. Quand un prospect sortant remplit le formulaire, notez sa référence (LD-…) dans le CRM.

---

## 8. Objectif des 30 premiers jours (hypothèses à vérifier)

| Étape | Volume visé | Taux supposé | Résultat attendu |
|---|---|---|---|
| Prospects qualifiés et contactés (5 par jour ouvrable) | 100 | — | — |
| Réponses | — | 10 à 15 % | 10 à 15 conversations |
| Diagnostics ou appels | — | 60 % des réponses | 6 à 9 |
| Propositions écrites | — | 50 % | 3 à 5 |
| Projets signés | — | 30 % | 1 à 2 |

Ce sont des hypothèses de départ, pas des prévisions. Faites le bilan chaque vendredi (`crm.py bilan`) et ajustez le message, le segment ou l'offre selon les résultats réels (Vente 2.0 §33).
