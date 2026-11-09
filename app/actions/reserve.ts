"use server";

import type { ReservationField, ReservationState } from "@/docs/design/components";
import { saveReservation } from "@/lib/reservations";
import { bookingSlots, formatTime, site } from "@/lib/site";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date and the current minute in Kumasi (GMT, no daylight saving). */
function shopNow() {
  const now = new Date();
  return {
    today: now.toISOString().slice(0, 10),
    minutes: now.getUTCHours() * 60 + now.getUTCMinutes(),
  };
}

function addDays(isoDate: string, days: number) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Validate a table request and hand it to saveReservation.
 * Every rule the form applies in the browser is re-checked here.
 */
export async function reserveTable(
  _prev: ReservationState,
  formData: FormData,
): Promise<ReservationState> {
  const name = String(formData.get("name") ?? "").trim();
  const partySizeRaw = String(formData.get("partySize") ?? "");
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");

  const errors: Partial<Record<ReservationField, string>> = {};
  const { today, minutes } = shopNow();

  if (name.length < 2 || name.length > 80) {
    errors.name = "Enter your name so we know who to expect.";
  }

  const partySize = Number(partySizeRaw);
  if (!Number.isInteger(partySize) || partySize < 1 || partySize > site.maxPartySize) {
    errors.partySize = `Choose 1 to ${site.maxPartySize} people. For bigger groups, call us on ${site.phone.display}.`;
  }

  const lastDate = addDays(today, site.bookingWindowDays);
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    errors.date = "Choose a date.";
  } else if (date < today) {
    errors.date = "That date has passed. Choose today or a later date.";
  } else if (date > lastDate) {
    errors.date = `We take bookings up to ${site.bookingWindowDays} days ahead. Choose an earlier date.`;
  }

  if (!errors.date) {
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    const [h, m] = time.split(":").map(Number);
    if (!time) {
      errors.time = "Choose a time.";
    } else if (!bookingSlots(weekday).includes(time)) {
      errors.time = "We can't seat you then. Choose a time from the list.";
    } else if (date === today && h * 60 + m <= minutes + 30) {
      errors.time = "That time is too soon. Choose a later time.";
    }
  } else if (!time) {
    errors.time = "Choose a time.";
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Check the highlighted fields and try again.", fieldErrors: errors };
  }

  await saveReservation({ name, partySize, date, time });

  const when = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T00:00:00Z`));

  return {
    status: "success",
    message: `Table requested for ${partySize} on ${when} at ${formatTime(time)}. We'll see you then, ${name.split(" ")[0]}.`,
  };
}
