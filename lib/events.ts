import { cacheLife } from "next/cache";

type RecurringEvent = {
  id: string;
  title: string;
  description: string;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
  /** "HH:MM" local Kumasi time (GMT, no daylight saving) */
  start: string;
  end: string;
  /** Alternated week by week so back-to-back dates don't repeat a photo. */
  images: { src: string; alt: string }[];
};

export type UpcomingEvent = {
  key: string;
  title: string;
  description: string;
  /** ISO strings in UTC, which is Kumasi local time. */
  start: string;
  end: string;
  image: string;
  imageAlt: string;
};

export const recurringEvents: RecurringEvent[] = [
  {
    id: "open-mic",
    title: "Open mic night",
    description:
      "Poets, singers and first-timers share the corner stage. Sign up at the bar from 6:30pm; the coffee bar stays open late.",
    weekday: 5,
    start: "19:00",
    end: "22:00",
    images: [
      {
        src: "/images/home/open-mic.jpg",
        alt: "A singer playing an acoustic guitar under a spotlight on a small stage",
      },
      {
        src: "/images/home/open-mic-singer.jpg",
        alt: "A singer belting into a vintage microphone under warm stage lights",
      },
    ],
  },
  {
    id: "coffee-tasting",
    title: "Saturday coffee tasting",
    description:
      "Taste three single origins side by side with our head barista and learn what makes each one different. Free with any drink.",
    weekday: 6,
    start: "09:00",
    end: "11:00",
    images: [
      {
        src: "/images/home/coffee-tasting.jpg",
        alt: "Cupping bowls of ground coffee and tasting spoons set out on a wooden table",
      },
      {
        src: "/images/home/coffee-cupping.jpg",
        alt: "A barista pouring coffee into a row of cupping bowls at a tasting",
      },
    ],
  },
];

function atTime(day: Date, hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), h, m));
}

/**
 * The next `count` event dates, soonest first. Events that have already
 * ended today are skipped. Cached for an hour, so pages stay static while
 * the list rolls forward on its own.
 */
export async function getUpcomingEvents(count = 4): Promise<UpcomingEvent[]> {
  "use cache";
  cacheLife("hours");

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const upcoming: UpcomingEvent[] = [];

  for (let offset = 0; upcoming.length < count && offset < 7 * count + 7; offset++) {
    const day = new Date(today.getTime() + offset * 86_400_000);
    for (const e of recurringEvents) {
      if (e.weekday !== day.getUTCDay()) continue;
      const end = atTime(day, e.end);
      if (end <= now) continue;
      // Pick by week number, so a given date keeps its photo as the list rolls forward.
      const photo = e.images[Math.floor(day.getTime() / (7 * 86_400_000)) % e.images.length];
      upcoming.push({
        key: `${e.id}-${day.toISOString().slice(0, 10)}`,
        title: e.title,
        description: e.description,
        start: atTime(day, e.start).toISOString(),
        end: end.toISOString(),
        image: photo.src,
        imageAlt: photo.alt,
      });
    }
  }
  return upcoming.slice(0, count);
}
