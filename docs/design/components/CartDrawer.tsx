"use client";

import Image from "next/image";
import { useActionState, useId, useRef, useState, type ReactNode } from "react";
import { QuantityStepper } from "./QuantityStepper";
import { Button, buttonClasses } from "./Button";
import { useCart } from "./CartProvider";
import { cn } from "./cn";
import { Cart, Check, ChevronLeft, Close, Trash } from "./icons";
import { IconButton } from "./IconButton";
import { formatPrice } from "./Price";
import { hhmmOf, label12h, minutesOf, shopClock } from "./time";

export type OrderField = "items" | "name" | "phone" | "pickupTime" | "notes";

export type OrderState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors: Partial<Record<OrderField, string>> }
  | { status: "success"; reference: string; pickupTime: string; total: number; message: string };

export type OrderOptions = {
  /** Every pickup "HH:MM" slot by weekday (0 = Sunday), before the lead time is applied. */
  slotsByWeekday: Record<number, string[]>;
  /** Opening time by weekday, e.g. "7am". */
  opensByWeekday: Record<number, string>;
  /** The earliest pickup is this many minutes from now. */
  leadMinutes: number;
  timeZone: string;
};

type PlaceOrder = (prev: OrderState, formData: FormData) => Promise<OrderState>;
type Clock = { weekday: number; minutes: number; key: number };

/**
 * CartDrawer — the header's cart button and the order-ahead drawer it opens:
 * review the order, choose a pickup time today, pay at the counter.
 * See specs/cart.md
 */
export function CartDrawer({ placeOrder, options }: { placeOrder: PlaceOrder; options: OrderOptions }) {
  const { count } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [clock, setClock] = useState<Clock | null>(null);
  const titleId = useId();

  function open() {
    // Read the clock here, in an event handler, not during render.
    const { weekday, minutes } = shopClock(options.timeZone);
    setClock((prev) => ({ weekday, minutes, key: (prev?.key ?? 0) + 1 }));
    dialogRef.current?.showModal();
  }
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        aria-label={`Your order, ${count} ${count === 1 ? "item" : "items"}`}
        className="relative inline-grid size-10 shrink-0 place-items-center rounded-full text-foam-50 transition-colors duration-150 ease-settle hover:bg-foam-50/10 hover:text-crema-300"
      >
        <Cart />
        {count > 0 && (
          <span
            aria-hidden
            className="absolute top-0.5 right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-crema-500 px-1 text-micro leading-none font-bold text-ink tabular-nums"
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClick={(e) => e.target === e.currentTarget && close()}
        className={cn(
          "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-md p-0",
          "border-l border-espresso-600 bg-roast-900 text-foam-50 shadow-card",
          "backdrop:bg-roast-950/70 backdrop:backdrop-blur-sm",
          // Slides in from the right when opened; the global reduced-motion rule turns it off.
          "transition-transform duration-240 ease-pour starting:open:translate-x-full",
        )}
      >
        {clock && (
          <DrawerBody
            key={clock.key}
            clock={clock}
            options={options}
            placeOrder={placeOrder}
            titleId={titleId}
            onClose={close}
          />
        )}
      </dialog>
    </>
  );
}

function DrawerBody({
  clock,
  options,
  placeOrder,
  titleId,
  onClose,
}: {
  clock: Clock;
  options: OrderOptions;
  placeOrder: PlaceOrder;
  titleId: string;
  onClose: () => void;
}) {
  const cart = useCart();
  const [step, setStep] = useState<"review" | "details">("review");
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Clear the cart as soon as the server accepts the order.
  const submit: PlaceOrder = async (prev, formData) => {
    const result = await placeOrder(prev, formData);
    if (result.status === "success") cart.clear();
    return result;
  };
  const [state, formAction, pending] = useActionState(submit, { status: "idle" });

  // Today's pickup slots: after the lead time, before closing and before
  // the kitchen stops serving anything in the order (sandwiches end at 4pm).
  const todaySlots = (options.slotsByWeekday[clock.weekday] ?? []).filter(
    (s) => minutesOf(s) >= clock.minutes + options.leadMinutes,
  );
  const servedUntil = cart.lines
    .filter((l) => l.item.availableUntil !== undefined)
    .sort((a, b) => a.item.availableUntil! - b.item.availableUntil!)[0];
  const slots = servedUntil ? todaySlots.filter((s) => minutesOf(s) < servedUntil.item.availableUntil!) : todaySlots;
  const servedUntilLabel = servedUntil ? label12h(hhmmOf(servedUntil.item.availableUntil!)) : "";
  const closedToday = todaySlots.length === 0;
  const tomorrowOpens = options.opensByWeekday[(clock.weekday + 1) % 7];

  const title =
    state.status === "success" ? "Order placed" : step === "details" ? "Pickup details" : "Your order";

  const header = (
    <div className="flex items-center justify-between gap-4 border-b border-roast-700 px-5 py-4 sm:px-6">
      <h2
        id={titleId}
        ref={titleRef}
        tabIndex={-1}
        className="font-display text-title font-bold text-foam-50 focus:outline-none"
      >
        {title}
      </h2>
      <IconButton label="Close" tone="ghost" onClick={onClose} className="-mr-2">
        <Close />
      </IconButton>
    </div>
  );

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div role="status" className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-crema-500 text-ink">
            <Check size={28} />
          </span>
          <p className="mt-6 text-caption text-steam-300">Your order number</p>
          <p className="text-heading font-bold text-crema-500 tabular-nums">{state.reference}</p>
          <p className="mt-4 max-w-sm text-body text-steam-300">{state.message}</p>
          <p className="mt-6 text-body text-foam-50">
            To pay at pickup:{" "}
            <span className="font-bold tabular-nums">{formatPrice(state.total, cart.currency)}</span>
          </p>
          <Button className="mt-10" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="flex h-full flex-col">
        {header}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full border border-espresso-600 text-steam-300">
            <Cart size={24} />
          </span>
          <p className="mt-6 text-title-sm font-bold text-foam-50">Nothing here yet</p>
          <p className="mt-2 max-w-xs text-body text-steam-300">
            Add drinks and pastries from the menu and we&apos;ll have them ready for you to collect.
          </p>
          <Button href="/menu" className="mt-8" onClick={onClose}>
            Browse the menu
          </Button>
        </div>
      </div>
    );
  }

  const summary = (
    <div className="flex items-baseline justify-between gap-4">
      <p className="text-body text-steam-300">
        {cart.count} {cart.count === 1 ? "item" : "items"}
      </p>
      <p className="text-title-sm font-bold text-foam-50 tabular-nums">{formatPrice(cart.subtotal, cart.currency)}</p>
    </div>
  );

  if (step === "review") {
    return (
      <div className="flex h-full flex-col">
        {header}
        <ul className="flex-1 divide-y divide-roast-700 overflow-y-auto px-5 sm:px-6">
          {cart.lines.map(({ item, quantity }) => (
            <li key={item.slug} className="grid grid-cols-[3.5rem_1fr] gap-4 py-5">
              <div className="relative aspect-square overflow-hidden rounded-tile border border-espresso-600 bg-roast-950">
                <Image src={item.image} alt="" fill sizes="3.5rem" className="object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="min-w-0 text-body font-semibold text-foam-50">{item.name}</h3>
                  <p className="shrink-0 text-body font-semibold text-foam-50 tabular-nums">
                    {formatPrice(item.price * quantity, cart.currency)}
                  </p>
                </div>
                <p className="text-caption text-steam-300 tabular-nums">
                  {formatPrice(item.price, cart.currency)} each
                </p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <QuantityStepper
                    name={item.name}
                    quantity={quantity}
                    max={cart.maxQuantity}
                    onChange={(q) => {
                      cart.setQuantity(item.slug, q);
                      if (q === 0) titleRef.current?.focus();
                    }}
                  />
                  <IconButton
                    label={`Remove ${item.name}`}
                    tone="ghost"
                    className="text-steam-300"
                    onClick={() => {
                      cart.setQuantity(item.slug, 0);
                      titleRef.current?.focus();
                    }}
                  >
                    <Trash size={18} />
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-4 border-t border-roast-700 bg-roast-950/60 px-5 py-5 sm:px-6">
          {summary}
          {closedToday ? (
            <p className="rounded-card border border-espresso-600 bg-espresso-900/60 p-4 text-caption text-foam-100">
              We&apos;ve stopped taking pickup orders for today. We open at {tomorrowOpens} tomorrow, and
              your order stays saved here until then.
            </p>
          ) : (
            <>
              <p className="text-caption text-steam-300">
                Order now, pick up today and pay at the counter when you collect.
              </p>
              <Button className="w-full" onClick={() => setStep("details")}>
                Choose a pickup time
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {header}
      <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
        <button
          type="button"
          onClick={() => setStep("review")}
          className={buttonClasses({ variant: "link", className: "mb-5 gap-1 text-caption" })}
        >
          <ChevronLeft size={16} />
          Back to your order
        </button>
        <div className="mb-6 rounded-card border border-espresso-600 bg-(image:--bg-card) p-4">
          {summary}
          <p className="mt-1 text-caption text-steam-300">Pay at the counter when you collect.</p>
        </div>
        <CheckoutForm
          state={state}
          formAction={formAction}
          pending={pending}
          slots={slots}
          slotHint={
            servedUntil && slots.length < todaySlots.length
              ? `${servedUntil.item.name} is served until ${servedUntilLabel}, so pickup times end before then.`
              : undefined
          }
          noSlotsMessage={
            servedUntil
              ? `${servedUntil.item.name} is served until ${servedUntilLabel}. Remove it to order for later today.`
              : "No pickup times are left today."
          }
          items={JSON.stringify(cart.lines.map((l) => ({ slug: l.item.slug, quantity: l.quantity })))}
        />
      </div>
    </div>
  );
}

function CheckoutForm({
  state,
  formAction,
  pending,
  slots,
  slotHint,
  noSlotsMessage,
  items,
}: {
  state: OrderState;
  formAction: (formData: FormData) => void;
  pending: boolean;
  slots: string[];
  slotHint?: string;
  noSlotsMessage: string;
  items: string;
}) {
  const id = useId();
  // Controlled, so values survive a failed submission (React 19 resets uncontrolled forms).
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");

  const errors = state.status === "error" ? state.fieldErrors : {};
  const errId = (f: OrderField) => `${id}-${f}-error`;
  const fieldClass = (f: OrderField) =>
    cn(
      "w-full border bg-roast-800/70 px-5 text-body text-foam-50 [color-scheme:dark]",
      "placeholder:text-steam-500 disabled:opacity-45",
      errors[f] ? "border-danger" : "border-foam-50/40",
    );
  const a11y = (f: OrderField, hasHint = false) => ({
    id: `${id}-${f}`,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] || hasHint ? errId(f) : undefined,
  });
  const field = (f: OrderField, label: ReactNode, control: ReactNode, hint?: string) => (
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

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="items" value={items} />
      {errors.items && (
        <p className="rounded-card border border-danger/60 p-4 text-caption text-danger">{errors.items}</p>
      )}

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
          className={cn(fieldClass("name"), "h-11 rounded-full")}
        />,
      )}

      {field(
        "phone",
        "Phone",
        <input
          {...a11y("phone", true)}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={cn(fieldClass("phone"), "h-11 rounded-full")}
        />,
        "We'll only call if something's out of stock.",
      )}

      {field(
        "pickupTime",
        "Pickup time today",
        <select
          {...a11y("pickupTime", Boolean(slotHint) || slots.length === 0)}
          name="pickupTime"
          required
          disabled={slots.length === 0}
          value={pickupTime}
          onChange={(e) => setPickupTime(e.target.value)}
          className={cn(fieldClass("pickupTime"), "h-11 rounded-full")}
        >
          <option value="">{slots.length ? "Choose a time" : "No times left today"}</option>
          {slots.map((s) => (
            <option key={s} value={s}>
              {label12h(s)}
            </option>
          ))}
        </select>,
        slots.length === 0 ? noSlotsMessage : slotHint,
      )}

      {field(
        "notes",
        <>
          Notes <span className="font-normal text-steam-300">(optional)</span>
        </>,
        <textarea
          {...a11y("notes", true)}
          name="notes"
          rows={3}
          maxLength={300}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={cn(fieldClass("notes"), "resize-none rounded-card py-3")}
        />,
        "Oat milk, extra hot, no sugar: tell us here.",
      )}

      <button
        type="submit"
        disabled={pending || slots.length === 0}
        className={buttonClasses({ className: "mt-1 w-full" })}
      >
        {pending ? "Placing order…" : "Place order"}
      </button>

      <p
        role="status"
        className={cn("min-h-5 text-micro", state.status === "error" ? "text-danger" : "text-steam-300")}
      >
        {state.status === "error" ? state.message : "No payment now. Pay at the counter when you collect."}
      </p>
    </form>
  );
}
