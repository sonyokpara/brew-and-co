# PageHeader

**Source:** [`components/PageHeader.tsx`](../components/PageHeader.tsx) · Server Component

The opening block of an inner page (About, Menu). It holds the page's only `<h1>`, an intro paragraph, and optional supporting content such as opening hours or buttons.

| Prop | Type | Notes |
|---|---|---|
| `title` | `ReactNode` | `text-display`, then `md:text-display-lg`, extra-bold, balanced |
| `kicker` | `string?` | Sentence-case crema lead-in. Use only when it adds meaning |
| `intro` | `ReactNode?` | `text-lead` `steam-300`, `max-w-prose` |
| `children` | `ReactNode?` | Supporting content, 32px below the intro |

## Visual

Left-aligned inside `Container`, padded 64px (96px from `md`), with a faint `roast-600` glow from the top left and a `roast-700` bottom border. It's quieter than `Hero` on purpose: inner pages have no motion moment.
