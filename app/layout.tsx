import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { Icons, ReservationDialog, SiteFooter, SiteHeader } from "@/docs/design/components";
import { bricolage, yellowtail } from "@/docs/design/tokens/fonts";
import { openingHoursDisplay, reservationOptions, site } from "@/lib/site";
import { reserveTable } from "./actions/reserve";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} · Coffee in Kumasi`, template: `%s · ${site.name}` },
  description: site.description,
};

/** Cached so the footer year doesn't make every route dynamic under cacheComponents. */
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const year = await currentYear();

  return (
    <html lang="en" className={`${bricolage.variable} ${yellowtail.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#content"
          className="sr-only z-50 rounded-full bg-crema-500 px-5 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>

        <SiteHeader
          items={[...site.nav]}
          cta={
            <ReservationDialog
              reserve={reserveTable}
              options={reservationOptions}
              timeZone={site.timeZone}
              bookingWindowDays={site.bookingWindowDays}
              size="sm"
            />
          }
        />

        <main id="content" className="flex-1">
          {children}
        </main>

        <SiteFooter
          tagline={site.tagline}
          visit={{ address: [...site.address], hours: openingHoursDisplay, mapHref: site.mapHref }}
          columns={[
            {
              title: "Explore",
              links: [
                { label: "Home", href: "/" },
                { label: "Menu", href: "/menu" },
                { label: "About us", href: "/about" },
                { label: "What's on", href: "/#events" },
              ],
            },
          ]}
          social={[
            {
              label: "Brew & Co. on Instagram",
              href: site.social.instagram,
              icon: <Icons.Instagram />,
            },
            {
              label: "Brew & Co. on Facebook",
              href: site.social.facebook,
              icon: <Icons.Facebook />,
            },
          ]}
          copyright={`© ${year} ${site.name}`}
        />
      </body>
    </html>
  );
}
