import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { cn } from "./cn";
import { Container } from "./Container";
import { HeroVideo } from "./HeroVideo";

type Img = { src: string | StaticImageData; alt: string };

/**
 * Hero — see specs/hero.md
 *
 * `split` (default): headline left, and on the right either a looping
 * video or an overhead cup photo, edges faded into the dark, with an
 * optional pastry overlapping it and the signature heartbeat line along the
 * bottom. The art "pours in" and the line draws itself once. A photo also
 * gets rising steam; a video brings its own movement.
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
  video,
  accent,
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
  image?: Img;
  /**
   * split only: a looping, muted clip that replaces `image`. Landscape works;
   * keep the action in the middle third, since the frame is cropped square.
   */
  video?: { src: string; poster: string; label: string };
  /** split only: a smaller second photo (a pastry) overlapping the cup's lower right. */
  accent?: Img;
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

  if (variant === "background" && image) {
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

  // A photo shot on near-black, faded at its edges so it reads as a cut-out on the page.
  const fade = "[mask-image:radial-gradient(closest-side,#000_68%,transparent_100%)]";

  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_75%_at_72%_42%,var(--color-roast-600)_0%,transparent_70%)] opacity-80"
      />
      <Container className="grid min-h-[34rem] items-center gap-6 pt-12 pb-24 md:grid-cols-[1fr_1.1fr] md:gap-10 md:pt-16 md:pb-32">
        {copy}

        <div className="relative mx-auto aspect-square w-full max-w-[24rem] md:max-w-[34rem]">
          {video ? (
            <HeroVideo
              src={video.src}
              poster={video.poster}
              label={video.label}
              className={cn("absolute inset-0 motion-safe:animate-pour-in", fade)}
            />
          ) : image ? (
            <>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                preload
                sizes="(min-width: 768px) 34rem, 24rem"
                className={cn("object-cover motion-safe:animate-pour-in", fade)}
              />
              {/* Steam: three soft plumes above the cup's center. */}
              <div aria-hidden className="absolute inset-x-0 top-[18%] flex justify-center gap-6">
                {[0, 0.8, 1.6].map((delay) => (
                  <span
                    key={delay}
                    style={{ animationDelay: `${delay}s` }}
                    className="h-16 w-3 rounded-full bg-foam-50/25 blur-md motion-safe:animate-steam motion-reduce:hidden"
                  />
                ))}
              </div>
            </>
          ) : null}
          {accent && (
            <div className="absolute -right-2 -bottom-8 aspect-square w-1/2 md:-right-8 md:-bottom-12">
              {/* `lighten` drops the photo's black ground so only the pastry shows over the glow. */}
              <Image
                src={accent.src}
                alt={accent.alt}
                fill
                loading="eager"
                sizes="(min-width: 768px) 17rem, 12rem"
                style={{ animationDelay: "250ms" }}
                className={cn("object-cover mix-blend-lighten motion-safe:animate-pour-in", fade)}
              />
            </div>
          )}
        </div>
      </Container>

      {/* The signature heartbeat: a flat line that kicks twice under the cup, drawn once on load. */}
      <svg
        aria-hidden
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        style={{ animationDelay: "500ms" }}
        className="pointer-events-none absolute inset-x-0 bottom-6 -z-10 h-16 w-full text-foam-50 animate-line-reveal md:bottom-10 md:h-24"
      >
        <path
          d="M0 90 H700 L722 90 L740 40 L760 112 L776 90 H812 L834 90 L852 14 L874 116 L890 90 H1200"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </section>
  );
}
