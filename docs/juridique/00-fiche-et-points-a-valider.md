# Cadre contractuel LD SOLUTIONS · fiche Maître 2.0 et points à faire valider

> **Avertissement** : ces documents sont des bases de travail préparées avec rigueur. Ils ne constituent pas un avis juridique personnalisé. Avant la première signature, faites-les relire par un avocat ou un notaire du Québec, en priorité les points 🔴 ci-dessous. Les références aux articles du Code civil du Québec (C.c.Q.) sont des repères à vérifier dans la version en vigueur (LégisQuébec, CanLII).

## 1. Fiche du dossier

| Élément | Contenu |
|---|---|
| Partie A | LD SOLUTIONS, prestataire de services numériques. Forme juridique, NEQ et adresse : **à compléter** (`site.config.mjs`). |
| Partie B | Surtout des entreprises (PME, travailleurs autonomes). Parfois un consommateur au sens de la LPC : règles impératives supplémentaires. |
| Objet | Création, amélioration, audit et maintenance de sites web, options associées. |
| Contrepartie | Prix fixes par formule (`offres.mjs`), paiement par étapes ; abonnements mensuels pour la maintenance. |
| Durée | Projets : quelques semaines. Maintenance : mois par mois. |
| Territoire / droit | Québec. Droit québécois et lois fédérales applicables. |
| Risques principaux | Impayé ; demandes hors périmètre sans fin ; client qui ne fournit pas le contenu ; responsabilité en cas de panne ou de piratage ; propriété du code ; données personnelles traitées pour le client. |
| Objectif | Être payé pour le travail fait, borner le périmètre, limiter la responsabilité de façon défendable, rester transparent (positionnement du site). |
| Niveau de protection | 🟠 **PROTECTEUR** (par défaut quand LD SOLUTIONS fournit le service). |

## 2. Architecture documentaire (ordre de priorité)

1. Devis-contrat signé (`modele-devis-contrat.md`) et ses clauses particulières
2. Avenants signés (`avenant-modification.md`)
3. Entente de maintenance, s'il y a lieu (`entente-maintenance.md`)
4. Conditions de service publiées sur le site (`/conditions-de-service/`)
5. Informations générales du site

Le procès-verbal de livraison (`proces-verbal-livraison.md`) documente l'acceptation.

## 3. Matrice des clauses

| Clause | Classement | Commentaire |
|---|---|---|
| Résiliation par le client à tout moment, en payant le travail fait, les frais engagés et la valeur de ce qui est fourni | 🟢 Obligation légale (C.c.Q. art. 2125 et 2129) | Une « durée minimale » ne l'empêcherait pas ; d'où la facturation par étapes. |
| Résiliation par le prestataire seulement pour motif sérieux, sans préjudice au client | 🟢 Obligation légale (art. 2126) | |
| Acompte qui « réserve la période de production » | 🔵 Protection recommandée | Retenu à hauteur du travail fait et des frais engagés en cas de résiliation, ce qui est plus défendable qu'un acompte « non remboursable » absolu. |
| Intérêts sur retard : 1 % par mois (12 % par année) | 🔵 Recommandée | Le taux annuel doit être exprimé (Loi sur l'intérêt, fédérale). |
| Suspension des travaux après avis de retard de 10 jours | 🔵 Recommandée | |
| Cession des droits d'auteur au paiement complet ; licence sur les outils préexistants | 🔵 Recommandée | Transfert conditionné au paiement : vérifier la rédaction avec l'avocat. |
| Acceptation tacite après 10 jours ouvrables | 🟠 Option de négociation | Raisonnable en B2B ; à adapter pour un consommateur. |
| Limitation de responsabilité aux sommes payées sur 12 mois, exclusion des pertes indirectes | 🔴 À valider | Ne peut couvrir la faute intentionnelle ou lourde ni le préjudice corporel ou moral (art. 1474). Peut être écartée envers un consommateur (LPC) et réduite si jugée abusive dans un contrat d'adhésion (art. 1437). |
| Clauses externes (conditions publiées sur le site) | 🔴 À valider | Dans un contrat d'adhésion ou de consommation, une clause externe doit avoir été expressément portée à la connaissance du client (art. 1435). D'où la case « J'ai lu les conditions » dans le devis et un exemplaire joint. |
| Remboursement de la maintenance annuelle au prorata, moins l'avantage annuel | 🟠 À valider | Vérifier qu'elle n'est pas jugée abusive ; pour un consommateur, appliquer les règles de la LPC sur les contrats à exécution successive. |
| Clause de juridiction (district de LD SOLUTIONS) | 🟠 Option | Inopposable au consommateur, qui garde le droit d'agir chez lui. |
| Langue : documents en français | 🟢 Obligation (Charte de la langue française) | Contrats d'adhésion présentés d'abord en français. |

## 4. Points à faire valider par un avocat (priorité)

1. 🔴 Limitation de responsabilité et exclusions, version B2B et version consommateur.
2. 🔴 Opposabilité des conditions publiées (art. 1435) et procédure de signature électronique.
3. 🔴 Contrats avec des consommateurs (LPC) : faut-il un modèle distinct (contrat conclu à distance, mentions obligatoires, annulation) ? Recommandation : oui si vous servez des particuliers.
4. 🟠 Rédaction de la cession de droits conditionnée au paiement.
5. 🟠 Rôle de LD SOLUTIONS envers les renseignements personnels des clients (prestataire agissant pour le compte du client, Loi 25) : clause de traitement et sous-traitants.
6. 🟠 Taxes : statut TPS/TVQ et mentions sur les factures (avec votre comptable).
7. 🟢 Choix de la structure juridique (entreprise individuelle ou société) et assurance responsabilité professionnelle : fortement recommandée avant les premiers contrats.

## 5. Auto-audit (« comment l'avocat du client attaquerait-il ce contrat ? »)

- *« Le prestataire garde l'acompte sans avoir rien fait. »* → La clause retient seulement le travail fait et les frais engagés ; tenez un journal des heures dès le premier jour.
- *« Les révisions étaient illimitées, le devis ne disait rien. »* → Le devis précise toujours le nombre de rondes et la définition d'une ronde.
- *« Le site ne m'a apporté aucun client. »* → Obligation de moyens écrite ; aucun résultat promis sur le site ni dans le devis.
- *« Mon site a été piraté pendant la maintenance. »* → Obligations décrites (mises à jour, sauvegardes), causes externes exclues, limitation ; gardez les rapports de maintenance comme preuve d'exécution.
- *« Je ne savais pas que les conditions s'appliquaient. »* → Case cochée et exemplaire PDF joint au devis.
