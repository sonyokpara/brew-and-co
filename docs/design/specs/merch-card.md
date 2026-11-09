# MerchCard

**Source:** [`components/MerchCard.tsx`](../components/MerchCard.tsx) · Server Component

The "Featured products" tile for beans, mugs, brewers and gift sets. It's deliberately quieter than `ProductCard`: a white photo frame with plain text underneath and no card body.

## Anatomy

```
┌ paper frame, p-3, rounded-tile, shadow-tile ┐
│ ┌ 1:1 photo, rounded-md ─────────────────┐ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
Ethiopia Guji beans        ← text-body semibold, foam
Floral & bright            ← text-micro, steam-300
$24.99                     ← Price md
```

## Props

| Prop | Type |
|---|---|
| `name` | `string` |
| `descriptor` | `string`, two to four words of tasting notes or material |
| `price`, `currency` | `number`, `string?` |
| `href` | `string` |
| `image` | `{ src, alt }` |

## States

- **Hover:** the photo scales to 1.04 and the name turns `crema-300`.
- **Focus:** the frame gets a 2px `crema-400` outline with a 4px offset (`group-has-[a:focus-visible]`).
- There's one stretched link per tile.

## Layout

`grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4`, followed by a centered `<Button variant="outline" href="/shop">View all products</Button>`.

## Why the white frame

On the dark page, the bright frame reads as a product on a shelf, which sets merch apart from café drinks. Use `paper` here and nowhere else.
