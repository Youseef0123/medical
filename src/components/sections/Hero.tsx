"use client";

import { useState } from "react";
import Image from "next/image";
import { heroSlides } from "@/data/hero";
import { CtaButton } from "@/components/ui/CtaButton";
import { useInterval } from "@/lib/hooks/useInterval";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

interface HeroProps {
  /** Autoplay interval in ms; configurable per the "autoplay + configurable interval" requirement. */
  autoplayMs?: number;
}

const slideImages = [
  "/images/about/hero-about.jpg",
  "/images/about/vision-mission.jpg",
  "/images/about/about-intro.jpg",
  "/images/about/hero-medicines.jpg",
];

export function Hero({ autoplayMs = 5000 }: HeroProps) {
  const [index, setIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const next = () => setIndex((i) => (i + 1) % heroSlides.length);

  // Auto-advance slides unless reduced motion is preferred
  useInterval(next, prefersReducedMotion ? null : autoplayMs);

  return (
    <section
      id="home"
      className="relative w-full h-screen overflow-hidden bg-zinc-950"
    >
      {/* Background Images with Crossfade & Parallax Transition */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, i) => {
          const isActive = i === index;
          return (
            <div
              key={slide.title}
              className={cn("hero-bg-container", isActive && "active")}
              style={{
                "--autoplay-duration": "8000ms", // Ken Burns effect zoom duration
              } as React.CSSProperties}
            >
              <Image
                src={slideImages[i]}
                alt={slide.title}
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                className="hero-bg-image object-cover"
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>

      {/* Modern Gradient Overlay: Left-to-Right for Desktop, Bottom-to-Top/Fade on Mobile */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 md:from-black/75 md:via-black/40 md:to-transparent z-10 pointer-events-none" />

      {/* Content Slides with Staggered Text Entrance */}
      <div className="relative z-20 w-full h-full mx-auto max-w-7xl px-6 sm:px-12 md:px-20 lg:px-32 flex items-center">
        <div className="relative w-full min-h-[400px] flex items-center">
          {heroSlides.map((slide, i) => {
            const isActive = i === index;
            return (
              <div
                key={slide.title}
                aria-hidden={!isActive}
                className={cn(
                  "absolute inset-x-0 top-1/2 -translate-y-1/2 w-full transition-all duration-500",
                  isActive ? "opacity-100 pointer-events-auto active" : "opacity-0 pointer-events-none"
                )}
              >
                <div className="max-w-[620px] text-left">
                  <span className="hero-text-animate hero-text-kicker mb-3 block text-[13px] font-semibold tracking-[0.18em] text-accent-300 uppercase [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                    {slide.kicker}
                  </span>
                  <h1 className="hero-text-animate hero-text-title mb-5 text-[36px] sm:text-[54px] lg:text-[64px] font-heading font-semibold leading-[1.05] tracking-tight text-white uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.55)]">
                    {slide.title}
                  </h1>
                  <p className="hero-text-animate hero-text-description mb-8 text-[16px] sm:text-[18px] leading-relaxed text-white/80 max-w-[50ch] [text-shadow:0_1px_5px_rgba(0,0,0,0.4)]">
                    {slide.description}
                  </p>
                  <div className="hero-text-animate hero-text-buttons flex flex-wrap gap-4">
                    <CtaButton
                      variant="primary"
                      href={slide.href || "/about"}
                    >
                      {slide.cta || "About Medisave"}
                    </CtaButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Animated Indicator Dots with Dynamic Progress Bars */}
      <div className="absolute inset-x-0 bottom-14 z-30 flex items-center justify-center gap-3 px-6">
        {heroSlides.map((slide, i) => {
          const isActive = i === index;
          return (
            <button
              key={slide.title}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={cn(
                "hero-indicator-dot h-[3px] w-12 sm:w-16 rounded-full",
                isActive && "active"
              )}
              style={{
                "--autoplay-duration": prefersReducedMotion ? "0ms" : `${autoplayMs}ms`,
              } as React.CSSProperties}
            >
              <span className="hero-indicator-progress rounded-full" />
            </button>
          );
        })}
      </div>

      {/* Animated Scroll Down Chevron */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <a
          href="#about"
          aria-label="Scroll down"
          className="hero-scroll-btn flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/10 text-white/80 hover:border-white/50 hover:text-white transition-colors duration-300"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="mt-0.5"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </section>
  );
}
