"use client";

import { useActionState, useId } from "react";
import { buttonClasses } from "./Button";
import { cn } from "./cn";

export type NewsletterState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

/**
 * NewsletterPanel — "Ready for a better cup?" signup. See specs/newsletter-form.md
 *
 * `subscribe` is a Server Action ("use server") with the useActionState
 * signature. It must validate the email server-side and return a state.
 */
export function NewsletterPanel({
  title,
  description,
  offer,
  subscribe,
}: {
  title: string;
  description: string;
  /** Button label — the action plus the reward, e.g. "Get 15% off". */
  offer: string;
  subscribe: (prev: NewsletterState, formData: FormData) => Promise<NewsletterState>;
}) {
  const [state, formAction, pending] = useActionState(subscribe, { status: "idle" });
  const inputId = useId();
  const msgId = useId();
  const headingId = useId();
  const hasError = state.status === "error";

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-site rounded-panel border border-espresso-600 bg-(image:--bg-panel) px-6 py-14 text-center shadow-card sm:px-12"
    >
      <h2 id={headingId} className="font-display text-heading font-bold text-balance text-foam-50 md:text-heading-lg">
        {title}
      </h2>
      <p className="mx-auto mt-3 max-w-md text-body text-steam-300">{description}</p>

      <form action={formAction} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row" noValidate>
        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          id={inputId}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          aria-invalid={hasError || undefined}
          aria-describedby={msgId}
          className={cn(
            "h-11 flex-1 rounded-full border bg-roast-800/70 px-5 text-body text-foam-50 placeholder:text-steam-500",
            hasError ? "border-danger" : "border-foam-50/40",
          )}
        />
        <button type="submit" disabled={pending} className={buttonClasses({ variant: "primary" })}>
          {pending ? "Subscribing…" : offer}
        </button>
      </form>

      <p
        id={msgId}
        role="status"
        className={cn(
          "mt-4 min-h-5 text-micro",
          state.status === "error" && "text-danger",
          state.status === "success" && "text-success",
          state.status === "idle" && "text-steam-300",
        )}
      >
        {state.status === "idle"
          ? "One email a month: new roasts and member offers. Unsubscribe any time."
          : state.message}
      </p>
    </section>
  );
}
