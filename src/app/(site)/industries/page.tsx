import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { IndustryCard } from "@/components/sections/industry-card";
import { PageHeader } from "@/components/sections/page-header";
import { industries } from "@/config/industries";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Industries We Serve",
  description:
    "Security for retail, critical infrastructure, healthcare, warehousing, construction, financial institutions, hospitality, residential, commercial real estate, ports of entry, petrochemical, data centers and campuses.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who we protect"
        title="Industries we serve"
        introduction="Every sector has its own risks, regulations and expectations. Our officers complete industry-specific training so they are prepared for the environments they work in."
        breadcrumbs={[{ label: "Industries" }]}
      />

      <section aria-label="All industries" className="bg-paper section-spacing">
        <ul
          data-reveal-stagger
          className="page-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {industries.map((industry) => (
            <li key={industry.slug}>
              <IndustryCard industry={industry} />
            </li>
          ))}
        </ul>
      </section>

      <CallToActionBand
        title="Don't see your industry?"
        description="We tailor security for any environment. Tell us about your site and we'll put together a plan that fits."
      />
    </>
  );
}
