import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/admin-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // /admin/login stays public — middleware also enforces this
  return (
    <AdminShell>{children}</AdminShell>
  );
}

async function AdminShell({ children }: { children: React.ReactNode }) {
  // Rendered inside /admin/* including login; only fetch user for nav
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="pt-20">
      {user && <AdminNav email={user.email ?? ""} />}
      {children}
    </div>
  );
}
