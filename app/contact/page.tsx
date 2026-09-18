import type { Metadata } from "next";
import EnquiryForm from "@/components/enquiry-form";
import Reveal from "@/components/reveal";
import { dealer, whatsappLink } from "@/lib/dealership";
import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach the Josam Auto Company concierge by WhatsApp, phone or email, or visit the showroom for a private viewing.",
};

const cards = [
  {
    icon: IconWhatsApp,
    title: "WhatsApp concierge",
    body: "Fastest way to reach us: enquiries, viewings, reservations.",
    action: { label: "Open WhatsApp", href: whatsappLink("Hello Josam Auto Company, I'd like to get in touch.") },
  },
  {
    icon: IconPhone,
    title: "Call us",
    body: "Speak directly with a concierge for immediate assistance.",
    action: { label: "Call now", href: `tel:${dealer.phone}` },
  },
  {
    icon: IconMail,
    title: "Email",
    body: dealer.email,
    action: { label: "Send an email", href: `mailto:${dealer.email}` },
  },
  {
    icon: IconPin,
    title: "Showroom",
    body: `${dealer.addressLine1}, ${dealer.addressLine2}`,
    action: { label: "Open in Maps", href: dealer.mapsUrl },
  },
];

const fields = [
  { name: "name", label: "Full name", required: true },
  { name: "phone", label: "Phone / WhatsApp", type: "tel" as const, required: true },
  { name: "email", label: "Email", type: "email" as const },
  { name: "topic", label: "Topic", type: "select" as const, options: ["Buying a vehicle", "Import sourcing", "Financing", "Sell on behalf", "Reservation", "Other"] },
  { name: "message", label: "How can we help?", type: "textarea" as const, required: true },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 lg:px-8">
      <div className="max-w-3xl">
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="font-display mt-4 text-4xl text-ivory sm:text-5xl">
            Talk to the <span className="text-gold">concierge.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-sand sm:text-base">
            Whether it&apos;s a viewing, a reservation, finance or a vehicle you&apos;ve spotted on
            another continent: one message and we take it from there.
          </p>
        </Reveal>
      </div>

      <div className="mt-14 grid gap-px border hairline sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 80} className="h-full">
            <div className="flex h-full flex-col bg-onyx p-7">
              <c.icon size={24} className="text-gold" />
              <h2 className="font-display mt-5 text-base text-ivory">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-sand">{c.body}</p>
              <a
                href={c.action.href}
                target={c.action.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="mt-5 inline-block text-[11px] tracking-[0.25em] text-gold uppercase transition-colors hover:text-gold-light"
              >
                {c.action.label} →
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <EnquiryForm
            heading="Send a message"
            intro="Your message opens WhatsApp pre-filled; we reply within one business day, usually much sooner."
            subject="Website enquiry | Josam Auto Company"
            fields={fields}
            submitLabel="Send via WhatsApp"
          />
        </Reveal>
        <Reveal delay={120}>
          <div className="border border-white/[0.06] bg-onyx p-7 sm:p-9">
            <h2 className="font-display text-2xl text-ivory">Visit the showroom</h2>
            <ul className="mt-6 space-y-5 text-sm">
              <li className="flex items-start gap-3">
                <IconPin size={17} className="mt-0.5 shrink-0 text-gold" />
                <a href={dealer.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-ivory transition-colors hover:text-gold">
                  {dealer.addressLine1}
                  <br />
                  {dealer.addressLine2}
                </a>
              </li>
              <li>
                <a href={`tel:${dealer.phone}`} className="btn-outline w-max !py-2 !px-4">
                  <IconPhone size={14} />
                  Call Us
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMail size={17} className="mt-0.5 shrink-0 text-gold" />
                <a href={`mailto:${dealer.email}`} className="text-ivory transition-colors hover:text-gold">
                  {dealer.email}
                </a>
              </li>
            </ul>
            <div className="mt-8 border-t hairline pt-6">
              <h3 className="flex items-center gap-3 font-display text-base text-ivory">
                <IconClock size={17} className="text-gold" /> Opening hours
              </h3>
              <ul className="mt-4 divide-y divide-white/[0.05]">
                {dealer.hours.map((h) => (
                  <li key={h.days} className="flex justify-between py-3 text-sm">
                    <span className="text-sand">{h.days}</span>
                    <span className="text-ivory">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}