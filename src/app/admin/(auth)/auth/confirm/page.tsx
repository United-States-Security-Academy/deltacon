import type { Metadata } from "next";
import Link from "next/link";

import { ConfirmLinkButton } from "@/components/admin/confirm-link-button";

export const metadata: Metadata = { title: "Continue" };

/** Landing page for invite and password-reset links from email. */
export default async function ConfirmAdminLinkPage({
  searchParams,
}: PageProps<"/admin/auth/confirm">) {
  const { token_hash: tokenHash, type: linkType } = await searchParams;
  const isInvite = linkType === "invite";
  const hasValidLink =
    typeof tokenHash === "string" &&
    (linkType === "invite" || linkType === "recovery");

  return (
    <div className="flex flex-col gap-6 text-center">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-navy-900 uppercase">
          {isInvite ? "Welcome aboard" : "Reset your password"}
        </h1>
        <p className="text-muted-foreground">
          {isInvite
            ? "Press continue to accept your invitation and choose your password."
            : "Press continue to choose a new password."}
        </p>
      </div>
      {hasValidLink ? (
        <ConfirmLinkButton tokenHash={tokenHash} linkType={linkType} />
      ) : (
        <div className="flex flex-col gap-3">
          <p role="alert" className="text-flag-red">
            This link is incomplete. Please use the button in your email, or ask
            for a new link.
          </p>
          <Link
            href="/admin/forgot-password"
            className="font-medium text-gold-700 underline"
          >
            Send me a new link
          </Link>
        </div>
      )}
    </div>
  );
}
