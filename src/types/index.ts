export type ProductCategory = "Neurology" | "Mental Health" | "Cardiology" | "Metabolic";
export type ProductType = "Prescription" | "OTC";

export interface Product {
  id?: string | number;
  documentId?: string;
  slug: string;
  name: string;
  ingredient: string;
  dosage: string;
  category: ProductCategory;
  type: ProductType;
  description: string;
  image?: string;
  activeIngredient?: string;
  strength?: string;
  packSize?: string;
  isActive?: boolean;
  featured?: boolean;
  displayOrder?: number;
}

export interface Testimonial {
  name: string;
  title: string;
  quote: string;
  image?: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  stat: string;
  icon: "quality" | "trust" | "accessibility" | "integrity";
}

export interface Certification {
  label: string;
  detail: string;
}

export interface HeroSlide {
  kicker: string;
  title: string;
  description: string;
  cta: string;
  href?: string;
}

export interface StatCounter {
  label: string;
  target: number;
  suffix: string;
  format?: "thousand";
}

/** Mirrors the `category` enum on the Strapi Event collection. */
export type EventCategory = "Celebration" | "Conference" | "Exhibition" | "Partnership";

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  date?: string;
  location?: string;
  coverImage?: string;
  images: string[];
  featured: boolean;
  displayOrder: number;
}

export type JobType = "Full-time" | "Part-time" | "Internship" | "Contract";

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}
