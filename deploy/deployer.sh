#!/usr/bin/env bash
# Déploiement avec retour arrière automatique.
# Structure : /srv/ld-solutions/{releases/<horodatage>, current -> releases/…, shared/{.env,data/}}
# Usage (sur le serveur, en tant que ldsite) : ./deploy/deployer.sh <branche-ou-tag>
set -euo pipefail
REF="${1:-main}"
BASE=/srv/ld-solutions
DEPOT="${DEPOT:-https://github.com/leoneldjikeleng/ld-solutions.git}"
HORO=$(date +%Y%m%d-%H%M%S)
CIBLE="$BASE/releases/$HORO"
PRECEDENTE=$(readlink -f "$BASE/current" || true)

echo "1. Sauvegarde vérifiée de la base avant toute modification"
if [ -n "$PRECEDENTE" ]; then
  (cd "$PRECEDENTE" && set -a && . "$BASE/shared/.env" && set +a && \
   DATABASE_PATH="$BASE/shared/data/ld-solutions.sqlite" BACKUP_DIR="$BASE/shared/data/sauvegardes" node server/scripts/sauvegarde.mjs)
fi

echo "2. Récupération de $REF dans $CIBLE"
git clone --depth 1 --branch "$REF" "$DEPOT" "$CIBLE"
cd "$CIBLE"
npm ci --omit=dev --no-audit --no-fund

echo "3. Tests et construction"
set -a; . "$BASE/shared/.env"; set +a
node --test "tests/unit/*.test.mjs"
STRICT=1 node src/build.mjs
node src/verifier-prelancement.mjs

echo "4. Bascule"
ln -sfn "$CIBLE" "$BASE/current.tmp" && mv -T "$BASE/current.tmp" "$BASE/current"
sudo systemctl restart ld-solutions
sleep 2

echo "5. Vérification de santé"
if ! curl -fsS "http://127.0.0.1:${PORT:-3000}/sante" | grep -q '"base":true'; then
  echo "ÉCHEC de la vérification : retour à la version précédente"
  if [ -n "$PRECEDENTE" ]; then
    ln -sfn "$PRECEDENTE" "$BASE/current.tmp" && mv -T "$BASE/current.tmp" "$BASE/current"
    sudo systemctl restart ld-solutions
  fi
  exit 1
fi
echo "Déploiement réussi : $CIBLE"
# Conserver les 5 dernières versions
ls -1dt "$BASE"/releases/* | tail -n +6 | xargs -r rm -rf
