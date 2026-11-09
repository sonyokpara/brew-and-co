# PulseDivider (the signature)

**Source:** [`components/pulse-divider.tsx`](../components/pulse-divider.tsx) · Client Component

A steaming cup sits on a flat white line that kicks into two heartbeats, then runs flat to the edge of the page. It's the one memorable, unexpected image in the reference: coffee as the thing that keeps your day alive. The system makes it its signature.

## Behavior

- The line is an SVG path drawn with `pathLength=1` and a dash offset. The first time 40% of it enters the viewport (`IntersectionObserver`), it draws from left to right over 1.6s on `ease-pour`. It doesn't replay on later scrolls.
- With reduced motion, the line is already drawn when it appears.
- The whole component is `aria-hidden`. It's decoration, and a screen reader gains nothing from it.

## Props

| Prop | Type | Notes |
|---|---|---|
| `image` | `{ src }` | Cut-out cup on a transparent background, roughly square. Alt is empty on purpose |

## Layout

- Full bleed up to 90rem wide. The cup sits 4% in from the left, `clamp(9rem, 22vw, 17rem)` wide.
- The line runs along the lower 40% of the block in `foam-50`, with a 3px non-scaling stroke.
- Place it between the journal and testimonials sections, with no heading of its own.

## Rules

- Use it once per page, and only on marketing pages.
- Don't recolor the line crema. Its strength comes from being plain white on the dark ground.
- Don't add more heartbeats. Two peaks read as a pulse, and more starts to look like a chart.
