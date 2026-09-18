"use client";

import { useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { IconWhatsApp } from "@/components/icons";
import { whatsappLink } from "@/lib/dealership";
import { createClient } from "@/lib/supabase/client";
import type { LeadKind } from "@/lib/lead-types";

export interface EnquiryField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
  span?: "full" | "half";
}

type Props = {
  heading: string;
  intro?: string;
  /** First line of the WhatsApp message, e.g. "Sell your car enquiry". */
  subject: string;
  fields: EnquiryField[];
  submitLabel?: string;
  /** Lead category saved to the sales desk. Contact page auto-maps its topic. */
  leadKind?: LeadKind;
  vehicleSlug?: string;
};

/** Contact-page topics → lead types (must match leads_type_check) */
const TOPIC_KIND: Record<string, LeadKind> = {
  "Buying a vehicle": "buying",
  "Import sourcing": "import",
  Financing: "financing",
  "Sell on behalf": "seller",
  Reservation: "booking",
};

/**
 * Saves the enquiry to the sales desk (Supabase leads), then opens WhatsApp.
 * WhatsApp always opens — a failed save never blocks the customer.
 */
export default function EnquiryForm({
  heading,
  intro,
  subject,
  fields,
  submitLabel = "Send via WhatsApp",
  leadKind = "general",
  vehicleSlug = "",
}: Props) {
  const pathname = usePathname();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const set = (name: string, value: string) =>
    setValues((v) => ({ ...v, [name]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const lines = fields
      .map((f) => `${f.label}: ${values[f.name] || "—"}`)
      .join("\n");
    const message = `${subject}\n${"─".repeat(24)}\n${lines}`;
    // Fire-and-forget lead capture — never block WhatsApp
    saveLead().finally(() => {
      window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
    });
  };

  const saveLead = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const kind =
        (values.topic && TOPIC_KIND[values.topic]) || leadKind;
      const detail = fields
        .filter((f) => !["name", "phone", "email"].includes(f.name))
        .map((f) => `${f.label}: ${values[f.name] || "—"}`)
        .join("\n");
      const supabase = createClient();
      // Seller-car split: "Toyota Prado ..." → make + model
      const makeModel = (values.vehicleMake || "").trim().split(/\s+/);
      const payload: Record<string, unknown> = {
        type: kind,
        status: "new",
        customer_name: values.name || values["full name"] || "—",
        customer_phone: values.phone || "—",
        customer_email: values.email || "",
        preferred_contact: "whatsapp",
        message: detail,
        source_url: pathname,
      };
      if (kind === "financing") {
        payload.employment_type = values.employment || "";
        if (values.deposit) payload.down_payment_kes = Number(values.deposit) || null;
      }
      if (kind === "seller") {
        if (makeModel.length > 0) payload.seller_car_make = makeModel[0];
        if (makeModel.length > 1) payload.seller_car_model = makeModel.slice(1).join(" ");
        if (values.year) payload.seller_car_year = Number(values.year) || null;
        if (values.mileage) payload.seller_car_mileage_km = Number(values.mileage) || null;
        if (values.expectation) payload.seller_expected_price_kes = Number(values.expectation) || null;
      }
      if (vehicleSlug) {
        const { data } = await supabase
          .from("vehicles")
          .select("id")
          .eq("slug", vehicleSlug)
          .single();
        if (data) payload.vehicle_id = (data as { id: string }).id;
      }
      const { error } = await supabase.from("leads").insert(payload);
      if (error) throw error;
      // The DB trigger logs the 'created' activity row — no second write needed.
    } catch {
      // Silently ignore — WhatsApp is the primary channel
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="border border-white/[0.06] bg-onyx p-7 sm:p-9"
      aria-label={heading}
    >
      <h2 className="font-display text-2xl text-ivory">{heading}</h2>
      {intro && <p className="mt-2 text-sm leading-relaxed text-sand">{intro}</p>}

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.name} className={f.span === "half" ? "" : "sm:col-span-2"}>
            <label className="label" htmlFor={`enq-${f.name}`}>
              {f.label}
              {f.required ? "" : " (optional)"}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={`enq-${f.name}`}
                rows={4}
                required={f.required}
                placeholder={f.placeholder}
                className="field resize-none"
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            ) : f.type === "select" ? (
              <select
                id={`enq-${f.name}`}
                required={f.required}
                className="field"
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
              >
                <option value="">Select…</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={`enq-${f.name}`}
                type={f.type ?? "text"}
                required={f.required}
                placeholder={f.placeholder}
                className="field"
                value={values[f.name] ?? ""}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      <button type="submit" className="btn-gold mt-8 w-full sm:w-auto">
        <IconWhatsApp size={15} />
        {submitLabel}
      </button>
      <p className="mt-4 text-[11px] text-sand/70">
        Saved to our sales desk and opened in WhatsApp with your details pre-filled.
      </p>
    </form>
  );
}
