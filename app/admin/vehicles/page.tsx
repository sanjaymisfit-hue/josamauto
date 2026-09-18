import Link from "next/link";
import { getVehicles } from "@/lib/vehicles-db";
import VehicleList from "@/components/admin/vehicle-list";

export const dynamic = "force-dynamic";

export default async function AdminVehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1 className="font-display mt-3 text-4xl text-ivory">Vehicles</h1>
        </div>
        <Link href="/admin/vehicles/new" className="btn-gold">+ Add vehicle</Link>
      </div>
      <div className="mt-8">
        <VehicleList vehicles={vehicles} />
      </div>
    </div>
  );
}
