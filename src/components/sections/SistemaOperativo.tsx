"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Phase {
  number: string;
  title: string;
  claim: string;
  description: string;
  color: string;
}

const PHASES: Phase[] = [
  {
    number: "01",
    title: "Diagnosi",
    claim: "Prima il problema",
    description:
      "Ogni progetto inizia con una domanda: perché? Non cosa vuoi costruire. Perché lo vuoi costruire. Solo dopo la risposta progettiamo la soluzione.",
    color: "var(--color-yellow)",
  },
  {
    number: "02",
    title: "Integrazione",
    claim: "Un solo sistema",
    description:
      "Tech, second brain e AI si progettano insieme. Nessun passaggio di mano, nessuna perdita di contesto. Un interlocutore, dall'inizio alla fine.",
    color: "var(--color-cyan)",
  },
  {
    number: "03",
    title: "Esecuzione",
    claim: "Risultati, non output",
    description:
      "Definiamo i KPI prima di iniziare. Il successo non si misura in deliverable consegnati — si misura in capacità acquisite dall'organizzazione.",
    color: "var(--color-green)",
  },
  {
    number: "04",
    title: "Trasferimento",
    claim: "Usciamo quando sai fare da solo",
    description:
      "Il progetto si chiude quando il team interno sa fare le cose che prima non sapeva fare. Non prima.",
    color: "var(--color-pink)",
  },
];

/* ── Rolling text: stessa meccanica delle card portfolio, ma innescata
      dall'hover dell'intera card (vedi .phase-card in globals.css) ── */
function RollingText({ text }: { text: string }) {
  const letters = text.split("");

  return (
    <span className="rolling-text-wrap font-medium">
      <span className="rolling-text-row" aria-hidden="true">
        {letters.map((char, i) => (
          <span
            key={i}
            className="rolling-text-char"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
      <span className="rolling-text-row">
        {letters.map((char, i) => (
          <span
            key={i}
            className="rolling-text-char"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function SistemaOperativo() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".phase-card");
      gsap.from(cards, {
        y: 48,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".phase-track",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="sistema-operativo"
      className="relative bg-white z-10 py-24 md:py-40 overflow-hidden"
      aria-label="Il sistema operativo"
    >
      <div className="container-content flex flex-col gap-12 md:gap-16">
        {/* ── Header ── */}
        <header className="flex flex-col gap-5">
          <span
            className="uppercase tracking-[0.2em]"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-middle-grey)",
            }}
          >
            {"// Il sistema operativo"}
          </span>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2
              className="text-black font-normal uppercase leading-none max-w-[20ch]"
              style={{ fontSize: "var(--font-h2)" }}
            >
              Quattro fasi. Nessuna scorciatoia.
            </h2>
            {/* Suggerimento di scorrimento, solo dove il carosello è attivo */}
            <span
              className="md:hidden uppercase tracking-wide"
              style={{
                fontSize: "var(--font-btn)",
                color: "var(--color-middle-grey)",
              }}
            >
              Scorri →
            </span>
          </div>
        </header>
      </div>

      {/* ── Track: carosello su mobile, griglia da md in su ──
           Su mobile lo scroll sfora a destra fino al bordo schermo (-mr/pr),
           così la prima card resta allineata al titolo e l'ultima non finisce
           incastrata nel padding del container. */}
      <div className="container-content mt-12 md:mt-16">
        <div
          className="phase-track flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mr-5 pr-5 md:mr-0 md:pr-0 md:grid md:grid-cols-2 md:gap-6 lg:grid-cols-4 md:overflow-visible"
          style={{ scrollbarWidth: "none" }}
        >
          {PHASES.map((phase) => (
            <article
              key={phase.number}
              className="phase-card group relative shrink-0 snap-start w-[78vw] sm:w-[52vw] md:w-auto rounded-[10px] overflow-hidden cursor-default"
              style={{ backgroundColor: phase.color }}
            >
              {/* Velo che rientra all'hover: stessa logica dello zoom immagine
                  delle card portfolio, qui su un layer di colore. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 scale-[1.15] group-hover:scale-100 transition-transform duration-700 ease-out will-change-transform"
                style={{
                  background:
                    "radial-gradient(120% 90% at 100% 0%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 60%)",
                }}
              />

              <div className="relative flex flex-col min-h-[400px] md:min-h-[440px] p-6 md:p-7">
                {/* Numero */}
                <span
                  className="font-medium leading-none text-black/25 group-hover:text-black/45 transition-colors duration-500"
                  style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)" }}
                >
                  {phase.number}
                </span>

                {/* Blocco testo, ancorato in basso */}
                <div className="mt-auto flex flex-col gap-3">
                  <h3
                    className="text-black uppercase leading-none"
                    style={{ fontSize: "var(--font-h4)" }}
                  >
                    <RollingText text={phase.title} />
                  </h3>

                  <p className="text-black/70 font-medium leading-snug">
                    {phase.claim}
                  </p>

                  {/* Descrizione: rivelata all'hover con grid 0fr → 1fr, così
                      l'altezza si anima senza max-height arbitrarie. Su mobile
                      (dove l'hover non esiste) resta sempre visibile. */}
                  <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out">
                    <div className="overflow-hidden">
                      <div className="pt-3 border-t border-black/20">
                        <p className="text-black/70 leading-relaxed text-sm">
                          {phase.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
