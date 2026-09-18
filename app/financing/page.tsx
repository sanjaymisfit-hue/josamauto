import type { Metadata } from "next";
import FinanceCalculator from "@/components/finance-calculator";
import EnquiryForm from "@/components/enquiry-form";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { IconCard, IconCheck, IconClock } from "@/components/icons";

export const metadata: Metadata = {
  title: "Financing for Premium Vehicles",
  description:
    "Flexible financing for your next luxury SUV or performance car. Estimate your monthly payment and apply in minutes.",
};

const partners = [
  { name: "Asset-finance guidance", body: "We help you compare asset-finance options with competitive reducing-balance rates and terms up to 60 months." },
  { name: "Payroll-friendly options", body: "Flexible structures that extend your borrowing power, including payroll-based repayments where available." },
  { name: "Flexible deposits", body: "From as little as 10% deposit, sized to your cash flow rather than a fixed rule." },
  { name: "Same-week approvals", body: "Streamlined documentation and digital submission mean answers in days, not weeks." },
];

const checklist = [
  "Copy of national ID",
  "Proof of income (6 months) or audited accounts",
  "Bank statements (3–6 months)",
  "Completed application form",
  "Vehicle pro-forma invoice (we provide this)",
];

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel" as const, required: true },
  { name: "targetVehicle", label: "Vehicle you have in mind", placeholder: "e.g. 2022 Mercedes-Benz GLE 450" },
  { name: "price", label: "Target price (KES)", type: "number" as const },
  { name: "deposit", label: "Planned deposit (KES)", type: "number" as const },
  { name: "employment", label: "Employment status", type: "select" as const, options: ["Employed", "Self-employed", "Business owner", "Other"] },
  { name: "message", label: "Anything else?", type: "textarea" as const },
];

export default function FinancingPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 lg:px-8">
      <div className="max-w-3xl">
        <Reveal>
          <p className="eyebrow">Financing</p>
          <h1 className="font-display mt-4 text-4xl text-ivory sm:text-5xl">
            Drive now, <span className="text-gold">finance well.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-sand sm:text-base">
            We help you structure asset finance around your cash
            flow: transparent rates, honest approvals and no hidden margins. Estimate your
            payment below, then let the concierge take it from there.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        <Reveal>
          <FinanceCalculator vehiclePrice={10000000} />
        </Reveal>
        <div className="grid content-start gap-px border hairline sm:grid-cols-2">
          {partners.map((p) => (
            <div key={p.name} className="flex flex-col bg-onyx p-7">
              <IconCard size={22} className="text-gold" />
              <h3 className="font-display mt-5 text-base text-ivory">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sand">{p.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 grid gap-10 border-t hairline pt-14 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="Documentation"
            title={
              <>
                What you&apos;ll <span className="text-gold">need</span>
              </>
            }
          />
          <ul className="mt-8 space-y-3">
            {checklist.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm text-ivory/85">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-gold" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-8 flex items-center gap-3 text-sm text-sand">
            <IconClock size={16} className="shrink-0 text-gold" />
            Approval typically takes 2–5 business days from complete documentation.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <EnquiryForm
            heading="Start a financing enquiry"
            intro="Tell us about the vehicle and your situation. We'll guide you through the options and line up the paperwork."
            subject="Financing enquiry | Josam Auto Company"
            fields={fields}
            submitLabel="Send via WhatsApp"
            leadKind="financing"
          />
        </Reveal>
      </div>
    </div>
  );
}