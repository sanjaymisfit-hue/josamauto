import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";
import { formatKES, formatKm } from "@/lib/format";
import VehicleImage from "@/components/vehicle-image";
import { IconCalendar, IconDrive, IconFuel, IconGauge } from "@/components/icons";

import CompareButton from "@/components/compare-button";

const statusStyles: Record<Vehicle["status"], string> = {
  available: "bg-gold text-black",
  reserved: "bg-ivory text-black",
  "in-transit": "bg-black/70 text-gold ring-1 ring-gold/60",
  sold: "bg-neutral-600 text-ivory",
};

const statusLabel: Record<Vehicle["status"], string> = {
  available: "Available",
  reserved: "Reserved",
  "in-transit": "In Transit",
  sold: "Sold",
};

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const originBadge =
    vehicle.condition === "Locally Used" ? "Locally Used"
      : vehicle.condition === "Brand New" ? "Brand New"
        : `${vehicle.origin === "United Kingdom" ? "UK" : vehicle.origin} Import`;

  return (
    <Link
      href={`/collection/${vehicle.slug}`}
      className="group relative flex h-full flex-col overflow-hidden border border-white/[0.06] bg-onyx transition-colors duration-500 hover:border-gold/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="relative h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
          <VehicleImage
            src={vehicle.images[0]}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <span
          className={`absolute top-4 left-4 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase ${statusStyles[vehicle.status]}`}
        >
          {statusLabel[vehicle.status]}
        </span>
        <span className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-medium tracking-[0.2em] text-ivory uppercase">
          {originBadge}
        </span>
        <CompareButton slug={vehicle.slug} variant="card" />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] tracking-[0.3em] text-sand uppercase">{vehicle.make}</p>
        <h3 className="font-display mt-1.5 text-xl text-ivory">
          {vehicle.model} <span className="text-gold">{vehicle.trim}</span>
        </h3>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs text-sand">
          <div className="flex items-center gap-2">
            <IconCalendar size={13} className="text-gold/70" /> {vehicle.year}
          </div>
          <div className="flex items-center gap-2">
            <IconGauge size={13} className="text-gold/70" /> {formatKm(vehicle.mileageKm)}
          </div>
          <div className="flex items-center gap-2">
            <IconFuel size={13} className="text-gold/70" /> {vehicle.fuel} · {(vehicle.engineCc / 1000).toFixed(1)}L
          </div>
          <div className="flex items-center gap-2">
            <IconDrive size={13} className="text-gold/70" /> {vehicle.drive} · {vehicle.transmission}
          </div>
        </dl>

        <div className="mt-5 flex items-end justify-between border-t hairline pt-4">
          <p className="font-display text-xl text-gold">{formatKES(vehicle.priceKES)}</p>
          <span className="text-[10px] tracking-[0.25em] text-sand uppercase transition-colors group-hover:text-gold">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
