import { ArrowRight, MapPin, Phone, Star } from "lucide-react";
import Link from "next/link";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { companyDetails, formatOfficeAddress } from "@/config/company-details";
import { locations } from "@/config/locations";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Locations",
  description: `${companyDetails.name} offices and the areas they serve.`,
  path: "/locations",
});

/** /locations: every location page from config/locations.ts. */
export default function LocationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Locations"
        title="Security services across Texas"
        introduction={`${companyDetails.name} is headquartered at ${formatOfficeAddress()}. Find the office that serves your area.`}
        breadcrumbs={[{ label: "Locations" }]}
      />

      <section aria-label="Our locations" className="bg-paper section-spacing">
        <ul className="page-container grid grid-cols-1 gap-6 md:grid-cols-2">
          {locations.map((location) => (
            <li key={location.slug}>
              <article
                className={
                  location.isHeadquarters
                    ? "flex h-full flex-col gap-4 rounded-2xl border-2 border-gold-500 bg-white p-6 shadow-sm sm:p-8"
                    : "flex h-full flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8"
                }
              >
                <div className="flex flex-wrap items-center gap-3">
                  {location.isHeadquarters && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold tracking-wider text-navy-950 uppercase">
                      <Star aria-hidden="true" className="size-3.5" />
                      Headquarters
                    </span>
                  )}
                  <p className="font-heading text-sm font-semibold tracking-[0.25em] text-gold-700 uppercase">
                    {location.office.name}
                  </p>
                </div>
                <h2 className="text-2xl font-bold text-navy-900 uppercase">
                  <Link
                    href={`/locations/${location.slug}`}
                    className="hover:text-gold-700"
                  >
                    {location.name}
                  </Link>
                </h2>
                <p className="leading-relaxed text-muted-foreground">
                  {location.hubSummary}
                </p>
                <address className="flex flex-col gap-2 not-italic">
                  <span className="flex items-start gap-2 text-navy-900">
                    <MapPin
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-gold-600"
                    />
                    <span>
                      {location.office.streetAddress}
                      <br />
                      {location.office.city}, {location.office.stateCode}{" "}
                      {location.office.postalCode}
                    </span>
                  </span>
                  <a
                    href={`tel:${location.office.phoneInternational}`}
                    className="flex items-center gap-2 font-semibold text-navy-900 hover:text-gold-700"
                  >
                    <Phone
                      aria-hidden="true"
                      className="size-4 text-gold-600"
                    />
                    {location.office.phoneDisplay}
                  </a>
                </address>
                <Link
                  href={`/locations/${location.slug}`}
                  className="mt-auto inline-flex items-center gap-2 self-start font-semibold text-gold-700 hover:text-navy-900"
                >
                  {location.name} security services
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <CallToActionBand />
    </>
  );
}
