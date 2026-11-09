"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * PulseDivider — the signature moment. See specs/pulse-divider.md
 *
 * A steaming cup sits on a flat line that kicks into a heartbeat — coffee as
 * the thing that keeps the day alive. The line draws itself once, the first
 * time it scrolls into view. With reduced motion it is simply drawn.
 */
export function PulseDivider({
  image,
}: {
  /** Cup photo with transparent background, roughly square. Decorative. */
  image: { src: string | StaticImageData };
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Flat run, two beats, flat run. Viewbox 1200 x 200, baseline y=150.
  const d =
    "M0 150 H560 L590 150 L610 70 L632 190 L650 150 H700 L728 150 L748 30 L772 196 L790 150 H1200";

  return (
    <div aria-hidden className="relative mx-auto my-8 w-full max-w-[90rem] overflow-hidden">
      <div className="relative ml-[4%] w-[clamp(9rem,22vw,17rem)]">
        <Image
          src={image.src}
          alt=""
          width={340}
          height={340}
          className="relative z-10 h-auto w-full"
        />
      </div>
      <svg
        ref={ref}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[8%] h-[40%] w-full text-foam-50"
      >
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
          className={drawn ? "animate-pulse-draw" : "motion-reduce:[stroke-dashoffset:0]"}
        />
      </svg>
    </div>
  );
}
