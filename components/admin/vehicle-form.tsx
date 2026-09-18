"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Vehicle } from "@/lib/vehicles";

type Props = {
  initial?: Vehicle;
  isNew?: boolean;
};

const empty: Record<string, string> = {
  slug: "",
  make: "",
  model: "",
  trim: "",
  year: String(new Date().getFullYear()),
  priceKES: "0",
  mileageKm: "0",
  fuel: "Petrol",
  transmission: "Automatic",
  drive: "AWD",
  engineCc: "0",
  engineSummary: "",
  powerHp: "",
  torqueNm: "",
  accelSec: "",
  bodyType: "SUV",
  seats: "5",
  exterior: "",
  interior: "",
  condition: "Foreign Used",
  status: "available",
  location: "Nairobi Showroom",
  origin: "Japan",
  description: "",
};

function toForm(v?: Vehicle): Record<string, string> {
  if (!v) return { ...empty };
  return {
    slug: v.slug,
    make: v.make,
    model: v.model,
    trim: v.trim,
    year: String(v.year),
    priceKES: String(v.priceKES),
    mileageKm: String(v.mileageKm),
    fuel: v.fuel,
    transmission: v.transmission,
    drive: v.drive,
    engineCc: String(v.engineCc),
    engineSummary: v.engineSummary,
    powerHp: v.powerHp ? String(v.powerHp) : "",
    torqueNm: v.torqueNm ? String(v.torqueNm) : "",
    accelSec: v.accelSec ? String(v.accelSec) : "",
    bodyType: v.bodyType,
    seats: String(v.seats),
    exterior: v.exterior,
    interior: v.interior,
    condition: v.condition,
    status: v.status,
    location: v.location,
    origin: v.origin,
    description: v.description,
  };
}

export default function VehicleForm({ initial, isNew }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(toForm(initial));
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [isNewArrival, setIsNewArrival] = useState(
    // local stock has no flag — default non-featured to new arrival for new records
    isNew ? true : false,
  );
  const [features, setFeatures] = useState((initial?.features ?? []).join("\n"));
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const uploadPhotos = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const supabase = createClient();
      const slug = form.slug || `vehicle-${Date.now()}`;
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const path = `${slug}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from("vehicle-photos")
          .upload(path, file, { upsert: true });
        if (error) throw error;
        const { data } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setImages((imgs) => [...imgs, ...urls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        slug: form.slug.trim(),
        make: form.make.trim(),
        model: form.model.trim(),
        trim: form.trim.trim(),
        year: Number(form.year),
        price_kes: Number(form.priceKES),
        mileage_km: Number(form.mileageKm),
        fuel: form.fuel,
        transmission: form.transmission,
        drive: form.drive,
        engine_cc: Number(form.engineCc),
        engine_summary: form.engineSummary,
        power_hp: form.powerHp ? Number(form.powerHp) : null,
        torque_nm: form.torqueNm ? Number(form.torqueNm) : null,
        accel_sec: form.accelSec ? Number(form.accelSec) : null,
        body_type: form.bodyType,
        seats: Number(form.seats),
        exterior: form.exterior,
        interior: form.interior,
        condition: form.condition,
        status: form.status,
        location: form.location,
        origin: form.origin,
        featured,
        is_new_arrival: isNewArrival,
        images,
        description: form.description,
        features: features.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      if (!payload.slug || !payload.make || !payload.model) {
        throw new Error("Slug, make and model are required.");
      }
      let err;
      if (isNew) {
        ({ error: err } = await supabase
          .from("vehicles")
          .insert({ ...payload, created_by: user?.id ?? null, updated_by: user?.id ?? null }));
      } else {
        ({ error: err } = await supabase
          .from("vehicles")
          .update({ ...payload, updated_by: user?.id ?? null })
          .eq("slug", initial!.slug));
      }
      if (err) throw err;
      router.push("/admin/vehicles");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!initial || !confirm(`Delete ${initial.slug}? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("vehicles").delete().eq("slug", initial.slug);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin/vehicles");
    router.refresh();
  };

  const input = (k: string, label: string, type = "text", extra = "") => (
    <div>
      <label className="label" htmlFor={`vf-${k}`}>{label}</label>
      <input
        id={`vf-${k}`}
        type={type}
        value={form[k]}
        onChange={set(k)}
        className={`field ${extra}`}
      />
    </div>
  );

  return (
    <form onSubmit={onSave} className="mt-8 grid gap-10 lg:grid-cols-3">
      <div className="space-y-5 lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-3">
          {input("slug", "Slug (URL)", "text")}
          {input("make", "Make")}
          {input("model", "Model")}
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {input("trim", "Trim")}
          {input("year", "Year", "number")}
          {input("priceKES", "Price (KES)", "number")}
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          {input("mileageKm", "Mileage (km)", "number")}
          <div>
            <label className="label" htmlFor="vf-fuel">Fuel</label>
            <select id="vf-fuel" value={form.fuel} onChange={set("fuel")} className="field">
              {["Petrol", "Diesel", "Hybrid", "Electric", "Plug-in Hybrid"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="vf-trans">Transmission</label>
            <select id="vf-trans" value={form.transmission} onChange={set("transmission")} className="field">
              {["Automatic", "Manual", "CVT"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="vf-drive">Drive</label>
            <select id="vf-drive" value={form.drive} onChange={set("drive")} className="field">
              {["AWD", "4WD", "FWD", "RWD"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          {input("engineCc", "Engine (cc)", "number")}
          {input("engineSummary", "Engine summary")}
          {input("powerHp", "Power (hp)", "number")}
          {input("torqueNm", "Torque (Nm)", "number")}
        </div>
        <div className="grid gap-5 sm:grid-cols-4">
          {input("accelSec", "0–100 (s)", "number")}
          <div>
            <label className="label" htmlFor="vf-body">Body type</label>
            <select id="vf-body" value={form.bodyType} onChange={set("bodyType")} className="field">
              {["SUV", "Sedan", "Hatchback", "Coupe", "Pickup", "Wagon"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          {input("seats", "Seats", "number")}
          <div>
            <label className="label" htmlFor="vf-cond">Condition</label>
            <select id="vf-cond" value={form.condition} onChange={set("condition")} className="field">
              {["Foreign Used", "Locally Used", "Brand New"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {input("exterior", "Exterior")}
          {input("interior", "Interior")}
          {input("location", "Location")}
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="vf-status">Status</label>
            <select id="vf-status" value={form.status} onChange={set("status")} className="field">
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="in-transit">In transit</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="vf-origin">Origin</label>
            <select id="vf-origin" value={form.origin} onChange={set("origin")} className="field">
              {["Kenya", "Japan", "United Kingdom"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-6 pb-3">
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 accent-[#c9a962]" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ivory">
              <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="h-4 w-4 accent-[#c9a962]" />
              New arrival
            </label>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="vf-desc">Description</label>
          <textarea id="vf-desc" value={form.description} onChange={set("description")} rows={4} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="vf-feats">Features (one per line)</label>
          <textarea id="vf-feats" value={features} onChange={(e) => setFeatures(e.target.value)} rows={6} className="field" />
        </div>
      </div>

      <div>
        <div className="border border-white/[0.06] bg-onyx p-6">
          <h3 className="font-display text-base text-ivory">Photos ({images.length})</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {images.map((src) => (
              <div key={src} className="group relative aspect-[4/3] overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImages((imgs) => imgs.filter((i) => i !== src))}
                  className="absolute top-1 right-1 bg-black/80 px-2 py-1 text-xs text-red-300 opacity-0 group-hover:opacity-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <label className="btn-outline mt-4 w-full cursor-pointer text-center text-xs">
            {uploading ? "Uploading…" : "Upload photos"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => uploadPhotos(e.target.files)}
              disabled={uploading}
            />
          </label>
          <p className="mt-3 text-[11px] leading-relaxed text-sand/70">
            Stored in the Supabase <span className="text-ivory">vehicle-photos</span> bucket.
            First photo is the cover.
          </p>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button type="submit" disabled={saving || uploading} className="btn-gold mt-6 w-full">
          {saving ? "Saving…" : isNew ? "Create vehicle" : "Save changes"}
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={onDelete}
            className="mt-3 w-full border border-red-500/40 px-6 py-3 text-xs tracking-[0.2em] text-red-300 uppercase transition-colors hover:bg-red-500/10"
          >
            Delete vehicle
          </button>
        )}
      </div>
    </form>
  );
}
