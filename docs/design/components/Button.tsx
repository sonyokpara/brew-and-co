import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";
import { ArrowRight } from "./icons";

/**
 * Button — see specs/button.md
 * Renders <Link> when `href` is set, otherwise <button>.
 */
type Variant = "primary" | "outline" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap " +
  "transition-[background-color,color,border-color,box-shadow] duration-150 ease-settle " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45";

const variants: Record<Variant, string> = {
  primary:
    "rounded-full bg-crema-500 text-ink hover:bg-crema-400 active:bg-crema-600 hover:shadow-glow",
  outline:
    "rounded-full border border-foam-50/40 text-foam-50 hover:border-crema-400 hover:text-crema-300 active:bg-foam-50/5",
  link:
    "rounded-tag text-foam-50 underline-offset-4 decoration-crema-500 hover:text-crema-300 hover:underline",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-caption",
  md: "h-11 px-6 text-body",
  lg: "h-13 px-8 text-lead",
};

type Common = {
  variant?: Variant;
  size?: Size;
  /** Adds a trailing arrow — use only for "go somewhere" actions. */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type AsLink = Common & { href: string } & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">;

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], variant === "link" ? "h-auto px-0" : sizes[size], className);
}

export function Button(props: AsLink | AsButton) {
  const { variant = "primary", size = "md", arrow, children, className, ...rest } = props;
  const classes = buttonClasses({ variant, size, className });
  const content = (
    <>
      {children}
      {arrow && <ArrowRight size={size === "lg" ? 20 : 16} />}
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={classes} {...(rest as Omit<AsLink, keyof Common>)}>
        {content}
      </Link>
    );
  }
  const { type = "button", ...buttonRest } = rest as Omit<AsButton, keyof Common>;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {content}
    </button>
  );
}
