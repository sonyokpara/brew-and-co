import Image, { type StaticImageData } from "next/image";
import { Clock } from "./icons";

/**
 * EventCard — one upcoming event: date block, title, time, description,
 * photo. Editorial content, so it uses the neutral roast surface like
 * BlogCard. See specs/event-card.md
 */
export function EventCard({
  title,
  description,
  start,
  end,
  timeZone = "UTC",
  image,
}: {
  title: string;
  description: string;
  /** ISO date-time strings. */
  start: string;
  end: string;
  /** IANA zone the times are shown in, e.g. "Africa/Accra". */
  timeZone?: string;
  image: { src: string | StaticImageData; alt: string };
}) {
  const s = new Date(start);
  const e = new Date(end);
  const part = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("en-GB", { timeZone, ...opts }).format(s);
  const time = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit" })
      .format(d)
      .replace(":00", "")
      .replace(" ", "")
      .toLowerCase();

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-roast-700 bg-roast-900 sm:flex-row">
      <div className="relative aspect-[16/9] sm:aspect-auto sm:w-2/5 sm:shrink-0">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 14rem, (min-width: 640px) 40vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-1 gap-4 p-5">
        <time
          dateTime={start}
          className="flex h-fit w-16 shrink-0 flex-col items-center rounded-tile border border-espresso-600 bg-espresso-800 py-2 text-center"
        >
          <span className="text-micro text-steam-300">{part({ weekday: "short" })}</span>
          <span className="font-display text-heading leading-none font-bold text-foam-50 tabular-nums">
            {part({ day: "numeric" })}
          </span>
          <span className="text-micro text-steam-300">{part({ month: "short" })}</span>
        </time>
        <div className="min-w-0">
          <h3 className="text-title-sm font-bold text-foam-50">{title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-caption text-steam-300">
            <Clock size={16} />
            <span>
              {time(s)}–{time(e)}
            </span>
          </p>
          <p className="mt-2 text-caption text-steam-300">{description}</p>
        </div>
      </div>
    </article>
  );
}
