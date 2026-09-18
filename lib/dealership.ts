/**
 * Central dealership configuration.
 * ─────────────────────────────────────────────────────────────
 * TODO (Kush): replace the placeholder phone / WhatsApp / email /
 * address / social values below with Josam Auto Company's real
 * contact details. Every phone, WhatsApp, email and location link
 * across the whole site reads from this single file.
 */
export const dealer = {
  name: "Josam Auto Company",
  tagline: "Premium SUVs / Luxury / Performance",
  description:
    "Nairobi's premium dealership for hand-selected luxury SUVs and performance vehicles, verified, refined and delivered ready to drive.",

  // --- Contact (placeholders, update before launch) ---
  phoneDisplay: "+254 116 011 711",
  phone: "+254116011711",
  whatsapp: "254116011711",
  email: "concierge@josamauto.co.ke",

  // --- Showroom (placeholder) ---
  addressLine1: "Ridgeways Kiambu Road",
  addressLine2: "Nairobi, Kenya",
  mapsUrl: "https://maps.google.com/?q=Ridgeways+Kiambu+Road,+Nairobi,+Kenya",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "9:00 AM – 4:00 PM" },
    { days: "Sunday", time: "By appointment" },
  ],

  // --- Social (placeholders) ---
  socials: [
    { label: "Instagram", href: "https://instagram.com/josamauto" },
    { label: "TikTok", href: "https://tiktok.com/@josamauto" },
    { label: "Facebook", href: "https://facebook.com/josamauto" },
    { label: "X", href: "https://x.com/josamauto" },
  ],

  siteUrl: "https://josamauto.co.ke",
} as const;

/** Build a WhatsApp deep link with a pre-composed message. */
export function whatsappLink(message: string): string {
  return `https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(message)}`;
}
