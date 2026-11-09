import Link from "next/link";
import { cn } from "./cn";

/**
 * Logo — script "Brew" over a heavy "& Co." lockup, echoing the reference.
 * Yellowtail is used here and nowhere else.
 */
export function Logo({ size = "md", className }: { size?: "md" | "lg"; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Brew & Co. home"
      className={cn("inline-flex flex-col leading-none", className)}
    >
      <span
        aria-hidden
        className={cn(
          "font-script text-crema-500 -rotate-6 origin-left",
          size === "lg" ? "text-display" : "text-title",
        )}
      >
        Brew
      </span>
      <span
        aria-hidden
        className={cn(
          "font-display font-extrabold tracking-tight text-foam-50",
          size === "lg" ? "-mt-2 text-heading-lg" : "-mt-1 text-body",
        )}
      >
        &amp; Co.
      </span>
    </Link>
  );
}
