"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SCROLL_IMAGES = [
  { src: "/images/about/research.jpg", alt: "Medisave researcher examining a vial in the lab" },
  { src: "/images/about/quality.jpg", alt: "Quality control inspection of pharmaceutical tablets" },
  { src: "/images/about/manufacturing.jpg", alt: "Automated pharmaceutical packaging line" },
  { src: "/images/about/facility.jpg", alt: "Medisave facility exterior" },
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const images = imageRefs.current;

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
            return;
          }

          // Shared starting state: only the first image visible.
          gsap.set(images, { opacity: 0 });
          gsap.set(images[0], { opacity: 1 });

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
            for (let i = 0; i < images.length - 1; i++) {
              const mid = (i + 1) / images.length;
              const half = 0.06;
              tl.to(images[i], { opacity: 0, ease: "none", duration: half * 2 }, mid - half);
              tl.to(images[i + 1], { opacity: 1, ease: "none", duration: half * 2 }, mid - half);
            }

            return () => {
              tl.scrollTrigger?.kill();
              tl.kill();
            };
          }

          if (isMobile) {
            const mobileTl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
            mobileTl.to(images[0], { opacity: 1, duration: 0.6, ease: "power2.out" }, 0);

            return () => {
              mobileTl.scrollTrigger?.kill();
              mobileTl.kill();
            };
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="overflow-hidden px-5 sm:px-8">
      <div ref={pinWrapperRef} className="md:h-[140vh]">
        <div ref={stickyRef} className="md:sticky md:top-0 md:flex md:h-screen md:items-center">
          <div className="mx-auto w-full min-w-0 max-w-[1200px] py-16 md:py-0">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <div className="content-col">
                <span className="mb-3 block text-[13px] font-semibold tracking-[0.08em] text-accent-700 uppercase">
                  About Medisave
                </span>
                <h2 className="mb-4.5 text-[32px] font-semibold tracking-tight text-ink uppercase">
                  Formulated for trust, manufactured for scale
                </h2>
                <p className="mb-8 max-w-[56ch] text-base leading-relaxed text-ink/80">
                  Medisave Pharma is a national pharmaceutical company driven by a
                  shared mission: delivering high-standard, specialized medications
                  tailored to Central Nervous System (CNS) patients across Egypt,
                  founded in 2013 with a focus on high-quality products. Medisave
                  quickly earned the trust of healthcare professionals through
                  reliable products and clinical efficacy.
                </p>
                <div>
                  <CtaButton href="/about">
                    Discover More About Us
                  </CtaButton>
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
