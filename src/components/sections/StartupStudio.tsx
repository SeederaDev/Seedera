"use client";

import { useRef } from "react";
import Link from "next/link";
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
    image: "/images/projects/replase/replase-01.jpg",
    href: "https://replase.com",
    accent: "var(--color-cyan)",
  },
  {
    /* Non ha un sito proprio: il nome porta alla scheda di portfolio, quindi
       il link e' interno e non deve aprire una scheda nuova (vedi `esterno`
       piu' sotto). */
    tipologia: "FORMAT CULTURALE",
    nome: "SUONI OLTRE CONFINE",
    image: "/images/projects/suoni-oltre-confine/suoni-oltre-confine-01.jpg",
    href: "/portfolio/suoni-oltre-confine",
    accent: "var(--color-yellow)",
  },
];

const INTRO =
  "Una parte del nostro lavoro non ha committente: sono idee nostre, che portiamo dal prototipo fino alla società che le gestisce. È dove il metodo lo proviamo addosso a noi, prima che a qualcun altro.";

export default function StartupStudio() {
  const sectionRef = useRef<HTMLElement>(null);

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

  return (
    <section
      ref={sectionRef}
      id="studio"
      className="relative bg-white z-10 py-24 md:py-40"
      aria-label="Start-up studio"
    >
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
        <div className="studio-intro">
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

      {/* ── I tre prodotti ── */}
      {/* Da computer stanno affiancati: con tre schede il carosello "< DRAG >"
          del design non aveva niente da far scorrere (a 1920px zero, a 1440
          368px), e il cerchio finiva sotto quello del cursore. Sotto lg si
          scorrono col dito, con lo scroll nativo.
          Lo sbordo a destra deve coincidere col padding del container (24px
          mobile, 40px da md, vedi .container-content): con -mr-12 la traccia
          usciva di 8px dal viewport e la pagina scorreva. */}
      <div className="container-content mt-14 md:mt-20">
        <div
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide -mr-6 pr-6 md:-mr-10 md:pr-10 lg:grid lg:grid-cols-3 lg:overflow-visible lg:mr-0 lg:pr-0"
          style={{ scrollbarWidth: "none" }}
        >
          {PRODOTTI.map((p) => {
            /* Un prodotto con sito proprio esce dal sito; una scheda di
               portfolio resta dentro e passa dal router, altrimenti la
               navigazione ricarica la pagina intera. */
            const esterno = p.href?.startsWith("http") ?? false;
            /* Riga alta 22px: padding e margine verticali opposti portano il
               tocco a 44px senza spostare nulla. */
            const classiNome =
              "inline-block py-[11px] -my-[11px] hover:opacity-60 transition-opacity";
            return (
            <article
              key={p.nome}
              className="shrink-0 snap-start w-[clamp(280px,42vw,560px)] lg:w-auto"
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
                {!p.href ? (
                  p.nome
                ) : esterno ? (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={classiNome}
                  >
                    {p.nome}
                  </a>
                ) : (
                  <Link
                    href={p.href}
                    className={classiNome}
                  >
                    {p.nome}
                  </Link>
                )}
              </h3>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
