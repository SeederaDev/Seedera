"use client";

import { useRef } from "react";
import Link from "next/link";
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

const MODELS: Model[] = [
  {
    label: "Modello 01",
    title: "Fee di progetto",
    description:
      "Engagement standard. Fee concordata, nessuna equity. Per chi ha budget definito e cerca execution di qualità.",
    accent: "var(--color-cyan)",
  },
  {
    label: "Modello 02",
    title: "Fee ridotta + equity",
    description:
      "Fee inferiore in cambio di quota. Obiettivi allineati dall'inizio. Per chi ha un progetto solido e budget da ottimizzare.",
    accent: "var(--color-green)",
  },
  {
    label: "Modello 03 — Selettivo",
    title: "Co-investimento diretto",
    description:
      "Mettiamo risorse proprie oltre alle competenze. Non è la regola — è l'eccezione per i progetti in cui crediamo davvero.",
    accent: "var(--color-yellow)",
    selective: true,
  },
];

const CRITERIA = [
  {
    number: "01",
    title: "Un problema reale",
    description: "Un dolore verificabile che qualcuno paga per risolvere.",
  },
  {
    number: "02",
    title: "Un team che sa eseguire",
    description: "Il progetto può cambiare forma. Le persone no.",
  },
  {
    number: "03",
    title: "Un'area di valore reale",
    description: "Entriamo solo dove tech, AI o brand sono leve concrete.",
  },
  {
    number: "04",
    title: "Equity pulita",
    description:
      "Accordi semplici che non creano attriti con i round futuri.",
  },
];

export default function Partnership() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".partnership-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".partnership-grid",
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
      id="partnership"
      className="relative bg-background z-10 py-24 md:py-40"
      aria-label="Partnership e co-investimento"
    >
      <div className="container-content flex flex-col gap-12 md:gap-16">
        {/* ── Header ── */}
        <header className="flex flex-col gap-6 max-w-[70ch]">
          <span
            className="uppercase tracking-[0.2em]"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-middle-grey)",
            }}
          >
            {"// Partnership & co-investimento"}
          </span>
          <h2
            className="text-foreground font-normal uppercase leading-none"
            style={{ fontSize: "var(--font-h2)" }}
          >
            Quando ci crediamo, entriamo nel rischio.
          </h2>
          <blockquote
            className="border-l-2 pl-6 text-white/70 leading-relaxed"
            style={{
              borderColor: "var(--color-yellow)",
              fontSize: "var(--font-h6)",
            }}
          >
            La differenza tra un fornitore e un partner si misura in una cosa
            sola: chi ha qualcosa da perdere se va male?
          </blockquote>
          <p className="text-white/60 text-lg leading-relaxed">
            Seedera può entrare nei progetti come co-investitore. Non è un
            servizio: è un segnale di allineamento, significa che crediamo nel
            progetto abbastanza da condividere il rischio.
          </p>
        </header>

        {/* ── Models ── */}
        <div className="partnership-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODELS.map((model) => (
            <article
              key={model.label}
              className="partnership-card flex flex-col gap-4 rounded-[10px] border border-white/15 p-6 md:p-8"
              style={
                model.selective
                  ? { borderColor: "rgba(205, 253, 81, 0.4)" }
                  : undefined
              }
            >
              <span
                className="uppercase tracking-wide font-mono"
                style={{ fontSize: "var(--font-btn)", color: model.accent }}
              >
                {model.label}
              </span>
              <h3
                className="text-foreground font-medium uppercase leading-none"
                style={{ fontSize: "var(--font-h5)" }}
              >
                {model.title}
              </h3>
              <p className="text-white/60 leading-relaxed">
                {model.description}
              </p>
            </article>
          ))}
        </div>

        {/* ── Criteria ── */}
        <div className="flex flex-col gap-8">
          <h3
            className="text-foreground font-medium uppercase leading-none"
            style={{ fontSize: "var(--font-h5)" }}
          >
            Cosa guardiamo prima di entrare
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {CRITERIA.map((criterion) => (
              <div
                key={criterion.number}
                className="partnership-card flex flex-col gap-3 border-t border-white/15 pt-5"
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: "var(--font-p)",
                    color: "var(--color-middle-grey)",
                  }}
                >
                  {criterion.number}
                </span>
                <h4 className="text-foreground font-medium">
                  {criterion.title}
                </h4>
                <p className="text-white/50 leading-relaxed text-sm">
                  {criterion.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <Link
          href="/parliamo?oggetto=co-investimento"
          className="self-start rounded-[5px] border border-white/40 px-5 py-2.5 text-foreground font-medium hover:bg-foreground hover:text-black transition-all duration-300"
        >
          Presenta un progetto per co-investimento →
        </Link>
      </div>
    </section>
  );
}
