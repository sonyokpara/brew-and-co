import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

export type FooterColumn = { title: string; links: { label: string; href: string }[] };
export type SocialLink = { label: string; href: string; icon: ReactNode };
export type FooterVisit = {
  /** Address lines, rendered inside <address>. */
  address: string[];
  hours: { days: string; hours: string }[];
  /** Optional directions link, e.g. a maps URL. */
  mapHref?: string;
};

/** SiteFooter — see specs/site-footer.md */
export function SiteFooter({
  tagline,
  columns,
  social,
  visit,
  copyright,
}: {
  tagline: string;
  /** e.g. "© 2026 Brew & Co." — passed in so the footer stays static under cacheComponents. */
  copyright: string;
  columns: FooterColumn[];
  social: SocialLink[];
  /** Optional "Visit us" column with address and opening hours. */
  visit?: FooterVisit;
}) {
  return (
    <footer className="border-t border-roast-700 bg-roast-950">
      <div className="mx-auto grid w-full max-w-site gap-12 px-gutter py-16 sm:grid-cols-2 sm:px-6 lg:grid-flow-col lg:grid-cols-[1.4fr] lg:auto-cols-fr lg:px-8">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-[14rem] text-caption text-steam-300">{tagline}</p>
        </div>

        {visit && (
          <div>
            <h2 className="text-caption font-semibold text-crema-500">Visit us</h2>
            <address className="mt-4 text-caption text-steam-300 not-italic">
              {visit.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-caption">
              {visit.hours.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="text-steam-300">{h.days}</dt>
                  <dd className="text-foam-50 tabular-nums">{h.hours}</dd>
                </div>
              ))}
            </dl>
            {visit.mapHref && (
              <a
                href={visit.mapHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-caption font-semibold text-crema-500 underline-offset-4 hover:text-crema-300 hover:underline"
              >
                Get directions
              </a>
            )}
          </div>
        )}

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-caption font-semibold text-crema-500">{col.title}</h2>
            <ul className="mt-4 flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-caption text-steam-300 hover:text-foam-50">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-caption font-semibold text-crema-500">Follow us</h2>
          <ul className="mt-4 flex gap-2 lg:flex-col">
            {social.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  aria-label={s.label}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="inline-grid size-10 place-items-center rounded-full text-foam-50 hover:bg-foam-50/10 hover:text-crema-300"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-roast-700">
        <p className="mx-auto max-w-site px-gutter py-6 text-micro text-steam-500 sm:px-6 lg:px-8">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
