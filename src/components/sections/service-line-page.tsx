import { Clock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { Button } from "@/components/ui/button";
import { companyDetails } from "@/config/company-details";
import { requestServiceLink } from "@/config/navigation";
import type { ServiceLinePageContent } from "@/config/service-lines";
import { createPageMetadata } from "@/lib/seo/page-metadata";

const comingSoonIntroduction =
  "Full details of this service are on their way. In the meantime, our team is happy to talk through what you need.";

/** Title, description and search-engine settings for a service line page. */
export function createServiceLineMetadata(
  serviceLine: ServiceLinePageContent,
): Metadata {
  const isComingSoon = serviceLine.paragraphs.length === 0;
  const metadata = createPageMetadata({
    title: serviceLine.label,
    description:
      serviceLine.introduction ||
      `${serviceLine.label} from ${companyDetails.name}, serving businesses and communities across Texas. Contact us to discuss your needs.`,
    path: serviceLine.href,
  });
  // A page without content shouldn't appear in search results yet.
  if (isComingSoon) metadata.robots = { index: false, follow: true };
  return metadata;
}

/**
 * Page for a line of business other than security (Consulting, Staffing,
 * Custodial Services). Shows its content from config/service-lines.ts, or a
 * friendly "coming soon" message until that content is written.
 */
export function ServiceLinePage({
  serviceLine,
}: {
  serviceLine: ServiceLinePageContent;
}) {
  const isComingSoon = serviceLine.paragraphs.length === 0;

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={serviceLine.label}
        introduction={serviceLine.introduction || comingSoonIntroduction}
        breadcrumbs={[{ label: serviceLine.label }]}
      />

      <section className="bg-paper section-spacing">
        <div className="page-container">
          {isComingSoon ? (
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-xl border border-dashed border-border bg-white px-6 py-14 text-center">
              <Clock aria-hidden="true" className="size-10 text-gold-600" />
              <h2 className="text-2xl font-bold text-navy-900 uppercase">
                Details coming soon
              </h2>
              <p className="max-w-md text-muted-foreground">
                We&apos;re preparing this page. Tell us what you need and
                we&apos;ll get back to you, usually within one business day.
              </p>
              <Button asChild variant="accent" size="lg">
                <Link href={requestServiceLink.href}>
                  {requestServiceLink.label}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex max-w-3xl flex-col gap-5">
              {serviceLine.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
