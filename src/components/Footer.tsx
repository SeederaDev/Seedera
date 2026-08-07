"use client";

import Link from "next/link";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { useCallback, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FOOTER_LINKS = [
  { label: "Metodo", href: "/#about" },
  { label: "Capacità", href: "/#services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Studio", href: "/#studio" },
  { label: "Partnership", href: "/#partnership" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/seedera" },
];

/* ── Glitch pill: text scrambles on hover ── */
function GlitchPill({ text }: { text: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";

  const handleEnter = () => {
    if (tweenRef.current) tweenRef.current.kill();
    const obj = { progress: 0 };
    tweenRef.current = gsap.to(obj, {
      progress: 1,
      duration: 0.4,
      ease: "none",
      onUpdate: () => {
        const p = obj.progress;
        const resolved = Math.floor(p * text.length);
        setDisplay(
          text
            .split("")
            .map((ch, i) =>
              i < resolved
                ? ch
                : chars[Math.floor(Math.random() * chars.length)],
            )
            .join(""),
        );
      },
      onComplete: () => setDisplay(text),
    });
  };

  return (
    <span
      ref={spanRef}
      onMouseEnter={handleEnter}
      className="inline-flex items-center self-start border border-black text-black font-medium uppercase cursor-default"
      style={{
        borderRadius: "7px",
        padding: "5px 14px",
        fontSize: "15px",
      }}
    >
      {display}
    </span>
  );
}

/* ── Wave email: letters ripple on hover ── */
function WaveEmail({ email }: { email: string }) {
  const containerRef = useRef<HTMLAnchorElement>(null);

  const handleEnter = () => {
    const chars =
      containerRef.current?.querySelectorAll<HTMLElement>(".wave-char");
    if (!chars) return;
    chars.forEach((ch, i) => {
      gsap.killTweensOf(ch);
      gsap.to(ch, {
        y: -6,
        duration: 0.2,
        delay: i * 0.03,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.set(ch, { y: 0 });
        },
      });
    });
  };

  const handleLeave = () => {
    const chars =
      containerRef.current?.querySelectorAll<HTMLElement>(".wave-char");
    if (!chars) return;
    chars.forEach((ch) => {
      gsap.killTweensOf(ch);
      gsap.to(ch, { y: 0, duration: 0.2, ease: "power2.out" });
    });
  };

  return (
    <a
      ref={containerRef}
      href={`mailto:${email}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group inline-flex items-center gap-3 mt-4 text-black/60 hover:text-black transition-colors duration-300"
      style={{ fontSize: "clamp(1.125rem, 2vw, 1.5rem)" }}
    >
      <span className="border-b border-current pb-0.5">
        {email.split("").map((ch, i) => (
          <span
            key={i}
            className="wave-char inline-block"
            style={{ willChange: "transform" }}
          >
            {ch}
          </span>
        ))}
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
      >
        <path
          d="M5 15L15 5M15 5H6M15 5v9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

export default function Footer() {
  const lenis = useLenis();
  const footerRef = useRef<HTMLElement>(null);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      /* I link di pagina (/team, /portfolio…) devono navigare normalmente:
         solo le ancore vengono intercettate per lo scroll morbido. Accetta
         sia "#studio" sia "/#studio", così lo stesso elenco funziona quando
         il footer è montato su una pagina interna. */
      if (!href.includes("#")) return;
      const hash = `#${href.split("#")[1]}`;

      const target = document.querySelector(hash);
      /* Se la sezione non è in questa pagina (footer mostrato su /team,
         /portfolio…) lasciamo che il browser vada alla home con l'hash. */
      if (!target) return;

      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, {
          duration: 1.4,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
      }
    },
    [lenis],
  );

  // Char-by-char reveal animation triggered on scroll
  useGSAP(
    () => {
      const footer = footerRef.current;
      if (!footer) return;

      const chars = footer.querySelectorAll<HTMLElement>(".footer-char");
      if (chars.length === 0) return;

      gsap.set(chars, { opacity: 0, y: 20 });

      ScrollTrigger.create({
        trigger: footer,
        start: "top 50%",
        once: true,
        onEnter: () => {
          gsap.to(chars, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.02,
          });
        },
      });
    },
    { scope: footerRef },
  );

  // Split text into chars with spans, preserving line breaks
  const renderAnimatedText = (
    lines: { text: string; className?: string }[],
  ) => {
    let charIndex = 0;
    return lines.map((line, li) => (
      <span key={li} className="block">
        {line.text.split("").map((char) => {
          const idx = charIndex++;
          return (
            <span
              key={idx}
              className={`footer-char inline-block ${line.className || ""}`}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </span>
    ));
  };

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative bg-primary text-black z-10"
      aria-label="Footer"
    >
      {/* Qui c'era un secondo blocco "Hai un problema da risolvere / o un
          prodotto da costruire?" a corpo gigante (clamp fino a 7rem): una
          riproposizione della sezione Contatti, che nel Figma non esiste e che
          rompeva anche le andate a capo. Rimosso: il CTA vive in Contatti. */}
      {/* ── Separator ── */}
      <div className="container-content">
        <div className="h-[1px] bg-black/15" />
      </div>

      {/* ── Middle: Nav + Social row ── */}
      <div className="container-content py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          {/* Navigation */}
          <div>
            <span className="text-black/40 text-sm uppercase tracking-[0.2em] block mb-5">
              Navigazione
            </span>
            <nav className="flex flex-wrap gap-3">
              {FOOTER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-black rounded-[5px] border border-black/30 hover:bg-black hover:text-primary transition-all duration-300"
                  style={{
                    padding: "5px 14px",
                    fontSize: "15px",
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <span className="text-black/40 text-sm uppercase tracking-[0.2em] block mb-5">
              Social
            </span>
            <nav className="flex flex-wrap gap-3">
              {SOCIALS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black rounded-[5px] border border-black/30 hover:bg-black hover:text-primary transition-all duration-300"
                  style={{
                    padding: "5px 14px",
                    fontSize: "15px",
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* ── Separator ── */}
      <div className="container-content">
        <div className="h-[1px] bg-black/15" />
      </div>

      {/* ── Bottom bar ── */}
      <div className="container-content py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Image src="/Seedera-Logo.svg" alt="Seedera" width={120} height={28} />
          <span className="text-black/60 text-sm">
            Product & Service Company. Execution Partner Cognitivo. Roma, Italia.
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <p className="text-black/40 text-sm max-w-[60ch] italic">
            dal latino <em>sidera</em>, stelle e dall&apos;inglese <em>seed</em>,
            seme — ogni impresa che guarda in alto inizia da un seme
          </p>
          <span className="text-black/40 text-sm whitespace-nowrap">
            © {new Date().getFullYear()} Seedera — Tutti i diritti riservati
          </span>
        </div>
      </div>
    </footer>
  );
}
