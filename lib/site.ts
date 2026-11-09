/**
 * Shop details in one place. Address, phone and social handles are
 * placeholders for the fictional Brew & Co. — replace before launch.
 */

export const site = {
  name: "Brew & Co.",
  tagline: "Specialty coffee, fresh pastries and late nights in Kumasi.",
  description:
    "A cozy late-night coffee shop in Adum, Kumasi. Specialty coffee, fresh pastries, light lunches, open mic on Fridays and coffee tastings on Saturdays.",
  currency: "GHS",
  /** Kumasi is on GMT all year (no daylight saving). */
  timeZone: "Africa/Accra",
  address: ["14 Prempeh II Street", "Adum, Kumasi", "Ghana"],
  phone: { display: "+233 24 555 0142", href: "tel:+233245550142" },
  mapHref: "https://www.google.com/maps/search/?api=1&query=Adum%2C+Kumasi",
  social: {
    instagram: "https://www.instagram.com/brewandco.kumasi",
    facebook: "https://www.facebook.com/brewandco.kumasi",
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "About", href: "/about" },
  ],
  /** Largest party the online form accepts; bigger groups call. */
  maxPartySize: 8,
  /** How far ahead tables can be requested. */
  bookingWindowDays: 60,
} as const;

/**
 * Opening hours by weekday (0 = Sunday), in minutes after midnight.
 * A close of 1440 means midnight.
 */
export const openingHours: Record<number, { open: number; close: number }> = {
  0: { open: 9 * 60, close: 21 * 60 },
  1: { open: 7 * 60, close: 22 * 60 },
  2: { open: 7 * 60, close: 22 * 60 },
  3: { open: 7 * 60, close: 22 * 60 },
  4: { open: 7 * 60, close: 22 * 60 },
  5: { open: 7 * 60, close: 24 * 60 },
  6: { open: 7 * 60, close: 24 * 60 },
};

/** Grouped for display in the footer and on the menu page. */
export const openingHoursDisplay = [
  { days: "Mon–Thu", hours: "7am–10pm" },
  { days: "Fri–Sat", hours: "7am–midnight" },
  { days: "Sun", hours: "9am–9pm" },
];

/** The last table can be requested this long before closing. */
export const LAST_BOOKING_BEFORE_CLOSE_MIN = 60;
export const BOOKING_SLOT_MIN = 30;

/** Bookable "HH:MM" slots for a weekday. Shared by the form and the server action. */
export function bookingSlots(weekday: number): string[] {
  const h = openingHours[weekday];
  if (!h) return [];
  const slots: string[] = [];
  for (let m = h.open; m <= h.close - LAST_BOOKING_BEFORE_CLOSE_MIN; m += BOOKING_SLOT_MIN) {
    slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
  }
  return slots;
}

/** "19:30" → "7:30pm" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "pm" : "am";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${h12}${suffix}` : `${h12}:${String(m).padStart(2, "0")}${suffix}`;
}
