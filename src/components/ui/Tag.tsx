import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type Variant = "accent" | "accent-2" | "neutral" | "outline";

const variants: Record<Variant, string> = {
  accent: "bg-accent-100 text-accent-800",
  "accent-2": "bg-accent-2-100 text-accent-2-800",
  neutral: "bg-neutral-100 text-neutral-800",
  outline: "border border-accent text-accent",
};

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Tag({ variant = "neutral", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center text-[11px] tracking-wide px-2.5 py-1 rounded-sm",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
