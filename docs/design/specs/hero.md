# Hero

**Source:** [`components/Hero.tsx`](../components/Hero.tsx) · Server Component (motion is CSS-only)

The first screen. It comes in two variants:

- **`split`** (default): a large headline on the left and a single overhead cup on the right, backlit by a navy glow, with steam rising from it.
- **`background`**: a full-bleed photo behind the headline. Brew & Co.'s homepage uses this one.

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Two short lines. Rendered as `<h1 id="hero-title">` |
| `subtitle` | `string?` | One line, `text-title` bold |
| `body` | `string?` | Up to two sentences, `max-w-sm`. `steam-300` on `split`, `foam-100` on `background` |
| `cta` | `ReactNode?` | One or two buttons: a primary, plus an optional outline. They wrap with a 12px gap |
| `image` | `{ src, alt }` | `split`: square cut-out cup on a dark ground. `background`: landscape photo at least 2400px wide, darker on the left |
| `variant` | `"split" \| "background"` | Default `"split"` |

## Type

The title is `text-display` (48px) on mobile and `md:text-hero` (72px) from `md`, weight 800 with −3% tracking. Don't use a trailing ellipsis. The reference's "Enjoy Your Coffee...." becomes "Enjoy your coffee".

## Layout: split

- Below `md`: a single column, text first, then the image at up to 34rem.
- From `md`: `grid-cols-[1fr_1.1fr]`, vertically centered, with a minimum height of 34rem.
- A radial `roast-600` glow sits behind the image at 70% opacity.

## Layout: background

- The photo fills the section (`object-cover`), at a minimum height of 36rem (42rem from `md`). Copy is left-aligned and vertically centered.
- Two overlays keep the copy readable: a left-to-right gradient from solid `roast-950` through `roast-950/80` to `roast-950/20` (`roast-950/70` below `lg`, where the copy column covers most of the photo's width), and a 160px fade at the bottom into the page.
- Choose photos whose left third is already dark. Check foam text against the lightest area behind it; it must reach 4.5:1.

## Motion (one of the two motion moments)

| Variant | Element | Animation | Reduced motion |
|---|---|---|---|
| split | Cup image | `animate-pour-in`: rises 16px and turns from −6° to 0° over 900ms, `ease-pour`, once | Shown in place |
| split | Steam | Three blurred `foam-50/25` plumes, `animate-steam` looping every 3.2s, staggered by 0.8s | Hidden |
| background | Photo | `animate-settle-in`: fades in from 1.04× scale over 1.4s, `ease-pour`, once. No steam | Shown immediately |

## Performance

The image uses `preload`, which replaces the `priority` prop deprecated in Next 16. Sizes are `(min-width: 768px) 34rem, 90vw` for split and `100vw` for background. This is the only preloaded image on the page.

## Example

```tsx
<Hero
  variant="background"
  title="Late coffee in the heart of Kumasi"
  body="Specialty coffee, fresh pastries and light lunches, served until midnight on weekends."
  cta={
    <>
      <ReservationDialog reserve={reserveTable} options={reservationOptions} size="lg" />
      <Button href="/menu" variant="outline" size="lg">See the menu</Button>
    </>
  }
  image={{ src: heroPhoto, alt: "A barista pouring milk at a warmly lit coffee bar at night" }}
/>
```
