# Brew & Co. style guide

The visual language for the Brew & Co. storefront, taken from `references/1.png` and tightened into a system. Read this first. The [tokens](tokens/) hold the values, the [components](components/) put them into code, and the [specs](specs/) explain how each piece behaves.

## The idea

**A late-night café seen from above.** The reference is shot like a table at night: cups, beans and pastries under one warm light, on a near-black ground with a faint blue cast. The interface works the same way:

- **The dark is the room.** Surfaces stay in the blue-black *roast* range so the photos look lit.
- **Espresso is the furniture.** Cards and panels use warm brown gradients, like wood and crema seen in low light.
- **Crema is the light.** There is one accent, a hot orange used only for things people act on or should notice first: prices, active states, primary buttons, star ratings.

When a choice is unclear, ask whether it makes the room darker, the furniture warmer or the light more precious. If it does none of those, leave it out.

## Color

| Token | Hex | Use |
|---|---|---|
| `roast-950` | `#090c12` | Page background |
| `roast-900` | `#0f131c` | Alternate sections, blog cards |
| `roast-800` | `#161c29` | Inputs, raised neutral surfaces |
| `roast-700` | `#222a3a` | Neutral borders, dividers |
| `roast-600` | `#1f2b47` | Navy glow (hero backlight, stats band) |
| `espresso-900 → 700` | `#1c120a → #3d2614` | Card and panel gradients (`--bg-card`, `--bg-panel`) |
| `espresso-600` | `#5a3a1f` | Card borders |
| `crema-500` | `#f5911e` | **The accent.** Primary button, price, active nav, stars |
| `crema-400` / `600` | `#ffa640` / `#d9760a` | Hover / pressed |
| `foam-50` | `#fbf6ef` | Primary text |
| `steam-300` | `#c2baaf` | Secondary text, body copy on cards |
| `steam-500` | `#8c857b` | Meta text, placeholders |
| `ink` | `#1a0f05` | Text on crema |
| `paper` | `#ffffff` | Merch photo frames only |
| `danger` | `#f2685c` | Form error text and the error border on inputs |
| `success` | `#7cc47f` | Form success messages |

### Rules

1. **Crema stays under about 5% of any screen.** It marks prices, the main call to action, the current page and ratings. It may also color a sentence-case `kicker` above a heading (`SectionHeading`, `PageHeader`), but only when the kicker adds meaning. A crema heading is allowed in one place only: the ruled heading of the testimonials section.
2. **Text on crema is `ink`, not white.** The reference uses white on orange, which measures about 2.3:1 and fails WCAG AA. `ink` on `crema-500` measures 8.0:1. This is the most important departure from the reference.
3. **Never put espresso on espresso without a border.** Cards always carry `border-espresso-600` so they read as separate objects on the dark ground.
4. **No grey shadows.** Depth comes from the espresso gradient, a 1px inner highlight (`shadow-card`) and, on focus or hover, a crema halo (`shadow-glow`).

### Contrast (on `roast-950`)

| Pair | Ratio | Passes |
|---|---|---|
| `foam-50` text | 18.2:1 | AAA |
| `steam-300` text | 10.2:1 | AAA |
| `steam-500` meta | 5.4:1 | AA |
| `crema-500` text | 8.3:1 | AAA |
| `ink` on `crema-500` | 8.0:1 | AAA |
| `steam-300` on `espresso-700` | 7.4:1 | AAA |
| `crema-500` on `espresso-700` | 6.0:1 | AA |
| `steam-500` on `roast-900` | 5.1:1 | AA |
| `danger` on `espresso-700` | 4.65:1 | AA (narrowly; keep it off lighter surfaces) |
| `danger` on `espresso-900` | 6.1:1 | AA |
| `success` on `espresso-700` | 6.8:1 | AA |
| Input border `foam-50/40` on `--bg-panel` (non-text, 3:1 needed) | 3.1–3.8:1 | AA (1.4.11). `foam-50/30` measures 2.3–2.7:1 and fails |

## Typography

**One family: Bricolage Grotesque**, loaded through `next/font` with the `opsz` and `wdth` axes ([`tokens/fonts.ts`](tokens/fonts.ts)). Its slightly condensed, inky letterforms at display sizes match the chunky geometric headlines in the reference, with more personality than a stock geometric sans. Optical sizing keeps 12px captions open and 72px headlines tight, so one family covers every role.

**Yellowtail** appears in the "Brew" script of the logo and nowhere else. It stands in for the hand-lettered "Coffee" in the reference. Replace it with the real logotype SVG once one exists.

### Scale

The scale follows Bringhurst's classical progression (12, 14, 16, 18, 21, 24, 30, 36, 48, 60, 72). Line height tightens as size grows.

| Utility | Size / line height | Weight | Use |
|---|---|---|---|
| `text-hero` | 72 / 0.98, −3% tracking | 800 | Hero headline (desktop) |
| `text-display-lg` | 60 / 1.0 | 800 | Spare large headline |
| `text-display` | 48 / 1.05 | 700–800 | Hero (mobile), stat figures |
| `text-heading-lg` | 36 / 1.1 | 700 | Section headings (desktop) |
| `text-heading` | 30 / 1.15 | 700 | Section headings (mobile) |
| `text-title` | 24 / 1.25 | 700 | Card price, hero subtitle |
| `text-title-sm` | 21 / 1.3 | 700 | Card titles, feature titles |
| `text-lead` | 18 / 1.6 | 400–500 | Intro paragraphs, mobile nav |
| `text-body` | 16 / 1.6 | 400 | Default copy |
| `text-caption` | 14 / 1.5 | 400–600 | Card copy, nav links, footer |
| `text-micro` | 12 / 1.4 | 500 | Badges, meta, review counts |

### Rules

- **Sentence case everywhere.** That includes buttons, badges, nav, footer headings and section headings ("Our special coffee", not "Our Special Coffee"). The reference's all-caps eyebrows ("PREMIUM EXCELLENCE", "WHY CHOOSE US") are dropped. Where a lead-in actually adds meaning, use `SectionHeading`'s `kicker`, which renders in sentence case.
- **Don't recolor single words in a headline.** A two-tone heading is allowed only as a whole line, like the product card's name in foam over its flavor in crema.
- **Keep body text under 65 characters per line** (`max-w-prose`).
- Use `text-balance` on headings and `tabular-nums` on prices and stats.

## Layout

- **Content column:** `max-w-site` (1200px), centered, with gutters of 16px on mobile, 24px from `sm` and 32px from `lg` (`<Container>`).
- **Vertical rhythm:** `py-section-sm` (64px) below `md` and `py-section` (96px) above it, set by `<Section>`.
- **Grid:** 12 columns are implied but not enforced. Product cards run 1 → 2 → 3 columns, merch tiles 2 → 4, features 1 → 2 → 4.
- **Alignment:** left-aligned by default. Center only when a section is a single statement: the stats band, the "Crafted with care" value props, testimonials and the newsletter panel. Closing call-to-action sections on inner pages (a heading, one line and the buttons, like About's "Come and say hello") stay left-aligned.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).

```
┌──────────────────────────────────────────────────────────┐
│ Logo        Home  Shop  Menu  Journal  Contact    ⌕ 🛒 ◯ │  sticky, blurred roast-950
├──────────────────────────────────────────────────────────┤
│ Enjoy your                          ╭───────╮            │
│ coffee                              │  cup  │ steam      │  hero: text left, photo right
│ Before your first meeting           ╰───────╯            │
│ [Order now →]                                            │
├──────────────────────────────────────────────────────────┤
│ Our special coffee                          See all →    │
│ ┌────────┐ ┌────────┐ ┌────────┐                         │  ProductCard ×3
├──────────────────────────────────────────────────────────┤
│ ① Premium sourcing     │   splash photo                  │  FeatureItem rows + image
├──────────────────────────────────────────────────────────┤
│   200+       250+       300+       25+                   │  StatBand (full bleed)
├──────────────────────────────────────────────────────────┤
│ Featured roasters · merch · values · journal             │
│ ☕︎_____________/\___/\/\_____________________            │  PulseDivider (signature)
│ ───── What regulars say ─────   [card][card][card] • • ● │
│ ╭ Ready for a better cup?  [email        ][Get 15% off] ╮│  NewsletterPanel
├──────────────────────────────────────────────────────────┤
│ Logo + tagline │ Shop │ Company │ Follow us              │  SiteFooter
└──────────────────────────────────────────────────────────┘
```

## Shape

Corner radius follows hierarchy, so it isn't the same everywhere:

| Token | Radius | On |
|---|---|---|
| `rounded-tag` | 4px | Badges |
| `rounded-tile` | 10px | Photo frames inside cards, merch tiles |
| `rounded-card` | 16px | Product, blog and testimonial cards |
| `rounded-panel` | 24px | Full-width panels (newsletter) |
| `rounded-full` | pill | Buttons, inputs, icon buttons, avatars |

Inner radii are always smaller than outer ones. A photo inset 8px inside a 16px card gets the 10px tile radius.

**Standalone photos** (editorial images that sit directly in a section rather than inside a card, like the About page's interior, founder and cocoa photos) are framed like cards: `rounded-card`, `border border-espresso-600` and `shadow-card`, with `overflow-hidden` on the frame.

## Imagery

- **Overhead or three-quarter shots on dark ground, lit from one side.** Backgrounds should fall off to near-black so photos blend into `roast-950` without a visible box.
- **Hero art** is a single cut-out cup, square and centered, with room above it for the steam.
- **Product photos** are 4:3 and include a prop (flower, beans, saucer) for scale and warmth.
- **Merch photos** are bright product shots. They sit in white `paper` frames on purpose: the contrast says "this is a thing you can buy" rather than "this is the café".
- Always use `next/image` with `sizes` for responsive images (`fill`, or anything whose rendered width changes with the viewport). Images rendered at a fixed `width` and `height`, such as avatars, partner logos and the PulseDivider cup, are exempt, because Next already serves them at 1× and 2×. Only the hero image gets `preload`. Next 16 deprecated `priority`, so don't use it.
- Alt text describes the drink, not the photo ("Salted caramel latte with a red rose", not "image of coffee").

## Iconography

Use the stroke icons in [`components/icons.tsx`](components/icons.tsx): a 24px grid, 1.75px stroke, round caps and joins, drawn in `currentColor`. Icons are decorative (`aria-hidden`) unless they stand alone, in which case the surrounding control carries an `aria-label`. Feature icons sit in a circle: an outlined `espresso-900` circle in row layouts, a filled `espresso-800` circle in stacked ones.

The arrow (`ArrowRight`) only goes on actions that take you somewhere: "Order now", "See all", "Read article". It never goes on actions that change something, like "Add to cart" or "Subscribe".

## Motion

Spend motion in two places only:

1. **Hero:** on load, the cup "pours in" (a 900ms rise and settle on `ease-pour`) while steam loops gently above it (`animate-steam`). The background-photo variant replaces this with a single 1.4s settle-in of the photo (`animate-settle-in`).
2. **PulseDivider:** the heartbeat line draws itself once, the first time it scrolls into view. This is the brand's signature moment. See [specs/pulse-divider.md](specs/pulse-divider.md).

Everything else moves only in response to the user: hover color changes (150ms `ease-settle`), the card focus and hover glow (240ms), and a slow image zoom on card hover (600ms, at most 1.04×). Sections don't fade in as you scroll, and carousels don't autoplay.

`prefers-reduced-motion: reduce` is handled globally in `tokens.css`. Steam is hidden, and the pulse line appears already drawn.

## Voice and copy

Write like a good barista talks: warm, short and specific. Name the drink, the origin and the roast.

| Instead of | Write |
|---|---|
| Life is short, stay awake for it – a catchy, motivational slogan… | Small-batch roasts, pulled fresh every morning. |
| Be First Hwo Read News | From the journal |
| Our Happy Client | What regulars say |
| Ready to transform your space? | Ready for a better cup? |
| Subscribe | Get 15% off |
| Book now / Submit | Reserve a table → Request table → "Table requested" |
| Invalid input | That date has passed. Choose today or a later date. |
| Read More | Read article |

- Buttons say exactly what happens, and the result repeats that word: **Add to cart** leads to "Added to cart", and **Get 15% off** leads to "Check your inbox for your code."
- Error messages state the problem and the fix, without apologizing: "Enter an email like name@example.com."
- **Content note:** the "Featured products" and "Crafted with care" sections in the reference contain placeholder candle copy (wax, essential oils). Replace it with coffee merchandise and values (beans, mugs, brewers; ethically sourced, roasted weekly, compostable packaging).
- Stat figures must be real. If there's no true number, drop the stats band.

## Accessibility baseline

- WCAG 2.2 AA at minimum. See the contrast table above.
- Focus shows as a 2px `crema-400` outline with a 3px offset, set globally on `:focus-visible`. Cards also gain the `shadow-glow` halo while anything inside them has focus.
- Primary controls are at least 44px tall (`h-11`). That includes the header's "Reserve a table" button, which uses `size="md"` rather than `sm`; it fits beside the logo and menu toggle at 360px. Icon buttons are 40px with an 8px gap between them, which exceeds the 24px minimum.
- Each section has an `aria-labelledby` that points at its heading. Each card is an `<article>` with one stretched link, and secondary actions (the cart button) are raised above that link with `z-10`.
- Ratings expose a single readable label ("Rated 4.5 out of 5 from 350 reviews").
- The carousel is a scrollable, focusable list with real buttons for its dots. It never autoplays.

## What changed from the reference, and why

| Reference | System | Reason |
|---|---|---|
| White text on orange buttons | `ink` on crema | Contrast (2.3:1 → 8.0:1) |
| ALL-CAPS eyebrows above headings | Optional sentence-case `kicker` | Readability, less template noise |
| Title Case Headings | Sentence case | One consistent voice |
| Candle copy in the merch and value sections | Coffee merchandise and values | Content belongs to this brand |
| Same radius on every box | Radius tied to hierarchy | Clearer structure |
| Third-party brand logos (Starbucks, Nescafé…) | `PartnerStrip` for partners you're licensed to show | Trademark use |
