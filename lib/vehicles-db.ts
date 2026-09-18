import { createClient } from "@/lib/supabase/server";
import {
  vehicles as localVehicles,
  type Vehicle,
  type VehicleStatus,
} from "@/lib/vehicles";

/* Map a Supabase row (snake_case) to the app Vehicle type.
   price_kes is bigint — PostgREST may serialize it as a string, so coerce. */
function mapRow(r: Record<string, unknown>): Vehicle {
  return {
    slug: r.slug as string,
    make: r.make as string,
    model: r.model as string,
    trim: (r.trim as string) ?? "",
    year: Number(r.year),
    priceKES: Number(r.price_kes),
    mileageKm: Number(r.mileage_km ?? 0),
    fuel: (r.fuel as Vehicle["fuel"]) ?? "Petrol",
    transmission: (r.transmission as Vehicle["transmission"]) ?? "Automatic",
    drive: (r.drive as Vehicle["drive"]) ?? "AWD",
    engineCc: Number(r.engine_cc ?? 0),
    engineSummary: (r.engine_summary as string) ?? "",
    powerHp: r.power_hp != null ? Number(r.power_hp) : undefined,
    torqueNm: r.torque_nm != null ? Number(r.torque_nm) : undefined,
    accelSec: r.accel_sec != null ? Number(r.accel_sec) : undefined,
    bodyType: (r.body_type as Vehicle["bodyType"]) ?? "SUV",
    seats: Number(r.seats ?? 5),
    exterior: (r.exterior as string) ?? "",
    interior: (r.interior as string) ?? "",
    condition: (r.condition as Vehicle["condition"]) ?? "Foreign Used",
    status: (r.status as VehicleStatus) ?? "available",
    location: (r.location as string) ?? "Nairobi Showroom",
    origin: (r.origin as Vehicle["origin"]) ?? "Japan",
    featured: Boolean(r.featured),
    images: (r.images as string[]) ?? [],
    description: (r.description as string) ?? "",
    features: (r.features as string[]) ?? [],
  };
}

function envReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

/** All vehicles — live from Supabase, fallback to local stock */
export async function getVehicles(): Promise<Vehicle[]> {
  if (!envReady()) return localVehicles;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return localVehicles;
    return data.map(mapRow);
  } catch {
    return localVehicles;
  }
}

export async function getVehicle(slug: string): Promise<Vehicle | undefined> {
  const all = await getVehicles();
  return all.find((v) => v.slug === slug);
}

export async function getFeatured(count = 6): Promise<Vehicle[]> {
  const all = await getVehicles();
  return all.filter((v) => v.featured).slice(0, count);
}

/** New arrivals: prefer is_new_arrival flag, else non-featured stock */
export async function getNewArrivals(count = 4): Promise<Vehicle[]> {
  if (!envReady()) return localVehicles.filter((v) => !v.featured).slice(0, count);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("is_new_arrival", true)
      .order("created_at", { ascending: false })
      .limit(count);
    if (data && data.length > 0) return data.map(mapRow);
  } catch {
    // fall through
  }
  const all = await getVehicles();
  return all.filter((v) => !v.featured).slice(0, count);
}

export interface Brand {
  id: string;
  name: string;
  logo_url: string | null;
}

export async function getBrands(): Promise<Brand[]> {
  if (!envReady()) {
    return [...new Set(localVehicles.map((v) => v.make))]
      .sort()
      .map((name) => ({ id: name, name, logo_url: null }));
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");
    if (error || !data) throw error;
    return data as Brand[];
  } catch {
    return [...new Set(localVehicles.map((v) => v.make))]
      .sort()
      .map((name) => ({ id: name, name, logo_url: null }));
  }
}
