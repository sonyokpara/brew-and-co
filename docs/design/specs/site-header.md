# SiteHeader and Logo

**Source:** [`components/SiteHeader.tsx`](../components/SiteHeader.tsx) (Client Component: uses `usePathname` and keeps menu state) and [`components/Logo.tsx`](../components/Logo.tsx) (Server Component)

## Logo

"Brew" is set in Yellowtail, `crema-500`, rotated −6°. "& Co." sits under it in Bricolage, extra-bold, `foam-50`, overlapping the script by 4px. Sizes: `md` in the header, `lg` in the footer. The logo links to `/` with `aria-label="Brew & Co. home"`. Replace it with an SVG logotype when one exists, keeping the same footprint.

## SiteHeader

```
┌──────────────────────────────────────────────────────────────┐
│ Brew        Home   Menu   About   (S) (C)  [Reserve a table] │  h-18 (72px)
│ & Co.                                                        │
└──────────────────────────────────────────────────────────────┘
```

### Props

| Prop | Type | Notes |
|---|---|---|
| `items` | `{ label, href }[]` | Five items at most. Brew & Co. uses Home, Menu, About |
| `utilities` | `ReactNode?` | 40px icon controls before the `cta`. Brew & Co. passes `<SearchDialog />` (S) and `<CartDrawer />` (C); see [search.md](search.md) and [cart.md](cart.md). Visible at every width |
| `cta` | `ReactNode?` | The header's main action, e.g. `<ReservationDialog variant="outline" size="md" />`. In the row from `sm`; below `sm` it moves to the foot of the menu panel |
| `account` | `ReactNode?` | Avatar or "Sign in" link; hidden below `sm` |

### Visual

- Sticky, `bg-roast-950/85` with `backdrop-blur-md` and a `roast-700/60` bottom border, so content scrolls under it softly.
- Nav links are `text-caption` medium in `foam-100`. Hover turns them `crema-300`. The current page gets `aria-current="page"` and turns `crema-500`. Don't add an underline; color alone marks the current page, and `aria-current` covers it for screen readers.
- Utility icons are ghost `IconButton`s (40px).
- The `cta` is an **outline** button at **`md`** (44px). It's outline rather than primary because the header stays on screen above every page's own primary action (the homepage hero's "Reserve a table", for one), and [button.md](button.md) allows one primary per viewport. It's `md` rather than `sm` because the style guide requires 44px for primary actions. The header has no crema button.

### Responsive

- Below `md`, the inline nav is hidden and a menu toggle appears (`aria-expanded`, `aria-controls="mobile-nav"`). The panel lists links at 48px row height in `text-lead`, and choosing one closes it.
- The logo, utilities and toggle are always visible. Below `sm` there isn't room for the `cta` as well (the logo, three 40px icons and the 44px button need about 360px, and a 320px screen leaves 288px), so it moves into the menu panel under the links.

### Accessibility

- There are two `<nav aria-label="Main">` landmarks, and only one is visible at a time because the other is `hidden`.
- The cart button announces its count: "Your order, 3 items".
- Add a "Skip to content" link as the first child of `<body>` in `app/layout.tsx`. It isn't part of the header.
