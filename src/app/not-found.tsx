import type { Metadata } from "next";
import Link from "next/link";

import { PublicSiteShell } from "@/components/layout/public-site-shell";
import { StatusMessage } from "@/components/sections/status-message";
import { Button } from "@/components/ui/button";
import { requestServiceLink } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFoundPage() {
  return (
    <PublicSiteShell>
      <StatusMessage
        code="404"
        title="Page not found"
        description="The page you're looking for has moved or doesn't exist. Let's get you back on patrol."
        actions={
          <>
            <Button asChild variant="accent" size="xl">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="xl">
              <Link href={requestServiceLink.href}>
                {requestServiceLink.label}
              </Link>
            </Button>
          </>
        }
      />
    </PublicSiteShell>
  );
}
