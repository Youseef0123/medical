"use client";

import { useState } from "react";
import { navLinks } from "@/data/navigation";
import { useScrollPosition } from "@/lib/hooks/useScrollPosition";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Header() {
  const scrolled = useScrollPosition(20);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[60] transition-all duration-700 ease-out",
        scrolled ? "pt-4 px-6" : "p-0"
      )}
    >
      <nav
        className={cn(
          "mx-auto flex items-center gap-4 transition-all duration-700 ease-out",
          scrolled
            ? "max-w-7xl rounded-full bg-nav-bg px-8 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            : "max-w-full rounded-none bg-transparent px-4 py-6 shadow-none",
          mobileOpen && "!rounded-none !bg-transparent !shadow-none"
        )}
      >
        <span
          className={cn(
            "mr-auto flex items-baseline gap-0.5 font-heading text-2xl font-semibold transition-all duration-700 ease-out",
            scrolled && "brightness-0 invert"
          )}
        >
          <span className="text-accent-700">m</span>
          <span className="tracking-tight text-ink">edisave</span>
        </span>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-semibold tracking-wide transition-all duration-700 ease-out",
                scrolled ? "text-white" : "text-accent-700"
              )}
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="primary"
            href="#contact"
            className={cn(
              "!transition-all !duration-700 !ease-out",
              scrolled && "!border-white !bg-white !text-accent-700"
            )}
          >
            Get in Touch
          </Button>
        </div>

        <button
          type="button"
          aria-label="Menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className={cn(
            "flex h-10 w-10 items-center justify-center border bg-transparent transition-all duration-700 ease-out md:hidden",
            scrolled && !mobileOpen ? "border-white text-white" : "border-divider text-ink"
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
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col gap-5 border-t border-divider bg-bg p-6 animate-[ms-fadeUp_0.25s_ease] md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-lg font-semibold text-ink"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant="primary"
            block
            href="#contact"
            onClick={() => setMobileOpen(false)}
          >
            Get in Touch
          </Button>
        </div>
      )}
    </header>
  );
}
