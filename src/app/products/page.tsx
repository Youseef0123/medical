"use client";

import { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { gsap } from "@/lib/gsap";
import { fetchProducts } from "@/lib/strapi";
import type { Product } from "@/types";
import {
  ChevronRight,
  FilterX,
  Home,
  Pill,
  Search,
  X,
} from "lucide-react";

const CATEGORY_OPTIONS: { key: string; label: string }[] = [
  { key: "All", label: "All Categories" },
  { key: "Neurology", label: "Neurology" },
  { key: "Mental Health", label: "Mental Health" },
  { key: "Cardiology", label: "Cardiology" },
  { key: "Metabolic", label: "Metabolic" },
];

const TYPE_OPTIONS: { key: string; label: string }[] = [
  { key: "All", label: "All Types" },
  { key: "Prescription", label: "Prescription (Rx)" },
  { key: "OTC", label: "OTC (Over-The-Counter)" },
];

export default function ProductsPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");

  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Fetch Live Products directly from Strapi
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

  // Combined Filtering Logic
  const filteredProducts = useMemo(() => {
    return productList.filter((product) => {
      // Category Filter
      const matchesCategory =
        selectedCategory === "All" || product.category.toLowerCase() === selectedCategory.toLowerCase();

      // Type Filter
      const matchesType =
        selectedType === "All" || product.type.toLowerCase() === selectedType.toLowerCase();

      // Search Query Filter (Matches Name or Active Ingredient)
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        product.name.toLowerCase().includes(q) ||
        product.ingredient.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);

      return matchesCategory && matchesType && matchesSearch;
    });
  }, [productList, searchQuery, selectedCategory, selectedType]);

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "All" || selectedType !== "All";

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedType("All");
  };

  // GSAP Animations
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current.querySelectorAll(".hero-anim"),
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            clearProps: "all",
          }
        );
      }
    }, mainRef);

    return () => ctx.revert();
  }, []);

  // Filter change animation helper
  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    animateGrid();
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    animateGrid();
  };

  const animateGrid = () => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll(".product-card");
      if (cards.length) {
        gsap.fromTo(
          cards,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "all",
            onComplete: () => {
              gsap.set(cards, { clearProps: "all" });
            },
          }
        );
      }
    }
  };

  return (
    <>
      <Header />
      <main ref={mainRef} className="flex-1 bg-bg">
        {/* ── 1. Hero Section (Mini Hero for Products Page) ─────────── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-neutral-900 px-5 pt-32 pb-16 text-white sm:px-8 md:pt-40 md:pb-24"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero-about.jpg"
              alt="Medisave Products Portfolio"
              fill
              priority
              className="object-cover opacity-65 transition-transform duration-1000 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/75 via-neutral-950/45 to-neutral-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-blue)_0%,transparent_60%)] opacity-25" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <nav
              aria-label="Breadcrumb"
              className="hero-anim mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
            >
              <Link
                href="/"
                className="flex items-center gap-1 text-xs font-semibold text-white/70 transition-colors hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-white/40" />
              <span className="text-xs font-semibold text-accent-300">
                Products
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="hero-anim mb-4">
                <Tag variant="accent">Pharmaceutical Formulations</Tag>
              </div>
              <h1 className="hero-anim mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                Our <span className="brand-text">Products</span>
              </h1>
              <p className="hero-anim max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                High-standard specialized medications across Neurology, Mental Health,
                Cardiology, and Metabolic care, validated against pharmacopeial standard.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Filters & Search Bar Section ───────────────────────── */}
        <section className="px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm md:p-8">
              {/* Search & Main Filter Controls */}
              <div className="grid gap-6 md:grid-cols-12 items-center">
                {/* Search Bar Input */}
                <div className="md:col-span-6 relative">
                  <label htmlFor="product-search" className="sr-only">
                    Search Products
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40" />
                    <input
                      id="product-search"
                      type="text"
                      placeholder="Search by drug name, ingredient (e.g. Ginkgo, Escitalopram)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-divider bg-neutral-50 py-3.5 pl-12 pr-10 text-sm font-medium text-ink placeholder:text-ink/40 transition-colors focus:border-brand-blue focus:bg-white focus:outline-none"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search query"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Type Filter Select / Toggle */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="text-xs font-bold text-ink/60 uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                    <Pill className="h-4 w-4 text-accent-700" />
                    Type:
                  </span>
                  <div className="flex flex-1 items-center gap-1 rounded-full border border-divider bg-neutral-100 p-1">
                    {TYPE_OPTIONS.map((t) => {
                      const isActive = selectedType === t.key;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => handleTypeSelect(t.key)}
                          className={`flex-1 rounded-full py-1.5 px-2 text-[11px] font-semibold uppercase transition-all duration-200 ${
                            isActive
                              ? "brand-gradient text-white shadow-sm"
                              : "text-ink/70 hover:text-ink"
                          }`}
                        >
                          {t.key}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Reset Button (If filters active) */}
                <div className="md:col-span-2 flex justify-end">
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-100 cursor-pointer"
                    >
                      <FilterX className="h-4 w-4" />
                      <span>Reset</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                      All Filters
                    </span>
                  )}
                </div>
              </div>

              {/* Category Segment Tabs */}
              <div className="mt-6 border-t border-divider pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-2 text-xs font-bold text-ink/60 uppercase tracking-wider">
                    Category:
                  </span>
                  <div className="seg flex-wrap">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.key}
                        type="button"
                        className="seg-opt"
                        aria-pressed={selectedCategory === cat.key}
                        onClick={() => handleCategorySelect(cat.key)}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Counter */}
                <div className="text-xs font-semibold tracking-wide text-ink/60 tabular-nums">
                  Showing{" "}
                  <span className="text-accent-700 font-bold">
                    {filteredProducts.length}
                  </span>{" "}
                  of {productList.length} products
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Products Grid Section ─────────────────────────────── */}
        <section className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            {isLoading ? (
              <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-700 border-t-transparent" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-ink">
                  Loading Products Catalog...
                </h3>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold uppercase text-ink">
                  No Products Found
                </h3>
                <p className="mx-auto mb-6 max-w-md text-sm text-ink/70">
                  We couldn&apos;t find any pharmaceutical products matching your search query &ldquo;
                  <span className="font-semibold text-ink">{searchQuery}</span>&rdquo;. Try searching for another active ingredient or reset the filters.
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
