import type { Metadata } from "next";

import { PasswordResetRequestForm } from "@/components/admin/password-reset-request-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold text-navy-900 uppercase">
          Reset your password
        </h1>
        <p className="text-muted-foreground">
          Enter your admin email and we&apos;ll send you a link to choose a new
          password.
        </p>
      </div>
      <PasswordResetRequestForm />
    </div>
  );
}
