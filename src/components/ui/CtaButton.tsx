"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

interface CtaButtonProps extends ComponentPropsWithoutRef<"a"> {
  href: string;
  variant?: "primary" | "secondary";
}

export function CtaButton({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: CtaButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5",
        "font-heading text-sm font-semibold tracking-wide transition-all duration-300 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue",
        isPrimary
          ? "brand-gradient border border-transparent !text-white hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(46,151,212,0.7)]"
          : "border border-divider bg-transparent text-ink hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue",
        className
      )}
      {...props}
    >
      {/* shine sweep — a soft diagonal highlight that passes through on hover */}
      {isPrimary && (
        <span
          className={cn(
            "pointer-events-none absolute inset-0 -translate-x-full",
            "bg-gradient-to-r from-transparent via-white/25 to-transparent",
            "transition-transform duration-700 ease-out group-hover:translate-x-full"
          )}
        />
      )}

      <span className="relative z-10">{children}</span>

      <ArrowRight
        strokeWidth={1.5}
        className="relative z-10 h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1"
      />
    </Link>
  );
}
