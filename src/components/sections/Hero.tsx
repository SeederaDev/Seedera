"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Magnetic scatter: letters react to mouse proximity ── */
function useHeroMagnetic(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: React.RefObject<boolean>,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chars = container.querySelectorAll<HTMLElement>(".hero-char");
    if (chars.length === 0) return;

    // Cache rects once; refresh on resize to avoid per-frame getBoundingClientRect
    let cachedRects: { cx: number; cy: number }[] = [];
    const cacheRects = () => {
      cachedRects = Array.from(chars).map((char) => {
        const r = char.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };

    let rafId = 0;
    let lastX = 0;
    let lastY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!enabled.current) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const maxDist = 150;
        chars.forEach((char, i) => {
          const { cx, cy } = cachedRects[i] || { cx: 0, cy: 0 };
          const dx = lastX - cx;
          const dy = lastY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 8;
            gsap.to(char, {
              x: (-dx / dist) * force,
              y: (-dy / dist) * force,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(char, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.5)",
              overwrite: "auto",
            });
          }
        });
      });
    };

    const handleMouseLeave = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      chars.forEach((char) => {
        gsap.to(char, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.4)",
          overwrite: "auto",
        });
      });
    };

    // Refresh cache after page load and on resize
    window.addEventListener("resize", cacheRects, { passive: true });
    // Initial cache after a short delay so layout is stable
    const t = setTimeout(cacheRects, 200);

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t);
      window.removeEventListener("resize", cacheRects);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [containerRef, enabled]);
}

function HeroLine({ text, tracking }: { text: string; tracking: string }) {
  return (
    // Overflow-hidden wrapper clips the line during slide-up — no FOUC
    <span className="block overflow-hidden">
      <span
        className="hero-line block whitespace-nowrap"
        style={{
          transform: "translateY(100%)",
          willChange: "transform",
          letterSpacing: tracking,
        }}
      >
        {/* Lo spazio resta un nodo di testo: dentro uno span inline-block
            diventerebbe un &nbsp;. */}
        {text.split("").map((char, i) =>
          char === " " ? " " : (
            <span key={i} className="hero-char inline-block">
              {char}
            </span>
          ),
        )}
      </span>
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const magneticEnabled = useRef(false);

  useHeroMagnetic(headlineRef, magneticEnabled);

  useGSAP(
    () => {
      const lines =
        headlineRef.current?.querySelectorAll<HTMLElement>(".hero-line");
      if (!lines) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(eyebrowRef.current, {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      }).to(lines, {
        y: "0%",
        duration: 1.2,
        stagger: 0.1,
        onComplete: () => {
          // Enable magnetic effect only after text is fully revealed
          magneticEnabled.current = true;
        },
      })
        .from(
          copyRef.current,
          {
            y: 24,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.6",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full flex flex-col justify-end overflow-hidden bg-primary"
      style={{ height: "min(100svh, 55.6vw)", minHeight: "600px" }}
      aria-label="Hero"
    >
      {/* Bottom-anchored content */}
      <div className="container-content relative z-10 pb-16 md:pb-[66px]">
        <div id="hero-block" className="md:max-w-[1002px] flex flex-col items-start gap-5">
        <span
          ref={eyebrowRef}
          /* Nel design (nodo 461:202) il badge non e' maiuscolo — largo 208px,
             non 255 — e il frame e' alto 30px con il bordo disegnato dentro:
             in CSS il bordo si somma, quindi il padding verticale e' 4, non 5. */
          className="inline-flex items-center self-start border border-black text-black"
          style={{ borderRadius: "5px", padding: "4px 10px", fontSize: "14px", lineHeight: "20px" }}
        >
          Product &amp; Service Company
        </span>
        <h1
          ref={headlineRef}
          /* Ogni carattere e' un inline-block (serve all'effetto magnetico) e
             questo azzera il kerning: le righe crescono e la terza sfora i
             1002px del design, mandando a capo la "E" finale. Il compenso e'
             per riga, sotto. */
          className="text-black font-normal uppercase select-none cursor-default"
          style={{
            fontSize: "clamp(2.375rem, 4.72vw, 4.25rem)",
            lineHeight: "1.03",
            /* Figma ritaglia il mezzo-leading sotto l'ultima riga: il box del
               titolo e' 194,88px invece dei 3x70=210 del blocco CSS. Senza
               questo recupero il paragrafo e la freccia scendono di 16px. */
            marginBottom: "-16px",
          }}
        >
          {/* Il tracking non e' un vezzo: ogni riga perde un kerning diverso
              (dipende dalle coppie di lettere) e senza compenso la terza sfora
              i 1002px. I valori riportano le larghezze a quelle misurate sul
              PDF del design: 795 / 906 / 989 px. */}
          <HeroLine text="RENDIAMO LE IMPRESE" tracking="-0.005em" />
          <HeroLine text="CAPACI DI FARE COSE CHE" tracking="-0.010em" />
          <HeroLine text="PRIMA NON SAPEVANO FARE" tracking="-0.013em" />
        </h1>
        <div ref={copyRef} className="flex flex-col items-start gap-5">
          <p className="text-black text-[16px] leading-[22px] max-w-[888px]">
            Non eseguiamo brief. Prima identifichiamo il problema vero, poi
            costruiamo il sistema che lo risolve. Con il coraggio di dirti quando
            stai chiedendo la cosa sbagliata, e di entrare nel rischio quando il
            progetto lo merita.
          </p>
          {/* A riposo la CTA e' la sola freccia, come nel design: la parola
              compare al passaggio del mouse. */}
          <Link
            href="/parliamo"
            aria-label="Parliamo, apri una conversazione"
            className="group inline-flex items-center text-black"
          >
            <svg
              width="35"
              height="33"
              viewBox="0 0 35 33"
              fill="none"
              aria-hidden="true"
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-2"
            >
              <path
                d="M1 16.5h32M21 4l12 12.5L21 29"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* Il trucco della colonna 0fr→1fr invece di max-width: anima
                verso la larghezza VERA del testo, quindi non serve indovinare
                un valore e la parola non "rimbalza" a fine transizione.
                A riposo la colonna e' larga zero: il layout del design resta
                quello, la freccia non si sposta. */}
            <span
              aria-hidden="true"
              className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr] motion-reduce:transition-none"
            >
              <span className="overflow-hidden">
                <span className="block whitespace-nowrap pl-[18px] text-[16px] leading-[22px] opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100 motion-reduce:transition-none">
                  Parliamo
                </span>
              </span>
            </span>
          </Link>
          </div>
        </div>
      </div>

      {/* Nel design l'hero ha UNA sola freccia, quella della CTA qui sopra.
          Lo scroll indicator che stava qui era un residuo della versione
          precedente e ne mostrava due. */}
    </section>
  );
}
