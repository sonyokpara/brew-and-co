# Badge, Rating and Price

The small pieces that sit inside cards. All are Server Components.

## Badge

**Source:** [`components/badge.tsx`](../components/badge.tsx)

A 24px-tall label with `rounded-tag` (4px), `text-micro` and medium weight.

| `tone` | Look | Use |
|---|---|---|
| `solid` | `crema-500` fill, `ink` text | The one attribute that matters most, such as "Hot coffee". Use at most one per card |
| `outline` | `steam-500/60` border, `steam-300` text | Further attributes, such as "Cold brew" or "Oat milk" |

- Write labels in sentence case, two words at most.
- Badges are not interactive. Use a link or button for filter chips.
- Inside a card, wrap them in `<ul aria-label="Tags">` so screen readers can count them.

## Rating

**Source:** [`components/rating.tsx`](../components/rating.tsx)

Read-only stars with an optional review count.

| Prop | Type | Default |
|---|---|---|
| `value` | `number` (0 to `max`, decimals allowed) | |
| `count` | `number` | — |
| `max` | `number` | `5` |

- Stars are 14px, `crema-500`. Unfilled stars are the same color at 25% opacity, and fractional values fill part of a star.
- The count is shown as `text-micro` in `steam-300`, formatted with `toLocaleString`.
- The whole group is `role="img"` with one label, such as "Rated 4.5 out of 5 from 350 reviews". The visible count is hidden from screen readers so it isn't read twice.

## Price

**Source:** [`components/price.tsx`](../components/price.tsx)

Formats prices with `Intl.NumberFormat`. Whole amounts drop the cents ("$15"), and other amounts show two decimals ("$24.99").

| `size` | Look | Use |
|---|---|---|
| `md` | `text-body` semibold, foam | Merch tiles, lists |
| `lg` | "Price" caption above a `text-title` bold `crema-500` figure | Product card price block |

Prices always use `tabular-nums`. Pass amounts as numbers in major units (15 means $15), never as preformatted strings.
