import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { ArrowRight } from "./icons";

/** BlogCard — see specs/blog-card.md */
export function BlogCard({
  title,
  excerpt,
  href,
  date,
  author,
  image,
}: {
  title: string;
  excerpt: string;
  href: string;
  /** ISO date string, e.g. "2026-12-04". */
  date: string;
  author: string;
  image: { src: string | StaticImageData; alt: string };
}) {
  const formatted = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));

  return (
    <article className="group relative flex flex-col rounded-card border border-roast-700 bg-roast-900 p-2 transition-colors duration-240 focus-within:border-crema-500 hover:border-espresso-600">
      <div className="relative aspect-[16/10] overflow-hidden rounded-tile">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-3 pt-4 pb-3">
        <p className="flex flex-wrap gap-x-3 text-micro text-steam-500">
          <time dateTime={date}>{formatted}</time>
          <span>{author}</span>
        </p>
        <h3 className="text-title-sm font-bold text-balance text-foam-50">
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-caption text-steam-300">{excerpt}</p>
        <span
          aria-hidden
          className="mt-auto inline-flex items-center gap-1.5 pt-3 text-caption font-semibold text-crema-500 group-hover:text-crema-300"
        >
          Read article <ArrowRight size={14} />
        </span>
      </div>
    </article>
  );
}
