import type { SVGProps } from "react";

/**
 * Inline 24px stroke icons (1.75 stroke, round caps). Decorative by default:
 * pass `aria-hidden={false}` plus a <title> only when the icon stands alone
 * without a text label.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Base({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowRight = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Base>
);
export const Search = (p: IconProps) => (
  <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Base>
);
export const Cart = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
    <circle cx="9" cy="20" r="1.25" /><circle cx="17" cy="20" r="1.25" />
  </Base>
);
export const Plus = (p: IconProps) => (
  <Base {...p}><path d="M12 5v14M5 12h14" /></Base>
);
export const Minus = (p: IconProps) => (
  <Base {...p}><path d="M5 12h14" /></Base>
);
export const Trash = (p: IconProps) => (
  <Base {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></Base>
);
export const Check = (p: IconProps) => (
  <Base {...p}><path d="m5 12 5 5 9-10" /></Base>
);
export const ChevronLeft = (p: IconProps) => (
  <Base {...p}><path d="m15 18-6-6 6-6" /></Base>
);
export const Menu = (p: IconProps) => (
  <Base {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Base>
);
export const Play = (p: IconProps) => (
  <Base {...p}><path d="M8 5.5v13l10-6.5-10-6.5Z" /></Base>
);
export const Pause = (p: IconProps) => (
  <Base {...p}><path d="M9 5.5v13M15 5.5v13" /></Base>
);
export const Close = (p: IconProps) => (
  <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>
);
export const Bean = (p: IconProps) => (
  <Base {...p}>
    <ellipse cx="12" cy="12" rx="6.5" ry="9" transform="rotate(35 12 12)" />
    <path d="M8.5 18.5c2.5-2 1-5 3.5-7s3.5-4.5 3.5-6.5" />
  </Base>
);
export const Flame = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 21a6 6 0 0 0 6-6c0-3.5-2.5-5.5-3.5-8.5-.5 2-1.8 3.2-3 3.5C11 7 10 5 10 3c-3 2.5-4 6.5-4 10a6 6 0 0 0 6 8Z" />
  </Base>
);
export const Cup = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
    <path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3" />
  </Base>
);
export const Leaf = (p: IconProps) => (
  <Base {...p}><path d="M5 19c0-8 5-13 15-14-1 10-6 15-14 15M5 19l7-7" /></Base>
);
export const Clock = (p: IconProps) => (
  <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Base>
);
export const Recycle = (p: IconProps) => (
  <Base {...p}>
    <path d="M7 19H4.5a1.5 1.5 0 0 1-1.3-2.25L5.5 13M17 19h2.5a1.5 1.5 0 0 0 1.3-2.25L18.5 13M9.5 5.5l1.2-2a1.5 1.5 0 0 1 2.6 0l2.2 3.8" />
    <path d="m7 16 0 3 3 0M15.5 4.5l0 3-3 0M18.5 13l-2.8 1.2.2-3" />
  </Base>
);
export const Instagram = (p: IconProps) => (
  <Base {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r=".6" fill="currentColor" />
  </Base>
);
export const Facebook = (p: IconProps) => (
  <Base {...p}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8Z" /></Base>
);
export const Youtube = (p: IconProps) => (
  <Base {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10 9.5 5 2.5-5 2.5v-5Z" fill="currentColor" />
  </Base>
);

/**
 * Star used by <Rating>. `fill` 0–1 renders partial stars by clipping a full
 * star over a dimmed one (no SVG ids, so many can share a page).
 */
const STAR_PATH =
  "m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8L12 2.8Z";

export function Star({ fill = 1, size = 14 }: { fill?: number; size?: number }) {
  const svg = (opacity: number) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden focusable={false} className="block shrink-0">
      <path d={STAR_PATH} fill="currentColor" fillOpacity={opacity} />
    </svg>
  );
  return (
    <span className="relative inline-block" style={{ width: size, height: size }}>
      {svg(0.25)}
      <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
        {svg(1)}
      </span>
    </span>
  );
}
