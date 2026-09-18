import type { Metadata } from "next";
import EnquiryForm from "@/components/enquiry-form";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { IconCheck, IconGlobe, IconShip, IconShield } from "@/components/icons";

export const metadata: Metadata = {
  title: "Import Concierge | Source Any Vehicle From Japan or the UK",
  description:
    "Can't find it in our collection? Josam Auto Company sources premium vehicles directly from Japanese auctions and the UK, handling duty, clearing and registration with full transparency.",
};

const process = [
  {
    icon: IconGlobe,
    title: "1. Brief us",
    body: "Make, model, year, budget and must-haves. The more specific, the better the hunt.",
  },
  {
    icon: IconShield,
    title: "2. We source & verify",
    body: "Overseas service history and condition reports, independently reviewed before a single coin is spent.",
  },
  {
    icon: IconShip,
    title: "3. Landed cost, upfront",
    body: "A written breakdown of price, duty, clearing, transport and registration. No surprise margins on arrival.",
  },
  {
    icon: IconCheck,
    title: "4. Tracked delivery",
    body: "Milestone updates from purchase to Mombasa, clearing and final delivery to your door.",
  },
];

const assurance = [
  "Full history review on every import",
  "Independent third-party inspection reports",
  "Transparent KRA duty breakdown",
  "Fixed delivery timeline with tracking updates",
  "Escrow-friendly payment terms",
  "Full registration handled on your behalf",
];

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel" as const, required: true },
  { name: "vehicle", label: "Vehicle you want sourced", placeholder: "e.g. 2023 Porsche Cayenne GTS", required: true },
  { name: "budget", label: "Budget (KES, landed)", type: "number" as const },
  { name: "origin", label: "Preferred origin", type: "select" as const, options: ["Japan auctions", "United Kingdom", "Either / advise me"] },
  { name: "when", label: "When do you need it?", type: "select" as const, options: ["ASAP", "Within 1–2 months", "Within 3–6 months", "Just researching"] },
  { name: "message", label: "Anything else we should know?", type: "textarea" as const },
];

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 lg:px-8">
      <div className="max-w-3xl">
        <Reveal>
          <p className="eyebrow">Import Concierge</p>
          <h1 className="font-display mt-4 text-4xl text-ivory sm:text-5xl">
            Hunting something <span className="text-gold">specific?</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-sand sm:text-base">
            Our collection is only the beginning. We source premium vehicles to order, directly
            from Japanese auctions, UK dealers and European markets, and manage everything from
            the winning bid to registration plates on your driveway.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-px border hairline sm:grid-cols-2 lg:grid-cols-4">
        {process.map((p, i) => (
          <Reveal key={p.title} delay={i * 100} className="h-full">
            <div className="flex h-full flex-col bg-onyx p-8 transition-colors duration-500 hover:bg-coal">
              <p.icon size={26} className="text-gold" />
              <h3 className="font-display mt-6 text-lg text-ivory">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-20 grid gap-10 border-t hairline pt-14 lg:grid-cols-2">
        <Reveal>
          <SectionHeading
            eyebrow="The Josam Guarantee"
            title={
              <>
                Transparency, <span className="text-gold">by design</span>
              </>
            }
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {assurance.map((a) => (
              <li key={a} className="flex items-start gap-3 text-sm text-ivory/85">
                <IconCheck size={16} className="mt-0.5 shrink-0 text-gold" />
                {a}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-md text-sm leading-relaxed text-sand">
            No two orders are the same, so pricing is quoted per vehicle after the brief. Expect
            landed costs typically 3–6 months from confirmation, deposit terms that protect both
            parties, and one point of contact throughout.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <EnquiryForm
            heading="Start a sourcing request"
            intro="Complete the brief. It opens WhatsApp with your requirements pre-filled, and our import desk replies within one business day."
            subject="Import sourcing request | Josam Auto Company"
            fields={fields}
            submitLabel="Send brief via WhatsApp"
            leadKind="import"
          />
        </Reveal>
      </div>
    </div>
  );
}