"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { PackageOpen } from "lucide-react";
import { fetchProducts } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/ui/ProductCard";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useHoverCapable } from "@/lib/hooks/useHoverCapable";
import type { Product } from "@/types";

const FEATURED_LIMIT = 3;

export function Products() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hoverCapable = useHoverCapable();

  // Homepage shows only the products flagged as featured in Strapi
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchProducts({ featured: true, limit: FEATURED_LIMIT })
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
        ) : productList.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
          >
            {productList.map((product) => (
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
          <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700">
              <PackageOpen className="h-8 w-8" />
            </div>
            <h3 className="mb-2 font-heading text-2xl font-bold uppercase text-ink">
              No Products Available
            </h3>
            <p className="mx-auto max-w-md text-sm text-ink/70">
              There are no products to show right now. Please check back soon.
            </p>
          </div>
        )}

        <div className="mt-11 text-center">
          <Button variant="secondary" href="/products">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
}
