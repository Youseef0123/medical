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
        "group relative inline-flex items-center gap-2 overflow-hidden px-7 py-3.5",
        "font-heading text-sm font-semibold tracking-wide transition-all duration-300 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700",
        isPrimary
          ? "border border-accent-700 bg-accent-700 !text-white hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-6px_rgba(44,69,93,0.55)]"
          : "border border-divider bg-transparent text-ink hover:-translate-y-0.5 hover:border-accent-700 hover:text-accent-700",
        className
      )}
      {...props}
    >
      {/* corner registration marks — kept even on the solid primary, per the blueprint language */}
      <span className="pointer-events-none absolute -left-[1px] -top-[1px] h-2.5 w-2.5 border-l border-t border-current opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
      <span className="pointer-events-none absolute -right-[1px] -top-[1px] h-2.5 w-2.5 border-r border-t border-current opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
      <span className="pointer-events-none absolute -bottom-[1px] -left-[1px] h-2.5 w-2.5 border-b border-l border-current opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
      <span className="pointer-events-none absolute -bottom-[1px] -right-[1px] h-2.5 w-2.5 border-b border-r border-current opacity-0 transition-opacity duration-300 group-hover:opacity-70" />

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
