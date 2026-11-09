import { cn } from "./cn";

/** Price — formats via Intl. `size="lg"` is the card price block. */
export function formatPrice(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currencyDisplay: "narrowSymbol", // GH₵30 rather than "GHS 30"; $15 stays $15
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function Price({
  amount,
  currency = "USD",
  size = "md",
  className,
}: {
  amount: number;
  currency?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  if (size === "lg") {
    return (
      <p className={cn("flex flex-col", className)}>
        <span className="text-micro text-steam-300">Price</span>
        <span className="text-title font-bold text-crema-500 tabular-nums">
          {formatPrice(amount, currency)}
        </span>
      </p>
    );
  }
  return (
    <p className={cn("text-body font-semibold text-foam-50 tabular-nums", className)}>
      {formatPrice(amount, currency)}
    </p>
  );
}
