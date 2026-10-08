import { Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceCard } from "@/components/sections/service-card";
import { Button } from "@/components/ui/button";
import { findIndustryBySlug, type Industry } from "@/config/industries";
import { requestServiceLink } from "@/config/navigation";
import { findServiceBySlug, services } from "@/config/services";
import { StructuredDataScript } from "@/components/seo/structured-data-script";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { buildServiceData } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils";

// Only the services in config/services.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = findServiceBySlug(slug);
  if (!service) return {};

  return createPageMetadata({
    title: service.credential
      ? `${service.name} – ${service.credential}`
      : service.name,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = findServiceBySlug(slug);
  if (!service) notFound();

  const relatedIndustries = service.relatedIndustrySlugs
    .map(findIndustryBySlug)
    .filter((industry): industry is Industry => industry !== undefined);
  const otherServices = services
    .filter((otherService) => otherService.slug !== service.slug)
    .slice(0, 3);
  const highlightsHaveDescriptions = service.highlights.some(
    (highlight) => highlight.description,
  );
  const Icon = service.icon;

  return (
    <>
      <StructuredDataScript
        data={buildServiceData({
          name: service.name,
          summary: service.summary,
          path: `/services/${service.slug}`,
        })}
      />
      <PageHeader
        eyebrow={service.credential ?? "Our services"}
        title={service.name}
        introduction={service.summary}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: service.name },
        ]}
      >
        <div>
          <Button asChild variant="accent" size="xl">
            <Link href={`${requestServiceLink.href}?service=${service.slug}`}>
              Request this service
            </Link>
          </Button>
        </div>
      </PageHeader>

      <section
        aria-labelledby="service-overview-heading"
        className="section-spacing"
      >
        <div
          className={cn(
            "page-container grid items-start gap-12",
            service.image && "lg:grid-cols-[3fr_2fr]",
          )}
        >
          <div className="flex max-w-3xl flex-col gap-5">
            <h2
              id="service-overview-heading"
              className="flex items-center gap-3 text-3xl font-bold text-navy-900 uppercase"
            >
              <Icon aria-hidden="true" className="size-8 text-gold-600" />
              Overview
            </h2>
            {service.overview.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {service.image && (
            <div
              data-reveal="zoom"
              className="overflow-hidden rounded-lg shadow-lg lg:sticky lg:top-28"
            >
              <Image
                src={service.image}
                alt={service.imageAltText ?? ""}
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          )}
        </div>
      </section>

      <section
        aria-labelledby="service-highlights-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-8">
          <h2
            id="service-highlights-heading"
            className="text-3xl font-bold text-navy-900 uppercase"
          >
            {service.highlightsHeading}
          </h2>
          <ul
            data-reveal-stagger
            className={cn(
              "grid gap-4",
              highlightsHaveDescriptions
                ? "md:grid-cols-2"
                : "sm:grid-cols-2 lg:grid-cols-3",
            )}
          >
            {service.highlights.map((highlight) => (
              <li
                key={highlight.title}
                className="flex gap-4 rounded-lg border border-border bg-white p-5 shadow-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                  <Check aria-hidden="true" className="size-4" />
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-navy-900">
                    {highlight.title}
                  </h3>
                  {highlight.description && (
                    <p className="text-muted-foreground">
                      {highlight.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {relatedIndustries.length > 0 && (
        <section aria-labelledby="service-industries-heading" className="pt-16">
          <div className="page-container flex flex-col gap-6">
            <h2
              id="service-industries-heading"
              className="text-2xl font-bold text-navy-900 uppercase"
            >
              Industries we protect with this service
            </h2>
            <ul data-reveal-stagger className="flex flex-wrap gap-3">
              {relatedIndustries.map((industry) => {
                const IndustryIcon = industry.icon;
                return (
                  <li key={industry.slug}>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-gold-500"
                    >
                      <IndustryIcon
                        aria-hidden="true"
                        className="size-4 text-gold-600"
                      />
                      {industry.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section
        aria-labelledby="other-services-heading"
        className="section-spacing"
      >
        <div className="page-container flex flex-col gap-8">
          <h2
            id="other-services-heading"
            className="text-3xl font-bold text-navy-900 uppercase"
          >
            Other services
          </h2>
          <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
            {otherServices.map((otherService) => (
              <li key={otherService.slug}>
                <ServiceCard service={otherService} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
