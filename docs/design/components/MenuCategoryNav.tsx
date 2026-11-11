"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";

/**
 * MenuCategoryNav — sticky row of in-page links to menu categories.
 * Highlights the category currently in view. See specs/menu-category-nav.md
 *
 * Each target section needs `id={category.id}` and a scroll margin
 * (`scroll-mt-36`) so its heading clears the sticky header and this bar.
 */
export function MenuCategoryNav({ categories }: { categories: { id: string; name: string }[] }) {
  const [active, setActive] = useState(categories[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = categories
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    // A section is "current" when it crosses a band just below the sticky bars.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [categories]);

  // Keep the active pill visible when the row scrolls sideways on small screens.
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    if (!list || !link) return;
    const left = link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left, behavior: reduce ? "auto" : "smooth" });
  }, [active]);

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-18 z-30 border-b border-roast-700/60 bg-roast-950/90 backdrop-blur-md"
    >
      <ul
        ref={listRef}
        className="mx-auto flex w-full max-w-site gap-2 overflow-x-auto px-gutter py-3 [scrollbar-width:none] sm:px-8 lg:px-12"
      >
        {categories.map((c) => (
          <li key={c.id} className="shrink-0">
            <a
              href={`#${c.id}`}
              aria-current={c.id === active ? "location" : undefined}
              onClick={() => setActive(c.id)}
              className={cn(
                "inline-flex h-10 items-center rounded-full border px-4 text-caption font-medium whitespace-nowrap transition-colors duration-150 ease-settle",
                c.id === active
                  ? "border-crema-500 bg-crema-500 text-ink"
                  : "border-foam-50/20 text-foam-100 hover:border-crema-400 hover:text-crema-300",
              )}
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
