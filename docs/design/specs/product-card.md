# ProductCard

**Source:** [`components/ProductCard.tsx`](../components/ProductCard.tsx) · Server Component, with a Server Action for add to cart

The "Our special coffee" card and the richest object in the system. It's a warm espresso card that lights up in crema when touched.

## Anatomy

```
┌ rounded-card, border espresso-600, bg --bg-card ─┐
│ ┌ m-2, rounded-tile, 4:3 ──────────────────────┐ │
│ │                 photo                        │ │
│ └──────────────────────────────────────────────┘ │
│  Highlander grogg              ← title-sm, foam  │
│  Flavored coffee               ← title-sm, crema │
│  [Hot coffee] [Cold brew]      ← Badge solid/outline
│  ★★★★★ (350 reviews)           ← Rating          │
│  Price                                     ╭───╮ │
│  $15                    ← Price lg         │ 🛒│ │ ← IconButton (form)
└──────────────────────────────────────────────╰───╯┘
```

## Props

```ts
type Product = {
  id: string; name: string; flavor: string; href: string;
  image: { src: string | StaticImageData; alt: string };
  tags: { label: string; highlight?: boolean }[];
  rating: number; reviewCount: number; price: number; currency?: string;
};
<ProductCard product={p} addToCart={addToCartAction} />
```

`addToCart` is optional. Pass a Server Action that reads `formData.get("productId")`. Leave it out for display-only cards, and the cart button won't render.

## Spacing and tokens

| Part | Value |
|---|---|
| Card | `rounded-card` (16px), `border-espresso-600`, `bg-(image:--bg-card)`, `shadow-card` |
| Photo inset | 8px all round; `rounded-tile` (10px) |
| Body padding | 20px sides, 12px top, 20px bottom; 12px gap between rows |
| Title / flavor | `text-title-sm` bold; flavor line in `crema-500` |

## States

| State | Treatment |
|---|---|
| Rest | As above |
| Hover | `shadow-glow` (crema halo), photo scales to 1.03 over 600ms `ease-pour` |
| Focus within | Same `shadow-glow`, plus the global focus outline on the focused control |
| Pending add | Server Action in flight. Use `useFormStatus` in a client wrapper if you need a pending state; the card itself stays static |

## Interaction and accessibility

- The card is an `<article aria-labelledby>` pointing at its title.
- The name link stretches over the whole card (`after:absolute after:inset-0`), so there is only one tab stop for navigation. The cart form sits above it (`relative z-10`) as a second tab stop.
- The cart button's label names the product: "Add Highlander grogg to cart".
- After adding, confirm with a toast that reuses the verb: "Added Highlander grogg to cart".

## Layout

Grid: `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`. Show at least three cards so the row doesn't look unfinished.

## Don'ts

- Don't add a second crema element beyond the flavor line, the price, one solid badge and the cart button.
- Don't put text over the photo.
