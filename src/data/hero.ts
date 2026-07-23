import type { HeroSlide } from "@/types";

/** Hairline trust strip shown along the bottom of the hero — editorial
 *  metadata cells separated by blueprint dividers. */
export const heroTrustItems: { value: string; label: string }[] = [
  { value: "15", label: "Years of practice" },
  { value: "40+", label: "Products in market" },
  { value: "GMP", label: "Certified manufacturing" },
  { value: "100%", label: "Batch traceability" },
];

export const heroSlides: HeroSlide[] = [
  {
    kicker: "Medisave",
    title: "Precision medicine, manufactured with care",
    description:
      "From formulation to final pack, every Medisave product is developed against pharmacopeial standard and traced batch by batch to the patient who takes it.",
    cta: "Explore products",
  },
  {
    kicker: "Neurology",
    title: "Gincofar — clarity, sustained",
    description:
      "A standardized ginkgo biloba extract formulated for consistent bioavailability across a full course of treatment.",
    cta: "Discover Gincofar",
  },
  {
    kicker: "Mental health",
    title: "Arilobe — stability you can rely on",
    description:
      "An aripiprazole formulation manufactured to tight dissolution tolerances, dosed for long-term therapy.",
    cta: "Learn about Arilobe",
  },
  {
    kicker: "Our mission",
    title: "Fifteen years of formulations that hold",
    description:
      "Medisave exists to make dependable pharmaceutical care accessible — the same rigor whether the batch is ten units or ten thousand.",
    cta: "Read our story",
  },
];
