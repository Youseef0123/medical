"use client";

import { useLayoutEffect, useRef, useState, useEffect, useMemo } from "react";
import { fetchProducts } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useHoverCapable } from "@/lib/hooks/useHoverCapable";
import { uniqueValues } from "@/lib/uniqueValues";
import type { Product } from "@/types";

const ALL_CATEGORIES = "All";

export function Products() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapable();

  // Fetch real products from Strapi on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchProducts()
      .then((fetched) => {
        if (isMounted) {
          setProductList(fetched || []);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Category tabs are derived from the products returned by the backend
  const categories = useMemo(
    () => [ALL_CATEGORIES, ...uniqueValues(productList, (p) => p.category)],
    [productList]
  );

  const visibleProducts = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) return productList;
    return productList.filter(
      (p) => p.category.trim().toLowerCase() === activeCategory.toLowerCase()
    );
  }, [productList, activeCategory]);

  // One-shot entrance: staggered fade-up as the grid scrolls into view.
  useLayoutEffect(() => {
    if (prefersReducedMotion || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".product-card-wrapper");
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isLoading]);

  const handleFilterChange = (next: string) => {
    if (next === activeCategory) return;
    setActiveCategory(next);

    if (gridRef.current && !prefersReducedMotion) {
      const cards = gridRef.current.querySelectorAll(".product-card-wrapper");
      if (cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "all",
          }
        );
      }
    }
  };

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

        {/* Categories Tab Bar */}
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

        {/* Products Grid or States */}
        {isLoading ? (
          <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-700 border-t-transparent" />
            </div>
            <h3 className="font-heading text-xl font-bold uppercase text-ink">
              Loading Products Catalog...
            </h3>
          </div>
        ) : visibleProducts.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visibleProducts.map((product) => (
              <div key={product.slug} className="product-card-wrapper">
                <ProductCard
                  product={product}
                  hoverCapable={hoverCapable}
                  prefersReducedMotion={prefersReducedMotion}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State for category with no products */
          <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
            <h3 className="mb-2 font-heading text-xl font-bold uppercase text-ink">
              No Products Available
            </h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-ink/70">
              There are currently no products available under the &ldquo;{activeCategory}&rdquo; category.
            </p>
            <Button variant="secondary" onClick={() => handleFilterChange(ALL_CATEGORIES)}>
              View All Products
            </Button>
          </div>
        )}

        <div className="mt-11 text-center">
          <Button variant="secondary" onClick={() => (window.location.href = "/products")}>
            View All Products Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}
