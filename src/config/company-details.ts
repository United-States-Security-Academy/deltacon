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
  /** Office address, shown in the footer and used for search engines. */
  officeAddress: {
    streetAddress: string;
    city: string;
    stateCode: string;
    postalCode: string;
  };
  socialLinks: SocialLink[];
};

export const companyDetails: CompanyDetails = {
  name: "Deltacon Security Group",
  shortName: "Deltacon",
  tagline: "Professional security services across Texas",
  motto: "Courage, Service, Integrity",
  description:
    "Deltacon Security Group provides licensed unarmed and armed security officers, personal protection, mobile patrol, fire watch, emergency response and on-site security training for businesses and communities across Texas.",
  email: "info@deltacon1.com",
  phoneDisplay: "832.247.7457",
  phoneInternational: "+18322477457",
  location: {
    region: "Texas",
    country: "United States",
    countryCode: "US",
  },
  officeAddress: {
    streetAddress: "12808 W. Airport Blvd, Ste 224",
    city: "Sugar Land",
    stateCode: "TX",
    postalCode: "77478",
  },
  socialLinks: [
    { platform: "facebook", url: "https://www.facebook.com/" },
    { platform: "instagram", url: "https://www.instagram.com/" },
    { platform: "linkedin", url: "https://www.linkedin.com/" },
    { platform: "x", url: "https://x.com/" },
  ],
};

/** The office address on one line, e.g. for emails. */
export function formatOfficeAddress(): string {
  const { streetAddress, city, stateCode, postalCode } =
    companyDetails.officeAddress;
  return `${streetAddress}, ${city}, ${stateCode} ${postalCode}`;
}

/** Google Maps search link for the office. */
export function officeMapUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${companyDetails.name}, ${formatOfficeAddress()}`,
  )}`;
}
