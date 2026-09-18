import { createClient } from "@/lib/supabase/server";
import type {
  Lead,
  LeadActivity,
  LeadStatus,
  Profile,
} from "@/lib/lead-types";

export type { Lead, LeadActivity, LeadStatus, Profile } from "@/lib/lead-types";
export { LEAD_KINDS, LEAD_STATUSES } from "@/lib/lead-types";
export type { LeadKind } from "@/lib/lead-types";

function envReady() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export async function getLeads(): Promise<Lead[]> {
  if (!envReady()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    return (data ?? []) as Lead[];
  } catch {
    return [];
  }
}

export async function getLead(id: string): Promise<Lead | null> {
  if (!envReady()) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Lead;
  } catch {
    return null;
  }
}

export async function getLeadActivity(leadId: string): Promise<LeadActivity[]> {
  if (!envReady()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_activity")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as LeadActivity[];
  } catch {
    return [];
  }
}

export async function getProfiles(): Promise<Profile[]> {
  if (!envReady()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("full_name");
    if (error) throw error;
    return (data ?? []) as Profile[];
  } catch {
    return [];
  }
}

/** Resolve a vehicle slug to its DB id (for lead.vehicle_id) */
export async function getVehicleIdBySlug(slug: string): Promise<string | null> {
  if (!envReady() || !slug) return null;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("id")
      .eq("slug", slug)
      .single();
    if (error) throw error;
    return (data as { id: string } | null)?.id ?? null;
  } catch {
    return null;
  }
}

export interface LeadStats {
  total: number;
  unread: number;
  newToday: number;
  byStatus: Record<LeadStatus, number>;
  testDrivesPending: number;
}

export async function getLeadStats(): Promise<LeadStats> {
  const empty: LeadStats = {
    total: 0,
    unread: 0,
    newToday: 0,
    byStatus: { new: 0, contacted: 0, scheduled: 0, won: 0, lost: 0 },
    testDrivesPending: 0,
  };
  if (!envReady()) return empty;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("status,type,created_at,assigned_to");
    if (error) throw error;
    const today = new Date().toISOString().slice(0, 10);
    for (const l of data ?? []) {
      empty.total++;
      if (!(l.assigned_to as string | null)) empty.unread++;
      if ((l.created_at as string)?.slice(0, 10) === today) empty.newToday++;
      if ((l.status as string) in empty.byStatus)
        empty.byStatus[l.status as LeadStatus]++;
      if (
        (l.type === "test_drive" || l.type === "booking") &&
        (l.status === "new" || l.status === "contacted")
      )
        empty.testDrivesPending++;
    }
    return empty;
  } catch {
    return empty;
  }
}

export async function getRecentActivity(limit = 8): Promise<LeadActivity[]> {
  if (!envReady()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("lead_activity")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as LeadActivity[];
  } catch {
    return [];
  }
}
