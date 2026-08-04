"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ── */
const SERVICES = [
  "Brand Identity",
  "Website e E-commerce",
  "Software Development",
  "Comunicazione Marketing",
  "Business Development",
  "Performance Marketing",
];

const BUDGETS = ["€ 10-25K", "€ 25-50K", "€ 50-100K", "€ 100-200K", "€ + 200K"];

const INTRO_TEXT =
  "Compila il modulo per parlare del lavoro sa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus sociis natoque penatibus et m";

interface SimilarProject {
  category: string;
  name: string;
  image: string;
  slug: string;
}

const SIMILAR_PROJECTS: SimilarProject[] = [
  {
    category: "CRM",
    name: "ZENTRO",
    image: "/images/projects/zentro/zentro1.jpg",
    slug: "zentro",
  },
  {
    category: "BRAND IDENTITY",
    name: "BRASSICOLO",
    image: "/images/projects/brassicolo/brass-1.jpg",
    slug: "brassicolo",
  },
  {
    category: "BRAND IDENTITY",
    name: "IL TRUST IN ITALIA",
    image: "/images/projects/il-trust-in-italia/trust1.jpg",
    slug: "il-trust-in-italia",
  },
  {
    category: "BRAND IDENTITY",
    name: "PERLE DELL'ELBA",
    image: "/images/projects/perle-dell-elba/perle2.jpg",
    slug: "perle-dell-elba",
  },
];

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
function PortfolioCarousel() {
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
          className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase mb-4"
          style={{
            borderRadius: "7px",
            padding: "5px 14px",
            fontSize: "15px",
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
          {SIMILAR_PROJECTS.map((project, i) => (
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
                    src={project.image}
                    alt={project.name}
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
                  {project.category}
                </p>

                <h3
                  className="uppercase tracking-wide font-medium"
                  style={{
                    fontSize: "var(--font-h4)",
                    color: "var(--color-black)",
                  }}
                >
                  {project.name}
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
export default function RichiediPreventivoPage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    azienda: "",
    email: "",
    progetto: "",
  });

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
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
              Richiedi Preventivo
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
                  className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
                  style={{
                    borderRadius: "7px",
                    padding: "5px 14px",
                    fontSize: "15px",
                  }}
                >
                  Intestazione
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
              onSubmit={(e) => e.preventDefault()}
              className="request-form flex flex-col"
              style={{ gap: "80px" }}
            >
              {/* ── SERVIZIO ── */}
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="shrink-0 mb-6 md:mb-0">
                  <span
                    className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
                    style={{
                      borderRadius: "7px",
                      padding: "5px 14px",
                      fontSize: "15px",
                    }}
                  >
                    Servizio
                  </span>
                </div>
                <div
                  className="request-col flex flex-col"
                  style={{ gap: "12px" }}
                >
                  {SERVICES.map((service) => {
                    const isSelected = selectedServices.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
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
                          {service}
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
                    className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
                    style={{
                      borderRadius: "7px",
                      padding: "5px 14px",
                      fontSize: "15px",
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

              {/* ── BUDGET ── */}
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="shrink-0 mb-6 md:mb-0">
                  <span
                    className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
                    style={{
                      borderRadius: "7px",
                      padding: "5px 14px",
                      fontSize: "15px",
                    }}
                  >
                    Budget
                  </span>
                </div>
                <div
                  className="request-col flex flex-col"
                  style={{ gap: "12px" }}
                >
                  {BUDGETS.map((budget) => {
                    const isSelected = selectedBudget === budget;
                    return (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setSelectedBudget(budget)}
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
                          {budget}
                        </span>
                        <RadioCircle selected={isSelected} />
                      </button>
                    );
                  })}
                </div>
              </div>

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
                  Invia Richiesta
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
            </form>
          </div>
        </section>

        {/* ── Portfolio Carousel ── */}
        <PortfolioCarousel />
      </main>
      <Footer />
    </>
  );
}
