import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVehicles, getVehicle } from "@/lib/vehicles-db";
import { similarVehicles } from "@/lib/vehicles";
import { formatKES, formatKm } from "@/lib/format";
import { dealer, whatsappLink } from "@/lib/dealership";
import VehicleGallery from "@/components/vehicle-gallery";
import VehicleCard from "@/components/vehicle-card";
import FinanceCalculator from "@/components/finance-calculator";
import Reveal from "@/components/reveal";
import {
  IconCalendar,
  IconCheck,
  IconClock,
  IconDrive,
  IconFuel,
  IconGauge,
  IconGear,
  IconPhone,
  IconPin,
  IconShield,
  IconWhatsApp,
} from "@/components/icons";

import CompareButton from "@/components/compare-button";

const statusLabel: Record<string, string> = {
  available: "Available",
  reserved: "Reserved",
  "in-transit": "In Transit",
  sold: "Sold",
};

export const revalidate = 60;
export const dynamicParams = true;

function specRow(label: string, value: string) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-white/[0.05] py-3.5 text-sm">
      <dt className="text-sand">{label}</dt>
      <dd className="text-right text-ivory">{value}</dd>
    </div>
  );
}

export async function generateStaticParams() {
  const vehicles = await getVehicles();
  return vehicles.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/collection/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) return { title: "Vehicle not found" };
  return {
    title: `${v.year} ${v.make} ${v.model} ${v.trim} for Sale`,
    description: `${formatKES(v.priceKES)} · ${v.fuel} · ${v.drive} · ${formatKm(v.mileageKm)}. Verified by ${dealer.name}. Reserve or enquire on WhatsApp.`,
    openGraph: {
      title: `${v.year} ${v.make} ${v.model} ${v.trim}`,
      description: `${formatKES(v.priceKES)} · ${v.fuel} · ${v.drive} · ${formatKm(v.mileageKm)}`,
      images: v.images[0] ? [{ url: v.images[0], alt: `${v.year} ${v.make} ${v.model}` }] : undefined,
    },
  };
}

export default async function VehicleDetailPage({ params }: PageProps<"/collection/[slug]">) {
  const { slug } = await params;
  const v = await getVehicle(slug);
  if (!v) notFound();

  const all = await getVehicles();
  const similar = similarVehicles(v, 3, all);
  const enquiry = `Hello ${dealer.name}, I'm interested in the ${v.year} ${v.make} ${v.model} ${v.trim} listed at ${formatKES(v.priceKES)}.`;

  const gallerySpecs = [
    { icon: IconFuel, label: v.fuel },
    { icon: IconGauge, label: `${v.engineCc} cc` },
    { icon: IconGear, label: v.transmission },
    { icon: IconDrive, label: v.drive },
    { icon: IconCalendar, label: `${v.year}` },
    { icon: IconClock, label: `${v.mileageKm.toLocaleString()} km` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Vehicle",
            name: `${v.year} ${v.make} ${v.model} ${v.trim}`,
            brand: { "@type": "Brand", name: v.make },
            model: `${v.model} ${v.trim}`,
            vehicleModelDate: String(v.year),
            vehicleIdentificationNumber: undefined,
            mileageFromOdometer: {
              "@type": "QuantitativeValue",
              value: v.mileageKm,
              unitCode: "KMT",
            },
            vehicleEngine: {
              "@type": "EngineSpecification",
              fuelType: v.fuel,
              engineDisplacement: { "@type": "QuantitativeValue", value: v.engineCc, unitCode: "CMQ" },
              enginePower: v.powerHp
                ? { "@type": "QuantitativeValue", value: v.powerHp, unitCode: "H29" }
                : undefined,
            },
            vehicleTransmission: v.transmission,
            driveWheelConfiguration: v.drive === "AWD" || v.drive === "4WD" ? "AllWheelDrive" : v.drive === "FWD" ? "FrontWheelDrive" : "RearWheelDrive",
            bodyType: v.bodyType,
            color: v.exterior,
            vehicleInteriorColor: v.interior,
            numberOfSeats: v.seats,
            image: v.images[0] ? `${dealer.siteUrl}${v.images[0]}` : undefined,
            offers: {
              "@type": "Offer",
              price: v.priceKES,
              priceCurrency: "KES",
              availability: v.status === "available" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
              seller: { "@type": "AutoDealer", name: dealer.name },
            },
          }),
        }}
      />
      {/* Breadcrumb */}
      <div className="border-b hairline bg-onyx/60 pt-20 sm:pt-24">
        <nav className="mx-auto max-w-7xl px-5 py-6 text-[11px] tracking-[0.18em] text-sand uppercase lg:px-8" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link href="/" className="transition-colors hover:text-gold">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href="/collection" className="transition-colors hover:text-gold">Collection</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-gold">{v.make} {v.model}</li>
          </ol>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          {/* Left, gallery + narrative */}
          <div>
            <Reveal>
              <p className="eyebrow">{v.condition} · {v.origin} · {v.location}</p>
              <h1 className="font-display mt-3 text-3xl text-ivory sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {v.year} {v.make} {v.model}{" "}
                <span className="text-gold">{v.trim}</span>
              </h1>
              <p className="mt-3 flex items-center gap-3 text-sm text-sand">
                <span className={`inline-flex items-center gap-2 ${v.status === "available" ? "text-gold" : "text-sand"}`}>
                  <IconShield size={14} /> {statusLabel[v.status]}
                </span>
                <span className="text-sand/50">·</span>
                <IconPin size={14} className="text-gold/70" /> {v.location}
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-8">
                <VehicleGallery images={v.images} title={`${v.year} ${v.make} ${v.model}`} status={v.status} />
              </div>
            </Reveal>

            <div className="mt-10 border-t hairline pt-8">
              <Reveal>
                <h2 className="font-display text-2xl text-ivory">The Story</h2>
                <p className="mt-4 text-sm leading-relaxed text-sand">{v.description}</p>
              </Reveal>
            </div>

            <div className="mt-10 border-t hairline pt-8">
              <Reveal>
                <h2 className="font-display text-2xl text-ivory">Features &amp; Equipment</h2>
                <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {v.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-ivory/85">
                      <IconCheck size={15} className="mt-0.5 shrink-0 text-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            <div className="mt-10 border-t hairline pt-8">
              <Reveal>
                <h2 className="font-display text-2xl text-ivory">Specifications</h2>
                <dl className="mt-4 max-w-xl">
                  {specRow("Year of manufacture", String(v.year))}
                  {specRow("Current location", v.location)}
                  {specRow("Condition", `${v.condition}, sourced from ${v.origin}`)}
                  {specRow("Mileage", formatKm(v.mileageKm))}
                  {specRow("Engine", v.engineSummary)}
                  {specRow("Displacement", `${v.engineCc} cc`)}
                  {specRow("Fuel", v.fuel)}
                  {specRow("Transmission", v.transmission)}
                  {specRow("Drivetrain", v.drive)}
                  {specRow("Power", v.powerHp ? `${v.powerHp} hp` : "—")}
                  {specRow("Torque", v.torqueNm ? `${v.torqueNm} Nm` : "—")}
                  {specRow("0–100 km/h", v.accelSec ? `${v.accelSec} secs` : "—")}
                  {specRow("Seats", String(v.seats))}
                  {specRow("Exterior", v.exterior)}
                  {specRow("Interior", v.interior)}
                  {specRow("Body type", v.bodyType)}
                </dl>
              </Reveal>
            </div>
          </div>

          {/* Right, buy panel */}
          <aside className="lg:pt-[4.5rem]">
            <div className="sticky top-28 space-y-6">
              <Reveal>
                <div className="border border-white/[0.06] bg-onyx p-7">
                  <p className="label !mb-1">Asking price</p>
                  <p className="font-display text-4xl text-gold">{formatKES(v.priceKES)}</p>
                  <p className="mt-1 text-xs text-sand">Duty paid · Registered · Inspected</p>

                  <dl className="mt-6 grid grid-cols-3 gap-3 border-t hairline pt-5 text-center">
                    {gallerySpecs.slice(0, 3).map((s) => (
                      <div key={s.label}>
                        <s.icon size={18} className="mx-auto text-gold" />
                        <dd className="mt-2 text-xs text-ivory">{s.label}</dd>
                      </div>
                    ))}
                  </dl>
                  <dl className="mt-4 grid grid-cols-3 gap-3 border-t hairline pt-5 text-center">
                    {gallerySpecs.slice(3).map((s) => (
                      <div key={s.label}>
                        <s.icon size={18} className="mx-auto text-gold" />
                        <dd className="mt-2 text-xs text-ivory">{s.label}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-7 space-y-3">
                    <a
                      href={whatsappLink(`${enquiry} Is it still available?`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold w-full"
                    >
                      <IconWhatsApp size={15} /> Enquire on WhatsApp
                    </a>
                    <a
                      href={whatsappLink(`${enquiry} I'd like to reserve this vehicle.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline w-full"
                    >
                      Reserve with Deposit
                    </a>
                    <CompareButton slug={v.slug} variant="detail" />
                    <Link
                      href={`/book?vehicle=${v.slug}`}
                      className="btn-outline w-full"
                    >
                      <IconClock size={15} />
                      Book Viewing / Test Drive
                    </Link>
                    <a
                      href={`tel:${dealer.phone}`}
                      className="btn-outline w-full"
                    >
                      <IconPhone size={15} />
                      Call Us
                    </a>
                  </div>
                  <p className="mt-5 text-[11px] leading-relaxed text-sand/70">
                    Viewing by appointment · Nationwide delivery available · Trade-ins welcome.
                  </p>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>

        {/* Finance */}
        <div className="mt-20 border-t hairline pt-12">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Finance</p>
                <h2 className="font-display mt-3 text-3xl text-ivory">
                  Estimate your <span className="text-gold">monthly payment</span>
                </h2>
              </div>
              <Link href="/financing" className="group text-[11px] tracking-[0.25em] text-gold uppercase">
                Full financing guide
                <span className="mt-1 block h-px w-full origin-left scale-x-100 bg-gold/40 transition-transform duration-300 group-hover:scale-x-75" />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="mt-8">
              <FinanceCalculator vehiclePrice={v.priceKES} />
            </div>
          </Reveal>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-20 border-t hairline pt-12">
            <Reveal>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">You may also consider</p>
                  <h2 className="font-display mt-3 text-3xl text-ivory">
                    Similar <span className="text-gold">vehicles</span>
                  </h2>
                </div>
                <Link href="/collection" className="group text-[11px] tracking-[0.25em] text-gold uppercase">
                  View all
                  <span className="mt-1 block h-px w-full origin-left scale-x-100 bg-gold/40 transition-transform duration-300 group-hover:scale-x-75" />
                </Link>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s, i) => (
                <Reveal key={s.slug} delay={i * 100} className="h-full">
                  <VehicleCard vehicle={s} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}