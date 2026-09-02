#!/usr/bin/env bash
# Prima installazione del sito come processo Node sulla VPS Plesk.
# Si lancia UNA VOLTA; per gli aggiornamenti successivi c'e' deploy-vps.sh.
#
#   ssh seedera-plesk 'bash -s' < scripts/installa-vps-sito.sh
#
# Cosa NON fa, perche' vuole root e su questa VPS root passa dalle attivita'
# pianificate di Plesk: il servizio systemd e il reverse proxy nginx. Li stampa
# alla fine, pronti da incollare.
set -euo pipefail

APP=/var/www/vhosts/seedera.it/sito
PORTA=3020            # la 3000 e la 3001 sono gia' occupate da altri domini
NODE_BIN=/opt/plesk/node/22/bin
export PATH="$NODE_BIN:$PATH"

echo "==> codice in $APP"
if [ -d "$APP/.git" ]; then
  cd "$APP" && GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519_sito -o IdentitiesOnly=yes" \
    git fetch origin && git checkout main && \
    GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519_sito -o IdentitiesOnly=yes" git pull --ff-only
else
  GIT_SSH_COMMAND="ssh -i $HOME/.ssh/id_ed25519_sito -o IdentitiesOnly=yes" \
    git clone git@github.com:SeederaDev/Seedera.git "$APP"
  cd "$APP"
fi

echo "==> .env"
# Il segreto della rigenerazione deve essere lo STESSO che ha l'API in
# SITO_SEGRETO_RIGENERA: e' l'unica cosa che autorizza il pannello a invalidare
# la cache del sito. Si legge da li', invece di generarne un secondo che non
# combacia con niente.
SEGRETO=$(grep -m1 '^SITO_SEGRETO_RIGENERA=' /var/www/vhosts/seedera.it/api.seedera.it/app/.env | cut -d= -f2-)
if [ -z "$SEGRETO" ]; then
  echo "   ERRORE: SITO_SEGRETO_RIGENERA non e' impostato nel .env dell'API." >&2
  exit 1
fi
cat > "$APP/.env" <<EOF
# Il sito parla con l'API sulla loopback: non esce e non rientra dal proxy.
API_BASE=http://127.0.0.1:3010
# Questi due li legge il **browser**, quindi sono indirizzi pubblici, e li
# fissa la build: cambiarli dopo non ha effetto finche' non si ricostruisce.
NEXT_PUBLIC_FORM_ENDPOINT=https://api.seedera.it/api/lead
NEXT_PUBLIC_VOUCHER_ENDPOINT=https://api.seedera.it/api/voucher/onboarding
SEGRETO_RIGENERA=$SEGRETO
PORT=$PORTA
HOSTNAME=127.0.0.1
NODE_ENV=production
EOF
chmod 600 "$APP/.env"
echo "   scritto (segreto preso dall'API)"

echo "==> dipendenze"
npm ci

echo "==> contenuti: persone e progetti"
# Gli script di migrazione leggono i due file sorgente che la migrazione stessa
# ha reso inutili, e che quindi non esistono piu' nel repo. Stanno nella storia:
# si tirano fuori da li' in una cartella temporanea, si migra, si buttano.
# Rilanciarli e' innocuo: aggiornano invece di duplicare.
API_APP=/var/www/vhosts/seedera.it/api.seedera.it/app
COMMIT_PRIMA="$(git log --diff-filter=D --format=%H -1 -- src/app/persone/team.ts)^"
TMP=$(mktemp -d)
mkdir -p "$TMP/src/app/persone" "$TMP/src/app/portfolio/[slug]"
# Il ':' sta FUORI dagli apici della variabile: in zsh `"$VAR:src/..."` viene
# letto come il modificatore `:s` (substitute) e git riceve il solo commit,
# scrivendo un diff al posto del file. Qui gira bash, ma la forma resta questa
# perche' la si copia e incolla in una shell qualsiasi.
git show "$COMMIT_PRIMA":"src/app/persone/team.ts" > "$TMP/src/app/persone/team.ts"
git show "$COMMIT_PRIMA":"src/app/portfolio/[slug]/projectsData.ts" > "$TMP/src/app/portfolio/[slug]/projectsData.ts"
( cd "$API_APP" && DATI_DIR=/var/www/vhosts/seedera.it/api-dati \
  node scripts/migra-persone.js --da "$TMP" && DATI_DIR=/var/www/vhosts/seedera.it/api-dati \
  node scripts/migra-progetti.js --da "$TMP" )
rm -rf "$TMP"

# Le variabili del sito le legge Next da solo, ma `prebuild` e' un processo a
# parte: senza questo caricamento cerca l'API sull'indirizzo di sviluppo e
# ferma la build con "API non raggiungibile", a backend perfettamente acceso.
set -a; . "$APP/.env"; set +a

echo "==> build"
# Quale commit e' online, senza aprire il pannello: curl -s https://seedera.it/version.txt
git rev-parse HEAD > public/version.txt
npm run build

echo
echo "==> resta da fare come root (attivita' pianificate di Plesk)"
cat <<EOF

--- /etc/systemd/system/seedera-sito.service ---
[Unit]
Description=Seedera — il sito (Next servito da Node)
After=network.target seedera-api.service

[Service]
Type=simple
User=seedera.it_3hxonlg1d9j
Group=psacln
WorkingDirectory=$APP
EnvironmentFile=$APP/.env
ExecStart=$NODE_BIN/node node_modules/.bin/next start -p $PORTA -H 127.0.0.1
Restart=always
RestartSec=5
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
---

  systemctl daemon-reload && systemctl enable --now seedera-sito

--- /var/www/vhosts/system/seedera.it/conf/vhost_nginx.conf ---
# 'location ~ /' e non 'location /': Plesk ne genera gia' una col prefisso, e
# due uguali fanno fallire in silenzio la rigenerazione della configurazione.
location ~ / {
    proxy_pass http://127.0.0.1:$PORTA;
    proxy_http_version 1.1;
    proxy_set_header Host \$host;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 60s;
}
---

  /usr/local/psa/admin/sbin/httpdmng --reconfigure-domain seedera.it

EOF
