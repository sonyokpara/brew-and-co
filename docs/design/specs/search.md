# SearchDialog

**Source:** [`components/SearchDialog.tsx`](../components/SearchDialog.tsx), [`components/HashHighlight.tsx`](../components/HashHighlight.tsx) · Client Components

Menu search, opened from the header's search icon or by pressing `/` (or Ctrl/⌘ K) anywhere outside a text field. It reads the catalog from `CartProvider` (see [cart.md](cart.md)), so it needs no props.

```
┌──────────────────────────────────────────────┐
│ (search) latte                           ✕   │
├──────────────────────────────────────────────┤
│ 3 items match                                │
│ [img] Iced matcha latte            [ + Add ] │
│       Cold drinks, GH₵55                     │
└──────────────────────────────────────────────┘
```

- **Panel:** native modal `<dialog>`, top-aligned at 8vh, up to 36rem wide, `rounded-panel`, `bg-roast-900`, `border-espresso-600`. The input is 48px tall in `text-lead` with no box of its own; keyboard focus shows the standard `crema-400` outline.
- **Matching (`searchMenu`):** every word must match. A word starting the name ranks highest, then anywhere in the name, then the category, then the description. A trailing "s" is optional, so "croissants" finds "Butter croissant". At most 8 results.
- **Empty query:** up to 5 badged items under "Popular right now".
- **No results:** "Nothing on the menu matches "pizza"." with a suggestion and a link to the full menu.
- **Rows:** the name is a link to `/menu#slug` whose hit area covers the whole row; the Add button sits above it. Thumbnails are hidden below `sm` so names have room at 320px.
- **Keyboard:** arrow keys move from the input through the results and back. Esc closes.
- **Arriving on the menu:** client navigation doesn't update CSS `:target`, so `highlightMenuItem()` scrolls the row into view and sets `data-highlighted` for 4 seconds: a 2px `crema-500/70` outline, 8px out, fading in over 600ms. `<HashHighlight />` on the menu page does the same for a hash in the URL on arrival. Only rows with `data-menu-item` are highlighted; category anchors scroll as usual.

## Accessibility

- The trigger has `aria-haspopup="dialog"` and `aria-keyshortcuts="/"`.
- The result count ("3 items match", "No items match") is a `role="status"` line, linked to the input with `aria-describedby`.
