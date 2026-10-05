"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { fetchEvents } from "@/lib/strapi";
import { CtaButton } from "@/components/ui/CtaButton";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { EventCategory, EventItem } from "@/types";

const CATEGORIES: EventCategory[] = ["Cycle Meeting", "Group Meeting", "Standalone", "Conference"];
const AUTOPLAY_MS = 5000;

/** Link to the Events & News page with the gallery pre-filtered to a category. */
function categoryHref(category: EventCategory) {
  return `/events?category=${encodeURIComponent(category)}#gallery`;
}

interface Panel {
  category: EventCategory;
  latest: EventItem;
  count: number;
}

export function EventsNews() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let isMounted = true;
    fetchEvents().then((fetched) => {
      if (isMounted) setEvents(fetched.filter((event) => event.coverImage));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // One panel per category that has a featured event (toggled from the Strapi
  // dashboard); its face is the first featured event in Strapi's display order
  const panels = useMemo<Panel[]>(
    () =>
      CATEGORIES.flatMap((category) => {
        const inCategory = events.filter((event) => event.category === category);
        const featured = inCategory.find((event) => event.featured);
        return featured ? [{ category, latest: featured, count: inCategory.length }] : [];
      }),
    [events]
  );

  // Auto-advance the open panel; hovering a panel pauses it
  useEffect(() => {
    if (isPaused || prefersReducedMotion || panels.length < 2) return;
    const timer = window.setTimeout(
      () => setActive((current) => (current + 1) % panels.length),
      AUTOPLAY_MS
    );
    return () => window.clearTimeout(timer);
  }, [active, isPaused, prefersReducedMotion, panels.length]);

  if (panels.length === 0) return null;

  return (
    <section id="events" className="bg-white px-5 py-22 sm:px-8">
      <div className="mx-auto max-w-300">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="brand-text mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">
              Events & News
            </span>
            <h2 className="text-[32px] font-semibold tracking-tight text-ink uppercase">
              Where our science meets the field
            </h2>
            <span className="brand-gradient mt-4 block h-1 w-16 rounded-full" />
          </div>
          <CtaButton href="/events" className="shrink-0">
            Know More
          </CtaButton>
        </div>

        <div
          className="flex flex-col gap-3 md:h-130 md:flex-row md:gap-4"
          onMouseLeave={() => setIsPaused(false)}
        >
          {panels.map((panel, i) => {
            const isActive = i === active;
            const { latest } = panel;
            return (
              <Link
                key={panel.category}
                href={categoryHref(panel.category)}
                onMouseEnter={() => {
                  setActive(i);
                  setIsPaused(true);
                }}
                onFocus={() => setActive(i)}
                aria-label={`${panel.category}: ${latest.title}`}
                className={cn(
                  "group relative overflow-hidden rounded-3xl bg-neutral-900 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
                  isActive ? "h-105 md:h-auto md:flex-5" : "h-24 md:h-auto md:flex-1"
                )}
              >
                <Image
                  src={latest.coverImage!}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 60vw, 100vw"
                  className={cn(
                    "object-cover transition-transform duration-6000 ease-out",
                    isActive ? "scale-110" : "scale-100"
                  )}
                />
                <div
                  className={cn(
                    "absolute inset-0 transition-colors duration-700",
                    isActive
                      ? "bg-linear-to-t from-neutral-950/95 via-neutral-950/40 to-neutral-950/0"
                      : "bg-neutral-950/60 group-hover:bg-neutral-950/45"
                  )}
                />

                {/* Collapsed face: number + category, vertical on desktop */}
                <div
                  className={cn(
                    "absolute inset-0 flex items-center gap-4 px-6 transition-opacity duration-300 md:flex-col md:justify-end md:px-0 md:pb-7",
                    isActive ? "pointer-events-none opacity-0" : "opacity-100 delay-200"
                  )}
                >
                  <span className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading text-lg font-bold tracking-wide whitespace-nowrap text-white uppercase md:rotate-180 md:[writing-mode:vertical-rl]">
                    {panel.category}
                  </span>
                </div>

                {/* Expanded face: latest event in this category */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-6 transition-all duration-500 sm:p-8",
                    isActive
                      ? "translate-y-0 opacity-100 delay-300"
                      : "pointer-events-none translate-y-4 opacity-0"
                  )}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="brand-gradient rounded-full px-3 py-1 font-heading text-[11px] font-bold tracking-wider text-white uppercase">
                      {String(i + 1).padStart(2, "0")} · {panel.category}
                    </span>
                    <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85 backdrop-blur-md">
                      {panel.count} {panel.count === 1 ? "event" : "events"}
                    </span>
                  </div>

                  <h3 className="mb-2 max-w-lg font-heading text-2xl font-bold text-white uppercase sm:text-3xl">
                    {latest.title}
                  </h3>
                  <p className="mb-5 line-clamp-2 max-w-lg text-sm leading-relaxed text-white/75">
                    {latest.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/70">
                    {latest.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-accent-300" />
                        {latest.date}
                      </span>
                    )}
                    {latest.location && (
                      <span className="hidden items-center gap-1.5 sm:flex">
                        <MapPin className="h-4 w-4 text-accent-300" />
                        {latest.location}
                      </span>
                    )}
                    <span className="ml-auto inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-heading text-sm font-semibold text-ink transition-colors group-hover:bg-accent-100">
                      Explore
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>

                {/* Autoplay progress */}
                {isActive && panels.length > 1 && !prefersReducedMotion && (
                  <span
                    key={`progress-${active}`}
                    aria-hidden
                    className="brand-gradient events-panel-progress absolute top-0 left-0 h-1"
                    style={
                      {
                        "--progress-duration": `${AUTOPLAY_MS}ms`,
                        animationPlayState: isPaused ? "paused" : "running",
                      } as CSSProperties
                    }
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
