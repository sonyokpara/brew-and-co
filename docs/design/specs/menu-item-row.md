# MenuItemRow

**Source:** [`components/MenuItemRow.tsx`](../components/MenuItemRow.tsx) · Server Component

One entry on the menu page, set like a printed café menu: the name and price are joined by a dotted leader, with the description underneath. It renders an `<li>`, so wrap rows in a `<ul>`.

## Anatomy

```
┌──────┐  Flat white ·························· GH₵45
│ 1:1  │  A double ristretto under a thin layer of velvety
│photo │  microfoam. Rich, silky and not too milky.
└──────┘  [Popular]
```

| Part | Value |
|---|---|
| Thumbnail | 80px, or 104px from `sm`. `rounded-tile`, `border-espresso-600` |
| Name | `text-title-sm` bold, foam |
| Leader | 2px dotted `steam-500/50` bottom border filling the gap (`flex-1`, min 8px below `sm`, 24px from `sm`). `aria-hidden`. The name, leader and price sit `gap-2` apart below `sm` and `gap-3` from `sm`, so the row fits at 320px. The name (`min-w-0 hyphens-auto`) wraps before the row overflows |
| Price | `text-title-sm` bold, `crema-500`, `tabular-nums`, never wraps |
| Description | `text-caption` `steam-300`, `max-w-prose` |
| Badge | Below the description, tone from `menuBadgeTone()` |

## Props

Same as `MenuItemCard`: `name`, `description`, `price`, `currency`, `badge?`, `image`.

## Layout

Within a category: `grid gap-x-12 gap-y-10 lg:grid-cols-2`. Rows aren't interactive.

## Accessibility

The name is an `<h3>` under the category's `<h2>`. The dotted leader is decorative and hidden from screen readers, so each row reads as "Flat white, GH₵45, description".
