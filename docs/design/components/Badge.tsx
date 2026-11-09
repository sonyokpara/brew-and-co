import type { ReactNode } from "react";
import { cn } from "./cn";

/** Badge — see specs/badge.md. Sentence case, never all caps. */
export function Badge({
  children,
  tone = "outline",
  className,
}: {
  children: ReactNode;
  tone?: "solid" | "outline";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center rounded-tag px-2 text-micro font-medium",
        tone === "solid"
          ? "bg-crema-500 text-ink"
          : "border border-steam-500/60 text-steam-300",
        className,
      )}
    >
      {children}
    </span>
  );
}
