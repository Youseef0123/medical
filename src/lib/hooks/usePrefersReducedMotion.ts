"use client";

import { useEffect, useState } from "react";

/** Used to skip autoplay (hero/testimonial carousels) for motion-sensitive users. */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(query.matches);
    const onChange = () => setPrefersReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}
