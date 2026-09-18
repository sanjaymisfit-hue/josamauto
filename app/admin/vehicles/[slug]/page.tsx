import { notFound } from "next/navigation";
import { getVehicle } from "@/lib/vehicles-db";
import VehicleForm from "@/components/admin/vehicle-form";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vehicle = await getVehicle(slug);
  if (!vehicle) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="eyebrow">Inventory</p>
      <h1 className="font-display mt-3 text-4xl text-ivory">
        Edit · {vehicle.year} {vehicle.make} {vehicle.model}
      </h1>
      <VehicleForm initial={vehicle} />
    </div>
  );
}
