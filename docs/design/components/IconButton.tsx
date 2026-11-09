import type { ComponentProps } from "react";
import { cn } from "./cn";

/**
 * IconButton — round, icon-only. `label` is required and becomes aria-label.
 */
export function IconButton({
  label,
  children,
  tone = "crema",
  className,
  type = "button",
  ...rest
}: Omit<ComponentProps<"button">, "aria-label"> & {
  label: string;
  tone?: "crema" | "ghost";
}) {
  return (
    <button
      type={type}
      aria-label={label}
      className={cn(
        "inline-grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-150 ease-settle",
        tone === "crema"
          ? "bg-crema-500 text-ink hover:bg-crema-400 active:bg-crema-600"
          : "text-foam-50 hover:bg-foam-50/10 hover:text-crema-300",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
