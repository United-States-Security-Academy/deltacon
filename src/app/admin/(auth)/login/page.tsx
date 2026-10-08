import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { SignInForm } from "@/components/admin/sign-in-form";
import {
  getSignedInAdmin,
  safeAdminRedirectPath,
} from "@/server/auth/require-admin";

export const metadata: Metadata = { title: "Sign in" };

const noticeMessages: Record<string, { text: string; isError: boolean }> = {
  "link-invalid": {
    text: "That link has expired or has already been used. Sign in, or ask for a new link.",
    isError: true,
  },
  "signed-out": { text: "You've been signed out.", isError: false },
};

export default async function AdminSignInPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const { redirectTo, error, signedOut } = await searchParams;

  // Already signed in as an admin: go straight to the admin area.
  if (await getSignedInAdmin()) redirect(safeAdminRedirectPath(redirectTo));
  const notice =
    noticeMessages[
      typeof error === "string" ? error : signedOut ? "signed-out" : ""
    ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-bold text-navy-900 uppercase">
          Admin sign in
        </h1>
        <p className="text-muted-foreground">Staff access only.</p>
      </div>
      {notice && (
        <p
          role={notice.isError ? "alert" : "status"}
          className={
            notice.isError
              ? "rounded-md border border-flag-red/40 bg-red-50 p-3 text-sm text-flag-red"
              : "rounded-md bg-green-50 p-3 text-sm text-green-800"
          }
        >
          {notice.text}
        </p>
      )}
      <SignInForm
        redirectTo={typeof redirectTo === "string" ? redirectTo : undefined}
      />
    </div>
  );
}
