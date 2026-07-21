import { navLinks } from "@/data/navigation";
import { products } from "@/data/products";

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

export function Footer() {
  return (
    <footer className="bg-neutral-900 px-5 pt-16 pb-6 text-[#e8eaec] sm:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="mb-2 flex items-baseline gap-0.5 font-heading text-[22px] font-semibold">
              <span className="text-accent-300">m</span>
              <span className="text-white">edisave</span>
            </span>
            <span className="mb-4 block text-[10px] tracking-[0.14em] text-white/55 uppercase">
              Developed
            </span>
            <p className="max-w-[32ch] text-[13px] leading-relaxed text-white/65">
              Pharmaceutical formulations manufactured to pharmacopeial
              standard, distributed across neurology, cardiology, metabolic
              and mental health care.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] tracking-[0.08em] text-white uppercase">
              Quick Links
            </h4>
            <div className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/75 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] tracking-[0.08em] text-white uppercase">
              Products
            </h4>
            <div className="flex flex-col gap-2.5">
              {products.slice(0, 4).map((product) => (
                <a
                  key={product.slug}
                  href="#products"
                  className="text-sm text-white/75 hover:text-white"
                >
                  {product.name}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[13px] tracking-[0.08em] text-white uppercase">
              Contact
            </h4>
            <p className="mb-4 text-sm leading-loose text-white/75">
              142 Harbourview Industrial Park
              <br />
              Unit 4, Dockside District
              <br />
              info@medisave.com
              <br />
              +1 (555) 240-9917
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-white"
                >
                  {social.label === "Instagram" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="2" y="2" width="20" height="20" rx="0" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
                    </svg>
                  ) : social.label === "LinkedIn" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <rect x="2" y="2" width="20" height="20" rx="0" />
                      <line x1="7" y1="10" x2="7" y2="17" />
                      <line x1="7" y1="7" x2="7" y2="7.2" />
                      <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
                      <line x1="11" y1="10" x2="11" y2="17" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                      <path d={social.path ?? ""} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-white/15 pt-5">
          <span className="text-xs text-white/55">
            © 2026 Medisave. All rights reserved.
          </span>
          <span className="text-xs text-white/45">
            Product, statistic and testimonial data shown are illustrative
            placeholders.
          </span>
        </div>
      </div>
    </footer>
  );
}
