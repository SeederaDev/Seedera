"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Riga grande, nera su bianco: scorre verso sinistra allo scroll. */
/* Nel design la frase E' maiuscola: nel PDF si legge, a meta' scorrimento,
   "NSIEME • INNOVIAMO, TRASFORMIAM". La nota precedente diceva il contrario
   ed era sbagliata — presa da un nodo, non dal rendering. */
const RIGA_GRANDE = "INNOVIAMO, TRASFORMIAMO, CRESCIAMO. INSIEME";

/* Fascia gialla sottile, scorre in senso opposto. */
const RIGA_GIALLA =
  "Siamo una digital factory che usa i dati ma genera idee out of the box. Tu ci indichi un obiettivo, noi troviamo strade alternative per raggiungerlo velocemente e con il massimo ritorno sull'investimento.";

export default function Marquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const grandeRef = useRef<HTMLDivElement>(null);
  const giallaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.to(grandeRef.current, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      /* Direzione opposta: le due fasce si muovono l'una contro l'altra. */
      gsap.to(giallaRef.current, {
        xPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    },
    { scope: sectionRef },
  );

  const grande = `${RIGA_GRANDE} • `.repeat(4);
  const gialla = `${RIGA_GIALLA}   `.repeat(4);

  return (
    <section
      ref={sectionRef}
      /* Misure del design: la sezione e' alta 332, il testo grande cade a 109
         e la fascia gialla (70px) chiude in basso senza padding dopo.
         I 104px valgono da desktop: da mobile si sommavano al pb della
         sezione accordion e fra i due blocchi restavano 200px di bianco. */
      className="relative pt-6 md:pt-[104px] overflow-hidden bg-white"
      aria-label="Come lavoriamo"
    >
      {/* Riga grande */}
      <div className="mb-6 md:mb-[78px]">
        <div ref={grandeRef} className="marquee-track">
          <span
            className="text-black font-normal whitespace-nowrap leading-none"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 5rem)" }}
          >
            {grande}
          </span>
        </div>
      </div>

      {/* Fascia gialla */}
      <div className="bg-primary py-[19px] overflow-hidden">
        <div
          ref={giallaRef}
          className="marquee-track"
          style={{ transform: "translateX(-50%)" }}
        >
          <span className="text-black whitespace-nowrap text-[16px] leading-[22px]">
            {gialla}
          </span>
        </div>
      </div>
    </section>
  );
}
