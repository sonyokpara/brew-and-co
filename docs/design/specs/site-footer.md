# SiteFooter

**Source:** [`components/SiteFooter.tsx`](../components/SiteFooter.tsx) · Server Component

## Anatomy

```
Brew          Visit us              Explore      Follow us
& Co.         14 Prempeh II St      Home         ◎
Specialty     Adum, Kumasi          Menu         ⓕ
coffee…       Mon–Thu  7am–10pm     About us
              Fri–Sat  7am–midnight What's on
              Get directions
────────────────────────────────────────────────────────
© 2026 Brew & Co.
```

## Props

| Prop | Type | Notes |
|---|---|---|
| `tagline` | `string` | Up to about 10 words, `max-w-[14rem]` |
| `columns` | `{ title, links: { label, href }[] }[]` | Two or three columns. Each is a `<nav aria-label={title}>` |
| `social` | `{ label, href, icon }[]` | Ghost icon links with `aria-label` ("Brew & Co. on Instagram") |
| `visit` | `{ address: string[]; hours: { days, hours }[]; mapHref? }?` | Optional "Visit us" column. Address renders in `<address>`, hours as a `<dl>` with `tabular-nums`, and `mapHref` adds a "Get directions" link |
| `copyright` | `string` | Passed in, not computed. With `cacheComponents: true`, calling `new Date()` while rendering forces dynamic rendering |

## Visual

- `roast-950` with a `roast-700` top border. The footer adds no top margin; the last section's own padding provides the gap.
- Column headings are `text-caption` semibold in `crema-500`, which is the one place crema works as a label color. Links are `steam-300` and turn `foam-50` on hover.
- Columns stack on mobile, sit two-up from `sm`, and flow into one row from `lg` (brand column 1.4fr, the rest equal).
- Social icons sit in a row below `lg` and a column from `lg`.
- The copyright line sits below a hairline in `text-micro` `steam-500`.
