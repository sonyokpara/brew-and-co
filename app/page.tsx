import {
  Button,
  Container,
  EventCard,
  FeatureItem,
  Hero,
  Icons,
  MenuItemCard,
  ReservationDialog,
  Section,
  SectionHeading,
} from "@/docs/design/components";
import { getUpcomingEvents } from "@/lib/events";
import { getFeaturedItems } from "@/lib/menu";
import { openingHoursDisplay, reservationOptions, site } from "@/lib/site";
import { reserveTable } from "./actions/reserve";

const reserve = (props: { size?: "md" | "lg"; variant?: "primary" | "outline" }) => (
  <ReservationDialog
    reserve={reserveTable}
    options={reservationOptions}
    timeZone={site.timeZone}
    bookingWindowDays={site.bookingWindowDays}
    {...props}
  />
);

export default async function Home() {
  const [featured, events] = await Promise.all([getFeaturedItems(6), getUpcomingEvents(4)]);

  return (
    <>
      <Hero
        variant="background"
        title="Late coffee in the heart of Kumasi"
        body="Specialty coffee, fresh pastries and light lunches in Adum. Open until midnight on Fridays and Saturdays."
        cta={
          <>
            {reserve({ size: "lg" })}
            <Button href="/menu" variant="outline" size="lg">
              See the menu
            </Button>
          </>
        }
        image={{
          src: "/images/home/hero.jpg",
          alt: "A desk lamp lighting brewing gear and a handwritten espresso menu on a coffee bar at night",
        }}
      />

      <Section tone="alt" aria-labelledby="popular">
        <Container>
          <SectionHeading
            id="popular"
            title="Most loved on the menu"
            description="The drinks and bakes our regulars come back for."
            action={
              <Button href="/menu" variant="link" arrow>
                See the full menu
              </Button>
            }
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((item) => (
              <MenuItemCard
                key={item.slug}
                name={item.name}
                description={item.description}
                price={item.price}
                currency={site.currency}
                badge={item.badge}
                image={{ src: item.image, alt: item.imageAlt }}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="events-title" id="events" className="scroll-mt-18">
        <Container>
          <SectionHeading
            id="events-title"
            title="What's on"
            description="Open mic every Friday evening and a coffee tasting every Saturday morning. Both are free. Reserve a table to be sure of a seat."
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((e) => (
              <EventCard
                key={e.key}
                title={e.title}
                description={e.description}
                start={e.start}
                end={e.end}
                timeZone={site.timeZone}
                image={{ src: e.image, alt: e.imageAlt }}
              />
            ))}
          </div>
          <div className="mt-10">{reserve({ size: "md" })}</div>
        </Container>
      </Section>

      <Section tone="alt" aria-labelledby="visit">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div>
            <SectionHeading
              id="visit"
              title="Come and stay a while"
              description="Pull up a chair from first espresso to last orders."
            />
            <div className="flex flex-col gap-8">
              <FeatureItem icon={<Icons.Cup />} title="Specialty coffee">
                A house blend roasted weekly, single origins on rotation, and baristas happy to talk you
                through them.
              </FeatureItem>
              <FeatureItem icon={<Icons.Flame />} title="Fresh pastries">
                Croissants, buns and muffins baked before sunrise. The almond croissants go first.
              </FeatureItem>
              <FeatureItem icon={<Icons.Leaf />} title="Light lunches">
                Sandwiches made to order on our own bread, served until 4pm.
              </FeatureItem>
            </div>
          </div>

          <div className="rounded-card border border-espresso-600 bg-(image:--bg-card) p-6 shadow-card sm:p-8">
            <h3 className="text-title font-bold text-foam-50">Visit us</h3>
            <address className="mt-4 text-body text-steam-300 not-italic">
              {site.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={site.phone.href} className="mt-2 block text-foam-50 transition-colors duration-150 ease-settle hover:text-crema-300">
                {site.phone.display}
              </a>
            </address>
            <h4 className="mt-6 text-caption font-semibold text-foam-50">Opening hours</h4>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-body">
              {openingHoursDisplay.map((h) => (
                <div key={h.days} className="contents">
                  <dt className="text-steam-300">{h.days}</dt>
                  <dd className="text-foam-50 tabular-nums">{h.hours}</dd>
                </div>
              ))}
            </dl>
            <Button href={site.mapHref} variant="outline" className="mt-8" target="_blank" rel="noopener noreferrer">
              Get directions
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
