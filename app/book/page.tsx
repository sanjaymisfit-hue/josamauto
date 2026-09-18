import type { Metadata } from "next";
import { Suspense } from "react";
import { getVehicles } from "@/lib/vehicles-db";
import BookingForm from "@/components/booking-form";
import Reveal from "@/components/reveal";

export const metadata: Metadata = {
  title: "Book a Viewing or Test Drive",
  description:
    "Book a private showroom viewing or test drive at Josam Auto Company, Ridgeways Kiambu Road, Nairobi.",
};

export const revalidate = 60;

export default async function BookPage() {
  const vehicles = await getVehicles();
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 lg:px-8">
      <Reveal>
        <p className="eyebrow">Visit the Showroom</p>
        <h1 className="font-display mt-4 text-4xl text-ivory sm:text-5xl">
          Book your <span className="text-gold">visit.</span>
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-sand sm:text-base">
          Private viewings and unhurried test drives, six days a week.
          Pick a time — we confirm every booking personally on WhatsApp.
        </p>
      </Reveal>
      <div className="mt-10">
        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white/5" />}>
          <BookingForm vehicles={vehicles} />
        </Suspense>
      </div>
    </div>
  );
}
