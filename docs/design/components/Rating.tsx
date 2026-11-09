import { cn } from "./cn";
import { Star } from "./icons";

/** Rating — see specs/rating.md. Read-only display. */
export function Rating({
  value,
  count,
  max = 5,
  className,
}: {
  value: number;
  count?: number;
  max?: number;
  className?: string;
}) {
  const clamped = Math.max(0, Math.min(max, value));
  const label =
    `Rated ${clamped.toFixed(1)} out of ${max}` +
    (count !== undefined ? ` from ${count.toLocaleString("en-US")} reviews` : "");

  return (
    <div className={cn("flex items-center gap-2", className)} role="img" aria-label={label}>
      <span className="flex gap-0.5 text-crema-500">
        {Array.from({ length: max }, (_, i) => (
          <Star key={i} fill={Math.max(0, Math.min(1, clamped - i))} />
        ))}
      </span>
      {count !== undefined && (
        <span className="text-micro text-steam-300" aria-hidden>
          ({count.toLocaleString("en-US")} reviews)
        </span>
      )}
    </div>
  );
}
