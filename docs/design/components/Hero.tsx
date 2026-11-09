import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";
import { Container } from "./Container";

type Img = { src: string | StaticImageData; alt: string };

/**
 * Hero — see specs/hero.md
 *
 * `split` (default): headline left, a cut-out cup right. The cup "pours in"
 * and steam rises from it.
 * `background`: a full-bleed photo behind the headline, darkened on the
 * text side so copy stays readable. The photo settles in once.
 *
 * Either way this is the page's one orchestrated motion moment.
 */
export function Hero({
  title,
  subtitle,
  body,
  cta,
  image,
  variant = "split",
}: {
  title: ReactNode;
  subtitle?: string;
  body?: string;
  /** Usually a primary and an outline <Button>. */
  cta?: ReactNode;
  /**
   * split: square cut-out cup on a dark ground.
   * background: landscape photo (≥ 2400px wide) with a darker left third.
   */
  image: Img;
  variant?: "split" | "background";
}) {
  const copy = (
    <div className="max-w-xl">
      <h1
        id="hero-title"
        className="font-display text-display font-extrabold text-balance text-foam-50 md:text-hero"
      >
        {title}
      </h1>
      {subtitle && <p className="mt-6 text-title font-bold text-foam-50">{subtitle}</p>}
      {body && (
        <p
          className={cn(
            "mt-3 max-w-sm text-body",
            variant === "background" ? "text-foam-100" : "text-steam-300",
          )}
        >
          {body}
        </p>
      )}
      {cta && <div className="mt-8 flex flex-wrap gap-3">{cta}</div>}
    </div>
  );

  if (variant === "background") {
    return (
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover motion-safe:animate-settle-in"
        />
        {/* Darken the text side and fade the bottom edge into the page. Below lg the
            copy spans most of the photo, so the right end stays darker. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-linear-to-r from-roast-950 via-roast-950/80 to-roast-950/70 lg:to-roast-950/20"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-t from-roast-950 to-transparent"
        />
        <Container className="flex min-h-[36rem] items-center py-20 md:min-h-[42rem] md:py-28">
          {copy}
        </Container>
      </section>
    );
  }

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_70%_40%,var(--color-roast-600)_0%,transparent_70%)] opacity-70"
      />
      <Container className="relative grid min-h-[34rem] items-center gap-10 py-16 md:grid-cols-[1fr_1.1fr] md:py-24">
        {copy}

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
