import Link from "next/link";
import { dealer } from "@/lib/dealership";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-7xl text-gold/40">404</p>
      <h1 className="font-display mt-4 text-3xl text-ivory">This road doesn&apos;t exist.</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-sand">
        The page you&apos;re after may have been sold, moved or never registered. Let us point you
        back to the showroom floor.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-gold">Back to Home</Link>
        <Link href="/collection" className="btn-outline">Browse the Collection</Link>
      </div>
      <p className="mt-12 text-xs text-sand">{dealer.name}</p>
    </div>
  );
}