import type { Metadata } from "next";
import Link from "next/link";
import EnquiryForm from "@/components/enquiry-form";
import Reveal from "@/components/reveal";
import SectionHeading from "@/components/section-heading";
import { whatsappLink } from "@/lib/dealership";
import { IconArrowRight, IconCard, IconCheck, IconClose, IconKey, IconShield, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sell On Behalf | Josam Auto Company",
  description:
    "Let Josam Auto Company sell your premium SUV or luxury car on your behalf. Professional presentation, qualified buyers, negotiation and paperwork handled.",
};

const steps = [
  {
    icon: IconKey,
    title: "1. Tell us about it",
    body: "Send the make, model, year, mileage and condition. Two photos are a great start, and we'll agree a realistic asking price together.",
  },
  {
    icon: IconShield,
    title: "2. We present & market it",
    body: "We handle professional photography, showroom presentation, online listing, viewings and test drives with vetted, qualified buyers.",
  },
  {
    icon: IconCard,
    title: "3. We sell & you get paid",
    body: "You approve every offer. We negotiate, handle paperwork and transfer, then you receive your funds minus our agreed commission.",
  },
];

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel" as const, required: true },
  { name: "vehicleMake", label: "Vehicle make & model", placeholder: "e.g. Toyota Land Cruiser Prado", required: true },
  { name: "year", label: "Year", type: "number" as const },
  { name: "mileage", label: "Mileage (km)", type: "number" as const },
  { name: "condition", label: "Condition", type: "select" as const, options: ["Excellent", "Good", "Fair", "Needs attention"] },
  { name: "expectation", label: "Expected value (KES)", type: "number" as const },
  { name: "message", label: "Anything else we should know?", type: "textarea" as const },
];

export default function SellPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 lg:px-8">
      <div className="max-w-3xl">
        <Reveal>
          <p className="eyebrow">Sell On Behalf</p>
          <h1 className="font-display mt-4 text-4xl text-ivory sm:text-5xl">
            We sell it for you, <span className="text-gold">for the best price.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-sand sm:text-base">
            Leave your premium SUV or luxury vehicle with us and we do the heavy lifting:
            presentation, marketing, viewings, negotiation and transfer. You skip the
            time-wasters and get paid when it sells.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 120} className="h-full">
            <div className="flex h-full flex-col border border-white/[0.06] bg-onyx p-8">
              <s.icon size={26} className="text-gold" />
              <h3 className="font-display mt-6 text-lg text-ivory">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sand">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <SectionHeading
          eyebrow="List Your Car"
          title={
            <>
              Start the <span className="text-gold">conversation</span>
            </>
          }
        />
      </Reveal>
      <div className="mt-8 max-w-3xl">
        <Reveal delay={120}>
          <EnquiryForm
            heading="Sell on behalf enquiry"
            intro="Complete the short form. It opens WhatsApp with your details pre-filled so our team can get straight back to you."
            subject="Sell on behalf enquiry | Josam Auto Company"
            fields={fields}
            submitLabel="Send enquiry via WhatsApp"
            leadKind="seller"
          />
        </Reveal>
      </div>

      <Reveal className="mt-20">
        <div className="relative overflow-hidden border border-gold/25 bg-gradient-to-br from-coal via-onyx to-black px-8 py-14 sm:px-14">
          <div className="pointer-events-none absolute inset-x-24 -top-24 h-48 bg-gold/10 blur-3xl" />
          <p className="eyebrow">Trade-In</p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl text-ivory sm:text-4xl">
            Upgrade your car <span className="text-gold">without the hassle.</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand">
            Upgrade your car without the hassle of selling it privately first.
            We accept trade-ins to help offset the cost of your next vehicle.
            Bring your car in for a free valuation and we&apos;ll apply its
            value toward the car you want.
          </p>
          <ul className="mt-6 max-w-xl space-y-3 text-sm">
            <li className="flex items-start gap-3 text-ivory/85">
              <IconCheck size={16} className="mt-0.5 shrink-0 text-gold" />
              <span><span className="text-gold">Accepted:</span> locally used vehicle → foreign used (import) vehicle</span>
            </li>
            <li className="flex items-start gap-3 text-ivory/85">
              <IconClose size={16} className="mt-0.5 shrink-0 text-red-300" />
              <span><span className="text-red-300">Not accepted:</span> trade-in vehicle → another trade-in vehicle</span>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/collection" className="btn-gold">
              Browse the Collection
              <IconArrowRight size={15} />
            </Link>
            <a
              href={whatsappLink("Hello Josam Auto Company, I'd like a part-exchange valuation on my current car.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <IconWhatsApp size={15} />
              Value My Trade-In
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}