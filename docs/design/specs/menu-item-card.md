# MenuItemCard

**Source:** [`components/MenuItemCard.tsx`](../components/MenuItemCard.tsx) · Server Component

A featured menu item, used in the homepage's "Most loved on the menu" grid. It shares the espresso card surface with `ProductCard` but has no rating or link, because menu items have no detail page. Pass `action` (an `<AddToCartButton />`, see [cart.md](cart.md)) to let people order it; it sits right-aligned at the foot of the card.

## Anatomy

```
┌ rounded-card, border espresso-600, bg --bg-card ┐
│ ┌ m-2, rounded-tile, 4:3 photo ──────────────┐ │
│ └────────────────────────────────────────────┘ │
│  [House favorite]                ← Badge        │
│  Salted caramel latte     GH₵55  ← title-sm; price crema
│  Espresso, steamed milk and…     ← caption, 2 lines max
└─────────────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
|---|---|---|
| `name` | `string` | |
| `description` | `string` | Clamped to two lines |
| `price`, `currency` | `number`, `string` | Formatted with `formatPrice`, e.g. GH₵55 |
| `badge` | `"Popular" \| "House favorite"`? | |
| `image` | `{ src, alt }` | 4:3 crop of a square photo |

## Badges

`menuBadgeTone()` maps **House favorite → solid** (the stronger claim) and **Popular → outline**. That keeps the card within the one-solid-badge rule.

## States

Only the action is interactive. The card itself has no hover or focus treatment; adding one would suggest a click that does nothing.

## Layout

`grid gap-6 sm:grid-cols-2 lg:grid-cols-3`. Show 3 or 6 so rows are full.
