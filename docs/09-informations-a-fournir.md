# Informations à fournir avant la mise en ligne

Classées par impact. Les cinq premières bloquent la mise en production ; `npm run check:prelaunch` les vérifie automatiquement.

| # | Information | Pourquoi | Où la mettre |
|---|---|---|---|
| 1 | **Confirmation du marché : Québec, en dollars canadiens** (hypothèse retenue) | Elle conditionne les prix, les lois et les textes légaux. Si votre marché principal est ailleurs (ex. Afrique francophone, France), la grille et les textes doivent être refaits. | Réponse à donner |
| 2 | **Nom légal et forme de l'entreprise** (et NEQ s'il existe) | Mentions légales, conditions de service, contrats | `src/content/site.config.mjs` › `nomLegal`, `neq` |
| 3 | **Nom de domaine choisi** | Adresse canonique, plan du site, HTTPS | `SITE_URL` |
| 4 | **Hébergeur retenu et lieu des serveurs** | Politique de confidentialité (Loi 25) | `site.config.mjs` › `hebergeur` |
| 5 | **Validation de la grille tarifaire et de l'offre de lancement** (−10 % jusqu'au 31 mars 2027) | Engagements commerciaux affichés publiquement | `src/content/offres.mjs` (mettre `aValider: false`, ou `actif: false` pour retirer l'offre) |
| 6 | Statut TPS/TVQ | Mention exacte des taxes sur les devis et factures | `site.config.mjs` › `inscriptionTaxes` |
| 7 | District judiciaire et adresse d'affaires (une case postale suffit) | Conditions de service, identification du commerçant | `site.config.mjs` |
| 8 | Téléphone, WhatsApp, lien de prise de rendez-vous (facultatifs) | Active automatiquement les boutons correspondants | `site.config.mjs` |
| 9 | Accès SMTP (mot de passe d'application Gmail) | Notifications des nouvelles demandes | Fichier `.env` du serveur uniquement, jamais dans une conversation |
| 10 | Vos vrais projets, dès qu'ils existent (avec l'accord des clients) | Remplacer progressivement les démonstrations fictives par de vraies réalisations et de vrais témoignages | Page Démonstrations |

**Ce que j'ai supposé, à confirmer** : vous travaillez seul ou avec un très petit nombre de personnes (« un seul interlocuteur ») ; le service est offert à distance dans tout le Québec ; vous pouvez répondre aux demandes sous 2 jours ouvrables ; vous maîtrisez les prestations listées comme « disponibles » (les automatisations et intégrations tierces sont présentées « après étude » par prudence).
