# SiteFooter

**Source:** [`components/SiteFooter.tsx`](../components/SiteFooter.tsx) · Server Component

## Anatomy

```
Brew          Shop            Company          Follow us
& Co.         Home            About us         ◎
Premium       Menu            Contact us       ⓕ
handcrafted…  Journal         Payment options  ▶
              Contact         Track order
────────────────────────────────────────────────────────
© 2026 Brew & Co.
```

## Props

| Prop | Type | Notes |
|---|---|---|
| `tagline` | `string` | Up to about 10 words, `max-w-[14rem]` |
| `columns` | `{ title, links: { label, href }[] }[]` | Two or three columns. Each is a `<nav aria-label={title}>` |
| `social` | `{ label, href, icon }[]` | Ghost icon links with `aria-label` ("Brew & Co. on Instagram") |
| `copyright` | `string` | Passed in, not computed. With `cacheComponents: true`, calling `new Date()` while rendering forces dynamic rendering |

## Visual

- `roast-950` with a `roast-700` top border and a `mt-section` gap above.
- Column headings are `text-caption` semibold in `crema-500`, which is the one place crema works as a label color. Links are `steam-300` and turn `foam-50` on hover.
- On mobile, columns stack. From `md`, the grid is `1.4fr repeat(3, 1fr)`.
- Social icons sit in a row on mobile and a column from `md`.
- The copyright line sits below a hairline in `text-micro` `steam-500`.
