"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Turn {
  speaker: "cliente" | "seedera";
  lines: string[];
}

const CONVERSATION: Turn[] = [
  {
    speaker: "cliente",
    lines: ["Voglio essere primo su questa parola chiave su Google."],
  },
  {
    speaker: "seedera",
    lines: ["Perché vuoi più visibilità su quella parola?"],
  },
  {
    speaker: "cliente",
    lines: ["Perché voglio più traffico. Più lead. Più clienti."],
  },
  {
    speaker: "seedera",
    lines: [
      "Il tuo obiettivo non è il traffico — è la conversione.",
      "Quella keyword porta volume ad alta dispersione. Una strategia diversa porta il triplo dei lead a un quinto del costo. Lavoriamo su quello?",
    ],
  },
];

export default function Diagnostico() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const turns = gsap.utils.toArray<HTMLElement>(".diag-turn");
      gsap.from(turns, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.18,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".diag-terminal",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="diagnostico"
      className="relative bg-background z-10 py-24 md:py-40"
      aria-label="Il Diagnostico Seedera"
    >
      <div className="container-content flex flex-col gap-12 md:gap-16">
        {/* ── Header ── */}
        <header className="flex flex-col gap-5 max-w-[70ch]">
          <span
            className="uppercase tracking-[0.2em]"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-middle-grey)",
            }}
          >
            {"// Il Diagnostico Seedera"}
          </span>
          <h2
            className="text-foreground font-normal uppercase leading-none"
            style={{ fontSize: "var(--font-h2)" }}
          >
            Ogni soluzione sbagliata nasce da una domanda sbagliata.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed">
            Prima di proporre qualsiasi cosa, usiamo un metodo di diagnosi che fa
            emergere il bisogno reale, non la richiesta apparente. Funziona così:
          </p>
        </header>

        {/* ── Terminal ── */}
        <div className="diag-terminal rounded-[10px] border border-white/15 overflow-hidden">
          {/* Terminal bar */}
          <div className="flex items-center gap-3 border-b border-white/15 px-5 py-3">
            <span aria-hidden="true" className="flex gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-red)" }}
              />
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-yellow)" }}
              />
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: "var(--color-green)" }}
              />
            </span>
            <span
              className="font-mono lowercase tracking-wide"
              style={{
                fontSize: "var(--font-p)",
                color: "var(--color-middle-grey)",
              }}
            >
              diagnostico — sessione
            </span>
          </div>

          {/* Conversation */}
          <div className="flex flex-col gap-6 px-5 py-6 md:px-8 md:py-10">
            {CONVERSATION.map((turn, i) => {
              const isClient = turn.speaker === "cliente";
              return (
                <div
                  key={i}
                  className="diag-turn flex flex-col gap-2 md:flex-row md:gap-6"
                >
                  <span
                    className="font-mono shrink-0 md:w-[120px]"
                    style={{
                      fontSize: "var(--font-p)",
                      color: isClient
                        ? "var(--color-middle-grey)"
                        : "var(--color-yellow)",
                    }}
                  >
                    {isClient ? "cliente $" : "seedera ~"}
                  </span>
                  <div className="flex flex-col gap-3">
                    {turn.lines.map((line, li) => (
                      <p
                        key={li}
                        className={`leading-relaxed ${
                          isClient ? "text-white/55" : "text-foreground"
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Takeaway ── */}
        <div className="flex flex-col gap-4 border-t border-white/15 pt-8 md:flex-row md:gap-16">
          <span
            className="font-mono shrink-0 md:w-[280px]"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-yellow)",
            }}
          >
            → Cosa cambia con questo approccio
          </span>
          <p className="max-w-[70ch] text-white/60 leading-relaxed">
            Un partner customer centric avrebbe ottimizzato quella parola chiave.
            Il cliente non avrebbe ottenuto quello di cui aveva davvero bisogno:
            più clienti, non più traffico. Portare più traffico avrebbe risposto
            alla richiesta, ma non avrebbe prodotto il risultato. Seedera non
            porta a termine progetti che non risolvono il problema reale.
          </p>
        </div>
      </div>
    </section>
  );
}
