"use client";

import { useState } from "react";
import Image from "next/image";
import { heroSlides, heroTrustItems } from "@/data/hero";
import { CtaButton } from "@/components/ui/CtaButton";
import { useInterval } from "@/lib/hooks/useInterval";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/cn";

interface HeroProps {
  /** Autoplay interval in ms; configurable per the "autoplay + configurable interval" requirement. */
  autoplayMs?: number;
}

const slideImages = [
  "/images/hero/brand.png",
  "/images/hero/neurology.png",
  "/images/hero/mental.png",
  "/images/hero/legacy.png",
];

const pad = (n: number) => String(n).padStart(2, "0");

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
      {/* Background Images with Crossfade & Ken Burns */}
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

      {/* Gradient Overlay: strongest at left for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 md:from-black/80 md:via-black/45 md:to-transparent z-10 pointer-events-none" />

      {/* ── Blueprint HUD: corner marks + grid guides ──────────────────── */}
      <div className="hero-hud absolute inset-0 z-20 pointer-events-none hidden sm:block" aria-hidden>
        <i className="corner tl" />
        <i className="corner tr" />
        <i className="corner bl" />
        <i className="corner br" />
        {/* Vertical guides framing the content column */}
        <div className="hero-grid-guide left-6 sm:left-12 md:left-20 lg:left-32" />
        <div className="hero-grid-guide hidden lg:block right-32" />
      </div>

      {/* Content */}
      <div className="relative z-20 w-full h-full mx-auto max-w-7xl px-6 sm:px-12 md:px-20 lg:px-32 flex items-center">
        <div className="relative w-full min-h-[440px] flex items-center">
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
                <div className="max-w-[680px] text-left">
                  {/* Top meta rule: kicker left, slide counter right */}
                  <div className="hero-text-animate hero-text-kicker mb-5 flex items-center gap-4">
                    <span className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.2em] text-accent-300 uppercase whitespace-nowrap [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                      <span className="h-px w-8 bg-accent-300/70" />
                      {slide.kicker}
                    </span>
                    <span className="h-px flex-1 bg-white/20" />
                    <span className="text-[13px] font-heading font-semibold tracking-[0.15em] text-white/70 tabular-nums whitespace-nowrap">
                      <span key={index} className="hero-counter-num text-white">
                        {pad(index + 1)}
                      </span>
                      <span className="mx-1 text-white/30">/</span>
                      {pad(heroSlides.length)}
                    </span>
                  </div>

                  <h1 className="hero-text-animate hero-text-title mb-5 font-heading font-semibold leading-[1.02] tracking-tight text-white uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.55)] [font-size:clamp(2.5rem,6vw,5.25rem)]">
                    {slide.title}
                  </h1>

                  <p className="hero-text-animate hero-text-description mb-9 text-[16px] sm:text-[18px] leading-relaxed text-white/80 max-w-[52ch] [text-shadow:0_1px_5px_rgba(0,0,0,0.4)]">
                    {slide.description}
                  </p>

                  <div className="hero-text-animate hero-text-buttons flex flex-wrap gap-4">
                    <CtaButton variant="primary" href="#products">
                      {slide.cta}
                    </CtaButton>
                    <CtaButton
                      variant="secondary"
                      href="#about"
                      className="!text-white/80 hover:!text-white !border-white/20 hover:!border-white/50"
                    >
                      Learn more
                    </CtaButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Editorial index indicators (left-aligned with content) ─────── */}
      <div className="absolute inset-x-0 bottom-28 sm:bottom-24 z-30 mx-auto max-w-7xl px-6 sm:px-12 md:px-20 lg:px-32">
        <div className="flex items-end gap-4 sm:gap-6">
          {heroSlides.map((slide, i) => {
            const isActive = i === index;
            return (
              <button
                key={slide.title}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}: ${slide.kicker}`}
                aria-current={isActive}
                className="group flex flex-col gap-2 w-16 sm:w-24 text-left"
              >
                <span
                  className={cn(
                    "hero-index-num",
                    isActive ? "text-white" : "text-white/40 group-hover:text-white/70"
                  )}
                >
                  {pad(i + 1)}
                </span>
                <span
                  className={cn("hero-indicator-dot rounded-full", isActive && "active")}
                  style={{
                    "--autoplay-duration": prefersReducedMotion ? "0ms" : `${autoplayMs}ms`,
                  } as React.CSSProperties}
                >
                  <span className="hero-indicator-progress rounded-full" />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Trust strip: hairline blueprint-divided metadata cells ─────── */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-white/12 bg-black/25 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 md:px-20 lg:px-32">
          <ul className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {heroTrustItems.map((item) => (
              <li
                key={item.label}
                className="flex items-baseline gap-2.5 py-3.5 pl-4 first:pl-0 md:pl-6"
              >
                <span className="font-heading text-lg font-semibold tracking-tight text-accent-300 tabular-nums">
                  {item.value}
                </span>
                <span className="text-[11px] sm:text-[12px] leading-tight tracking-wide text-white/60 uppercase">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Scroll cue: vertical label + traveling line ────────────────── */}
      <a
        href="#about"
        aria-label="Scroll down"
        className="group absolute right-6 sm:right-12 md:right-20 lg:right-8 bottom-28 sm:bottom-24 z-30 hidden sm:flex flex-col items-center gap-3"
      >
        <span className="text-[11px] font-heading font-semibold tracking-[0.25em] text-white/50 group-hover:text-white/80 uppercase [writing-mode:vertical-rl] transition-colors duration-300">
          Scroll
        </span>
        <span className="relative h-12 w-px bg-white/20 overflow-hidden">
          <span className="hero-scroll-line absolute inset-0 bg-accent-300" />
        </span>
      </a>
    </section>
  );
}
