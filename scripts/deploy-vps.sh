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
PORTA=3020
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
# Quale commit e' online: curl -s https://seedera.it/version.txt
git rev-parse HEAD > public/version.txt
npm run build

echo "==> riavvio"
# Il servizio (seedera-sito) ha Restart=always e gira con lo stesso utente
# dell'SSH: terminarlo lo fa ripartire da solo col codice nuovo. Riavviarlo per
# davvero vorrebbe root, che qui non c'e'.
#
# Si cerca "next-server" e non "next start": dopo l'avvio il processo si
# rinomina, e il pattern sbagliato non trova niente, lo script dichiara il
# riavvio riuscito e resta online il codice vecchio. `-u` limita ai propri
# processi: sulla VPS ci sono altri Next di altri domini.
PID=$(pgrep -u "$(id -u)" -f "next-server" | head -1)
[ -n "$PID" ] && kill "$PID"
for _ in $(seq 1 12); do
  sleep 2
  if curl -fsS -o /dev/null "http://127.0.0.1:$PORTA/"; then echo "   sito ripartito"; exit 0; fi
done
echo "   il sito non risponde sulla $PORTA dopo il riavvio: systemctl status seedera-sito"
exit 1
