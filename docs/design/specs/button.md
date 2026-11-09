# Button and IconButton

**Source:** [`components/Button.tsx`](../components/Button.tsx), [`components/IconButton.tsx`](../components/IconButton.tsx) · Server Component (no client JS)

## Button

Renders a Next `<Link>` when `href` is given, otherwise a `<button type="button">`.

### Props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `"primary" \| "outline" \| "link"` | `"primary"` | |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Ignored by `link` |
| `arrow` | `boolean` | `false` | Trailing `ArrowRight`. Only for navigation |
| `href` | `string` | | Switches to `<Link>`; all `Link` props pass through |
| …rest | button or Link props | | `type`, `disabled`, `onClick`, `prefetch`… |

`buttonClasses({ variant, size, className })` returns the same classes for elements that aren't buttons, such as the submit button inside `NewsletterPanel`.

### Variants

| Variant | Rest | Hover | Pressed | Use |
|---|---|---|---|---|
| `primary` | `crema-500` fill, `ink` text | `crema-400` + `shadow-glow` | `crema-600` | The single main action in a view ("Order now", "Get 15% off") |
| `outline` | 1px `foam-50/40` border, foam text | border `crema-400`, text `crema-300` | `foam-50/5` wash | Secondary actions ("View all products") |
| `link` | foam text, no box | `crema-300` + crema underline | | Inline section actions ("See all") |

### Sizes

| Size | Height | Padding x | Text |
|---|---|---|---|
| `sm` | 36px | 16px | `text-caption` |
| `md` | 44px | 24px | `text-body` |
| `lg` | 52px | 32px | `text-lead` |

### States

- **Focus:** global 2px `crema-400` outline with a 3px offset.
- **Disabled:** 45% opacity, no pointer events. On links, use `aria-disabled` rather than `disabled`.
- **Pending:** change the label to the verb in progress ("Subscribing…") and set `disabled`. Don't use spinners inside buttons.

### Rules

- Use at most one `primary` per viewport-height of content.
- Labels are sentence case and verb-first, and say what happens: "Add to cart", not "Submit".
- Only add `arrow` for navigation.

```tsx
<Button href="/menu" size="lg" arrow>Order now</Button>
<Button href="/shop" variant="outline">View all products</Button>
<Button href="/coffee" variant="link" arrow>See all</Button>
```

## IconButton

A round 40px button for actions that only need an icon. `label` is required and becomes the `aria-label`.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (required) | |
| `tone` | `"crema" \| "ghost"` | `"crema"` |

- **`crema`:** filled accent circle. Used for the add-to-cart button on product cards.
- **`ghost`:** transparent, with a `foam-50/10` wash on hover. Used for search, the menu toggle and social links.

```tsx
<IconButton label="Add Salted caramel to cart" type="submit"><Cart size={18} /></IconButton>
```
