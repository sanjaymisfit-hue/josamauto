"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// NOTE: Leads + Team links hidden for the client demo (Phase 2 refine later).
// Routes still exist at /admin/leads and /admin/team.
const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Vehicles", href: "/admin/vehicles" },
  { label: "Brands", href: "/admin/brands" },
  { label: "View site", href: "/" },
];

export default function AdminNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="border-b hairline bg-onyx">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-4 lg:px-8">
        <p className="font-display text-sm tracking-[0.25em] text-gold uppercase">
          Josam Admin
        </p>
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {nav.map((n) => (
            <Link
              key={n.href + n.label}
              href={n.href}
              className={`text-sm transition-colors hover:text-gold ${pathname === n.href || (n.href !== "/admin" && pathname.startsWith(n.href)) ? "text-gold" : "text-sand"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-xs text-sand sm:block">{email}</span>
          <button
            type="button"
            onClick={signOut}
            className="text-xs tracking-[0.15em] text-sand uppercase transition-colors hover:text-gold"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
