import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { menuBadgeTone, type MenuItemBadge } from "./MenuItemCard";
import { formatPrice } from "./Price";

/**
 * MenuItemRow — one entry on the menu page, set like a printed café menu:
 * thumbnail, name, dotted leader, price, then the description.
 * Render inside a <ul>. See specs/menu-item-row.md
 */
export function MenuItemRow({
  id,
  name,
  description,
  price,
  currency,
  badge,
  image,
  action,
}: {
  /** Anchor for links from search, e.g. the item slug. */
  id?: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  badge?: MenuItemBadge;
  image: { src: string | StaticImageData; alt: string };
  /** Usually <AddToCartButton />, set under the price. */
  action?: ReactNode;
}) {
  return (
    <li
      id={id}
      data-menu-item={id ? "" : undefined}
      className="grid scroll-mt-40 grid-cols-[5rem_1fr] gap-4 rounded-tile outline-0 outline-offset-8 outline-crema-500/0 transition-[outline-color] duration-600 ease-settle data-highlighted:outline-2 data-highlighted:outline-crema-500/70 sm:grid-cols-[6.5rem_1fr] sm:gap-5"
    >
      <div className="relative aspect-square overflow-hidden rounded-tile border border-espresso-600 bg-roast-900">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 6.5rem, 5rem" className="object-cover" />
      </div>
      <div className="min-w-0 py-1">
        <div className="flex items-baseline gap-2 sm:gap-3">
          <h3 className="min-w-0 text-title-sm font-bold text-balance hyphens-auto text-foam-50">{name}</h3>
          <span aria-hidden className="mb-1.5 min-w-2 flex-1 border-b-2 border-dotted border-steam-500/50 sm:min-w-6" />
          <p className="shrink-0 text-title-sm font-bold text-crema-500 tabular-nums">
            {formatPrice(price, currency)}
          </p>
        </div>
        <p className="mt-1 max-w-prose text-caption text-steam-300">{description}</p>
        {(badge || action) && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            {badge && (
              <ul aria-label="Tags" className="flex">
                <li>
                  <Badge tone={menuBadgeTone(badge)}>{badge}</Badge>
                </li>
              </ul>
            )}
            {action && <div className="ml-auto">{action}</div>}
          </div>
        )}
      </div>
    </li>
  );
}
