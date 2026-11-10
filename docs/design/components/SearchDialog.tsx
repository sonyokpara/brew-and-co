"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { Button } from "./Button";
import { highlightMenuItem } from "./HashHighlight";
import { useCart, type CatalogItem } from "./CartProvider";
import { Close, Search } from "./icons";
import { IconButton } from "./IconButton";
import { formatPrice } from "./Price";

const MAX_RESULTS = 8;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/**
 * Every search word must match somewhere. Name matches outrank category
 * matches, which outrank description matches. "croissants" also finds
 * "croissant".
 */
export function searchMenu(items: CatalogItem[], query: string): CatalogItem[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored = items.flatMap((item) => {
    const name = normalize(item.name);
    const words = name.split(/[^a-z0-9]+/);
    const category = normalize(item.category);
    const description = normalize(item.description);
    let score = 0;
    for (const term of terms) {
      const forms = term.length > 3 && term.endsWith("s") ? [term, term.slice(0, -1)] : [term];
      const best = Math.max(
        ...forms.map((t) =>
          words.some((w) => w.startsWith(t))
            ? 4
            : name.includes(t)
              ? 3
              : category.includes(t)
                ? 2
                : description.includes(t)
                  ? 1
                  : 0,
        ),
      );
      if (best === 0) return [];
      score += best;
    }
    return [{ item, score }];
  });

  return scored
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, MAX_RESULTS)
    .map((s) => s.item);
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));
}

/**
 * SearchDialog — the header's search button and the menu search it opens.
 * Press "/" (or Ctrl/⌘ K) anywhere to open it. See specs/search.md
 */
export function SearchDialog() {
  const { catalog, currency } = useCart();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const id = useId();

  const open = useCallback(() => {
    if (dialogRef.current?.open) return;
    setQuery("");
    dialogRef.current?.showModal();
    inputRef.current?.focus();
  }, []);
  const close = () => dialogRef.current?.close();

  useEffect(() => {
    function onKeyDown(e: globalThis.KeyboardEvent) {
      const shortcut = (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) || (e.key === "k" && (e.ctrlKey || e.metaKey));
      if (!shortcut || isTyping(e.target) || document.querySelector("dialog[open]")) return;
      e.preventDefault();
      open();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const trimmed = deferredQuery.trim();
  const results = trimmed ? searchMenu(catalog, trimmed) : catalog.filter((i) => i.badge).slice(0, 5);

  // Arrow keys move between the input and the result links.
  function onArrowKeys(e: KeyboardEvent) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = Array.from(listRef.current?.querySelectorAll<HTMLAnchorElement>("a[data-result]") ?? []);
    if (links.length === 0) return;
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    e.preventDefault();
    if (e.key === "ArrowDown") links[Math.min(index + 1, links.length - 1)].focus();
    else if (index <= 0) inputRef.current?.focus();
    else links[index - 1].focus();
  }

  return (
    <>
      <IconButton label="Search the menu" tone="ghost" aria-haspopup="dialog" aria-keyshortcuts="/" onClick={open}>
        <Search />
      </IconButton>

      <dialog
        ref={dialogRef}
        aria-label="Search the menu"
        onClick={(e) => e.target === e.currentTarget && close()}
        onKeyDown={onArrowKeys}
        className="mx-auto mt-[8vh] mb-auto max-h-[84dvh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-panel border border-espresso-600 bg-roast-900 p-0 text-foam-50 shadow-card backdrop:bg-roast-950/80 backdrop:backdrop-blur-sm open:flex open:flex-col"
      >
        <div className="flex items-center gap-3 border-b border-roast-700 py-2 pr-2 pl-5">
          <Search className="shrink-0 text-steam-300" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search the menu"
            aria-controls={`${id}-results`}
            aria-describedby={`${id}-count`}
            placeholder="Search drinks, pastries, sandwiches"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 min-w-0 flex-1 rounded-tag bg-transparent text-lead text-foam-50 placeholder:text-steam-500 [&::-webkit-search-cancel-button]:hidden"
          />
          <IconButton label="Close search" tone="ghost" onClick={close}>
            <Close />
          </IconButton>
        </div>

        <div className="overflow-y-auto px-2 py-3">
          <p id={`${id}-count`} role="status" className="px-3 pb-2 text-caption text-steam-300">
            {!trimmed
              ? "Popular right now"
              : results.length === 0
                ? "No items match"
                : `${results.length} ${results.length === 1 ? "item matches" : "items match"}`}
          </p>

          {trimmed && results.length === 0 ? (
            <div className="px-3 pt-2 pb-6">
              <p className="text-body text-foam-50">Nothing on the menu matches &ldquo;{trimmed}&rdquo;.</p>
              <p className="mt-1 text-caption text-steam-300">
                Try a drink, like latte, or a pastry, like croissant.
              </p>
              <Button href="/menu" variant="link" arrow onClick={close} className="mt-4 text-caption underline">
                See the full menu
              </Button>
            </div>
          ) : (
            <ul ref={listRef} id={`${id}-results`} className="flex flex-col">
              {results.map((item) => (
                <li
                  key={item.slug}
                  className="relative grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[3rem_1fr_auto] rounded-card px-3 py-2.5 transition-colors duration-150 ease-settle has-[a:hover]:bg-foam-50/5 has-[a:focus-visible]:bg-foam-50/5"
                >
                  <div className="relative hidden aspect-square overflow-hidden rounded-tile border border-espresso-600 bg-roast-950 sm:block">
                    <Image src={item.image} alt="" fill sizes="3rem" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <Link
                      data-result
                      href={`/menu#${item.slug}`}
                      onClick={(e) => {
                        close();
                        if (pathname === "/menu") {
                          e.preventDefault();
                          highlightMenuItem(item.slug);
                        }
                      }}
                      className="line-clamp-2 text-body font-semibold text-foam-50 outline-none after:absolute after:inset-0 after:rounded-card focus-visible:after:outline-2 focus-visible:after:outline-crema-400"
                    >
                      {item.name}
                    </Link>
                    <p className="text-caption text-steam-300">
                      {item.category}, <span className="tabular-nums">{formatPrice(item.price, currency)}</span>
                    </p>
                  </div>
                  <AddToCartButton slug={item.slug} name={item.name} className="relative z-10" />
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
