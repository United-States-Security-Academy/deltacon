import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  mainContentId,
  SkipToContentLink,
} from "@/components/layout/skip-to-content-link";
import { getPublicContactDetails } from "@/server/queries/site-settings";

/**
 * Contact bar, sticky navigation and footer around public pages. Used by the
 * public layout and by the 404 page (which sits outside that layout).
 */
export async function PublicSiteShell({ children }: { children: ReactNode }) {
  const contactDetails = await getPublicContactDetails();

  return (
    <>
      <SkipToContentLink />
      <SiteHeader
        email={contactDetails.email}
        phoneDisplay={contactDetails.phoneDisplay}
        phoneInternational={contactDetails.phoneInternational}
      />
      <main id={mainContentId} tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter socialLinks={contactDetails.socialLinks} />
    </>
  );
}
