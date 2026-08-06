"use client";

import { useRef, useState, useLayoutEffect } from "react";
import Matter from "matter-js";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const INTRO_TEXT = "Lavoriamo con chi costruisce cose belle.";

const BRICKS = [
  { label: "PROBLEMA VERO", color: "#DB3A30", textColor: "#fff" },
  { label: "DIAGNOSI", color: "#E8E8E8", textColor: "#000" },
  { label: "PARTNER", color: "#6396FF", textColor: "#fff" },
  { label: "SISTEMA", color: "#62CB95", textColor: "#000" },
  { label: "IMPATTO", color: "#DB3A30", textColor: "#fff" },
  { label: "CAPACITÀ", color: "#F3ADC5", textColor: "#000" },
  { label: "RISCHIO CONDIVISO", color: "#CDFD51", textColor: "#000" },
  { label: "FRANCHEZZA", color: "#62CB95", textColor: "#000" },
  { label: "ESECUZIONE", color: "#E8E8E8", textColor: "#000" },
  { label: "PERCHÉ", color: "#CDFD51", textColor: "#000" },
  { label: "DIALOGO", color: "#DB3A30", textColor: "#fff" },
  { label: "PRODOTTO", color: "#6396FF", textColor: "#fff" },
  { label: "STRATEGIA", color: "#F3ADC5", textColor: "#000" },
  { label: "AI", color: "#CDFD51", textColor: "#000" },
  { label: "SECOND BRAIN", color: "#62CB95", textColor: "#000" },
  { label: "SOFTWARE", color: "#DB3A30", textColor: "#fff" },
  { label: "BRAND", color: "#E8E8E8", textColor: "#000" },
];

const FIT = [
  "Ha un problema prima di avere una soluzione da eseguire",
  "Vuole un partner che operi, non solo che consigli",
  "Cerca un sistema, non un deliverable",
  'Sa che "facciamo tutto" non è una risposta',
  "È disposto a sentirsi dire che sta chiedendo la cosa sbagliata",
];

const NOT_FIT = [
  "Confonde prezzo con valore",
  "Vuole esecuzione passiva senza dialogo",
  "Ha già tutte le risposte",
  "Misura il valore in output, non in impatto",
  "Cerca l'agenzia, non il partner",
];

const DROP_MIN = 80;
const DROP_MAX = 260;

export default function TargetPhysics() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const bricksRef = useRef<Matter.Body[]>([]);
  /* Outer wrapper refs (for translate position) */
  const wrapRefs = useRef<(HTMLDivElement | null)[]>([]);
  /* Inner span refs (for translate(-50%,-50%) rotate) and measuring size */
  const innerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rafRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const droppedRef = useRef(false);
  const dropIdxRef = useRef(0);
  const [ready, setReady] = useState(false);

  /* ── Text reveal ── */
  useGSAP(
    () => {
      const s = sectionRef.current;
      if (!s) return;
      const chars = s.querySelectorAll<HTMLElement>(".target-intro-char");
      if (!chars.length) return;
      ScrollTrigger.create({
        trigger: s.querySelector(".target-intro-text"),
        start: "top 80%",
        end: "top 20%",
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

  /* ── Physics ── */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    if (!section || !scene) return;

    const W = section.clientWidth;
    const H = section.clientHeight;

    /* ── Engine ── */
    const engine = Matter.Engine.create({
      enableSleeping: true,
      gravity: { x: 0, y: 1, scale: 0.0018 },
      positionIterations: 30,
      velocityIterations: 30,
      constraintIterations: 6,
    });
    engineRef.current = engine;

    /* ── Walls — 800px thick ── */
    const T = 800;
    const wallOpts = {
      isStatic: true as const,
      friction: 0.8,
      restitution: 0,
    };
    const floor = Matter.Bodies.rectangle(W / 2, H + T / 2, W * 6, T, {
      ...wallOpts,
      label: "floor",
    });
    const left = Matter.Bodies.rectangle(-T / 2, H / 2, T, H * 10, {
      ...wallOpts,
      label: "wall-left",
    });
    const right = Matter.Bodies.rectangle(W + T / 2, H / 2, T, H * 10, {
      ...wallOpts,
      label: "wall-right",
    });
    Matter.Composite.add(engine.world, [floor, left, right]);

    /* ── Measure brick sizes from inner span DOM elements ── */
    const sizes = BRICKS.map((_b, i) => {
      const el = innerRefs.current[i];
      return { w: el ? el.offsetWidth : 160, h: el ? el.offsetHeight : 56 };
    });

    /* ── Create brick bodies (NOT in world yet) ── */
    const cols = 4;
    const gap = W / (cols + 1);

    const bricks = BRICKS.map((_b, i) => {
      const bW = sizes[i].w;
      const bH = sizes[i].h;
      const col = i % cols;
      const x = Math.max(
        bW / 2 + 10,
        Math.min(
          W - bW / 2 - 10,
          gap * (col + 1) + (Math.random() - 0.5) * gap * 0.35,
        ),
      );
      const y = -bH / 2 - 200 - Math.random() * 100;

      return Matter.Bodies.rectangle(x, y, bW, bH, {
        restitution: 0.02,
        friction: 0.8,
        frictionStatic: 1.0,
        frictionAir: 0.03,
        density: 0.004,
        angle: (Math.random() - 0.5) * 1.3,
        slop: 0.05,
        sleepThreshold: 30,
        label: `brick-${i}`,
      });
    });
    bricksRef.current = bricks;

    /* ── Mouse constraint ── */
    const mouse = Matter.Mouse.create(scene);
    mouse.element.removeEventListener(
      "mousewheel",
      (mouse as unknown as Record<string, EventListener>).mousewheel,
    );
    mouse.element.removeEventListener(
      "DOMMouseScroll",
      (mouse as unknown as Record<string, EventListener>).mousewheel,
    );

    const mc = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.08,
        damping: 0.12,
        render: { visible: false },
      },
    });
    Matter.Composite.add(engine.world, mc);

    Matter.Events.on(mc, "startdrag", () => {
      scene.style.cursor = "grabbing";
    });
    Matter.Events.on(mc, "enddrag", () => {
      scene.style.cursor = "grab";
    });

    const handleLeave = () => {
      (mouse as unknown as { button: number }).button = -1;
      scene.style.cursor = "grab";
    };
    scene.addEventListener("mouseleave", handleLeave);

    /* ── beforeUpdate: clamp mouse, cap drag speed ── */
    const MAX_SPEED = 12;
    Matter.Events.on(engine, "beforeUpdate", () => {
      const mp = mouse.position as { x: number; y: number };
      if (mp.y > H - 30) mp.y = H - 30;
      const d = mc.body;
      if (!d) return;
      const spd = Math.hypot(d.velocity.x, d.velocity.y);
      if (spd > MAX_SPEED) {
        const s = MAX_SPEED / spd;
        Matter.Body.setVelocity(d, {
          x: d.velocity.x * s,
          y: d.velocity.y * s,
        });
      }
    });

    /*
     * ── afterUpdate: DOM sync ──
     *
     * MATCHING THE REFERENCE (ennexia.com):
     *   Outer wrapper <div>:  transform: translate(Xpx, Ypx)
     *   Inner <span>:         transform: translate(-50%, -50%) rotate(Xrad)
     *
     * This is critical. The -50%,-50% centering MUST be on an inner element
     * so it happens BEFORE rotation. If centering + rotation are on the same
     * element, CSS applies -50%,-50% in the rotated coordinate space, which
     * offsets the visual position from the physics body — making blocks LOOK
     * like they overlap / go through floors even when physics is correct.
     */
    Matter.Events.on(engine, "afterUpdate", () => {
      const idx = dropIdxRef.current;
      for (let i = 0; i < idx; i++) {
        const body = bricks[i];
        const wrap = wrapRefs.current[i];
        const inner = innerRefs.current[i];
        if (!wrap || !inner) continue;
        wrap.style.transform = `translate(${body.position.x}px,${body.position.y}px)`;
        inner.style.transform = `translate(-50%,-50%) rotate(${body.angle}rad)`;
      }
    });

    /* ── Drop in waves of 1-3 bricks with randomised timing ── */
    const releaseWave = () => {
      const idx = dropIdxRef.current;
      if (idx >= bricks.length) return;
      // Drop 1-3 bricks at once
      const count = Math.min(
        1 + Math.floor(Math.random() * 3),
        bricks.length - idx,
      );
      for (let n = 0; n < count; n++) {
        const body = bricks[idx + n];
        Matter.Composite.add(engine.world, body);
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 3.5,
          y: Math.random() * 2,
        });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
        // Show the wrapper
        const wrap = wrapRefs.current[idx + n];
        if (wrap) wrap.style.opacity = "1";
      }
      dropIdxRef.current = idx + count;
      // Schedule next wave
      if (dropIdxRef.current < bricks.length) {
        const delay = DROP_MIN + Math.random() * (DROP_MAX - DROP_MIN);
        timerRef.current = setTimeout(
          releaseWave,
          delay,
        ) as unknown as ReturnType<typeof setInterval>;
      }
    };

    /* ── Main loop ── */
    const DT = 1000 / 60;

    const tick = () => {
      /* Visibility trigger */
      if (!droppedRef.current) {
        const r = section.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85 && r.bottom > 0) {
          droppedRef.current = true;
          releaseWave();
        }
      }

      Matter.Engine.update(engine, DT);

      /* Safety net — only for extreme cases (5px tolerance) */
      const idx = dropIdxRef.current;
      for (let i = 0; i < idx; i++) {
        const body = bricks[i];
        if (body.bounds.max.y > H + 5) {
          const over = body.bounds.max.y - H;
          Matter.Body.setPosition(body, {
            x: body.position.x,
            y: body.position.y - over,
          });
          Matter.Body.setVelocity(body, {
            x: body.velocity.x * 0.3,
            y: 0,
          });
        }
        if (body.bounds.min.x < -5) {
          Matter.Body.setPosition(body, {
            x: body.position.x - body.bounds.min.x,
            y: body.position.y,
          });
          Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
        }
        if (body.bounds.max.x > W + 5) {
          Matter.Body.setPosition(body, {
            x: body.position.x - (body.bounds.max.x - W),
            y: body.position.y,
          });
          Matter.Body.setVelocity(body, { x: 0, y: body.velocity.y });
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    /* ── Resize ── */
    const resizeObs = new ResizeObserver(() => {
      if (!engineRef.current) return;
      const nw = section.clientWidth;
      const nh = section.clientHeight;
      Matter.Body.setPosition(floor, { x: nw / 2, y: nh + T / 2 });
      Matter.Body.setPosition(left, { x: -T / 2, y: nh / 2 });
      Matter.Body.setPosition(right, { x: nw + T / 2, y: nh / 2 });
    });
    resizeObs.observe(section);

    setReady(true);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObs.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current as unknown as number);
        timerRef.current = null;
      }
      droppedRef.current = false;
      dropIdxRef.current = 0;
      bricksRef.current = [];
      scene.removeEventListener("mouseleave", handleLeave);
      if (engineRef.current) {
        Matter.Events.off(engineRef.current, "afterUpdate");
        Matter.Events.off(engineRef.current, "beforeUpdate");
        Matter.Composite.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Render ── */
  return (
    <section
      ref={sectionRef}
      id="target"
      className="relative bg-white z-10 overflow-hidden"
      aria-label="Target"
      style={{ touchAction: "pan-x pan-y" }}
    >
      {/* Physics scene overlay */}
      <div
        ref={sceneRef}
        className="absolute inset-0 z-0"
        style={{ pointerEvents: "auto", cursor: "grab" }}
        aria-hidden="true"
      >
        {BRICKS.map((brick, i) => (
          /*
           * TWO-ELEMENT STRUCTURE (matches ennexia.com reference):
           *   Outer div  → translate(x, y)         (position from physics)
           *   Inner span → translate(-50%,-50%)     (center on position)
           *                rotate(angle)            (body rotation)
           *
           * The centering MUST be on the inner element so it's applied
           * before rotation. Otherwise -50%,-50% shifts in rotated space.
           */
          <div
            key={i}
            ref={(el) => {
              wrapRefs.current[i] = el;
            }}
            className="absolute top-0 left-0"
            style={{
              willChange: "transform",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <span
              ref={(el) => {
                innerRefs.current[i] = el;
              }}
              className="inline-block font-bold uppercase whitespace-nowrap select-none leading-none"
              style={{
                fontSize: "22px",
                padding: "16px 32px",
                borderRadius: "10px",
                backgroundColor: brick.color,
                color: brick.textColor,
                willChange: "transform",
              }}
            >
              {brick.label}
            </span>
          </div>
        ))}
      </div>

      <div className="container-content pt-24 md:pt-40 pb-16 md:pb-24 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <span
              className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
              style={{
                borderRadius: "7px",
                padding: "5px 14px",
                fontSize: "15px",
              }}
            >
              {"// Per chi siamo"}
            </span>
          </div>
          <div className="target-intro-text max-w-3xl">
            <h2 className="text-h2 font-medium leading-[1.2]">
              {INTRO_TEXT.split(" ").map((word, wi) => (
                <span key={wi} className="inline-block mr-[0.3em]">
                  {word.split("").map((char, ci) => (
                    <span
                      key={ci}
                      className="target-intro-char inline-block transition-colors duration-300 ease-out"
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

        {/* ── Fit / not-fit lists ── */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col gap-5 rounded-[10px] border border-black/15 bg-white p-6 md:p-8">
            <h3
              className="font-medium uppercase leading-none text-black"
              style={{ fontSize: "var(--font-h5)" }}
            >
              La scelta giusta per chi
            </h3>
            <ul className="flex flex-col gap-4">
              {FIT.map((item) => (
                <li key={item} className="flex gap-3 items-start text-black/80">
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-medium"
                    style={{ color: "var(--color-green)" }}
                  >
                    →
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5 rounded-[10px] border border-black/15 bg-white p-6 md:p-8">
            <h3
              className="font-medium uppercase leading-none text-black"
              style={{ fontSize: "var(--font-h5)" }}
            >
              Non siamo la scelta giusta per chi
            </h3>
            <ul className="flex flex-col gap-4">
              {NOT_FIT.map((item) => (
                <li key={item} className="flex gap-3 items-start text-black/60">
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-medium"
                    style={{ color: "var(--color-red)" }}
                  >
                    ×
                  </span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 pointer-events-none"
        style={{ height: "clamp(320px, 40vh, 500px)" }}
      />
    </section>
  );
}
