/**
 * DEV-ONLY sample events. `fetchEvents` falls back to these only when running
 * `next dev` and Strapi returns nothing, so layouts can be reviewed locally.
 * Production builds never use them — they show backend data only.
 */

import type { EventItem } from "@/types";

const photo = (name: string) => `/images/news/WhatsApp Image 2026-08-06 at ${name}.jpeg`;

export const mockEvents: EventItem[] = [
  {
    id: "mock-cycle-meeting",
    title: "Q3 Cycle Meeting 2026",
    category: "Cycle Meeting",
    description:
      "Our medical representatives gathered to align on the CNS portfolio, share field insights and plan the next promotional cycle across Egypt.",
    date: "September 12, 2026",
    location: "Cairo, Egypt",
    coverImage: photo("5.42.21 PM (1)"),
    images: [photo("5.42.21 PM (1)"), photo("5.42.21 PM"), photo("5.42.22 PM")],
    featured: true,
    displayOrder: 0,
  },
  {
    id: "mock-group-meeting",
    title: "Regional Group Meeting",
    category: "Group Meeting",
    description:
      "Sales and marketing teams met with regional managers to review performance and strengthen collaboration with key partners.",
    date: "August 20, 2026",
    location: "Alexandria, Egypt",
    coverImage: photo("5.42.26 PM"),
    images: [photo("5.42.26 PM"), photo("5.42.28 PM"), photo("5.42.29 PM")],
    featured: true,
    displayOrder: 1,
  },
  {
    id: "mock-standalone",
    title: "Psychiatry Standalone Session",
    category: "Standalone",
    description:
      "A focused scientific session with leading psychiatrists on the latest evidence in depression and anxiety management.",
    date: "July 8, 2026",
    location: "Grand Nile Hotel, Cairo",
    coverImage: photo("5.42.23 PM"),
    images: [photo("5.42.23 PM"), photo("5.42.26 PM (1)")],
    featured: true,
    displayOrder: 2,
  },
  {
    id: "mock-conference",
    title: "Egyptian Neurology Conference",
    category: "Conference",
    description:
      "Medisave's booth welcomed physicians and pharmacists at the national neurology conference, showcasing our full product line.",
    date: "May 22, 2026",
    location: "Cairo International Convention Centre",
    coverImage: photo("5.42.24 PM (1)"),
    images: [photo("5.42.24 PM (1)"), photo("5.42.24 PM"), photo("5.42.25 PM")],
    featured: true,
    displayOrder: 3,
  },
];
