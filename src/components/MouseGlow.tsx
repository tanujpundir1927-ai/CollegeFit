"use client";

import { useEffect } from "react";

export default function MouseGlow() {
  useEffect(() => {
    const glow = document.getElementById("mouse-glow");
    if (!glow) return;

    const onMove = (e: PointerEvent) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top  = `${e.clientY}px`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      id="mouse-glow"
      className="mouse-glow"
      aria-hidden="true"
    />
  );
}
