/**
 * Today's date, weekday and the current minute in Kumasi.
 * Kumasi is on GMT all year (no daylight saving), so UTC is shop time.
 */
export function shopNow() {
  const now = new Date();
  return {
    today: now.toISOString().slice(0, 10),
    weekday: now.getUTCDay(),
    minutes: now.getUTCHours() * 60 + now.getUTCMinutes(),
  };
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** 960 → "16:00" */
export const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
