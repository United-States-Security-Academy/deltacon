import type { Metadata } from "next";

import { SetPasswordForm } from "@/components/admin/set-password-form";
import { requireAdmin } from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Choose your password" };

/** Reached from an invite or password-reset link, once signed in. */
export default async function SetPasswordPage() {
  const admin = await requireAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold text-navy-900 uppercase">
          Choose your password
        </h1>
        <p className="text-muted-foreground">
          Signed in as <strong>{admin.email}</strong>.
        </p>
      </div>
      <SetPasswordForm continueTo="/admin" submitLabel="Save and continue" />
    </div>
  );
}
