"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, MapPin } from "lucide-react";
import { fetchEvents } from "@/lib/strapi";
import { CtaButton } from "@/components/ui/CtaButton";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { EventCategory, EventItem } from "@/types";

const CATEGORIES: EventCategory[] = ["Cycle Meeting", "Group Meeting", "Standalone", "Conference"];
const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD_PX = 40;

/** Link to the Events & News page with the gallery pre-filtered to a category. */
function categoryHref(category: EventCategory) {
  return `/events?category=${encodeURIComponent(category)}#gallery`;
}

const pad = (n: number) => String(n).padStart(2, "0");

interface Panel {
  category: EventCategory;
  latest: EventItem;
  count: number;
}

/** Category pill, event count, title, description, meta and Explore — shared by panels and deck. */
function PanelDetails({ panel, index }: { panel: Panel; index: number }) {
  const { latest } = panel;
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="brand-gradient rounded-full px-3 py-1 font-heading text-[11px] font-bold tracking-wider text-white uppercase">
          {pad(index + 1)} · {panel.category}
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
    </>
  );
}

/** Thin bar across the open card that fills over one autoplay interval. */
function AutoplayProgress({ active, isPaused }: { active: number; isPaused: boolean }) {
  return (
    <span
      key={`progress-${active}`}
      aria-hidden
      className="brand-gradient events-panel-progress absolute top-0 left-0 z-10 h-1"
      style={
        {
          "--progress-duration": `${AUTOPLAY_MS}ms`,
          animationPlayState: isPaused ? "paused" : "running",
        } as CSSProperties
      }
    />
  );
}

function ArrowControls({
  onPrev,
  onNext,
  className,
}: {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous event"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-divider bg-white text-ink transition-all duration-300 hover:-translate-x-0.5 hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next event"
        className="brand-gradient flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_8px_20px_-8px_rgba(46,151,212,0.7)] transition-all duration-300 hover:translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export function EventsNews() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const touchStartX = useRef<number | null>(null);

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

  const total = panels.length;
  const canNavigate = total > 1;
  const showProgress = canNavigate && !prefersReducedMotion;

  // Auto-advance; hovering a panel pauses it, any navigation restarts the timer
  useEffect(() => {
    if (isPaused || prefersReducedMotion || total < 2) return;
    const timer = window.setTimeout(() => setActive((current) => (current + 1) % total), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, isPaused, prefersReducedMotion, total]);

  if (total === 0) return null;

  const goNext = () => setActive((current) => (current + 1) % total);
  const goPrev = () => setActive((current) => (current - 1 + total) % total);

  const activePanel = panels[active] ?? panels[0];

  return (
    <section id="events" className="overflow-hidden bg-white px-5 py-16 sm:px-8 sm:py-22">
      <div className="mx-auto max-w-300">
        <div className="mb-8 flex flex-col items-start justify-between gap-6 md:mb-10 md:flex-row md:items-end">
          <div>
            <span className="brand-text mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">
              Events & News
            </span>
            <h2 className="text-[26px] font-semibold tracking-tight text-ink uppercase sm:text-[32px]">
              Where our science meets the field
            </h2>
            <span className="brand-gradient mt-4 block h-1 w-16 rounded-full" />
          </div>
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            {canNavigate && <ArrowControls onPrev={goPrev} onNext={goNext} />}
            <CtaButton href="/events">Know More</CtaButton>
          </div>
        </div>

        {/* ── Desktop: expanding panels ─────────────────────────────── */}
        <div className="hidden h-130 gap-4 md:flex" onMouseLeave={() => setIsPaused(false)}>
          {panels.map((panel, i) => {
            const isActive = i === active;
            return (
              <Link
                key={panel.category}
                href={categoryHref(panel.category)}
                onMouseEnter={() => {
                  setActive(i);
                  setIsPaused(true);
                }}
                onFocus={() => setActive(i)}
                aria-label={`${panel.category}: ${panel.latest.title}`}
                className={cn(
                  "group relative overflow-hidden rounded-3xl bg-neutral-900 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
                  isActive ? "flex-5" : "flex-1"
                )}
              >
                <Image
                  src={panel.latest.coverImage!}
                  alt=""
                  fill
                  sizes="60vw"
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

                {/* Collapsed face: number + vertical category */}
                <div
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-end gap-4 pb-7 transition-opacity duration-300",
                    isActive ? "pointer-events-none opacity-0" : "opacity-100 delay-200"
                  )}
                >
                  <span className="brand-gradient flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold text-white">
                    {pad(i + 1)}
                  </span>
                  <span className="rotate-180 font-heading text-lg font-bold tracking-wide whitespace-nowrap text-white uppercase [writing-mode:vertical-rl]">
                    {panel.category}
                  </span>
                </div>

                {/* Expanded face */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-8 transition-all duration-500",
                    isActive
                      ? "translate-y-0 opacity-100 delay-300"
                      : "pointer-events-none translate-y-4 opacity-0"
                  )}
                >
                  <PanelDetails panel={panel} index={i} />
                </div>

                {isActive && showProgress && <AutoplayProgress active={active} isPaused={isPaused} />}
              </Link>
            );
          })}
        </div>

        {/* ── Mobile: stacked card deck with arrows + swipe ─────────── */}
        <div className="md:hidden">
          <div
            className="relative h-115 pt-8"
            onTouchStart={(event) => {
              touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) return;
              const dx = event.changedTouches[0].clientX - touchStartX.current;
              touchStartX.current = null;
              if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
              if (dx < 0) goNext();
              else goPrev();
            }}
          >
            {panels.map((panel, i) => {
              // 0 = front card, 1–2 = peeking behind it, rest hidden
              const depth = (i - active + total) % total;
              const isFront = depth === 0;
              return (
                <Link
                  key={panel.category}
                  href={categoryHref(panel.category)}
                  tabIndex={isFront ? 0 : -1}
                  aria-hidden={!isFront}
                  aria-label={`${panel.category}: ${panel.latest.title}`}
                  className={cn(
                    "group absolute inset-x-0 top-8 bottom-0 overflow-hidden rounded-3xl bg-neutral-900 shadow-[0_24px_50px_-20px_rgba(15,23,42,0.55)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    !isFront && "pointer-events-none",
                    depth > 2 && "opacity-0"
                  )}
                  style={{
                    zIndex: total - depth,
                    transform: `translateY(${-depth * 16}px) scale(${1 - depth * 0.06})`,
                    transformOrigin: "top center",
                  }}
                >
                  <Image
                    src={panel.latest.coverImage!}
                    alt=""
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 transition-colors duration-500",
                      isFront
                        ? "bg-linear-to-t from-neutral-950/95 via-neutral-950/35 to-neutral-950/0"
                        : "bg-neutral-950/70"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-0 p-6 transition-opacity duration-300",
                      isFront ? "opacity-100 delay-200" : "opacity-0"
                    )}
                  >
                    <PanelDetails panel={panel} index={i} />
                  </div>
                  {isFront && showProgress && <AutoplayProgress active={active} isPaused={false} />}
                </Link>
              );
            })}
          </div>

          {/* Counter + arrows */}
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="min-w-0" aria-live="polite">
              <div className="font-heading text-ink">
                <span className="brand-text text-3xl font-bold">{pad(active + 1)}</span>
                <span className="text-sm font-semibold text-ink/40"> / {pad(total)}</span>
              </div>
              <span className="block truncate font-heading text-sm font-semibold tracking-wide text-ink/70 uppercase">
                {activePanel.category}
              </span>
            </div>
            {canNavigate && <ArrowControls onPrev={goPrev} onNext={goNext} />}
          </div>

          <div className="mt-8">
            <CtaButton href="/events" className="w-full justify-center">
              Know More
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
