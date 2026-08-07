"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/cn";

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function CustomSelect({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        aria-label={ariaLabel || value}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-full border border-divider bg-neutral-50 py-3 px-5 text-xs font-medium text-ink transition-all duration-200 cursor-pointer",
          "hover:border-brand-blue hover:bg-white hover:shadow-sm",
          "focus-visible:border-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/20",
          isOpen && "border-brand-blue bg-white shadow-sm ring-2 ring-brand-blue/20"
        )}
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-ink/50 transition-transform duration-300",
            isOpen && "rotate-180 text-brand-blue"
          )}
        />
      </button>

      {/* Dropdown Menu Popup */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-60 overflow-y-auto rounded-2xl border border-divider bg-white p-1.5 shadow-xl animate-[ms-fadeUp_0.2s_ease]">
          {options.map((option) => {
            const isSelected = option === value;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-medium transition-all duration-150 cursor-pointer text-left",
                  isSelected
                    ? "brand-gradient text-white font-semibold shadow-sm"
                    : "text-ink/80 hover:bg-neutral-100 hover:text-ink"
                )}
              >
                <span className="truncate">{option}</span>
                {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
