"use client";

import { useState } from "react";
import { heroSlides } from "@/data/hero";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useInterval } from "@/lib/hooks/useInterval";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

interface HeroProps {
  /** Autoplay interval in ms; configurable per the "autoplay + configurable interval" requirement. */
  autoplayMs?: number;
}

export function Hero({ autoplayMs = 5000 }: HeroProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const next = () => setIndex((i) => (i + 1) % heroSlides.length);
  const prev = () => setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length);

  useInterval(next, prefersReducedMotion ? null : autoplayMs);

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-accent-100 px-5 pt-32 pb-24 sm:px-8"
    >
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative min-h-[480px] pb-16 sm:min-h-[380px]">
          {heroSlides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={slide.title}
                aria-hidden={!active}
                className={cn(
                  "inset-x-0 top-0 w-full transition-[opacity,transform] duration-[600ms] ease-out",
                  active
                    ? "relative opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "absolute opacity-0 scale-[0.97] translate-y-2 pointer-events-none"
                )}
              >
                <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
                  {slide.kicker}
                </span>
                <h1 className="mb-5 max-w-[14ch] text-[34px] leading-[1.05] font-semibold tracking-tight text-ink uppercase sm:text-[52px]">
                  {slide.title}
                </h1>
                <p className="mb-7 max-w-[52ch] text-[17px] leading-relaxed text-ink/80">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" href="#products">
                    {slide.cta}
                  </Button>
                  <Button variant="ghost" href="#about">
                    Learn more
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="flex h-8 w-8 items-center justify-center border border-divider text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            {heroSlides.map((slide, i) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "h-2 border border-accent-700 p-0 transition-all duration-300",
                  i === index ? "w-[22px] bg-accent-700" : "w-2 bg-transparent"
                )}
              />
            ))}
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="flex h-8 w-8 items-center justify-center border border-divider text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <Card className="hidden aspect-square items-center justify-center text-accent-700 lg:flex">
          <svg width="46%" height="46%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M10.5 20.5l-6-6a4.5 4.5 0 0 1 6-6.7l.5.4.5-.4a4.5 4.5 0 0 1 6 6.7l-6 6a1 1 0 0 1-1 0z" />
            <path d="M2 12h3l1.5-3 2 6 1.5-4h3" />
          </svg>
        </Card>
      </div>
    </section>
  );
}
