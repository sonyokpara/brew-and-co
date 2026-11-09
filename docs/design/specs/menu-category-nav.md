# MenuCategoryNav

**Source:** [`components/MenuCategoryNav.tsx`](../components/MenuCategoryNav.tsx) · Client Component

A sticky row of links that jump to each menu category, with the category currently in view highlighted. It's what makes the menu page feel like flipping through a real menu.

## Props

| Prop | Type |
|---|---|
| `categories` | `{ id: string; name: string }[]` |

Each target needs a matching `<section id={id}>` with `scroll-mt-36`, so its heading lands below the sticky header (72px) and this bar.

## Visual

- Sticks under the header (`top-18`), on `roast-950/90` with `backdrop-blur-md` and a `roast-700/60` bottom border.
- Links are 40px pills in `text-caption` medium. The active one is filled `crema-500` with `ink` text; it marks the current location, which is an allowed crema use. The others have a `foam-50/20` border and turn crema on hover.
- On small screens the row scrolls sideways (scrollbar hidden), and the active pill is scrolled into the middle.

## Behavior

- An IntersectionObserver marks a section active when it crosses a band just below the sticky bars.
- Clicking a link sets it active straight away. Native anchor jumps do the scrolling, so reduced-motion users get instant jumps.
- The active link has `aria-current="location"`. The bar is a `<nav aria-label="Menu categories">`.
