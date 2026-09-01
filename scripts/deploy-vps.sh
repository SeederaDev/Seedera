#!/usr/bin/env bash
# Aggiorna il sito in produzione sul VPS Plesk. Stesso schema dell'API
# (repo seedera-backend): un processo Node dietro il proxy, non piu' file
# statici tirati da un ramo git.
#
#   ssh seedera-plesk 'bash /var/www/vhosts/seedera.it/sito/scripts/deploy-vps.sh'
#
# I sorgenti stanno **fuori** dalla docroot (`httpdocs`): dentro, il giorno che
# il proxy smette di girare, nginx tornerebbe a servire i file per quello che
# sono — codice, `.env`, `.git` — a chiunque li chieda.
set -euo pipefail

APP=/var/www/vhosts/seedera.it/sito
NODE_BIN=/opt/plesk/node/22/bin
export PATH="$NODE_BIN:$PATH"

cd "$APP"

echo "==> aggiorno il codice"
GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519_deploy -o IdentitiesOnly=yes" git pull --ff-only

echo "==> dipendenze"
npm ci

# `prebuild` controlla che l'API risponda e ferma tutto se non lo fa: un sito
# costruito senza contenuti e' peggio del vecchio che funziona. Il sito in
# esecuzione non viene toccato finche' la build nuova non e' pronta.
# Le variabili del sito le legge Next da solo, ma `prebuild` e' un processo a
# parte: senza questo caricamento cerca l'API sull'indirizzo di sviluppo e
# ferma la build con "API non raggiungibile", a backend perfettamente acceso.
set -a; . "$APP/.env"; set +a

echo "==> build"
npm run build

echo "==> riavvio"
# Il servizio ha Restart=always e gira con lo stesso utente dell'SSH: terminarlo
# lo fa ripartire da solo col codice nuovo. E' la via di scorta finche' la chiave
# API del Plesk non si rigenera (vedi doc-vps-plesk-collegare-siti nel brain).
pkill -f "next start" || true
sleep 2
pgrep -f "next start" >/dev/null && echo "   sito ripartito" || {
  echo "   il servizio non e' ripartito da solo: systemctl --user restart seedera-sito"
  exit 1
}
