"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Prodotto {
  tipologia: string;
  nome: string;
  image?: string;
  href?: string;
  accent: string;
}

const PRODOTTI: Prodotto[] = [
  {
    tipologia: "CRM",
    nome: "ZENTRO",
    image: "/images/our-brand/zentro.png",
    href: "https://zentro.it",
    accent: "var(--color-green)",
  },
  {
    tipologia: "IMPATTO AMBIENTALE",
    nome: "REPLASE",
    href: "https://replase.com",
    accent: "var(--color-cyan)",
  },
];

const INTRO =
  "Costruiamo anche per noi stessi, nessuno di questi lavori è finito quando è stato consegnato. È finito quando il team interno ha saputo portarlo avanti da solo.";

/* Pill che segue il cursore sopra il carosello: nel design e' un cerchio
   giallo con la scritta < DRAG >. */
function DragPill({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const move = (e: MouseEvent) =>
      gsap.to(el, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.18,
        ease: "power2.out",
        overwrite: "auto",
      });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-50 hidden md:flex items-center justify-center rounded-full bg-primary text-black font-medium transition-opacity duration-300"
      style={{
        width: 96,
        height: 96,
        transform: "translate(-50%, -50%)",
        opacity: visible ? 1 : 0,
        fontSize: "var(--font-btn)",
      }}
    >
      &lt; DRAG &gt;
    </div>
  );
}

export default function StartupStudio() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const drag = useRef({ startX: 0, scrollLeft: 0 });

  useGSAP(
    () => {
      const chars = gsap.utils.toArray<HTMLElement>(".studio-char");
      if (!chars.length) return;
      ScrollTrigger.create({
        trigger: ".studio-intro",
        start: "top 80%",
        end: "top 25%",
        scrub: 0.5,
        onUpdate: (self) => {
          chars.forEach((c, i) => {
            c.style.color =
              self.progress > i / chars.length
                ? "var(--color-black)"
                : "var(--color-grey)";
          });
        },
      });
    },
    { scope: sectionRef },
  );

  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    setDragging(true);
    drag.current = { startX: e.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !trackRef.current) return;
    trackRef.current.scrollLeft =
      drag.current.scrollLeft - (e.clientX - drag.current.startX);
  };

  const onPointerUp = () => setDragging(false);

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="relative bg-white z-10 py-24 md:py-40"
      aria-label="Start-up studio"
    >
      <DragPill visible={hovering && !dragging} />

      {/* ── Intro ── */}
      <div className="container-content">
        {/* 464 + 896 su 1360: nel design il testo parte a x=504 dell'artboard. */}
        <div id="studio-block" className="flex flex-col md:grid md:grid-cols-[464fr_896fr] md:items-start">
        <div className="shrink-0 mb-6 md:mb-0">
          <span
            className="inline-flex items-center border border-black text-black"
            style={{ borderRadius: "5px", padding: "4px 10px", fontSize: "14px", lineHeight: "20px" }}
          >
            Start-up studio
          </span>
        </div>
        <div className="studio-intro flex-1 md:max-w-[888px]">
          {/* Design (nodo 461:105): Regular 48/54 su una colonna di 888 che parte
              a x=504 dell'artboard. Era medium con leading 1.2.
              Il tracking recupera il kerning che gli inline-block dell'effetto
              colore azzerano: le righe misuravano 737,8/881,8/831,3/861,5 contro
              735,9/877,8/826,7/859,4 del PDF, ~0,09px per carattere. */}
          <h2 className="text-h2 font-normal leading-[54px] tracking-[-0.002em]">
            {INTRO.split(" ").map((word, wi) => (
              <span key={wi}>
              {wi > 0 ? " " : null}
              <span className="inline-block">
                {word.split("").map((char, ci) => (
                  <span
                    key={ci}
                    className="studio-char inline-block transition-colors duration-300 ease-out"
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

      {/* ── Carosello trascinabile ── */}
      <div className="container-content mt-14 md:mt-20">
        <div
          ref={trackRef}
          className={`flex gap-6 overflow-x-auto scrollbar-hide select-none -mr-5 pr-5 md:-mr-12 md:pr-12 md:cursor-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{ scrollbarWidth: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => {
            setHovering(false);
            setDragging(false);
          }}
        >
          {PRODOTTI.map((p) => (
            <article
              key={p.nome}
              className="shrink-0"
              style={{ width: "clamp(280px, 42vw, 560px)" }}
            >
              <div
                className="relative overflow-hidden rounded-[10px] group"
                style={{ aspectRatio: "4 / 3" }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.nome}
                    draggable={false}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out scale-[1.08] group-hover:scale-100"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: p.accent }}
                  >
                    <span
                      className="uppercase font-medium text-black/80"
                      style={{ fontSize: "var(--font-h3)" }}
                    >
                      {p.nome}
                    </span>
                  </div>
                )}
              </div>

              <p
                className="mt-4 uppercase tracking-wide"
                style={{
                  fontSize: "var(--font-p)",
                  color: "var(--color-middle-grey)",
                }}
              >
                {p.tipologia}
              </p>

              <h3
                className="uppercase tracking-wide font-medium text-black"
                style={{ fontSize: "var(--font-h4)" }}
              >
                {p.href ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPointerDown={(e) => e.stopPropagation()}
                    className="hover:opacity-60 transition-opacity"
                  >
                    {p.nome}
                  </a>
                ) : (
                  p.nome
                )}
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
