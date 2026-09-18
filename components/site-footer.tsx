import Link from "next/link";
import Image from "next/image";
import { dealer, whatsappLink } from "@/lib/dealership";
import { IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";

export default function SiteFooter() {
  return (
    <footer className="border-t hairline bg-black">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="relative block h-16 w-44">
              <Image
                src="/images/josam.webp"
                alt="Josam Auto Company"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-sand">
              {dealer.description}
            </p>
            <p className="eyebrow mt-6 !text-[10px]">Premium SUVs · Luxury · Performance</p>
          </div>

          {/* Collection */}
          <div>
            <h3 className="font-display text-sm tracking-[0.25em] text-ivory uppercase">
              The Collection
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-sand">
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/collection">Browse everything</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/collection?bodyType=SUV">Premium SUVs</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/collection?make=Land+Rover">Land Rover</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/collection?make=Mercedes-Benz">Mercedes-Benz</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/collection?make=Lexus">Lexus</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-display text-sm tracking-[0.25em] text-ivory uppercase">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-sand">
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/import">Import concierge</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/financing">Financing</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/sell">Sell on behalf</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/book">Book a visit</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/faq">FAQs</Link></li>
              <li><Link className="inline-block py-1 transition-colors hover:text-gold" href="/contact">Contact us</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm tracking-[0.25em] text-ivory uppercase">
              Concierge
            </h3>
            <ul className="mt-5 space-y-4 text-sm text-sand">
              <li>
                <a href={`tel:${dealer.phone}`} className="btn-outline w-max !py-2 !px-4 mb-1 text-[11px]">
                  <IconPhone size={14} />
                  Call Us
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink("Hello Josam Auto Company.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 transition-colors hover:text-gold"
                >
                  <IconWhatsApp className="mt-0.5 shrink-0 text-gold" size={15} />
                  WhatsApp line
                </a>
              </li>
              <li>
                <a href={`mailto:${dealer.email}`} className="flex items-start gap-3 transition-colors hover:text-gold">
                  <IconMail className="mt-0.5 shrink-0 text-gold" size={15} />
                  {dealer.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconPin className="mt-0.5 shrink-0 text-gold" size={15} />
                <span>
                  {dealer.addressLine1}
                  <br />
                  {dealer.addressLine2}
                </span>
              </li>
            </ul>
            <ul className="mt-5 space-y-2 text-sm text-sand">
              {dealer.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4 text-xs">
                  <span>{h.days}</span>
                  <span className="text-ivory/70">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t hairline pt-8 sm:flex-row">
          <p className="text-xs text-sand">
            © {new Date().getFullYear()} {dealer.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {dealer.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] tracking-[0.2em] text-sand uppercase transition-colors hover:text-gold"
                >
                  {s.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/admin/login"
                className="text-[11px] tracking-[0.2em] text-sand uppercase transition-colors hover:text-gold"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
