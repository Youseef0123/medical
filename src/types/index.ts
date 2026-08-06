export type ProductCategory = "Neurology" | "Mental Health" | "Cardiology" | "Metabolic";
export type ProductType = "Prescription" | "OTC";

export interface Product {
  slug: string;
  name: string;
  ingredient: string;
  dosage: string;
  category: ProductCategory;
  type: ProductType;
  description: string;
  image?: string;
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
}

export interface StatCounter {
  label: string;
  target: number;
  suffix: string;
  format?: "thousand";
}

export type EventCategory = "all" | "celebrations" | "conferences" | "exhibitions" | "partnerships";

export interface EventItem {
  id: string;
  title: string;
  category: Exclude<EventCategory, "all">;
  categoryLabel: string;
  description: string;
  date: string;
  location?: string;
  coverImage: string;
  images: string[];
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
