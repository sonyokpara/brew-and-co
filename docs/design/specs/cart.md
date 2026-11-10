# Cart and order ahead

**Source:** [`components/CartProvider.tsx`](../components/CartProvider.tsx), [`components/AddToCartButton.tsx`](../components/AddToCartButton.tsx), [`components/QuantityStepper.tsx`](../components/QuantityStepper.tsx), [`components/CartDrawer.tsx`](../components/CartDrawer.tsx) · Client Components, with a Server Action

Customers add menu items, choose a pickup time today, and pay at the counter when they collect. There's no online payment.

## CartProvider and useCart

Wrap the site once in `app/layout.tsx`:

```tsx
<CartProvider catalog={catalog} currency="GHS" maxQuantity={20}>…</CartProvider>
```

- `catalog` is every orderable item (`CatalogItem`: slug, name, category, description, price, image, imageAlt, badge?, availableUntil?), built from `getMenu()`. Search reads it too.
- The cart is `slug → quantity`, saved in `localStorage` under `brewco:cart:v1` and synced across tabs. If storage is blocked, the cart still works for the page view. Items that leave the menu are dropped.
- It's read with `useSyncExternalStore`, so the server renders an empty cart and the saved one appears after hydration without a mismatch. Pages stay static.
- A visually hidden `role="status"` line announces every change: "Flat white added. 3 items in your order."

## AddToCartButton and QuantityStepper

```
[ + Add ]   →   ( −  2  + )
```

- "Add" is an outline button, 40px tall, with a plus icon. Its accessible name is "Add Flat white to your order".
- Once the item is in the order it becomes a stepper: a 40px pill with a `foam-50/40` border and two 40px ghost buttons. The minus reads "Remove Flat white" at 1 and "One less Flat white" above it. Plus stops at `maxQuantity`.
- Focus follows the swap: after "Add" it lands on plus, and after removing the last one it returns to "Add".
- Used on `MenuItemRow` and `MenuItemCard` through their `action` slot, and in search results.

## CartDrawer

The header's cart button and the drawer it opens.

| Prop | Type | Notes |
|---|---|---|
| `placeOrder` | Server Action `(prev, formData) => Promise<OrderState>` | `app/actions/order.ts` |
| `options` | `OrderOptions` | Pickup slots by weekday, opening times, lead time (15 min), time zone. Brew & Co. passes `orderOptions` from `lib/site.ts` |

- **Trigger:** ghost 40px button, "Your order, 3 items", with a crema count bubble above 0 (shows "99+" past 99).
- **Drawer:** a native modal `<dialog>` pinned to the right, full height, up to 28rem wide (full width on phones). `bg-roast-900`, `border-espresso-600` on the left edge. It slides in from the right on open; reduced motion turns that off. Esc, the close button and the backdrop close it.
- **Review step:** each line shows the photo, name, line total, unit price, a stepper and a remove button. Removing a line moves focus to the drawer title. The footer shows the item count and subtotal, then "Choose a pickup time".
- **Details step:** name, phone, pickup time (today only) and optional notes, with "Back to your order" above. Inputs match the reservation form (44px pills on `roast-800/70`, `foam-50/40` border).
- **Success:** a crema check, the order number (e.g. `BC-7KQ2`) in `crema-500`, the server's sentence, the total to pay at pickup, and Done. The cart empties as soon as the server accepts the order.
- **Empty:** "Nothing here yet" with a "Browse the menu" button.

### Pickup times

- 15-minute slots from opening until 15 minutes before closing, starting at least 15 minutes from now. The clock is read when the drawer opens, never during render.
- Items with an earlier serving time (`availableUntil`) cut the list short. Sandwiches stop at 4pm (the category's `availableUntil` in `lib/menu.ts`) and the breakfast sandwich at 11am (the `served_until` column in `data/menu-items.csv`, which wins over the category). The hint says why: "Breakfast sandwich is served until 11am. Remove it to order for later today."
- When no slots are left today, the review step says so and names tomorrow's opening time instead of offering checkout. The cart stays saved.

## Server Action contract

```ts
type OrderState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<"items" | "name" | "phone" | "pickupTime" | "notes", string>> }
  | { status: "success"; reference: string; pickupTime: string; total: number; message: string };
```

The action re-checks everything: each slug is on the menu, quantities are 1–20, the name is 2–80 characters, the phone has 9–15 digits, and the slot exists today, is no more than 5 minutes past, and is before every item's serving time. Prices and the total come from the menu, never from the browser. Valid orders go to `saveOrder()` in `lib/orders.ts`, which only logs for now; connect a database, till or kitchen printer there.
