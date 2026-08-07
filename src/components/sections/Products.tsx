"use client";

import { useLayoutEffect, useRef, useState, useEffect, useMemo } from "react";
import { fetchProducts } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { gsap, Flip } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useHoverCapable } from "@/lib/hooks/useHoverCapable";
import type { Product } from "@/types";

export function Products() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [leavingSlugs, setLeavingSlugs] = useState<Set<string>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const pendingFlipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const enteringSlugsRef = useRef<Set<string>>(new Set());
  const prefersReducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapable();

  // Fetch real products from Strapi on mount
  useEffect(() => {
    let isMounted = true;
    fetchProducts().then((fetched) => {
      if (isMounted) {
        setProductList(fetched || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(productList.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [productList]);

  const visibleProducts = useMemo(() => {
    return activeCategory === "All"
      ? productList
      : productList.filter((p) => p.category === activeCategory);
  }, [productList, activeCategory]);

  // One-shot entrance: staggered fade-up as the grid scrolls into view.
  // clearProps wipes the inline transforms afterwards so the GSAP Flip
  // filter animation always measures clean layout positions.
  useLayoutEffect(() => {
    if (prefersReducedMotion) return;
    const els = Array.from(cardRefs.current.values());
    if (!els.length) return;

    const ctx = gsap.context(() => {
      gsap.from(els, {
        opacity: 0,
        y: 26,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.07,
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 78%",
          once: true,
        },
      });
    }, sectionRef);

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

    const getFiltered = (cat: string) =>
      cat === "All" ? productList : productList.filter((p) => p.category === cat);

    const currentSlugs = new Set(getFiltered(activeCategory).map((p) => p.slug));
    const nextSlugs = new Set(getFiltered(next).map((p) => p.slug));
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

  return (
    <section ref={sectionRef} id="products" className="bg-neutral-100 px-5 py-22 sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-9 text-center">
          <span className="brand-text mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">
            Our Products
          </span>
          <h2 className="text-[32px] font-semibold tracking-tight text-ink uppercase">
            Formulations you can rely on
          </h2>
          <span className="brand-gradient mx-auto mt-4 block h-1 w-16 rounded-full" />
        </div>

        <div className="mb-10 flex justify-center">
          <div className="seg flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className="seg-opt"
                aria-pressed={activeCategory === category}
                onClick={() => handleFilterChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="mt-11 text-center">
          <Button variant="secondary" onClick={() => (window.location.href = "/products")}>
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}
