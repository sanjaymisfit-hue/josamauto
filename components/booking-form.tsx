"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { IconWhatsApp } from "@/components/icons";
import { whatsappLink, dealer } from "@/lib/dealership";
import { createClient } from "@/lib/supabase/client";
import type { Vehicle } from "@/lib/vehicles";

export default function BookingForm({ vehicles }: { vehicles: Vehicle[] }) {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"booking" | "test_drive">("booking");
  const [slug, setSlug] = useState(searchParams.get("vehicle") ?? "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const vehicle = vehicles.find((v) => v.slug === slug);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const label = vehicle
      ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
      : "General visit";
    try {
      const supabase = createClient();
      let vehicle_id: string | null = null;
      if (slug) {
        const { data } = await supabase
          .from("vehicles")
          .select("id")
          .eq("slug", slug)
          .single();
        vehicle_id = (data as { id: string } | null)?.id ?? null;
      }
      const { error } = await supabase.from("leads").insert({
        type,
        status: type === "test_drive" ? "scheduled" : "new",
        customer_name: name,
        customer_phone: phone,
        preferred_contact: "whatsapp",
        vehicle_id,
        message: `${label}${message ? `\n${message}` : ""}`,
        scheduled_date: date || null,
        scheduled_time: time || null,
        source_url: "/book",
      });
      if (error) throw error;
      // The DB trigger logs the 'created' activity row — no second write needed.
    } catch {
      // WhatsApp remains the primary channel
    } finally {
      setSaving(false);
      setDone(true);
      const waTime =
        time === "09:00:00" ? "morning" : time === "13:00:00" ? "afternoon" : time === "16:00:00" ? "evening" : "a convenient time";
      const wa =
        type === "test_drive"
          ? `Hello ${dealer.name}, I'd like to book a test drive of the ${label} on ${date || "a convenient date"} (${waTime}). My name is ${name}. ${message}`
          : `Hello ${dealer.name}, I'd like to book a showroom viewing (${label}) on ${date || "a convenient date"} (${waTime}). My name is ${name}. ${message}`;
      window.open(whatsappLink(wa), "_blank", "noopener,noreferrer");
    }
  };

  if (done) {
    return (
      <div className="border border-gold/30 bg-onyx p-8 text-center">
        <p className="font-display text-2xl text-ivory">Request received.</p>
        <p className="mx-auto mt-3 max-w-md text-sm text-sand">
          Our concierge will confirm your{" "}
          {type === "test_drive" ? "test drive" : "viewing"} on WhatsApp
          shortly. We have also opened the chat for you — just press send.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-white/[0.06] bg-onyx p-7 sm:p-9">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="bk-name">Full name</label>
          <input id="bk-name" required value={name} onChange={(e) => setName(e.target.value)} className="field" autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="bk-phone">Phone / WhatsApp</label>
          <input id="bk-phone" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="field" autoComplete="tel" />
        </div>
        <div>
          <label className="label" htmlFor="bk-type">I&apos;d like to</label>
          <select id="bk-type" value={type} onChange={(e) => setType(e.target.value as typeof type)} className="field">
            <option value="booking">Book a showroom viewing</option>
            <option value="test_drive">Book a test drive</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="bk-vehicle">Vehicle</label>
          <select id="bk-vehicle" value={slug} onChange={(e) => setSlug(e.target.value)} className="field">
            <option value="">General visit / not sure yet</option>
            {vehicles.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.year} {v.make} {v.model} {v.trim}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="bk-date">Preferred date</label>
          <input id="bk-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field" />
        </div>
        <div>
          <label className="label" htmlFor="bk-time">Preferred time</label>
          <select id="bk-time" value={time} onChange={(e) => setTime(e.target.value)} className="field">
            <option value="">Flexible</option>
            <option value="09:00:00">Morning (9–12)</option>
            <option value="13:00:00">Afternoon (12–4)</option>
            <option value="16:00:00">Evening (4–6)</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="bk-msg">Anything we should prepare? (optional)</label>
          <textarea id="bk-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-none" />
        </div>
      </div>
      <button type="submit" disabled={saving} className="btn-gold mt-8 w-full sm:w-auto">
        <IconWhatsApp size={15} />
        {saving ? "Sending…" : "Request booking via WhatsApp"}
      </button>
      <p className="mt-4 text-[11px] text-sand/70">
        Saved to our sales desk and opened in WhatsApp. We confirm every booking personally.
      </p>
    </form>
  );
}
