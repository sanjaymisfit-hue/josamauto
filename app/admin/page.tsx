import Link from "next/link";
import { getVehicles, getBrands } from "@/lib/vehicles-db";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [vehicles, brands] = await Promise.all([getVehicles(), getBrands()]);

  const stats = [
    { label: "Total vehicles", value: vehicles.length, href: "/admin/vehicles" },
    {
      label: "Available",
      value: vehicles.filter((v) => v.status === "available").length,
      href: "/admin/vehicles",
    },
    {
      label: "Featured",
      value: vehicles.filter((v) => v.featured).length,
      href: "/admin/vehicles",
    },
    { label: "Brands", value: brands.length, href: "/admin/brands" },
  ];

  const recent = vehicles.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="font-display mt-3 text-4xl text-ivory">
            Inventory <span className="text-gold">overview</span>
          </h1>
        </div>
        <Link href="/admin/vehicles/new" className="btn-gold">
          + Add vehicle
        </Link>
      </div>

      <div className="mt-10 grid gap-px border hairline sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-onyx p-8 transition-colors hover:bg-coal"
          >
            <p className="font-display text-4xl text-gold">{s.value}</p>
            <p className="mt-2 text-sm text-sand">{s.label}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-display mt-14 text-xl text-ivory">Recently updated</h2>
      <div className="mt-4 divide-y divide-white/[0.05] border border-white/[0.06] bg-onyx">
        {recent.map((v) => (
          <Link
            key={v.slug}
            href={`/admin/vehicles/${v.slug}`}
            className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 transition-colors hover:bg-coal"
          >
            <div>
              <p className="font-display text-sm text-ivory">
                {v.year} {v.make} {v.model} {v.trim}
              </p>
              <p className="mt-0.5 text-xs text-sand">{v.slug}</p>
            </div>
            <span className="text-xs tracking-[0.2em] text-gold uppercase">
              {v.status}
            </span>
          </Link>
        ))}
        {recent.length === 0 && (
          <p className="px-6 py-8 text-sm text-sand">
            No vehicles yet. Add your first one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
