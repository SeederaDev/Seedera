"use client";

import { useRef, useState, useEffect } from "react";
import type { Progetto } from "@/lib/contenuti";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
/* Oggetti della conversazione: sostituiscono il vecchio elenco servizi.
   Il valore in query string (?oggetto=…) preseleziona il chip corrispondente. */
const SUBJECTS = [
  { label: "Un prodotto da costruire", value: "prodotto" },
  { label: "Un processo da automatizzare", value: "automazione" },
  { label: "La conoscenza dell'impresa da organizzare", value: "second-brain" },
  { label: "Una decisione da prendere", value: "consulenza" },
  { label: "Un'identità da costruire", value: "brand" },
  { label: "Un progetto per co-investimento", value: "co-investimento" },
  { label: "Non lo so ancora", value: "altro" },
];

const INTRO_TEXT =
  "Scegli un oggetto, raccontaci il problema, e premi invia. Niente brief — ci pensiamo noi.";

/* Endpoint di raccolta. Con output: 'export' non esistono API route: se la
   variabile non è configurata, il form ricade su un mailto precompilato. */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
const CONTACT_EMAIL = "info@seedera.it";

/* Gli slug della vetrina: la scelta editoriale resta qui, i dati (nome,
   categoria, copertina) arrivano dalla banca dati come nel portfolio. Prima
   erano copiati a mano, e un progetto rinominato restava vecchio qui. */
const IN_VETRINA = ["zentro", "brassicolo", "il-trust-in-italia", "perle-dell-elba"];

/* ── Drag cursor ── */
function DragCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isVisible = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, { opacity: 0, scale: 0.5, xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isVisible.current) {
        gsap.to(cursor, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.15,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const onShow = () => {
      isVisible.current = true;
      gsap.set(cursor, {
        left: mousePos.current.x,
        top: mousePos.current.y,
        scale: 0,
        opacity: 0,
      });
      gsap.to(cursor, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.4)",
        overwrite: true,
      });
    };

    const onHide = () => {
      isVisible.current = false;
      gsap.to(cursor, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: "power2.in",
        overwrite: true,
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("request-cursor-show", onShow);
    window.addEventListener("request-cursor-hide", onHide);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("request-cursor-show", onShow);
      window.removeEventListener("request-cursor-hide", onHide);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50"
      style={{ top: 0, left: 0, opacity: 0 }}
    >
      <div
        className="flex items-center justify-center rounded-full text-black font-bold text-center leading-tight uppercase"
        style={{
          width: "120px",
          height: "120px",
          fontSize: "13px",
          backgroundColor: "#CDFD51",
        }}
      >
        &lt; DRAG &gt;
      </div>
    </div>
  );
}

/* ── Portfolio Carousel ── */
function PortfolioCarousel({ progetti }: { progetti: Progetto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
    prevX: 0,
    velocity: 0,
    lastTime: 0,
    rafId: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    cancelAnimationFrame(dragState.current.rafId);
    gsap.killTweensOf(track, "scrollLeft");

    setIsDragging(true);
    dragState.current.startX = e.clientX;
    dragState.current.prevX = e.clientX;
    dragState.current.scrollLeft = track.scrollLeft;
    dragState.current.velocity = 0;
    dragState.current.lastTime = Date.now();
    track.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    const now = Date.now();
    const dt = now - dragState.current.lastTime;
    const dx = e.clientX - dragState.current.prevX;

    trackRef.current.scrollLeft =
      dragState.current.scrollLeft - (e.clientX - dragState.current.startX);

    if (dt > 0) {
      const instantVelocity = dx / dt;
      dragState.current.velocity =
        0.8 * dragState.current.velocity + 0.2 * instantVelocity;
    }

    dragState.current.prevX = e.clientX;
    dragState.current.lastTime = now;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const track = trackRef.current;
    if (!track) return;

    const v = dragState.current.velocity;
    const momentum = v * 800;
    const target = track.scrollLeft - momentum;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const clamped = Math.max(0, Math.min(maxScroll, target));

    gsap.to(track, {
      scrollLeft: clamped,
      duration: Math.min(1.2, Math.abs(momentum) / 600),
      ease: "power3.out",
      overwrite: true,
    });
  };

  const handleCursorShow = () => {
    window.dispatchEvent(new CustomEvent("request-cursor-show"));
  };

  const handleCursorHide = () => {
    window.dispatchEvent(new CustomEvent("request-cursor-hide"));
  };

  return (
    <section
      className="bg-white request-carousel-section"
      style={{ paddingBottom: "100px" }}
    >
      <DragCursor />

      {/* Header */}
      <div className="container-content mb-10 flex flex-col items-center text-center">
        <span
          className="inline-flex items-center border border-black text-black tracking-wide uppercase mb-4"
          style={{
            borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                lineHeight: "20px",
          }}
        >
          Portfolio
        </span>
        <h2
          className="text-h3 font-medium"
          style={{ color: "var(--color-black)" }}
        >
          Alcuni dei nostri lavori
        </h2>
      </div>

      {/* Carousel */}
      <div className="container-content overflow-visible">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide cursor-none select-none -mr-5 md:-mr-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            paddingRight: "20px",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={handleCursorShow}
          onMouseLeave={handleCursorHide}
        >
          {IN_VETRINA.map((slug) => progetti.find((p) => p.slug === slug))
            .filter((p) => p !== undefined)
            .map((project, i) => (
            <Link
              key={i}
              href={`/portfolio/${project.slug}`}
              className="shrink-0 block"
              style={{
                width: "clamp(260px, calc((100% - 48px) / 1.2), 420px)",
                minWidth: "260px",
              }}
              onClick={(e) => {
                if (isDragging) e.preventDefault();
              }}
            >
              <article>
                <div
                  className="relative overflow-hidden rounded-[10px] group"
                  style={{ aspectRatio: "3 / 4", maxHeight: "65vh" }}
                >
                  <img
                    src={project.copertina}
                    alt={project.cliente}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out scale-[1.15] group-hover:scale-100 will-change-transform"
                    draggable={false}
                  />
                </div>

                <p
                  className="mt-4 uppercase tracking-wide"
                  style={{
                    fontSize: "var(--font-p)",
                    color: "var(--color-middle-grey)",
                  }}
                >
                  {project.tag[0] || project.categoria}
                </p>

                <h3
                  className="uppercase tracking-wide font-medium"
                  style={{
                    fontSize: "var(--font-h4)",
                    color: "var(--color-black)",
                  }}
                >
                  {project.cliente}
                </h3>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Radio circle icon ── */
function RadioCircle({ selected }: { selected: boolean }) {
  return (
    <span
      className="shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
      style={{
        width: "22px",
        height: "22px",
        border: "2px solid var(--color-black)",
        backgroundColor: selected ? "var(--color-black)" : "transparent",
      }}
    >
      {selected && (
        <span
          className="block rounded-full"
          style={{
            width: "8px",
            height: "8px",
            backgroundColor: "var(--color-black)",
          }}
        />
      )}
    </span>
  );
}

/* ── Main page ── */
export default function PaginaParliamo({ progetti }: { progetti: Progetto[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [formData, setFormData] = useState({
    nome: "",
    azienda: "",
    email: "",
    progetto: "",
  });

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  /* Preselezione dell'oggetto via ?oggetto=… (es. dal CTA co-investimento) */
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("oggetto");
    if (!param) return;
    const match = SUBJECTS.find((s) => s.value === param);
    if (match) setSelectedSubjects([match.label]);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const payload = {
      ...formData,
      oggetto: selectedSubjects,
    };

    if (!FORM_ENDPOINT) {
      /* Nessun endpoint configurato: apriamo il client di posta precompilato
         invece di perdere silenziosamente la richiesta. */
      const body = [
        `Nome: ${payload.nome}`,
        `Azienda: ${payload.azienda || "—"}`,
        `Email: ${payload.email}`,
        `Oggetto: ${selectedSubjects.join(", ") || "—"}`,
        "",
        payload.progetto,
      ].join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Nuova conversazione — ${payload.nome || "senza nome"}`,
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("sent");
      setFormData({ nome: "", azienda: "", email: "", progetto: "" });
      setSelectedSubjects([]);
    } catch {
      setStatus("error");
    }
  };

  /* GSAP: text reveal */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll<HTMLElement>(
        ".request-intro-char",
      );
      if (chars.length === 0) return;

      const textContainer = section.querySelector(".request-intro-text");
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
    <>
      <Navbar />
      <main ref={sectionRef}>
        {/* ── Hero ── */}
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
              Apri una conversazione
            </h1>
          </div>
        </section>

        {/* ── Intro text ── */}
        <section className="bg-white">
          <div
            className="container-content request-intro-section"
            style={{ paddingTop: "60px", paddingBottom: "60px" }}
          >
            <div className="flex flex-col md:flex-row md:items-start">
              {/* Label pill */}
              <div className="shrink-0 mb-6 md:mb-0">
                <span
                  className="inline-flex items-center border border-black text-black tracking-wide uppercase"
                  style={{
                    borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                lineHeight: "20px",
                  }}
                >
                  Come funziona
                </span>
              </div>

              {/* Spacer */}

              {/* Text reveal */}
              <div className="request-col request-intro-text">
                <h2 className="text-h2 font-medium leading-[1.2]">
                  {INTRO_TEXT.split(" ").map((word, wi) => (
                    <span key={wi} className="inline-block mr-[0.3em]">
                      {word.split("").map((char, ci) => (
                        <span
                          key={ci}
                          className="request-intro-char inline-block transition-colors duration-300 ease-out"
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

        {/* ── Form ── */}
        <section
          className="bg-white request-form-section"
          style={{ paddingBottom: "120px" }}
        >
          <div className="container-content">
            <form
              onSubmit={handleSubmit}
              className="request-form flex flex-col"
              style={{ gap: "80px" }}
            >
              {/* ── OGGETTO ── */}
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="shrink-0 mb-6 md:mb-0">
                  <span
                    className="inline-flex items-center border border-black text-black tracking-wide uppercase"
                    style={{
                      borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                lineHeight: "20px",
                    }}
                  >
                    Oggetto
                  </span>
                </div>
                <div
                  className="request-col flex flex-col"
                  style={{ gap: "12px" }}
                >
                  {SUBJECTS.map((subject) => {
                    const isSelected = selectedSubjects.includes(subject.label);
                    return (
                      <button
                        key={subject.value}
                        type="button"
                        onClick={() => toggleSubject(subject.label)}
                        className={`form-option flex items-center justify-between w-full transition-all duration-300 text-left ${isSelected ? "form-option--active" : ""}`}
                        style={{
                          padding: "16px 20px",
                          fontSize: "var(--font-h4)",
                        }}
                      >
                        <span
                          className="transition-colors duration-300"
                          style={{
                            color: "var(--color-black)",
                          }}
                        >
                          {subject.label}
                        </span>
                        <RadioCircle selected={isSelected} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── PROGETTO ── */}
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="shrink-0 mb-6 md:mb-0">
                  <span
                    className="inline-flex items-center border border-black text-black tracking-wide uppercase"
                    style={{
                      borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                lineHeight: "20px",
                    }}
                  >
                    Progetto
                  </span>
                </div>
                <div
                  className="request-col flex flex-col"
                  style={{ gap: "4px" }}
                >
                  <input
                    type="text"
                    placeholder="Nome"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="w-full border-b bg-transparent outline-none transition-colors duration-300 focus:border-[var(--color-yellow)]"
                    style={{
                      padding: "16px 20px",
                      fontSize: "var(--font-h4)",
                      borderColor: "var(--color-light-grey)",
                      color: "var(--color-black)",
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Azienda"
                    value={formData.azienda}
                    onChange={(e) =>
                      setFormData({ ...formData, azienda: e.target.value })
                    }
                    className="w-full border-b bg-transparent outline-none transition-colors duration-300 focus:border-[var(--color-yellow)]"
                    style={{
                      padding: "16px 20px",
                      fontSize: "var(--font-h4)",
                      borderColor: "var(--color-light-grey)",
                      color: "var(--color-black)",
                    }}
                  />
                  <input
                    type="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border-b bg-transparent outline-none transition-colors duration-300 focus:border-[var(--color-yellow)]"
                    style={{
                      padding: "16px 20px",
                      fontSize: "var(--font-h4)",
                      borderColor: "var(--color-light-grey)",
                      color: "var(--color-black)",
                    }}
                  />
                  <textarea
                    placeholder="Descrivi il tuo progetto"
                    value={formData.progetto}
                    onChange={(e) =>
                      setFormData({ ...formData, progetto: e.target.value })
                    }
                    rows={4}
                    className="w-full border-b bg-transparent outline-none resize-none transition-colors duration-300 focus:border-[var(--color-yellow)]"
                    style={{
                      padding: "16px 20px",
                      fontSize: "var(--font-h4)",
                      borderColor: "var(--color-light-grey)",
                      color: "var(--color-black)",
                    }}
                  />
                </div>
              </div>

              {/* Nessuno step budget: la fascia di spesa non è un criterio di
                  ingaggio, e chiederla contraddice il metodo (prima il problema). */}

              {/* ── Submit ── */}
              <div
                className="request-col request-submit flex items-stretch group/submit"
                style={{ gap: "10px" }}
                onMouseEnter={(e) => {
                  e.currentTarget
                    .querySelectorAll<HTMLElement>(".submit-btn")
                    .forEach(
                      (btn) =>
                        (btn.style.backgroundColor = "var(--color-yellow)"),
                    );
                }}
                onMouseLeave={(e) => {
                  e.currentTarget
                    .querySelectorAll<HTMLElement>(".submit-btn")
                    .forEach(
                      (btn) => (btn.style.backgroundColor = "transparent"),
                    );
                }}
              >
                <button
                  type="submit"
                  className="submit-btn font-medium tracking-wide uppercase transition-all duration-300"
                  style={{
                    borderRadius: "5px",
                    border: "2px solid var(--color-yellow)",
                    padding: "12px 20px",
                    fontSize: "var(--font-btn)",
                    color: "var(--color-black)",
                    backgroundColor: "transparent",
                  }}
                >
                  {status === "sending" ? "Invio in corso…" : "Invia"}
                </button>
                <button
                  type="submit"
                  className="submit-btn flex items-center justify-center transition-all duration-300"
                  style={{
                    borderRadius: "5px",
                    border: "2px solid var(--color-yellow)",
                    width: "48px",
                    backgroundColor: "transparent",
                  }}
                  aria-label="Invia"
                >
                  <img
                    src="/next-arrow.svg"
                    alt=""
                    width={10}
                    height={16}
                    className="pointer-events-none"
                  />
                </button>
              </div>

              {/* ── Esito ── */}
              {status !== "idle" && status !== "sending" && (
                <p
                  role="status"
                  className="request-col leading-relaxed"
                  style={{
                    color:
                      status === "error"
                        ? "var(--color-red)"
                        : "var(--color-black)",
                  }}
                >
                  {status === "sent"
                    ? "Ricevuto. Ti rispondiamo noi, di persona, entro un giorno lavorativo."
                    : `Invio non riuscito. Scrivici direttamente a ${CONTACT_EMAIL}.`}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* ── Portfolio Carousel ── */}
        <PortfolioCarousel progetti={progetti} />
      </main>
      <Footer />
    </>
  );
}
