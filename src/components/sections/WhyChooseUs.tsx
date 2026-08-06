"use client";

import { featureCards } from "@/data/features";
import { Card } from "@/components/ui/Card";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { cn } from "@/lib/cn";
import type { FeatureCard } from "@/types";

const icons: Record<FeatureCard["icon"], React.ReactNode> = {
  quality: (
    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
  ),
  trust: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  accessibility: (
    <>
      <circle cx="12" cy="9" r="3" />
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z" />
    </>
  ),
  integrity: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
};

export function WhyChooseUs() {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLElement>({
    threshold: 0.2,
  });

  return (
    <section
      id="why"
      ref={ref}
      className="bg-neutral-100 px-5 py-22 sm:px-8"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-11 text-center">
          <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
            Why Choose Us
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-ink uppercase">
            Built on four commitments
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card, i) => (
            <Card
              key={card.title}
              className={cn(
                "p-6 transition-[opacity,transform] duration-500 ease-out",
                isIntersecting
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="mb-4 text-accent-700"
              >
                {icons[card.icon]}
              </svg>
              <h3 className="mb-2 font-heading text-lg font-semibold text-ink uppercase">
                {card.title}
              </h3>
              <p className="mb-3 text-sm leading-relaxed text-ink/80">
                {card.description}
              </p>
              <div className="font-heading text-[15px] tracking-wide text-accent-700 tabular-nums">
                {card.stat}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
