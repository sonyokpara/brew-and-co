import type { ComponentProps } from "react";
import { cn } from "./cn";

/** Section — vertical rhythm wrapper. Pass `aria-labelledby` pointing at its heading. */
export function Section({
  tone = "base",
  className,
  ...rest
}: ComponentProps<"section"> & { tone?: "base" | "alt" }) {
  return (
    <section
      className={cn(
        "py-section-sm md:py-section",
        tone === "alt" && "bg-roast-900",
        className,
      )}
      {...rest}
    />
  );
}
