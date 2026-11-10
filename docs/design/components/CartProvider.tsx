"use client";

import { createContext, use, useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

/** One orderable menu item, as the browser sees it. Serializable. */
export type CatalogItem = {
  slug: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  imageAlt: string;
  badge?: string;
  /** Minutes after midnight when the kitchen stops serving it, if earlier than closing. */
  availableUntil?: number;
};

export type CartLine = { item: CatalogItem; quantity: number };

/* ---------- Store: slug → quantity, kept in localStorage ---------- */

type Quantities = Readonly<Record<string, number>>;

const STORAGE_KEY = "brewco:cart:v1";
const EMPTY: Quantities = Object.freeze({});
const listeners = new Set<() => void>();
let current: Quantities | null = null;

function load(): Quantities {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return EMPTY;
    const clean: Record<string, number> = {};
    for (const [slug, q] of Object.entries(parsed)) {
      if (Number.isInteger(q) && (q as number) > 0) clean[slug] = q as number;
    }
    return clean;
  } catch {
    // Storage blocked or corrupt: the cart still works for this page view.
    return EMPTY;
  }
}

function write(next: Quantities) {
  current = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep the in-memory cart even when storage is unavailable.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Another tab changed the cart.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      current = load();
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => (current ??= load());
const getServerSnapshot = () => EMPTY;

/* ---------- Context ---------- */

type CartContextValue = {
  catalog: CatalogItem[];
  currency: string;
  lines: CartLine[];
  /** Total number of items, counting quantities. */
  count: number;
  subtotal: number;
  maxQuantity: number;
  quantityOf: (slug: string) => number;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * CartProvider — holds the order-ahead cart for the whole site. See specs/cart.md
 * Wrap the page in it once (app/layout.tsx) with the orderable menu.
 */
export function CartProvider({
  catalog,
  currency,
  maxQuantity = 20,
  children,
}: {
  catalog: CatalogItem[];
  currency: string;
  maxQuantity?: number;
  children: ReactNode;
}) {
  const quantities = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [announcement, setAnnouncement] = useState("");

  const bySlug = useMemo(() => new Map(catalog.map((i) => [i.slug, i])), [catalog]);

  // Items dropped from the menu since they were added are ignored.
  const lines = useMemo(
    () =>
      Object.entries(quantities).flatMap(([slug, quantity]) => {
        const item = bySlug.get(slug);
        return item ? [{ item, quantity }] : [];
      }),
    [quantities, bySlug],
  );
  const count = lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = lines.reduce((n, l) => n + l.quantity * l.item.price, 0);

  const setQuantity = useCallback(
    (slug: string, quantity: number) => {
      const item = bySlug.get(slug);
      if (!item) return;
      const before = getSnapshot();
      const q = Math.max(0, Math.min(maxQuantity, Math.round(quantity)));
      const { [slug]: previous = 0, ...rest } = before;
      if (q === previous) return;
      const next = q === 0 ? rest : { ...rest, [slug]: q };
      write(next);

      const total = Object.entries(next).reduce((n, [s, v]) => n + (bySlug.has(s) ? v : 0), 0);
      const items = `${total} ${total === 1 ? "item" : "items"} in your order`;
      setAnnouncement(
        q === 0
          ? `${item.name} removed. ${items}.`
          : q > previous
            ? `${item.name} added. ${items}.`
            : `${item.name} quantity ${q}. ${items}.`,
      );
    },
    [bySlug, maxQuantity],
  );

  const clear = useCallback(() => write(EMPTY), []);
  const quantityOf = useCallback((slug: string) => quantities[slug] ?? 0, [quantities]);

  const value = useMemo(
    () => ({ catalog, currency, lines, count, subtotal, maxQuantity, quantityOf, setQuantity, clear }),
    [catalog, currency, lines, count, subtotal, maxQuantity, quantityOf, setQuantity, clear],
  );

  return (
    <CartContext value={value}>
      {children}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </CartContext>
  );
}

export function useCart() {
  const ctx = use(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
