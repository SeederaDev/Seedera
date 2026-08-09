"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contatti() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const righe = gsap.utils.toArray<HTMLElement>(".contatti-riga");
      gsap.from(righe, {
        y: 28,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="contatti"
      className="relative bg-primary z-10 py-24 md:py-32"
      aria-label="Contatti"
    >
      <div id="contatti-inner" className="container-content flex flex-col gap-5 md:max-w-[1082px]">
        <span
          className="contatti-riga inline-flex items-center self-start border border-black text-black"
          style={{ borderRadius: "5px", padding: "4px 10px", fontSize: "14px", lineHeight: "20px" }}
        >
          Contatti
        </span>

        <h2
          className="contatti-riga text-black font-normal uppercase"
          /* Come nell'hero: Figma ritaglia il mezzo-leading sotto l'ultima riga,
             quindi il blocco CSS e' 15px piu' alto del box del design e senza
             questo recupero il paragrafo e la freccia scendono. */
          style={{ fontSize: "clamp(2rem, 4.72vw, 4.25rem)", lineHeight: "1.03", marginBottom: "-16px" }}
        >
          Hai un problema da risolvere o un prodotto da costruire?
        </h2>

        <p className="contatti-riga text-black text-[16px] leading-[22px] max-w-[546px]">
          Iniziamo da una conversazione informale. Nessun brief. Nessun form.
          Solo una chiamata per capire se il progetto ha senso per entrambi.
        </p>

        <Link
          href="/parliamo"
          aria-label="Apri una conversazione"
          /* Freccia 35x33: padding e margine negativo si annullano a vista
             ma portano il bersaglio di tocco sopra i 44px. */
          className="contatti-riga group inline-flex items-center self-start text-black p-1.5 -m-1.5"
        >
          <svg
              width="35"
              height="33"
              viewBox="0 0 35 33"
              fill="none"
              aria-hidden="true"
            className="transition-transform duration-300 group-hover:translate-x-2"
          >
            <path
              d="M1 16.5h32M21 4l12 12.5L21 29"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
