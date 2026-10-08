import type { Metadata } from "next";

import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { InviteAdminForm } from "@/components/admin/invite-admin-form";
import { RemoveAdminButton } from "@/components/admin/remove-admin-button";
import { formatAdminDate } from "@/lib/submissions/submission-status";
import { requireAdmin } from "@/server/auth/require-admin";
import { listAdmins } from "@/server/queries/admin-users";

export const metadata: Metadata = { title: "Admin users" };

export default async function AdminUsersPage() {
  const currentAdmin = await requireAdmin();
  const admins = await listAdmins(currentAdmin.userId);

  return (
    <>
      <AdminPageHeading
        title="Admin users"
        description="People who can sign in to manage the website. There is no public sign-up: new admins join by invitation."
      />

      <section
        aria-labelledby="current-admins-heading"
        className="mb-8 rounded-xl border border-border bg-white shadow-sm"
      >
        <h2
          id="current-admins-heading"
          className="border-b border-border px-5 py-4 text-lg font-bold text-navy-900 uppercase"
        >
          Current admins ({admins.length})
        </h2>
        <ul className="divide-y divide-border">
          {admins.map((admin) => {
            const isCurrentAdmin = admin.userId === currentAdmin.userId;
            return (
              <li
                key={admin.userId}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-navy-900">
                    {admin.displayName}
                    {isCurrentAdmin && (
                      <span className="ml-2 rounded-full bg-navy-100 px-2 py-0.5 text-xs font-semibold text-navy-900">
                        You
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">
                    {admin.email} · added {formatAdminDate(admin.createdAt)}
                  </p>
                </div>
                {!isCurrentAdmin && admins.length > 1 && (
                  <RemoveAdminButton
                    userId={admin.userId}
                    displayName={admin.displayName}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <section
        aria-labelledby="invite-admin-heading"
        className="rounded-xl border border-border bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex flex-col gap-1">
          <h2
            id="invite-admin-heading"
            className="text-lg font-bold text-navy-900 uppercase"
          >
            Invite an admin
          </h2>
          <p className="text-sm text-muted-foreground">
            They&apos;ll receive an email with a link to choose their password.
            The link can be used once and expires after 24 hours.
          </p>
        </div>
        <InviteAdminForm />
      </section>
    </>
  );
}
