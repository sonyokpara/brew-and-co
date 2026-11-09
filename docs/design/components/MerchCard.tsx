import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Price } from "./Price";

/**
 * MerchCard — the "Featured products" tile: a white photo frame on the dark
 * page with plain text underneath. Deliberately quieter than ProductCard.
 * See specs/merch-card.md
 */
export function MerchCard({
  name,
  descriptor,
  price,
  currency,
  href,
  image,
}: {
  name: string;
  descriptor: string;
  price: number;
  currency?: string;
  href: string;
  image: { src: string | StaticImageData; alt: string };
}) {
  return (
    <article className="group relative flex flex-col gap-3">
      <div className="rounded-tile bg-paper p-3 shadow-tile outline-2 outline-offset-4 outline-transparent group-has-[a:focus-visible]:outline-crema-400">
        <div className="relative aspect-square overflow-hidden rounded-md">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 18rem, 50vw"
            className="object-cover transition-transform duration-600 ease-pour group-hover:scale-[1.04]"
          />
        </div>
      </div>
      <div>
        <h3 className="text-body font-semibold text-balance text-foam-50 group-hover:text-crema-300">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {name}
          </Link>
        </h3>
        <p className="text-micro text-steam-300">{descriptor}</p>
        <Price amount={price} currency={currency} className="mt-1" />
      </div>
    </article>
  );
}
