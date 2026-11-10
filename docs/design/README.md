# Brew & Co. design system

The design system for the Brew & Co. storefront, built from [`references/1.png`](references/1.png) for this repo's stack: **Next.js 16.4 (App Router, `cacheComponents`), React 19.3, Tailwind CSS v4 (Turbopack loader) and strict TypeScript.**

```
docs/design/
├── README.md              ← you are here
├── style-guide.md         ← principles, color, type, layout, imagery, motion, voice, a11y
├── references/1.png       ← source mock-up
├── tokens/
│   ├── tokens.css         ← Tailwind v4 @theme: the source of truth in code
│   ├── tokens.json        ← the same tokens in W3C DTCG format (Figma / Style Dictionary)
│   └── fonts.ts           ← next/font setup (Bricolage Grotesque + Yellowtail)
├── components/            ← typed React components, one per PascalCase file
│   ├── Button.tsx …       ← e.g. Button.tsx exports Button
│   ├── cn.ts, icons.tsx   ← shared helpers (camelCase: not single components)
│   └── index.ts           ← barrel export
└── specs/                 ← one spec per component: anatomy, props, states, a11y
```

## Adopting it in the app

1. **Tokens:** in `app/globals.css`, replace the starter `:root` and `@theme` blocks with:
   ```css
   @import "tailwindcss";
   @import "../docs/design/tokens/tokens.css";
   ```
2. **Fonts:** in `app/layout.tsx`, swap Geist for the system fonts:
   ```tsx
   import { bricolage, yellowtail } from "@/docs/design/tokens/fonts";
   <html lang="en" className={`${bricolage.variable} ${yellowtail.variable}`}>
   ```
3. **Components:** import from `@/docs/design/components`, or move the folder to `components/ui/` once the system settles. All imports inside it are relative, so it can move as a whole.

Tailwind v4 finds class names in `docs/` automatically. I checked that every token utility the components use is generated.

## Components

| Component | Kind | Spec |
|---|---|---|
| `Button` (+ `buttonClasses`), `IconButton` | Server | [button.md](specs/button.md) |
| `Badge`, `Rating`, `Price` | Server | [badge-rating-price.md](specs/badge-rating-price.md) |
| `Container`, `Section`, `SectionHeading` | Server | [layout-primitives.md](specs/layout-primitives.md) |
| `SiteHeader` / `Logo` | Client / Server | [site-header.md](specs/site-header.md) |
| `Hero` | Server (CSS motion) | [hero.md](specs/hero.md) |
| `ProductCard` | Server + Server Action | [product-card.md](specs/product-card.md) |
| `MerchCard` | Server | [merch-card.md](specs/merch-card.md) |
| `FeatureItem`, `StatBand`, `PartnerStrip` | Server | [feature-stat-partner.md](specs/feature-stat-partner.md) |
| `BlogCard` | Server | [blog-card.md](specs/blog-card.md) |
| `TestimonialCard` / `TestimonialCarousel` | Server / Client | [testimonial.md](specs/testimonial.md) |
| `PulseDivider` (signature) | Client | [pulse-divider.md](specs/pulse-divider.md) |
| `NewsletterPanel` | Client + Server Action | [newsletter-form.md](specs/newsletter-form.md) |
| `SiteFooter` | Server | [site-footer.md](specs/site-footer.md) |
| `PageHeader` | Server | [page-header.md](specs/page-header.md) |
| `MenuItemCard` (+ `menuBadgeTone`) | Server | [menu-item-card.md](specs/menu-item-card.md) |
| `MenuItemRow` | Server | [menu-item-row.md](specs/menu-item-row.md) |
| `MenuCategoryNav` | Client | [menu-category-nav.md](specs/menu-category-nav.md) |
| `EventCard` | Server | [event-card.md](specs/event-card.md) |
| `ReservationDialog` / `ReservationForm` | Client + Server Action | [reservation.md](specs/reservation.md) |
| `CartProvider` (+ `useCart`) | Client | [cart.md](specs/cart.md) |
| `AddToCartButton`, `QuantityStepper` | Client | [cart.md](specs/cart.md) |
| `CartDrawer` | Client + Server Action | [cart.md](specs/cart.md) |
| `SearchDialog` (+ `searchMenu`), `HashHighlight` | Client | [search.md](specs/search.md) |
| `Icons.*` | Server | [style-guide.md#iconography](style-guide.md#iconography) |

## Where the site's content lives

The design system is content-agnostic. Brew & Co.'s own content lives outside `docs/design`:

| Path | Holds |
|---|---|
| `data/menu-items.csv` | The menu: category, slug, name, description, price (GH₵), badge, image file, alt text, optional `served_until` |
| `lib/menu.ts` | Loads and groups the menu (`getMenu`, `getFeaturedItems`) |
| `lib/events.ts` | Recurring events and `getUpcomingEvents` |
| `lib/site.ts` | Address, phone, opening hours, booking and pickup rules, nav |
| `lib/reservations.ts`, `app/actions/reserve.ts` | Reservation validation and the storage stub |
| `lib/orders.ts`, `app/actions/order.ts` | Pickup order validation and the storage stub |
| `lib/shop-time.ts` | The shop's current date and time, shared by both actions |
| `public/images/` | Pexels photos, credited in `public/images/CREDITS.md` |

## How the reference maps to components

| Reference section | Built from |
|---|---|
| Nav bar | `SiteHeader` |
| "Enjoy your coffee" | `Hero` |
| Our special coffee | `SectionHeading` + `ProductCard` × 3 |
| Only quality coffee beans | `FeatureItem layout="row"` × 3 + image |
| 200+ / 250+ / 300+ / 25+ | `StatBand` |
| Featured roasters | `PartnerStrip` |
| Featured products | `MerchCard` × 4 + outline `Button` |
| Crafted with care | `FeatureItem layout="stacked"` × 4 |
| Our blog | `BlogCard` × 3 |
| Cup and heartbeat line | `PulseDivider` |
| Our happy client | `SectionHeading ruled` + `TestimonialCarousel` |
| Ready to transform… | `NewsletterPanel` |
| Footer | `SiteFooter` |

## Conventions

- **Naming:** one component per file. The file is named in PascalCase after the component it exports (`ProductCard.tsx` → `export function ProductCard`), and imports use the same casing (`./ProductCard`). Helpers and collections that aren't a single component (`cn.ts`, `icons.tsx`, `index.ts`) are camelCase.
- **Stay on tokens.** If you find yourself writing a hex value or an arbitrary `text-[17px]`, add a token to both `tokens.css` and `tokens.json` instead.
- **Default to Server Components.** Add `"use client"` only for state, effects or browser APIs, as in the header menu, carousel, pulse divider and newsletter form.
- **Mutations go through Server Actions**, passed in as props (`addToCart`, `subscribe`), so components don't depend on a particular data layer.
- **Images** use `next/image` with `sizes`. Images rendered at a fixed `width` and `height` (avatars, partner logos, the PulseDivider cup) are exempt; see [style-guide.md#imagery](style-guide.md#imagery). Use `preload` (not the deprecated `priority`) only on the hero image.
- **Don't call `new Date()` while rendering.** With `cacheComponents`, it makes a route dynamic, so pass dates in as props.
