import Image, { type StaticImageData } from "next/image";
import { Badge } from "./Badge";
import { formatPrice } from "./Price";

export type MenuItemBadge = "Popular" | "House favorite";

/** "House favorite" is the stronger claim, so it gets the solid badge. */
export function menuBadgeTone(badge: MenuItemBadge) {
  return badge === "House favorite" ? "solid" : "outline";
}

/**
 * MenuItemCard — a featured menu item on the homepage. See specs/menu-item-card.md
 * Display only: menu items have no detail page and can't be ordered online,
 * so the card has no link and no hover effect.
 */
export function MenuItemCard({
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
    <article className="flex flex-col overflow-hidden rounded-card border border-espresso-600 bg-(image:--bg-card) shadow-card">
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-tile bg-roast-950">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pt-3 pb-5">
        {badge && (
          <ul aria-label="Tags" className="flex">
            <li>
              <Badge tone={menuBadgeTone(badge)}>{badge}</Badge>
            </li>
          </ul>
        )}
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-title-sm font-bold text-balance text-foam-50">{name}</h3>
          <p className="shrink-0 text-title-sm font-bold text-crema-500 tabular-nums">
            {formatPrice(price, currency)}
          </p>
        </div>
        <p className="line-clamp-2 text-caption text-steam-300">{description}</p>
      </div>
    </article>
  );
}
