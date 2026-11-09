"use client";

import { useActionState, useId, useState, type ReactNode } from "react";
import { Button, buttonClasses } from "./Button";
import { cn } from "./cn";

export type ReservationField = "name" | "partySize" | "date" | "time";

export type ReservationState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<ReservationField, string>> }
  | { status: "success"; message: string };

export type ReservationOptions = {
  /** Bookable "HH:MM" slots by weekday (0 = Sunday). */
  slotsByWeekday: Record<number, string[]>;
  maxPartySize: number;
  /** Shown to groups larger than maxPartySize, e.g. "+233 24 555 0142". */
  phone: string;
};

/** "19:30" → "7:30pm" */
function label12h(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""}${h >= 12 ? "pm" : "am"}`;
}

const weekdayOf = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

/**
 * ReservationForm — name, party size, date and time, submitted to a Server
 * Action. See specs/reservation.md
 *
 * `minDate`, `maxDate` and `nowMinutes` come from the caller at open time
 * (never computed during render) so the page can stay static.
 */
export function ReservationForm({
  reserve,
  options,
  minDate,
  maxDate,
  nowMinutes,
  onDone,
}: {
  reserve: (prev: ReservationState, formData: FormData) => Promise<ReservationState>;
  options: ReservationOptions;
  /** "YYYY-MM-DD" in the shop's time zone. */
  minDate: string;
  maxDate: string;
  /** Minutes after midnight, shop time, when the form was opened. */
  nowMinutes: number;
  onDone?: () => void;
}) {
  const [state, formAction, pending] = useActionState(reserve, { status: "idle" });
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const id = useId();

  const slots = date
    ? (options.slotsByWeekday[weekdayOf(date)] ?? []).filter((s) => {
        if (date !== minDate) return true;
        const [h, m] = s.split(":").map(Number);
        return h * 60 + m > nowMinutes + 30;
      })
    : [];

  if (state.status === "success") {
    return (
      <div className="text-center" role="status">
        <p className="text-title font-bold text-foam-50">Table requested</p>
        <p className="mx-auto mt-3 max-w-sm text-body text-steam-300">{state.message}</p>
        {onDone && (
          <Button className="mt-8" onClick={onDone}>
            Done
          </Button>
        )}
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const errId = (f: ReservationField) => `${id}-${f}-error`;
  const fieldClass = (f: ReservationField) =>
    cn(
      "h-11 w-full rounded-full border bg-roast-800/70 px-5 text-body text-foam-50 [color-scheme:dark]",
      "placeholder:text-steam-500 disabled:opacity-45",
      errors[f] ? "border-danger" : "border-foam-50/30",
    );

  const field = (f: ReservationField, label: string, control: ReactNode, hint?: string) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={`${id}-${f}`} className="text-caption font-semibold text-foam-50">
        {label}
      </label>
      {control}
      {errors[f] ? (
        <p id={errId(f)} className="text-micro text-danger">
          {errors[f]}
        </p>
      ) : (
        hint && (
          <p id={errId(f)} className="text-micro text-steam-300">
            {hint}
          </p>
        )
      )}
    </div>
  );

  const a11y = (f: ReservationField) => ({
    id: `${id}-${f}`,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errId(f),
  });

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {field(
        "name",
        "Name",
        <input
          {...a11y("name")}
          name="name"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass("name")}
        />,
      )}

      {field(
        "partySize",
        "Party size",
        <select
          {...a11y("partySize")}
          name="partySize"
          value={partySize}
          onChange={(e) => setPartySize(e.target.value)}
          className={fieldClass("partySize")}
        >
          {Array.from({ length: options.maxPartySize }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? "person" : "people"}
            </option>
          ))}
        </select>,
        `More than ${options.maxPartySize}? Call us on ${options.phone}.`,
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {field(
          "date",
          "Date",
          <input
            {...a11y("date")}
            type="date"
            name="date"
            required
            min={minDate}
            max={maxDate}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            className={fieldClass("date")}
          />,
        )}

        {field(
          "time",
          "Time",
          <select
            {...a11y("time")}
            name="time"
            required
            disabled={!date || slots.length === 0}
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={fieldClass("time")}
          >
            <option value="">
              {!date ? "Choose a date first" : slots.length ? "Choose a time" : "No times left that day"}
            </option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {label12h(s)}
              </option>
            ))}
          </select>,
        )}
      </div>

      <button type="submit" disabled={pending} className={buttonClasses({ className: "mt-2 w-full" })}>
        {pending ? "Requesting…" : "Request table"}
      </button>

      <p role="status" className={cn("min-h-5 text-micro", state.status === "error" ? "text-danger" : "text-steam-300")}>
        {state.status === "error" ? state.message : "We hold tables for 15 minutes after the booked time."}
      </p>
    </form>
  );
}
