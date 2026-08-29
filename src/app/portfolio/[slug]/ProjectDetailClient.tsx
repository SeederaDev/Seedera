"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isVideo } from "@/lib/progetti";
import type { Progetto } from "@/lib/contenuti";

gsap.registerPlugin(ScrollTrigger);


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
    window.addEventListener("similar-cursor-show", onShow);
    window.addEventListener("similar-cursor-hide", onHide);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("similar-cursor-show", onShow);
      window.removeEventListener("similar-cursor-hide", onHide);
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

/* ── Similar projects carousel ── */
function SimilarCarousel({ altri }: { altri: Progetto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({
    startX: 0,
    scrollLeft: 0,
    prevX: 0,
    velocity: 0,
    lastTime: 0,
    rafId: 0,
    hasDragged: false,
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
    dragState.current.hasDragged = false;
    track.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !trackRef.current) return;
    const now = Date.now();
    const dt = now - dragState.current.lastTime;
    const dx = e.clientX - dragState.current.prevX;
    const totalDx = Math.abs(e.clientX - dragState.current.startX);

    if (totalDx > 5) {
      dragState.current.hasDragged = true;
    }

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
    window.dispatchEvent(new CustomEvent("similar-cursor-show"));
  };

  const handleCursorHide = () => {
    window.dispatchEvent(new CustomEvent("similar-cursor-hide"));
  };

  return (
    <section className="bg-white pb-24 md:pb-40">
      <DragCursor />

      {/* Header */}
      <div className="container-content mb-10 flex flex-col items-center text-center">
        <span
          className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase mb-4"
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
          Qui titolo sui lavori simili
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
          {altri.map((project, i) => (
            <article
              key={i}
              className="shrink-0"
              style={{
                width: "clamp(260px, calc((100% - 48px) / 1.2), 420px)",
                minWidth: "260px",
              }}
            >
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
                <Link
                  href={`/portfolio/${project.slug}`}
                  style={{ cursor: "pointer" }}
                  onPointerDown={(e) => e.stopPropagation()}
                  onMouseEnter={handleCursorHide}
                  onMouseLeave={handleCursorShow}
                >
                  {project.cliente}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Project Detail Page ── */
export default function ProjectDetailClient({
  project,
  altri,
}: {
  project: Progetto;
  altri: Progetto[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* GSAP: text reveal animation */
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const chars = section.querySelectorAll<HTMLElement>(".detail-intro-char");
      if (chars.length === 0) return;

      const introContainer = section.querySelector(".detail-intro-text");
      ScrollTrigger.create({
        trigger: introContainer,
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

      // Image reveal on scroll
      const images = section.querySelectorAll<HTMLElement>(".detail-image");
      images.forEach((img) => {
        gsap.from(img, {
          y: 60,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: img,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
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
          className="relative w-full flex flex-col justify-end"
          style={{
            height: "350px",
            backgroundColor: "var(--color-yellow)",
            paddingTop: "80px",
          }}
        >
          <div className="container-content pb-10">
            <h1 className="text-h1 text-black font-normal uppercase select-none">
              {project.cliente}
            </h1>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tag.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
                  style={{
                    borderRadius: "5px",
                padding: "5px 10px",
                fontSize: "14px",
                lineHeight: "20px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Description: label left, text right ── */}
        <section className="bg-white" style={{ paddingTop: "110px" }}>
          <div className="container-content pb-16 md:pb-24">
            <div className="flex flex-col md:flex-row md:items-start">
              {/* Label pill */}
              <div className="shrink-0 mb-6 md:mb-0">
                <span
                  className="inline-flex items-center border border-black text-black font-medium tracking-wide uppercase"
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

              {/* Spacer */}
              <div className="hidden md:block w-[20%] shrink-0" />

              {/* Text reveal */}
              <div className="flex-1 detail-intro-text">
                <h2 className="text-h2 font-medium leading-[1.2]">
                  {(project.descrizione ?? "").split(" ").map((word, wi) => (
                    <span key={wi} className="inline-block mr-[0.3em]">
                      {word.split("").map((char, ci) => (
                        <span
                          key={ci}
                          className="detail-intro-char inline-block transition-colors duration-300 ease-out"
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

        {/* ── Full-width images ── */}
        <section className="bg-white">
          <div
            className="container-content pb-24 md:pb-40 flex flex-col"
            style={{ gap: "24px" }}
          >
            {project.media.map((src, i) => (
              <div
                key={i}
                className="detail-image w-full overflow-hidden bg-white"
                style={{ borderRadius: "10px" }}
              >
                {isVideo(src) ? (
                  <video
                    src={src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                    style={{ maxHeight: "85vh", objectFit: "contain" }}
                  />
                ) : (
                  <img
                    src={src}
                    alt={`${project.cliente} - immagine ${i + 1}`}
                    className="w-full h-auto"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── Similar projects carousel ── */}
        <SimilarCarousel altri={altri} />
      </main>
      <Footer />
    </>
  );
}
