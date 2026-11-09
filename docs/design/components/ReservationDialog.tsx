"use client";

import { useId, useRef, useState } from "react";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { Close } from "./icons";
import {
  ReservationForm,
  type ReservationOptions,
  type ReservationState,
} from "./ReservationForm";

type OpenContext = { minDate: string; maxDate: string; nowMinutes: number; key: number };

/**
 * ReservationDialog — a "Reserve a table" button that opens a modal
 * <dialog> containing ReservationForm. See specs/reservation.md
 *
 * The native modal dialog provides the focus trap, Esc to close, an inert
 * page behind it and focus return to the trigger.
 */
export function ReservationDialog({
  reserve,
  options,
  timeZone = "UTC",
  bookingWindowDays = 60,
  label = "Reserve a table",
  size = "md",
  variant = "primary",
}: {
  reserve: (prev: ReservationState, formData: FormData) => Promise<ReservationState>;
  options: ReservationOptions;
  /** The shop's IANA time zone; "today" and the time cut-off use it. */
  timeZone?: string;
  bookingWindowDays?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline";
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [ctx, setCtx] = useState<OpenContext | null>(null);
  const titleId = useId();

  function open() {
    // Read the clock here, in an event handler, not during render.
    const now = new Date();
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      })
        .formatToParts(now)
        .map((p) => [p.type, p.value]),
    );
    const minDate = `${parts.year}-${parts.month}-${parts.day}`;
    const max = new Date(`${minDate}T00:00:00Z`);
    max.setUTCDate(max.getUTCDate() + bookingWindowDays);

    setCtx((prev) => ({
      minDate,
      maxDate: max.toISOString().slice(0, 10),
      nowMinutes: Number(parts.hour) * 60 + Number(parts.minute),
      // A fresh key each time resets the form after a previous booking.
      key: (prev?.key ?? 0) + 1,
    }));
    dialogRef.current?.showModal();
  }

  const close = () => dialogRef.current?.close();

  return (
    <>
      <Button variant={variant} size={size} onClick={open} aria-haspopup="dialog">
        {label}
      </Button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        // Clicking the backdrop (the dialog element itself) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-panel border border-espresso-600 bg-(image:--bg-panel) p-0 text-foam-50 shadow-card backdrop:bg-roast-950/80 backdrop:backdrop-blur-sm"
      >
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="font-display text-heading font-bold text-balance text-foam-50">
                Reserve a table
              </h2>
              <p className="mt-1 text-caption text-steam-300">
                Tell us when you&apos;re coming and we&apos;ll keep a seat warm.
              </p>
            </div>
            <IconButton label="Close" tone="ghost" onClick={close} className="-mt-1 -mr-2">
              <Close />
            </IconButton>
          </div>

          {ctx && (
            <ReservationForm
              key={ctx.key}
              reserve={reserve}
              options={options}
              minDate={ctx.minDate}
              maxDate={ctx.maxDate}
              nowMinutes={ctx.nowMinutes}
              onDone={close}
            />
          )}
        </div>
      </dialog>
    </>
  );
}
