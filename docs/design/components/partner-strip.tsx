import Image, { type StaticImageData } from "next/image";

export type Partner = {
  name: string;
  logo: string | StaticImageData;
  width: number;
  height: number;
  href?: string;
};

/**
 * PartnerStrip — "Featured roasters" logo row. See specs/partner-strip.md
 * Logos are dimmed and desaturated to sit on the dark ground, and come to
 * full strength on hover/focus. Only show partners you have rights to show.
 */
export function PartnerStrip({ partners }: { partners: Partner[] }) {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 md:justify-between">
      {partners.map((p) => {
        const img = (
          <Image
            src={p.logo}
            alt={p.name}
            width={p.width}
            height={p.height}
            className="h-12 w-auto opacity-75 grayscale transition duration-240 group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0"
          />
        );
        return (
          <li key={p.name}>
            {p.href ? (
              <a href={p.href} rel="noopener noreferrer" className="group block rounded-sm">
                {img}
              </a>
            ) : (
              <span className="group block">{img}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
