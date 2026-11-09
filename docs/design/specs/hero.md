# Hero

**Source:** [`components/Hero.tsx`](../components/Hero.tsx) · Server Component (motion is CSS-only)

The first screen. It comes in two variants:

- **`split`** (default): a large headline on the left and a single overhead cup on the right, backlit by a navy glow, with steam rising from it, an optional pastry overlapping the cup, and the signature heartbeat line running along the bottom. Brew & Co.'s homepage uses this one.
- **`background`**: a full-bleed photo behind the headline. Kept for campaign pages where a scene matters more than a product.

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Two short lines. Rendered as `<h1 id="hero-title">` |
| `subtitle` | `string?` | One line, `text-title` bold |
| `body` | `string?` | Up to two sentences, `max-w-sm`. `steam-300` on `split`, `foam-100` on `background` |
| `cta` | `ReactNode?` | One or two buttons: a primary, plus an optional outline. They wrap with a 12px gap |
| `image` | `{ src, alt }` | `split`: a square overhead cup shot on near-black (a true cut-out also works). `background`: landscape photo at least 2400px wide, darker on the left |
| `video` | `{ src, poster, label }?` | `split` only. A muted, looping MP4 that replaces `image` (rendered by [`HeroVideo`](../components/HeroVideo.tsx), a Client Component). Landscape is fine because it's cropped square; keep the action in the middle third. Aim for 1080p or less and under 1MB. `poster` is a still from the clip; `label` describes it for screen readers |
| `accent` | `{ src, alt }?` | `split` only. A square pastry shot on black, overlapping the cup's lower right at half its width |
| `variant` | `"split" \| "background"` | Default `"split"` |

## Type

The title is `text-display` (48px) on mobile and `md:text-hero` (72px) from `md`, weight 800 with −3% tracking. Don't use a trailing ellipsis. The reference's "Enjoy Your Coffee...." becomes "Enjoy your coffee".

## Layout: split

- Below `md`: a single column, text first, then the image at up to 24rem.
- From `md`: `grid-cols-[1fr_1.1fr]`, vertically centered, with a minimum height of 34rem.
- A radial `roast-600` glow sits behind the image at 80% opacity.
- Photos don't need transparent backgrounds. The cup and the accent are masked with `radial-gradient(closest-side, #000 68%, transparent)`, so their edges fade into the glow. The accent also uses `mix-blend-lighten`, which drops its black ground. Choose photos whose subject sits inside the middle two-thirds of the frame on a near-black ground.
- **Heartbeat line:** a full-width `foam-50` SVG line, 2.5px non-scaling stroke, 24px above the section's bottom edge (40px from `md`). It runs flat and kicks twice under the cup, at 60–74% of the width. It's the same mark as [PulseDivider](pulse-divider.md); a page that uses the split hero doesn't also use PulseDivider.

## Layout: background

- The photo fills the section (`object-cover`), at a minimum height of 36rem (42rem from `md`). Copy is left-aligned and vertically centered.
- Two overlays keep the copy readable: a left-to-right gradient from solid `roast-950` through `roast-950/80` to `roast-950/20` (`roast-950/70` below `lg`, where the copy column covers most of the photo's width), and a 160px fade at the bottom into the page.
- Choose photos whose left third is already dark. Check foam text against the lightest area behind it; it must reach 4.5:1.

## Motion (one of the two motion moments)

| Variant | Element | Animation | Reduced motion |
|---|---|---|---|
| split | Cup image | `animate-pour-in`: rises 16px and turns from −6° to 0° over 900ms, `ease-pour`, once | Shown in place |
| split | Steam | Three blurred `foam-50/25` plumes, `animate-steam` looping every 3.2s, staggered by 0.8s | Hidden |
| split | Video | Plays muted and inline on a loop once hydrated, with the same `animate-pour-in` entrance. A 40px round pause/play button sits at the frame's top right (`foam-50/40` border on `roast-950/60`), because looping motion over five seconds needs one (WCAG 2.2.2). No steam: the clip brings its own movement | Doesn't autoplay. The poster shows, and the button reads "Play video" |
| split | Accent | `animate-pour-in`, 250ms after the cup | Shown in place |
| split | Heartbeat line | `animate-line-reveal`: wiped in from the left with `clip-path` over 1.6s, 500ms after load. A stroke-dash draw isn't used because Chrome measures `pathLength` before the non-scaling stroke is applied, so the line stopped short | Shown in place |
| background | Photo | `animate-settle-in`: fades in from 1.04× scale over 1.4s, `ease-pour`, once. No steam | Shown immediately |

## Performance

The image uses `preload`, which replaces the `priority` prop deprecated in Next 16. Sizes are `(min-width: 768px) 34rem, 24rem` for split (the accent, which isn't preloaded, uses `(min-width: 768px) 17rem, 12rem`) and `100vw` for background. This is the only preloaded image on the page.

## Example

```tsx
<Hero
  title="Late coffee in the heart of Kumasi"
  subtitle="Open until midnight on Fridays and Saturdays"
  body="Specialty coffee, fresh pastries and light lunches on Prempeh II Street in Adum."
  cta={
    <>
      <ReservationDialog reserve={reserveTable} options={reservationOptions} size="lg" />
      <Button href="/menu" variant="outline" size="lg">See the menu</Button>
    </>
  }
  image={{ src: "/images/menu/flat-white.jpg", alt: "A flat white with rosetta latte art, seen from above on a dark table" }}
  accent={{ src: "/images/menu/butter-croissant.jpg", alt: "Two butter croissants catching the light" }}
/>
```
