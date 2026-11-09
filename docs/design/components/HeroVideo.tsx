"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "./cn";
import { IconButton } from "./IconButton";
import { Pause, Play } from "./icons";

/**
 * HeroVideo — the split hero's looping clip. See specs/hero.md
 *
 * Muted, inline and looping. It starts on its own unless the visitor prefers
 * reduced motion, in which case the poster frame stays until they press play.
 * Because it loops for longer than five seconds, it always has a pause button
 * (WCAG 2.2.2).
 */
export function HeroVideo({
  src,
  poster,
  label,
  className,
}: {
  /** An MP4 at least 1080px wide, ideally under 2MB. */
  src: string;
  /** A still from the clip, shown before it plays and under reduced motion. */
  poster: string;
  /** What the clip shows, read out in place of the video. */
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // play() rejects if the browser blocks autoplay; the poster and play button remain.
    v.play().catch(() => {});
  }, []);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="auto"
        role="img"
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={cn("size-full object-cover", className)}
      />
      <IconButton
        label={playing ? "Pause video" : "Play video"}
        tone="ghost"
        onClick={toggle}
        className="absolute top-[12%] right-[12%] z-10 border border-foam-50/40 bg-roast-950/60 backdrop-blur-sm"
      >
        {playing ? <Pause size={18} /> : <Play size={18} />}
      </IconButton>
    </>
  );
}
