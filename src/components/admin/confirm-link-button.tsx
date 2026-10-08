"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { FormErrorBanner } from "@/components/forms/form-status-messages";
import { Button } from "@/components/ui/button";
import { confirmAdminAuthLink } from "@/server/actions/admin/admin-auth-actions";

/**
 * "Continue" button on the invite / password-reset landing page. The one-time
 * token is only used when this is pressed, so email security scanners that
 * open links automatically can't use it up first.
 */
export function ConfirmLinkButton({
  tokenHash,
  linkType,
}: {
  tokenHash: string;
  linkType: string;
}) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isConfirming, startConfirming] = useTransition();

  function confirmLink() {
    setErrorMessage(undefined);
    startConfirming(async () => {
      // On success the server redirects to "choose your password".
      const result = await confirmAdminAuthLink(tokenHash, linkType);
      if (result?.status === "error") setErrorMessage(result.message);
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {errorMessage && <FormErrorBanner message={errorMessage} />}
      <Button
        type="button"
        variant="accent"
        size="xl"
        onClick={confirmLink}
        disabled={isConfirming}
      >
        {isConfirming ? "Checking your link…" : "Continue"}
      </Button>
      {errorMessage && (
        <Link
          href="/admin/forgot-password"
          className="self-center text-sm font-medium text-gold-700 underline"
        >
          Send me a new link
        </Link>
      )}
    </div>
  );
}
