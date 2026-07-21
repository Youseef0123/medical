"use client";

import { useEffect, useState } from "react";

/** True when the primary pointer supports real hover (mouse/trackpad), false on touch. */
export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover)");
    setHoverCapable(query.matches);
    const onChange = () => setHoverCapable(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return hoverCapable;
}
