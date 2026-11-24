"use client";

import { useEffect } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Smooth scrolling. The instance is exposed on window so overlays can pause it. */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.1
    });
    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}

/** Pause/resume page scrolling (menu, modals, loader). */
export function lockScroll(locked: boolean) {
  if (typeof window === "undefined") return;
  if (locked) window.__lenis?.stop();
  else window.__lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
