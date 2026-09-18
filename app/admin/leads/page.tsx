import Link from "next/link";
import { getLeads, getProfiles } from "@/lib/leads";
import LeadsList from "@/components/admin/leads-list";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const [leads, profiles] = await Promise.all([getLeads(), getProfiles()]);
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Sales</p>
          <h1 className="font-display mt-3 text-4xl text-ivory">Leads</h1>
        </div>
        <Link href="/admin/team" className="btn-outline">Manage team</Link>
      </div>
      <div className="mt-8">
        <LeadsList leads={leads} profiles={profiles} />
      </div>
    </div>
  );
}
