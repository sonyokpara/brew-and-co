import type { ReactNode } from "react";
import { cn } from "./cn";

/** SectionHeading — see specs/layout-primitives.md */
export function SectionHeading({
  id,
  title,
  kicker,
  description,
  action,
  align = "start",
  ruled = false,
  as: Tag = "h2",
  className,
}: {
  /** Used for the section's aria-labelledby. */
  id: string;
  title: ReactNode;
  /** Short sentence-case lead-in in crema. Use only when it adds meaning. */
  kicker?: string;
  description?: ReactNode;
  /** A link-variant <Button>, e.g. "See all". Aligned to the title baseline. */
  action?: ReactNode;
  align?: "start" | "center";
  /** Hairlines either side of a centered title (testimonials). */
  ruled?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-3 md:mb-12",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-3", centered && "items-center")}>
        {kicker && <p className="text-caption font-medium text-crema-500">{kicker}</p>}
        <div className={cn(ruled && "flex w-full items-center gap-6")}>
          {ruled && <span aria-hidden className="h-px flex-1 bg-roast-700 sm:w-40" />}
          <Tag
            id={id}
            className={cn(
              "font-display text-heading font-bold text-balance md:text-heading-lg",
              ruled ? "shrink-0 text-crema-500" : "text-foam-50",
            )}
          >
            {title}
          </Tag>
          {ruled && <span aria-hidden className="h-px flex-1 bg-roast-700 sm:w-40" />}
        </div>
        {description && (
          <p className="max-w-prose text-body text-steam-300">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
