import Image from "next/image";
import Link from "next/link";
import { getFeatured, getNewArrivals, getBrands } from "@/lib/vehicles-db";
import { dealer, whatsappLink } from "@/lib/dealership";
import VehicleCard from "@/components/vehicle-card";
import SectionHeading from "@/components/section-heading";
import Reveal from "@/components/reveal";
import {
  IconArrowRight,
  IconCard,
  IconClock,
  IconGlobe,
  IconKey,
  IconPhone,
  IconPin,
  IconShield,
  IconWhatsApp,
} from "@/components/icons";

const heroImage = "/images/range-rover-hero-opt.webp";

export const revalidate = 60;

const fallbackMarques = [
  "Range Rover",
  "Mercedes-Benz",
  "Porsche",
  "Lexus",
  "BMW",
  "Audi",
  "Land Rover",
  "Toyota",
];

const pillars = [
  {
    icon: IconShield,
    no: "01",
    title: "Verified Provenance",
    body: "Every vehicle carries a documented history and passes a thorough pre-delivery inspection. No stories, only evidence.",
  },
  {
    icon: IconGlobe,
    no: "02",
    title: "Import Concierge",
    body: "We source directly from Japan, the UK and beyond, manage duty, clearing and registration, and keep you informed at every milestone.",
  },
  {
    icon: IconCard,
    no: "03",
    title: "Tailored Financing",
    body: "Structured around your cash flow with flexible terms: transparent rates, swift approvals, no hidden margins.",
  },
  {
    icon: IconKey,
    no: "04",
    title: "Doorstep Delivery",
    body: "Detailed, fuelled and registered, your vehicle is handed over at your doorstep anywhere in Kenya, with a driving orientation if you wish.",
  },
];

const testimonials = [
  {
    quote:
      "The Prado I sourced through Josam arrived exactly as documented: service records, even the radio code. The most transparent purchase I've made in twenty years of buying cars in Nairobi.",
    name: "Daniel K.",
    detail: "Land Cruiser 300 · Nairobi",
  },
  {
    quote:
      "From the first WhatsApp message to delivery in Mombasa, everything was handled. Financing was approved in two days and the car was delivered detailed, fuelled and registered.",
    name: "Wanjiru M.",
    detail: "Mercedes-Benz GLE · Mombasa",
  },
  {
    quote:
      "They told me what not to buy. That honesty earned them the Range Rover sale, and every car I'll buy after it.",
    name: "Brian O.",
    detail: "Range Rover Sport · Karen",
  },
];

export default async function HomePage() {
  const [featured, arrivals, brands] = await Promise.all([
    getFeatured(6),
    getNewArrivals(4),
    getBrands(),
  ]);
  const marques = brands.length > 0 ? brands.map((b) => b.name) : fallbackMarques;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Premium SUV at Josam Auto Company"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-5 pt-32 pb-20 sm:pt-40 lg:px-8">
          <Reveal>
            <p className="eyebrow">Nairobi · Premium SUVs · Luxury · Performance</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display mt-6 max-w-4xl text-4xl leading-[1.05] text-ivory sm:text-5xl lg:text-[5.25rem]">
              Driven by <span className="text-gold-gradient">Distinction</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ivory/80 sm:text-lg">
              {dealer.name} curates Kenya&apos;s finest collection of premium SUVs and luxury
              performance vehicles. Each one verified, refined and delivered ready to drive.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/collection" className="btn-gold">
                Explore the Collection
                <IconArrowRight size={15} />
              </Link>
              <Link href="/sell" className="btn-outline">
                <IconKey size={15} />
                Sell On Behalf
              </Link>
              <a
                href={whatsappLink("Hello Josam Auto Company, I'd like help finding my next vehicle.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <IconWhatsApp size={15} />
                Concierge on WhatsApp
              </a>
            </div>
          </Reveal>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </section>

      {/* ── Marquee ──────────────────────────────────────── */}
      <section aria-label="Marques we specialise in" className="overflow-hidden border-b hairline bg-black py-6">
        <div className="flex w-max animate-marquee items-center gap-10">
          {[...marques, ...marques].map((m, i) => (
            <span
              key={`${m}-${i}`}
              className="flex items-center gap-10 whitespace-nowrap font-display text-lg tracking-[0.35em] text-gold/50 uppercase"
            >
              {m}
              <span className="text-gold/30">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── Featured collection ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The Collection"
            title={
              <>
                Featured <span className="text-gold">Vehicles</span>
              </>
            }
            description="Hand-selected examples in stock right now, verified, inspected and ready for a private viewing."
            linkHref="/collection"
            linkLabel="View all"
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v, i) => (
            <Reveal key={v.slug} delay={i * 100} className="h-full">
              <VehicleCard vehicle={v} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Pillars ──────────────────────────────────────── */}
      <section className="border-y hairline bg-onyx">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="The Josam Standard"
              title={
                <>
                  An experience as considered as <span className="text-gold">the cars</span>
                </>
              }
              align="center"
            />
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden border hairline sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.no} delay={i * 100} className="h-full">
                <div className="flex h-full flex-col bg-black p-8 transition-colors duration-500 hover:bg-coal">
                  <div className="flex items-center justify-between">
                    <p.icon size={26} className="text-gold" />
                    <span className="font-display text-sm text-gold/40">{p.no}</span>
                  </div>
                  <h3 className="font-display mt-14 text-lg text-ivory">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-sand">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── New arrivals ─────────────────────────────────── */}
      {arrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Fresh off the Ship"
              title={
                <>
                  New <span className="text-gold">Arrivals</span>
                </>
              }
              linkHref="/collection"
              linkLabel="View all"
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {arrivals.map((v, i) => (
              <Reveal key={v.slug} delay={i * 100} className="h-full">
                <VehicleCard vehicle={v} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Import CTA ───────────────────────────────────── */}
      <section className="border-y hairline bg-onyx">
        <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
          <div className="relative overflow-hidden border border-gold/25 bg-gradient-to-br from-coal via-onyx to-black px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-x-24 -top-24 h-48 bg-gold/10 blur-3xl" />
            <Reveal>
              <p className="eyebrow">Import Concierge</p>
              <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl text-ivory sm:text-4xl">
                Hunting a specific car? <span className="text-gold">We source it for you.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-sand">
                Direct access to Japanese auctions, UK dealers and European stock, with verified
                condition reports, transparent duty breakdowns and tracked delivery to your door.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/import" className="btn-gold">
                  Start a Sourcing Request
                </Link>
                <Link href="/financing" className="btn-outline">
                  Financing Options
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Sell On Behalf CTA ─────────────────────────── */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <div className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-20">
              <div className="lg:w-[45%]">
                <p className="eyebrow">Sell On Behalf</p>
                <h2 className="font-display mt-4 text-3xl text-ivory sm:text-4xl">
                  We sell your car <span className="text-gold">on your behalf.</span>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-sand">
                  Skip the tyre-kickers and time-wasters. We present your vehicle to our qualified buyer network, handle photography, viewings, negotiation and paperwork, and secure the best market price while you wait for the payout.
                </p>
                <div className="mt-8">
                  <Link href="/sell" className="btn-gold">
                    List Your Car With Us
                  </Link>
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full lg:w-[55%]">
                <Image
                  src="/images/vehicles/porsche-cayenne-platinum-edition-kdh/1.webp"
                  alt="Porsche Cayenne luxury presentation"
                  fill
                  className="object-cover ring-1 ring-white/10"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Client Stories"
            title={
              <>
                Word of mouth, <span className="text-gold">earned</span>
              </>
            }
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 120} className="h-full">
              <figure className="flex h-full flex-col border border-white/[0.06] bg-onyx p-8">
                <span className="font-display text-5xl leading-none text-gold/40">”</span>
                <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ivory/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-6 border-t hairline pt-4">
                  <p className="font-display text-sm text-gold">{t.name}</p>
                  <p className="mt-0.5 text-xs text-sand">{t.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Visit CTA ────────────────────────────────────── */}
      <section className="border-t hairline bg-onyx">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div>
              <p className="eyebrow">Visit the Showroom</p>
              <h2 className="font-display mt-4 max-w-lg text-3xl text-ivory sm:text-4xl">
                See them in the metal. <span className="text-gold">Coffee is on us.</span>
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-sand">
                Private viewings, unhurried test drives and honest advice, by appointment or on a
                whim. We are open six days a week.
              </p>
              <ul className="mt-8 space-y-3 text-sm text-ivory/80">
                <li className="flex items-center gap-3">
                  <IconPin size={16} className="shrink-0 text-gold" />
                  <a
                    href={dealer.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-gold"
                  >
                    {dealer.addressLine1}, {dealer.addressLine2}
                  </a>
                </li>
                <li>
                  <a href={`tel:${dealer.phone}`} className="btn-outline w-max !py-2 !px-4 text-[11px]">
                    <IconPhone size={14} />
                    Call Us
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="border border-white/[0.06] bg-black p-8">
              <h3 className="flex items-center gap-3 font-display text-lg text-ivory">
                <IconClock size={18} className="text-gold" /> Opening Hours
              </h3>
              <ul className="mt-6 divide-y divide-white/[0.05]">
                {dealer.hours.map((h) => (
                  <li key={h.days} className="flex justify-between py-3.5 text-sm">
                    <span className="text-sand">{h.days}</span>
                    <span className="text-ivory">{h.time}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/book"
                className="btn-gold mt-8 w-full"
              >
                <IconClock size={15} />
                Book a Private Viewing
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
