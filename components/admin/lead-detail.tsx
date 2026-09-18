"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LEAD_KINDS,
  LEAD_STATUSES,
  type Lead,
  type LeadActivity,
  type LeadStatus,
  type Profile,
} from "@/lib/lead-types";

const actionLabel: Record<LeadActivity["action"], string> = {
  created: "Lead created",
  status_change: "Status changed",
  assignment: "Reassigned",
  note: "Note",
};

export default function LeadDetail({
  lead,
  activity,
  profiles,
  vehicleLabel,
}: {
  lead: Lead;
  activity: LeadActivity[];
  profiles: Profile[];
  vehicleLabel: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [assignee, setAssignee] = useState(lead.assigned_to ?? "");
  const [lostReason, setLostReason] = useState(lead.lost_reason || "");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const actor = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return { supabase, userId: user?.id ?? null };
  };

  const log = async (
    supabase: ReturnType<typeof createClient>,
    entry: { action: LeadActivity["action"]; old_value?: string; new_value?: string; note?: string; actor_id?: string | null },
  ) => {
    await supabase.from("lead_activity").insert({
      lead_id: lead.id,
      actor_id: entry.actor_id ?? null,
      action: entry.action,
      old_value: entry.old_value ?? "",
      new_value: entry.new_value ?? "",
      note: entry.note ?? "",
    });
  };

  const changeStatus = async (next: LeadStatus) => {
    if (next === status) return;
    setBusy(true);
    setError("");
    try {
      const { supabase, userId } = await actor();
      const patch: Record<string, unknown> = { status: next };
      if (next === "lost" && lostReason.trim()) patch.lost_reason = lostReason.trim();
      const { error } = await supabase.from("leads").update(patch).eq("id", lead.id);
      if (error) throw error;
      await log(supabase, { action: "status_change", old_value: status, new_value: next, actor_id: userId });
      setStatus(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const changeAssignee = async (next: string) => {
    setBusy(true);
    setError("");
    try {
      const { supabase, userId } = await actor();
      const { error } = await supabase
        .from("leads")
        .update({ assigned_to: next || null })
        .eq("id", lead.id);
      if (error) throw error;
      const oldName = profiles.find((p) => p.id === lead.assigned_to)?.full_name || "Unassigned";
      const newName = profiles.find((p) => p.id === next)?.full_name || "Unassigned";
      await log(supabase, { action: "assignment", old_value: oldName, new_value: newName, actor_id: userId });
      setAssignee(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(false);
    }
  };

  const saveLostReason = async () => {
    if (!lostReason.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { supabase } = await actor();
      const { error } = await supabase
        .from("leads")
        .update({ lost_reason: lostReason.trim() })
        .eq("id", lead.id);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save reason");
    } finally {
      setBusy(false);
    }
  };

  const addNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    setBusy(true);
    setError("");
    try {
      const { supabase, userId } = await actor();
      await log(supabase, { action: "note", note: note.trim(), actor_id: userId });
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save note");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!confirm(`Delete lead ${lead.customer_name}? This cannot be undone.`)) return;
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    router.push("/admin/leads");
    router.refresh();
  };

  const kindName = LEAD_KINDS.find((k) => k.value === lead.type)?.label ?? lead.type;
  const waNumber = lead.customer_phone.replace(/[^0-9]/g, "");

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="border border-white/[0.06] bg-onyx p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow">{kindName}{lead.lead_number ? ` · #${lead.lead_number}` : ""}</p>
            <p className="text-[11px] text-sand/60">
              {new Date(lead.created_at).toLocaleString()} · via {lead.source_url || "website"}
            </p>
          </div>
          <h2 className="font-display mt-3 text-2xl text-ivory">{lead.customer_name}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={`tel:${lead.customer_phone}`} className="btn-outline !py-2 !px-4 text-[11px]">Call {lead.customer_phone}</a>
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hello ${lead.customer_name}, this is Josam Auto Company following up on your enquiry.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold !py-2 !px-4 text-[11px]"
              >
                WhatsApp back
              </a>
            )}
          </div>
          <dl className="mt-6 space-y-3 text-sm">
            {[
              ["Phone", lead.customer_phone],
              ["Email", lead.customer_email || "—"],
              ["Contact via", lead.preferred_contact || "—"],
              ["Vehicle", vehicleLabel || "—"],
              ["Scheduled", lead.scheduled_date ? `${lead.scheduled_date}${lead.scheduled_time ? ` · ${String(lead.scheduled_time).slice(0, 5)}` : ""}` : "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-4">
                <dt className="w-24 shrink-0 text-sand">{k}</dt>
                <dd className="text-ivory">{v}</dd>
              </div>
            ))}
          </dl>

          {(lead.employment_type || lead.monthly_income_kes || lead.down_payment_kes || lead.loan_period_months || lead.national_id_or_dl) && (
            <div className="mt-6 border-t hairline pt-5">
              <p className="label">Financing profile</p>
              <dl className="mt-3 space-y-3 text-sm">
                {[
                  ["Employment", lead.employment_type || "—"],
                  ["Monthly income", lead.monthly_income_kes ? `KES ${Number(lead.monthly_income_kes).toLocaleString()}` : "—"],
                  ["Down payment", lead.down_payment_kes ? `KES ${Number(lead.down_payment_kes).toLocaleString()}` : "—"],
                  ["Loan period", lead.loan_period_months ? `${lead.loan_period_months} months` : "—"],
                  ["ID / DL", lead.national_id_or_dl || "—"],
                  ["Deposit paid", lead.deposit_paid_kes ? `KES ${Number(lead.deposit_paid_kes).toLocaleString()}` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-4">
                    <dt className="w-32 shrink-0 text-sand">{k}</dt>
                    <dd className="text-ivory">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {(lead.seller_car_make || lead.seller_car_model) && (
            <div className="mt-6 border-t hairline pt-5">
              <p className="label">Seller&apos;s car</p>
              <p className="mt-2 text-sm text-ivory">
                {[lead.seller_car_make, lead.seller_car_model].filter(Boolean).join(" ")}
                {lead.seller_car_year ? ` · ${lead.seller_car_year}` : ""}
                {lead.seller_car_mileage_km ? ` · ${Number(lead.seller_car_mileage_km).toLocaleString()} km` : ""}
              </p>
              {lead.seller_expected_price_kes ? (
                <p className="font-display mt-1 text-lg text-gold">
                  Expects KES {Number(lead.seller_expected_price_kes).toLocaleString()}
                </p>
              ) : null}
            </div>
          )}

          {lead.message && (
            <div className="mt-6 border-t hairline pt-5">
              <p className="label">Details</p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-line text-ivory/85">{lead.message}</p>
            </div>
          )}
        </div>

        <div className="border border-white/[0.06] bg-onyx p-7">
          <h3 className="font-display text-base text-ivory">Timeline</h3>
          <ul className="mt-4 space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="border-l border-gold/30 pl-4">
                <p className="text-xs tracking-[0.15em] text-gold uppercase">{actionLabel[a.action]}</p>
                {(a.old_value || a.new_value) && (
                  <p className="mt-1 text-sm text-ivory/85">
                    {a.old_value} {a.new_value ? `→ ${a.new_value}` : ""}
                  </p>
                )}
                {a.note && <p className="mt-1 text-sm text-sand">{a.note}</p>}
                <p className="mt-1 text-[11px] text-sand/60">{new Date(a.created_at).toLocaleString()}</p>
              </li>
            ))}
            {activity.length === 0 && <p className="text-sm text-sand">No activity yet.</p>}
          </ul>
          <form onSubmit={addNote} className="mt-6 flex gap-3">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an internal note…"
              className="field"
              aria-label="Add note"
            />
            <button type="submit" disabled={busy || !note.trim()} className="btn-gold shrink-0">
              Add
            </button>
          </form>
        </div>
      </div>

      <div>
        <div className="border border-white/[0.06] bg-onyx p-6">
          <label className="label" htmlFor="ld-status">Status</label>
          <select
            id="ld-status"
            value={status}
            disabled={busy}
            onChange={(e) => changeStatus(e.target.value as LeadStatus)}
            className="field"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {status === "lost" && (
            <div className="mt-4">
              <label className="label" htmlFor="ld-lost">Lost reason</label>
              <div className="flex gap-2">
                <input
                  id="ld-lost"
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  placeholder="e.g. bought elsewhere"
                  className="field"
                />
                <button type="button" onClick={saveLostReason} disabled={busy} className="btn-outline shrink-0">
                  Save
                </button>
              </div>
            </div>
          )}
          <label className="label mt-5" htmlFor="ld-assign">Assigned to</label>
          <select
            id="ld-assign"
            value={assignee}
            disabled={busy}
            onChange={(e) => changeAssignee(e.target.value)}
            className="field"
          >
            <option value="">Unassigned</option>
            {profiles.filter((p) => p.is_active).map((p) => (
              <option key={p.id} value={p.id}>{p.full_name || "Unnamed"} ({p.role})</option>
            ))}
          </select>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
          <Link href="/admin/leads" className="btn-outline mt-6 w-full text-center text-xs">
            ← Back to leads
          </Link>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="mt-3 w-full border border-red-500/40 px-6 py-3 text-xs tracking-[0.2em] text-red-300 uppercase transition-colors hover:bg-red-500/10"
          >
            Delete lead
          </button>
        </div>
      </div>
    </div>
  );
}
