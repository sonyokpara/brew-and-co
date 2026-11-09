import Image, { type StaticImageData } from "next/image";
import { Badge } from "./Badge";
import { menuBadgeTone, type MenuItemBadge } from "./MenuItemCard";
import { formatPrice } from "./Price";

/**
 * MenuItemRow — one entry on the menu page, set like a printed café menu:
 * thumbnail, name, dotted leader, price, then the description.
 * Render inside a <ul>. See specs/menu-item-row.md
 */
export function MenuItemRow({
  name,
  description,
  price,
  currency,
  badge,
  image,
}: {
  name: string;
  description: string;
  price: number;
  currency: string;
  badge?: MenuItemBadge;
  image: { src: string | StaticImageData; alt: string };
}) {
  return (
    <li className="grid grid-cols-[5rem_1fr] gap-4 sm:grid-cols-[6.5rem_1fr] sm:gap-5">
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
        {badge && (
          <ul aria-label="Tags" className="mt-3 flex">
            <li>
              <Badge tone={menuBadgeTone(badge)}>{badge}</Badge>
            </li>
          </ul>
        )}
      </div>
    </li>
  );
}
