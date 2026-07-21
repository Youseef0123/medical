import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-heading font-semibold text-sm leading-tight rounded-none border px-4 py-2 transition-colors duration-200 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-bg border-accent hover:bg-accent-600 active:bg-accent-700",
  secondary:
    "bg-transparent text-ink border-divider hover:bg-ink/[0.07] active:bg-ink/[0.14]",
  ghost:
    "bg-transparent text-accent border-transparent px-1.5 hover:bg-accent/10 active:bg-accent/[0.18]",
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
