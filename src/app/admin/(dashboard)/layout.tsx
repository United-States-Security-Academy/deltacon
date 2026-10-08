import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/server/auth/require-admin";

/** Every page in this group requires a signed-in admin (checked on the server). */
export default async function AdminDashboardLayout({
  children,
}: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
