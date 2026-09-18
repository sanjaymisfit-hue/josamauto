"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/lead-types";

export default function TeamAdmin({ initial }: { initial: Profile[] }) {
  const router = useRouter();
  const [profiles, setProfiles] = useState(initial);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Profile | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", role: "salesperson", is_active: true });

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("profiles").select("*").order("full_name");
    if (data) setProfiles(data as Profile[]);
    router.refresh();
  };

  const openEdit = (p: Profile) => {
    setEditing(p);
    setForm({ full_name: p.full_name, phone: p.phone, role: p.role, is_active: p.is_active });
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: form.full_name.trim(), phone: form.phone.trim(), role: form.role, is_active: form.is_active })
      .eq("id", editing.id);
    if (error) {
      setError(error.message);
      return;
    }
    setEditing(null);
    refresh();
  };

  return (
    <div>
      <div className="max-w-2xl border border-white/[0.06] bg-onyx p-6">
        <h2 className="font-display text-base text-ivory">How to add a salesperson</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-sand">
          <li>Supabase Dashboard → Authentication → Add user (email + password).</li>
          <li>They sign in once at <span className="text-ivory">/admin/login</span> — a profile is created automatically.</li>
          <li>Edit their name, role and status below, then assign leads to them.</li>
        </ol>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 divide-y divide-white/[0.05] border border-white/[0.06] bg-onyx">
        {profiles.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-display truncate text-sm text-ivory">
                {p.full_name || <span className="text-sand">Unnamed</span>}{" "}
                <span className="ml-2 text-[10px] tracking-[0.2em] text-gold uppercase">{p.role}</span>
                {!p.is_active && (
                  <span className="ml-2 text-[10px] tracking-[0.2em] text-red-300 uppercase">Inactive</span>
                )}
              </p>
              <p className="mt-0.5 truncate text-xs text-sand">{p.phone || "No phone"} · {p.id.slice(0, 8)}</p>
            </div>
            <button
              type="button"
              onClick={() => openEdit(p)}
              className="text-xs tracking-[0.15em] text-sand uppercase transition-colors hover:text-gold"
            >
              Edit
            </button>
          </div>
        ))}
        {profiles.length === 0 && (
          <p className="px-6 py-8 text-sm text-sand">No team members yet — add your first user in Supabase Auth.</p>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setEditing(null)}>
          <form onSubmit={save} onClick={(e) => e.stopPropagation()} className="w-full max-w-md border border-white/10 bg-onyx p-8">
            <h3 className="font-display text-lg text-ivory">Edit team member</h3>
            <label className="label mt-5" htmlFor="tm-name">Name</label>
            <input id="tm-name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="field" required />
            <label className="label mt-4" htmlFor="tm-phone">Phone</label>
            <input id="tm-phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="label" htmlFor="tm-role">Role</label>
                <select id="tm-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="field">
                  <option value="salesperson">Salesperson</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <label className="flex items-end gap-2 pb-3 text-sm text-ivory">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 accent-[#c9a962]" />
                Active
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="submit" className="btn-gold flex-1">Save</button>
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
