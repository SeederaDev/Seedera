"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface StudioProduct {
  name: string;
  status: string;
  live: boolean;
  claim: string;
  description: string;
  href: string;
  linkLabel: string;
  image?: string;
  accent: string;
}

const PRODUCTS: StudioProduct[] = [
  {
    name: "Zentro",
    status: "Live",
    live: true,
    claim: "CRM e project management per freelancer e agenzie.",
    description:
      "Utenti paganti. In crescita. È la proof of concept vivente del nostro metodo: abbiamo costruito il nostro sistema di esecuzione e lo mettiamo a disposizione dei clienti come infrastruttura operativa.",
    href: "https://zentro.it",
    linkLabel: "zentro.it ↗",
    image: "/images/our-brand/zentro.png",
    accent: "var(--color-green)",
  },
  {
    name: "Replase",
    status: "In sviluppo",
    live: false,
    claim:
      "Connette le imprese alle iniziative globali di rimozione della plastica.",
    description:
      "Impatto ambientale reale e misurabile: ogni contributo è tracciato fino all'iniziativa che lo assorbe.",
    href: "https://replase.com",
    linkLabel: "replase.com ↗",
    accent: "var(--color-cyan)",
  },
];

export default function StartupStudio() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".studio-card");
      gsap.from(cards, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
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
      aria-label="Startup Studio"
    >
      <div className="container-content flex flex-col gap-12 md:gap-16">
        {/* ── Header ── */}
        <header className="flex flex-col gap-5 max-w-[70ch]">
          <span
            className="uppercase tracking-[0.2em]"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-middle-grey)",
            }}
          >
            {"// Startup Studio"}
          </span>
          <h2
            className="text-black font-normal uppercase leading-none"
            style={{ fontSize: "var(--font-h2)" }}
          >
            Costruiamo anche per noi stessi.
          </h2>
          <p className="text-black/70 text-lg leading-relaxed">
            Seedera è anche uno startup studio. Quando identifichiamo un problema
            irrisolto, costruiamo il prodotto.
          </p>
        </header>

        {/* ── Products ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((product) => (
            <article
              key={product.name}
              className="studio-card flex flex-col rounded-[10px] border border-black/10 overflow-hidden"
            >
              {/* Visual */}
              <div
                className="relative overflow-hidden"
                style={{ aspectRatio: "16 / 10" }}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ backgroundColor: product.accent }}
                  >
                    <span
                      className="uppercase font-medium tracking-wide text-black/80"
                      style={{ fontSize: "var(--font-h3)" }}
                    >
                      {product.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="flex flex-col gap-4 p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-[5px] border border-black/30 px-3 py-1 uppercase tracking-wide"
                    style={{ fontSize: "var(--font-btn)" }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: product.live
                          ? "var(--color-green)"
                          : "var(--color-middle-grey)",
                      }}
                    />
                    {product.status}
                  </span>
                  <h3
                    className="uppercase tracking-wide font-medium text-black"
                    style={{ fontSize: "var(--font-h4)" }}
                  >
                    {product.name}
                  </h3>
                </div>

                <p className="text-black font-medium">{product.claim}</p>
                <p className="text-black/70 leading-relaxed">
                  {product.description}
                </p>

                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 self-start rounded-[5px] border border-black px-4 py-2 text-black font-medium hover:bg-black hover:text-white transition-all duration-300"
                  style={{ fontSize: "var(--font-btn)" }}
                >
                  {product.linkLabel}
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* ── Principle ── */}
        <div className="studio-card flex flex-col gap-3 border-t border-black/15 pt-8 md:flex-row md:items-baseline md:gap-16">
          <span
            className="uppercase tracking-[0.2em] shrink-0"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-middle-grey)",
            }}
          >
            Principio
          </span>
          <div className="flex flex-col gap-2">
            <h3
              className="text-black font-medium uppercase leading-none"
              style={{ fontSize: "var(--font-h4)" }}
            >
              Build to learn
            </h3>
            <p className="max-w-[60ch] text-black/70 leading-relaxed">
              Ogni prodotto costruito diventa know-how per i clienti successivi.
              Il ciclo non si ferma.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
