"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Il "\n" e' un a capo del design, non una preferenza: nel Figma (nodo 461:97)
   la prima slide e' spezzata in tre paragrafi, e le righe misurano 812 e 746px
   invece di riempire i 900 disponibili. */
/* Le tre slide dicevano due volte la stessa cosa (la 1 e la 2 aprivano
   entrambe con "inizia dal cosa, noi dal perche'") e la terza ripeteva parola
   per parola due dei quattro Principi. Ora una slide, un'idea: la promessa,
   come si lavora, cosa resta. */
const SLIDES = [
  "La maggior parte delle agenzie parte\ndal cosa. Noi partiamo dal perché.\nPerché è lì che si decide se un progetto vale i soldi che costa.",
  "Prima di firmare passiamo del tempo a capire il problema. Quasi sempre quello che serve davvero è diverso da quello che era scritto nella richiesta iniziale.",
  "Lavoriamo dentro l'azienda, agli stessi obiettivi delle persone che ci stanno. E quando usciamo, quello che abbiamo costruito resta in mano loro.",
];

const TOTAL = SLIDES.length;

export default function AboutUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Normalize scroll for consistent touch behavior
      ScrollTrigger.normalizeScroll(true);

      const progressBar = section.querySelector<HTMLElement>(
        ".about-progress-fill",
      );
      const counterCurrent = section.querySelector<HTMLElement>(
        ".about-counter-current",
      );

      // Total scroll distance: each slide gets 100vh of scroll
      const scrollPerSlide = window.innerHeight;
      const totalScroll = scrollPerSlide * TOTAL;

      // Pin the entire section
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          const progress = self.progress; // 0 → 1
          const currentSlideIndex = Math.min(
            Math.floor(progress * TOTAL),
            TOTAL - 1,
          );

          // Update counter
          setActiveSlide(currentSlideIndex);
          if (counterCurrent) {
            counterCurrent.textContent = String(currentSlideIndex + 1).padStart(
              2,
              "0",
            );
          }

          // Update global progress bar
          if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
          }

          // Update text reveal for each slide
          SLIDES.forEach((_, si) => {
            const slideEl = section.querySelector<HTMLElement>(
              `.about-slide-${si}`,
            );
            if (!slideEl) return;

            const words = slideEl.querySelectorAll<HTMLElement>(".about-word");

            // Progress within this slide (0 → 1)
            const slideStart = si / TOTAL;
            const slideEnd = (si + 1) / TOTAL;
            const slideProgress = Math.max(
              0,
              Math.min(1, (progress - slideStart) / (slideEnd - slideStart)),
            );

            // Show/hide this slide
            if (currentSlideIndex === si) {
              slideEl.style.opacity = "1";
              slideEl.style.visibility = "visible";
            } else {
              slideEl.style.opacity = "0";
              slideEl.style.visibility = "hidden";
            }

            // Reveal characters smoothly based on progress within this slide
            // We compute a total char count and map progress to a character position
            const allChars =
              slideEl.querySelectorAll<HTMLElement>(".about-char");
            const totalChars = allChars.length;

            allChars.forEach((char, ci) => {
              const charProgress = ci / totalChars;
              if (slideProgress > charProgress) {
                char.style.color = "var(--color-black)";
              } else {
                char.style.color = "var(--color-grey)";
              }
            });
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-screen bg-white overflow-hidden touch-pan-y"
      aria-label="Chi siamo"
    >
      {/* Content */}
      <div id="about-inner" className="container-content h-full flex flex-col justify-center">
        {/* Progress line – grey track with black fill */}
        <div className="relative w-full h-[1px] mb-8 md:mb-16">
          <div className="absolute inset-0 bg-grey" />
          <div
            className="about-progress-fill absolute top-0 left-0 h-full bg-black transition-[width] duration-100 ease-linear"
            style={{ width: "0%" }}
          />
        </div>

        {/* Mobile/Tablet: stacked — Desktop: side by side */}
        {/* Nel design il testo parte a x=500 su un artboard di 1440: dentro il
            container (40px di margine) sono 460 + 900 su 1360. In frazioni e
            non in pixel, perche' il sito e' full-width e le due colonne devono
            crescere insieme; 46fr/90fr evita l'arrotondamento di una
            percentuale. */}
        <div
          id="about-block"
          className="w-full flex flex-col md:grid md:grid-cols-[46fr_90fr] md:items-start"
        >
          {/* Counter with border */}
          <div className="shrink-0 mb-6 md:mb-0">
            <span
              className="inline-flex items-center border border-black text-black"
              style={{
                borderRadius: "5px", padding: "5px 10px", fontSize: "14px", lineHeight: "20px",
              }}
            >
              <span className="about-counter-current">01</span>
              <span className="mx-1">/</span>
              {String(TOTAL).padStart(2, "0")}
            </span>
          </div>

          {/* Text reveal area */}
          <div className="relative">
            {SLIDES.map((text, si) => (
              <div
                key={si}
                className={`about-slide-${si} ${si === 0 ? "" : "absolute inset-0"}`}
                style={{
                  opacity: si === 0 ? 1 : 0,
                  visibility: si === 0 ? "visible" : "hidden",
                  transition: "opacity 0.4s ease, visibility 0.4s ease",
                }}
              >
                {/* Design (nodo 461:97): BDO Grotesk Regular 48px / 54px.
                    Era font-medium con leading 1.2: piu' bold e piu' arioso
                    del design, e il testo andava a capo prima. Lo spazio tra
                    parole e' un nodo di testo, non un mr-[0.3em] inventato. */}
                <h2 className="text-h2 font-normal leading-[54px]">
                  {text.split("\n").map((riga, ri) => (
                  <span key={ri} className="block">
                  {riga.split(" ").map((word, wi) => (
                    <span key={wi}>
                      {wi > 0 ? " " : null}
                      <span className="about-word inline-block">
                      {word.split("").map((char, ci) => (
                        <span
                          key={ci}
                          className="about-char inline-block transition-colors duration-300 ease-out"
                          style={{ color: "var(--color-grey)" }}
                        >
                          {char}
                        </span>
                      ))}
                      </span>
                    </span>
                  ))}
                  </span>
                  ))}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
