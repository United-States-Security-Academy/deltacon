import "server-only";

import { unstable_cache } from "next/cache";

import { companyDetails, type SocialLink } from "@/config/company-details";
import { cacheTags } from "@/lib/cache-tags";
import { runAsVisitor } from "@/lib/database/access-roles";
import { siteSettings } from "@/lib/database/schema";

export type PublicContactDetails = {
  email: string;
  phoneDisplay: string;
  phoneInternational: string;
  socialLinks: SocialLink[];
};

const defaultContactDetails: PublicContactDetails = {
  email: companyDetails.email,
  phoneDisplay: companyDetails.phoneDisplay,
  phoneInternational: companyDetails.phoneInternational,
  socialLinks: companyDetails.socialLinks,
};

/**
 * Cached with no timer. This lookup runs in the layout of every public page,
 * and a timer here would turn every page into one that is rewritten on that
 * timer. Saving settings must refresh the "site-settings" tag instead.
 * Database errors are thrown inside the cache, so a fallback is never stored.
 */
const getCachedContactDetails = unstable_cache(
  async (): Promise<PublicContactDetails> => {
    const savedSettings = await runAsVisitor((transaction) =>
      transaction.select().from(siteSettings).limit(1),
    );
    const settings = savedSettings[0];
    if (!settings) return defaultContactDetails;

    return {
      email: settings.companyEmail,
      phoneDisplay: settings.phoneDisplay,
      phoneInternational: settings.phoneInternational,
      socialLinks: settings.socialLinks,
    };
  },
  ["public-contact-details"],
  { tags: [cacheTags.siteSettings], revalidate: false },
);

/**
 * Contact details shown in the top bar and footer, as saved in
 * Admin → Settings. Falls back to the defaults in config/company-details.ts if
 * the settings row is missing or the database cannot be reached, so the site
 * never breaks because of this lookup.
 */
export async function getPublicContactDetails(): Promise<PublicContactDetails> {
  try {
    return await getCachedContactDetails();
  } catch (error) {
    console.error("Could not load site settings, using defaults.", error);
    return defaultContactDetails;
  }
}
