"use client";

import Link from "next/link";
import { useEffect } from "react";

import { StatusMessage } from "@/components/sections/status-message";
import { Button } from "@/components/ui/button";

type PublicErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/** Shown inside the normal header and footer when a public page fails. */
export default function PublicErrorPage({
  error,
  retry,
}: PublicErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusMessage
      code="Error"
      title="Something went wrong"
      description="We couldn't load this page. Please try again, and if the problem continues, come back a little later."
      actions={
        <>
          <Button variant="accent" size="xl" onClick={() => retry()}>
            Try again
          </Button>
          <Button asChild variant="outlineOnDark" size="xl">
            <Link href="/">Back to home</Link>
          </Button>
        </>
      }
    />
  );
}
