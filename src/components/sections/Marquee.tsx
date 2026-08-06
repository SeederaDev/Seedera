"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXTS = [
  "Prima il problema",
  "✦",
  "Sistemi, non deliverable",
  "✦",
  "Software su misura",
  "✦",
  "Agenti AI",
  "✦",
  "Second Brain",
  "✦",
  "Startup Studio",
  "✦",
  "Shared Risk",
  "✦",
  "Digital Products",
  "✦",
  "Execution Partner",
  "✦",
  "Web & App",
  "✦",
];

export default function Marquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // First row: scroll left
      gsap.to(track1Ref.current, {
        xPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Second row: scroll right
      gsap.to(track2Ref.current, {
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

  const row = MARQUEE_TEXTS.join(" ");
  // Duplicate text for seamless loop
  const doubleRow = `${row} ${row} ${row} ${row}`;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-32 overflow-hidden bg-background"
      aria-label="Competenze"
    >
      {/* Row 1 - moves left */}
      <div className="mb-4">
        <div ref={track1Ref} className="marquee-track">
          <span
            className="text-h1 font-bold text-foreground whitespace-nowrap"
            style={{ fontSize: "clamp(3rem, 6.25vw, 6rem)" }}
          >
            {doubleRow}
          </span>
        </div>
      </div>

      {/* Row 2 - moves right, starts offset */}
      <div>
        <div
          ref={track2Ref}
          className="marquee-track"
          style={{ transform: "translateX(-50%)" }}
        >
          <span
            className="text-h1 font-bold text-foreground/10 whitespace-nowrap"
            style={{ fontSize: "clamp(3rem, 6.25vw, 6rem)" }}
          >
            {doubleRow}
          </span>
        </div>
      </div>
    </section>
  );
}
