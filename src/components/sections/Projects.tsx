"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Progetto } from "@/lib/contenuti";
import GrigliaProgetti, { CursoreProgetti } from "@/components/portfolio/GrigliaProgetti";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
/* In home va una selezione, non il catalogo: quello sta in /portfolio.
   L'elenco e' per slug e in ordine di apparizione, cosi' si cambia la
   vetrina senza toccare l'ordine del portfolio.
   quinte-parallele non e' ancora fra i progetti: appena la scheda esiste
   entra da sola al suo posto, qui non c'e' altro da fare. */
const IN_HOME = [
  "zentro",
  "suoni-oltre-confine",
  "replase",
  "quinte-parallele",
  "il-trust-in-italia",
  "piano-city-napoli",
  "brassicolo",
];

/* Sei: due file piene sulle tre colonne. Quando quinte-parallele entra, scala
   fuori l'ultimo dell'elenco, non si rompe la fila. */
const QUANTI_IN_HOME = 6;

/** La vetrina: gli slug scelti, nell'ordine scelto, saltando quelli che in
 *  banca dati non ci sono (ancora). */
const vetrina = (progetti: Progetto[]) =>
  IN_HOME.map((slug) => progetti.find((p) => p.slug === slug))
    .filter((p) => p !== undefined)
    .slice(0, QUANTI_IN_HOME);

const INTRO_TEXT =
  "Di ogni progetto qui sotto si vede il risultato. La parte che conta però viene prima: il problema che c'era, e come ci siamo accorti di qual era davvero.";

/* ── Main Projects section ── */
export default function Projects({ progetti }: { progetti: Progetto[] }) {
  const HOMEPAGE_PROJECTS = vetrina(progetti);
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Character-by-character text reveal on scroll into view
      const chars = section.querySelectorAll<HTMLElement>(
        ".project-intro-char",
      );
      if (chars.length > 0) {
        const introContainer = section.querySelector(".project-intro-text");
        ScrollTrigger.create({
          trigger: introContainer,
          start: "top 80%",
          end: "top 20%",
          scrub: 0.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const totalChars = chars.length;
            chars.forEach((char, ci) => {
              const charProgress = ci / totalChars;
              if (progress > charProgress) {
                char.style.color = "var(--color-black)";
              } else {
                char.style.color = "var(--color-grey)";
              }
            });
          },
        });
      }

      // Staggered card reveal
      const cards = section.querySelectorAll<HTMLElement>(".project-card");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-white z-10"
      aria-label="Portfolio"
    >
      <CursoreProgetti />

      {/* Intro area */}
      {/* pt ridotto da mobile: sopra chiude la fascia gialla scorrevole e i 96px
          pieni la staccavano troppo dal portfolio. */}
      <div className="container-content pt-14 md:pt-40 pb-16 md:pb-24">
        {/* 464 + 896 su 1360, come studio e partnership: nel design il testo
            parte a x=504 dell'artboard. Con lo spacer al 20% partiva a 389, e
            la colonna piu' larga mandava a capo in punti diversi. */}
        <div className="flex flex-col md:grid md:grid-cols-[464fr_896fr] md:items-start">
          {/* Label pill */}
          <div className="shrink-0 mb-6 md:mb-0">
            <span
              /* Nel design e' "Portfolio", non "PORTFOLIO": 55,04px di
                 larghezza contro i 79 della versione maiuscola. */
              className="inline-flex items-center border border-black text-black"
              style={{
                borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              Portfolio
            </span>
          </div>

          {/* Text reveal */}
          <div className="project-intro-text">
            {/* Regular 48/54 come ogni altro titolo di sezione: era medium con
                interlinea 1.2 (57,6px) contro i 54 del design, e il margine
                finto mr-[0.3em] valeva 14,4px al posto dello spazio vero.
                Il tracking recupera il kerning che gli inline-block azzerano. */}
            <h2 className="text-h2 font-normal leading-[54px] tracking-[-0.002em]">
              {INTRO_TEXT.split(" ").map((word, wi) => (
                /* Lo spazio sta FUORI dall'inline-block: dentro non offrirebbe
                   un punto di a capo e il titolo resterebbe una riga sola. */
                <span key={wi}>
                  {wi > 0 ? " " : null}
                  <span className="inline-block">
                  {word.split("").map((char, ci) => (
                    <span
                      key={ci}
                      className="project-intro-char inline-block transition-colors duration-300 ease-out"
                      style={{ color: "var(--color-grey)" }}
                    >
                      {char}
                    </span>
                  ))}
                  </span>
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>

      {/* Progetti – tre colonne a gradini */}
      <div className="container-content pb-24 md:pb-40">
        <GrigliaProgetti progetti={HOMEPAGE_PROJECTS} />

        {progetti.length > HOMEPAGE_PROJECTS.length ? (
          <div className="mt-12 md:mt-16 flex justify-center">
            <Link
              href="/portfolio"
              /* Stessa pillola del resto del sito: bordo nero, riempimento
                 al passaggio. L'after invisibile porta il tocco a 45px. */
              className="relative inline-flex items-center gap-3 rounded-[5px] border border-black text-black hover:bg-black hover:text-primary transition-all duration-300 after:absolute after:-inset-y-[5px] after:inset-x-0 after:content-['']"
              style={{ padding: "8px 18px", fontSize: "15px" }}
            >
              Tutti i progetti
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path
                  d="M4 10h12M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
