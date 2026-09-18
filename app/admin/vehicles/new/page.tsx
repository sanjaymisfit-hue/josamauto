import VehicleForm from "@/components/admin/vehicle-form";

export const dynamic = "force-dynamic";

export default function NewVehiclePage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="eyebrow">Inventory</p>
      <h1 className="font-display mt-3 text-4xl text-ivory">Add vehicle</h1>
      <VehicleForm isNew />
    </div>
  );
}
