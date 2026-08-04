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

    const handleMouseMove = (e: MouseEvent) => {
      // Dot follows instantly (no CSS transition on left/top)
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      // Shadow follows with CSS transition (smooth trailing)
      shadow.style.left = `${e.clientX}px`;
      shadow.style.top = `${e.clientY}px`;

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
        style={{ left: "-100px", top: "-100px" }}
      />
      <div
        ref={dotRef}
        className="cursor cursor-dot"
        style={{ left: "-100px", top: "-100px" }}
      />
    </>
  );
}
