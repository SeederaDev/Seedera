"use client";

import { Fragment, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { PersonaPubblica as Persona } from "@/lib/contenuti";
import { posizione } from "@/lib/persone-griglia";

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

/* Le coordinate si passano come variabili CSS e le leggono le classi dei due
   punti di rottura: sotto i 768px la griglia torna una colonna sola e la bio
   segue la foto nel flusso. */
function coordinate(i: number) {
  const due = posizione(i, 2);
  const quattro = posizione(i, 4);
  return {
    due,
    quattro,
    stile: {
      "--r2": due.riga, "--c2": due.colonna, "--b2": due.bio,
      "--r4": quattro.riga, "--c4": quattro.colonna, "--b4": quattro.bio,
    } as React.CSSProperties,
  };
}

interface Comandi {
  aperta: boolean;
  onToggle: () => void;
  onEntra: () => void;
  onEsce: () => void;
}

function SchedaPersona({
  persona,
  indice,
  aperta,
  onToggle,
  onEntra,
  onEsce,
}: { persona: Persona; indice: number } & Comandi) {
  const { stile } = coordinate(indice);
  return (
    <article
      className="persona-card md:[grid-row:var(--r2)] md:[grid-column:var(--c2)] min-[90rem]:[grid-row:var(--r4)] min-[90rem]:[grid-column:var(--c4)]"
      style={stile}
      onPointerEnter={(e) => e.pointerType === "mouse" && onEntra()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onEsce()}
    >
      {/* Bottone e non div: la bio si apre col passaggio del mouse, ma da
          telefono il mouse non c'e' e senza un comando vero la scheda
          resterebbe chiusa per sempre. */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={aperta}
        aria-controls={`bio-${persona.slug}`}
        className="group block w-full text-left cursor-pointer"
      >
        <div
          className="relative overflow-hidden rounded-[5px] bg-[#D9D9D9]"
          style={{ aspectRatio: "432 / 539" }}
        >
          {/* Finche' la foto manca resta il riquadro grigio del Figma. */}
          {persona.foto ? (
            <img
              src={persona.foto}
              alt={persona.nome}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
            />
          ) : null}
        </div>

        <h3 className="text-black font-normal text-[25px] leading-[32px] mt-[12px]">
          {persona.nome}
        </h3>
        <p className="text-middle-grey text-[16px] leading-[22px] mt-[4px]">
          {persona.ruolo}
        </p>
        {/* Aperta, la freccia si gira: e' il comando per richiudere. */}
        <span
          className={`inline-flex mt-[12px] transition-transform duration-400 ease-out motion-reduce:transition-none ${
            aperta ? "rotate-180" : ""
          }`}
        >
          <Freccia />
        </span>
      </button>
    </article>
  );
}

/* La bio sta nella casella libera accanto alla foto ed entra dal lato della
   foto, come un foglio che scorre fuori da sotto lo scatto. Resta nel DOM
   anche chiusa, per animare l'uscita, ma fuori dal fuoco e dalla lettura.

   La casella nella griglia e' alta quanto la foto e non cresce: il pannello ci
   sta dentro in posizione assoluta, e se la bio e' piu' lunga della foto scende
   in primo piano sopra lo spazio sotto. Prima allungava la riga, e aprire una
   bio lunga spostava tutta la pagina. Sotto i 768px la bio sta nel flusso,
   sotto la foto. */
function PannelloBio({
  persona,
  indice,
  aperta,
  onToggle,
  onEntra,
  onEsce,
}: { persona: Persona; indice: number } & Comandi) {
  const { due, quattro, stile } = coordinate(indice);
  const chiuso = (lato: "destra" | "sinistra") =>
    lato === "destra" ? "inset(0 100% 0 0 round 5px)" : "inset(0 0 0 100% round 5px)";
  return (
    <div
      className={`relative self-start md:aspect-[432/539] md:[grid-row:var(--r2)] md:[grid-column:var(--b2)] min-[90rem]:[grid-row:var(--r4)] min-[90rem]:[grid-column:var(--b4)] ${
        aperta ? "z-10" : "max-md:hidden"
      }`}
      style={stile}
    >
      <div
        id={`bio-${persona.slug}`}
        role="region"
        aria-label={`Chi e' ${persona.nome}`}
        inert={!aperta}
        className={`persona-bio bg-primary rounded-[5px] p-[20px] flex flex-col transition-[clip-path,opacity] duration-400 ease-out motion-reduce:transition-none md:absolute md:inset-x-0 md:top-0 md:min-h-full ${
          aperta ? "opacity-100" : "opacity-0"
        }`}
        style={
          {
            "--chiuso2": chiuso(due.lato),
            "--chiuso4": chiuso(quattro.lato),
            clipPath: aperta ? "inset(0 0 0 0 round 5px)" : undefined,
          } as React.CSSProperties
        }
        onPointerEnter={(e) => e.pointerType === "mouse" && onEntra()}
        onPointerLeave={(e) => e.pointerType === "mouse" && onEsce()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-black font-normal text-[20px] leading-[30px]">
            {persona.nome}
          </h3>
          <button
            type="button"
            onClick={onToggle}
            aria-label={`Chiudi la scheda di ${persona.nome}`}
            className="shrink-0 -mr-[4px] -mt-[2px] p-[4px] cursor-pointer text-black"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 2l20 20M22 2L2 22" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
        <p className="text-black text-[15px] leading-[22px] min-[90rem]:text-[14px] min-[90rem]:leading-[20px] mt-[14px]">
          {persona.bio}
        </p>
      </div>
    </div>
  );
}

export default function PaginaPersone({ persone }: { persone: Persona[] }) {
  const mainRef = useRef<HTMLElement>(null);
  const [aperta, setAperta] = useState<string | null>(null);

  /* Dalla foto al pannello il mouse attraversa lo spazio fra le due caselle:
     chiudere subito all'uscita farebbe sparire la bio proprio mentre ci si
     sta andando. Si aspetta un attimo, e rientrare annulla la chiusura. */
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const annulla = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const comandi = (slug: string): Comandi => ({
    aperta: aperta === slug,
    onToggle: () => {
      annulla();
      setAperta((cur) => (cur === slug ? null : slug));
    },
    onEntra: () => {
      annulla();
      setAperta(slug);
    },
    onEsce: () => {
      annulla();
      timer.current = setTimeout(
        () => setAperta((cur) => (cur === slug ? null : cur)),
        180,
      );
    },
  });

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

          {/* ── Griglia: scacchiera, ogni foto con la sua casella libera ── */}
          <div className="container-content pb-24 md:pb-40">
            <div className="persone-griglia grid grid-cols-1 md:grid-cols-2 min-[90rem]:grid-cols-4 gap-x-[24px] gap-y-[32px] md:gap-y-[25px]">
              {persone.map((p, i) => (
                <Fragment key={p.slug}>
                  <SchedaPersona persona={p} indice={i} {...comandi(p.slug)} />
                  <PannelloBio persona={p} indice={i} {...comandi(p.slug)} />
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
