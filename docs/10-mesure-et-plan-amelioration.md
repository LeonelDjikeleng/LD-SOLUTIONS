# Mesure des conversions et plan d'amélioration

## 1. Plan de mesure (déjà en place, sans témoin)

| Événement | Où | Mesure | Source |
|---|---|---|---|
| `page_vue` | Toutes les pages | Visites par page et par jour | Navigateur (anonyme) |
| `clic_offre` | Boutons « Choisir … » | Intérêt pour une formule | Navigateur |
| `clic_devis`, `clic_audit` | CTA principaux | Intention d'agir | Navigateur |
| `estimateur_utilise` | Page Tarifs | Engagement avec les prix | Navigateur |
| `debut_formulaire` | Premier champ rempli | Début de conversion | Navigateur |
| `demande_creation`, `demande_audit`, `demande_maintenance`, `demande_discussion` | Serveur, à l'enregistrement | **Demandes réellement reçues** | Serveur (fiable) |
| `clic_courriel`, `copie_courriel` | Liens courriel | Contacts hors formulaire | Navigateur |
| Statuts Qualifié → Proposition → **Gagné** | Administration | **Ventes réellement conclues** | Vous |

Distinctions respectées : un clic n'est pas une demande ; une demande n'est pas une demande qualifiée ; seul « Gagné » est une vente. Tableau de bord : `/admin/mesures` (30 jours).

**Indicateurs à suivre chaque mois** (5 suffisent) :
1. Demandes reçues / visites des pages Tarifs et Contact
2. Taux de demandes qualifiées (Qualifié ou plus / demandes)
3. Taux de conclusion (Gagné / Propositions envoyées)
4. Panier moyen des projets gagnés
5. Nombre de clients en maintenance (revenu récurrent)

Aucune hausse de conversion n'est annoncée : ces indicateurs serviront de point de départ dès les premières semaines.

## 2. Plan d'amélioration

### 0 à 30 jours
- Compléter les informations (`09-informations-a-fournir.md`), déployer, vérifier en ligne (`05-deploiement.md` §5).
- Faire valider les textes légaux ; souscrire une assurance responsabilité professionnelle.
- Soumettre le plan du site à Google Search Console.
- Lancer la prospection selon les objectifs du registre Growth (fixés le 11 octobre 2026) : 20 premiers contacts en octobre, puis 40 contacts, 4 rendez-vous et 1 vente en novembre (`commercial/kit-prospection.md`), diagnostics express offerts. L'ancien rythme de 5 contacts par jour ouvrable (≈ 100 par mois) est remplacé par ces objectifs ; il sera revu avec les résultats réels d'octobre.
- Bilan hebdomadaire : demandes, réponses, objections.

### 1 à 3 mois
- Premiers projets réels : remplacer une démonstration par une vraie réalisation (avec accord), ajouter les premiers témoignages réels et leur source.
- Test A/B simple sur le titre de l'accueil (variante « résultat » contre variante « problème »), en comparant les demandes reçues sur des périodes égales.
- Rédiger 3 articles utiles par segment (ex. « Afficher sa licence RBQ sur son site », « 5 vérifications avant de refaire son site ») pour le référencement.
- Ajuster la grille si les critères de `02-tarification.md` §9 se vérifient.

### 3 à 6 mois
- Version anglaise si la demande le justifie (en gardant le français au moins aussi complet).
- Fiche Google Business Profile si l'entreprise y est admissible (rencontres en personne, adresse vérifiable) ; demander des avis réels aux clients satisfaits.
- Paiement en ligne pour l'audit complet (lien de paiement), si les demandes d'audit sont régulières.
- Page sectorielle supplémentaire seulement pour un segment qui a déjà produit des clients.
- Revue de sécurité et de dépendances ; test de restauration trimestriel.

### Options créatives (sur votre validation)
- Film d'ambiance pour le hero généré avec Higgsfield (coût en crédits à valider) : intéressant seulement s'il reste léger et n'altère pas la vitesse mesurée.
- Séance photo réelle (vous au travail, votre poste) pour la page À propos : c'est ce qui fera passer le site de beau à crédible.
