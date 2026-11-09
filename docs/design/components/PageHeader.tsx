import type { ReactNode } from "react";
import { Container } from "./Container";

/**
 * PageHeader — the opening block of an inner page (About, Menu): the page's
 * <h1>, an intro paragraph and optional supporting content such as hours.
 * See specs/page-header.md
 */
export function PageHeader({
  title,
  kicker,
  intro,
  children,
}: {
  title: ReactNode;
  /** Short sentence-case lead-in in crema. Only when it adds meaning. */
  kicker?: string;
  intro?: ReactNode;
  /** Supporting content under the intro, e.g. opening hours or actions. */
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-roast-700">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_90%_at_15%_0%,var(--color-roast-600)_0%,transparent_70%)] opacity-60"
      />
      <Container className="relative py-16 md:py-24">
        {kicker && <p className="mb-3 text-caption font-medium text-crema-500">{kicker}</p>}
        <h1 className="max-w-3xl font-display text-display font-extrabold text-balance text-foam-50 md:text-display-lg">
          {title}
        </h1>
        {intro && <p className="mt-5 max-w-prose text-lead text-steam-300">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </Container>
    </header>
  );
}
