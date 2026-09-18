import { getBrands } from "@/lib/vehicles-db";
import BrandsAdmin from "@/components/admin/brands-admin";

export const dynamic = "force-dynamic";

export default async function AdminBrandsPage() {
  const brands = await getBrands();
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="eyebrow">Catalogue</p>
      <h1 className="font-display mt-3 text-4xl text-ivory">Brands</h1>
      <div className="mt-8">
        <BrandsAdmin initial={brands} />
      </div>
    </div>
  );
}
