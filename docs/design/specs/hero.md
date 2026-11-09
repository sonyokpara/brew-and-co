# Hero

**Source:** [`components/hero.tsx`](../components/hero.tsx) · Server Component (motion is CSS-only)

The first screen: a large headline on the left and a single overhead cup on the right, backlit by a navy glow, with steam rising from it.

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | Two short lines. Rendered as `<h1 id="hero-title">` |
| `subtitle` | `string?` | One line, `text-title` bold |
| `body` | `string?` | Up to two sentences, `max-w-sm`, `steam-300` |
| `cta` | `ReactNode?` | Usually `<Button href size="lg" arrow>` |
| `image` | `{ src, alt }` | Square cut-out cup on a dark ground |

## Type

The title is `text-display` (48px) on mobile and `md:text-hero` (72px) from `md`, weight 800 with −3% tracking. Don't use a trailing ellipsis. The reference's "Enjoy Your Coffee...." becomes "Enjoy your coffee".

## Layout

- Below `md`: a single column, text first, then the image at up to 34rem.
- From `md`: `grid-cols-[1fr_1.1fr]`, vertically centered, with a minimum height of 34rem.
- A radial `roast-600` glow sits behind the image at 70% opacity.

## Motion (one of the two motion moments)

| Element | Animation | Reduced motion |
|---|---|---|
| Cup image | `animate-pour-in`: rises 16px and turns from −6° to 0° over 900ms, `ease-pour`, once | Shown in place |
| Steam | Three blurred `foam-50/25` plumes, `animate-steam` looping every 3.2s, staggered by 0.8s | Hidden |

## Performance

The image uses `preload`, which replaces the `priority` prop deprecated in Next 16. Set `sizes="(min-width: 768px) 34rem, 90vw"`. This is the only preloaded image on the page.

## Example

```tsx
<Hero
  title="Enjoy your coffee"
  subtitle="Before your first meeting"
  body="Small-batch roasts, pulled fresh every morning."
  cta={<Button href="/menu" size="lg" arrow>Order now</Button>}
  image={{ src: heroCup, alt: "Espresso in a white cup, seen from above" }}
/>
```
