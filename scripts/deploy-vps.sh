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
# Chiave dedicata al sito: GitHub non accetta la stessa deploy key su due
# repository, e quella di `id_ed25519_deploy` e' del backend. Via SSH e non
# HTTPS perche' GitHub, dopo un po' di richieste anonime dallo stesso IP,
# smette di rispondere e git chiede un utente che nessuno digitera' mai.
GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519_sito -o IdentitiesOnly=yes" git pull --ff-only

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
# Il processo si cerca per la **porta**, non per nome. Col nome si sbagliava
# due volte: dopo l'avvio `next start` si rinomina `next-server`, e lo stesso
# utente fa girare anche i Next di altri domini (Riardo, Quinte), tutti
# `next-server`. Il 29/09/2026 `pgrep ... | head -1` ha terminato uno di quelli,
# il sito e' rimasto sulla build vecchia con i file JavaScript della nuova, e
# ogni pagina dava "Application error".
pid_sulla_porta() {
  ss -ltnpH "sport = :$PORTA" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2
}
PID=$(pid_sulla_porta)
if [ -z "$PID" ]; then
  echo "   nessun processo sulla $PORTA: il servizio e' gia' fermo?"
else
  kill "$PID"
fi
# Ripartito vuol dire: sulla porta c'e' un processo **diverso** e risponde.
# Controllare solo che risponda non basta, il vecchio risponde finche' muore.
for _ in $(seq 1 15); do
  sleep 2
  NUOVO=$(pid_sulla_porta)
  if [ -n "$NUOVO" ] && [ "$NUOVO" != "$PID" ] && curl -fsS -o /dev/null "http://127.0.0.1:$PORTA/"; then
    echo "   sito ripartito (pid $PID -> $NUOVO)"; exit 0
  fi
done
echo "   il sito non risponde sulla $PORTA dopo il riavvio: systemctl status seedera-sito"
exit 1
