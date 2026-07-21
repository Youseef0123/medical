import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hover lift + shadow transition, used by interactive product cards. */
  hoverLift?: boolean;
}

/**
 * Blueprint-style bordered frame: a hairline border with "+" registration
 * marks at each corner. The base wrapper for product cards, stat tiles,
 * certification badges, and image frames — corner marks are implemented
 * once here rather than repeated inline across sections.
 */
export function Card({ className, hoverLift, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "blueprint",
        hoverLift &&
          "transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-lg",
        className
      )}
      {...props}
    >
      <i className="corner tl" aria-hidden />
      <i className="corner tr" aria-hidden />
      <i className="corner bl" aria-hidden />
      <i className="corner br" aria-hidden />
      {children}
    </div>
  );
}
