import { ArrowRight, Check, Clock, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { UssaLinkedText } from "@/components/sections/ussa-linked-text";
import { StructuredDataScript } from "@/components/seo/structured-data-script";
import { Button } from "@/components/ui/button";
import { companyDetails } from "@/config/company-details";
import { requestServiceLink } from "@/config/navigation";
import {
  serviceLineHasContent,
  type ServiceLinePageContent,
  type ServiceLineTextSection as ServiceLineTextSectionContent,
} from "@/config/service-lines";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { buildServiceData } from "@/lib/seo/structured-data";
import { cn } from "@/lib/utils";

const comingSoonIntroduction =
  "Full details of this service are on their way. In the meantime, our team is happy to talk through what you need.";

/** Search engines show about 160 characters; keep whole words. */
function shortDescription(text: string): string {
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

function describeServiceLine(serviceLine: ServiceLinePageContent): string {
  return shortDescription(
    serviceLine.paragraphs[0] ??
      `${serviceLine.label} from ${companyDetails.name}, serving businesses and communities across Texas.`,
  );
}

/** Title, description and search-engine settings for a service line page. */
export function createServiceLineMetadata(
  serviceLine: ServiceLinePageContent,
): Metadata {
  const metadata = createPageMetadata({
    title: serviceLine.pageTitle ?? serviceLine.label,
    description: describeServiceLine(serviceLine),
    path: serviceLine.href,
  });
  // A page without content shouldn't appear in search results yet.
  if (!serviceLineHasContent(serviceLine)) {
    metadata.robots = { index: false, follow: true };
  }
  return metadata;
}

/**
 * Page for a line of business other than security (Consulting, Staffing,
 * Custodial Services), built from config/service-lines.ts. Until its content
 * is written it shows a friendly "coming soon" message.
 */
export function ServiceLinePage({
  serviceLine,
}: {
  serviceLine: ServiceLinePageContent;
}) {
  if (!serviceLineHasContent(serviceLine)) {
    return <ComingSoonServiceLinePage serviceLine={serviceLine} />;
  }

  const quotePath = `${requestServiceLink.href}?service=${serviceLine.slug}`;

  return (
    <>
      <StructuredDataScript
        data={buildServiceData({
          name: serviceLine.pageTitle ?? serviceLine.label,
          summary: describeServiceLine(serviceLine),
          path: serviceLine.href,
        })}
      />
      <PageHeader
        eyebrow="Services"
        title={serviceLine.pageTitle ?? serviceLine.label}
        introduction={serviceLine.tagline}
        breadcrumbs={[{ label: serviceLine.label }]}
      >
        <Button asChild variant="accent" size="xl" className="self-start">
          <Link href={quotePath}>
            {serviceLine.closing?.quoteButtonLabel ?? requestServiceLink.label}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </PageHeader>

      {/* Introduction and photo */}
      <section
        aria-labelledby="service-line-overview-heading"
        className="section-spacing"
      >
        <div
          className={cn(
            "page-container grid items-start gap-12",
            serviceLine.image && "lg:grid-cols-[3fr_2fr]",
          )}
        >
          <div className="flex max-w-3xl flex-col gap-5">
            <h2
              id="service-line-overview-heading"
              className="flex items-center gap-3 text-3xl font-bold text-navy-900 uppercase"
            >
              <Sparkles aria-hidden="true" className="size-8 text-gold-600" />
              Overview
            </h2>
            {serviceLine.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                <UssaLinkedText text={paragraph} />
              </p>
            ))}
          </div>

          {serviceLine.image && (
            <div
              data-reveal="zoom"
              className="overflow-hidden rounded-lg shadow-lg lg:sticky lg:top-28"
            >
              <Image
                src={serviceLine.image}
                alt={serviceLine.imageAltText ?? ""}
                placeholder="blur"
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          )}
        </div>
      </section>

      {/* What's included */}
      {serviceLine.offerings && serviceLine.offerings.length > 0 && (
        <section
          aria-labelledby="service-line-offerings-heading"
          className="bg-paper section-spacing"
        >
          <div className="page-container flex flex-col gap-8">
            <h2
              id="service-line-offerings-heading"
              className="text-3xl font-bold text-navy-900 uppercase"
            >
              {serviceLine.offeringsHeading ?? "What we offer"}
            </h2>
            <ul
              data-reveal-stagger
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {serviceLine.offerings.map((offering) => (
                <li
                  key={offering.title}
                  className={cn(
                    "flex gap-4 rounded-lg border bg-white p-5 shadow-sm",
                    offering.isFeatured
                      ? "border-l-4 border-gold-500 md:col-span-2 xl:col-span-3 xl:p-7"
                      : "border-border",
                  )}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3
                      className={cn(
                        "font-bold text-navy-900",
                        offering.isFeatured ? "text-xl" : "text-lg",
                      )}
                    >
                      {offering.title}
                    </h3>
                    {offering.subtitle && (
                      <p className="font-semibold text-gold-700">
                        {offering.subtitle}
                      </p>
                    )}
                    {[
                      offering.description,
                      ...(offering.moreParagraphs ?? []),
                    ].map((paragraph) => (
                      <p key={paragraph} className="text-muted-foreground">
                        <UssaLinkedText text={paragraph} />
                      </p>
                    ))}
                    {offering.emphasis && (
                      <p className="font-semibold text-navy-900">
                        {offering.emphasis}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Example roles by industry */}
      {serviceLine.positionGroups && (
        <section
          aria-labelledby="service-line-positions-heading"
          className="section-spacing"
        >
          <div className="page-container flex flex-col gap-8">
            <h2
              id="service-line-positions-heading"
              className="text-3xl font-bold text-navy-900 uppercase"
            >
              {serviceLine.positionGroups.heading}
            </h2>
            <ul
              data-reveal-stagger
              className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            >
              {serviceLine.positionGroups.groups.map((group) => (
                <li
                  key={group.title}
                  className="flex flex-col gap-3 rounded-lg border-t-4 border-gold-500 bg-paper p-6"
                >
                  <h3 className="text-xl font-bold text-navy-900">
                    {group.title}
                  </h3>
                  <p className="text-muted-foreground">{group.introduction}</p>
                  <p className="text-sm font-semibold tracking-wider text-navy-700 uppercase">
                    Positions may include
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {group.positions.map((position) => (
                      <li
                        key={position}
                        className="flex items-start gap-2 text-navy-900"
                      >
                        <Check
                          aria-hidden="true"
                          className="mt-1 size-4 shrink-0 text-gold-600"
                        />
                        {position}
                      </li>
                    ))}
                  </ul>
                  {group.note && (
                    <p className="mt-auto border-t border-border pt-3 text-sm text-muted-foreground italic">
                      {group.note}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Facilities served, and how the service is planned and checked */}
      {(serviceLine.facilitiesServed || serviceLine.sections) && (
        <section
          className={cn(
            "section-spacing",
            // Alternate backgrounds: shaded whenever the section above is white.
            (serviceLine.positionGroups || !serviceLine.offerings) &&
              "bg-paper",
          )}
        >
          <div
            className={cn(
              "page-container grid gap-12",
              serviceLine.facilitiesServed
                ? "lg:grid-cols-[2fr_3fr]"
                : // Three sections sit side by side; two or four go two by two.
                  (serviceLine.sections?.length ?? 0) % 3 === 0
                  ? "lg:grid-cols-3"
                  : "lg:grid-cols-2",
            )}
          >
            {serviceLine.facilitiesServed && (
              <div
                aria-labelledby="service-line-facilities-heading"
                role="group"
                className="flex flex-col gap-4"
              >
                <h2
                  id="service-line-facilities-heading"
                  className="text-2xl font-bold text-navy-900 uppercase sm:text-3xl"
                >
                  {serviceLine.facilitiesServed.heading}
                </h2>
                <p className="text-muted-foreground">
                  {serviceLine.facilitiesServed.introduction}
                </p>
                <ul data-reveal-stagger className="flex flex-col gap-2">
                  {serviceLine.facilitiesServed.items.map((facility) => (
                    <li
                      key={facility}
                      className="flex items-start gap-3 rounded-lg border-l-4 border-gold-500 bg-paper px-4 py-3 font-medium text-navy-900"
                    >
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {serviceLine.sections &&
              (serviceLine.facilitiesServed ? (
                // Beside the facilities list: one column of sections.
                <div className="flex flex-col gap-10">
                  {serviceLine.sections.map((section) => (
                    <ServiceLineTextSection
                      key={section.heading}
                      {...section}
                    />
                  ))}
                </div>
              ) : (
                // On their own: one section per column.
                serviceLine.sections.map((section) => (
                  <ServiceLineTextSection key={section.heading} {...section} />
                ))
              ))}
          </div>
        </section>
      )}

      {/* Closing call to action */}
      {serviceLine.closing ? (
        <section
          aria-labelledby="service-line-closing-heading"
          className="bg-navy-950 security-pattern text-white"
        >
          <div className="page-container flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
            <div data-reveal="left" className="flex max-w-2xl flex-col gap-3">
              <h2
                id="service-line-closing-heading"
                className="text-3xl font-bold uppercase sm:text-4xl"
              >
                {serviceLine.closing.heading}
              </h2>
              {serviceLine.closing.text && (
                <p className="text-lg text-navy-100">
                  {serviceLine.closing.text}
                </p>
              )}
            </div>
            <Button asChild variant="accent" size="xl" className="shrink-0">
              <Link href={quotePath}>
                {serviceLine.closing.quoteButtonLabel}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      ) : (
        <CallToActionBand />
      )}
    </>
  );
}

/**
 * A heading with its paragraphs and optional bullet list, e.g. "Training
 * that goes beyond placement".
 */
function ServiceLineTextSection({
  heading,
  paragraphs,
  list,
}: ServiceLineTextSectionContent) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-navy-900 uppercase sm:text-3xl">
        {heading}
      </h2>
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph}
          className="text-lg leading-relaxed text-muted-foreground"
        >
          <UssaLinkedText text={paragraph} />
        </p>
      ))}
      {list && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {list.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 rounded-lg border-l-4 border-gold-500 bg-white px-4 py-3 font-medium text-navy-900 shadow-sm"
            >
              <Check
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-gold-600"
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ComingSoonServiceLinePage({
  serviceLine,
}: {
  serviceLine: ServiceLinePageContent;
}) {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={serviceLine.label}
        introduction={comingSoonIntroduction}
        breadcrumbs={[{ label: serviceLine.label }]}
      />

      <section className="bg-paper section-spacing">
        <div className="page-container">
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
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
