"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS } from "@/app/portfolio/[slug]/projectsData";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
interface Project {
  client: string;
  tags: string[];
  image: string;
  slug: string;
}

const HOMEPAGE_PROJECTS: Project[] = PROJECTS.map((p) => ({
  client: p.client,
  tags: p.tags,
  image: p.thumbnail,
  slug: p.slug,
}));

const INTRO_TEXT =
  "Ogni progetto qui sotto è nato da una diagnosi, non da un brief. Quello che vedi è il risultato: quello che conta è il problema che c'era prima.";

/* ── Rolling text effect on hover (CSS translateY approach) ── */
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

    // Start hidden
    gsap.set(cursor, { opacity: 0, scale: 0.5, xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Only move smoothly while visible; otherwise let gsap.set in onShow handle position
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
      // Snap position instantly, start from scale 0, then grow
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
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLElement>(null);

  const handleImageEnter = () => {
    window.dispatchEvent(new CustomEvent("project-cursor-show"));
  };

  const handleImageLeave = () => {
    window.dispatchEvent(new CustomEvent("project-cursor-hide"));
  };

  return (
    <Link href={`/portfolio/${project.slug}`} className="block">
      <article
        ref={cardRef}
        className={`project-card ${index % 2 === 1 ? "md:mt-16 lg:mt-24" : ""}`}
      >
        {/* Image wrapper with overflow hidden for parallax + zoom */}
        <div
          className="relative overflow-hidden rounded-[10px] cursor-none group [transform:translateZ(0)]"
          style={{ aspectRatio: "4 / 3" }}
          onMouseEnter={handleImageEnter}
          onMouseLeave={handleImageLeave}
        >
          <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out scale-[1.1] group-hover:scale-100 will-change-transform">
            <img
              src={project.image}
              alt={project.client}
              className="project-img absolute inset-[-10%] w-[120%] h-[120%] object-cover max-w-none"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="mt-[15px] flex flex-wrap gap-x-2">
          {project.tags.map((tag, i) => (
            <span
              key={i}
              className="uppercase tracking-wide"
              style={{
                fontSize: "var(--font-p)",
                color: "var(--color-middle-grey)",
              }}
            >
              {tag}
              {i < project.tags.length - 1 && (
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

        {/* Client name with rolling text effect */}
        <h3
          className="uppercase tracking-wide"
          style={{ fontSize: "var(--font-h4)", color: "var(--color-black)" }}
        >
          <RollingText text={project.client} />
        </h3>
      </article>
    </Link>
  );
}

/* ── Main Projects section ── */
export default function Projects() {
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
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      className="relative bg-white z-10"
      aria-label="Portfolio"
    >
      <CustomCursor />

      {/* Intro area */}
      <div className="container-content pt-24 md:pt-40 pb-16 md:pb-24">
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
          <div className="project-intro-text md:max-w-[888px]">
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

      {/* Projects grid – staggered 2 columns */}
      <div className="container-content pb-24 md:pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[25px] ">
          {HOMEPAGE_PROJECTS.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
