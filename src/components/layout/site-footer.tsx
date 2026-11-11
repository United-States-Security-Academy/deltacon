import { MapPin } from "lucide-react";
import Link from "next/link";

import { CompanyLogo } from "@/components/layout/company-logo";
import { SocialMediaIcons } from "@/components/layout/social-media-icons";
import {
  companyDetails,
  keepRealSocialProfiles,
  officeMapUrl,
  type SocialLink,
} from "@/config/company-details";
import {
  formatOfficeAddress as formatLocationOfficeAddress,
  locations,
} from "@/config/locations";
import { footerQuickLinks } from "@/config/navigation";

type SiteFooterProps = {
  socialLinks: SocialLink[];
};

/**
 * Site footer. By design it does not show the email or phone number (those
 * are only in the top contact bar); it does show the office address.
 */
export function SiteFooter({ socialLinks }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();
  // Real profiles saved in the site settings, else those in the config;
  // placeholder links to a platform's home page are never shown.
  const savedProfiles = keepRealSocialProfiles(socialLinks);
  const shownSocialLinks =
    savedProfiles.length > 0
      ? savedProfiles
      : keepRealSocialProfiles(companyDetails.socialLinks);
  const { streetAddress, city, stateCode, postalCode } =
    companyDetails.officeAddress;
  // The headquarters address comes from company details; other offices
  // (and the headquarters page link) from config/locations.ts.
  const headquartersLocation = locations.find(
    (location) => location.isHeadquarters,
  );
  const branchLocations = locations.filter(
    (location) => !location.isHeadquarters,
  );

  return (
    <footer className="mt-auto border-t-4 border-gold-500 bg-navy-950 text-navy-200">
      <div className="page-container grid gap-12 py-14 md:grid-cols-[2fr_3fr]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <CompanyLogo size="footer" />
            <p className="flex items-center gap-3 font-heading text-xs font-semibold tracking-[0.25em] text-navy-100 uppercase">
              <span aria-hidden="true" className="h-px w-6 bg-gold-500" />A{" "}
              {companyDetails.parentCompanyName} Company
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed">
            {companyDetails.description}
          </p>
          <p className="font-heading text-sm font-semibold tracking-[0.25em] text-gold-400 uppercase">
            {companyDetails.motto}
          </p>
          <div className="flex flex-col gap-4">
            <address className="not-italic">
              <p className="mb-1 text-xs font-semibold tracking-wider text-gold-400 uppercase">
                {headquartersLocation ? (
                  <Link
                    href={`/locations/${headquartersLocation.slug}`}
                    className="hover:text-gold-300"
                  >
                    Headquarters · {headquartersLocation.name}
                  </Link>
                ) : (
                  "Headquarters"
                )}
              </p>
              <a
                href={officeMapUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex gap-3 rounded-sm text-sm leading-relaxed transition-colors hover:text-gold-300"
              >
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-gold-500"
                />
                <span>
                  {streetAddress}
                  <br />
                  {city}, {stateCode} {postalCode}
                  <span className="sr-only">
                    {" "}
                    (opens Google Maps in a new tab)
                  </span>
                </span>
              </a>
            </address>
            {/* Other offices, from config/locations.ts. */}
            {branchLocations.map(({ slug, name, office }) => (
              <address key={slug} className="not-italic">
                <p className="mb-1 text-xs font-semibold tracking-wider text-gold-400 uppercase">
                  <Link
                    href={`/locations/${slug}`}
                    className="hover:text-gold-300"
                  >
                    {office.name} · {name}
                  </Link>
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${companyDetails.name}, ${formatLocationOfficeAddress(office)}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex gap-3 rounded-sm text-sm leading-relaxed transition-colors hover:text-gold-300"
                >
                  <MapPin
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-gold-500"
                  />
                  <span>
                    {office.streetAddress}
                    <br />
                    {office.city}, {office.stateCode} {office.postalCode}
                    <span className="sr-only">
                      {" "}
                      (opens Google Maps in a new tab)
                    </span>
                  </span>
                </a>
                <a
                  href={`tel:${office.phoneInternational}`}
                  className="mt-1 ml-8 block text-sm transition-colors hover:text-gold-300"
                >
                  {office.phoneDisplay}
                </a>
              </address>
            ))}
          </div>
          <SocialMediaIcons socialLinks={shownSocialLinks} />
        </div>

        <nav aria-labelledby="footer-quick-links-heading">
          <h2
            id="footer-quick-links-heading"
            className="mb-4 text-lg font-semibold tracking-widest text-white uppercase"
          >
            Quick Links
          </h2>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
            {footerQuickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm transition-colors hover:text-gold-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-navy-800">
        <div className="page-container flex flex-col items-center justify-between gap-2 py-5 text-xs sm:flex-row">
          <p>
            &copy; {currentYear} {companyDetails.name}, a{" "}
            {companyDetails.parentCompanyName} company. All rights reserved.
          </p>
          <p className="text-center sm:text-right">
            Licensed security services in {companyDetails.location.region}, USA
            <span aria-hidden="true"> · </span>
            <span className="whitespace-nowrap">
              Texas DPS License No. {companyDetails.securityLicenseNumber}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
