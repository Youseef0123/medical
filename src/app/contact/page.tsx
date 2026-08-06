"use client";

import { useState, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { CtaButton } from "@/components/ui/CtaButton";
import { Tag } from "@/components/ui/Tag";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { companyInfo } from "@/data/company";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  HeartPulse,
  Home,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  Stethoscope,
  XCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formSectionRef = useRef<HTMLDivElement>(null);
  const mapSectionRef = useRef<HTMLDivElement>(null);
  const audienceRef = useRef<HTMLDivElement>(null);

  /**
   * TODO: Strapi CMS API Integration Notice
   * ---------------------------------------------------------------------------
   * This submit handler simulates a network API call to Strapi backend.
   * When Strapi is live, replace the setTimeout block with:
   *
   * const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/api/contact-inquiries`, {
   *   method: "POST",
   *   headers: { "Content-Type": "application/json" },
   *   body: JSON.stringify({ data: formData }),
   * });
   * ---------------------------------------------------------------------------
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Simple email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      // Simulate asynchronous API request (Mock submit)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Failed to send message. Please try again later.");
    }
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

  return (
    <>
      <Header />
      <main ref={mainRef} className="flex-1 bg-bg">
        {/* ── 1. Hero Section (Mini Hero for Contact Us Page) ────────── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-neutral-900 px-5 pt-32 pb-16 text-white sm:px-8 md:pt-40 md:pb-24"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero-about.jpg"
              alt="Medisave Contact Us"
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
                Contact Us
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="hero-anim mb-4">
                <Tag variant="accent">Get In Touch</Tag>
              </div>
              <h1 className="hero-anim mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                Contact <span className="brand-text">Medisave</span>
              </h1>
              <p className="hero-anim max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                Dedicated support for Healthcare Professionals, Hospitals, Pharmacies,
                and Patient Inquiries across Egypt and the region.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Two-Column Main Layout (Form + Contact Info) ─────────── */}
        <section ref={formSectionRef} className="px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
              {/* Column 1: Contact Form */}
              <div className="anim-col lg:col-span-7">
                <div className="rounded-2xl border border-divider bg-white p-8 shadow-sm md:p-10">
                  <div className="mb-8">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                      Send A Message
                    </span>
                    <h2 className="font-heading text-2xl font-bold uppercase text-ink sm:text-3xl">
                      Direct Communication Form
                    </h2>
                    <p className="mt-2 text-sm text-ink/75">
                      Fill out the details below and our medical communications team will
                      respond within 24 business hours.
                    </p>
                  </div>

                  {status !== "success" ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {status === "error" && (
                        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                          <XCircle className="h-5 w-5 shrink-0" />
                          <span>{errorMessage || "An error occurred. Please try again."}</span>
                        </div>
                      )}

                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Full Name */}
                        <div className="space-y-2">
                          <label
                            htmlFor="fullName"
                            className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="fullName"
                            type="text"
                            required
                            placeholder="Dr. / Mr. / Ms. Full Name"
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({ ...formData, fullName: e.target.value })
                            }
                            className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3.5 text-sm font-medium text-ink placeholder:text-ink/35 transition-all duration-200 focus:border-brand-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,151,212,0.15)] focus:outline-none"
                          />
                        </div>

                        {/* Email Address */}
                        <div className="space-y-2">
                          <label
                            htmlFor="email"
                            className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                          >
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3.5 text-sm font-medium text-ink placeholder:text-ink/35 transition-all duration-200 focus:border-brand-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,151,212,0.15)] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        {/* Phone Number (Optional) */}
                        <div className="space-y-2">
                          <label
                            htmlFor="phone"
                            className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                          >
                            Phone Number <span className="text-ink/40 font-normal">(Optional)</span>
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            placeholder="e.g. 0100 000 0000"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3.5 text-sm font-medium text-ink placeholder:text-ink/35 transition-all duration-200 focus:border-brand-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,151,212,0.15)] focus:outline-none"
                          />
                        </div>

                        {/* Subject Selector */}
                        <div className="space-y-2">
                          <label
                            htmlFor="subject"
                            className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                          >
                            Inquiry Subject <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <select
                              id="subject"
                              required
                              value={formData.subject}
                              onChange={(e) =>
                                setFormData({ ...formData, subject: e.target.value })
                              }
                              className="w-full appearance-none rounded-xl border border-divider bg-neutral-50 px-4 py-3.5 pr-10 text-sm font-medium text-ink transition-all duration-200 focus:border-brand-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,151,212,0.15)] focus:outline-none"
                            >
                              <option value="general">General Company Inquiry</option>
                              <option value="products">Clinical & Product Info</option>
                              <option value="partnership">Hospital & Supply Partnership</option>
                              <option value="quality">Quality Assurance & Pharmacovigilance</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-ink/50">
                              <svg
                                className="h-4 w-4 fill-none stroke-current"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="space-y-2">
                        <label
                          htmlFor="message"
                          className="block text-xs font-bold uppercase tracking-wider text-ink/70"
                        >
                          Message Details <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          placeholder="Provide details about your query or medical inquiry..."
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          className="w-full rounded-xl border border-divider bg-neutral-50 px-4 py-3.5 text-sm font-medium text-ink placeholder:text-ink/35 transition-all duration-200 focus:border-brand-blue focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,151,212,0.15)] focus:outline-none resize-y"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full brand-gradient px-8 py-4 font-heading text-sm font-semibold tracking-wide text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-8px_rgba(46,151,212,0.7)] cursor-pointer disabled:opacity-70"
                      >
                        {status === "loading" ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Sending Inquiry...</span>
                          </>
                        ) : (
                          <>
                            <span>Send Inquiry</span>
                            <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Success Panel */
                    <div className="flex flex-col items-center justify-center p-8 text-center animate-[ms-fadeUp_0.3s_ease]">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300">
                        <CheckCircle2 className="h-8 w-8" />
                      </div>
                      <h3 className="mb-2 font-heading text-2xl font-bold uppercase text-ink">
                        Inquiry Received
                      </h3>
                      <p className="mb-6 max-w-md text-sm leading-relaxed text-ink/75">
                        Thank you, <span className="font-semibold text-ink">{formData.fullName}</span>. Your message has been routed to Medisave Pharma&apos;s communications team. We will respond to{" "}
                        <span className="font-semibold text-accent-700">{formData.email}</span> shortly.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            fullName: "",
                            email: "",
                            phone: "",
                            subject: "general",
                            message: "",
                          });
                          setStatus("idle");
                        }}
                        className="rounded-full border border-divider bg-white px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:border-brand-blue hover:text-brand-blue cursor-pointer"
                      >
                        Send Another Inquiry
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Contact Info Panel */}
              <div className="anim-col lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-divider bg-neutral-900 p-6 sm:p-8 md:p-9 text-white shadow-xl">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-accent-400">
                    Official Directory
                  </span>
                  <h3 className="mb-8 font-heading text-2xl font-bold uppercase text-white tracking-tight">
                    Headquarters & Details
                  </h3>

                  <div className="mt-8 space-y-6 sm:space-y-7">
                    {/* Address */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-accent-300">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                          Office Address
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-white/90 font-medium">
                          {companyInfo.address}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-accent-300">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                          Official Email
                        </span>
                        <p className="mt-1 text-sm font-semibold text-white">
                          <a
                            href={`mailto:${companyInfo.email}`}
                            className="hover:text-accent-300 transition-colors"
                          >
                            {companyInfo.email}
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-accent-300">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                          Phone Line
                        </span>
                        <p className="mt-1 text-sm font-semibold text-white">
                          <a
                            href={`tel:${companyInfo.phoneTel}`}
                            className="hover:text-accent-300 transition-colors"
                          >
                            {companyInfo.phoneDisplay}
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-accent-300">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                          Working Hours
                        </span>
                        <p className="mt-1 text-sm leading-relaxed text-white/90">
                          Sunday – Thursday: 9:00 AM – 5:00 PM (EET)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-white/15 pt-6">
                    <CtaButton
                      href={`tel:${companyInfo.phoneTel}`}
                      variant="primary"
                      className="w-full justify-center !px-5 !py-3 text-xs"
                    >
                      Call Now
                    </CtaButton>
                    <CtaButton
                      href={`mailto:${companyInfo.email}`}
                      variant="secondary"
                      className="w-full justify-center !px-5 !py-3 text-xs !border-white/20 !text-white hover:!border-white hover:!text-white"
                    >
                      Email Us
                    </CtaButton>
                  </div>
                </div>

                {/* Patient Safety Note */}
                <div className="blueprint p-6 bg-accent-100/50 border-accent-300/40 rounded-2xl">
                  <div className="flex items-center gap-2 text-accent-800 font-heading text-sm font-bold uppercase mb-2">
                    <ShieldCheck className="h-5 w-5 text-accent-700 shrink-0" />
                    <span>Medical Safety & Compliance</span>
                  </div>
                  <p className="text-xs text-ink/75 leading-relaxed">
                    For urgent adverse event reporting or medication safety concerns, please contact our quality department directly via email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Google Maps Section ─────────────────────────────────── */}
        {/*
          TODO: Map Coordinates Notice
          Replace iframe src with actual Google Maps embed link for Medisave Pharma office:
          11 Khaled ibn Al Walid, Masaken Sheraton, Cairo, Egypt
        */}
        <section ref={mapSectionRef} className="px-5 pb-16 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                  Location Map
                </span>
                <h3 className="font-heading text-2xl font-bold uppercase text-ink">
                  Headquarters Location
                </h3>
              </div>
              <span className="text-xs text-ink/60">
                11 Khaled ibn Al Walid, Masaken Sheraton, Cairo
              </span>
            </div>

            <div className="blueprint relative aspect-21/9 min-h-[320px] w-full overflow-hidden rounded-2xl border border-divider shadow-md">
              <iframe
                title="Medisave Pharma Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3451.9868778007055!2d31.3789!3d30.0965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581604a11f2df9%3A0x8e833fb359f4df91!2sMasaken%20Sheraton%2C%20Al%20Matar%2C%20El%20Nozha%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1700000000000!5m2!1sen!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full grayscale opacity-90 transition-all duration-500 hover:grayscale-0 hover:opacity-100"
              />
            </div>
          </div>
        </section>

        {/* ── 4. "Who Should Contact Us" Section ──────────────────────── */}
        <section ref={audienceRef} className="bg-neutral-100 px-5 py-20 sm:px-8 md:py-28">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-14 text-center">
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                Tailored Channels
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
                Who Should Contact Us
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Audience 1: Healthcare Professionals */}
              <Card className="audience-card group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 transition-colors duration-300 group-hover:bg-accent-600 group-hover:text-white">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                  Healthcare Professionals
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-ink/80">
                  For clinical product specifications, dosage guidance, pharmacological inquiries, and medical literature requests.
                </p>
                <Link
                  href="#fullName"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-700 hover:text-accent-800"
                >
                  <span>Request Medical Info</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Card>

              {/* Audience 2: Pharmacies & Hospitals */}
              <Card className="audience-card group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-2-100 text-accent-2-700 transition-colors duration-300 group-hover:bg-accent-2-600 group-hover:text-white">
                  <Building2 className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                  Pharmacies & Hospitals
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-ink/80">
                  For bulk supply partnerships, distribution networks, tender participation, and commercial supply terms.
                </p>
                <Link
                  href="#fullName"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-2-700 hover:text-accent-2-800"
                >
                  <span>Inquire for Supply</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Card>

              {/* Audience 3: General Inquiries */}
              <Card className="audience-card group p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-100 text-accent-700 transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white">
                  <MessageSquare className="h-7 w-7" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold uppercase text-ink">
                  General & Patient Inquiries
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-ink/80">
                  For general company inquiries, career opportunities, feedback, and consumer drug safety information.
                </p>
                <Link
                  href="#fullName"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-700 hover:text-accent-800"
                >
                  <span>Contact Support</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
