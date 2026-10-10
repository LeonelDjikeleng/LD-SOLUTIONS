# Coûts récurrents et intégrations

## 1. Coûts récurrents estimés (avant taxes)

Estimations à confirmer chez chaque fournisseur ; aucune n'a été souscrite.

| Poste | Estimation | Obligatoire ? | Commentaire |
|---|---|---|---|
| Nom de domaine (.ca ou .com) | 15 à 40 $ par an | Oui | À votre nom |
| VPS au Québec (1-2 vCPU, 2-4 Go) | 6 à 15 $ par mois | Oui | Recommandé : OVHcloud Beauharnois (prix à vérifier) |
| Sauvegarde automatique du VPS (option de l'hébergeur) | 0 à 5 $ par mois | Recommandé | En plus de la copie chiffrée |
| Copie hors serveur (Google Drive) | 0 $ (15 Go gratuits) | Recommandé | Quelques Mo suffisent |
| Courriel (Gmail) | 0 $ | — | Google Workspace (≈ 8 à 10 $ par mois) seulement si vous voulez une adresse @votre-domaine |
| Certificat HTTPS (Let's Encrypt via Caddy) | 0 $ | Oui | Renouvellement automatique |
| Surveillance de disponibilité (UptimeRobot ou équivalent, offre gratuite) | 0 $ | Recommandé | Alerte par courriel si le site tombe |
| Google Search Console | 0 $ | Recommandé | |
| Lien de paiement (Stripe ou Square) | 0 $ fixe, ≈ 2,9 % + 0,30 $ par paiement | Facultatif | Commission estimée, à vérifier |
| Outil de rendez-vous (Cal.com, Calendly) | 0 à 15 $ par mois | Facultatif | |
| **Total minimal** | **≈ 8 à 20 $ par mois** + domaine | | |

## 2. Intégrations

| Intégration | État | Ce qui manque |
|---|---|---|
| Formulaires → base SQLite | ✅ **Active et testée** | — |
| Administration des demandes (`/admin`) | ✅ Active et testée | `ADMIN_PASSWORD_HASH` en production |
| Notification par courriel (SMTP) | ✅ Code actif, testé avec un serveur SMTP local | Mot de passe d'application Gmail dans `.env` ; test de réception réel |
| Accusé de réception au prospect | ✅ Code actif, testé localement | Idem ; `SEND_ACKNOWLEDGEMENT=1` |
| Mesure anonyme des visites et des clics | ✅ Active et testée | — |
| Sauvegarde vérifiée | ✅ Script actif et testé | Installation du timer sur le serveur |
| Copie hors serveur chiffrée | ⬜ Préparée (`deploy/ld-solutions-sauvegarde.service`) | `rclone config` |
| Google Search Console | ⬜ À configurer | Domaine en ligne, validation par enregistrement DNS |
| Google Business Profile de LD SOLUTIONS | ⬜ À évaluer | Admissibilité à vérifier : Google réserve ces fiches aux entreprises qui rencontrent leurs clients en personne ; une adresse vérifiable est exigée (elle peut être masquée) |
| Bouton téléphone, WhatsApp, prise de rendez-vous | ⬜ Prêts dans le code, désactivés | Renseigner `telephone`, `whatsapp`, `lienRendezVous` dans `site.config.mjs` |
| Paiement en ligne | ❌ Volontairement absent | Décision : devis + facture d'acompte (voir `01-strategie.md` §8) |
| Analytique tierce (Google Analytics, pixels) | ❌ Volontairement absente | Si ajoutée : gestionnaire de consentement obligatoire (Loi 25) |
| Vidéo ou images générées (Higgsfield) | ❌ Non utilisée | Génération payante : sur votre validation seulement |
