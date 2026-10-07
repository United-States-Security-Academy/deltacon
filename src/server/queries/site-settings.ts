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
 * Contact details shown in the top bar and footer, as saved in
 * Admin → Settings. Falls back to the defaults in config/company-details.ts if
 * the settings row is missing or the database cannot be reached, so the site
 * never breaks because of this lookup.
 */
export const getPublicContactDetails = unstable_cache(
  async (): Promise<PublicContactDetails> => {
    try {
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
    } catch (error) {
      console.error("Could not load site settings, using defaults.", error);
      return defaultContactDetails;
    }
  },
  ["public-contact-details"],
  { tags: [cacheTags.siteSettings], revalidate: 3600 },
);
