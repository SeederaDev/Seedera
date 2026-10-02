"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Progetto } from "@/lib/contenuti";
import { categorie } from "@/lib/progetti";
import GrigliaProgetti, { CursoreProgetti } from "@/components/portfolio/GrigliaProgetti";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
const INTRO_TITLE = "Non un catalogo di lavori. Una raccolta di problemi risolti.";

const INTRO_BODY =
  "Ogni progetto qui dentro è cominciato con una domanda scomoda: qual è davvero il problema? Le risposte hanno preso forme molto diverse — una piattaforma, un'identità, un sistema di gestione, la comunicazione di un festival — perché la forma la decide il problema, non il nostro listino.";

const INTRO_CLOSING =
  "Quello che non vedi, guardando le immagini, è la parte che conta di più: il momento in cui il team del cliente ha smesso di avere bisogno di noi.";

/* ── Portfolio Page ── */
export default function PaginaPortfolio({ progetti }: { progetti: Progetto[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("Tutti");

  const CATEGORIES = categorie(progetti);
  const filteredProjects =
    activeFilter === "Tutti"
      ? progetti
      : progetti.filter((p) => p.categoria === activeFilter);

  /* GSAP animations */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

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
    { scope: sectionRef, dependencies: [filteredProjects] },
  );

  /* Re-trigger ScrollTrigger on filter change */
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [filteredProjects]);

  return (
    <>
      <Navbar />
      <main ref={sectionRef}>
        <CursoreProgetti />

        {/* ── Hero ── */}
        <section
          className="relative w-full flex items-end"
          style={{
            height: "350px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-10">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              Portfolio
            </h1>
          </div>
        </section>

        {/* ── Intro ── */}
        <section className="bg-white" style={{ paddingTop: "90px" }}>
          <div className="container-content">
            <div className="flex flex-col gap-8 md:flex-row md:gap-16">
              <h2
                className="text-black font-normal uppercase leading-[1.05] md:w-[46%] shrink-0"
                style={{ fontSize: "var(--font-h3)" }}
              >
                {INTRO_TITLE}
              </h2>
              <div className="flex flex-col gap-5 max-w-[62ch]">
                <p className="text-black/70 text-lg leading-relaxed">
                  {INTRO_BODY}
                </p>
                <p className="text-black/50 leading-relaxed border-l-2 border-black/20 pl-5">
                  {INTRO_CLOSING}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Filters ── */}
        <section className="bg-white" style={{ paddingTop: "90px" }}>
          <div className="container-content">
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className="uppercase tracking-wide font-medium transition-all duration-300"
                  style={{
                    fontSize: "var(--font-btn)",
                    padding: "8px 18px",
                    borderRadius: "7px",
                    border: "1px solid var(--color-black)",
                    backgroundColor:
                      activeFilter === cat
                        ? "var(--color-black)"
                        : "transparent",
                    color:
                      activeFilter === cat
                        ? "var(--color-white)"
                        : "var(--color-black)",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Projects Grid ── */}
        <section className="bg-white" style={{ paddingTop: "50px" }}>
          <div ref={gridRef} className="container-content pb-24 md:pb-40">
            <GrigliaProgetti key={activeFilter} progetti={filteredProjects} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
