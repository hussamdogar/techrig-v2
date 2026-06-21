/**
 * The icon system. Single-line, 2px stroke, 24px grid, round caps/joins, drawn
 * in currentColor so a parent can tint them (design-system §6). All icons are
 * decorative by default (aria-hidden); a meaningful icon should be given a label
 * by its consumer. No icon fonts, no raster: inline SVG keeps the chrome light.
 */
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Utility + compliance marks ------------------------------------------------ */

// Filing / document: the Compliance silo mark.
export const FilingIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 3h7l5 5v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M13 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </Svg>
);

// Shield: compliance / protection.
export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
    <path d="m9 11 2 2 4-4" />
  </Svg>
);

// Stamp: an approved filing.
export const StampIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 9a3 3 0 1 1 6 0c0 2-1.5 2.5-1.5 4h-3C10.5 11 9 10.5 9 9Z" />
    <path d="M5 19h14" />
    <path d="M7 19v-2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2" />
  </Svg>
);

// Clock: the 21-day federal protest period (a fixed step, not a countdown).
export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Svg>
);

// Check seal: authority active / step complete.
export const CheckSealIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12 3 3 5-6" />
  </Svg>
);

// Map pin / route node.
export const RouteNodeIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

// Generic trailer mark for the Dispatch silo trigger (distinct from the
// specific trailer icons used per page).
export const TrailerNavIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 6h11v9H2z" />
    <path d="M13 9h4l3 3v3h-7z" />
    <circle cx="6" cy="17" r="1.6" />
    <circle cx="17" cy="17" r="1.6" />
  </Svg>
);

/* Trailer set: one distinct line icon per dispatch type (design-system §6) ---
   Shared side-profile language; the body shape is what distinguishes each. */

export const BoxTruckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 6h11v9H2z" />
    <path d="M13 9h4l3 3v3h-7z" />
    <circle cx="6" cy="17" r="1.6" />
    <circle cx="17" cy="17" r="1.6" />
  </Svg>
);

export const DryVanIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 7h12v8H2z" />
    <path d="M14 10h3l3 3v2h-6z" />
    <circle cx="6" cy="17" r="1.5" />
    <circle cx="11" cy="17" r="1.5" />
    <circle cx="17" cy="17" r="1.5" />
  </Svg>
);

export const ReeferIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 7h12v8H2z" />
    <path d="M14 10h3l3 3v2h-6z" />
    <path d="M3 7V5h3v2" />
    <circle cx="6" cy="17" r="1.5" />
    <circle cx="11" cy="17" r="1.5" />
    <circle cx="17" cy="17" r="1.5" />
  </Svg>
);

export const FlatbedIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 13h12v2" />
    <path d="M2 13v-1" />
    <path d="M14 9h3l3 3v3h-6z" />
    <circle cx="6" cy="17" r="1.5" />
    <circle cx="11" cy="17" r="1.5" />
    <circle cx="17" cy="17" r="1.5" />
  </Svg>
);

export const PowerOnlyIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 8h6v7H4z" />
    <path d="M10 11h3l2 2v2h-5z" />
    <path d="M15 15h4" />
    <circle cx="7" cy="17" r="1.6" />
    <circle cx="16" cy="17" r="1.6" />
  </Svg>
);

export const HotShotIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2 9h5v5H2z" />
    <path d="M9 14h11v-2H9l-2-2" />
    <circle cx="5" cy="16" r="1.4" />
    <circle cx="13" cy="16" r="1.4" />
    <circle cx="17" cy="16" r="1.4" />
  </Svg>
);

/* Registry: lets data files reference an icon by name (see lib/services.ts). */
export const icons = {
  filing: FilingIcon,
  shield: ShieldIcon,
  stamp: StampIcon,
  clock: ClockIcon,
  checkSeal: CheckSealIcon,
  routeNode: RouteNodeIcon,
  phone: PhoneIcon,
  boxTruck: BoxTruckIcon,
  dryVan: DryVanIcon,
  reefer: ReeferIcon,
  flatbed: FlatbedIcon,
  powerOnly: PowerOnlyIcon,
  hotShot: HotShotIcon,
} as const;

export type IconName = keyof typeof icons;
