import type Lenis from "lenis";

const easing = (t: number) => 1 - Math.pow(1 - t, 4);

/**
 * Scorre fino a una sezione della home e controlla di esserci arrivato.
 *
 * Le sezioni agganciate da GSAP (le card delle Capacità, Studio) cambiano le
 * misure della pagina mentre si scorre: Lenis calcola la meta al clic, e su
 * Partnership si fermava a 432px dal bordo (misurato anche sul sito online).
 * A fine corsa si rimisura e, se serve, si fa l'ultimo tratto, al massimo due
 * volte.
 */
export function scrollaASezione(lenis: Lenis, sezione: HTMLElement, tentativi = 2) {
  lenis.scrollTo(sezione, {
    duration: tentativi === 2 ? 1.4 : 0.6,
    easing,
    onComplete: () => {
      if (tentativi > 0 && Math.abs(sezione.getBoundingClientRect().top) > 4) {
        scrollaASezione(lenis, sezione, tentativi - 1);
      }
    },
  });
}
