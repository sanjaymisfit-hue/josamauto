"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompare } from "@/lib/compare-context";
import { useVehicles, getVehicleFromList } from "@/lib/vehicles-client";
import VehicleImage from "@/components/vehicle-image";
import { IconClose, IconScale } from "@/components/icons";

export default function CompareFloatingBar() {
    const { selectedSlugs, removeSlug, clearCompare } = useCompare();
    const vehicles = useVehicles();
    const pathname = usePathname();

    if (selectedSlugs.length === 0 || pathname === "/compare") return null;

    const comparedVehicles = selectedSlugs
        .map((slug) => getVehicleFromList(vehicles, slug))
        .filter((v): v is NonNullable<typeof v> => Boolean(v));

    return (
        <aside
            aria-label="Vehicle comparison summary"
            className="fixed inset-x-4 bottom-6 z-40 mx-auto max-w-4xl animate-slide-up rounded-sm border border-gold/40 bg-onyx/95 p-4 shadow-2xl backdrop-blur-md sm:px-6"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <IconScale size={18} />
                    </div>
                    <div>
                        <p className="font-display text-sm text-ivory">
                            Compare Vehicles <span className="text-gold">({comparedVehicles.length}/4)</span>
                        </p>
                        <p className="text-[11px] text-sand">Side-by-side specifications & pricing</p>
                    </div>
                </div>

                {/* Selected vehicle chips */}
                <div className="flex flex-wrap items-center gap-2">
                    {comparedVehicles.map((v) => (
                        <div
                            key={v.slug}
                            className="flex items-center gap-2 border border-white/10 bg-black/80 py-1.5 pr-2.5 pl-2 text-xs text-ivory"
                        >
                            <div className="relative h-6 w-8 shrink-0 overflow-hidden bg-coal">
                                <VehicleImage src={v.images[0]} alt={`${v.make} ${v.model}`} sizes="32px" />
                            </div>
                            <span className="truncate max-w-[110px] font-medium">
                                {v.make} {v.model}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeSlug(v.slug)}
                                aria-label={`Remove ${v.make} ${v.model} from comparison`}
                                className="text-sand transition-colors hover:text-gold"
                            >
                                <IconClose size={13} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t hairline sm:border-0 sm:pt-0">
                    <button
                        type="button"
                        onClick={clearCompare}
                        className="text-[11px] uppercase tracking-wider text-sand hover:text-ivory"
                    >
                        Clear
                    </button>
                    <Link href="/compare" className="btn-gold !py-2.5 !px-5 text-[11px]">
                        Compare Now →
                    </Link>
                </div>
            </div>
        </aside>
    );
}
