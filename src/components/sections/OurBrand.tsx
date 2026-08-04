"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";

/* ── Data ── */
interface OwnProject {
  category: string;
  name: string;
  image: string;
  slug: string;
}

const OWN_PROJECTS: OwnProject[] = [
  {
    category: "CRM",
    name: "ZENTRO",
    image: "/images/our-brand/zentro.png",
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
  {
    category: "COMUNICAZIONE",
    name: "PIANO CITY NAPOLI",
    image: "/images/projects/piano-city-napoli/pcn1.jpg",
    slug: "piano-city-napoli",
  },
];

/* ── Custom drag cursor ── */
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
    window.addEventListener("own-project-cursor-show", onShow);
    window.addEventListener("own-project-cursor-hide", onHide);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("own-project-cursor-show", onShow);
      window.removeEventListener("own-project-cursor-hide", onHide);
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

/* ── Main component ── */
export default function OurBrand() {
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

  /* Drag handlers with inertia */
  const handlePointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    // Kill any ongoing inertia animation
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

    // Update scroll position
    trackRef.current.scrollLeft =
      dragState.current.scrollLeft - (e.clientX - dragState.current.startX);

    // Track velocity (px/ms) with smoothing
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

    // Apply inertia: coast with the current velocity
    const v = dragState.current.velocity; // px/ms
    const momentum = v * 800; // distance to glide
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
    window.dispatchEvent(new CustomEvent("own-project-cursor-show"));
  };

  const handleCursorHide = () => {
    window.dispatchEvent(new CustomEvent("own-project-cursor-hide"));
  };

  return (
    <section
      className="relative bg-white z-10 pb-24 md:pb-40"
      aria-label="Progetti proprietari"
    >
      <DragCursor />

      {/* Carousel wrapper inside container */}
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
          {OWN_PROJECTS.map((project, i) => (
            <article
              key={i}
              className="shrink-0"
              style={{
                width: "clamp(260px, calc((100% - 48px) / 1.2), 420px)",
                minWidth: "260px",
              }}
            >
              {/* Image with hover zoom */}
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

              {/* Category */}
              <p
                className="mt-4 uppercase tracking-wide"
                style={{
                  fontSize: "var(--font-p)",
                  color: "var(--color-middle-grey)",
                }}
              >
                {project.category}
              </p>

              {/* Project name */}
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
                  {project.name}
                </Link>
              </h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
