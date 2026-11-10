"use client";

import type { Ref } from "react";
import { cn } from "./cn";
import { Minus, Plus } from "./icons";

/**
 * QuantityStepper — "− 2 +" pill for one item. See specs/cart.md
 * Going below 1 removes the item.
 */
export function QuantityStepper({
  name,
  quantity,
  max,
  onChange,
  minusRef,
  plusRef,
  className,
}: {
  name: string;
  quantity: number;
  max: number;
  onChange: (quantity: number) => void;
  minusRef?: Ref<HTMLButtonElement>;
  plusRef?: Ref<HTMLButtonElement>;
  className?: string;
}) {
  const step =
    "inline-grid size-10 place-items-center rounded-full text-foam-50 transition-colors duration-150 ease-settle " +
    "hover:bg-foam-50/10 hover:text-crema-300 disabled:opacity-45";
  return (
    <div
      role="group"
      aria-label={`${name} quantity`}
      className={cn("inline-flex h-10 items-center rounded-full border border-foam-50/40", className)}
    >
      <button
        ref={minusRef}
        type="button"
        className={step}
        aria-label={quantity === 1 ? `Remove ${name}` : `One less ${name}`}
        onClick={() => onChange(quantity - 1)}
      >
        <Minus size={16} />
      </button>
      <span className="min-w-6 text-center text-body font-semibold text-foam-50 tabular-nums">{quantity}</span>
      <button
        ref={plusRef}
        type="button"
        className={step}
        aria-label={`One more ${name}`}
        disabled={quantity >= max}
        onClick={() => onChange(quantity + 1)}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
