# EventCard

**Source:** [`components/EventCard.tsx`](../components/EventCard.tsx) · Server Component

An upcoming event: a photo, a date block, the title, the time and a short description. Events are information, not products, so the card uses the neutral `roast-900` surface like `BlogCard`.

## Anatomy

```
┌──────────────┬───────────────────────────────────────┐
│              │ ┌─────┐  Open mic night                │
│    photo     │ │ Fri │  ◷ 7–10pm                      │
│  (40% wide)  │ │ 14  │  Poets, singers and first-     │
│              │ │ Nov │  timers share the corner stage…│
│              │ └─────┘                                │
└──────────────┴───────────────────────────────────────┘
```

Below `sm` the photo sits on top at 16:9.

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `string` | |
| `description` | `string` | One or two sentences |
| `start`, `end` | ISO `string` | |
| `timeZone` | `string` | Default `"UTC"`. Brew & Co. passes `"Africa/Accra"` |
| `image` | `{ src, alt }` | |

## Date block

A `<time dateTime={start}>` in a 64px-wide `espresso-800` tile with an `espresso-600` border. The weekday and month are `text-micro` `steam-300`, and the day is `text-heading` bold foam with `tabular-nums`. The day deliberately overrides the token line height with `leading-none`, so the three lines stack tightly inside the tile. This is the one sanctioned line-height override. It isn't crema, because a date isn't an action or a price.

Times are formatted with `Intl` in the given zone, dropping ":00" on the hour ("7–10pm"). Dates arrive as props, so the card never reads the clock during render.

## Layout

`grid gap-6 lg:grid-cols-2`, usually four cards: the next two weeks of Fridays and Saturdays.
