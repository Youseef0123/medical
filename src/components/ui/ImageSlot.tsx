import Image from "next/image";
import { cn } from "@/lib/cn";

interface ImageSlotProps {
  /** Omit to render a styled placeholder until a real photo is dropped in. */
  src?: string;
  alt: string;
  placeholderLabel?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Wraps next/image with a duotone tint. Falls back to a blueprint-tinted
 * placeholder block (same footprint as the final photo) when no `src`
 * is provided yet, so sections read as intentional before real assets
 * land in public/images/.
 */
export function ImageSlot({
  src,
  alt,
  placeholderLabel,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw",
}: ImageSlotProps) {
  return (
    <div className={cn("relative overflow-hidden", src && "duotone", className)}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent-200 via-accent-300 to-accent-500 px-3 text-center text-xs font-medium tracking-wide text-accent-900"
          role="img"
          aria-label={alt}
        >
          {placeholderLabel ?? alt}
        </div>
      )}
    </div>
  );
}
