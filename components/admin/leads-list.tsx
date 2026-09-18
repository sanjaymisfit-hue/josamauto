"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  LEAD_KINDS,
  LEAD_STATUSES,
  type Lead,
  type LeadKind,
  type LeadStatus,
  type Profile,
} from "@/lib/lead-types";

const kindLabel = (k: LeadKind) => LEAD_KINDS.find((x) => x.value === k)?.label ?? k;

const statusStyle: Record<LeadStatus, string> = {
  new: "text-gold",
  contacted: "text-sky-300",
  scheduled: "text-violet-300",
  won: "text-emerald-300",
  lost: "text-sand/60",
};

function timeAgo(iso: string) {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

export default function LeadsList({
  leads,
  profiles,
}: {
  leads: Lead[];
  profiles: Profile[];
}) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("");
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [unassignedOnly, setUnassignedOnly] = useState(false);

  const nameOf = (id: string | null) =>
    profiles.find((p) => p.id === id)?.full_name || "Unassigned";

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      if (kind && l.type !== kind) return false;
      if (status && l.status !== status) return false;
      if (assignee === "none" && l.assigned_to) return false;
      if (assignee && assignee !== "none" && l.assigned_to !== assignee) return false;
      if (unassignedOnly && l.assigned_to) return false;
      if (
        q &&
        !`${l.customer_name} ${l.customer_phone} ${l.message}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
  }, [leads, query, kind, status, assignee, unassignedOnly]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, phone, details…"
          className="field lg:col-span-2"
          aria-label="Search leads"
        />
        <select value={kind} onChange={(e) => setKind(e.target.value)} className="field" aria-label="Filter by type">
          <option value="">All types</option>
          {LEAD_KINDS.map((k) => (
            <option key={k.value} value={k.value}>{k.label}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="field" aria-label="Filter by status">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="field" aria-label="Filter by salesperson">
          <option value="">Everyone</option>
          <option value="none">Unassigned</option>
          {profiles.map((p) => (
            <option key={p.id} value={p.id}>{p.full_name || "Unnamed"}</option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-sand">
          <input
            type="checkbox"
            checked={unassignedOnly}
            onChange={(e) => setUnassignedOnly(e.target.checked)}
            className="h-4 w-4 accent-[#c9a962]"
          />
          Unassigned only
        </label>
        <p className="text-xs text-sand">
          <span className="text-gold">{results.length}</span> of {leads.length}
        </p>
      </div>

      <div className="mt-4 divide-y divide-white/[0.05] border border-white/[0.06] bg-onyx">
        {results.map((l) => (
          <Link
            key={l.id}
            href={`/admin/leads/${l.id}`}
            className={`flex flex-wrap items-center gap-3 px-6 py-4 transition-colors hover:bg-coal ${!l.assigned_to ? "border-l-2 border-l-gold" : ""}`}
          >
            <div className="min-w-0 flex-1">
              <p className="font-display truncate text-sm text-ivory">
                {!l.assigned_to && <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-gold align-middle" />}
                {l.lead_number ? `#${l.lead_number} · ` : ""}{l.customer_name}{" "}
                <span className="text-sand">· {l.customer_phone}</span>
              </p>
              <p className="mt-0.5 truncate text-xs text-sand">
                {kindLabel(l.type)}
                {l.scheduled_date ? ` · ${l.scheduled_date}${l.scheduled_time ? ` ${String(l.scheduled_time).slice(0, 5)}` : ""}` : ""}
                {" · "}{nameOf(l.assigned_to)}
              </p>
            </div>
            <span className={`text-xs tracking-[0.2em] uppercase ${statusStyle[l.status]}`}>
              {l.status}
            </span>
            <span className="text-[11px] text-sand/60">{timeAgo(l.created_at)}</span>
          </Link>
        ))}
        {results.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-sand">
            No leads match. New website enquiries land here automatically.
          </p>
        )}
      </div>
    </div>
  );
}
