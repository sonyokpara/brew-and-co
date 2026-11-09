import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./logo";

export type FooterColumn = { title: string; links: { label: string; href: string }[] };
export type SocialLink = { label: string; href: string; icon: ReactNode };

/** SiteFooter — see specs/site-footer.md */
export function SiteFooter({
  tagline,
  columns,
  social,
  copyright,
}: {
  tagline: string;
  /** e.g. "© 2026 Brew & Co." — passed in so the footer stays static under cacheComponents. */
  copyright: string;
  columns: FooterColumn[];
  social: SocialLink[];
}) {
  return (
    <footer className="mt-section border-t border-roast-700 bg-roast-950">
      <div className="mx-auto grid w-full max-w-site gap-12 px-gutter py-16 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)] lg:px-8">
        <div>
          <Logo size="lg" />
          <p className="mt-4 max-w-[14rem] text-caption text-steam-300">{tagline}</p>
        </div>

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
          <ul className="mt-4 flex gap-2 md:flex-col">
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
