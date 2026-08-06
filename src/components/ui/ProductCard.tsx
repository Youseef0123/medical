"use client";

import { useState, type ReactNode } from "react";
import { Tag } from "@/components/ui/Tag";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useHoverCapable } from "@/lib/hooks/useHoverCapable";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  hoverCapable?: boolean;
  prefersReducedMotion?: boolean;
  hidden?: boolean;
  registerRef?: (el: HTMLDivElement | null) => void;
}

/** Gradient pill for the therapeutic category — carries the brand mark. */
export function CategoryTag({ children }: { children: ReactNode }) {
  return (
    <span className="brand-gradient inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white">
      {children}
    </span>
  );
}

export function ProductImage({ product }: { product: Product }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#eef5fb] to-[#edf9f3]">
      <span className="brand-gradient absolute inset-x-0 top-0 z-10 h-1" aria-hidden />
      <ImageSlot
        src={`/images/products/${product.slug}.svg`}
        alt={`${product.name} packaging photo`}
        placeholderLabel={`${product.name} packaging photo`}
        className="aspect-4/3"
        disableDuotone
      />
    </div>
  );
}

export function ProductCard({
  product,
  hoverCapable: hoverCapableProp,
  prefersReducedMotion: prefersReducedMotionProp,
  hidden = false,
  registerRef,
}: ProductCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hookPrefersReducedMotion = usePrefersReducedMotion();
  const hookHoverCapable = useHoverCapable();

  const prefersReducedMotion = prefersReducedMotionProp ?? hookPrefersReducedMotion;
  const hoverCapable = hoverCapableProp ?? hookHoverCapable;

  // Reduced motion: skip the 3D flip entirely, use a plain expand/collapse
  if (prefersReducedMotion) {
    return (
      <div
        ref={registerRef}
        aria-hidden={hidden}
        className={cn(
          "product-card flex flex-col overflow-hidden",
          hidden && "pointer-events-none opacity-0"
        )}
      >
        <ProductImage product={product} />
        <div className="flex flex-1 flex-col p-4.5">
          <div className="mb-2.5 flex flex-wrap gap-2">
            <CategoryTag>{product.category}</CategoryTag>
            <Tag variant="neutral" className="rounded-full">
              {product.type}
            </Tag>
          </div>
          <h3 className="mb-1.5 font-heading text-xl font-semibold tracking-tight text-ink uppercase">
            {product.name}
          </h3>
          <p className="text-sm text-ink/80">{product.ingredient}</p>
          <p className="mt-1 text-[13px] text-ink/60 tabular-nums">{product.dosage}</p>

          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            className="mt-3 self-start text-xs font-semibold tracking-wide text-brand-blue uppercase underline-offset-4 hover:underline cursor-pointer"
          >
            {expanded ? "Less info" : "More info"}
          </button>

          {expanded && (
            <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
              {product.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  const toggle = () => setFlipped((f) => !f);

  return (
    <div
      ref={registerRef}
      aria-hidden={hidden}
      className={cn(
        "product-card group aspect-3/4 [perspective:1000px]",
        hidden && "pointer-events-none opacity-0"
      )}
      onClick={!hoverCapable ? toggle : undefined}
      role={!hoverCapable ? "button" : undefined}
      tabIndex={!hoverCapable ? (hidden ? -1 : 0) : undefined}
      aria-expanded={!hoverCapable ? flipped : undefined}
      onKeyDown={
        !hoverCapable
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                toggle();
              }
            }
          : undefined
      }
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-500 ease-in-out [transform-style:preserve-3d]",
          hoverCapable
            ? "group-hover:[transform:rotateY(180deg)]"
            : flipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front face */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[18px] bg-white [backface-visibility:hidden]">
          <ProductImage product={product} />
          <div className="flex flex-1 flex-col p-4.5">
            <div className="mb-2.5 flex flex-wrap gap-2">
              <CategoryTag>{product.category}</CategoryTag>
              <Tag variant="neutral" className="rounded-full">
                {product.type}
              </Tag>
            </div>
            <h3 className="mb-1.5 font-heading text-xl font-semibold tracking-tight text-ink uppercase">
              {product.name}
            </h3>
            <p className="text-sm text-ink/80">{product.ingredient}</p>
            <p className="mt-1 text-[13px] text-ink/60 tabular-nums">{product.dosage}</p>
          </div>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 flex flex-col justify-center gap-3 overflow-hidden rounded-[18px] bg-white p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="brand-gradient absolute inset-x-0 top-0 h-1" aria-hidden />
          <CategoryTag>{product.category}</CategoryTag>
          <h3 className="font-heading text-xl font-semibold tracking-tight text-ink uppercase">
            {product.name}
          </h3>
          <dl className="space-y-1.5 text-sm">
            <div>
              <dt className="text-[11px] tracking-wide text-ink/55 uppercase">
                Active ingredient
              </dt>
              <dd className="text-ink/85">{product.ingredient}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-wide text-ink/55 uppercase">Dosage</dt>
              <dd className="tabular-nums text-ink/85">{product.dosage}</dd>
            </div>
          </dl>
          <p className="text-[13px] leading-relaxed text-ink/75">{product.description}</p>
        </div>
      </div>
    </div>
  );
}
