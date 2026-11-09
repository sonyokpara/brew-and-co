import type { Metadata } from "next";
import Image from "next/image";
import {
  Button,
  Container,
  FeatureItem,
  Icons,
  PageHeader,
  ReservationDialog,
  Section,
  SectionHeading,
} from "@/docs/design/components";
import { reservationOptions, site } from "@/lib/site";
import { reserveTable } from "../actions/reserve";

export const metadata: Metadata = {
  title: "About",
  description:
    "How a barista and a pastry chef turned an old print shop in Adum into Kumasi's late-night coffee house.",
};

const founders = [
  {
    name: "Ama Owusu-Ansah",
    role: "Co-founder and head barista",
    image: "/images/about/founder-ama.jpg",
    alt: "Ama Owusu-Ansah smiling behind the counter with a cup of coffee",
    bio: "Ama grew up in Bantama and pulled her first shot at a hotel café in Accra. Six years behind espresso bars in London taught her the craft. What brought her home was missing Kumasi evenings, when nobody is in a hurry to leave.",
  },
  {
    name: "Yaw Darko",
    role: "Co-founder and head baker",
    image: "/images/about/founder-yaw.jpg",
    alt: "Yaw Darko in a baker's hat beside a case of fresh pastries",
    bio: "Yaw grew up near his grandmother's cocoa farm outside Konongo, then spent ten years baking bread in Kumasi hotel kitchens before dawn. He still starts every morning at 4am, laminating the croissant dough by hand.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="Two friends, one late-night idea"
        intro="Brew & Co. started with a trade: Yaw's croissants for Ama's flat whites, every Friday at a Kumasi night market. Seven years on, the trade is still going. It just has a room now."
      />

      <Section aria-labelledby="story">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-[3/2] overflow-hidden rounded-card border border-espresso-600 shadow-card">
            <Image
              src="/images/about/interior.jpg"
              alt="Inside Brew & Co., with rattan lamps hanging over wooden tables and chairs"
              fill
              sizes="(min-width: 1024px) 36rem, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-prose">
            <SectionHeading id="story" title="From a market stall to Prempeh II Street" />
            <div className="flex flex-col gap-4 text-body text-steam-300">
              <p>
                In 2019 Ama ran a coffee cart at the Friday night market in Adum. Yaw&apos;s bread stall
                was next door. By the third week he was swapping pastries for coffee. By the third month
                they were planning a café together on the backs of receipts.
              </p>
              <p>
                In 2021 they took over an old print shop on Prempeh II Street. The ink stains are still in
                the floorboards and the type drawers became our pastry shelves. We kept the doors open
                late, because Kumasi had plenty of places for a drink after dark and almost none for a
                good cup of coffee.
              </p>
              <p>
                Today Ama runs the bar and Yaw runs the oven. The open mic on Friday nights started when a
                regular asked if he could play his guitar in the corner. The Saturday tastings started
                because Ama can&apos;t stop talking about coffee.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="alt" aria-labelledby="founders">
        <Container>
          <SectionHeading id="founders" title="The people behind the counter" />
          <div className="grid gap-10 md:grid-cols-2">
            {founders.map((f) => (
              <figure key={f.name} className="grid gap-6 sm:grid-cols-[12rem_1fr] sm:items-start">
                <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-espresso-600">
                  <Image src={f.image} alt={f.alt} fill sizes="(min-width: 640px) 12rem, 100vw" className="object-cover" />
                </div>
                <figcaption>
                  <h3 className="text-title font-bold text-foam-50">{f.name}</h3>
                  <p className="mt-1 text-caption font-medium text-foam-100">{f.role}</p>
                  <p className="mt-4 text-body text-steam-300">{f.bio}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="cocoa">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose lg:order-2">
            <SectionHeading id="cocoa" title="Why our mocha tastes of Ashanti" />
            <div className="flex flex-col gap-4 text-body text-steam-300">
              <p>
                Ghana grows some of the world&apos;s best cocoa, and most of it leaves the country as beans.
                We make our mocha with dark chocolate from Ashanti-grown cocoa, including beans from the
                cooperative near Yaw&apos;s grandmother&apos;s farm.
              </p>
              <p>
                Our coffee travels further. The house blend pairs a washed Ethiopian with a Colombian, and
                we roast it in small batches every week so it reaches your cup within days, not months.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-espresso-600">
              <Image
                src="/images/about/cocoa.jpg"
                alt="Freshly opened cocoa pods showing the beans inside"
                fill
                sizes="(min-width: 1024px) 18rem, 50vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-card border border-espresso-600">
              <Image
                src="/images/about/roasting.jpg"
                alt="Freshly roasted coffee beans turning in a roaster's cooling tray"
                fill
                sizes="(min-width: 1024px) 18rem, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="alt" aria-labelledby="values">
        <Container>
          <SectionHeading id="values" title="What we care about" align="center" />
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureItem layout="stacked" icon={<Icons.Bean />} title="Roasted weekly">
              Small batches, so every bag and every cup is fresh.
            </FeatureItem>
            <FeatureItem layout="stacked" icon={<Icons.Flame />} title="Baked before sunrise">
              Everything on the pastry shelf was made here that morning.
            </FeatureItem>
            <FeatureItem layout="stacked" icon={<Icons.Clock />} title="Open late">
              Until midnight on weekends, for the city&apos;s night owls.
            </FeatureItem>
            <FeatureItem layout="stacked" icon={<Icons.Recycle />} title="Nothing wasted">
              Grounds go to local gardens and day-old bread to Yaw&apos;s bread pudding.
            </FeatureItem>
          </div>
        </Container>
      </Section>

      <Section aria-labelledby="visit-cta">
        <Container>
          <SectionHeading
            id="visit-cta"
            title="Come and say hello"
            description="Ama will be on the bar and Yaw will probably have flour on his shirt."
            align="center"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <ReservationDialog
              reserve={reserveTable}
              options={reservationOptions}
              timeZone={site.timeZone}
              bookingWindowDays={site.bookingWindowDays}
            />
            <Button href="/menu" variant="outline">
              See the menu
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
