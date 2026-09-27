import Image from "next/image";
import { navLinks } from "@/data/navigation";
import { companyInfo } from "@/data/company";

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  },
  {
    label: "Instagram",
    href: "#",
    path: null,
  },
  {
    label: "LinkedIn",
    href: "#",
    path: null,
  },
  {
    label: "Twitter",
    href: "#",
    path: "M22 4s-2.5 1.5-4 1.5A5 5 0 0 0 8.5 9.5v1c-4 0-6.5-2-8.5-4.5 0 0-2 6 4 9-1 .5-2.5.5-3.5.3.5 3 3.5 4.7 6.5 4.7-3 2-6 2.5-9 2 3.5 2.2 7.5 3.5 12 2 8.5-2.5 10-11.5 9.5-14 1.5-1 2.5-2.5 3-4-1 .5-2.2.8-3 .5 1-.6 1.5-1.5 2-3z",
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="blueprint relative !rounded-none !border-x-0 !border-b-0 !border-white/12 bg-neutral-900 px-5 pt-16 pb-6 text-[#e8eaec] sm:px-8">
      <i className="corner tl !text-white/40" aria-hidden />
      <i className="corner tr !text-white/40" aria-hidden />

      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 md:divide-x md:divide-white/12 lg:grid-cols-3">
          <div className="md:pr-10">
            {/* Dark-surface variant of the official logo (white wordmark,
                gradient "m", transparent background). */}
            <Image
              src="/images/logo-dark.png"
              alt="Medisave — Developed"
              width={150}
              height={41}
              className="mb-5 h-10 w-auto object-contain"
            />
            <p className="max-w-[32ch] text-[13px] leading-relaxed text-white/65">
              Pharmaceutical formulations manufactured to pharmacopeial
              standard, distributed across neurology, cardiology, metabolic
              and mental health care.
            </p>
          </div>

          <div className="flex flex-col gap-5 md:px-10">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-white pb-1">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="footer-link text-sm font-medium">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 md:pl-10">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-white pb-1">
              Contact Us
            </h3>
            <div className="space-y-3 text-sm text-white/80 leading-relaxed">
              <p className="font-medium text-white/90">{companyInfo.address}</p>
              <p>
                <a
                  href={`mailto:${companyInfo.email}`}
                  className="hover:text-accent-300 transition-colors font-semibold"
                >
                  {companyInfo.email}
                </a>
              </p>
              <p>
                <a
                  href={`tel:${companyInfo.phoneTel}`}
                  className="hover:text-accent-300 transition-colors font-semibold"
                >
                  {companyInfo.phoneDisplay}
                </a>
              </p>
            </div>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-300 hover:border-accent hover:text-accent hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {social.label === "Instagram" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                    </svg>
                  ) : social.label === "LinkedIn" ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <line x1="7" y1="10" x2="7" y2="17" />
                      <line x1="7" y1="7" x2="7" y2="7.2" />
                      <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
                      <line x1="11" y1="10" x2="11" y2="17" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d={social.path ?? ""} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/15 pt-5">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-xs text-white/55">
              © 2026 Medisave. All rights reserved.
            </span>
            {legalLinks.map((link) => (
              <a key={link.label} href={link.href} className="footer-link text-xs">
                {link.label}
              </a>
            ))}
          </div>
          <span className="text-xs text-white/45">
            Product, statistic and testimonial data shown are illustrative
            placeholders.
          </span>
        </div>
      </div>
    </footer>
  );
}
