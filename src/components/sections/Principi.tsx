"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Principio {
  title: string;
  description: string;
  /* Le immagini non sono ancora state fornite: nel Figma i riquadri sono
     placeholder grigi. Quando arrivano si riempie questo campo. */
  image?: string;
}

const PRINCIPI: Principio[] = [
  {
    title: "La domanda prima della risposta",
    description:
      "Ogni soluzione sbagliata nasce da una domanda sbagliata. Prima chiediamo. Poi costruiamo.",
  },
  {
    title: "Sistemi, non deliverable",
    description:
      "Non consegniamo file. Costruiamo capacità che restano nell'organizzazione dopo che usciamo.",
  },
  {
    title: "Operatori, non consulenti",
    description:
      "Non consigliamo dall'esterno. Operiamo dall'interno, condividendo gli obiettivi.",
  },
  {
    title: "Franchezza operativa",
    description:
      "Ti diciamo quando stai chiedendo la cosa sbagliata. Non per difficoltà. Per rispetto.",
  },
];

export default function Principi() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".principio-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".principi-griglia",
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
      id="principi"
      className="relative bg-white z-10 pb-24 md:pb-40"
      aria-label="I principi del metodo"
    >
      <div id="principi-inner" className="container-content">
        {/* gap 20, non 24: nel design le card stanno a x 40 / 385 / 730 / 1075
            e sono larghe 325. Con gap-6 diventano 322 e ognuna slitta.
            Da mobile la griglia diventa un carosello: quattro card impilate
            facevano una colonna lunghissima. Lo sbordo a destra vale quanto il
            padding del container (24px, vedi .container-content), come nel
            carosello di Start-up studio. */}
        <div className="principi-griglia flex snap-x snap-mandatory overflow-x-auto scrollbar-hide -mr-6 pr-6 gap-5 sm:grid sm:overflow-visible sm:mr-0 sm:pr-0 sm:grid-cols-2 lg:grid-cols-4">
          {PRINCIPI.map((p) => (
            <article
              key={p.title}
              className="principio-card flex flex-col gap-[10px] shrink-0 snap-start w-[78%] sm:w-auto sm:shrink"
            >
              <div
                className="w-full rounded-[5px] overflow-hidden bg-[#F2F2F2]"
                style={{ aspectRatio: "1 / 1" }}
              >
                {p.image ? (
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : null}
              </div>

              {/* 20px, non leading-normal (24): nel design il titolo e' alto
                  19,88 e i 4px in piu' spingono giu' tutta la descrizione. */}
              <h3 className="text-black font-bold text-[16px] leading-[20px]">
                {p.title}
              </h3>

              <p className="text-black text-[16px] leading-[22px]">
                {p.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
