"use client";

import { useState } from "react";
import Image from "next/image";
import { CtaButton } from "@/components/ui/CtaButton";
import { navLinks } from "@/data/navigation";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { cn } from "@/lib/cn";

export function Header() {
  const scrolled = useScrollPosition(20);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-all duration-700 ease-out",
        scrolled ? "pt-4 px-6 md:px-12" : "p-0"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex items-center gap-4 transition-all duration-700 ease-out",
          scrolled
            ? "max-w-7xl rounded-full bg-nav-bg/90 backdrop-blur-lg px-6 md:px-12 py-3 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
            : "max-w-full rounded-none bg-black/25 backdrop-blur-md px-6 md:px-16 py-4 border-b border-white/5 shadow-none",
          mobileOpen && "!rounded-none !bg-transparent !border-none !shadow-none"
        )}
      >
        <a
          href="#home"
          className="mr-auto flex items-center transition-all duration-700 ease-out"
        >
          {/* Official Logo styled in White for high contrast */}
          <Image
            src="/images/logo.svg"
            alt="Medisave"
            width={120}
            height={35}
            className="h-8 w-auto object-contain brightness-0 invert transition-transform duration-500 hover:scale-105"
            priority
          />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "relative py-1 text-sm font-semibold tracking-wide transition-all duration-300",
                "after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full",
                "!text-white hover:!text-white/80"
              )}
            >
              {link.label}
            </a>
          ))}
          <CtaButton
            href="#contact"
            variant="primary"
          >
            Contact Us
          </CtaButton>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className={cn(
            "relative z-50 flex h-10 w-10 items-center justify-center border bg-transparent transition-all duration-700 ease-out md:hidden",
            mobileOpen ? "border-white/20 text-white bg-white/5" : "border-white/25 text-white hover:border-white"
          )}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col gap-6 bg-zinc-950/95 backdrop-blur-xl p-8 pt-28 md:hidden animate-[ms-fadeUp_0.25s_ease]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-heading font-semibold !text-white/90 hover:!text-white border-b border-white/10 pb-3 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <CtaButton
            href="#contact"
            variant="primary"
            className="w-full mt-4"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </CtaButton>
        </div>
      )}
    </header>
  );
}
