import Image from "next/image";

type Props = {
  src?: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

/**
 * Renders a vehicle photo, or an elegant branded placeholder when
 * photography has not been added for the vehicle yet.
 */
export default function VehicleImage({ src, alt, sizes, className = "", priority }: Props) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`relative flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#1c1913_0%,#0a0a0a_75%)] ${className}`}
    >
      <span className="font-display text-5xl tracking-[0.15em] text-gold/70">JA</span>
      <span className="mt-3 text-[9px] tracking-[0.4em] text-sand/70 uppercase">
        Photography in progress
      </span>
      <span className="pointer-events-none absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
    </div>
  );
}
