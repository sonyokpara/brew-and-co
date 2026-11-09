"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { TestimonialCard, type Testimonial } from "./TestimonialCard";

/**
 * TestimonialCarousel — scroll-snap track with page dots.
 * Native scrolling does the work; JS only syncs the dots. No autoplay.
 */
export function TestimonialCarousel({
  items,
  label = "Customer reviews",
}: {
  items: Testimonial[];
  label?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [pages, setPages] = useState(1);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const p = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(p);
    setActive(Math.min(p - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    el.addEventListener("scroll", measure, { passive: true });
    return () => {
      ro.disconnect();
      el.removeEventListener("scroll", measure);
    };
  }, [measure]);

  const goTo = (i: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: i * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <ul
        ref={track}
        tabIndex={0}
        className="-mx-gutter flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-px-gutter px-gutter pb-2 [scrollbar-width:none] sm:mx-0 sm:px-0"
      >
        {items.map((t) => (
          <li
            key={t.id}
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <TestimonialCard t={t} />
          </li>
        ))}
      </ul>

      {pages > 1 && (
        <div className="mt-8 flex justify-center gap-1">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show reviews page ${i + 1} of ${pages}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => goTo(i)}
              className="grid size-6 place-items-center rounded-full"
            >
              <span
                className={cn(
                  "block h-2.5 rounded-full transition-all duration-240 ease-settle",
                  i === active ? "w-6 bg-crema-500" : "w-2.5 bg-foam-50/40 hover:bg-foam-50/70",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
