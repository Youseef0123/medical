"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { products } from "@/data/products";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Button } from "@/components/ui/Button";
import { gsap, ScrollTrigger, Flip } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useHoverCapable } from "@/lib/hooks/useHoverCapable";
import { cn } from "@/lib/cn";
import type { Product } from "@/types";

const CATEGORIES = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

function filterByCategory(category: string): Product[] {
  return category === "All" ? products : products.filter((p) => p.category === category);
}

const CATEGORY_COUNTS: Record<string, number> = Object.fromEntries(
  CATEGORIES.map((category) => [category, filterByCategory(category).length])
);

export function Products() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [leavingSlugs, setLeavingSlugs] = useState<Set<string>>(new Set());
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const pendingFlipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const enteringSlugsRef = useRef<Set<string>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);
  const segRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const segBtnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const prefersReducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapable();

  const highlightReady = useRef(false);

  // Slide the filter highlight to sit behind the active category button.
  useLayoutEffect(() => {
    const position = (animate: boolean) => {
      const seg = segRef.current;
      const hl = highlightRef.current;
      const btn = segBtnRefs.current.get(activeCategory);
      if (!seg || !hl || !btn) return;

      const props = {
        x: btn.offsetLeft,
        y: btn.offsetTop,
        width: btn.offsetWidth,
        height: btn.offsetHeight,
      };

      if (animate && !prefersReducedMotion) {
        gsap.to(hl, { ...props, duration: 0.4, ease: "power3.out" });
      } else {
        gsap.set(hl, props);
      }
    };

    // Snap into place on first paint; animate on later category changes.
    position(highlightReady.current);
    highlightReady.current = true;

    const onResize = () => position(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [activeCategory, prefersReducedMotion]);

  // One-time staggered reveal when the grid first scrolls into view.
  // Clears its inline props on completion so the Flip filtering below
  // starts from a clean slate.
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const els = Array.from(cardRefs.current.values());
      if (!els.length) return;

      gsap.set(els, { opacity: 0, y: 28, scale: 0.96 });

      ScrollTrigger.create({
        trigger: gridRef.current,
        start: "top 82%",
        once: true,
        onEnter: () => {
          gsap.to(els, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
            stagger: { each: 0.06, from: "start" },
            onComplete: () => gsap.set(els, { clearProps: "opacity,transform" }),
          });
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Runs after a filter change has committed to the DOM: replays the
  // captured Flip state so staying/incoming cards slide into their new
  // grid positions instead of snapping.
  useLayoutEffect(() => {
    const state = pendingFlipState.current;
    if (!state) return;
    pendingFlipState.current = null;

    const enteringEls = Array.from(enteringSlugsRef.current)
      .map((slug) => cardRefs.current.get(slug))
      .filter((el): el is HTMLDivElement => !!el);
    enteringSlugsRef.current = new Set();

    if (enteringEls.length) gsap.set(enteringEls, { opacity: 0, scale: 0.92 });

    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      stagger: 0.03,
      absolute: true,
      onComplete: () => {
        if (enteringEls.length) {
          gsap.to(enteringEls, {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
            stagger: 0.03,
          });
        }
      },
    });
  }, [activeCategory]);

  function handleFilterChange(next: string) {
    if (next === activeCategory) return;

    if (prefersReducedMotion) {
      setActiveCategory(next);
      return;
    }

    const visibleEls = Array.from(cardRefs.current.values());
    const state = Flip.getState(visibleEls);

    const currentSlugs = new Set(filterByCategory(activeCategory).map((p) => p.slug));
    const nextSlugs = new Set(filterByCategory(next).map((p) => p.slug));
    const leaving = [...currentSlugs].filter((slug) => !nextSlugs.has(slug));
    const entering = [...nextSlugs].filter((slug) => !currentSlugs.has(slug));

    enteringSlugsRef.current = new Set(entering);

    // Nothing to animate out — jump straight to capturing state for the
    // upcoming layout effect to replay via Flip.
    if (leaving.length === 0) {
      pendingFlipState.current = state;
      setActiveCategory(next);
      return;
    }

    setLeavingSlugs(new Set(leaving));
    const leavingEls = leaving
      .map((slug) => cardRefs.current.get(slug))
      .filter((el): el is HTMLDivElement => !!el);

    gsap.to(leavingEls, {
      opacity: 0,
      scale: 0.92,
      duration: 0.25,
      stagger: 0.03,
      ease: "power1.in",
      onComplete: () => {
        pendingFlipState.current = state;
        setActiveCategory(next);
        setLeavingSlugs(new Set());
      },
    });
  }

  const visibleProducts = filterByCategory(activeCategory);

  return (
    <section id="products" className="bg-neutral-100 px-5 py-22 sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        {/* Editorial header: kicker tick · rule · section index */}
        <div className="mb-9 flex items-center gap-4">
          <span className="flex items-center gap-3 text-[13px] font-semibold tracking-[0.14em] text-accent-700 uppercase whitespace-nowrap">
            <span className="h-px w-7 bg-accent-700/60" />
            Our Products
          </span>
          <span className="h-px flex-1 bg-divider" />
          <span className="font-heading text-[13px] font-semibold tracking-[0.15em] text-ink/40 tabular-nums">
            03
          </span>
        </div>
        <h2 className="mb-9 font-heading font-semibold leading-[1.05] tracking-tight text-ink uppercase [font-size:clamp(1.75rem,3.4vw,2.75rem)]">
          Formulations you can rely on
        </h2>

        {/* Filter bar: sliding highlight + per-category counts */}
        <div className="mb-9 flex justify-center">
          <div
            ref={segRef}
            className="relative inline-flex flex-wrap border border-divider bg-bg"
            role="group"
            aria-label="Filter products by category"
          >
            <span
              ref={highlightRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-0 bg-accent"
            />
            {CATEGORIES.map((category, i) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  ref={(el) => {
                    if (el) segBtnRefs.current.set(category, el);
                    else segBtnRefs.current.delete(category);
                  }}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleFilterChange(category)}
                  className={cn(
                    "relative z-10 inline-flex items-center gap-2 px-3.5 py-2 font-heading text-[13px] font-semibold tracking-[0.02em] transition-colors duration-300",
                    i > 0 && "border-l border-divider",
                    isActive ? "text-white" : "text-ink hover:text-accent-700"
                  )}
                >
                  <span>{category}</span>
                  <span
                    className={cn(
                      "text-[11px] tabular-nums transition-colors duration-300",
                      isActive ? "text-white/70" : "text-ink/40"
                    )}
                  >
                    {CATEGORY_COUNTS[category]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              hoverCapable={hoverCapable}
              prefersReducedMotion={prefersReducedMotion}
              hidden={leavingSlugs.has(product.slug)}
              registerRef={(el) => {
                if (el) cardRefs.current.set(product.slug, el);
                else cardRefs.current.delete(product.slug);
              }}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button variant="secondary" onClick={() => handleFilterChange("All")}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
  hoverCapable: boolean;
  prefersReducedMotion: boolean;
  hidden: boolean;
  registerRef: (el: HTMLDivElement | null) => void;
}

function ProductCard({
  product,
  hoverCapable,
  prefersReducedMotion,
  hidden,
  registerRef,
}: ProductCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const packagingImage = (
    <div className="overflow-hidden">
      <ImageSlot
        src={`/images/products/${product.slug}.svg`}
        alt={`${product.name} packaging photo`}
        placeholderLabel={`${product.name} packaging photo`}
        className="aspect-4/3"
        disableDuotone
      />
    </div>
  );

  // Reduced motion: skip the 3D flip entirely, use a plain expand/collapse
  // in normal document flow for the back-face content.
  if (prefersReducedMotion) {
    return (
      <Card
        ref={registerRef}
        aria-hidden={hidden}
        className={cn("flex flex-col", hidden && "pointer-events-none")}
      >
        {packagingImage}
        <div className="flex flex-1 flex-col p-4.5">
          <div className="mb-2.5 flex flex-wrap gap-2">
            <Tag variant="accent">{product.category}</Tag>
            <Tag variant="neutral">{product.type}</Tag>
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
            className="mt-3 self-start text-xs font-semibold tracking-wide text-accent-700 uppercase underline-offset-4 hover:underline"
          >
            {expanded ? "Less info" : "More info"}
          </button>

          {expanded && (
            <p className="mt-2 text-[13px] leading-relaxed text-ink/75">
              {product.description}
            </p>
          )}
        </div>
      </Card>
    );
  }

  const toggle = () => setFlipped((f) => !f);

  return (
    <Card
      ref={registerRef}
      aria-hidden={hidden}
      className={cn(
        "product-flip group aspect-3/4 [perspective:1000px]",
        hidden && "pointer-events-none"
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
        <div className="absolute inset-0 flex flex-col [backface-visibility:hidden]">
          {packagingImage}
          <div className="flex flex-1 flex-col p-4.5">
            <div className="mb-2.5 flex flex-wrap gap-2">
              <Tag variant="accent">{product.category}</Tag>
              <Tag variant="neutral">{product.type}</Tag>
            </div>
            <h3 className="mb-1.5 font-heading text-xl font-semibold tracking-tight text-ink uppercase">
              {product.name}
            </h3>
            <p className="text-sm text-ink/80">{product.ingredient}</p>
            <p className="mt-1 text-[13px] text-ink/60 tabular-nums">{product.dosage}</p>
          </div>

          {/* Flip affordance cue — fades out as the card flips on hover;
              stays visible on touch as a tap hint. */}
          <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink/40 transition-opacity duration-300 group-hover:opacity-0">
            <RotateCw className="h-3 w-3" strokeWidth={2} />
            {hoverCapable ? "Hover" : "Tap"}
          </span>
        </div>

        {/* Back face */}
        <div className="absolute inset-0 flex flex-col justify-center gap-3 bg-neutral-100 p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <Tag variant="outline" className="self-start">
            {product.type}
          </Tag>
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
    </Card>
  );
}
