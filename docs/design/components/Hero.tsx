import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Container } from "./Container";

type Img = { src: string | StaticImageData; alt: string };

/**
 * Hero — see specs/hero.md
 * The page's one orchestrated motion moment: the cup "pours in" and steam
 * rises from it. Everything else on the page stays still until touched.
 */
export function Hero({
  title,
  subtitle,
  body,
  cta,
  image,
}: {
  title: ReactNode;
  subtitle?: string;
  body?: string;
  /** Usually <Button href arrow>. */
  cta?: ReactNode;
  /** Top-down cup shot on a dark ground, square, with edges that fade to roast-950. */
  image: Img;
}) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_40%,var(--color-roast-600)_0%,transparent_70%)] opacity-70"
      />
      <Container className="relative grid min-h-[34rem] items-center gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:py-24">
        <div className="max-w-xl">
          <h1
            id="hero-title"
            className="font-display text-display font-extrabold text-balance text-foam-50 md:text-hero"
          >
            {title}
          </h1>
          {subtitle && <p className="mt-6 text-title font-bold text-foam-50">{subtitle}</p>}
          {body && <p className="mt-3 max-w-sm text-body text-steam-300">{body}</p>}
          {cta && <div className="mt-8">{cta}</div>}
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="(min-width: 768px) 34rem, 90vw"
            className="object-contain motion-safe:animate-pour-in"
          />
          {/* Steam: three soft plumes above the cup's center. */}
          <div aria-hidden className="absolute inset-x-0 top-[22%] flex justify-center gap-6">
            {[0, 0.8, 1.6].map((delay) => (
              <span
                key={delay}
                style={{ animationDelay: `${delay}s` }}
                className="h-16 w-3 rounded-full bg-foam-50/25 blur-md motion-safe:animate-steam motion-reduce:hidden"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
