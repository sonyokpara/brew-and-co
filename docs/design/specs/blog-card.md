# BlogCard

**Source:** [`components/blog-card.tsx`](../components/blog-card.tsx) · Server Component

A journal post card, used for the "From the journal" section (the reference's "Our Blog / Be First Hwo Read News").

## Anatomy

```
┌ rounded-card, roast-900, border roast-700, p-2 ┐
│ ┌ 16:10 photo, rounded-tile ─────────────────┐ │
│ └────────────────────────────────────────────┘ │
│  December 2026   Brew & Co. team   ← micro, steam-500
│  Good-to-go cups get a reusable    ← title-sm bold, balanced
│  upgrade                                       │
│  Excerpt clamped to three lines…   ← caption, steam-300
│  Read article →                    ← caption semibold, crema
└────────────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `string` | Under about 70 characters |
| `excerpt` | `string` | Clamped to 3 lines |
| `href` | `string` | |
| `date` | ISO `string` | Rendered as `<time dateTime>`, formatted as "December 2026" in UTC so server and client output match |
| `author` | `string` | |
| `image` | `{ src, alt }` | |

## Why it differs from ProductCard

Journal posts are reading, not buying. The card uses the neutral `roast-900` with a `roast-700` border, not espresso, so editorial content stays visually apart from things for sale.

## States

- **Hover:** the border warms to `espresso-600` and "Read article" turns `crema-300`.
- **Focus within:** the border turns `crema-500`.
- There's one stretched link on the title. The "Read article" text is visual only (`aria-hidden`), so the link isn't announced twice.

## Layout

`grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
