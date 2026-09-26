"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { CtaButton } from "@/components/ui/CtaButton";
import { Tag } from "@/components/ui/Tag";
import { gsap } from "@/lib/gsap";
import {
  Award,
  ChevronRight,
  Eye,
  Handshake,
  Home,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

export default function AboutPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <Header />
      <main ref={mainRef} className="flex-1 bg-bg">
        {/* ── 1. Hero Section (Mini Hero for About Page) ──────────────── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-neutral-900 px-5 pt-32 pb-16 text-white sm:px-8 md:pt-40 md:pb-24"
        >
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero-about.jpg"
              alt="Medisave Pharmaceutical Lab"
              fill
              priority
              className="object-cover opacity-65 transition-transform duration-1000 ease-out hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/75 via-neutral-950/45 to-neutral-950/20" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-blue)_0%,transparent_60%)] opacity-25" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px]">
            {/* Breadcrumb navigation */}
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
                About Us
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="hero-anim mb-4">
                <Tag variant="accent">Medisave Pharma</Tag>
              </div>
              <h1 className="hero-anim mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                About <span className="brand-text">Us</span>
              </h1>
              <p className="hero-anim mb-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                National pharmaceutical excellence in Central Nervous System (CNS)
                & specialized healthcare solutions across Egypt.
              </p>
              <div className="hero-anim flex flex-wrap gap-4">
                <CtaButton href="#about-intro" variant="primary">
                  Discover Our Heritage
                </CtaButton>
                <CtaButton href="#values" variant="secondary" className="!border-white/20 !text-white hover:!border-accent hover:!text-accent">
                  Explore Our Values
                </CtaButton>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. About Section (Introduction) ───────────────────────── */}
        <section
          id="about-intro"
          ref={introRef}
          className="px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="intro-anim lg:col-span-7">
                <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                  National Focus & Heritage
                </span>
                <h2 className="mb-6 font-heading text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
                  Delivering High-Standard, Specialized Medications Tailored to CNS Patients
                </h2>
                <p className="mb-6 text-base leading-relaxed text-ink/80 md:text-lg">
                  Medisave Pharma is a national pharmaceutical company driven by a
                  shared mission: delivering high-standard, specialized medications
                  tailored to Central Nervous System (CNS) patients across Egypt,
                  founded in 2013 with a focus on high-quality products. Medisave
                  quickly earned the trust of healthcare professionals through
                  reliable products and clinical efficacy.
                </p>

                {/* Metric highlights */}
                <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
                  <div className="blueprint p-4 text-center">
                    <span className="font-heading text-2xl font-bold text-accent-700">
                      Est. 2013
                    </span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-ink/60">
                      Founded in Egypt
                    </span>
                  </div>
                  <div className="blueprint p-4 text-center">
                    <span className="font-heading text-2xl font-bold text-accent-700">
                      CNS Care
                    </span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-ink/60">
                      Specialized Focus
                    </span>
                  </div>
                  <div className="blueprint col-span-2 p-4 text-center sm:col-span-1">
                    <span className="font-heading text-2xl font-bold text-accent-2-700">
                      100%
                    </span>
                    <span className="mt-1 block text-xs font-medium uppercase tracking-wider text-ink/60">
                      Clinical Trust
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Frame */}
              <div className="intro-anim lg:col-span-5">
                <div className="blueprint relative aspect-4/3 overflow-hidden shadow-xl sm:aspect-square">
                  <div className="duotone h-full w-full">
                    <Image
                      src="/images/about/about-intro.jpg"
                      alt="Medisave Healthcare Professionals"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/40 to-transparent p-6 text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-accent-300" />
                      <span className="font-heading text-sm font-semibold tracking-wide uppercase">
                        Clinical Efficacy & Reliability
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 & 4. Vision & Mission Section ────────────────────────── */}
        <section
          id="vision-mission"
          ref={visionRef}
          className="bg-neutral-900 px-5 py-20 text-white sm:px-8 md:py-28"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-14 text-center">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-400">
                Strategic Direction
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-white sm:text-4xl">
                Vision & Mission
              </h2>
            </div>

            {/* Featured visual graphic */}
            <div className="vision-card mb-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
              <div className="relative aspect-21/9 min-h-[220px] w-full overflow-hidden rounded-xl">
                <Image
                  src="/images/about/vision-mission.jpg"
                  alt="Medisave CNS Care Vision & Mission"
                  fill
                  sizes="100vw"
                  className="object-cover opacity-85 transition-transform duration-700 hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent-300">
                      Pharmaceutical Innovation
                    </span>
                    <h3 className="font-heading text-xl font-bold uppercase text-white sm:text-2xl">
                      Pioneering Patient-Centered Healthcare
                    </h3>
                  </div>
                  <Tag variant="accent">Egypt & Middle East</Tag>
                </div>
              </div>
            </div>

            {/* Two-Column Cards Layout */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Vision Card */}
              <Card className="vision-card border-white/10 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-900/80 text-accent-400 border border-accent-700/50">
                  <Eye className="h-7 w-7" />
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold uppercase text-white">
                  Vision
                </h3>
                <p className="text-base leading-relaxed text-white/80">
                  To become a leading pharmaceutical company in Egypt and a
                  significant player in the Middle East, with patient-focused,
                  high-value healthcare solutions. To reach primacy in our field and
                  provide high-quality and reliable drugs.
                </p>
              </Card>

              {/* Mission Card */}
              <Card className="vision-card border-white/10 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-lg">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-2-900/80 text-accent-2-400 border border-accent-2-700/50">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="mb-4 font-heading text-2xl font-bold uppercase text-white">
                  Mission
                </h3>
                <p className="text-base leading-relaxed text-white/80">
                  We are committed to providing high-quality products to our
                  patients, considering them the cornerstone of our commitment and
                  paying close attention to their quality of life. We dedicate
                  ourselves to introducing safe & effective therapies which will add
                  more value to the pharmaceutical market.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ── 5. Our Values Section ──────────────────────────────────── */}
        <section
          id="values"
          ref={valuesRef}
          className="bg-neutral-100 px-5 py-20 sm:px-8 md:py-28"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-14 text-center">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                Guiding Principles
              </span>
              <h2 className="mb-4 font-heading text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
                Our Values
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-ink/80">
                Our values serve as the fundamental principles guiding our efforts to
                establish the company as a prominent and influential market participant.
                These values include:
              </p>
            </div>

            {/* 3 Values Cards Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Card 1: Operational Excellence */}
              <Card className="value-card group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Award className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                  Operational Excellence
                </h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  We continuously improve our processes, optimize performance, and
                  execute with discipline to deliver consistent quality, efficiency,
                  and value.
                </p>
              </Card>

              {/* Card 2: Integrity */}
              <Card className="value-card group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-2-100 text-accent-2-700 transition-colors duration-300 group-hover:bg-accent-2-600 group-hover:text-white">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                  Integrity
                </h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  We act with honesty, ethics, and accountability, ensuring
                  compliance and building trust in every decision and interaction.
                </p>
              </Card>

              {/* Card 3: Collaboration */}
              <Card className="value-card group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <Handshake className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                  Collaboration
                </h3>
                <p className="text-sm leading-relaxed text-ink/80">
                  We work together across teams, sharing knowledge and supporting
                  one another to achieve common goals and deliver better outcomes.
                </p>
              </Card>
            </div>

            {/* Bottom Callout Banner */}
            <div className="mt-16 rounded-2xl border border-divider bg-white p-8 text-center shadow-md md:p-12">
              <h3 className="mb-3 font-heading text-2xl font-bold uppercase text-ink">
                Partner with Medisave Pharma
              </h3>
              <p className="mx-auto mb-6 max-w-xl text-base text-ink/80">
                Discover how our specialized formulations and commitment to clinical
                quality can support your healthcare facility or pharmacy network.
              </p>
              <CtaButton href="/#contact" variant="primary">
                Contact Our Clinical Team
              </CtaButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
