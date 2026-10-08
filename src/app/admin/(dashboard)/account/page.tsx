import type { Metadata } from "next";

import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { SetPasswordForm } from "@/components/admin/set-password-form";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "My account" };

export default async function AdminAccountPage() {
  const admin = await requireAdmin();

  return (
    <>
      <AdminPageHeading title="My account" />

      <div className="grid gap-8 lg:grid-cols-2">
        <section
          aria-labelledby="account-details-heading"
          className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
        >
          <h2
            id="account-details-heading"
            className="mb-4 text-lg font-bold text-navy-900 uppercase"
          >
            Your details
          </h2>
          <dl className="flex flex-col gap-3 text-sm">
            <div>
              <dt className="font-semibold text-navy-900">Name</dt>
              <dd className="text-muted-foreground">{admin.displayName}</dd>
            </div>
            <div>
              <dt className="font-semibold text-navy-900">Email</dt>
              <dd className="text-muted-foreground">{admin.email}</dd>
            </div>
          </dl>
        </section>

        <section
          aria-labelledby="change-password-heading"
          className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
        >
          <h2
            id="change-password-heading"
            className="mb-4 text-lg font-bold text-navy-900 uppercase"
          >
            Change password
          </h2>
          <SetPasswordForm submitLabel="Change password" />
        </section>
      </div>
    </>
  );
}
