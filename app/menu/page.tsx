import type { Metadata } from "next";
import {
  AddToCartButton,
  Container,
  HashHighlight,
  MenuCategoryNav,
  MenuItemRow,
  PageHeader,
  ReservationDialog,
  SectionHeading,
} from "@/docs/design/components";
import { getMenu } from "@/lib/menu";
import { openingHoursDisplay, reservationOptions, site } from "@/lib/site";
import { reserveTable } from "../actions/reserve";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Espresso drinks, fresh pastries, sandwiches and cold drinks at Brew & Co. in Adum, Kumasi. Prices in Ghana cedis.",
};

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <>
      <PageHeader
        title="Our menu"
        intro="Everything here is made in-house, from the espresso to the bread. Most drinks can be made with oat milk. Prices are in Ghana cedis. Order ahead and pick up at the counter."
      >
        <dl className="flex flex-wrap gap-x-8 gap-y-2 text-caption">
          {openingHoursDisplay.map((h) => (
            <div key={h.days} className="flex gap-2">
              <dt className="text-steam-300">{h.days}</dt>
              <dd className="text-foam-50 tabular-nums">{h.hours}</dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      <HashHighlight />
      <MenuCategoryNav categories={menu.map((c) => ({ id: c.id, name: c.name }))} />

      <Container className="py-section-sm md:py-section">
        <div className="flex flex-col gap-section-sm md:gap-section">
          {menu.map((category) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-title`}
              className="scroll-mt-36"
            >
              <SectionHeading
                id={`${category.id}-title`}
                title={category.name}
                description={category.intro}
                className="border-b border-roast-700 pb-6"
              />
              <ul className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
                {category.items.map((item) => (
                  <MenuItemRow
                    key={item.slug}
                    id={item.slug}
                    name={item.name}
                    description={item.description}
                    price={item.price}
                    currency={site.currency}
                    badge={item.badge}
                    image={{ src: item.image, alt: item.imageAlt }}
                    action={<AddToCartButton slug={item.slug} name={item.name} />}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section
          aria-labelledby="reserve-cta"
          className="mt-section-sm flex flex-col items-start gap-4 rounded-panel border border-espresso-600 bg-(image:--bg-panel) p-6 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-8 md:mt-section"
        >
          <div>
            <h2 id="reserve-cta" className="text-title font-bold text-balance text-foam-50">
              Staying for a while?
            </h2>
            <p className="mt-1 text-body text-steam-300">
              Reserve a table and we&apos;ll have it ready when you arrive.
            </p>
          </div>
          <ReservationDialog
            reserve={reserveTable}
            options={reservationOptions}
            timeZone={site.timeZone}
            bookingWindowDays={site.bookingWindowDays}
          />
        </section>
      </Container>
    </>
  );
}
