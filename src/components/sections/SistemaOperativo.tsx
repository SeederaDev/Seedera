"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Fase {
  title: string;
  claim: string;
  description: string;
}

const FASI: Fase[] = [
  {
    title: "Diagnosi",
    claim: "Prima il problema",
    description:
      "Ogni progetto comincia da una domanda sola: perché lo vuoi costruire. Finché non c'è una risposta chiara, non si progetta niente.",
  },
  {
    title: "Integrazione",
    claim: "Un solo sistema",
    description:
      "Tech, second brain e AI si progettano insieme, con un interlocutore unico dall'inizio alla fine. Niente passaggi di mano, niente contesto perso per strada.",
  },
  {
    title: "Esecuzione",
    claim: "I numeri prima del lavoro",
    description:
      "I KPI che diranno se è andata bene li scegliamo insieme al primo incontro, e li guardiamo mentre il progetto va avanti.",
  },
  {
    title: "Trasferimento",
    claim: "Usciamo quando sai fare da solo",
    description:
      "Il progetto si chiude quando il tuo team sa fare da solo le cose che prima non sapeva fare. È l'unica condizione di uscita che accettiamo.",
  },
];

export default function SistemaOperativo() {
  const sectionRef = useRef<HTMLElement>(null);
  /* Nel design la seconda barra e' quella aperta: l'accordion parte da li'. */
  const [aperta, setAperta] = useState(1);

  useGSAP(
    () => {
      const barre = gsap.utils.toArray<HTMLElement>(".fase-barra");
      gsap.from(barre, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".fasi-lista",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="sistema-operativo"
      /* pb ridotto da mobile: sotto c'e' la fascia scorrevole, che porta gia'
         il suo stacco. Da md restano i 40 di design. */
      className="relative bg-white z-10 pt-24 pb-12 md:py-40"
      aria-label="Il sistema operativo"
    >
      {/* 440 + 920 su 1360, come nel design: le barre partono a x=480
          dell'artboard. In frazioni, non in percentuali arrotondate. */}
      <div id="sistema-inner" className="container-content flex flex-col md:grid md:grid-cols-[44fr_92fr] md:items-start">
        {/* ── Colonna sinistra: badge in alto, claim in basso ── */}
        <div className="flex flex-col justify-between self-stretch mb-8 md:mb-0">
          <span
            className="inline-flex items-center self-start border border-black text-black"
            style={{ borderRadius: "5px", padding: "5px 10px", fontSize: "14px", lineHeight: "20px" }}
          >
            Il sistema operativo
          </span>

          <div className="mt-10 md:mt-0">
            <p className="text-black font-bold text-[16px]">Quattro fasi</p>
            <p className="text-black text-[16px]">Nessuna scorciatoia</p>
          </div>
        </div>

        {/* ── Accordion ── */}
        {/* Niente max-width: 920px e' quanto misura la colonna 92fr a 1440px,
            non un vincolo del design. Su finestre piu' larghe fermava le barre
            mentre le card delle altre sezioni arrivavano al bordo. La griglia
            44fr/92fr da sola tiene gia' la proporzione a ogni larghezza. */}
        <ul className="fasi-lista flex flex-col gap-5">
          {FASI.map((fase, i) => {
            const open = aperta === i;
            return (
              <li key={fase.title} className="fase-barra">
                {/* Nel design il pannello aperto NON sta dentro la barra: e' un
                    secondo blocco, staccato di 8px e di colore scuro. Per
                    questo nel Figma i rettangoli sono cinque e non quattro. */}
                {/* Il giallo sta sulla BARRA, non sul contenitore: messo qui,
                    riempiva gli 8px di stacco fra barra e pannello aperto e i
                    due blocchi diventavano uno solo — misurati 158px continui
                    dove il design ne ha 81 e 65. */}
                <div>
                  <button
                    type="button"
                    onClick={() => setAperta(open ? -1 : i)}
                    aria-expanded={open}
                    className="w-full flex items-center justify-between gap-6 px-5 md:px-5 text-left cursor-pointer md:h-[81px] rounded-[10px] bg-primary"
                  >
                    <span
                      className="text-black leading-none"
                      style={{ fontSize: "clamp(1.5rem, 2.7vw, 2.4375rem)", lineHeight: "44px" }}
                    >
                      {fase.title}
                    </span>

                    {/* La freccia ruota da → a ↓ quando la barra si apre */}
                    <svg
                      width="40"
                      height="24"
                      viewBox="0 0 40 24"
                      fill="none"
                      aria-hidden="true"
                      className={`shrink-0 text-black transition-transform duration-500 ${
                        open ? "rotate-90" : ""
                      }`}
                    >
                      <path
                        d="M2 12h34M26 3l10 9-10 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Contenuto: grid 0fr → 1fr, si anima all'altezza esatta */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      {/* Il margine sta qui dentro: cosi' a pannello chiuso
                          collassa insieme all'altezza e non lascia un vuoto. */}
                      <div className="mt-[8px] rounded-[10px] bg-primary px-5 pt-[27px] pb-[30px] flex flex-col gap-[10px]">
                        <p className="text-black font-bold text-[16px]">{fase.claim}</p>
                        <p className="text-black text-[16px] leading-[22px]">
                          {fase.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
