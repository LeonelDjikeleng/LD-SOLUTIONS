# Diagnostic en 5 étapes et refonte v3 « Le sur-mesure »

Date : 10 octobre 2026. Demande : un site plus beau, plus épuré, plus raffiné et plus luxueux, très facile à parcourir au téléphone, avec des animations. Le blanc doit dominer, avec des touches de vert.

Mesures prises sur la version 2 (« La planche », bleu de tirage) dans Chromium, écran de 390 × 844 px (iPhone 12 à 15), animations désactivées pour mesurer la page complète.

| Page | Hauteur totale | Hauteur du hero | Pied de page | Surface bleu foncé | Textes en majuscules |
|---|---|---|---|---|---|
| Accueil | 14 558 px (17 écrans) | 1 782 px | 1 192 px | 48 % | 82 |
| Tarifs | 13 119 px | 730 px | 1 192 px | 33 % | 95 |
| Création | 11 903 px | 773 px | 1 224 px | 44 % | 57 |
| Maintenance | 9 529 px | 730 px | 1 208 px | 32 % | 46 |
| Questions fréquentes | 6 924 px | 559 px | 1 208 px | 41 % | 28 |
| Contact | 4 480 px | 516 px | 1 136 px | 37 % | 22 |
| À propos | 8 685 px | 743 px | 1 208 px | 61 % | 31 |

---

## Étape 1 · Première impression : couleur et identité

**Constat.** Le bleu foncé occupe de 32 % à 61 % de la surface des pages. Chaque page s'ouvre sur un plein écran bleu et se termine sur un pied de page bleu de 1,4 écran. Le jaune vif, réservé aux boutons, est efficace mais il évoque le chantier plutôt que le haut de gamme.

**Effet.** L'impression est forte, technique et assez lourde. Elle ne dit ni « calme » ni « luxe ». Elle ne correspond pas non plus à la palette demandée (blanc dominant, vert).

**Prescription v3.**
- Blanc pur comme fond principal. Un ivoire très léger (#F7F6F2) et un vert sauge très pâle (#EFF4F0) servent seulement à séparer les sections.
- Un seul vert profond, le **vert sapin** (#0F4D3A), pour l'action, les liens et les accents. C'est un clin d'œil à la forêt québécoise, discret et noble.
- Le vert foncé plein est réservé à deux moments seulement : l'appel final et le pied de page. Le blanc dépasse ainsi 80 % de la surface.
- Une pointe de **laiton** (#A8844A), en tout petit, pour les détails précieux : numéros, filets fins, sceau « recommandé ».

## Étape 2 · Typographie : le ton de la voix

**Constat.** Trois familles de polices sont utilisées : des titres condensés en capitales (Big Shoulders), un texte courant et une police à chasse fixe (IBM Plex Mono) pour les annotations. On compte de 22 à 95 éléments en majuscules par page.

**Effet.** Les capitales condensées et la police à chasse fixe « crient » et font penser à un plan technique. Le luxe, au contraire, parle bas : peu de majuscules, beaucoup d'air, des contrastes fins.

**Prescription v3.**
- Titres en **Bodoni Moda**, un didone à fort contraste (pleins épais, déliés fins). C'est le registre des maisons de couture et des éditions de prestige. On l'utilise en casse normale et un mot clé du titre passe en *italique vert*.
- Texte courant en **Instrument Sans**, une linéale moderne et nette, très lisible sur téléphone.
- Plus de police à chasse fixe. Les petites étiquettes restent en capitales espacées, mais trois fois moins nombreuses.
- Les deux polices sont sous licence OFL et hébergées sur le site, sans appel à Google.

## Étape 3 · Densité : ce qui encombre

**Constat.** Chaque page répète un cartouche technique de 4 cases (projet, planche, échelle, lieu), en haut comme en bas. Chaque section affiche un badge « PL. 04 ». Le fond est couvert de grain et de traits de construction. Le pied de page aligne 17 liens et un deuxième cartouche. L'accueil fait 17 écrans de haut.

**Effet.** Le regard ne sait pas où se poser. Ces signes ont du caractère, mais ils ajoutent du bruit, et le bruit est l'opposé du raffinement.

**Prescription v3.**
- On retire le cartouche, le grain, les traits de construction et les badges « PL ».
- La numérotation des sections devient un simple chiffre en italique (« 01 ») suivi d'un filet.
- Les héros des pages intérieures deviennent blancs et plus courts : fil d'Ariane, titre, une phrase, une action.
- Le pied de page devient une **étiquette** (comme celle d'une veste sur mesure) : la signature, trois groupes de liens repliés sur téléphone et une ligne légale. Sa hauteur est réduite de moitié environ.
- Plus d'espace entre les blocs. Les cartes perdent leurs cadres au profit de filets fins.

## Étape 4 · Navigation au pouce

**Constat.** C'est le point fort de la v2 : le sommaire collant, le menu en tiroir, la barre d'action flottante et les carrousels fonctionnent. Mais le héros de l'accueil mesure plus de 2 écrans avant le premier contenu. Le menu ouvert est une longue liste en capitales. La barre d'action affiche deux boutons de poids comparables.

**Prescription v3.**
- Le héros de l'accueil est resserré : titre, phrase, une action principale et un lien secondaire. La démonstration au téléphone passe juste en dessous.
- Le menu devient un tiroir blanc avec de grandes entrées en Bodoni, numérotées, et deux actions en bas, à portée de pouce.
- La barre flottante passe en blanc avec une seule action principale en vert sapin. L'accès au courriel devient une petite icône.
- Les pastilles du sommaire deviennent des boutons arrondis. La pastille active se remplit de vert.
- Une fine barre de progression de lecture, en vert, s'affiche sous l'en-tête des pages intérieures.

## Étape 5 · Mouvement et finition

**Constat.** Les apparitions au défilement sont présentes mais uniformes (tout monte de 14 px). Aucun mouvement ne signe la marque.

**Prescription v3 (sobre, rapide, jamais gratuite).**
- **Titre en rideau** : à l'ouverture, les mots du grand titre montent l'un après l'autre derrière un masque, comme une étoffe qu'on découvre.
- **Point de couture** : sous les titres de section, un filet en pointillé se coud de gauche à droite.
- **Mesure vivante** conservée et restylée en ruban de couturière : elle mesure la largeur réelle de l'écran du visiteur. C'est vrai, et c'est propre au sur-mesure.
- Cartes en cascade (70 ms d'écart), FAQ qui s'ouvre en glissant, transitions de page en fondu.
- Tout est désactivé si l'appareil demande moins d'animations. Seules l'opacité et la position sont animées, pour garder la performance.

---

> **Révision du 10 octobre 2026 (demande du client : « une police premium et simple »).** Le didone Bodoni Moda est remplacé par **Geist**, une linéale suisse sobre, utilisée seule pour les titres et le texte. L'accent passe par la couleur (vert) au lieu de l'italique. Effet mesuré : poids d'une page divisé par 2,6 (environ 160 Ko → 60 Ko), affichage du titre principal en 1,3 à 1,4 s au lieu de 1,8 à 2,0 s.

## Concept de la v3 : « Le sur-mesure »

Un site web conçu comme un vêtement sur mesure : on prend les mesures, on coupe, on ajuste, puis on entretient. Les trois piliers deviennent **Créer** (la coupe), **Améliorer** (les retouches) et **Entretenir** (le soin). Le vocabulaire visuel s'en inspire avec retenue : filets cousus, étiquette, ruban de mesure, monogramme LD.

Ce qui ne change pas : les prix, les textes vérifiés, l'honnêteté (aucun faux avis, aucun chiffre inventé), les formulaires, l'accessibilité et la performance.

## Mesures v3 (même protocole, 10 octobre 2026)

| Page | Hauteur du hero | Pied de page | Surface vert foncé | Textes en majuscules | Lighthouse mobile (perf./access./bonnes pratiques/SEO) |
|---|---|---|---|---|---|
| Accueil | 1 750 px (démonstration comprise) | 957 px | 15 % | 56 (au lieu de 82) | 99 / 100 / 100 / 100 |
| Tarifs | 605 px (au lieu de 730) | 957 px | 17 % | 68 (au lieu de 95) | 99 / 100 / 100 / 100 |
| Création | 605 px (au lieu de 773) | 957 px | 19 % | 37 (au lieu de 57) | 99 / 100 / 100 / 100 |
| Questions fréquentes | 427 px (au lieu de 559) | 957 px | 30 % | 11 (au lieu de 28) | 99 / 100 / 100 / 100 |
| Contact | 386 px (au lieu de 516) | 885 px | 22 % | 2 (au lieu de 22) | 99 / 100 / 100 / 100 |

Lecture honnête des résultats :
- La surface sombre est divisée par deux ou trois : le blanc domine désormais toutes les pages.
- Le pied de page est réduit d'environ 20 % (1 192 → 957 px), pas de moitié comme visé à l'étape 3. Les 17 liens restent accessibles au pouce (40 px de hauteur minimum chacun). Les replier dans des menus déroulants permettrait de gagner davantage, au prix d'un geste de plus.
- Le héros de l'accueil garde presque la même hauteur (1 750 px au lieu de 1 782) parce qu'il contient toujours la démonstration au téléphone. Seule la partie texte est resserrée : une action principale au lieu de deux boutons de même poids.
- Les pages gardent à peu près la même hauteur totale : l'espace gagné sur les héros a été rendu à la respiration entre les blocs. C'est voulu (épuré ne veut pas dire tassé).
- Deux familles de polices au lieu de trois. Le poids total d'une page passe d'environ 141 Ko à 158–162 Ko, à cause des polices didones. La performance reste à 99 et l'affichage du titre principal se fait en 1,8 à 2,0 s (4G simulée).
- Accessibilité : le laiton pâle ne respectait pas le contraste minimal en petit texte. Un laiton plus foncé (#82632F) est utilisé pour tout texte, le laiton clair étant réservé aux filets et aux fonds sombres. Aucune violation axe-core.
