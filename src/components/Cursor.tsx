"use client";

import { useEffect, useRef, useCallback } from "react";
import "./Cursor.css";

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
