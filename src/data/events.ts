/**
 * -----------------------------------------------------------------------------
 * ⚠️ PLACEHOLDER CONTENT NOTICE / تنبيه بيانات مؤقتة
 * -----------------------------------------------------------------------------
 * The titles, descriptions, dates, and category mappings below are PLACEHOLDERS
 * created for demonstration and layout design purposes.
 *
 * All content in this file must be reviewed, verified, and replaced with real
 * event titles, actual dates, and official descriptions from Medisave Pharma
 * prior to production launch.
 * -----------------------------------------------------------------------------
 */

import type { EventItem } from "@/types";

export const eventsData: EventItem[] = [
  {
    id: "annual-celebration-2026",
    title: "Medisave Annual Celebration",
    category: "celebrations",
    categoryLabel: "Celebration",
    description:
      "Celebrating another milestone year with our dedicated team, reaffirming our commitment to excellence in CNS pharmaceutical care.",
    date: "January 15, 2026",
    location: "Cairo, Egypt",
    coverImage: "/images/news/WhatsApp Image 2026-08-06 at 5.42.21 PM (1).jpeg",
    images: [
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.21 PM (1).jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.21 PM.jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.22 PM.jpeg",
    ],
  },
  {
    id: "medical-symposium-2026",
    title: "Medical Conference & Product Symposium",
    category: "conferences",
    categoryLabel: "Conference",
    description:
      "Medisave participated in a specialized medical symposium, engaging with healthcare professionals on the latest in CNS treatment advances.",
    date: "March 10, 2026",
    location: "Grand Nile Hotel, Cairo",
    coverImage: "/images/news/WhatsApp Image 2026-08-06 at 5.42.23 PM.jpeg",
    images: [
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.23 PM.jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.26 PM (1).jpeg",
    ],
  },
  {
    id: "exhibition-booth-2026",
    title: "Medisave Exhibition Booth",
    category: "exhibitions",
    categoryLabel: "Exhibition",
    description:
      "Our team showcased Medisave's product portfolio at a regional pharmaceutical exhibition, connecting directly with physicians and pharmacists.",
    date: "May 22, 2026",
    location: "Cairo International Convention Centre",
    coverImage: "/images/news/WhatsApp Image 2026-08-06 at 5.42.24 PM (1).jpeg",
    images: [
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.24 PM (1).jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.24 PM.jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.25 PM.jpeg",
    ],
  },
  {
    id: "strategic-partnership-2026",
    title: "Strategic Partnership Meeting",
    category: "partnerships",
    categoryLabel: "Partnership",
    description:
      "A strategic discussion with key partners and stakeholders, strengthening collaborations that support our mission across Egypt.",
    date: "June 18, 2026",
    location: "Masaken Sheraton HQ, Cairo",
    coverImage: "/images/news/WhatsApp Image 2026-08-06 at 5.42.26 PM.jpeg",
    images: [
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.26 PM.jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.28 PM.jpeg",
      "/images/news/WhatsApp Image 2026-08-06 at 5.42.29 PM.jpeg",
    ],
  },
];

export interface GalleryPhoto {
  id: string;
  src: string;
  eventId: string;
  eventTitle: string;
  eventCategory: string;
  eventDate: string;
  eventDescription: string;
  aspectRatio: string;
}

export const allGalleryPhotos: GalleryPhoto[] = eventsData.flatMap((event) =>
  event.images.map((img, idx) => ({
    id: `${event.id}-photo-${idx + 1}`,
    src: img,
    eventId: event.id,
    eventTitle: event.title,
    eventCategory: event.category,
    eventDate: event.date,
    eventDescription: event.description,
    aspectRatio: idx % 3 === 0 ? "aspect-4/3" : idx % 3 === 1 ? "aspect-3/4" : "aspect-square",
  }))
);
