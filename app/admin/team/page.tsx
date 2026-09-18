import { getProfiles } from "@/lib/leads";
import TeamAdmin from "@/components/admin/team-admin";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const profiles = await getProfiles();
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <p className="eyebrow">Sales</p>
      <h1 className="font-display mt-3 text-4xl text-ivory">Team</h1>
      <div className="mt-8">
        <TeamAdmin initial={profiles} />
      </div>
    </div>
  );
}
