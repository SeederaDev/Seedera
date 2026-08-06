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

function HeroLine({ text }: { text: string }) {
  return (
    // Overflow-hidden wrapper clips the line during slide-up — no FOUC
    <span className="block overflow-hidden">
      <span
        className="hero-line block"
        style={{ transform: "translateY(100%)", willChange: "transform" }}
      >
        {text.split("").map((char, i) => (
          <span key={i} className="hero-char inline-block">
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
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
        )
        .from(
          subRef.current,
          {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative w-full flex flex-col justify-end overflow-hidden bg-primary"
      style={{ height: "100svh", minHeight: "100dvh" }}
      aria-label="Hero"
    >
      {/* Bottom-anchored content */}
      <div className="container-content relative z-10 pb-16 md:pb-20">
        <span
          ref={eyebrowRef}
          className="inline-flex items-center self-start border border-black text-black font-medium tracking-wide uppercase mb-6"
          style={{ borderRadius: "7px", padding: "5px 14px", fontSize: "15px" }}
        >
          Product &amp; Service Company — Execution Partner Cognitivo
        </span>
        <h1
          ref={headlineRef}
          className="text-h1 text-black font-normal uppercase select-none cursor-default"
        >
          <HeroLine text="RENDIAMO LE IMPRESE" />
          <HeroLine text="CAPACI DI FARE COSE CHE" />
          <HeroLine text="PRIMA NON SAPEVANO FARE" />
        </h1>
        <div ref={copyRef} className="mt-8 flex flex-col items-start gap-6">
          <p className="max-w-[62ch] text-black/70 text-lg leading-relaxed">
            Non eseguiamo brief. Prima identifichiamo il problema vero, poi
            costruiamo il sistema che lo risolve. Con il coraggio di dirti quando
            stai chiedendo la cosa sbagliata, e di entrare nel rischio quando il
            progetto lo merita.
          </p>
          <Link
            href="/parliamo"
            className="inline-flex items-center gap-2 rounded-[5px] border border-black px-5 py-2.5 text-black font-medium hover:bg-black hover:text-primary transition-all duration-300"
          >
            Apri una conversazione →
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={subRef}
        className="absolute bottom-4 left-0 w-full container-content flex flex-col items-start gap-2"
      >
        <div className="w-10 h-10 rounded-full border-1 border-black flex items-center justify-center animate-bounce">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 1v10M7 11l4-4M7 11L3 7"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
