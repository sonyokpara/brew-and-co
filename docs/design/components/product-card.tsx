import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Badge } from "./badge";
import { IconButton } from "./button";
import { Cart } from "./icons";
import { Price } from "./price";
import { Rating } from "./rating";

export type Product = {
  id: string;
  name: string;
  /** Second line in crema, e.g. "Flavored coffee". */
  flavor: string;
  href: string;
  image: { src: string | StaticImageData; alt: string };
  tags: { label: string; highlight?: boolean }[];
  rating: number;
  reviewCount: number;
  price: number;
  currency?: string;
};

/**
 * ProductCard — the "Our special coffee" card. See specs/product-card.md
 *
 * `addToCart` is a Server Action. The card stays a Server Component; the
 * button submits a tiny form carrying the product id.
 */
export function ProductCard({
  product,
  addToCart,
}: {
  product: Product;
  addToCart?: (formData: FormData) => void | Promise<void>;
}) {
  const { id, name, flavor, href, image, tags, rating, reviewCount, price, currency } = product;
  const headingId = `product-${id}`;

  return (
    <article
      aria-labelledby={headingId}
      className="group relative flex flex-col overflow-hidden rounded-card border border-espresso-600 bg-(image:--bg-card) shadow-card transition-shadow duration-240 ease-settle focus-within:shadow-glow hover:shadow-glow"
    >
      <div className="relative m-2 aspect-[4/3] overflow-hidden rounded-tile bg-roast-950">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-600 ease-pour group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-3 pb-5">
        <h3 id={headingId} className="text-title-sm leading-tight font-bold text-foam-50">
          {/* Stretched link: the whole card is clickable; the cart button sits above it. */}
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {name}
          </Link>
          <span className="block text-crema-500">{flavor}</span>
        </h3>

        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {tags.map((t) => (
            <li key={t.label}>
              <Badge tone={t.highlight ? "solid" : "outline"}>{t.label}</Badge>
            </li>
          ))}
        </ul>

        <Rating value={rating} count={reviewCount} />

        <div className="mt-auto flex items-end justify-between pt-2">
          <Price amount={price} currency={currency} size="lg" />
          {addToCart && (
            <form action={addToCart} className="relative z-10">
              <input type="hidden" name="productId" value={id} />
              <IconButton type="submit" label={`Add ${name} to cart`}>
                <Cart size={18} />
              </IconButton>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}
