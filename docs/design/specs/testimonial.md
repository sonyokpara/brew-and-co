# TestimonialCard and TestimonialCarousel

**Source:** [`components/TestimonialCard.tsx`](../components/TestimonialCard.tsx) (Server Component) and [`components/TestimonialCarousel.tsx`](../components/TestimonialCarousel.tsx) (Client Component: syncs its dots to scroll position)

## TestimonialCard

A `<figure>` on the espresso card surface:

- `Rating` at the top.
- The quote as `<blockquote>`, in `text-caption` `foam-100`, up to about 60 words.
- A `<figcaption>` below an `espresso-600` hairline, with a 40px round avatar, the name (caption semibold) and `context` (micro, `steam-300`).

```ts
type Testimonial = {
  id: string; quote: string; name: string;
  context: string;          // "Regular since 2023". Never an invented job title
  rating: number;
  avatar: { src; alt? };    // alt defaults to "" because the name is right beside it
};
```

Only publish real reviews with the customer's permission. Don't invent names.

## TestimonialCarousel

Native horizontal scroll with snap points. JavaScript only keeps the dots in sync.

| Breakpoint | Visible cards |
|---|---|
| base | 0.85, so the next card peeks in |
| `sm` | 2 |
| `lg` | 3 |

### Dots

- Each dot is a 24px button, which meets the minimum target size, wrapping a 10px visible dot.
- The active dot stretches to a 24px pill in `crema-500`. Inactive dots are `foam-50/40`.
- `aria-current="true"` marks the active dot, and each is labelled "Show reviews page 2 of 3".
- Dots only render when there's more than one page.

### Behavior

- **No autoplay.** People read testimonials at their own pace.
- The track has `tabIndex=0`, so keyboard users can scroll it with the arrow keys.
- Clicking a dot scrolls smoothly, or jumps instantly with reduced motion.
- The wrapper is a `region` with `aria-roledescription="carousel"` and a label.

### Section

Use `<SectionHeading ruled align="center" title="What regulars say" />` above the carousel.
