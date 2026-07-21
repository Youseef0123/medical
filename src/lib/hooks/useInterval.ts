"use client";

import { useEffect, useRef } from "react";

/**
 * Dan Abramov's declarative setInterval hook. Pass `delay: null` to pause
 * (used to skip autoplay under prefers-reduced-motion).
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
