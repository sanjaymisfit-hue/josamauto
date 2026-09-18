import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getLead, getLeadActivity, getProfiles } from "@/lib/leads";
import LeadDetail from "@/components/admin/lead-detail";

export const dynamic = "force-dynamic";

export default async function AdminLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lead, activity, profiles] = await Promise.all([
    getLead(id),
    getLeadActivity(id),
    getProfiles(),
  ]);
  if (!lead) notFound();

  // Resolve the vehicle label for display
  let vehicleLabel = "";
  if (lead.vehicle_id) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("vehicles")
        .select("year,make,model,trim")
        .eq("id", lead.vehicle_id)
        .single();
      if (data) {
        const v = data as { year: number; make: string; model: string; trim: string };
        vehicleLabel = `${v.year} ${v.make} ${v.model} ${v.trim}`.trim();
      }
    } catch {
      // leave blank
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="eyebrow">Lead{lead.lead_number ? ` #${lead.lead_number}` : ""}</p>
      <h1 className="font-display mt-3 text-4xl text-ivory">
        {lead.customer_name} <span className="text-gold">· {lead.customer_phone}</span>
      </h1>
      <LeadDetail lead={lead} activity={activity} profiles={profiles} vehicleLabel={vehicleLabel} />
    </div>
  );
}
