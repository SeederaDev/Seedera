"use client";

import { useEffect, useRef, useCallback } from "react";
import "./Cursor.css";

/* Il primo sfondo pieno sotto il puntatore e' scuro? Si risale dall'elemento
   sotto il mouse fino al primo con un colore di fondo quasi opaco; le velature
   (bg-black/5 sulle card) si saltano. Calcolato una volta per elemento. */
const scuri = new WeakMap<Element, boolean>();
function fondoScuro(el: Element | null): boolean {
  const partenza = el;
  for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
    const noto = scuri.get(n);
    if (noto !== undefined) return noto;
    const m = getComputedStyle(n).backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (m && (m[4] === undefined || Number(m[4]) > 0.5)) {
      const scuro = 0.2126 * Number(m[1]) + 0.7152 * Number(m[2]) + 0.0722 * Number(m[3]) < 110;
      if (partenza) scuri.set(partenza, scuro);
      return scuro;
    }
  }
  return false;
}

export default function Cursor() {
  const shadowRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef(false);

  const updateVisibility = useCallback((hidden: boolean) => {
    hiddenRef.current = hidden;
    if (shadowRef.current) shadowRef.current.style.opacity = hidden ? "0" : "1";
    if (dotRef.current) dotRef.current.style.opacity = hidden ? "0" : "1";
  }, []);

  useEffect(() => {
    const shadow = shadowRef.current;
    const dot = dotRef.current;
    if (!shadow || !dot) return;

    /* Inseguimento morbido con lerp in requestAnimationFrame.
     *
     * Prima la posizione si scriveva su left/top con una transizione CSS: ogni
     * mousemove la faceva ripartire da zero, quindi finche' il mouse si muoveva
     * il cerchio non arrivava mai a destinazione e sembrava muoversi solo alla
     * fermata. Il lerp invece avanza a ogni frame verso l'ultima posizione
     * nota, quindi segue sempre, in movimento e da fermo.
     *
     * Si scrive transform (compositabile) e non left/top, che sono proprieta'
     * di layout e costringono il browser a ricalcolare a ogni frame. */
    let mx = -100;
    let my = -100;
    let sx = -100;
    let sy = -100;
    let raf = 0;

    const anima = () => {
      // 0.18 e' il "peso" del cerchio: piu' basso, piu' resta indietro.
      sx += (mx - sx) * 0.18;
      sy += (my - sy) * 0.18;
      shadow.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      raf = requestAnimationFrame(anima);
    };
    raf = requestAnimationFrame(anima);

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      // Check if hovering an interactive element
      const target = e.target as HTMLElement;
      const isLink =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest(".cursor-link");

      shadow.classList.toggle("active", !!isLink);
      dot.classList.toggle("active", !!isLink);
      // Il cerchio e' nero: sul fondo nero (menu, Partnership) spariva.
      shadow.classList.toggle("su-scuro", fondoScuro(target));
    };

    const handleLeave = () => {
      shadow.classList.remove("active");
      dot.classList.remove("active");
    };

    // Hide cursor when custom project / drag cursors appear
    const show = () => updateVisibility(false);
    const hide = () => updateVisibility(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("project-cursor-show", hide);
    window.addEventListener("project-cursor-hide", show);
    window.addEventListener("own-project-cursor-show", hide);
    window.addEventListener("own-project-cursor-hide", show);
    window.addEventListener("similar-cursor-show", hide);
    window.addEventListener("similar-cursor-hide", show);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("project-cursor-show", hide);
      window.removeEventListener("project-cursor-hide", show);
      window.removeEventListener("own-project-cursor-show", hide);
      window.removeEventListener("own-project-cursor-hide", show);
      window.removeEventListener("similar-cursor-show", hide);
      window.removeEventListener("similar-cursor-hide", show);
    };
  }, [updateVisibility]);

  return (
    <>
      <div
        ref={shadowRef}
        className="cursor cursor-shadow"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
      <div
        ref={dotRef}
        className="cursor cursor-dot"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
    </>
  );
}
