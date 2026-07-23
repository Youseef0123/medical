import type { StatCounter } from "@/types";

export const statCounters: StatCounter[] = [
  { label: "Years experience", target: 15, suffix: "+" },
  { label: "Products", target: 50, suffix: "+" },
  { label: "Patients served", target: 200000, suffix: "+", format: "thousand" },
  { label: "Therapeutic areas", target: 4, suffix: "" },
];
