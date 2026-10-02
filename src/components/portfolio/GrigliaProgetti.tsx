"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Progetto } from "@/lib/contenuti";
import { inColonne } from "@/lib/progetti";

gsap.registerPlugin(ScrollTrigger);

/* La griglia del portfolio, uguale in home e in /portfolio: fino al 02/10/2026
   ne esistevano due copie quasi identiche, ognuna con il suo sfalsamento.

   Due regole che spiegano il resto:
   - **L'anteprima si vede intera.** Le copertine vanno dal 4:3 al 2,3:1: un
     riquadro fisso (era 4:3, con l'immagine al 120% per la parallasse) ne
     tagliava i lati a tutte. Ogni scheda prende la proporzione della sua
     immagine, e l'effetto al passaggio non ingrandisce dentro il riquadro.
   - **A gradini.** Tre colonne da desktop, due su tablet, una su telefono;
     ogni colonna parte piu' in basso della precedente. Le tre disposizioni
     sono tutte nel markup e le sceglie il CSS: una scelta in JS darebbe al
     server una disposizione e al browser un'altra. */

/** Di quanto scende ogni colonna rispetto alla precedente. */
const GRADINO = { tablet: 160, desktop: 120 };
const SPAZIO_VERTICALE = 60;

/* ── Testo che rotola al passaggio ── */
function RollingText({ text }: { text: string }) {
  const letters = text.split("");
  const riga = (nascosta: boolean) => (
    <span className="rolling-text-row" aria-hidden={nascosta || undefined}>
      {letters.map((char, i) => (
        <span key={i} className="rolling-text-char" style={{ transitionDelay: `${i * 15}ms` }}>
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
  return (
    <span className="rolling-text-wrap cursor-pointer font-medium">
      {riga(true)}
      {riga(false)}
    </span>
  );
}

/* ── Il cerchio "Scopri di più" che segue il mouse sulle immagini ── */
export function CursoreProgetti() {
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
        gsap.to(cursor, { left: e.clientX, top: e.clientY, duration: 0.15, ease: "power2.out", overwrite: "auto" });
      }
    };
    const onShow = () => {
      isVisible.current = true;
      gsap.set(cursor, { left: mousePos.current.x, top: mousePos.current.y, scale: 0, opacity: 0 });
      gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.4)", overwrite: true });
    };
    const onHide = () => {
      isVisible.current = false;
      gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.25, ease: "power2.in", overwrite: true });
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
    <div ref={cursorRef} className="fixed pointer-events-none z-50" style={{ top: 0, left: 0, opacity: 0 }}>
      <div
        className="flex items-center justify-center rounded-full text-black font-bold text-center leading-tight uppercase"
        style={{ width: "125px", height: "125px", fontSize: "14px", backgroundColor: "#CDFD51" }}
      >
        Scopri
        <br />
        di più
      </div>
    </div>
  );
}

/* Le immagini arrivano senza dimensioni: finche' non si caricano la colonna e'
   piu' corta, e i punti d'innesco delle animazioni sarebbero calcolati su una
   pagina che poi si allunga. Si ricalcolano una volta per fotogramma. */
let ricalcoloInCoda = false;
function ricalcolaAnimazioni() {
  if (ricalcoloInCoda) return;
  ricalcoloInCoda = true;
  requestAnimationFrame(() => {
    ricalcoloInCoda = false;
    ScrollTrigger.refresh();
  });
}

/* ── Una scheda ── */
function SchedaProgetto({ project }: { project: Progetto }) {
  return (
    <Link href={`/portfolio/${project.slug}`} className="group block">
      <article className="project-card">
        <div
          className="overflow-hidden rounded-[10px] cursor-none bg-black/5 transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.35)] motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
          onMouseEnter={() => window.dispatchEvent(new CustomEvent("project-cursor-show"))}
          onMouseLeave={() => window.dispatchEvent(new CustomEvent("project-cursor-hide"))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- copertine dal pannello, dimensioni ignote */}
          <img
            src={project.copertina}
            alt={project.cliente}
            loading="lazy"
            decoding="async"
            onLoad={ricalcolaAnimazioni}
            className="block w-full h-auto"
          />
        </div>

        <div className="mt-[15px] flex flex-wrap gap-x-2">
          {project.tag.map((tag, i) => (
            <span
              key={i}
              className="uppercase tracking-wide"
              style={{ fontSize: "var(--font-p)", color: "var(--color-middle-grey)" }}
            >
              {tag}
              {i < project.tag.length - 1 && <span className="ml-2">·</span>}
            </span>
          ))}
        </div>

        <h3 className="uppercase tracking-wide" style={{ fontSize: "var(--font-h4)", color: "var(--color-black)" }}>
          <RollingText text={project.cliente} />
        </h3>
      </article>
    </Link>
  );
}

function Colonne({ progetti, colonne, gradino, className }: {
  progetti: Progetto[];
  colonne: number;
  gradino: number;
  className: string;
}) {
  return (
    <div className={className} style={{ gridTemplateColumns: `repeat(${colonne}, minmax(0, 1fr))` }}>
      {inColonne(progetti, colonne).map((colonna, c) => (
        <div key={c} className="flex flex-col" style={{ gap: SPAZIO_VERTICALE, paddingTop: c * gradino }}>
          {colonna.map((p) => (
            <SchedaProgetto key={p.slug} project={p} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── La griglia ── */
export default function GrigliaProgetti({ progetti }: { progetti: Progetto[] }) {
  return (
    <>
      <Colonne progetti={progetti} colonne={1} gradino={0} className="grid md:hidden" />
      <Colonne
        progetti={progetti}
        colonne={2}
        gradino={GRADINO.tablet}
        className="hidden md:grid lg:hidden gap-x-[25px]"
      />
      <Colonne
        progetti={progetti}
        colonne={3}
        gradino={GRADINO.desktop}
        className="hidden lg:grid gap-x-[25px]"
      />
    </>
  );
}
