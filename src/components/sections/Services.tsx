"use client";

import { useRef, useState, useCallback } from "react";
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
    title: "PRODOTTO & TECH",
    tagline: "Costruiamo prodotti che trovano mercato",
    intro:
      "Dall'architettura alla produzione. Progettiamo software, app e piattaforme con la stessa attenzione alla logica tecnica e al modello di business. Un prodotto che funziona ma non trova mercato è solo codice.",
    color: "var(--color-cyan)",
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
    title: "SECOND BRAIN",
    tagline: "La conoscenza dell'impresa, viva e interrogabile",
    intro:
      "Le informazioni più preziose di un'impresa vivono sparse tra teste, chat e file. Costruiamo il cervello operativo che le cattura, le struttura e le rende interrogabili — in linguaggio naturale, anche dall'AI.",
    color: "var(--color-green)",
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
    title: "CONSULENZA",
    tagline: "Affianchiamo dove le decisioni pesano",
    intro:
      "Nelle fasi dove sbagliare costa caro — lancio di un prodotto, cambio di modello, adozione dell'AI, salto di scala — serve qualcuno che ragioni con te, non per te.",
    color: "var(--color-yellow)",
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
  {
    title: "BRAND & COMUNICAZIONE",
    tagline: "Un'identità che regge la promessa del prodotto",
    intro:
      "Un sistema di marca non è un vestito grafico: è il modo in cui l'impresa si fa riconoscere e mantiene la parola data. Lo progettiamo insieme al prodotto, non dopo.",
    color: "var(--color-red)",
    textDark: true,
    subs: [
      {
        name: "Art direction",
        description:
          "La regia visiva che tiene insieme ogni punto di contatto, dal prodotto alla presentazione.",
      },
      {
        name: "Identità visiva e verbale",
        description:
          "Come il brand si mostra e come parla: due facce dello stesso sistema, definite insieme.",
      },
      {
        name: "Logotipo e design system",
        description:
          "Un segno riconoscibile e le regole che permettono a chiunque di applicarlo senza tradirlo.",
      },
      {
        name: "Brand book e linee guida",
        description:
          "Il manuale operativo dell'identità, scritto perché venga usato e non archiviato.",
      },
      {
        name: "Illustrazioni e contenuti visivi",
        description:
          "Un repertorio proprietario che rende il brand riconoscibile anche senza il logo.",
      },
      {
        name: "Motion graphics e storytelling",
        description:
          "Il movimento come parte dell'identità, non come effetto aggiunto alla fine.",
      },
      {
        name: "Packaging design",
        description:
          "L'unico momento in cui il brand si tocca. Progettato per la produzione, non solo per il render.",
      },
    ],
  },
];

/* ── Scramble text: matrix-style reveal on hover ── */
function ScrambleText({ text, active }: { text: string; active: boolean }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const handleEnter = useCallback(() => {
    if (tweenRef.current) tweenRef.current.kill();
    const obj = { progress: 0 };
    tweenRef.current = gsap.to(obj, {
      progress: 1,
      duration: 0.35,
      ease: "none",
      onUpdate: () => {
        if (!spanRef.current) return;
        const p = obj.progress;
        const resolved = Math.floor(p * text.length);
        spanRef.current.textContent = text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            return i < resolved
              ? ch
              : chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      },
      onComplete: () => {
        if (spanRef.current) spanRef.current.textContent = text;
      },
    });
  }, [text]);

  return (
    <span
      ref={spanRef}
      onMouseEnter={handleEnter}
      className="inline-block"
      style={{
        fontWeight: active ? 700 : 400,
        opacity: active ? 1 : 0.3,
        transform: active ? "translateX(8px)" : "translateX(0)",
        transition:
          "font-weight 0.4s ease, opacity 0.4s ease, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {text}
    </span>
  );
}

/* ── Sub-service list with animated hover reveal ── */
function SubServiceList({ subs }: { subs: SubService[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  // Animate the active indicator line to the active item
  useGSAP(
    () => {
      if (activeIndex === null || !listRef.current || !lineRef.current) return;
      const buttons = listRef.current.querySelectorAll<HTMLElement>(".sub-btn");
      const target = buttons[activeIndex];
      if (!target) return;

      const parentRect = listRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      gsap.to(lineRef.current, {
        y: targetRect.top - parentRect.top + targetRect.height * 0.2,
        height: targetRect.height * 0.6,
        duration: 0.4,
        ease: "power3.out",
      });
    },
    { scope: listRef, dependencies: [activeIndex] },
  );

  // Animate description change
  useGSAP(
    () => {
      if (!descRef.current) return;
      const paragraphs =
        descRef.current.querySelectorAll<HTMLElement>(".desc-item");

      paragraphs.forEach((p, i) => {
        if (i === activeIndex) {
          gsap.killTweensOf(p);
          gsap.to(p, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            delay: 0.2,
            ease: "power3.out",
          });
        } else {
          gsap.killTweensOf(p);
          gsap.to(p, {
            opacity: 0,
            y: -8,
            duration: 0.2,
            ease: "power2.in",
          });
        }
      });
    },
    { scope: descRef, dependencies: [activeIndex] },
  );

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        {/* Sub-service names with animated line indicator */}
        <div ref={listRef} className="relative shrink-0">
          {/* Animated vertical indicator */}
          <div
            ref={lineRef}
            className="absolute left-0 top-0 w-[2px] bg-black rounded-full"
            style={{ height: 0 }}
          />

          <ul className="flex flex-col">
            {subs.map((sub, i) => (
              <li key={i}>
                <button
                  className="sub-btn text-left text-black cursor-pointer leading-none block w-full"
                  style={{
                    fontSize: "var(--font-h5)",
                    padding: "8px 0 8px 16px",
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                >
                  <ScrambleText text={sub.name} active={activeIndex === i} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Description area with GSAP crossfade */}
        <div
          ref={descRef}
          className="relative mt-6 lg:mt-0 lg:w-[280px] xl:w-[350px] 2xl:w-[420px] lg:shrink-0 lg:ml-auto min-h-[80px]"
        >
          {subs.map((sub, i) => (
            <p
              key={i}
              className="desc-item text-black/80 absolute top-0 left-0 right-0"
              style={{
                fontSize: "clamp(0.875rem, 1.111vw, 1.125rem)",
                lineHeight: 1.5,
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateY(0)" : "translateY(12px)",
                pointerEvents: activeIndex === i ? "auto" : "none",
              }}
            >
              {sub.description}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

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
            start: () => `top-=${i * STACK_OFFSET} top+=${PIN_TOP}`,
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
        /* Scalino tra una card e la successiva. Va tenuto piccolo: è cumulativo,
           quindi con 80px la quarta card si fermava 240px più in basso della
           prima e il suo contenuto finiva sotto il fold. Con 26px la pila resta
           leggibile e l'ultima card parte a 80+78=158px. */
        const STACK_OFFSET = 26;

        cards.forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card,
            start: () => `top-=${i * STACK_OFFSET} top+=${PIN_TOP}`,
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
          className={`service-card w-full container-content ${i > 0 ? "mt-4 md:mt-[150px]" : "pt-24 md:pt-32"}`}
        >
          <div
            className="rounded-[10px] flex flex-col"
            style={{ backgroundColor: service.color }}
          >
            <div className="px-5 md:px-12 lg:px-16 pt-8 md:pt-12 pb-8 md:pb-14">
              {/* ── Row 1: Number + Title ── */}
              <div className="flex items-baseline">
                <span
                  className="text-black font-medium leading-none shrink-0 mr-4 md:mr-0 md:w-[clamp(150px,15.625vw,225px)]"
                  style={{
                    fontSize: "clamp(2rem, 5.417vw, 4.875rem)",
                  }}
                >
                  0{i + 1}
                </span>
                {/* Desktop spacer = exactly content gap → title aligns with sub-list */}
                <div
                  className="hidden md:block shrink-0"
                  style={{ width: "clamp(1.25rem, 8.333vw, 9rem)" }}
                />
                <h3
                  className="text-black font-normal uppercase leading-none"
                  style={{
                    fontSize: "var(--font-h2)",
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* ── Separator ── */}
              <div className="w-full h-[1px] bg-black/20 mt-5 mb-6 md:mb-[35px]" />

              {/* ── Tagline + intro ──
                  Compatto di proposito: ogni riga in più qui si somma
                  all'altezza della card, e le card sono impilate in pin. */}
              <div className="mb-6 md:mb-7 flex flex-col gap-1.5">
                <h4
                  className="text-black font-medium leading-tight"
                  style={{ fontSize: "clamp(1.0625rem, 1.6vw, 1.375rem)" }}
                >
                  {service.tagline}
                </h4>
                <p className="max-w-[95ch] text-black/70 leading-snug text-sm">
                  {service.intro}
                </p>
              </div>

              {/* ── Content: Image + Subs + Description ── */}
              <div
                className="flex flex-col md:flex-row"
                style={{ gap: "clamp(1.25rem, 8.333vw, 9rem)" }}
              >
                <div className="shrink-0 bg-black rounded-[5px] w-[120px] h-[120px] md:w-[clamp(150px,15.625vw,225px)] md:h-[clamp(150px,15.625vw,225px)]" />

                {/* Sub-services with hover/click description */}
                <SubServiceList subs={service.subs} />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Spacer for scroll after last pinned card */}
      <div className="h-[50vh]" />
    </section>
  );
}
