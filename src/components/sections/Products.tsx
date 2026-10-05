"use client";

import { useLayoutEffect, useRef, useState, useEffect, type UIEvent } from "react";
import { PackageOpen } from "lucide-react";
import { fetchProducts } from "@/lib/strapi";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { ProductCard } from "@/components/ui/ProductCard";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useHoverCapable } from "@/lib/hooks/useHoverCapable";
import type { Product } from "@/types";

const FEATURED_LIMIT = 3;

export function Products() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSlide, setActiveSlide] = useState(0);
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

  // Mobile carousel: the slide nearest the centre drives the dot indicator
  const handleCarouselScroll = (event: UIEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const slides = Array.from(track.children) as HTMLElement[];
    const centre = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    slides.forEach((slide, i) => {
      const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - centre);
      const best = Math.abs(slides[nearest].offsetLeft + slides[nearest].offsetWidth / 2 - centre);
      if (distance < best) nearest = i;
    });
    setActiveSlide(nearest);
  };

  return (
    <section ref={sectionRef} id="products" className="bg-neutral-100 px-5 py-16 sm:px-8 sm:py-22">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 text-center sm:mb-9">
          <span className="brand-text mb-3 block text-[13px] font-semibold tracking-[0.08em] uppercase">
            Our Products
          </span>
          <h2 className="text-[26px] font-semibold tracking-tight text-ink uppercase sm:text-[32px]">
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
          <>
            {/* Swipeable carousel on phones, grid from sm up */}
            <div
              ref={gridRef}
              onScroll={handleCarouselScroll}
              className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-7 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3"
            >
              {productList.map((product) => (
                <div
                  key={product.slug}
                  className="product-card-wrapper w-[80%] shrink-0 snap-center sm:w-auto"
                >
                  <ProductCard
                    product={product}
                    hoverCapable={hoverCapable}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                </div>
              ))}
            </div>

            {productList.length > 1 && (
              <div className="mt-5 flex justify-center gap-2 sm:hidden" aria-hidden>
                {productList.map((product, i) => (
                  <span
                    key={product.slug}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      i === activeSlide ? "brand-gradient w-6" : "w-2 bg-ink/20"
                    )}
                  />
                ))}
              </div>
            )}
          </>
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

        <div className="mt-8 text-center sm:mt-11">
          <Button variant="secondary" href="/products">
            Load More
          </Button>
        </div>
      </div>
    </section>
  );
}
