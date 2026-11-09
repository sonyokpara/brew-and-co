import { Container, Section, SectionHeading } from "@/docs/design/components";

export default function Home() {
  return (
    <Section aria-labelledby="home-title">
      <Container>
        <SectionHeading as="h1" id="home-title" title="Brew & Co." description="Homepage coming soon." />
      </Container>
    </Section>
  );
}
