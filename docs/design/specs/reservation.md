# ReservationDialog and ReservationForm

**Source:** [`components/ReservationDialog.tsx`](../components/ReservationDialog.tsx), [`components/ReservationForm.tsx`](../components/ReservationForm.tsx) · Client Components, with a Server Action

A "Reserve a table" button that opens a modal form for name, party size, date and time. It appears in the header (`size="sm"`), in the homepage hero and in the events section.

## ReservationDialog

| Prop | Type | Default | Notes |
|---|---|---|---|
| `reserve` | Server Action `(prev, formData) => Promise<ReservationState>` | | |
| `options` | `ReservationOptions` | | Bookable slots by weekday, max party size, phone |
| `timeZone` | `string` | `"UTC"` | The shop's zone; decides "today" and the time cut-off |
| `bookingWindowDays` | `number` | `60` | |
| `label` | `string` | "Reserve a table" | |
| `size`, `variant` | Button props | `md`, `primary` | Use `outline` when another primary is nearby |

- Uses a native `<dialog>` opened with `showModal()`. The browser provides the focus trap, Esc to close, an inert page behind it, and focus returning to the trigger. Clicking the backdrop also closes it.
- Panel: `rounded-panel`, `border-espresso-600`, `bg-(image:--bg-panel)`, at most 32rem wide. Backdrop: `roast-950/80` with a light blur.
- The clock is read when the dialog opens, never during render, so pages stay static under Cache Components. Each opening remounts the form, which clears any earlier booking.

## ReservationForm

| Field | Control | Rules (checked in the browser and again on the server) |
|---|---|---|
| Name | text, `autocomplete="name"` | 2–80 characters |
| Party size | select, 1 to `maxPartySize` | Hint: "More than 8? Call us on …" |
| Date | `type="date"`, `min` today, `max` today + window | Not in the past, not beyond the window |
| Time | select of 30-minute slots for the chosen weekday | Inside opening hours, last slot 1 hour before close. Today's slots start 30 minutes from now |

- All fields are controlled, so values survive a failed submission (React 19 resets uncontrolled forms after an action).
- Inputs are 44px pills on `roast-800/70` with `[color-scheme:dark]`, so the native date picker is dark too.
- A field's error replaces its hint, in `danger`, linked with `aria-describedby`. The field also gets `aria-invalid` and `border-danger`.
- The `role="status"` line under the button reads "We hold tables for 15 minutes after the booked time." until there's an error to report.

## States and copy

| State | Button | Message |
|---|---|---|
| Idle | Request table | Hold-time note |
| Pending | Requesting…, disabled | unchanged |
| Error | Request table | "Check the highlighted fields and try again." plus per-field errors |
| Success | form is replaced | "Table requested" title, the server's sentence ("Table requested for 4 on Friday 14 November at 7:30pm. We'll see you then, Ama."), and a Done button that closes the dialog |

Error copy states the problem and the fix: "That date has passed. Choose today or a later date."

## Server Action contract

```ts
type ReservationState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<"name" | "partySize" | "date" | "time", string>> }
  | { status: "success"; message: string };
```

The action must re-run every rule; the browser checks are only a convenience. In Brew & Co. it's `app/actions/reserve.ts`, which passes valid requests to `saveReservation()` in `lib/reservations.ts`.
