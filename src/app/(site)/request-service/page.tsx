import { ServiceRequestForm } from "@/components/forms/service-request-form";
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
  // ?industry=<slug> to pre-select those fields.
  const { service, industry, assessment, focus } = await searchParams;
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
        title="Request a security proposal"
        introduction="Tell us what you need to protect. The more detail you share, the more accurate our proposal will be."
        breadcrumbs={[{ label: "Request Service" }]}
      />

      <div className="bg-paper section-spacing">
        <div className="page-container grid items-start gap-10 lg:grid-cols-[2fr_1fr]">
          <section
            aria-labelledby="service-request-form-heading"
            className="rounded-lg bg-white p-6 shadow-sm sm:p-8"
          >
            <h2
              id="service-request-form-heading"
              className="mb-6 text-2xl font-bold text-navy-900 uppercase"
            >
              Your requirements
            </h2>
            <ServiceRequestForm
              preselectedServiceSlug={preselectedServiceSlug}
              preselectedIndustrySlug={
                typeof industry === "string" ? industry : undefined
              }
              prefilledMessage={prefilledMessage}
            />
          </section>
          <WhatHappensNext steps={nextSteps} />
        </div>
      </div>
    </>
  );
}
