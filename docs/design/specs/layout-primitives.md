# Container, Section and SectionHeading

**Source:** [`components/Container.tsx`](../components/Container.tsx), [`components/Section.tsx`](../components/Section.tsx), [`components/SectionHeading.tsx`](../components/SectionHeading.tsx) · Server Components

## Container

The 1200px column (`max-w-site`) with side gutters of 20, 32 and 48px at `base`, `sm` and `lg`. `as` changes the element it renders. Every section's content goes inside one, except full-bleed bands (`StatBand`, `PulseDivider`).

## Section

Sets vertical rhythm: `py-section-sm` (64px) below `md`, `py-section` (96px) above. `tone="alt"` switches to a `roast-900` background for a quiet change between adjacent sections. Always pass `aria-labelledby` pointing at the heading id.

### Consecutive subsections (the Menu page pattern)

Some pages are one long run of sibling subsections on a single surface, like the Menu page's categories. Wrapping each one in `<Section>` would stack two section paddings between them (128–192px). Instead:

- One `<Container className="py-section-sm md:py-section">` holds the whole run.
- Inside it, a `flex flex-col gap-section-sm md:gap-section` wrapper keeps the same 64/96px rhythm *between* subsections.
- Each subsection is a plain `<section id={…} aria-labelledby={…}>` with a `SectionHeading` (here with `border-b border-roast-700 pb-6` to rule off the category) and a `scroll-mt-36` when it's an in-page target.
- A closing panel after the run (the Menu page's "Staying for a while?") is also a `<section aria-labelledby>`, spaced with `mt-section-sm md:mt-section`. It's a full-width panel, so it uses `rounded-panel` and `bg-(image:--bg-panel)`.

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
