"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { whatsappLink } from "@/lib/dealership";
import { IconClose, IconMenu, IconWhatsApp, IconPhone } from "@/components/icons";

import { useCompare } from "@/lib/compare-context";

const nav = [
  { label: "Collection", href: "/collection" },
  { label: "Compare", href: "/compare" },
  { label: "Import Concierge", href: "/import" },
  { label: "Financing", href: "/financing" },
  { label: "Sell Your Car", href: "/sell" },
  { label: "Contact", href: "/contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { selectedSlugs } = useCompare();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] transition-all duration-500 ${scrolled ? "bg-black/40 backdrop-blur-xl border-b hairline shadow-2xl" : "bg-transparent"
          }`}
        style={{ WebkitBackdropFilter: scrolled ? "blur(24px)" : "none" }}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" aria-label="Josam Auto Company, home" className="relative block h-11 w-36">
            <Image
              src="/images/josam.webp"
              alt="Josam Auto Company"
              fill
              priority
              className="object-contain object-left"
              style={{ mixBlendMode: "screen" }}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${pathname?.startsWith(item.href)
                  ? "text-gold"
                  : "text-ivory/70 hover:text-ivory"
                  }`}
              >
                {item.label}
                {item.href === "/compare" && selectedSlugs.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-gold/20 px-2 py-0.5 text-[9px] font-semibold text-gold">
                    {selectedSlugs.length}
                  </span>
                )}
              </Link>
            ))}
            <a
              href={whatsappLink("Hello Josam Auto Company, I'd like to speak to your concierge.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold !py-2.5 !px-5"
            >
              <IconWhatsApp size={14} />
              Concierge
            </a>
          </nav>

          <button
            type="button"
            className="relative z-[110] text-gold lg:hidden p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <IconClose size={28} /> : <IconMenu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile nav outside the header to prevent backdrop-filter containing block CSS bugs */}
      <div
        className={`fixed inset-0 top-20 z-[90] flex flex-col overflow-y-auto border-t border-white/[0.07] bg-black/70 shadow-2xl transition-all duration-300 lg:hidden ${open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-4"}`}
        style={{ WebkitBackdropFilter: "blur(32px)", backdropFilter: "blur(32px)" }}
      >
        <nav className="flex flex-col gap-1 px-6 pt-10" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between border-b hairline py-5 font-display text-2xl tracking-wide ${pathname?.startsWith(item.href) ? "text-gold" : "text-ivory"
                }`}
            >
              <span>{item.label}</span>
              {item.href === "/compare" && selectedSlugs.length > 0 && (
                <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-black">
                  {selectedSlugs.length} selected
                </span>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-4 px-6 pb-12">
          <a
            href={whatsappLink("Hello Josam Auto Company, I'd like to speak to your concierge.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold w-full"
          >
            <IconWhatsApp size={15} />
            WhatsApp Concierge
          </a>
          <a
            href="tel:+254116011711"
            className="btn-outline w-full"
          >
            <IconPhone size={15} />
            Call Us
          </a>
        </div>
      </div>
    </>
  );
}
