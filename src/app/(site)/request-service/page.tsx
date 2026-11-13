import { Mail, Phone } from "lucide-react";

import { ServiceRequestForm } from "@/components/forms/service-request-form";
import { companyDetails } from "@/config/company-details";
import { findLocationBySlug } from "@/config/locations";
import { quoteRequestEmail } from "@/config/service-request-options";
import { PageHeader } from "@/components/sections/page-header";
import { WhatHappensNext } from "@/components/sections/what-happens-next";
import { buildSiteSurveyMessage } from "@/lib/security-assessment/score-assessment";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Request Security Services",
  description:
    "Tell us about your site and security needs, and Deltacon Security Group will send you a tailored proposal, usually within one business day.",
  path: "/request-service",
});

const nextSteps = [
  {
    title: "We review your request",
    description:
      "A security manager reads every request personally, usually within one business day.",
  },
  {
    title: "Site survey",
    description:
      "We visit or call to understand your site, risks and day-to-day operations.",
  },
  {
    title: "Tailored proposal",
    description:
      "You receive a clear plan with staffing, schedule and transparent pricing.",
  },
];

export default async function RequestServicePage({
  searchParams,
}: PageProps<"/request-service">) {
  // Service and industry pages link here with ?service=<slug> or
  // ?industry=<slug> to pre-select those fields; location pages add
  // ?location=<slug>, which fills in "Site location" (known slugs only).
  const { service, industry, assessment, focus, location } = await searchParams;
  const prefilledSiteLocation =
    typeof location === "string"
      ? findLocationBySlug(location)?.requestFormSiteLocation
      : undefined;
  // Visitors arriving from the security self-assessment get a pre-written
  // message (built only from known question ids, never raw URL text).
  const prefilledMessage = buildSiteSurveyMessage(
    typeof assessment === "string" ? assessment : undefined,
    typeof focus === "string" ? focus : undefined,
  );
  const preselectedServiceSlug =
    typeof service === "string" ? service : undefined;

  return (
    <>
      <PageHeader
        eyebrow="Request service"
        title="Request a Security Guard Quote"
        introduction="Tell us about your security requirements. Our team will review your request and prepare a customized service proposal based on your location, staffing needs, operating hours, and assignment requirements."
        breadcrumbs={[{ label: "Request Service" }]}
      />

      <div className="bg-paper section-spacing">
        <div className="page-container grid items-start gap-10 lg:grid-cols-[2fr_1fr]">
          <section
            aria-labelledby="service-request-form-heading"
            className="overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <div className="bg-navy-900 px-6 py-6 text-white sm:px-8">
              <p className="text-xs font-semibold tracking-wider text-gold-300 uppercase">
                {companyDetails.name} | Texas License #{" "}
                {companyDetails.securityLicenseNumber}
              </p>
              <h2
                id="service-request-form-heading"
                className="mt-2 text-2xl font-bold uppercase"
              >
                Your quote request
              </h2>
              <p className="mt-2 text-sm text-navy-100">
                Professional Armed &amp; Unarmed Security • Vehicle &amp; Foot
                Patrol • Fire Watch • Emergency Response
              </p>
            </div>

            <div className="p-6 sm:p-8">
              <ServiceRequestForm
                preselectedServiceSlug={preselectedServiceSlug}
                preselectedIndustrySlug={
                  typeof industry === "string" ? industry : undefined
                }
                prefilledMessage={prefilledMessage}
                prefilledSiteLocation={prefilledSiteLocation}
              />
            </div>

            <div className="flex flex-col items-center gap-3 border-t border-border bg-paper/60 px-6 py-6 text-center sm:px-8">
              <h3 className="text-lg font-bold text-navy-900">
                Prefer to Speak With Our Security Team?
              </h3>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold text-navy-900">
                <a
                  href={`tel:${companyDetails.phoneInternational}`}
                  className="inline-flex items-center gap-2 hover:text-gold-700 hover:underline"
                >
                  <Phone aria-hidden="true" className="size-4" />
                  {companyDetails.phoneDisplay}
                </a>
                <a
                  href={`mailto:${quoteRequestEmail}`}
                  className="inline-flex items-center gap-2 break-all hover:text-gold-700 hover:underline"
                >
                  <Mail aria-hidden="true" className="size-4 shrink-0" />
                  {quoteRequestEmail}
                </a>
              </div>
            </div>
          </section>
          <WhatHappensNext steps={nextSteps} />
        </div>
      </div>
    </>
  );
}
