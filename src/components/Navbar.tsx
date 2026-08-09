"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useLenis } from "lenis/react";
import gsap from "gsap";

const NAV_ITEMS = [
  { label: "Metodo", href: "/#about" },
  { label: "Capacità", href: "/#services" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Progetti", href: "/#studio" },
  { label: "Partnership", href: "/#partnership" },
  { label: "Parliamo", href: "/parliamo" },
];

const MENU_PAGES = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Apri una conversazione", href: "/parliamo" },
];

/* ── Magnetic pill: subtly follows cursor on hover ── */
function MagneticPill({
  children,
  href,
  onClick,
  className,
  style,
}: {
  children: React.ReactNode;
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className: string;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: x * 0.3, y: y * 0.4, duration: 0.3, ease: "power2.out" });
  }, []);

  const handleLeave = useCallback(() => {
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.4)",
    });
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      style={{ ...style, willChange: "transform" }}
    >
      {children}
    </Link>
  );
}

/* ── Logo spin: spins 360° on click ── */
function SpinLogo() {
  return (
    <Link
      href="/"
      /* La pillola e' alta 30px: l'after invisibile estende il tocco a 44
         senza allargare lo sfondo nero (un padding lo farebbe). */
      className="relative z-50 flex items-center justify-center bg-black rounded-[5px] after:absolute after:-inset-y-[7px] after:inset-x-0 after:content-['']"
      /* Misurato sul PDF del design: pillola 40→147 x 15→45, cioe' 107x30, con
         il lettering bianco 85x14 centrato. Erano 142x42 con il logo a 18px, e
         i 35px di troppo spingevano a destra tutte le voci del menu. */
      style={{ padding: "8px 11px" }}
    >
      <Image
        src="/Seedera-Logo.svg"
        alt="Seedera"
        width={130}
        height={22}
        priority
        style={{
          height: "14px",
          width: "auto",
          filter: "invert(1) brightness(2)",
        }}
      />
    </Link>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showX, setShowX] = useState(false);
  const [linesWhite, setLinesWhite] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [clipOrigin, setClipOrigin] = useState("calc(100% - 40px) 28px");
  const lenis = useLenis();
  const pathname = usePathname();
  const router = useRouter();
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  // Sync clip origin to actual hamburger position on mount + resize
  useEffect(() => {
    const sync = () => {
      if (hamburgerRef.current) {
        const rect = hamburgerRef.current.getBoundingClientRect();
        setClipOrigin(
          `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`,
        );
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const handleNavClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
      href: string,
      closeMenu = false,
    ) => {
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : null;

      if (pathname === "/" && hash) {
        // On home page: smooth scroll to the section
        e.preventDefault();
        if (closeMenu) setIsOpen(false);
        const target = document.querySelector(hash);
        if (target && lenis) {
          lenis.scrollTo(target as HTMLElement, {
            duration: 1.4,
            easing: (t: number) => 1 - Math.pow(1 - t, 4),
          });
        }
      } else if (hash) {
        // On another page: navigate to home with hash
        e.preventDefault();
        if (closeMenu) setIsOpen(false);
        router.push(href);
      }
    },
    [lenis, pathname, router],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, lenis]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled && !isOpen ? "backdrop-blur-2xl bg-white/30" : ""
        }`}
      >
        <div className="container-content flex items-center justify-between py-3">
          {/* Left: Logo pill + Nav pills */}
          <div className="flex items-center gap-[10px]">
            {/* Logo pill - spins on click */}
            <SpinLogo />

            {/* Nav pills - hidden on mobile */}
            {/* Passo fra le pillole: nel design il testo di una voce finisce a
                218,03 e il successivo inizia a 248,14 → 30,11 di stacco, di cui
                22 sono padding e bordo delle due pillole. Restano 8, non 10. */}
            <nav
              className="hidden md:flex items-center gap-[8px]"
              aria-label="Navigazione principale"
            >
              {NAV_ITEMS.map((item) => (
                <MagneticPill
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-black rounded-[5px] border border-black hover:bg-black hover:text-white transition-all duration-300"
                  /* 14/20 come ogni altro badge del design. Con 20px ogni voce
                     era larga ~22px in piu' e l'errore si accumulava: l'ultima
                     finiva 169px oltre la sua x (misura_testi.mjs). */
                  style={{
                    padding: "5px 10px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 400,
                  }}
                >
                  {item.label}
                </MagneticPill>
              ))}
            </nav>
          </div>

          {/* Right: Hamburger - always visible */}
          <button
            ref={hamburgerRef}
            onClick={() => {
              if (hamburgerRef.current) {
                const rect = hamburgerRef.current.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                setClipOrigin(`${cx}px ${cy}px`);
              }
              if (isOpen) {
                // Closing: animate X → lines while still white, then close menu, then turn black
                setShowX(false);
                setTimeout(() => setIsOpen(false), 100);
                setTimeout(() => setLinesWhite(false), 800);
              } else {
                // Opening: open menu, show X and turn white immediately
                setIsOpen(true);
                setShowX(true);
                setLinesWhite(true);
              }
            }}
            className={`relative z-50 flex flex-col justify-center items-center ${
              showX ? "hamburger-open" : ""
            }`}
            /* Le tre linee misurano 33x17: il padding simmetrico porta il
               bersaglio di tocco a 45px e il margine negativo lo compensa,
               cosi' il layout (e il centro usato dal clip-path) non cambia. */
            style={{ gap: "7px", padding: "14px 6px", margin: "-14px -6px" }}
            aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
            aria-expanded={isOpen}
          >
            <span
              className={`hamburger-line block transition-colors duration-300 ${linesWhite ? "bg-white" : "bg-black"}`}
              style={{ width: "33px", height: "1px" }}
            />
            <span
              className={`hamburger-line block transition-colors duration-300 ${linesWhite ? "bg-white" : "bg-black"}`}
              style={{ width: "33px", height: "1px" }}
            />
            <span
              className={`hamburger-line block transition-colors duration-300 ${linesWhite ? "bg-white" : "bg-black"}`}
              style={{ width: "33px", height: "1px" }}
            />
          </button>
        </div>
      </header>

      {/* Fullscreen menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black flex flex-col ${
          isOpen ? "menu-open pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          clipPath: isOpen
            ? `circle(150% at ${clipOrigin})`
            : `circle(0% at ${clipOrigin})`,
          transition: "clip-path 0.7s cubic-bezier(0.77, 0, 0.18, 1)",
        }}
      >
        {/* Top spacer to push nav below header */}
        <div className="shrink-0" style={{ height: "64px" }} />

        {/* Nav links – scrollable if screen is short */}
        <nav className="flex-1 min-h-0 overflow-y-auto container-content flex flex-col">
          <div className="my-auto">
            {MENU_PAGES.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="mobile-menu-link text-white font-bold tracking-tight hover:text-primary transition-colors duration-300 border-b border-white/10 flex"
                style={{
                  transitionDelay: isOpen ? `${0.3 + i * 0.06}s` : "0s",
                  fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
                  paddingBlock: "clamp(0.6rem, 2vh, 1.25rem)",
                }}
              >
                <span className="flex items-center justify-between w-full">
                  <span>{item.label}</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="opacity-40 shrink-0"
                  >
                    <path
                      d="M5 15L15 5M15 5H6M15 5v9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Bottom info */}
        <div
          className="shrink-0 container-content mobile-menu-link"
          style={{
            paddingBottom: "clamp(1rem, 3vh, 2rem)",
            transitionDelay: isOpen
              ? `${0.3 + MENU_PAGES.length * 0.06}s`
              : "0s",
          }}
        >
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Seedera. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </>
  );
}
