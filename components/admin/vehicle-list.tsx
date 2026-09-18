"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Vehicle } from "@/lib/vehicles";

export default function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return vehicles.filter((v) => {
      if (status && v.status !== status) return false;
      if (q && !`${v.make} ${v.model} ${v.trim} ${v.year} ${v.slug}`.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [vehicles, query, status]);

  return (
    <div>
      <div className="flex flex-wrap gap-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search make, model, slug…"
          className="field max-w-sm"
          aria-label="Search inventory"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="field max-w-xs"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="sold">Sold</option>
          <option value="in-transit">In transit</option>
        </select>
        <p className="ml-auto self-center text-xs text-sand">
          <span className="text-gold">{results.length}</span> of {vehicles.length}
        </p>
      </div>

      <div className="mt-6 divide-y divide-white/[0.05] border border-white/[0.06] bg-onyx">
        {results.map((v) => (
          <Link
            key={v.slug}
            href={`/admin/vehicles/${v.slug}`}
            className="flex flex-wrap items-center gap-4 px-6 py-4 transition-colors hover:bg-coal"
          >
            <div className="min-w-0 flex-1">
              <p className="font-display truncate text-sm text-ivory">
                {v.year} {v.make} {v.model} {v.trim}
              </p>
              <p className="mt-0.5 text-xs text-sand">
                {v.slug} · KES {v.priceKES.toLocaleString()} · {v.images.length} photos
                {v.featured ? " · ★ Featured" : ""}
              </p>
            </div>
            <span className="text-xs tracking-[0.2em] text-gold uppercase">{v.status}</span>
          </Link>
        ))}
        {results.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-sand">No matches.</p>
        )}
      </div>
    </div>
  );
}
