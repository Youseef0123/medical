"use client";

import { useState, useLayoutEffect, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { gsap } from "@/lib/gsap";
import { fetchEvents } from "@/lib/strapi";
import type { EventCategory, EventItem } from "@/types";
import {
  Calendar,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  Home,
  MapPin,
  Maximize2,
  X,
  Tag as TagIcon,
} from "lucide-react";

type CategoryFilter = EventCategory | "all";

const FILTER_OPTIONS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "All Events" },
  { key: "Cycle Meeting", label: "Cycle Meetings" },
  { key: "Group Meeting", label: "Group Meetings" },
  { key: "Standalone", label: "Standalone" },
  { key: "Conference", label: "Conferences" },
];

interface GalleryPhoto {
  id: string;
  src: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate?: string;
  eventDescription: string;
  aspectRatio: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  // Deep link from the homepage slider: /events?category=Standalone#gallery
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("category");
    const match = FILTER_OPTIONS.find((opt) => opt.key === requested);
    if (match) setActiveCategory(match.key);
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetchEvents()
      .then((fetched) => {
        if (isMounted) setEvents(fetched);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Every event's gallery flattened into one masonry feed
  const allGalleryPhotos = useMemo<GalleryPhoto[]>(
    () =>
      events.flatMap((event) =>
        event.images.map((src, idx) => ({
          id: `${event.id}-photo-${idx + 1}`,
          src,
          eventTitle: event.title,
          eventCategory: event.category,
          eventDate: event.date,
          eventDescription: event.description,
          aspectRatio:
            idx % 3 === 0 ? "aspect-4/3" : idx % 3 === 1 ? "aspect-3/4" : "aspect-square",
        }))
      ),
    [events]
  );

  // Only offer filters for categories that actually have events
  const filterOptions = FILTER_OPTIONS.filter(
    (opt) => opt.key === "all" || events.some((event) => event.category === opt.key)
  );

  const featuredEvents = events.filter((event) => event.featured);

  const filteredPhotos =
    activeCategory === "all"
      ? allGalleryPhotos
      : allGalleryPhotos.filter((photo) => photo.eventCategory === activeCategory);

  // Lightbox handlers
  const handleOpenLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null ? (prev + 1) % filteredPhotos.length : null
    );
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) =>
      prev !== null
        ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length
        : null
    );
  }, [selectedPhotoIndex, filteredPhotos.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") handleCloseLightbox();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, handleNextPhoto, handlePrevPhoto]);

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(".hero-anim"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Filter click scroll anchor
  const handleFilterClick = (catKey: CategoryFilter) => {
    setActiveCategory(catKey);
    // Smooth animate items refresh with clearProps: all
    if (galleryRef.current) {
      const items = galleryRef.current.querySelectorAll(".gallery-item");
      gsap.fromTo(
        items,
        { opacity: 0, scale: 0.96 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
          clearProps: "all",
          onComplete: () => {
            gsap.set(items, { clearProps: "all" });
          },
        }
      );
    }
  };

  const currentLightboxPhoto: GalleryPhoto | undefined =
    selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : undefined;

  return (
    <>
      <Header />
      <main ref={mainRef} className="flex-1 bg-bg">
        {/* ── 1. Hero Section (Mini Hero for Events & News Page) ────── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-neutral-900 px-5 pt-32 pb-16 text-white sm:px-8 md:pt-40 md:pb-24"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/news/WhatsApp Image 2026-08-06 at 5.42.21 PM (1).jpeg"
              alt="Medisave Events"
              fill
              priority
              className="object-cover opacity-65 transition-transform duration-1000 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/75 via-neutral-950/45 to-neutral-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-teal)_0%,transparent_60%)] opacity-25" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <nav
              aria-label="Breadcrumb"
              className="hero-anim mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
            >
              <Link
                href="/"
                className="flex items-center gap-1 text-xs font-semibold text-white/70 transition-colors hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-white/40" />
              <span className="text-xs font-semibold text-accent-2-300">
                Events & News
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="hero-anim mb-4">
                <Tag variant="accent-2">Corporate Gallery</Tag>
              </div>
              <h1 className="hero-anim mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                Events & <span className="brand-text">News</span>
              </h1>
              <p className="hero-anim mb-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                Explore Medisave Pharma&apos;s latest corporate milestones, scientific
                symposiums, medical exhibition booths, and team celebrations.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Featured Events (first, above the gallery) ──────────────── */}
        {featuredEvents.length > 0 && (
          <section id="event-summary" ref={cardsRef} className="bg-neutral-100 px-5 py-20 sm:px-8 md:py-28">
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-14 text-center">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                  Summary & Insights
                </span>
                <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
                  Featured Corporate Events
                </h2>
              </div>
  
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {featuredEvents.map((event) => (
                  <Card
                    key={event.id}
                    className="event-card group flex flex-col justify-between overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  >
                    <div className="relative aspect-16/9 w-full overflow-hidden bg-neutral-900">
                      {event.coverImage && (
                        <Image
                          src={event.coverImage}
                          alt={event.title}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4">
                        <Tag variant="accent">{event.category}</Tag>
                      </div>
                    </div>
  
                    <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                      <div>
                        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-ink/60">
                          {event.date && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4 text-accent-700" />
                              {event.date}
                            </span>
                          )}
                          {event.location && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-4 w-4 text-accent-700" />
                              {event.location}
                            </span>
                          )}
                        </div>
  
                        <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                          {event.title}
                        </h3>
                        <p className="mb-6 text-sm leading-relaxed text-ink/80">
                          {event.description}
                        </p>
                      </div>
  
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCategory(event.category);
                          document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-700 transition-colors hover:text-accent-800"
                      >
                        <span>View Gallery Photos ({event.images.length})</span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── 3. Interactive Filter Bar & Masonry Gallery ─────────────── */}
        <section id="gallery" className="scroll-mt-24 px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            {/* Filter Bar */}
            <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row">
              <div>
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                  Interactive Gallery
                </span>
                <h2 className="font-heading text-2xl font-bold uppercase text-ink sm:text-3xl">
                  Moments & Highlights
                </h2>
              </div>

              {/* Segments / Pill Filters */}
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-divider bg-neutral-100 p-1.5">
                {filterOptions.map((opt) => {
                  const isActive = activeCategory === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleFilterClick(opt.key)}
                      className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                        isActive
                          ? "brand-gradient text-white shadow-md"
                          : "bg-transparent text-ink/70 hover:bg-neutral-200 hover:text-ink"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {isLoading ? (
              <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-700 border-t-transparent" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-ink">
                  Loading Events...
                </h3>
              </div>
            ) : filteredPhotos.length === 0 ? (
              <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <CalendarX className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold uppercase text-ink">
                  No Events Yet
                </h3>
                <p className="mx-auto max-w-md text-sm text-ink/70">
                  There are no events or news to show right now. Please check back soon.
                </p>
              </div>
            ) : (
              /* Masonry Layout Grid */
              <div
                ref={galleryRef}
                className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance]"
              >
                {filteredPhotos.map((photo, idx) => (
                  <div
                    key={photo.id}
                    onClick={() => handleOpenLightbox(idx)}
                    className="gallery-item break-inside-avoid group relative mb-6 cursor-pointer overflow-hidden rounded-2xl border border-divider bg-neutral-900 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    {/* Image container */}
                    <div className={`relative w-full ${photo.aspectRatio} overflow-hidden`}>
                      <Image
                        src={photo.src}
                        alt={photo.eventTitle}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
  
                      {/* Brand gradient subtle tint overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-85" />
  
                      {/* Glassmorphic Hover Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-300 backdrop-blur-md">
                            <TagIcon className="h-3 w-3" />
                            {photo.eventCategory}
                          </span>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
                            <Maximize2 className="h-4 w-4" />
                          </div>
                        </div>
  
                        <h3 className="font-heading text-lg font-bold text-white uppercase">
                          {photo.eventTitle}
                        </h3>
                        {photo.eventDate && (
                          <div className="mt-1 flex items-center gap-2 text-xs text-white/70">
                            <Calendar className="h-3.5 w-3.5 text-accent-300" />
                            <span>{photo.eventDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── 4. Interactive Lightbox Modal ──────────────────────────── */}
        {selectedPhotoIndex !== null && currentLightboxPhoto && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 sm:p-8 backdrop-blur-md animate-[ms-fadeUp_0.25s_ease]"
            onClick={handleCloseLightbox}
          >
            {/* Close Button */}
            <button
              type="button"
              aria-label="Close Lightbox"
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 z-[110] flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Prev Photo Arrow */}
            <button
              type="button"
              aria-label="Previous Photo"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              className="absolute left-4 top-1/2 z-[110] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-8"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Next Photo Arrow */}
            <button
              type="button"
              aria-label="Next Photo"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              className="absolute right-4 top-1/2 z-[110] -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-8"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Modal Body Container */}
            <div
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 p-2 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-16/10 max-h-[65vh] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={currentLightboxPhoto.src}
                  alt={currentLightboxPhoto.eventTitle}
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Photo Description Footer */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent-300">
                    {currentLightboxPhoto.eventCategory}
                  </span>
                  <span className="text-xs text-white/60">
                    Photo {selectedPhotoIndex + 1} of {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-white mb-2">
                  {currentLightboxPhoto.eventTitle}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-3xl">
                  {currentLightboxPhoto.eventDescription}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
