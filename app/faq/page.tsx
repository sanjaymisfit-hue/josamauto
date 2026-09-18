import type { Metadata } from "next";
import Link from "next/link";
import { dealer, whatsappLink } from "@/lib/dealership";
import FaqAccordion from "@/components/faq-accordion";
import Reveal from "@/components/reveal";
import { IconArrowRight, IconWhatsApp } from "@/components/icons";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know about buying a premium SUV or luxury vehicle with Josam Auto Company: verification, financing, imports, test drives and selling on behalf.",
};

const faqs = [
  {
    q: "Who is Josam Auto Company?",
    a: "Josam Auto Company is Nairobi's premium dealership for hand-selected luxury SUVs and performance vehicles. From our Ridgeways Kiambu Road showroom we curate verified cars available locally and source to order from Japan, the UK and Europe.",
  },
  {
    q: "Where are you located, and when are you open?",
    a: "You'll find us at Ridgeways Kiambu Road, Nairobi, Kenya. We're open Monday to Friday 9:00 AM – 6:00 PM, Saturdays 9:00 AM – 4:00 PM, and Sundays by appointment. Walk-ins are welcome, but booking ahead guarantees a dedicated concierge.",
  },
  {
    q: "How can I reach your team?",
    a: "WhatsApp is fastest for enquiries, viewings and reservations. You can also call us on +254 116 011 711 or email concierge@josamauto.co.ke. We reply within one business day, usually much sooner.",
  },
  {
    q: "What types of vehicles do you sell?",
    a: "Premium SUVs, luxury saloons and performance vehicles from Toyota, Land Rover, Range Rover, Porsche, Audi, Mercedes-Benz, Lexus and BMW — a mix of showroom stock and fresh Japan and UK imports.",
  },
  {
    q: "How do you verify a vehicle's condition?",
    a: "Every vehicle carries a documented history with service records and passes a thorough pre-delivery inspection before it's listed. Cars marked available come with ready documents, and you're welcome to review all paperwork — or bring your own inspector — before you commit.",
  },
  {
    q: "Are your used cars for sale in Kenya inspected?",
    a: "Every used car we list goes through a condition assessment before it's advertised, and we disclose mileage, condition score and import history so you can buy with confidence.",
  },
  {
    q: "Can I book a viewing or test drive?",
    a: "Absolutely. Book a private viewing or test drive through our booking page in under a minute, or message us on WhatsApp. Viewings are unhurried, one car at a time, with honest advice and zero pressure.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes. We guide you through flexible asset-finance options structured around your cash flow, with transparent rates and approvals typically in 2–5 business days. Try the estimator on any vehicle page or the financing page, then send an enquiry and we'll line up the paperwork.",
  },
  {
    q: "Can you source or import a specific car for me?",
    a: "That's our Import Concierge. Tell us the make, model, year and budget and we'll hunt through Japanese auctions, UK dealers and European stock, then manage duty, clearing, registration and tracked delivery to your door — with milestone updates throughout.",
  },
  {
    q: "Can you sell my car on my behalf?",
    a: "Yes — our sell-on-behalf service presents your car to our qualified buyer network, handling photography, showroom presentation, viewings, negotiation and transfer paperwork. You approve every offer and receive your funds minus our agreed commission. List your car in minutes on our sell page.",
  },
  {
    q: "Do you deliver outside Nairobi?",
    a: "Yes, anywhere in Kenya. Your vehicle is detailed, fuelled and registered, then handed over at your doorstep — from Mombasa to Kisumu. A driving orientation is included if you'd like one.",
  },
  {
    q: "Are the documents ready for transfer?",
    a: "Every vehicle listed as available comes with ready documents, so you can buy and drive the same day. We handle the full transfer process on your behalf.",
  },
  {
    q: "Can I reserve a vehicle before it sells?",
    a: "Yes. Any vehicle — including in-transit stock — can be secured with a refundable reservation. Message us on WhatsApp and we'll hold it while you arrange viewing, financing or inspection.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 pt-32 pb-24 lg:px-8">
      <Reveal>
        <p className="eyebrow">Help Centre</p>
        <h1 className="font-display mt-4 text-4xl text-ivory sm:text-5xl">
          Frequently asked <span className="text-gold">questions.</span>
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-sand sm:text-base">
          Everything you need to know about buying, financing, importing or
          selling with {dealer.name}. Still unsure? Ask the concierge directly.
        </p>
      </Reveal>

      <Reveal delay={120} className="mt-12">
        <FaqAccordion items={faqs} />
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/collection" className="btn-gold">
            Browse the Collection
            <IconArrowRight size={15} />
          </Link>
          <a
            href={whatsappLink("Hello Josam Auto Company, I have a question.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            <IconWhatsApp size={15} />
            Ask on WhatsApp
          </a>
        </div>
      </Reveal>
    </div>
  );
}
