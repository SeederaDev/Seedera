"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Progetto } from "@/lib/contenuti";
import { categorie } from "@/lib/progetti";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
const INTRO_TITLE = "Non un catalogo di lavori. Una raccolta di problemi risolti.";

const INTRO_BODY =
  "Ogni progetto qui dentro è cominciato con una domanda scomoda: qual è davvero il problema? Le risposte hanno preso forme molto diverse — una piattaforma, un'identità, un sistema di gestione, la comunicazione di un festival — perché la forma la decide il problema, non il nostro listino.";

const INTRO_CLOSING =
  "Quello che non vedi, guardando le immagini, è la parte che conta di più: il momento in cui il team del cliente ha smesso di avere bisogno di noi.";

/* ── Rolling text effect on hover ── */
function RollingText({ text }: { text: string }) {
  const letters = text.split("");

  return (
    <span className="rolling-text-wrap cursor-pointer font-medium">
      <span className="rolling-text-row" aria-hidden="true">
        {letters.map((char, i) => (
          <span
            key={i}
            className="rolling-text-char"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === " " ? "\u00A0" : char}
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
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}

/* ── Custom cursor component ── */
function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { opacity: 0, scale: 0.5, xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isVisible.current) {
        gsap.to(cursor, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const onShow = () => {
      isVisible.current = true;
      gsap.set(cursor, {
        left: mousePos.current.x,
        top: mousePos.current.y,
        scale: 0,
        opacity: 0,
      });
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.4)",
        overwrite: true,
      });
    };

    const onHide = () => {
      isVisible.current = false;
      gsap.to(cursor, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("project-cursor-show", onShow);
    window.addEventListener("project-cursor-hide", onHide);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("project-cursor-show", onShow);
      window.removeEventListener("project-cursor-hide", onHide);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50"
      style={{ top: 0, left: 0, opacity: 0 }}
    >
      <div
        className="flex items-center justify-center rounded-full text-black font-bold text-center leading-tight uppercase"
        style={{
          width: "125px",
          height: "125px",
          fontSize: "14px",
          backgroundColor: "#CDFD51",
        }}
      >
        Scopri
        <br />
        di più
      </div>
    </div>
  );
}

/* ── Single project card ── */
function ProjectCard({ project, index }: { project: Progetto; index: number }) {
  const cardRef = useRef<HTMLElement>(null);

  const handleImageEnter = () => {
    window.dispatchEvent(new CustomEvent("project-cursor-show"));
  };

  const handleImageLeave = () => {
    window.dispatchEvent(new CustomEvent("project-cursor-hide"));
  };

  return (
    <Link href={`/portfolio/${project.slug}`} className="block">
      <article ref={cardRef} className="project-card">
        <div
          className="relative overflow-hidden rounded-[10px] cursor-none group [transform:translateZ(0)]"
          style={{ aspectRatio: "4 / 3" }}
          onMouseEnter={handleImageEnter}
          onMouseLeave={handleImageLeave}
        >
          <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out scale-[1.1] group-hover:scale-100 will-change-transform">
            <img
              src={project.copertina}
              alt={project.cliente}
              className="project-img absolute inset-[-10%] w-[120%] h-[120%] object-cover max-w-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-[15px] flex flex-wrap gap-x-2">
          {project.tag.map((tag, i) => (
            <span
              key={i}
              className="uppercase tracking-wide"
              style={{
                fontSize: "var(--font-p)",
                color: "var(--color-middle-grey)",
              }}
            >
              {tag}
              {i < project.tag.length - 1 && (
                <span
                  className="ml-2"
                  style={{ color: "var(--color-middle-grey)" }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>

        {/* Client name with rolling text */}
        <h3
          className="uppercase tracking-wide"
          style={{ fontSize: "var(--font-h4)", color: "var(--color-black)" }}
        >
          <RollingText text={project.cliente} />
        </h3>
      </article>
    </Link>
  );
}

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

      // Parallax on project images
      const images = section.querySelectorAll<HTMLElement>(".project-img");
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

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
        <CustomCursor />

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
            <div className="hidden md:grid grid-cols-2 gap-x-[25px]">
              {/* Left column */}
              <div className="flex flex-col" style={{ gap: "60px" }}>
                {filteredProjects
                  .filter((_, i) => i % 2 === 0)
                  .map((project, i) => (
                    <ProjectCard
                      key={`${activeFilter}-L-${i}`}
                      project={project}
                      index={i * 2}
                    />
                  ))}
              </div>
              {/* Right column – offset top */}
              <div
                className="flex flex-col"
                style={{ paddingTop: "200px", gap: "60px" }}
              >
                {filteredProjects
                  .filter((_, i) => i % 2 === 1)
                  .map((project, i) => (
                    <ProjectCard
                      key={`${activeFilter}-R-${i}`}
                      project={project}
                      index={i * 2 + 1}
                    />
                  ))}
              </div>
            </div>
            {/* Mobile: single column */}
            <div className="flex flex-col md:hidden" style={{ gap: "60px" }}>
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={`${activeFilter}-${i}`}
                  project={project}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
