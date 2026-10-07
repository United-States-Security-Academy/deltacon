import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { SecurityAssessmentPromo } from "@/components/sections/security-assessment-promo";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceCard } from "@/components/sections/service-card";
import { services } from "@/config/services";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Security Services",
  description:
    "Unarmed and armed security officers, personal protection, emergency response, fire watch, mobile patrol, correctional security, off-duty police and on-site training from Deltacon Security Group in Texas.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="What we do"
        title="Security services"
        introduction="Licensed officers trained through the United States Security Academy (USSA) and Deltacon Tactical Academy, backed by a Dispatch and Operations Command Center staffed 24 hours a day, seven days a week."
        breadcrumbs={[{ label: "Services" }]}
      />

      <section aria-label="All services" className="bg-paper section-spacing">
        <ul
          data-reveal-stagger
          className="page-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <li key={service.slug}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </section>

      <SecurityAssessmentPromo />
      <CallToActionBand />
    </>
  );
}
