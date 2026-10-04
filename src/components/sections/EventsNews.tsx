"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { fetchEvents } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { uniqueValues } from "@/lib/uniqueValues";
import type { EventCategory, EventItem } from "@/types";

// Repeat short lists so one copy of the track is always wider than the viewport
const MIN_SLIDES = 8;
// Seconds each slide takes to scroll past — keeps speed constant whatever the count
const SECONDS_PER_SLIDE = 5;

/** Link to the Events & News page with the gallery pre-filtered to a category. */
function categoryHref(category: EventCategory) {
  return `/events?category=${encodeURIComponent(category)}#gallery`;
}

function EventSlide({ event, tabIndex }: { event: EventItem; tabIndex?: number }) {
  return (
    <Link
      href={categoryHref(event.category)}
      tabIndex={tabIndex}
      className="group relative mr-6 block aspect-4/5 w-65 shrink-0 overflow-hidden rounded-2xl border border-divider bg-neutral-900 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl sm:w-75"
    >
      {event.coverImage && (
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          sizes="300px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95" />

      <div className="absolute inset-x-0 bottom-0 p-5">
        <span className="mb-2 inline-flex rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-300 backdrop-blur-md">
          {event.category}
        </span>
        <h3 className="font-heading text-lg font-bold text-white uppercase">
          {event.title}
        </h3>
        {event.date && (
          <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
            <Calendar className="h-3.5 w-3.5 text-accent-300" />
            <span>{event.date}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export function EventsNews() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchEvents().then((fetched) => {
      if (isMounted) setEvents(fetched.filter((event) => event.coverImage));
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Nothing published yet — keep the homepage clean rather than show an empty block
  if (events.length === 0) return null;

  const categories = uniqueValues(events, (event) => event.category) as EventCategory[];

  const slides: EventItem[] = [];
  while (slides.length < MIN_SLIDES) slides.push(...events);

  return (
    <section id="events" className="overflow-hidden bg-white px-5 py-22 sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-9 text-center">
          <span className="brand-text mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">
            Events & News
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-ink uppercase">
            Moments that move us forward
          </h2>
          <span className="brand-gradient mx-auto mt-4 block h-1 w-16 rounded-full" />
        </div>

        {/* Category shortcuts — each opens the events gallery filtered to it */}
        <div className="mb-10 flex justify-center">
          <div className="seg flex-wrap justify-center">
            {categories.map((category) => (
              <Link key={category} href={categoryHref(category)} className="seg-opt">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Infinite slider — full-bleed, pauses on hover */}
      <div className="events-marquee -mx-5 sm:-mx-8">
        <div
          className="events-marquee-track py-2"
          style={{ "--marquee-duration": `${slides.length * SECONDS_PER_SLIDE}s` } as CSSProperties}
        >
          <div className="flex">
            {slides.map((event, idx) => (
              <EventSlide key={`${event.id}-${idx}`} event={event} />
            ))}
          </div>
          <div className="events-marquee-dup flex" aria-hidden="true">
            {slides.map((event, idx) => (
              <EventSlide key={`${event.id}-dup-${idx}`} event={event} tabIndex={-1} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-11 text-center">
        <Button variant="secondary" href="/events">
          Know More
        </Button>
      </div>
    </section>
  );
}
