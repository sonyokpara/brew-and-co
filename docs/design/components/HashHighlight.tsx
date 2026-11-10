"use client";

import { useEffect } from "react";

const HIGHLIGHT_MS = 4000;
let timer: ReturnType<typeof setTimeout> | undefined;

/**
 * Scroll a menu item into view and mark it with `data-highlighted` for a
 * moment. Client-side navigation doesn't update CSS :target, so search
 * results use this instead.
 */
export function highlightMenuItem(id: string) {
  const el = document.getElementById(id);
  // Only menu items; category anchors scroll the normal way.
  if (!el?.hasAttribute("data-menu-item")) return;
  document.querySelectorAll("[data-highlighted]").forEach((n) => n.removeAttribute("data-highlighted"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.setAttribute("data-highlighted", "");
  history.replaceState(history.state, "", `#${id}`);
  clearTimeout(timer);
  timer = setTimeout(() => el.removeAttribute("data-highlighted"), HIGHLIGHT_MS);
}

/** HashHighlight — on the menu page, highlights the item named in the URL hash on arrival. */
export function HashHighlight() {
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id) highlightMenuItem(id);
  }, []);
  return null;
}
