"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Model {
  label: string;
  title: string;
  description: string;
  accent: string;
  selective?: boolean;
}

const INTRO =
  "Quando ci crediamo, entriamo nel rischio, la differenza tra un fornitore e " +
  "un partner si misura in una cosa sola: chi ha qualcosa da perdere se va " +
  "male? Seedera può entrare nei progetti come co-investitore. Non è un " +
  "servizio. È un segnale di allineamento";

const MODELS: Model[] = [
  {
    label: "Modello 1",
    title: "Fee di progetto",
    description:
      "Engagement standard. Fee concordata, nessuna equity. Per chi ha budget definito e cerca execution di qualità.",
    accent: "var(--color-cyan)",
  },
  {
    label: "Modello 2",
    title: "Fee ridotta + equity",
    description:
      "Fee inferiore in cambio di quota. Obiettivi allineati dall'inizio. Per chi ha un progetto solido e budget da ottimizzare.",
    accent: "var(--color-green)",
  },
  {
    label: "Modello 3",
    title: "Co-investimento diretto",
    description:
      "Mettiamo risorse proprie oltre alle competenze. Non è la regola — è l'eccezione per i progetti in cui crediamo davvero.",
    accent: "var(--color-yellow)",
    selective: true,
  },
];

const CRITERIA = [
  {
    number: "1 / 4",
    title: "Un problema reale",
    description: "Un dolore verificabile che qualcuno paga per risolvere.",
  },
  {
    number: "2 / 4",
    title: "Un team che sa eseguire",
    description: "Il progetto può cambiare forma. Le persone no.",
  },
  {
    number: "3 / 4",
    title: "Un'area di valore reale",
    description: "Entriamo solo dove tech, AI o brand sono leve concrete.",
  },
  {
    number: "4 / 4",
    title: "Equity pulita",
    description:
      "Accordi semplici che non creano attriti con i round futuri.",
  },
];

export default function Partnership() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      /* Rivelo progressivo del titolo, come in Start-up studio: il colore
         segue lo scorrimento carattere per carattere. Su fondo scuro il
         "gia' letto" e' bianco, il resto grigio. */
      const chars = gsap.utils.toArray<HTMLElement>(".partnership-char");
      if (chars.length) {
        ScrollTrigger.create({
          trigger: ".partnership-intro",
          start: "top 80%",
          end: "top 25%",
          scrub: 0.5,
          onUpdate: (self) => {
            chars.forEach((c, i) => {
              c.style.color =
                self.progress > i / chars.length
                  ? "var(--color-foreground)"
                  : "#505050";
            });
          },
        });
      }

      const cards = gsap.utils.toArray<HTMLElement>(".partnership-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          /* Appena la griglia si affaccia, non a 80%: il rivelo del titolo
             qui sopra si consuma proprio in quella fascia di scroll, e con
             l'ingresso piu' tardivo il design (titolo a meta' rivelo E card
             gia' visibili) era uno stato che la pagina non raggiungeva mai. */
          trigger: ".partnership-grid",
          start: "top 98%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="partnership"
      className="relative bg-background z-10 py-24 md:py-40"
      aria-label="Partnership e co-investimento"
    >
      {/* Gli stacchi non sono uniformi nel design: 99px fra il testo e i tre
          modelli, 118 fra i modelli e le quattro card. */}
      <div id="partnership-inner" className="container-content flex flex-col">
        {/* ── Header: badge a sinistra, testo nella colonna a x=504 ── */}
        {/* 464 + 896 su 1360: nel design il testo parte a x=504 dell'artboard. */}
        <div className="flex flex-col md:grid md:grid-cols-[464fr_896fr] md:items-start">
          <div className="mb-6 md:mb-0">
            <span
              className="inline-flex items-center border border-white/70 text-foreground"
              style={{
                borderRadius: "5px",
                padding: "4px 10px",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              Partnership &amp; Co-investimento
            </span>
          </div>

          {/* Design (nodo 468:73): Regular 48/54, non 39/44.
              Nel PDF il titolo e' a due toni — bianco fino a "chi ha qualcosa
              da per", grigio da li' in poi: e' il rivelo progressivo colto a
              meta' animazione, lo stesso di Start-up studio. Senza, il testo
              restava tutto bianco e la meta' bassa della sezione era la parte
              piu' lontana dal design.
              Il tracking recupera il kerning che gli inline-block azzerano. */}
          <h2 className="partnership-intro text-foreground font-normal text-[48px] leading-[54px] tracking-[-0.002em]">
            {INTRO.split(" ").map((parola, wi) => (
              <span key={wi}>
                {wi > 0 ? " " : null}
                {/* La parola resta intera in un inline-block: cosi' va a capo
                    per parole, non per lettere. */}
                <span className="inline-block">
                  {parola.split("").map((ch, ci) => (
                    <span
                      key={ci}
                      className="partnership-char inline-block transition-colors duration-300 ease-out"
                      style={{ color: "#505050" }}
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* ── Models ── */}
        <div className="partnership-grid mt-10 md:mt-[99px] grid grid-cols-1 md:grid-cols-3 gap-[21px]">
          {MODELS.map((model) => (
            <article
              key={model.label}
              className="partnership-card flex flex-col gap-[10px] items-start md:max-w-[439px]"
            >
              <span
                className="inline-flex items-center justify-center bg-primary text-black"
                style={{
                  borderRadius: "5px",
                  padding: "4px 10px",
                  fontSize: "14px",
                  lineHeight: "20px",
                }}
              >
                {model.label}
              </span>
              <h3 className="text-foreground font-bold text-[16px] leading-normal">
                {model.title}
              </h3>
              <p className="text-foreground text-[16px] leading-[22px]">
                {model.description}
              </p>
              <svg
                width="35"
                height="33"
                viewBox="0 0 35 33"
                fill="none"
                aria-hidden="true"
                className="text-foreground mt-1"
              >
                <path
                  d="M1 16.5h32M21 4l12 12.5L21 29"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </article>
          ))}
        </div>

        {/* ── Criteria ── */}
        <div className="mt-10 md:mt-[118px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-8">
            {CRITERIA.map((criterion) => (
              <div
                key={criterion.number}
                className="partnership-card flex flex-col gap-3"
              >
                {/* Nel design il contatore non e' testo su una riga: sta dentro
                    un riquadro grigio alto 73,5 (misurato sul PDF: y 780,5→854,
                    largo 325 come la colonna, #505050), come pillola gialla
                    50x26,5 a 19,5 dal bordo sinistro e centrata in verticale. */}
                <div className="h-[73.5px] rounded-[10px] bg-[#505050] flex items-center px-[19.5px] mb-[6px]">
                  <span
                    className="inline-flex items-center justify-center rounded-[5px] bg-primary text-black w-[50px] h-[26.5px] text-[14px] leading-[20px]"
                  >
                    {criterion.number}
                  </span>
                </div>
                <h4 className="text-foreground font-bold text-[16px]">
                  {criterion.title}
                </h4>
                <p className="text-foreground text-[16px] leading-[22px]">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Qui c'era un CTA "Presenta un progetto per co-investimento" che nel
            Figma non esiste: aggiunto di iniziativa, non richiesto dal design.
            Rimosso. La conversazione si apre dal menu (Parliamo). */}
      </div>
    </section>
  );
}
