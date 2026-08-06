"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface LedgerEntry {
  key: string;
  value: string;
  caption: string;
}

const ENTRIES: LedgerEntry[] = [
  {
    key: "sistemi_integrati",
    value: "3",
    caption: "Tech, second brain e AI progettati insieme, non in sequenza.",
  },
  {
    key: "interlocutore",
    value: "1",
    caption: "Un solo referente dall'inizio alla fine. Nessun passaggio di mano.",
  },
  {
    key: "brief_senza_diagnosi",
    value: "0",
    caption: "Nessun progetto parte prima di aver capito il problema reale.",
  },
  {
    key: "problemi_affrontabili",
    value: "∞",
    caption: "Il perimetro lo definisce il problema, non il listino.",
  },
];

export default function Ledger() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>(".ledger-row");
      gsap.from(rows, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="ledger"
      className="relative bg-background z-10 py-20 md:py-28"
      aria-label="Come lavoriamo"
    >
      <div className="container-content flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <span
            className="uppercase tracking-[0.2em] font-mono"
            style={{
              fontSize: "var(--font-p)",
              color: "var(--color-middle-grey)",
            }}
          >
            seedera — ledger
          </span>
          <div className="h-[1px] flex-1 bg-white/15" />
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {ENTRIES.map((entry) => (
            <div key={entry.key} className="ledger-row flex flex-col gap-3">
              <dd
                className="font-medium leading-none text-foreground"
                style={{ fontSize: "var(--font-h1)" }}
              >
                {entry.value}
              </dd>
              <dt
                className="font-mono lowercase tracking-wide"
                style={{
                  fontSize: "var(--font-p)",
                  color: "var(--color-yellow)",
                }}
              >
                {entry.key}
              </dt>
              <p className="text-white/50 leading-relaxed text-sm">
                {entry.caption}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
