# FeatureItem, StatBand and PartnerStrip

Supporting content blocks. All are Server Components.

## FeatureItem

**Source:** [`components/feature-item.tsx`](../components/feature-item.tsx)

An icon, a title and a short body.

| Prop | Type | Default |
|---|---|---|
| `icon` | `ReactNode` (from `icons.tsx`) | |
| `title` | `string` | |
| `children` | body copy | |
| `layout` | `"row" \| "stacked"` | `"row"` |
| `headingLevel` | `"h3" \| "h4"` | `"h3"` |

| Layout | Icon | Text | Used in |
|---|---|---|---|
| `row` | 44px circle, `espresso-900` fill, `espresso-600` border, crema glyph | Left-aligned beside the icon | "Only quality coffee beans": three items stacked in a column next to a splash photo (`lg:grid-cols-2`) |
| `stacked` | 56px circle, `espresso-800` fill, 28px crema glyph | Centered, max 16rem | Values row: `grid sm:grid-cols-2 lg:grid-cols-4 gap-10` |

Keep body copy to about 40 words in a row and about 15 in a stack. Suggested coffee values: *Ethically sourced*, *Roasted weekly*, *Compostable packaging*, *Brewed to order*.

## StatBand

**Source:** [`components/stat-band.tsx`](../components/stat-band.tsx)

A full-bleed band with a navy gradient (`--bg-stats`) and `roast-600` hairlines above and below, holding a `<dl>` of 3–4 figures.

- Figures are `text-display` bold `foam-50` with `tabular-nums`. Labels are `text-caption` `steam-300` and sit below the figure visually, but come first in the DOM (`flex-col-reverse`) so screen readers read the label first.
- Layout is two columns on mobile and four from `md`, centered.
- **Use only true, current numbers.** "200+ client every day" in the reference becomes "200+ guests a day", and only if that's accurate.

## PartnerStrip

**Source:** [`components/partner-strip.tsx`](../components/partner-strip.tsx)

The "Featured roasters" logo row. Logos are 48px tall, shown at 75% opacity in grayscale, and return to full color on hover or focus.

| Prop | Type |
|---|---|
| `partners` | `{ name, logo, width, height, href? }[]` |

- Use 4–6 logos, spread with `justify-between` from `md`.
- Alt text is the partner's name.
- **Legal:** the reference shows third-party trademarks (Starbucks, Dunkin', Gloria Jean's, Nescafé). Show only roasters you have a real relationship with and permission to display.
