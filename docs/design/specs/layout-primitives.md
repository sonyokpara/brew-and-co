# Container, Section and SectionHeading

**Source:** [`components/container.tsx`](../components/container.tsx), [`components/section-heading.tsx`](../components/section-heading.tsx) · Server Components

## Container

The 1200px column (`max-w-site`) with side gutters of 16, 24 and 32px at `base`, `sm` and `lg`. `as` changes the element it renders. Every section's content goes inside one, except full-bleed bands (`StatBand`, `PulseDivider`).

## Section

Sets vertical rhythm: `py-section-sm` (64px) below `md`, `py-section` (96px) above. `tone="alt"` switches to a `roast-900` background for a quiet change between adjacent sections. Always pass `aria-labelledby` pointing at the heading id.

```tsx
<Section aria-labelledby="special">
  <Container>
    <SectionHeading id="special" title="Our special coffee"
      action={<Button href="/coffee" variant="link" arrow>See all</Button>} />
    …
  </Container>
</Section>
```

## SectionHeading

| Prop | Type | Default | Notes |
|---|---|---|---|
| `id` | `string` | | Target for `aria-labelledby` |
| `title` | `ReactNode` | | `text-heading`, then `md:text-heading-lg`, bold |
| `kicker` | `string?` | | Sentence-case lead-in, `text-caption` `crema-500`. Use only when it adds information ("New this season") |
| `description` | `ReactNode?` | | `max-w-prose`, `steam-300` |
| `action` | `ReactNode?` | | Link-variant button, aligned to the title baseline on desktop |
| `align` | `"start" \| "center"` | `"start"` | |
| `ruled` | `boolean` | `false` | Hairlines either side and title in crema. Testimonials only |
| `as` | `"h1" \| "h2" \| "h3"` | `"h2"` | |

- The bottom margin is 40px, or 48px from `md`.
- **Never add a decorative uppercase eyebrow.** The reference's "PREMIUM EXCELLENCE", "OUR COLLECTION" and "WHY CHOOSE US" are intentionally left out.
