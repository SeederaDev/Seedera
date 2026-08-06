"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OUTRO_TEXT =
  "Nessuno di questi lavori è finito quando è stato consegnato. È finito quando il team interno ha saputo portarlo avanti da solo.";

export default function ProjectsOutro() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll<HTMLElement>(".outro-char");
      if (chars.length === 0) return;

      const textContainer = section.querySelector(".outro-text");

      ScrollTrigger.create({
        trigger: textContainer,
        start: "top 80%",
        end: "top 20%",
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const totalChars = chars.length;
          chars.forEach((char, ci) => {
            const charProgress = ci / totalChars;
            if (progress > charProgress) {
              char.style.color = "var(--color-black)";
            } else {
              char.style.color = "var(--color-grey)";
            }
          });
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative bg-white z-10"
      aria-label="Progetti"
    >
      <div className="container-content py-24 md:py-40">
        <div className="flex flex-col md:flex-row md:items-start">
          {/* Label pill */}
          <div className="shrink-0 mb-6 md:mb-0">
            <span
              className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
              style={{
                borderRadius: "7px",
                padding: "5px 14px",
                fontSize: "15px",
              }}
            >
              Progetti
            </span>
          </div>

          {/* Spacer */}
          <div className="hidden md:block w-[20%] shrink-0" />

          {/* Text reveal */}
          <div className="flex-1 outro-text">
            <h2 className="text-h2 font-medium leading-[1.2]">
              {OUTRO_TEXT.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block mr-[0.3em]">
                  {word.split("").map((char, ci) => (
                    <span
                      key={ci}
                      className="outro-char inline-block transition-colors duration-300 ease-out"
                      style={{ color: "var(--color-grey)" }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
