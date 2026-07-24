import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-heading font-semibold text-sm leading-tight rounded-full border px-5 py-2.5 transition-all duration-300 ease-out cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue";

const variants: Record<Variant, string> = {
  primary:
    "brand-gradient text-white border-transparent shadow-[0_6px_18px_-6px_rgba(46,151,212,0.55)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(46,151,212,0.7)] active:translate-y-0",
  secondary:
    "bg-white/70 text-ink border-divider hover:-translate-y-0.5 hover:border-brand-blue hover:text-brand-blue hover:shadow-[0_10px_24px_-12px_rgba(29,45,61,0.35)] active:translate-y-0",
  ghost:
    "bg-transparent text-brand-blue border-transparent px-2 hover:bg-brand-blue/10 active:bg-brand-blue/[0.18]",
};

interface CommonProps {
  variant?: Variant;
  block?: boolean;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  block,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], block && "w-full mt-2", className);

  if (props.href) {
    const { href, ...anchorProps } = props as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {props.children}
      </Link>
    );
  }

  const { ...buttonProps } = props as ButtonAsButton;
  return (
    <button type="button" className={classes} {...buttonProps}>
      {props.children}
    </button>
  );
}
