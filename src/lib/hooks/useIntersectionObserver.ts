"use client";

import { useEffect, useRef, useState } from "react";

interface Options {
  threshold?: number;
  /** Once true, stop observing — used for one-shot reveal/counter triggers. */
  triggerOnce?: boolean;
}

/** Observes an element and reports whether it has entered the viewport. */
export function useIntersectionObserver<T extends HTMLElement>({
  threshold = 0.3,
  triggerOnce = true,
}: Options = {}) {
  const ref = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, triggerOnce]);

  return { ref, isIntersecting };
}
