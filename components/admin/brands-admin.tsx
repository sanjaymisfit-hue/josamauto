"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Brand } from "@/lib/vehicles-db";

export default function BrandsAdmin({ initial }: { initial: Brand[] }) {
  const [brands, setBrands] = useState(initial);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("brands").select("*").order("name");
    if (data) setBrands(data as Brand[]);
  };

  const add = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    const supabase = createClient();
    const { error } = await supabase.from("brands").insert({ name: name.trim() });
    if (error) {
      setError(error.message);
      return;
    }
    setName("");
    refresh();
  };

  const remove = async (id: string, brandName: string) => {
    if (!confirm(`Delete brand "${brandName}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("brands").delete().eq("id", id);
    if (error) {
      setError(error.message);
      return;
    }
    refresh();
  };

  return (
    <div>
      <form onSubmit={add} className="flex max-w-md gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New brand, e.g. Range Rover"
          className="field"
          aria-label="New brand name"
        />
        <button type="submit" className="btn-gold shrink-0">Add</button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <div className="mt-6 divide-y divide-white/[0.05] border border-white/[0.06] bg-onyx">
        {brands.map((b) => (
          <div key={b.id} className="flex items-center justify-between px-6 py-4">
            <p className="font-display text-sm text-ivory">{b.name}</p>
            <button
              type="button"
              onClick={() => remove(b.id, b.name)}
              className="text-xs tracking-[0.15em] text-sand uppercase transition-colors hover:text-red-300"
            >
              Delete
            </button>
          </div>
        ))}
        {brands.length === 0 && (
          <p className="px-6 py-8 text-sm text-sand">No brands yet.</p>
        )}
      </div>
    </div>
  );
}
