import Image, { type StaticImageData } from "next/image";
import { Rating } from "./Rating";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  /** e.g. "Regular since 2023" — never a fake job title. */
  context: string;
  rating: number;
  avatar: { src: string | StaticImageData; alt?: string };
};

/** TestimonialCard — see specs/testimonial.md */
export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-4 rounded-card border border-espresso-600 bg-(image:--bg-card) p-6 shadow-card">
      <Rating value={t.rating} />
      <blockquote className="flex-1 text-caption text-foam-100">
        <p>{t.quote}</p>
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-espresso-600 pt-4">
        <Image
          src={t.avatar.src}
          alt={t.avatar.alt ?? ""}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
        <span>
          <span className="block text-caption font-semibold text-foam-50">{t.name}</span>
          <span className="block text-micro text-steam-300">{t.context}</span>
        </span>
      </figcaption>
    </figure>
  );
}
