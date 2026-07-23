"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { statCounters } from "@/data/stats";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import type { StatCounter } from "@/types";

const SCROLL_IMAGES = [
  { src: "/images/about/research.png", alt: "Medisave researcher examining a vial in the lab", label: "Research" },
  { src: "/images/about/quality.png", alt: "Quality control inspection of pharmaceutical tablets", label: "Quality control" },
  { src: "/images/about/manufacturing.png", alt: "Automated pharmaceutical packaging line", label: "Manufacturing" },
  { src: "/images/about/facility.png", alt: "Medisave facility exterior", label: "Facility" },
];

// Steel-blue accent (accent-300) reads on the dark photo backdrop.
const TICK_ACTIVE = "#b5d9fd";
const TICK_DIM = "rgba(255, 255, 255, 0.35)";

const pad = (n: number) => String(n).padStart(2, "0");

function formatCount(stat: StatCounter, value: number) {
  const rounded = Math.round(value);
  if (stat.format === "thousand") return `${Math.round(rounded / 1000)}k${stat.suffix}`;
  return `${rounded}${stat.suffix}`;
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const tickRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const numberRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const images = imageRefs.current;
      const captions = captionRefs.current;
      const ticks = tickRefs.current;
      const numbers = numberRefs.current;

      const setNumber = (i: number, value: number) => {
        const el = numbers[i];
        if (el) el.textContent = formatCount(statCounters[i], value);
      };

      // Snap the figure caption + frame ticks to a given active frame.
      // Used for initial state and the non-scrubbed (reduced-motion / mobile) branches.
      const setFrame = (activeIndex: number) => {
        captions.forEach((el, i) => {
          if (el) gsap.set(el, { opacity: i === activeIndex ? 1 : 0 });
        });
        ticks.forEach((el, i) => {
          if (el) gsap.set(el, { color: i === activeIndex ? TICK_ACTIVE : TICK_DIM });
        });
      };

      const setupStatCounters = () => {
        const counterProxies = statCounters.map(() => ({ value: 0 }));
        const statsTl = gsap.timeline({
          scrollTrigger: {
            trigger: statsRowRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        statsTl.from(statsRowRef.current, { opacity: 0, y: 16, duration: 0.5, ease: "power2.out" }, 0);
        statCounters.forEach((stat, i) => {
          statsTl.to(
            counterProxies[i],
            {
              value: stat.target,
              duration: 0.8,
              ease: "power2.out",
              onUpdate: () => setNumber(i, counterProxies[i].value),
            },
            0.1
          );
        });

        return () => {
          statsTl.scrollTrigger?.kill();
          statsTl.kill();
        };
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
          isMobile: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, isMobile, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            isMobile: boolean;
            reduceMotion: boolean;
          };

          if (reduceMotion) {
            gsap.set(images, { opacity: 0 });
            gsap.set(images[images.length - 1], { opacity: 1 });
            setFrame(images.length - 1);
            gsap.set(statsRowRef.current, { opacity: 1, y: 0 });
            statCounters.forEach((stat, i) => setNumber(i, stat.target));
            return;
          }

          // Shared starting state: only the first image + its caption visible.
          gsap.set(images, { opacity: 0 });
          gsap.set(images[0], { opacity: 1 });
          setFrame(0);
          statCounters.forEach((stat, i) => setNumber(i, 0));

          const statsCleanup = setupStatCounters();

          if (isDesktop) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: pinWrapperRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
                pin: stickyRef.current,
              },
            });

            // Sequential crossfade: 4 images, 3 evenly-spaced transitions.
            // Figure captions and frame ticks crossfade at the same points.
            for (let i = 0; i < images.length - 1; i++) {
              const mid = (i + 1) / images.length;
              const half = 0.06;
              const at = mid - half;
              const dur = half * 2;

              tl.to(images[i], { opacity: 0, ease: "none", duration: dur }, at);
              tl.to(images[i + 1], { opacity: 1, ease: "none", duration: dur }, at);

              tl.to(captions[i], { opacity: 0, ease: "none", duration: dur }, at);
              tl.to(captions[i + 1], { opacity: 1, ease: "none", duration: dur }, at);

              tl.to(ticks[i], { color: TICK_DIM, ease: "none", duration: dur }, at);
              tl.to(ticks[i + 1], { color: TICK_ACTIVE, ease: "none", duration: dur }, at);
            }

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
              statsCleanup();
            };
          }

          if (isMobile) {
            // Simpler mobile fallback: fade the first photo in once, no pin, no cycling.
            const mobileTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            });
            mobileTl.to(images[0], { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);

            return () => {
              mobileTl.scrollTrigger?.kill();
              mobileTl.kill();
              statsCleanup();
            };
          }

          return statsCleanup;
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="overflow-hidden px-5 sm:px-8">
      <div ref={pinWrapperRef} className="md:h-[180vh]">
        <div ref={stickyRef} className="md:sticky md:top-0 md:flex md:h-screen md:items-center">
          <div className="mx-auto w-full min-w-0 max-w-[1200px] py-16 md:py-0">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="content-col">
                {/* Editorial header: kicker tick · rule · section index */}
                <div className="mb-5 flex items-center gap-4">
                  <span className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.14em] text-accent-700 uppercase whitespace-nowrap">
                    <span className="h-px w-7 bg-accent-700/60" />
                    About Medisave
                  </span>
                  <span className="h-px flex-1 bg-divider" />
                  <span className="font-heading text-[13px] font-semibold tracking-[0.15em] text-ink/40 tabular-nums">
                    02
                  </span>
                </div>

                <h2 className="mb-5 font-heading font-semibold leading-[1.05] tracking-tight text-ink uppercase [font-size:clamp(1.75rem,3.4vw,2.75rem)]">
                  Formulated for trust,{" "}
                  <span className="text-accent-700">manufactured for scale</span>
                </h2>
                <p className="max-w-[56ch] text-base leading-relaxed text-ink/80">
                  Medisave develops and manufactures pharmaceutical products across
                  neurology, mental health, cardiology and metabolic care. Every
                  formula is validated against pharmacopeial standard before it
                  reaches a pharmacy shelf, and every batch is traceable from raw
                  material to patient.
                </p>
              </div>

              <div className="image-col blueprint relative aspect-4/3">
                <i className="corner tl" aria-hidden />
                <i className="corner tr" aria-hidden />
                <i className="corner bl" aria-hidden />
                <i className="corner br" aria-hidden />

                <div className="duotone h-full w-full overflow-hidden">
                  {SCROLL_IMAGES.map((image, i) => (
                    <div
                      key={image.src}
                      ref={(el) => {
                        imageRefs.current[i] = el;
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        priority={false}
                        className="object-cover"
                        onLoad={() => ScrollTrigger.refresh()}
                      />
                    </div>
                  ))}
                </div>

                {/* Scroll-synced figure captions (blueprint dossier style) */}
                {SCROLL_IMAGES.map((image, i) => (
                  <div
                    key={image.src}
                    ref={(el) => {
                      captionRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-baseline gap-2 opacity-0 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]"
                  >
                    <span className="font-heading text-[12px] font-semibold tracking-[0.12em] text-accent-300 tabular-nums">
                      FIG. {pad(i + 1)} / {pad(SCROLL_IMAGES.length)}
                    </span>
                    <span className="text-[12px] font-medium tracking-wide text-white/85 uppercase">
                      {image.label}
                    </span>
                  </div>
                ))}

                {/* Frame index ticks */}
                <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-1.5">
                  {SCROLL_IMAGES.map((image, i) => (
                    <span
                      key={image.src}
                      ref={(el) => {
                        tickRefs.current[i] = el;
                      }}
                      aria-hidden
                      className="font-heading text-[11px] font-semibold tracking-[0.15em] tabular-nums [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"
                      style={{ color: TICK_DIM }}
                    >
                      {pad(i + 1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div ref={statsRowRef} className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
              {statCounters.map((stat, i) => (
                <div
                  key={stat.label}
                  className="blueprint group relative flex flex-col items-start gap-2 p-5 text-left transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-accent-700"
                >
                  <i className="corner tl text-ink/40 transition-colors duration-300 group-hover:text-accent-700" aria-hidden />
                  <i className="corner tr text-ink/40 transition-colors duration-300 group-hover:text-accent-700" aria-hidden />
                  <i className="corner bl text-ink/40 transition-colors duration-300 group-hover:text-accent-700" aria-hidden />
                  <i className="corner br text-ink/40 transition-colors duration-300 group-hover:text-accent-700" aria-hidden />
                  <span className="font-heading text-[11px] font-semibold tracking-[0.15em] text-accent-700/70 tabular-nums">
                    {pad(i + 1)}
                  </span>
                  <span
                    ref={(el) => {
                      numberRefs.current[i] = el;
                    }}
                    className="font-heading text-3xl font-semibold text-ink tabular-nums"
                  >
                    {formatCount(stat, 0)}
                  </span>
                  <span className="h-px w-8 bg-accent-700/40 transition-[width] duration-300 group-hover:w-12" />
                  <span className="font-body text-xs tracking-wide text-ink/70 uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
