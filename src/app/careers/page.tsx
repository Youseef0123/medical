"use client";

import { useState, useEffect, useMemo, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ApplyModal } from "@/components/ui/ApplyModal";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { gsap } from "@/lib/gsap";
import { fetchOpenJobs } from "@/lib/strapi";
import type { Job, JobType } from "@/types";
import {
  Award,
  Briefcase,
  ChevronRight,
  FilterX,
  GraduationCap,
  HeartPulse,
  Home,
  MapPin,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

const DEPARTMENT_OPTIONS = [
  "All Departments",
  "Sales & Marketing",
  "Quality Assurance",
  "Regulatory Affairs",
  "Research & Development",
  "Medical & Clinical Affairs",
];

const LOCATION_OPTIONS = [
  "All Locations",
  "Cairo, Egypt",
  "Giza, Egypt",
  "10th of Ramadan, Egypt",
];

const TYPE_OPTIONS: { key: string; label: string }[] = [
  { key: "All", label: "All Types" },
  { key: "Full-time", label: "Full-time" },
  { key: "Part-time", label: "Part-time" },
  { key: "Contract", label: "Contract" },
  { key: "Internship", label: "Internship" },
];

export default function CareersPage() {
  const [jobList, setJobList] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDept, setSelectedDept] = useState<string>("All Departments");
  const [selectedLoc, setSelectedLoc] = useState<string>("All Locations");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  // Fetch Live Open Jobs directly from Strapi on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetchOpenJobs()
      .then((fetched) => {
        if (isMounted) {
          setJobList(fetched || []);
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

  // Filter Logic with jobList in dependencies
  const filteredJobs = useMemo(() => {
    return jobList.filter((j) => {
      const matchesDept =
        selectedDept === "All Departments" ||
        j.department.toLowerCase() === selectedDept.toLowerCase();

      const matchesLoc =
        selectedLoc === "All Locations" ||
        j.location.toLowerCase() === selectedLoc.toLowerCase();

      const matchesType =
        selectedType === "All" ||
        j.type.toLowerCase() === selectedType.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        j.title.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q);

      return matchesDept && matchesLoc && matchesType && matchesSearch;
    });
  }, [jobList, selectedDept, selectedLoc, selectedType, searchQuery]);

  const hasActiveFilters =
    selectedDept !== "All Departments" ||
    selectedLoc !== "All Locations" ||
    selectedType !== "All" ||
    searchQuery !== "";

  const handleResetFilters = () => {
    setSelectedDept("All Departments");
    setSelectedLoc("All Locations");
    setSelectedType("All");
    setSearchQuery("");
  };

  const handleOpenApplyModal = (job: Job) => {
    setActiveJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveJob(null);
  };

  // GSAP Entrance
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
        {/* ── 1. Hero Section (Mini Hero for Careers Page) ───────────── */}
        <section
          ref={heroRef}
          className="relative overflow-hidden bg-neutral-900 px-5 pt-32 pb-16 text-white sm:px-8 md:pt-40 md:pb-24"
        >
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/about/hero-about.jpg"
              alt="Medisave Careers & Culture"
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
                Careers
              </span>
            </nav>

            <div className="max-w-3xl">
              <div className="hero-anim mb-4">
                <Tag variant="accent">Join Our Medical Team</Tag>
              </div>
              <h1 className="hero-anim mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                Careers at <span className="brand-text">Medisave</span>
              </h1>
              <p className="hero-anim max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
                Build a meaningful career advancing healthcare solutions across specialized
                formulations, clinical research, and commercial operations.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. Why Join Us Section ─────────────────────────────────── */}
        <section className="px-5 py-16 sm:px-8 md:py-20 border-b border-divider">
          <div className="mx-auto max-w-[1200px]">
            <div className="mb-12 text-center">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                Culture & Benefits
              </span>
              <h2 className="font-heading text-3xl font-bold uppercase tracking-tight text-ink sm:text-4xl">
                Why Build Your Career With Us
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Feature 1 */}
              <Card className="p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <HeartPulse className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold uppercase text-ink">
                  Patient Impact
                </h3>
                <p className="text-xs leading-relaxed text-ink/75">
                  Contribute directly to high-standard formulations that improve therapeutic outcomes and quality of life.
                </p>
              </Card>

              {/* Feature 2 */}
              <Card className="p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-2-100 text-accent-2-700">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold uppercase text-ink">
                  Continuous Growth
                </h3>
                <p className="text-xs leading-relaxed text-ink/75">
                  Scientific mentorship, continuous learning programs, and accredited clinical training workshops.
                </p>
              </Card>

              {/* Feature 3 */}
              <Card className="p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold uppercase text-ink">
                  Collaborative Team
                </h3>
                <p className="text-xs leading-relaxed text-ink/75">
                  Work side-by-side with passionate pharmacists, researchers, regulatory experts, and commercial leaders.
                </p>
              </Card>

              {/* Feature 4 */}
              <Card className="p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-2-100 text-accent-2-700">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-heading text-lg font-bold uppercase text-ink">
                  Competitive Rewards
                </h3>
                <p className="text-xs leading-relaxed text-ink/75">
                  Attractive compensation, comprehensive medical coverage, performance bonuses, and work-life balance.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* ── 3. Filters Bar Section ────────────────────────────────── */}
        <section className="px-5 py-12 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            <div className="rounded-2xl border border-divider bg-white p-6 shadow-sm md:p-8">
              <div className="grid gap-4 md:grid-cols-12 items-center">
                {/* Search Bar Input */}
                <div className="md:col-span-4 relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
                    <input
                      type="text"
                      placeholder="Search job title or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-divider bg-neutral-50 py-3 pl-10 pr-4 text-xs font-medium text-ink placeholder:text-ink/40 focus:border-brand-blue focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Department Select */}
                <div className="md:col-span-3">
                  <CustomSelect
                    options={DEPARTMENT_OPTIONS}
                    value={selectedDept}
                    onChange={setSelectedDept}
                    ariaLabel="Department filter"
                  />
                </div>

                {/* Location Select */}
                <div className="md:col-span-3">
                  <CustomSelect
                    options={LOCATION_OPTIONS}
                    value={selectedLoc}
                    onChange={setSelectedLoc}
                    ariaLabel="Location filter"
                  />
                </div>

                {/* Reset Filters */}
                <div className="md:col-span-2 flex justify-end">
                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 cursor-pointer transition-colors"
                    >
                      <FilterX className="h-4 w-4" />
                      <span>Reset</span>
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-ink/50 uppercase tracking-wider">
                      All Opportunities
                    </span>
                  )}
                </div>
              </div>

              {/* Job Type Segment Bar */}
              <div className="mt-6 border-t border-divider pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-2 text-xs font-bold text-ink/60 uppercase tracking-wider">
                    Job Type:
                  </span>
                  <div className="seg flex-wrap">
                    {TYPE_OPTIONS.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        className="seg-opt"
                        aria-pressed={selectedType === t.key}
                        onClick={() => setSelectedType(t.key)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Counter */}
                <div className="text-xs font-semibold tracking-wide text-ink/60 tabular-nums">
                  Showing{" "}
                  <span className="text-accent-700 font-bold">
                    {filteredJobs.length}
                  </span>{" "}
                  open position{filteredJobs.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. Jobs List Section ───────────────────────────────────── */}
        <section className="px-5 pb-24 sm:px-8">
          <div className="mx-auto max-w-[1200px]">
            {isLoading ? (
              <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-700 border-t-transparent" />
                </div>
                <h3 className="font-heading text-xl font-bold uppercase text-ink">
                  Loading Positions from Medisave API...
                </h3>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid gap-6">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="group p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-3 max-w-3xl">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="brand-gradient inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold text-white">
                            {job.department}
                          </span>
                          <Tag variant="neutral" className="rounded-full">
                            {job.type}
                          </Tag>
                          <span className="text-xs text-ink/50 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-accent-700" />
                            {job.location}
                          </span>
                        </div>

                        <h3 className="font-heading text-2xl font-bold uppercase text-ink group-hover:text-brand-blue transition-colors">
                          {job.title}
                        </h3>

                        <p className="text-sm leading-relaxed text-ink/75">
                          {job.description}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center gap-4 border-t border-divider pt-4 lg:border-none lg:pt-0">
                        <Button
                          variant="primary"
                          onClick={() => handleOpenApplyModal(job)}
                          className="w-full sm:w-auto"
                        >
                          <span>View & Apply</span>
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="rounded-2xl border border-divider bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-100 text-accent-700">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="mb-2 font-heading text-2xl font-bold uppercase text-ink">
                  No Positions Found
                </h3>
                <p className="mx-auto mb-6 max-w-md text-sm text-ink/70">
                  No active job positions were found in the database.
                </p>
                <Button variant="primary" onClick={handleResetFilters}>
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ── 5. Apply Modal Component ───────────────────────────────── */}
      <ApplyModal
        job={activeJob}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </>
  );
}
