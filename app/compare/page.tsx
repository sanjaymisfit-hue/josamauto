"use client";

import Link from "next/link";
import { useCompare } from "@/lib/compare-context";
import { useVehicles, getVehicleFromList } from "@/lib/vehicles-client";
import type { Vehicle } from "@/lib/vehicles";
import { formatKES, formatKm } from "@/lib/format";
import { whatsappLink } from "@/lib/dealership";
import VehicleImage from "@/components/vehicle-image";
import Reveal from "@/components/reveal";
import { monthlyPayment } from "@/components/finance-calculator";
import {
    IconArrowRight,
    IconCheck,
    IconClose,
    IconPlus,
    IconScale,
    IconWhatsApp,
} from "@/components/icons";

export default function ComparePage() {
    const { selectedSlugs, removeSlug, addSlug, clearCompare } = useCompare();
    const vehicles = useVehicles();

    const selectedVehicles = selectedSlugs
        .map((slug) => getVehicleFromList(vehicles, slug))
        .filter((v): v is Vehicle => Boolean(v));

    const availableToSelect = vehicles.filter((v) => !selectedSlugs.includes(v.slug));

    const rows: { label: string; getValue: (v: Vehicle) => string }[] = [
        { label: "Asking Price", getValue: (v) => formatKES(v.priceKES) },
        { label: "Year", getValue: (v) => String(v.year) },
        { label: "Mileage", getValue: (v) => formatKm(v.mileageKm) },
        { label: "Condition", getValue: (v) => `${v.condition} (${v.origin})` },
        { label: "Status", getValue: (v) => v.status.toUpperCase() },
        { label: "Engine", getValue: (v) => v.engineSummary },
        { label: "Displacement", getValue: (v) => `${v.engineCc} cc` },
        { label: "Power", getValue: (v) => (v.powerHp ? `${v.powerHp} hp` : "—") },
        { label: "Torque", getValue: (v) => (v.torqueNm ? `${v.torqueNm} Nm` : "—") },
        { label: "0–100 km/h", getValue: (v) => (v.accelSec ? `${v.accelSec}s` : "—") },
        { label: "Fuel Type", getValue: (v) => v.fuel },
        { label: "Transmission", getValue: (v) => v.transmission },
        { label: "Drivetrain", getValue: (v) => v.drive },
        { label: "Body Type", getValue: (v) => v.bodyType },
        { label: "Seats", getValue: (v) => String(v.seats) },
        { label: "Exterior", getValue: (v) => v.exterior },
        { label: "Interior", getValue: (v) => v.interior },
        { label: "Location", getValue: (v) => v.location },
        {
            label: "Est. Monthly (20% dep, 48m)",
            getValue: (v) => {
                const dep = v.priceKES * 0.2;
                const princ = v.priceKES - dep;
                return `${formatKES(Math.round(monthlyPayment(princ, 16, 48)))}/mo`;
            },
        },
    ];

    return (
        <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 lg:px-8">
            {/* Header */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="eyebrow">Vehicle Comparison</p>
                    <h1 className="font-display mt-3 text-4xl text-ivory sm:text-5xl">
                        Compare <span className="text-gold">Side-by-Side</span>
                    </h1>
                    <p className="mt-3 text-sm text-sand sm:text-base">
                        Compare specs, engine outputs, pricing, and features to choose your next vehicle with confidence.
                    </p>
                </div>
                {selectedVehicles.length > 0 && (
                    <button
                        type="button"
                        onClick={clearCompare}
                        className="self-start btn-outline !py-2.5 !px-5 text-xs sm:self-auto"
                    >
                        Clear All ({selectedVehicles.length})
                    </button>
                )}
            </div>

            {/* Comparison Grid */}
            {selectedVehicles.length === 0 ? (
                <Reveal className="mt-14 border border-white/[0.06] bg-onyx px-8 py-20 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                        <IconScale size={28} />
                    </div>
                    <h2 className="font-display mt-6 text-2xl text-ivory">No vehicles selected for comparison</h2>
                    <p className="mx-auto mt-3 max-w-md text-sm text-sand">
                        Browse our collection and click the comparison icon on any vehicle to compare specs side-by-side.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link href="/collection" className="btn-gold">
                            Browse Collection
                            <IconArrowRight size={15} />
                        </Link>
                    </div>

                    {/* Quick select options */}
                    <div className="mt-14 border-t hairline pt-10 text-left">
                        <p className="eyebrow text-center">Or select from available stock</p>
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {vehicles.slice(0, 4).map((v) => (
                                <button
                                    key={v.slug}
                                    type="button"
                                    onClick={() => addSlug(v.slug)}
                                    className="flex items-center gap-4 border border-white/10 bg-black/60 p-4 text-left transition-all hover:border-gold/50 hover:bg-coal"
                                >
                                    <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-onyx">
                                        <VehicleImage src={v.images[0]} alt={`${v.make} ${v.model}`} sizes="64px" />
                                    </div>
                                    <div>
                                        <p className="font-display text-sm text-ivory">
                                            {v.make} {v.model}
                                        </p>
                                        <p className="text-xs text-gold">{formatKES(v.priceKES)}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </Reveal>
            ) : (
                <div className="mt-12 overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse text-left">
                        <thead>
                            <tr className="border-b hairline bg-onyx">
                                <th className="w-48 p-5 text-xs font-semibold tracking-wider text-sand uppercase">
                                    Specs & Details
                                </th>
                                {selectedVehicles.map((v) => (
                                    <th key={v.slug} className="min-w-[220px] p-5 align-top">
                                        <div className="relative group flex flex-col h-full justify-between">
                                            <button
                                                type="button"
                                                onClick={() => removeSlug(v.slug)}
                                                aria-label={`Remove ${v.make} ${v.model}`}
                                                className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center bg-black/80 text-sand hover:text-gold"
                                            >
                                                <IconClose size={14} />
                                            </button>
                                            <Link href={`/collection/${v.slug}`} className="block">
                                                <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-black">
                                                    <VehicleImage src={v.images[0]} alt={`${v.make} ${v.model}`} sizes="250px" />
                                                </div>
                                                <p className="eyebrow mt-3">{v.make}</p>
                                                <h3 className="font-display mt-1 text-lg text-ivory group-hover:text-gold">
                                                    {v.model} <span className="text-gold">{v.trim}</span>
                                                </h3>
                                                <p className="font-display mt-2 text-xl text-gold">{formatKES(v.priceKES)}</p>
                                            </Link>

                                            <a
                                                href={whatsappLink(`Hello Josam Auto Company, I'm comparing vehicles and interested in the ${v.year} ${v.make} ${v.model} ${v.trim}.`)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn-gold mt-4 w-full !py-2.5 text-[11px]"
                                            >
                                                <IconWhatsApp size={14} /> Enquire
                                            </a>
                                        </div>
                                    </th>
                                ))}
                                {/* Empty Add Slot */}
                                {selectedVehicles.length < 4 && (
                                    <th className="min-w-[200px] p-5 align-top">
                                        <div className="flex h-full min-h-[300px] flex-col items-center justify-center border border-dashed border-white/20 bg-onyx/40 p-6 text-center">
                                            <IconPlus size={24} className="text-gold/60" />
                                            <p className="font-display mt-3 text-sm text-ivory">Add Vehicle</p>
                                            <select
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        addSlug(e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                                className="field mt-4 text-xs"
                                                defaultValue=""
                                            >
                                                <option value="" disabled>
                                                    Select a car…
                                                </option>
                                                {availableToSelect.map((av) => (
                                                    <option key={av.slug} value={av.slug}>
                                                        {av.year} {av.make} {av.model} ({formatKES(av.priceKES)})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.05]">
                            {rows.map((row) => (
                                <tr key={row.label} className="transition-colors hover:bg-onyx/50">
                                    <td className="p-4 text-xs font-semibold tracking-wider text-sand uppercase bg-onyx/40">
                                        {row.label}
                                    </td>
                                    {selectedVehicles.map((v) => (
                                        <td key={v.slug} className="p-4 text-sm font-medium text-ivory">
                                            {row.getValue(v)}
                                        </td>
                                    ))}
                                    {selectedVehicles.length < 4 && <td className="p-4 bg-onyx/20" />}
                                </tr>
                            ))}

                            {/* Features checklist comparison */}
                            <tr>
                                <td className="p-4 text-xs font-semibold tracking-wider text-sand uppercase bg-onyx/40 align-top">
                                    Key Features
                                </td>
                                {selectedVehicles.map((v) => (
                                    <td key={v.slug} className="p-4 align-top">
                                        <ul className="space-y-2 text-xs text-sand">
                                            {v.features.slice(0, 8).map((f) => (
                                                <li key={f} className="flex items-start gap-2">
                                                    <IconCheck size={14} className="mt-0.5 shrink-0 text-gold" />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                ))}
                                {selectedVehicles.length < 4 && <td className="p-4 bg-onyx/20" />}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
