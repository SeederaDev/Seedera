"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface SubService {
  name: string;
  description: string;
}

interface Service {
  title: string;
  tagline: string;
  intro: string;
  color: string;
  textDark: boolean;
  subs: SubService[];
}

const SERVICES: Service[] = [
  {
    title: "Prodotto & Tech",
    tagline: "Costruiamo prodotti che trovano mercato",
    intro:
      "Dall'architettura alla produzione. Progettiamo software, app e piattaforme con la stessa attenzione alla logica tecnica e al modello di business. Un prodotto che funziona ma non trova mercato è solo codice.",
    color: "#F2F2F2",
    textDark: true,
    subs: [
      {
        name: "Software su misura e piattaforme",
        description:
          "Sistemi costruiti sul processo reale dell'impresa, non sul processo che il software da scaffale impone.",
      },
      {
        name: "App mobile e web",
        description:
          "Interfacce che le persone usano davvero, sviluppate su una base tecnica che regge la crescita.",
      },
      {
        name: "Agenti AI e automazioni",
        description:
          "Automatizziamo il lavoro ripetitivo e mettiamo l'AI dove produce un risultato misurabile, non dove fa notizia.",
      },
      {
        name: "Integrazioni, API, architetture dati",
        description:
          "Colleghiamo i sistemi che oggi non si parlano, così il dato smette di essere ricopiato a mano.",
      },
      {
        name: "MVP e product sprint",
        description:
          "Dalla prima versione al mercato nel tempo più breve utile a imparare qualcosa di vero.",
      },
    ],
  },
  {
    title: "Second brain",
    tagline: "La conoscenza dell'impresa, viva e interrogabile",
    intro:
      "Le informazioni più preziose di un'impresa vivono sparse tra teste, chat e file. Costruiamo il cervello operativo che le cattura, le struttura e le rende interrogabili — in linguaggio naturale, anche dall'AI.",
    color: "#CCCCCC",
    textDark: true,
    subs: [
      {
        name: "Knowledge base e memoria aziendale",
        description:
          "Un unico posto dove la conoscenza si deposita e resta, anche quando le persone cambiano.",
      },
      {
        name: "Assistenti AI sui dati interni",
        description:
          "Rispondono sulle informazioni dell'azienda, con le fonti in chiaro e senza inventare.",
      },
      {
        name: "Ricerca semantica e RAG",
        description:
          "Si cerca per significato, non per parola esatta: quello che serve emerge anche senza sapere dove sta.",
      },
      {
        name: "Automazione documentale e processi",
        description:
          "Documenti che si generano, si archiviano e si ritrovano da soli, dentro il flusso di lavoro.",
      },
      {
        name: "Onboarding e formazione accelerati",
        description:
          "Chi entra trova il contesto già scritto e diventa operativo in giorni, non in mesi.",
      },
    ],
  },
  {
    title: "Consulenza",
    tagline: "Affianchiamo dove le decisioni pesano",
    intro:
      "Nelle fasi dove sbagliare costa caro — lancio di un prodotto, cambio di modello, adozione dell'AI, salto di scala — serve qualcuno che ragioni con te, non per te.",
    color: "#9E9E9E",
    textDark: true,
    subs: [
      {
        name: "Strategia e go-to-market",
        description:
          "Dove si compete, con quale promessa e attraverso quali canali. Prima di spendere in acquisizione.",
      },
      {
        name: "Modelli operativi e processi",
        description:
          "Come il lavoro attraversa l'organizzazione, dove si inceppa e cosa va ridisegnato.",
      },
      {
        name: "AI adoption e organizational intelligence",
        description:
          "Dove l'AI sposta davvero l'ago, come si introduce e cosa deve cambiare nel modo di lavorare.",
      },
      {
        name: "Accompagnamento alla scala",
        description:
          "Quando i volumi crescono più in fretta della struttura, e ogni processo manuale diventa un collo di bottiglia.",
      },
      {
        name: "Analisi e decisioni di pivoting",
        description:
          "Capire se il problema è l'esecuzione o l'ipotesi di partenza. E avere il coraggio di dirlo.",
      },
    ],
  },
];


/* ── Sub-service list with animated hover reveal ── */

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Mobile / Tablet
      mm.add("(max-width: 767px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".service-card");
        const PIN_TOP = 60;
        /* Su mobile lo spazio verticale è ancora più prezioso: vedi nota
           sullo scalino cumulativo nel blocco desktop. */
        const STACK_OFFSET = 14;

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            /* Lo scalino va sul lato SCROLLER, non sul trigger: cosi' legge
               "la card i si ferma a PIN_TOP + i*STACK_OFFSET dal bordo alto",
               che e' quello che vogliamo. Scritto come `top-=${"i*OFFSET"}` sul
               trigger sposta invece il punto d'innesco, e con pinSpacing:false
               (che toglie le card dal flusso, facendo arrivare la successiva
               prima del previsto) la card sopra veniva coperta fino in fondo
               invece di lasciare visibile la riga del titolo. */
            start: () => `top top+=${PIN_TOP + i * STACK_OFFSET}`,
            endTrigger: sectionRef.current,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
            id: `service-pin-${i}`,
          });
        });
      });

      // Desktop
      mm.add("(min-width: 768px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".service-card");
        const PIN_TOP = 80;
        /* Aria fra la fine del titolo e il bordo della card che lo copre.
           Nel design (titoli a y 3665,7 · 3811,2 · 3963,9) lo scalino e' 145,5
           e il titolo occupa padding 41 + due righe da 44 = 129: restano 17. */
        const RESPIRO = 17;

        /* Lo scalino si MISURA, non si scrive. Con il valore fisso a 146 il
           design tornava solo a 1440px: sotto i 1366 il titolo della seconda
           card va su tre righe (serve 173) e sopra i 1680 la terza sta su una
           sola (ne bastano 85), quindi la card successiva tagliava o lasciava
           un vuoto. Misurando il titolo davvero renderizzato resta visibile
           tutto il titolo a qualsiasi larghezza, che e' la regola del design. */
        const scalino = (card: HTMLElement) => {
          const box = card.firstElementChild as HTMLElement | null;
          const titolo = card.querySelector("h3");
          if (!box || !titolo) return 146;
          const pad = parseFloat(getComputedStyle(box).paddingTop) || 41;
          return Math.round(pad + titolo.getBoundingClientRect().height + RESPIRO);
        };

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            /* Lo scalino va sul lato SCROLLER, non sul trigger: cosi' legge
               "la card i si ferma a tot dal bordo alto", che e' quello che
               vogliamo. Scritto sul trigger sposta invece il punto d'innesco, e
               con pinSpacing:false (che toglie le card dal flusso, facendo
               arrivare la successiva prima del previsto) la card sopra veniva
               coperta fino in fondo. La somma e' cumulativa perche' ogni card
               puo' chiedere un'altezza diversa. */
            start: () => {
              let y = PIN_TOP;
              for (let k = 0; k < i; k++) y += scalino(cards[k]);
              return `top top+=${y}`;
            },
            endTrigger: sectionRef.current,
            end: "bottom bottom",
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
            id: `service-pin-${i}`,
          });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative z-0 bg-white"
      aria-label="Servizi"
    >
      {/* Service cards */}
      {SERVICES.map((service, i) => (
        <div
          key={i}
          id={i === 0 ? "servizi-inner" : undefined}
          className={`service-card w-full container-content ${i > 0 ? "mt-4 md:mt-[150px]" : "pt-24 md:pt-32"}`}
        >
          {/* Card del design (nodo 464:340): 1360x316, raggio 5, padding 40.
              Tre colonne — badge / titolo+intro / elenco — larghe 420, 521 e
              339 sui 1280 utili, in frazioni perche' il sito e' full-width.
              Titolo e badge partono a 41 dall'alto, intro ed elenco a 153,57. */}
          <div
            /* minmax(0,…) non e' decorazione: senza, il titolo largo 555 (che
               nel design sconfina oltre la propria colonna) impone la sua
               misura come minimo e il browser ridistribuisce gli fr in
               401/555/324. L'elenco finiva a x=1036 invece di 1021. */
            className="rounded-[5px] px-[40px] pt-[41px] pb-[43px] grid grid-cols-1 gap-y-8 md:grid-cols-[minmax(0,420fr)_minmax(0,521fr)_minmax(0,339fr)] md:gap-y-0"
            style={{ backgroundColor: service.color }}
          >
            {/* ── Colonna 1: i due badge ── */}
            <div className="flex items-start gap-[21px]">
              <span
                className="inline-flex items-center rounded-[5px] border border-primary bg-primary px-[10px] py-[4px] text-[14px] leading-[20px] text-black whitespace-nowrap"
              >
                {`0${i + 1}`} / 0{SERVICES.length}
              </span>
              <span className="inline-flex items-center rounded-[5px] border border-black px-[10px] py-[4px] text-[14px] leading-[20px] text-black whitespace-nowrap">
                {service.title}
              </span>
            </div>

            {/* ── Colonna 2: titolo grande + introduzione ── */}
            <div>
              {/* Nel design il titolo e' largo 555 e sconfina oltre la propria
                  colonna: l'elenco accanto parte 112px piu' in basso, quindi
                  non si scontrano. 555 su 1440 = 38,54vw, cosi' segue la
                  finestra invece di restare fisso. */}
              <h3 className="text-black font-normal text-[39px] leading-[44px] md:w-[38.54vw]">
                {service.tagline}
              </h3>
              <p className="mt-[24px] max-w-[440px] text-black text-[16px] leading-[19.4px]">
                {service.intro}
              </p>
            </div>

            {/* ── Colonna 3: l'elenco, allineato all'introduzione ── */}
            <ul className="md:mt-[112px] text-black text-[16px] leading-[24px]">
              {service.subs.map((s) => (
                <li key={s.name}>+ {s.name}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* Spacer for scroll after last pinned card */}
      <div className="h-[50vh]" />
    </section>
  );
}
