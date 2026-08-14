"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TEAM, type Persona } from "./team";

gsap.registerPlugin(ScrollTrigger);

const INTRO =
  `Siamo un gruppo che entra nel progetto e lavora agli stessi obiettivi di chi ` +
  `c'è già dentro. Un metodo solo: prima il problema, poi il sistema. E un ` +
  `obiettivo: che il tuo team sappia fare da solo quello per cui oggi chiama noi.`;

/* Freccia della scheda: la stessa di Partnership, non un'altra. */
function Freccia() {
  return (
    <svg
      width="35"
      height="33"
      viewBox="0 0 35 33"
      fill="none"
      aria-hidden="true"
      className="text-black"
    >
      <path
        d="M1 16.5h32M21 4l12 12.5L21 29"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SchedaPersona({
  persona,
  aperta,
  onToggle,
}: {
  persona: Persona;
  aperta: boolean;
  onToggle: () => void;
}) {
  return (
    <article
      className="persona-card"
      style={
        {
          "--col": persona.colonna,
          "--riga": persona.riga,
        } as React.CSSProperties
      }
    >
      {/* Bottone e non div: la bio si apre col passaggio del mouse, ma da
          telefono il mouse non c'e' e senza un comando vero la scheda
          resterebbe chiusa per sempre. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aperta}
        className="persona-trigger group block w-full text-left cursor-pointer"
      >
        <div
          className="relative overflow-hidden rounded-[5px] bg-[#D9D9D9]"
          style={{ aspectRatio: "432 / 539" }}
        >
          {/* Nel design la foto e' in bianco e nero e prende colore solo
              quando la scheda si apre. Le foto non sono ancora arrivate:
              finche' manca, resta il riquadro grigio del Figma. */}
          {persona.foto ? (
            <img
              src={persona.foto}
              alt={persona.nome}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : null}

          {/* Pannello giallo: nome, ruolo e bio sopra la foto. */}
          <div
            className={`absolute inset-0 bg-primary flex flex-col transition-opacity duration-400 ease-out group-hover:opacity-100 ${
              aperta ? "opacity-100" : "opacity-0"
            }`}
            style={{ padding: "24px" }}
          >
            <h3 className="text-black font-normal text-[25px] leading-[32px]">
              {persona.nome}
            </h3>
            <p className="text-black text-[16px] leading-[22px] mt-[4px]">
              {persona.ruolo}
            </p>
            <p className="text-black text-[16px] leading-[22px] mt-[4px] max-w-[385px]">
              {persona.bio}
            </p>
          </div>
        </div>

        {/* Sotto la foto nome e ruolo, che spariscono quando il pannello e'
            aperto: li' il nome c'e' gia', ripeterlo sarebbe un errore. */}
        <div
          className={`transition-opacity duration-300 ease-out group-hover:opacity-0 ${
            aperta ? "opacity-0" : "opacity-100"
          }`}
        >
          <h3 className="text-black font-normal text-[25px] leading-[32px] mt-[12px]">
            {persona.nome}
          </h3>
          <p className="text-middle-grey text-[16px] leading-[22px] mt-[4px]">
            {persona.ruolo}
          </p>
          <span className="inline-flex mt-[12px]">
            <Freccia />
          </span>
        </div>
      </button>
    </article>
  );
}

export default function PersonePage() {
  const mainRef = useRef<HTMLElement>(null);
  const [aperta, setAperta] = useState<string | null>(null);

  useGSAP(
    () => {
      /* Rivelo del titolo carattere per carattere, come su portfolio e
         partnership: grigio finche' lo scorrimento non lo raggiunge. */
      const chars = gsap.utils.toArray<HTMLElement>(".persone-char");
      if (chars.length) {
        ScrollTrigger.create({
          trigger: ".persone-intro",
          start: "top 85%",
          end: "top 30%",
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
      }

      gsap.utils.toArray<HTMLElement>(".persona-card").forEach((card) => {
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
    { scope: mainRef },
  );

  return (
    <>
      <Navbar />
      <main ref={mainRef}>
        {/* ── Testata: stessa fascia gialla alta 350 delle altre pagine ── */}
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
              Chi siamo
            </h1>
          </div>
        </section>

        <section className="bg-white">
          {/* ── Intro: badge a sinistra, testo nella colonna a x=504 ── */}
          <div className="container-content pt-14 pb-14 md:pt-[106px] md:pb-[74px]">
            <div className="flex flex-col md:grid md:grid-cols-[464fr_896fr] md:items-start">
              <div className="mb-6 md:mb-0">
                <span
                  className="inline-flex items-center border border-black text-black uppercase"
                  style={{
                    borderRadius: "7px",
                    padding: "5px 10px",
                    fontSize: "15px",
                    lineHeight: "20px",
                  }}
                >
                  Persone
                </span>
              </div>

              <h2 className="persone-intro text-h2 font-normal leading-[54px] tracking-[-0.002em]">
                {INTRO.split(" ").map((parola, wi) => (
                  <span key={wi}>
                    {wi > 0 ? " " : null}
                    {/* La parola resta intera in un inline-block: cosi' va a
                        capo per parole, non per lettere. */}
                    <span className="inline-block">
                      {parola.split("").map((ch, ci) => (
                        <span
                          key={ci}
                          className="persone-char inline-block transition-colors duration-300 ease-out"
                          style={{ color: "var(--color-grey)" }}
                        >
                          {ch}
                        </span>
                      ))}
                    </span>
                  </span>
                ))}
              </h2>
            </div>
          </div>

          {/* ── Griglia: tre colonne con le celle vuote del design ── */}
          <div className="container-content pb-24 md:pb-40">
            {/* gap-y 25 e non 70: nel design il passo fra due righe della
                stessa colonna e' 679 (880 → 1559) e dentro ci sta anche la
                freccia. Con 70 la griglia scendeva di 50px a riga. */}
            <div className="persone-griglia grid grid-cols-1 md:grid-cols-3 gap-x-[24px] gap-y-[32px] md:gap-y-[25px]">
              {TEAM.map((p) => (
                <SchedaPersona
                  key={p.slug}
                  persona={p}
                  aperta={aperta === p.slug}
                  onToggle={() =>
                    setAperta((cur) => (cur === p.slug ? null : p.slug))
                  }
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
