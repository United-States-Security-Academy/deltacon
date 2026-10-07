/**
 * Default company details.
 *
 * From Phase 2 onwards the email, phone and social links are editable in
 * Admin → Settings; these values are the fallback used when the database
 * has no settings row yet (and during local development without Supabase).
 */

export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "x";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type CompanyDetails = {
  name: string;
  shortName: string;
  tagline: string;
  motto: string;
  description: string;
  email: string;
  /** Human-friendly phone number shown on the site. */
  phoneDisplay: string;
  /** Phone number in E.164 format, used for tel: links. */
  phoneInternational: string;
  location: {
    region: string;
    country: string;
    countryCode: string;
  };
  socialLinks: SocialLink[];
};

export const companyDetails: CompanyDetails = {
  name: "Deltacon Security",
  shortName: "Deltacon",
  tagline: "Professional security services across Texas",
  motto: "Courage, Service, Integrity",
  description:
    "Deltacon Security provides licensed unarmed and armed security officers, personal protection, mobile patrol, fire watch, emergency response and on-site security training for businesses and communities across Texas.",
  email: "info@deltacon1.com",
  // TODO: replace with the real company phone number.
  phoneDisplay: "(000) 000-0000",
  phoneInternational: "+10000000000",
  location: {
    region: "Texas",
    country: "United States",
    countryCode: "US",
  },
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/" },
    { platform: "instagram", url: "https://www.instagram.com/" },
    { platform: "linkedin", url: "https://www.linkedin.com/" },
    { platform: "x", url: "https://x.com/" },
  ],
};
