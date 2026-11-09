# NewsletterPanel

**Source:** [`components/NewsletterPanel.tsx`](../components/NewsletterPanel.tsx) · Client Component, using `useActionState` with a Server Action

The closing call to action before the footer: a large espresso panel with a radial highlight from above, holding a headline, one line of explanation and an inline email form.

## Props

| Prop | Type | Notes |
|---|---|---|
| `title` | `string` | "Ready for a better cup?" |
| `description` | `string` | One sentence on what people get |
| `offer` | `string` | Button label: the action plus the reward ("Get 15% off") |
| `subscribe` | `(prev, formData) => Promise<NewsletterState>` | A `"use server"` action |

```ts
type NewsletterState =
  | { status: "idle" }
  | { status: "success"; message: string }   // "Check your inbox for your 15% code."
  | { status: "error"; message: string };    // "Enter an email like name@example.com."
```

The Server Action **must** validate the email on the server. The input sets `noValidate` so that errors appear in the system's own voice rather than the browser's popup.

## Visual

- The panel is `rounded-panel` (24px) with an `espresso-600` border, `bg-(image:--bg-panel)` and `shadow-card`, padded 56px vertically.
- The input is a 44px pill on `roast-800/70` with a `foam-50/30` border and a `steam-500` placeholder.
- The button is `primary` at `md` size.
- Below `sm`, the input and button stack at full width.

## States

| State | Input | Button | Message line (`role="status"`) |
|---|---|---|---|
| Idle | default | `offer` | "One email a month: new roasts and member offers. Unsubscribe any time." (`steam-300`) |
| Pending | default | "Subscribing…", disabled | unchanged |
| Error | `border-danger`, `aria-invalid` | `offer` | error message in `danger` |
| Success | default | `offer` | success message in `success` |

The message line keeps a fixed minimum height so the layout doesn't jump, and the input points to it with `aria-describedby`.
