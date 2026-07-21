"use client";

import { useState } from "react";
import { statCounters } from "@/data/stats";
import { Card } from "@/components/ui/Card";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { useInterval } from "@/lib/hooks/useInterval";
import { cn } from "@/lib/cn";

const COUNT_STEPS = 40;
const COUNT_STEP_MS = 30;

function formatCount(target: number, progress: number, format?: "thousand") {
  const current = Math.round(target * progress);
  if (format === "thousand") return `${Math.round(current / 1000)}k`;
  return `${current}`;
}

export function About() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold: 0.3,
  });
  const [step, setStep] = useState(0);
  const counting = isIntersecting && step < COUNT_STEPS;

  useInterval(
    () => setStep((s) => Math.min(COUNT_STEPS, s + 1)),
    counting ? COUNT_STEP_MS : null
  );

  const progress = step / COUNT_STEPS;

  return (
    <section id="about" ref={ref} className="px-5 py-22 sm:px-8">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          className={cn(
            "transition-[opacity,transform] duration-[600ms] ease-out",
            isIntersecting
              ? "translate-x-0 opacity-100"
              : "-translate-x-6 opacity-0"
          )}
        >
          <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
            About Medisave
          </span>
          <h2 className="mb-4.5 text-[32px] font-semibold tracking-tight text-ink uppercase">
            Formulated for trust, manufactured for scale
          </h2>
          <p className="mb-7 max-w-[56ch] text-base leading-relaxed text-ink/80">
            Medisave develops and manufactures pharmaceutical products across
            neurology, mental health, cardiology and metabolic care. Every
            formula is validated against pharmacopeial standard before it
            reaches a pharmacy shelf, and every batch is traceable from raw
            material to patient.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {statCounters.map((stat) => (
              <Card key={stat.label} className="p-4 text-center">
                <div className="font-heading text-[28px] font-semibold text-accent-700 tabular-nums">
                  {formatCount(stat.target, progress, stat.format)}
                  {stat.suffix}
                </div>
                <div className="mt-1 text-xs tracking-wide text-ink/70 uppercase">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "transition-[opacity,transform] delay-100 duration-[600ms] ease-out",
            isIntersecting
              ? "translate-x-0 opacity-100"
              : "translate-x-6 opacity-0"
          )}
        >
          <Card className="aspect-4/3 overflow-visible">
            <ImageSlot
              alt="Medisave manufacturing facility"
              placeholderLabel="About / facility photo"
              className="h-full w-full"
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
