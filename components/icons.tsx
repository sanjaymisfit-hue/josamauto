import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, ...props }: IconProps, path: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {path}
    </svg>
  );
}

export const IconFuel = (p: IconProps) =>
  base(p, <>
    <path d="M5 22V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16" />
    <path d="M3 22h12" />
    <path d="M13 9h3a2 2 0 0 1 2 2v6.5a1.5 1.5 0 0 0 3 0V9.83a2 2 0 0 0-.59-1.42L18 6" />
    <path d="M7 8h4" />
  </>);

export const IconGauge = (p: IconProps) =>
  base(p, <>
    <path d="M12 15l3.5-5.5" />
    <path d="M4.5 19a10 10 0 1 1 15 0" />
  </>);

export const IconGear = (p: IconProps) =>
  base(p, <>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" />
  </>);

export const IconDrive = (p: IconProps) =>
  base(p, <>
    <circle cx="7" cy="17" r="2.5" />
    <circle cx="17" cy="17" r="2.5" />
    <path d="M2.5 14l2-5.5A2 2 0 0 1 6.4 7h4.2a2 2 0 0 1 1.6.8L14.5 11H19a2.5 2.5 0 0 1 2.5 2.5V17" />
    <path d="M2.5 14v3" />
  </>);

export const IconCalendar = (p: IconProps) =>
  base(p, <>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </>);

export const IconPin = (p: IconProps) =>
  base(p, <>
    <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </>);

export const IconPhone = (p: IconProps) =>
  base(p, <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />);

export const IconWhatsApp = (p: IconProps) =>
  base(p, <>
    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.5-1.5-2-1.5-1 .7a4.4 4.4 0 0 1-2.2-2.2l.7-1-1.5-2z" />
  </>);

export const IconMail = (p: IconProps) =>
  base(p, <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </>);

export const IconClock = (p: IconProps) =>
  base(p, <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>);

export const IconCheck = (p: IconProps) => base(p, <path d="m4 12.5 5 5L20 6.5" />);

export const IconArrowRight = (p: IconProps) =>
  base(p, <>
    <path d="M4 12h16" />
    <path d="m13 5 7 7-7 7" />
  </>);

export const IconArrowLeft = (p: IconProps) =>
  base(p, <>
    <path d="M20 12H4" />
    <path d="m11 5-7 7 7 7" />
  </>);

export const IconShield = (p: IconProps) =>
  base(p, <>
    <path d="M12 2 4 5.5V11c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5.5z" />
    <path d="m8.5 12 2.5 2.5 4.5-5" />
  </>);

export const IconGlobe = (p: IconProps) =>
  base(p, <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </>);

export const IconCard = (p: IconProps) =>
  base(p, <>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20M6 15h4" />
  </>);

export const IconKey = (p: IconProps) =>
  base(p, <>
    <circle cx="8" cy="14" r="4" />
    <path d="m10.8 11.2 8.2-8.2M17 5l2 2M13 9l2 2" />
  </>);

export const IconSearch = (p: IconProps) =>
  base(p, <>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </>);

export const IconClose = (p: IconProps) =>
  base(p, <>
    <path d="M6 6l12 12M18 6 6 18" />
  </>);

export const IconMenu = (p: IconProps) =>
  base(p, <>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </>);

export const IconExpand = (p: IconProps) =>
  base(p, <>
    <path d="M9 4H4v5M15 4h5v5M9 20H4v-5M15 20h5v-5" />
  </>);

export const IconShip = (p: IconProps) =>
  base(p, <>
    <path d="M3 17h18l-2 4H5z" />
    <path d="M5 17V9l7-4 7 4v8" />
    <path d="M12 5v12" />
  </>);

export const IconScale = (p: IconProps) =>
  base(p, <>
    <path d="m16 16 3-8 3 8a3 3 0 0 1-6 0z" />
    <path d="m2 16 3-8 3 8a3 3 0 0 1-6 0z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h18" />
  </>);

export const IconPlus = (p: IconProps) =>
  base(p, <path d="M12 5v14M5 12h14" />);


