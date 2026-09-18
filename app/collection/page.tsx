import type { Metadata } from "next";
import { getVehicles } from "@/lib/vehicles-db";
import CollectionBrowser from "@/components/collection-browser";

export const metadata: Metadata = {
  title: "The Collection | Premium SUVs & Luxury Vehicles for Sale in Kenya",
  description:
    "Browse the Josam Auto Company collection: verified premium SUVs and luxury performance vehicles, available in Nairobi or sourced to order from Japan and the UK.",
};

import { Suspense } from "react";

export const revalidate = 60;

export default async function CollectionPage() {
  const vehicles = await getVehicles();
  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 lg:px-8">
      <p className="eyebrow">The Collection</p>
      <h1 className="font-display mt-4 max-w-3xl text-4xl text-ivory sm:text-5xl">
        Every vehicle, <span className="text-gold">verified.</span>
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-sand">
        A tightly curated line-up of premium SUVs and luxury performance vehicles. Prices include
        duty and registration. What you see is what you pay.
      </p>

      <div className="mt-10">
        <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white/5" />}>
          <CollectionBrowser vehicles={vehicles} />
        </Suspense>
      </div>
    </div>
  );
}
