import type { ComponentProps, ElementType } from "react";
import { cn } from "./cn";

/** Container — the 1200px content column with responsive gutters. */
export function Container({
  as: Tag = "div",
  className,
  ...rest
}: ComponentProps<"div"> & { as?: ElementType }) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-site px-gutter sm:px-6 lg:px-8", className)}
      {...rest}
    />
  );
}
