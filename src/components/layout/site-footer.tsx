import { MapPin } from "lucide-react";
import Link from "next/link";

import { CompanyLogo } from "@/components/layout/company-logo";
import { SocialMediaIcons } from "@/components/layout/social-media-icons";
import {
  companyDetails,
  officeMapUrl,
  type SocialLink,
} from "@/config/company-details";
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
  const { streetAddress, city, stateCode, postalCode } =
    companyDetails.officeAddress;

  return (
    <footer className="mt-auto border-t-4 border-gold-500 bg-navy-950 text-navy-200">
      <div className="page-container grid gap-12 py-14 md:grid-cols-[2fr_3fr]">
        <div className="flex flex-col gap-5">
          <CompanyLogo badgeHeight={64} />
          <p className="max-w-sm text-sm leading-relaxed">
            {companyDetails.description}
          </p>
          <p className="font-heading text-sm font-semibold tracking-[0.25em] text-gold-400 uppercase">
            {companyDetails.motto}
          </p>
          <address className="not-italic">
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
          <SocialMediaIcons socialLinks={socialLinks} />
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
            &copy; {currentYear} {companyDetails.name}. All rights reserved.
          </p>
          <p>
            Licensed security services in {companyDetails.location.region}, USA.
          </p>
        </div>
      </div>
    </footer>
  );
}
