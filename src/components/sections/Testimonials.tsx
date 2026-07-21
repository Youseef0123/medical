"use client";

import { useState } from "react";
import { testimonials } from "@/data/testimonials";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useInterval } from "@/lib/hooks/useInterval";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

const AUTOPLAY_MS = 6000;

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useInterval(
    () => setIndex((i) => (i + 1) % testimonials.length),
    prefersReducedMotion ? null : AUTOPLAY_MS
  );

  return (
    <section id="testimonials" className="px-5 py-22 sm:px-8">
      <div className="mx-auto max-w-[760px] text-center">
        <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
          Testimonials
        </span>
        <h2 className="mb-10 text-[32px] font-semibold tracking-tight text-ink uppercase">
          Trusted by practitioners
        </h2>

        <div className="relative min-h-[220px]">
          {testimonials.map((testimonial, i) => {
            const active = i === index;
            return (
              <div
                key={testimonial.name}
                aria-hidden={!active}
                className={cn(
                  "inset-x-0 top-0 w-full transition-opacity duration-500 ease-out",
                  active
                    ? "relative opacity-100 pointer-events-auto"
                    : "absolute opacity-0 pointer-events-none"
                )}
              >
                <Card className="mx-auto mb-4 h-18 w-18 overflow-visible">
                  <ImageSlot
                    alt={`Portrait of ${testimonial.name}`}
                    placeholderLabel={`Portrait of ${testimonial.name}`}
                    className="h-full w-full"
                  />
                </Card>
                <p className="mb-4 font-heading text-[22px] leading-relaxed font-semibold text-ink">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="text-sm font-semibold text-ink">
                  {testimonial.name}
                </div>
                <div className="text-[13px] text-ink/65">
                  {testimonial.title}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-2.5">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                "h-2 border border-accent-700 p-0 transition-all duration-300",
                i === index ? "w-[22px] bg-accent-700" : "w-2 bg-transparent"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
