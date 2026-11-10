"use client";

import { useEffect, useRef } from "react";
import { buttonClasses } from "./Button";
import { useCart } from "./CartProvider";
import { cn } from "./cn";
import { Plus } from "./icons";
import { QuantityStepper } from "./QuantityStepper";

/**
 * AddToCartButton — "Add" until the item is in the order, then a stepper.
 * Focus follows the swap so keyboard users don't lose their place.
 */
export function AddToCartButton({ slug, name, className }: { slug: string; name: string; className?: string }) {
  const { quantityOf, setQuantity, maxQuantity } = useCart();
  const quantity = quantityOf(slug);
  const addRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const focusNext = useRef<"add" | "plus" | null>(null);

  useEffect(() => {
    if (focusNext.current === "plus") plusRef.current?.focus();
    if (focusNext.current === "add") addRef.current?.focus();
    focusNext.current = null;
  }, [quantity]);

  if (quantity === 0) {
    return (
      <button
        ref={addRef}
        type="button"
        aria-label={`Add ${name} to your order`}
        className={buttonClasses({ variant: "outline", size: "sm", className: cn("h-10", className) })}
        onClick={() => {
          focusNext.current = "plus";
          setQuantity(slug, 1);
        }}
      >
        <Plus size={16} />
        Add
      </button>
    );
  }

  return (
    <QuantityStepper
      name={name}
      quantity={quantity}
      max={maxQuantity}
      plusRef={plusRef}
      className={className}
      onChange={(q) => {
        if (q === 0) focusNext.current = "add";
        setQuantity(slug, q);
      }}
    />
  );
}
