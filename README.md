This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Note di questo progetto

### I bandi voucher arrivano a build-time

Il sito e' un **export statico** (`output: 'export'`): niente API route, niente
dati letti a runtime. Il censimento dei bandi camerali sta in
`src/dati/bandi.json` ed e' committato; si aggiorna con:

```bash
npm run bandi            # legge http://localhost:3001/api/bandi/pubblici
BANDI_API=https://api.seedera.it/api/bandi/pubblici npm run bandi
```

L'API restituisce **solo i bandi pubblicabili**, cioe' quelli di cui il pannello
conosce percentuale, tetto, spesa minima e voci ammissibili. Un bando senza quei
dati non ha pagina: meglio nessuna pagina che una con dei numeri inventati.
Dopo aver corretto un bando nel pannello va rilanciato lo script e ripubblicato
il sito, altrimenti la pagina resta indietro.

### `postcss` e' fissato a 8.5.6, di proposito

`postcss` non e' una nostra dipendenza diretta: arriva sollevato dall'albero di
Tailwind. Dalla 8.5.26 pero' la build fallisce con
`Invalid dangling combinator in selector` su `src/components/Cursor.css:4`
(`@media (pointer: fine) { * { … } }`), che e' CSS valido. Il pin nelle
`devDependencies` blocca la versione che funziona; **qualunque `npm install`
puo' risollevarla**, quindi se la build si rompe con quell'errore la prima cosa
da guardare e' `node_modules/postcss/package.json`.

### iCloud duplica i file, e la build muore

Il Desktop sta in iCloud Drive, che ogni tanto duplica file e cartelle
aggiungendo " 2" al nome. Dentro `node_modules` questo produce errori senza
senso — `Cannot find type definition file for 'chai 2'` — e dentro `.next`
manda in 500 pagine che funzionavano.

La cura:

```bash
find . -name "* 2" -o -name "* 2.*"        # per vedere il danno
rm -rf node_modules && npm ci              # per rifarlo pulito
xattr -w com.apple.fileprovider.ignore#P 1 node_modules   # perche' non si ripeta
```

L'ultimo comando dice a iCloud di lasciare stare quella cartella, ed e' gia'
stato dato su questa macchina: va ridato dopo ogni `rm -rf node_modules`.

### Test

`npm test` (vitest) copre la logica pura in `src/lib` e i componenti del
percorso voucher. Non copre il rendering delle pagine: quello si verifica con
`npm run build` e a browser aperto.
