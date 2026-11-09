import Image from "next/image";
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
        title="Late coffee in the heart of Kumasi"
        subtitle="Open until midnight on Fridays and Saturdays"
        body="Specialty coffee, fresh pastries and light lunches on Prempeh II Street in Adum."
        cta={
          <>
            {reserve({ size: "lg" })}
            <Button href="/menu" variant="outline" size="lg">
              See the menu
            </Button>
          </>
        }
        image={{
          src: "/images/menu/flat-white.jpg",
          alt: "A flat white with rosetta latte art, seen from above on a dark table",
        }}
        accent={{
          src: "/images/menu/butter-croissant.jpg",
          alt: "Two butter croissants catching the light",
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
            description="Free open mic every Friday evening, and a coffee tasting every Saturday morning that's free with any drink. Reserve a table to be sure of a seat."
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

      <Section tone="alt" aria-labelledby="made-here" className="overflow-hidden">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              id="made-here"
              title="Made here, from the roast to the bun"
              description="Almost nothing on the counter arrives ready-made."
            />
            <div className="flex flex-col gap-8">
              <FeatureItem icon={<Icons.Bean />} title="Roasted every week">
                Our house blend pairs a washed Ethiopian with a Colombian. We roast it in small
                batches, so it reaches your cup within days.
              </FeatureItem>
              <FeatureItem icon={<Icons.Flame />} title="Baked before sunrise">
                Yaw lights the ovens at 4am. Croissants, buns and muffins are on the shelf by 7, and
                the almond croissants go first.
              </FeatureItem>
              <FeatureItem icon={<Icons.Cup />} title="Ashanti cocoa in the mocha">
                Dark chocolate made from cocoa grown in the Ashanti Region, including beans from a
                cooperative near Yaw&apos;s grandmother&apos;s farm.
              </FeatureItem>
            </div>
            <Button href="/about" variant="link" arrow className="mt-10">
              Read our story
            </Button>
          </div>
          <div className="relative -mx-4 aspect-[3/2] sm:mx-0 lg:-mr-16 lg:aspect-[4/5] xl:-mr-28">
            <Image
              src="/images/about/roasting.jpg"
              alt="Freshly roasted coffee beans turning in a roaster's cooling tray"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover [mask-image:radial-gradient(closest-side,#000_55%,transparent_100%)]"
            />
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="visit">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-card border border-espresso-600 shadow-card lg:aspect-[5/6]">
            <Image
              src="/images/home/hero.jpg"
              alt="A desk lamp lighting brewing gear and a handwritten espresso menu on our bar at night"
              fill
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="object-cover object-[72%_50%]"
            />
          </div>
          <div>
            <SectionHeading
              id="visit"
              title="Come and stay a while"
              description="Pull up a chair from first espresso to last orders."
            />
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-caption font-semibold text-balance text-foam-50">Find us</h3>
                <address className="mt-2 text-body text-steam-300 not-italic">
                  {site.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                  <a
                    href={site.phone.href}
                    className="mt-2 block text-foam-50 transition-colors duration-150 ease-settle hover:text-crema-300"
                  >
                    {site.phone.display}
                  </a>
                </address>
              </div>
              <div>
                <h3 className="text-caption font-semibold text-balance text-foam-50">Opening hours</h3>
                <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-body">
                  {openingHoursDisplay.map((h) => (
                    <div key={h.days} className="contents">
                      <dt className="text-steam-300">{h.days}</dt>
                      <dd className="text-foam-50 tabular-nums">{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {reserve({ size: "md" })}
              <Button href={site.mapHref} variant="outline" target="_blank" rel="noopener noreferrer">
                Get directions
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
