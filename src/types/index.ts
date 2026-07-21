export type RxType = "OTC" | "Prescription Only";

export interface Product {
  slug: string;
  name: string;
  ingredient: string;
  dosage: string;
  category: string;
  rxType: RxType;
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
  icon: "quality" | "innovation" | "safety" | "accessibility";
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
