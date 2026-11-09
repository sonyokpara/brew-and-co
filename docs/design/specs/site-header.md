# SiteHeader and Logo

**Source:** [`components/SiteHeader.tsx`](../components/SiteHeader.tsx) (Client Component: uses `usePathname` and keeps menu state) and [`components/Logo.tsx`](../components/Logo.tsx) (Server Component)

## Logo

"Brew" is set in Yellowtail, `crema-500`, rotated −6°. "& Co." sits under it in Bricolage, extra-bold, `foam-50`, overlapping the script by 4px. Sizes: `md` in the header, `lg` in the footer. The logo links to `/` with `aria-label="Brew & Co. home"`. Replace it with an SVG logotype when one exists, keeping the same footprint.

## SiteHeader

```
┌──────────────────────────────────────────────────────────────┐
│ Brew          Home  Shop  Menu  Journal  Contact      ⌕ 🛒³ ◯ │  h-18 (72px)
│ & Co.                                                        │
└──────────────────────────────────────────────────────────────┘
```

### Props

| Prop | Type | Notes |
|---|---|---|
| `items` | `{ label, href }[]` | Five items at most. The reference's "Category" becomes "Shop" and "Blog" becomes "Journal" |
| `cartCount` | `number` | Shows a crema count bubble when above 0 |
| `account` | `ReactNode?` | Avatar or "Sign in" link; hidden below `sm` |

### Visual

- Sticky, `bg-roast-950/85` with `backdrop-blur-md` and a `roast-700/60` bottom border, so content scrolls under it softly.
- Nav links are `text-caption` medium in `foam-100`. Hover turns them `crema-300`. The current page gets `aria-current="page"` and turns `crema-500`. Don't add an underline; color alone marks the current page, and `aria-current` covers it for screen readers.
- Utility icons are ghost `IconButton`s (40px).

### Responsive

- Below `md`, the inline nav is hidden and a menu toggle appears (`aria-expanded`, `aria-controls="mobile-nav"`). The panel lists links at 48px row height in `text-lead`, and choosing one closes it.
- The logo, cart and toggle are always visible.

### Accessibility

- There are two `<nav aria-label="Main">` landmarks, and only one is visible at a time because the other is `hidden`.
- The cart link announces its count: "Cart, 3 items".
- Add a "Skip to content" link as the first child of `<body>` in `app/layout.tsx`. It isn't part of the header.
