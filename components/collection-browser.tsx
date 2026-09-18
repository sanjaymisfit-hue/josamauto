"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Vehicle } from "@/lib/vehicles";
import VehicleCard from "@/components/vehicle-card";
import { IconSearch } from "@/components/icons";

type Props = {
  vehicles: Vehicle[];
};

const priceBands = [
  { label: "Any price", min: 0, max: Infinity },
  { label: "Under KES 10M", min: 0, max: 10_000_000 },
  { label: "KES 10M – 18M", min: 10_000_000, max: 18_000_000 },
  { label: "Over KES 18M", min: 18_000_000, max: Infinity },
];

const sortOptions = [
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "year-desc", label: "Newest first" },
  { value: "mileage-asc", label: "Lowest mileage" },
] as const;

export default function CollectionBrowser({ vehicles }: Props) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [make, setMake] = useState(searchParams.get("make") ?? "");
  const [bodyType, setBodyType] = useState(searchParams.get("bodyType") ?? "");
  const [fuel, setFuel] = useState("");
  const [priceIdx, setPriceIdx] = useState(0);
  const [sort, setSort] = useState<(typeof sortOptions)[number]["value"]>("featured");

  // Sync filters when the URL query changes (e.g. footer links).
  // Adjusted during render — the sanctioned alternative to setState in an effect.
  const [prevParams, setPrevParams] = useState(searchParams);
  if (searchParams !== prevParams) {
    setPrevParams(searchParams);
    setMake(searchParams.get("make") ?? "");
    setBodyType(searchParams.get("bodyType") ?? "");
  }

  const makes = useMemo(() => [...new Set(vehicles.map((v) => v.make))].sort(), [vehicles]);
  const bodyTypes = useMemo(() => [...new Set(vehicles.map((v) => v.bodyType))].sort(), [vehicles]);
  const fuels = useMemo(() => [...new Set(vehicles.map((v) => v.fuel))].sort(), [vehicles]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const band = priceBands[priceIdx];
    const list = vehicles.filter((v) => {
      if (make && v.make !== make) return false;
      if (bodyType && v.bodyType !== bodyType) return false;
      if (fuel && v.fuel !== fuel) return false;
      if (v.priceKES < band.min || v.priceKES > band.max) return false;
      if (q) {
        const haystack = `${v.make} ${v.model} ${v.trim} ${v.year}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.priceKES - b.priceKES);
      case "price-desc":
        return list.sort((a, b) => b.priceKES - a.priceKES);
      case "year-desc":
        return list.sort((a, b) => b.year - a.year);
      case "mileage-asc":
        return list.sort((a, b) => a.mileageKm - b.mileageKm);
      default:
        return list.sort(
          (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
        );
    }
  }, [vehicles, query, make, bodyType, fuel, priceIdx, sort]);

  const clearFilters = () => {
    setQuery("");
    setMake("");
    setBodyType("");
    setFuel("");
    setPriceIdx(0);
    setSort("featured");
  };

  const filtersActive =
    query || make || bodyType || fuel || priceIdx !== 0 || sort !== "featured";

  return (
    <div>
      {/* Filter bar */}
      <div className="border border-white/[0.06] bg-onyx p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="relative lg:col-span-2">
            <IconSearch size={15} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-sand" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search make, model, trim…"
              aria-label="Search vehicles"
              className="field !pl-11"
            />
          </div>
          <select value={make} onChange={(e) => setMake(e.target.value)} className="field" aria-label="Filter by make">
            <option value="">All makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={bodyType} onChange={(e) => setBodyType(e.target.value)} className="field" aria-label="Filter by body type">
            <option value="">All body types</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <select value={fuel} onChange={(e) => setFuel(e.target.value)} className="field" aria-label="Filter by fuel type">
            <option value="">All fuels</option>
            {fuels.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select value={priceIdx} onChange={(e) => setPriceIdx(Number(e.target.value))} className="field" aria-label="Filter by price">
            {priceBands.map((p, i) => (
              <option key={p.label} value={i}>{p.label}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-4">
          <p className="text-xs tracking-wide text-sand">
            <span className="text-gold">{results.length}</span> of {vehicles.length} vehicles
          </p>
          <div className="flex items-center gap-3">
            {filtersActive ? (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs tracking-[0.15em] text-sand uppercase transition-colors hover:text-gold"
              >
                Clear filters
              </button>
            ) : null}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="field !w-auto !py-2 text-xs"
              aria-label="Sort vehicles"
            >
              {sortOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((v) => (
            <VehicleCard key={v.slug} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-white/[0.06] bg-onyx px-6 py-20 text-center">
          <p className="font-display text-2xl text-ivory">Nothing matches yet.</p>
          <p className="mx-auto mt-3 max-w-md text-sm text-sand">
            We source to order. Tell our concierge what you&apos;re looking for and we&apos;ll find
            it through our Japan, UK and local networks.
          </p>
          <button type="button" onClick={clearFilters} className="btn-outline mt-8">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
