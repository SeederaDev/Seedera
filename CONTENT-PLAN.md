# Piano contenuti — allineamento al sito in produzione

> **STATO: tutte le fasi eseguite il 2026-08-05.** Build di produzione verde
> (11 pagine statiche), `tsc --noEmit` pulito, lint 0 errori, zero `Lorem ipsum`
> residui. Quello che resta aperto è elencato in fondo, sotto "Da validare".

Fonte: testi di `seedera.it` (single-page in produzione, estratti il 2026-08-05).
Obiettivo: portare il posizionamento e i testi di produzione nella struttura di
questa repo, creando solo ciò che manca.

**Decisioni prese:**
- Services resta a 4 categorie: i 3 sistemi di produzione + Brand & Comunicazione
  (giustificata dal portfolio esistente, riusa i 7 sottoservizi già scritti).
- `/richiedi-preventivo` → `/parliamo`: stessa UI, senza step fascia di budget,
  con i chip "oggetto" del composer di produzione.

---

## Posizionamento

| | Repo attuale | Da adottare |
|---|---|---|
| Definizione | Digital company / agenzia creativa | Product & Service Company — Execution Partner Cognitivo |
| Promessa | (assente) | Rendiamo le imprese capaci di fare cose che prima non sapevano fare |
| Sede | (assente) | Roma, Italia |
| Email | `hello@seedera.it` | `info@seedera.it` |
| Social | Instagram, LinkedIn, Behance, Dribbble | solo LinkedIn |

---

## FASE 1 — Travasi diretti (basso rischio)

### 1.1 Marquee — `src/components/sections/Marquee.tsx`
Sostituire `MARQUEE_TEXTS` (separatore `✦` al posto di `•`):

Prima il problema · Sistemi, non deliverable · Software su misura · Agenti AI ·
Second Brain · Startup Studio · Shared Risk · Digital Products ·
Execution Partner · Web & App

### 1.2 Footer — `src/components/Footer.tsx`
- Email → `info@seedera.it`
- `SOCIALS` → solo LinkedIn
- `FOOTER_LINKS` → Metodo, Capacità, Portfolio, Studio, Partnership
- Aggiungere claim: "Product & Service Company. Execution Partner Cognitivo. Roma, Italia."
- Aggiungere etimologia: *dal latino sidera, stelle e dall'inglese seed, seme — ogni
  impresa che guarda in alto inizia da un seme*

### 1.3 Navbar — `src/components/Navbar.tsx`
`NAV_ITEMS` → Metodo · Capacità · Portfolio · Studio · Partnership · Parliamo →

### 1.4 Hero — `src/components/sections/Hero.tsx`
- Eyebrow: Product & Service Company — Execution Partner Cognitivo
- Headline (3 righe `HeroLine`, ~25 char l'una): RENDIAMO LE IMPRESE / CAPACI DI FARE COSE / CHE PRIMA NON SAPEVANO FARE
- Sub: Non eseguiamo brief. Prima identifichiamo il problema vero, poi costruiamo il
  sistema che lo risolve. Con il coraggio di dirti quando stai chiedendo la cosa
  sbagliata, e di entrare nel rischio quando il progetto lo merita.
- CTA: Apri una conversazione →

---

## FASE 2 — Adattamenti

### 2.1 AboutUs — 3 slide
Slide 1 → *Non costruiamo la soluzione che ci chiedono. Costruiamo la soluzione che serve.*
Slide 2 → La maggior parte dei partner inizia dal cosa. Noi iniziamo dal perché. Prima di
accettare un progetto, diagnostichiamo il bisogno reale, che raramente coincide con la
richiesta iniziale.
Slide 3 → Non consegniamo file. Costruiamo capacità che restano nell'organizzazione dopo
che usciamo. Non consigliamo dall'esterno: operiamo dall'interno, condividendo gli obiettivi.

> I 4 principi numerati (La domanda prima della risposta / Sistemi, non deliverable /
> Operatori, non consulenti / Franchezza operativa) confluiscono nella nuova sezione
> "Il sistema operativo" (3.2) per non comprimerli in 3 slide.

### 2.2 Services — 4 categorie
Ridurre l'array sottoservizi da 7 a 5 per le prime tre. Nessun testo inventato.

**01 — PRODOTTO & TECH** · *Costruiamo prodotti che trovano mercato*
Dall'architettura alla produzione. Progettiamo software, app e piattaforme con la stessa
attenzione alla logica tecnica e al modello di business. Un prodotto che funziona ma non
trova mercato è solo codice.
→ Software su misura e piattaforme · App mobile e web · Agenti AI e automazioni ·
Integrazioni, API, architetture dati · MVP e product sprint

**02 — SECOND BRAIN** · *La conoscenza dell'impresa, viva e interrogabile*
Le informazioni più preziose di un'impresa vivono sparse tra teste, chat e file. Costruiamo
il cervello operativo che le cattura, le struttura e le rende interrogabili — in linguaggio
naturale, anche dall'AI.
→ Knowledge base e memoria aziendale · Assistenti AI sui dati interni · Ricerca semantica e
RAG · Automazione documentale e processi · Onboarding e formazione accelerati

**03 — CONSULENZA** · *Affianchiamo dove le decisioni pesano*
Nelle fasi dove sbagliare costa caro — lancio di un prodotto, cambio di modello, adozione
dell'AI, salto di scala — serve qualcuno che ragioni con te, non per te.
→ Strategia e go-to-market · Modelli operativi e processi · AI adoption e organizational
intelligence · Accompagnamento alla scala · Analisi e decisioni di pivoting

**04 — BRAND & COMUNICAZIONE** · *(mantiene i 7 sottoservizi già scritti)*
Art Direction · Visual and verbal identity · Logotype and design system · Brand book and
guidelines · Illustrations and visuals · Motion Graphics and storytelling · Packaging Design
→ **Da scrivere**: headline + paragrafo introduttivo della categoria.

### 2.3 OurBrand → Startup Studio
Oggi elenca 5 progetti di clienti sotto il titolo "our brand": semanticamente errato.
Diventa la vetrina dei prodotti propri, come in produzione:
- **Zentro** — Live. CRM e project management per freelancer e agenzie. Utenti paganti.
  In crescita. → `zentro.it`
- **Replase** — In sviluppo. Connette le imprese alle iniziative globali di rimozione
  della plastica. Impatto ambientale reale e misurabile. → `replase.com`

Intro: *Seedera è anche uno startup studio. Quando identifichiamo un problema irrisolto,
costruiamo il prodotto.* + principio **Build to learn**: Ogni prodotto costruito diventa
know-how per i clienti successivi. Il ciclo non si ferma.

### 2.4 TargetPhysics → "Per chi siamo"
Titolo: **Lavoriamo con chi costruisce cose belle.**
Ri-etichettare `BRICKS` (invariata la fisica Matter.js) con i concetti del posizionamento:
PROBLEMA VERO · PARTNER · SISTEMA · IMPATTO · RISCHIO CONDIVISO · DIAGNOSI · CAPACITÀ ·
FRANCHEZZA · ESECUZIONE …
Sotto i mattoni, le due liste in chiaro:

*La scelta giusta per chi* → Ha un problema prima di avere una soluzione da eseguire ·
Vuole un partner che operi, non solo che consigli · Cerca un sistema, non un deliverable ·
Sa che "facciamo tutto" non è una risposta · È disposto a sentirsi dire che sta chiedendo
la cosa sbagliata

*Non siamo la scelta giusta per chi* → Confonde prezzo con valore · Vuole esecuzione
passiva senza dialogo · Ha già tutte le risposte · Misura il valore in output, non in
impatto · Cerca l'agenzia, non il partner

### 2.5 Clients (slot libero, non montata) → Ledger
Le 4 stat di produzione: `sistemi_integrati 3` · `interlocutore 1` ·
`brief_senza_diagnosi 0` · `problemi_affrontabili ∞`

---

## FASE 3 — Sezioni nuove

### 3.1 Il Diagnostico ⊕ *(priorità massima)*
Header: `// Il Diagnostico Seedera` — **Ogni soluzione sbagliata nasce da una domanda sbagliata.**
Intro: Prima di proporre qualsiasi cosa, usiamo un metodo di diagnosi che fa emergere il
bisogno reale, non la richiesta apparente. Funziona così:

Dialogo in stile terminale (`diagnostico — sessione`):
- `cliente $` Voglio essere primo su questa parola chiave su Google.
- `seedera ~` Perché vuoi più visibilità su quella parola?
- `cliente $` Perché voglio più traffico. Più lead. Più clienti.
- `seedera ~` Il tuo obiettivo non è il traffico — è la conversione. Quella keyword porta
  volume ad alta dispersione. Una strategia diversa porta il triplo dei lead a un quinto
  del costo. Lavoriamo su quello?

Chiusura *→ Cosa cambia con questo approccio*: Un partner customer centric avrebbe
ottimizzato quella parola chiave. Il cliente non avrebbe ottenuto quello di cui aveva
davvero bisogno: più clienti, non più traffico. Seedera non porta a termine progetti che
non risolvono il problema reale.

### 3.2 Il sistema operativo ⊕
*Reso come 4 card: carosello scroll-snap su mobile, griglia 2×2 da `md`, 4 colonne
da `lg`. Hover con rolling text sul titolo (stessa meccanica delle card portfolio),
velo radiale che rientra e descrizione rivelata via `grid-rows 0fr → 1fr`. Su
mobile la descrizione resta sempre visibile, perché l'hover non esiste.*

**Quattro fasi. Nessuna scorciatoia.**
1. **Diagnosi** — *Prima il problema*. Ogni progetto inizia con una domanda: perché? Non
   cosa vuoi costruire. Perché lo vuoi costruire.
2. **Integrazione** — *Un solo sistema*. Tech, second brain e AI si progettano insieme.
   Nessun passaggio di mano, nessuna perdita di contesto. Un interlocutore, dall'inizio alla fine.
3. **Esecuzione** — *Risultati, non output*. Definiamo i KPI prima di iniziare. Il successo
   si misura in capacità acquisite dall'organizzazione.
4. **Trasferimento** — *Usciamo quando sai fare da solo*. Il progetto si chiude quando il
   team interno sa fare le cose che prima non sapeva fare. Non prima.

### 3.3 Partnership & co-investimento ⊕
**Quando ci crediamo, entriamo nel rischio.**
> "La differenza tra un fornitore e un partner si misura in una cosa sola: chi ha qualcosa
> da perdere se va male?"

Seedera può entrare nei progetti come co-investitore. Non è un servizio. È un segnale di
allineamento: crediamo nel progetto abbastanza da condividere il rischio.

- **Modello 01 — Fee di progetto**: Engagement standard. Fee concordata, nessuna equity.
  Per chi ha budget definito e cerca execution di qualità.
- **Modello 02 — Fee ridotta + equity**: Fee inferiore in cambio di quota. Obiettivi
  allineati dall'inizio. Per chi ha un progetto solido e budget da ottimizzare.
- **Modello 03 (selettivo) — Co-investimento diretto**: Mettiamo risorse proprie oltre alle
  competenze. Non è la regola — è l'eccezione per i progetti in cui crediamo davvero.

Criteri: Un problema reale (un dolore verificabile che qualcuno paga per risolvere) ·
Un team che sa eseguire (il progetto può cambiare forma, le persone no) · Un'area di valore
reale (entriamo solo dove tech, AI o brand sono leve concrete) · Equity pulita (accordi
semplici che non creano attriti con i round futuri).

---

## FASE 4 — `/richiedi-preventivo` → `/parliamo`

- Rimuovere lo step **fascia di budget** (`BUDGETS`) — contraddice "Confonde prezzo con valore".
- Titolo: **Apri una conversazione**
- Intro: Scegli un oggetto, raccontaci il problema, e premi invia. Niente brief — ci pensiamo noi.
- Campi: Nome* · Email* · Azienda (opzionale) · Oggetto* (chip) · Messaggio*
- Sostituire `SERVICES` con i chip oggetto coerenti con le 4 capacità.
- Collegare l'invio a un endpoint reale (il form oggi fa solo `preventDefault`).
- Claim di sezione home: *Hai un problema da risolvere o un prodotto da costruire?
  Iniziamo da una conversazione informale. Nessun brief. Nessun form. Solo una chiamata per
  capire se il progetto ha senso per entrambi.*

---

## Ordine home risultante

`Hero → Ledger → AboutUs → Marquee → Diagnostico ⊕ → Services → Sistema operativo ⊕ →
Projects → ProjectsMarquee → ProjectsOutro → Startup Studio → Partnership ⊕ →
Per chi siamo → Footer`

---

## Testi scritti ex novo (non esistevano in produzione) — fatti

1. `Projects.INTRO_TEXT` e `ProjectsOutro.OUTRO_TEXT`
2. 5 descrizioni dei case study, ricavate dalle note del vault Seedera
   (`projects/progetto-*.md`, `entities/entita-cliente-*.md`)
3. Headline, paragrafo e 7 sottoservizi della categoria **Brand & Comunicazione**
4. 15 descrizioni dei sottoservizi dei tre sistemi (5 per sistema)
5. Le 4 caption del Ledger
6. Metadata SEO per `/`, `/portfolio`, `/portfolio/[slug]`, `/parliamo`

---

## Da validare / ancora aperto

**Pagina `/team`** — costruita sulle 6 schede `entities/entita-persona-*.md` del
vault. Pubblicate 5 persone; esclusa **Annamaria**, che è referente del cliente
Cinerentola e non del team. Sulla pagina finiscono solo ruolo, competenze e area:
codici fiscali, indirizzi, date di nascita, quote societarie e PEC restano nel
vault. Non esistono foto in `public/`, quindi i ritratti sono le iniziali su fondo
colorato. **Biagio Cipolletta e Alessandro Musto** nel vault risultano soci di
Zentro S.r.l., non dipendenti Seedera: se la distinzione conta per la pagina
pubblica, vanno separati in un blocco proprio.

**Richiede una tua conferma:**
- **URL LinkedIn** in `Footer.tsx`: ho messo `linkedin.com/company/seedera` come
  segnaposto plausibile. Va sostituito con quello reale.
- **Descrizioni dei case study**: scritte a partire dai dati del vault (task,
  voci fatturate, note cliente). Sono fedeli ai fatti disponibili, ma non sono
  state riviste da chi ha seguito i progetti.
- **`FORM_ENDPOINT`**: finché `NEXT_PUBLIC_FORM_ENDPOINT` non è configurata, il
  form apre un mailto precompilato verso `info@seedera.it`. Funziona, ma perde
  il tracciamento: serve un endpoint (Formspree, Resend, una function) per
  raccogliere le richieste sul serio.

**Nota sulla pila di Services:** le card sono pinnate con uno scalino cumulativo
(`STACK_OFFSET`). Era 80px desktop / 30px mobile: con la tagline aggiunta, la
quarta card si fermava 240px sotto la prima e usciva dal fold. Ora 26/14px, e il
blocco tagline+intro è compatto. **Ogni riga aggiunta dentro una card si somma
all'altezza dell'intera pila** — tenerlo presente prima di allungare quei testi.

**Debito tecnico non affrontato (fuori dal perimetro delle fasi):**
- ~~69 MB di media~~ **Fatto il 2026-08-06**: JPEG ridimensionati a max 1920px
  con qualità 72 (`sips`) e video riportati a 720p (`avconvert`, nativo macOS).
  Da **70,6 MB a 19 MB**; output di build da 74 a 24 MB. Nessun path cambiato:
  formati ed estensioni sono rimasti gli stessi, quindi zero modifiche al codice.
  Gli originali restano nella storia git prima del commit `a6d31aa`.
- `--color-purple` in `globals.css` è ancora un segnaposto duplicato di `--color-pink`.
- **Replase** non ha immagini in `public/`: la card usa un placeholder tipografico.
- `Zentro` compare sia nel portfolio sia nello Startup Studio. La descrizione del
  case study lo racconta come prodotto interno, coerente con la sezione Studio.
