import type { ReactNode } from "react";
import { cn } from "./cn";

/**
 * FeatureItem — icon + title + body. See specs/feature-item.md
 * `row` = the "Only quality coffee beans" list; `stacked` = centered value props.
 */
export function FeatureItem({
  icon,
  title,
  children,
  layout = "row",
  headingLevel: H = "h3",
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  layout?: "row" | "stacked";
  headingLevel?: "h3" | "h4";
}) {
  const stacked = layout === "stacked";
  return (
    <div className={cn("flex gap-4", stacked && "flex-col items-center text-center")}>
      <span
        aria-hidden
        className={cn(
          "grid shrink-0 place-items-center rounded-full text-crema-500",
          stacked
            ? "size-14 bg-espresso-800 [&_svg]:size-7"
            : "size-11 border border-espresso-600 bg-espresso-900",
        )}
      >
        {icon}
      </span>
      <div className={cn(stacked && "max-w-[16rem]")}>
        <H className="text-title-sm font-bold text-foam-50">{title}</H>
        <div className="mt-2 text-caption text-steam-300">{children}</div>
      </div>
    </div>
  );
}
