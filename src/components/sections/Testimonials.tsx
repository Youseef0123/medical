"use client";

import { useState, useLayoutEffect, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { useInterval } from "@/lib/hooks/useInterval";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";
import { gsap } from "@/lib/gsap";

const AUTOPLAY_MS = 7000; // Slower interval for a calmer feel

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  useInterval(
    next,
    (prefersReducedMotion || isPaused) ? null : AUTOPLAY_MS
  );

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".animate-fade-up"), {
        opacity: 0,
        y: 20,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="testimonials" ref={sectionRef} className="bg-neutral-50 px-5 py-24 sm:px-8 border-t border-divider">
      <div className="mx-auto max-w-[1200px] grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
        
        {/* Left Column: Sticky Title & Navigation */}
        <div className="animate-fade-up sticky top-28 space-y-8 lg:pr-6">
          <div>
            <span className="mb-3 block text-[13px] font-semibold tracking-[0.15em] text-accent-700 uppercase">
              TRUSTED BY PROFESSIONALS
            </span>
            <h2 className="text-[32px] sm:text-[38px] font-semibold tracking-tight text-ink uppercase leading-tight max-w-[15ch]">
              What Healthcare Providers Say
            </h2>
          </div>

          {/* Minimalist Numeric Index & Control Buttons */}
          <div className="flex items-center gap-6">
            <div className="font-heading text-lg font-medium text-ink/40">
              <span className="text-accent-700 font-semibold text-xl">0{index + 1}</span>
              <span className="mx-1.5 text-ink/20">/</span>
              <span>0{testimonials.length}</span>
            </div>
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-divider bg-transparent text-ink transition-colors duration-300 hover:border-accent-700 hover:text-accent-700 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-divider bg-transparent text-ink transition-colors duration-300 hover:border-accent-700 hover:text-accent-700 cursor-pointer"
              >
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Sliding Testimonial Cards */}
        <div
          className="animate-fade-up relative min-h-[360px] sm:min-h-[290px] overflow-hidden lg:mt-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {testimonials.map((testimonial, i) => {
            const active = i === index;
            return (
              <div
                key={testimonial.name}
                aria-hidden={!active}
                className={cn(
                  "w-full transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
                  active
                    ? "relative opacity-100 translate-x-0 pointer-events-auto"
                    : "absolute opacity-0 translate-x-12 pointer-events-none"
                )}
              >
                {/* Elegant White Card with Blueprint Corners */}
                <div className="blueprint group relative bg-white p-8 sm:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.015)] transition-shadow duration-500 hover:shadow-[0_12px_32px_rgba(44,69,93,0.06)]">
                  <i className="corner tl text-accent-700/30" aria-hidden />
                  <i className="corner tr text-accent-700/30" aria-hidden />
                  <i className="corner bl text-accent-700/30" aria-hidden />
                  <i className="corner br text-accent-700/30" aria-hidden />

                  {/* Large Decorative Quote Watermark */}
                  <span className="absolute right-8 top-4 font-serif text-[120px] font-bold text-accent-100 opacity-20 pointer-events-none select-none">
                    “
                  </span>

                  {/* Testimonial Quote text */}
                  <p 
                    aria-live="polite"
                    className="relative z-10 mb-8 font-body text-lg sm:text-xl leading-relaxed text-ink/90 font-medium"
                  >
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  <hr className="border-t border-divider mb-6" />

                  {/* Doctor Profile Info */}
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full overflow-hidden border border-divider relative shrink-0">
                      <ImageSlot
                        src={testimonial.image}
                        alt={`Portrait of ${testimonial.name}`}
                        placeholderLabel={`Portrait of ${testimonial.name}`}
                        className="h-full w-full"
                      />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-ink uppercase tracking-wide">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs font-semibold text-accent-700 uppercase mt-0.5">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
