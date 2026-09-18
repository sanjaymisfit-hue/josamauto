"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  vehicles as localVehicles,
  type Vehicle,
} from "@/lib/vehicles";

/** Client-side live inventory with local fallback (for client components) */
export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(localVehicles);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    )
      return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("vehicles")
          .select("*")
          .order("created_at", { ascending: false });
        if (cancelled || !data || data.length === 0) return;
        setVehicles(
          data.map(
            (r): Vehicle => ({
              slug: r.slug,
              make: r.make,
              model: r.model,
              trim: r.trim ?? "",
              year: Number(r.year),
              priceKES: Number(r.price_kes),
              mileageKm: Number(r.mileage_km ?? 0),
              fuel: r.fuel ?? "Petrol",
              transmission: r.transmission ?? "Automatic",
              drive: r.drive ?? "AWD",
              engineCc: Number(r.engine_cc ?? 0),
              engineSummary: r.engine_summary ?? "",
              powerHp: r.power_hp != null ? Number(r.power_hp) : undefined,
              torqueNm: r.torque_nm != null ? Number(r.torque_nm) : undefined,
              accelSec: r.accel_sec != null ? Number(r.accel_sec) : undefined,
              bodyType: r.body_type ?? "SUV",
              seats: Number(r.seats ?? 5),
              exterior: r.exterior ?? "",
              interior: r.interior ?? "",
              condition: r.condition ?? "Foreign Used",
              status: r.status ?? "available",
              location: r.location ?? "Nairobi Showroom",
              origin: r.origin ?? "Japan",
              featured: Boolean(r.featured),
              images: r.images ?? [],
              description: r.description ?? "",
              features: r.features ?? [],
            }),
          ),
        );
      } catch {
        // keep local fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return vehicles;
}

export function getVehicleFromList(list: Vehicle[], slug: string) {
  return list.find((v) => v.slug === slug);
}
