import { BadgeCheck, Check } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { ServiceCard } from "@/components/sections/service-card";
import { Button } from "@/components/ui/button";
import { findIndustryBySlug, industries } from "@/config/industries";
import { requestServiceLink } from "@/config/navigation";
import { findServicesForIndustry } from "@/config/services";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { cn } from "@/lib/utils";

// Only the industries in config/industries.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const industry = findIndustryBySlug(slug);
  if (!industry) return {};

  return createPageMetadata({
    title: industry.pageTitle,
    description: industry.summary,
    path: `/industries/${industry.slug}`,
  });
}

export default async function IndustryDetailPage({
  params,
}: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const industry = findIndustryBySlug(slug);
  if (!industry) notFound();

  const relevantServices = findServicesForIndustry(industry.slug);
  const Icon = industry.icon;

  return (
    <>
      <PageHeader
        eyebrow="Industries we serve"
        title={industry.pageTitle}
        introduction={industry.summary}
        breadcrumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.name },
        ]}
      >
        <div>
          <Button asChild variant="accent" size="xl">
            <Link href={`${requestServiceLink.href}?industry=${industry.slug}`}>
              Request security for your site
            </Link>
          </Button>
        </div>
      </PageHeader>

      <section
        aria-labelledby="industry-overview-heading"
        className="section-spacing"
      >
        <div
          className={cn(
            "page-container grid items-start gap-12",
            industry.image && "lg:grid-cols-[3fr_2fr]",
          )}
        >
          <div className="flex max-w-3xl flex-col gap-5">
            <h2
              id="industry-overview-heading"
              className="flex items-center gap-3 text-3xl font-bold text-navy-900 uppercase"
            >
              <Icon aria-hidden="true" className="size-8 text-gold-600" />
              Overview
            </h2>
            {industry.overview.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {industry.image && (
            <div
              data-reveal="zoom"
              className="overflow-hidden rounded-lg shadow-lg lg:sticky lg:top-28"
            >
              <Image
                src={industry.image}
                alt={industry.imageAltText ?? ""}
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          )}
        </div>
      </section>

      <section
        aria-label="Services and training"
        className="bg-paper section-spacing"
      >
        <div className="page-container grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-navy-900 uppercase sm:text-3xl">
              Our services include
            </h2>
            <ul data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
              {industry.servicesProvided.map((serviceProvided) => (
                <li
                  key={serviceProvided}
                  className="flex items-start gap-3 rounded-lg border border-border bg-white p-4 shadow-sm"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <span className="font-medium text-navy-900">
                    {serviceProvided}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-navy-900 uppercase sm:text-3xl">
              Training & credentials
            </h2>
            <ul data-reveal-stagger className="flex flex-col gap-3">
              {industry.trainingAndCredentials.map((credential) => (
                <li
                  key={credential}
                  className="flex items-start gap-3 rounded-lg border-l-4 border-gold-500 bg-white p-4 shadow-sm"
                >
                  <BadgeCheck
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-gold-600"
                  />
                  <span className="text-navy-900">{credential}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {relevantServices.length > 0 && (
        <section
          aria-labelledby="industry-services-heading"
          className="section-spacing"
        >
          <div className="page-container flex flex-col gap-8">
            <h2
              id="industry-services-heading"
              className="text-3xl font-bold text-navy-900 uppercase"
            >
              Services for {industry.name.toLowerCase()}
            </h2>
            <ul
              data-reveal-stagger
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {relevantServices.map((service) => (
                <li key={service.slug}>
                  <ServiceCard service={service} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CallToActionBand />
    </>
  );
}
