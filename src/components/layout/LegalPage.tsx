import Image from "next/image";
import Link from "next/link";
import { CalendarDays, CheckCircle2, ChevronRight, FileText, Home, Mail, MapPin, Phone } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CtaButton } from "@/components/ui/CtaButton";
import { Tag } from "@/components/ui/Tag";
import { companyInfo } from "@/data/company";
import type { LegalDocument } from "@/data/legal";

interface LegalPageProps {
  doc: LegalDocument;
  /** The sibling legal page, linked at the end of the document. */
  related: { label: string; href: string };
}

/**
 * Shared layout for the Privacy Policy and Terms of Service pages: the site's
 * mini-hero, a sticky table of contents, and numbered content sections.
 */
export function LegalPage({ doc, related }: LegalPageProps) {
  const breadcrumb = `${doc.title} ${doc.highlight}`;

  return (
    <>
      <Header />
      <main className="flex-1 bg-bg">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-neutral-900 px-5 pt-32 pb-16 text-white sm:px-8 md:pt-40 md:pb-24">
          <div className="absolute inset-0 z-0">
            <Image
              src={doc.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-950/60 to-neutral-950/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--brand-blue)_0%,transparent_60%)] opacity-25" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1200px]">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
            >
              <Link
                href="/"
                className="flex items-center gap-1 text-xs font-semibold text-white/70 transition-colors hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Home</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-white/40" />
              <span className="text-xs font-semibold text-accent-300">{breadcrumb}</span>
            </nav>

            <div className="max-w-3xl">
              <div className="mb-4">
                <Tag variant="accent">{doc.kicker}</Tag>
              </div>
              <h1 className="mb-6 font-heading text-4xl font-bold uppercase tracking-tight text-white sm:text-5xl md:text-6xl">
                {doc.title} <span className="brand-text">{doc.highlight}</span>
              </h1>
              <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">{doc.intro}</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/75 backdrop-blur-md">
                <CalendarDays className="h-4 w-4 text-accent-2-400" />
                <span>
                  Last updated: <span className="font-semibold text-white">{doc.lastUpdated}</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ──────────────────────────────────────────────── */}
        <section className="px-5 py-16 sm:px-8 md:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-12">
            {/* Sidebar: table of contents + contact card */}
            <aside className="lg:col-span-4">
              <div className="space-y-6 lg:sticky lg:top-28">
                <nav
                  aria-label="Table of contents"
                  className="hidden rounded-2xl border border-divider bg-white p-6 shadow-sm lg:block"
                >
                  <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                    On This Page
                  </span>
                  <ol className="space-y-1">
                    {doc.sections.map((section, i) => (
                      <li key={section.id}>
                        <a
                          href={`#${section.id}`}
                          className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-ink/70 no-underline transition-colors hover:bg-accent-100 hover:text-accent-700"
                        >
                          <span className="font-heading text-xs font-semibold text-ink/40 transition-colors group-hover:text-accent-600">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                <div className="relative overflow-hidden rounded-2xl bg-nav-bg p-6 text-white shadow-lg">
                  <span className="brand-gradient absolute inset-x-0 top-0 h-1" aria-hidden />
                  <h2 className="mb-2 font-heading text-xl font-bold uppercase">Have Questions?</h2>
                  <p className="mb-5 text-sm leading-relaxed text-white/70">
                    Our team is happy to help with any question about this document.
                  </p>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <Mail className="h-4 w-4 shrink-0 text-accent-300" />
                      <a
                        href={`mailto:${companyInfo.email}`}
                        className="font-semibold text-white no-underline transition-colors hover:text-accent-300"
                      >
                        {companyInfo.email}
                      </a>
                    </li>
                    <li className="flex items-center gap-3">
                      <Phone className="h-4 w-4 shrink-0 text-accent-2-400" />
                      <a
                        href={`tel:${companyInfo.phoneTel}`}
                        className="font-semibold text-white no-underline transition-colors hover:text-accent-300"
                      >
                        {companyInfo.phoneDisplay}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>

            {/* Document body */}
            <article className="rounded-2xl border border-divider bg-white p-6 shadow-sm sm:p-10 lg:col-span-8">
              {doc.sections.map((section, i) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="border-b border-divider py-8 first:pt-0 last:border-b-0"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <span className="brand-gradient flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-heading text-sm font-semibold text-white shadow-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-ink">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 text-base leading-relaxed text-ink/80">
                    {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}

                    {section.list && (
                      <ul className="space-y-3">
                        {section.list.map((item) => (
                          <li key={item} className="flex gap-3">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent-2-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.after?.map((p) => <p key={p}>{p}</p>)}
                  </div>
                </section>
              ))}

              {/* Contact details */}
              <section id="contact-us" className="mt-4 rounded-2xl bg-neutral-100 p-6 sm:p-8">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.1em] text-accent-700">
                  Get in Touch
                </span>
                <h2 className="mb-4 font-heading text-2xl font-bold uppercase tracking-tight text-ink">
                  Contact Us
                </h2>
                <p className="mb-6 text-base leading-relaxed text-ink/80">
                  If you have any questions or requests regarding this {breadcrumb}, please contact{" "}
                  {companyInfo.name}:
                </p>
                <ul className="grid gap-4 text-sm sm:grid-cols-2">
                  <li className="flex gap-3 sm:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                    <span className="text-ink/80">{companyInfo.address}</span>
                  </li>
                  <li className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                    <a href={`mailto:${companyInfo.email}`} className="font-semibold">
                      {companyInfo.email}
                    </a>
                  </li>
                  <li className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                    <a href={`tel:${companyInfo.phoneTel}`} className="font-semibold">
                      {companyInfo.phoneDisplay}
                    </a>
                  </li>
                </ul>
              </section>

              <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-divider pt-8 sm:flex-row sm:items-center">
                <Link
                  href={related.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold no-underline"
                >
                  <FileText className="h-4 w-4" />
                  Read our {related.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <CtaButton href="/contact" variant="primary">
                  Contact Our Team
                </CtaButton>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
