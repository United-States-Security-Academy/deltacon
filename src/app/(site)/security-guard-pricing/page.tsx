import { ArrowRight, Check, ChevronDown, MapPin, Receipt } from "lucide-react";
import Link from "next/link";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { describePriceRange, locations } from "@/config/locations";
import { requestServiceLink } from "@/config/navigation";
import { pricingGuide } from "@/config/pricing-guide";
import { createPageMetadata } from "@/lib/seo/page-metadata";

// Title and description come from config/search-metadata.ts.
export const metadata = createPageMetadata({
  title: pricingGuide.title,
  description: pricingGuide.introduction,
  path: "/security-guard-pricing",
});

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
            <Check aria-hidden="true" className="size-3.5" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * /security-guard-pricing: what goes into an hourly security bill rate.
 * Shared by every location page, which each keep only their local rate
 * table, so the long explanation isn't repeated city by city.
 */
export default function SecurityGuardPricingPage() {
  return (
    <>
      <PageHeader
        eyebrow={pricingGuide.eyebrow}
        title={pricingGuide.title}
        introduction={pricingGuide.introduction}
        breadcrumbs={[{ label: "Security Guard Pricing" }]}
      />

      {/* Local rate tables */}
      <section
        aria-labelledby="local-rates-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-8">
          <SectionHeading
            id="local-rates-heading"
            eyebrow="Estimated rates"
            title="Estimated rates by location"
          />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {locations.map((location) => {
              const priceRange = describePriceRange(location.pricing.rates);
              return (
                <li key={location.slug}>
                  <Link
                    href={`/locations/${location.slug}#pricing`}
                    className="group flex h-full flex-col gap-3 rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8"
                  >
                    <span className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.25em] text-gold-700 uppercase">
                      <MapPin aria-hidden="true" className="size-4" />
                      {location.office.name}
                    </span>
                    <span className="text-2xl font-bold text-navy-900 uppercase">
                      {location.name}
                    </span>
                    {priceRange && (
                      <span className="text-muted-foreground">
                        Estimated {priceRange} for common assignments
                      </span>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 font-semibold text-gold-700 group-hover:text-navy-900">
                      See the {location.name} rate table
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* What you are paying for, and what determines the price */}
      <section aria-labelledby="paying-for-heading" className="section-spacing">
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading
              id="paying-for-heading"
              eyebrow="Pricing explained"
              title={pricingGuide.payingForTitle}
            />
            {pricingGuide.payingForParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border-l-4 border-gold-500 bg-paper p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-navy-900 uppercase">
              {pricingGuide.factorsTitle}
            </h2>
            <p className="text-muted-foreground">
              {pricingGuide.factorsIntroduction}
            </p>
            <CheckList items={pricingGuide.factors} />
            {pricingGuide.factorsClosing.map((paragraph) => (
              <p key={paragraph} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* The eight cost categories */}
      <section
        aria-labelledby="included-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-8">
          <SectionHeading
            id="included-heading"
            eyebrow="What's included"
            title={pricingGuide.includedTitle}
            description={pricingGuide.includedIntroduction.join(" ")}
          />
          <ol className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
            {pricingGuide.costCategories.map((category, index) => (
              <li key={category.title}>
                <details className="group rounded-xl border border-border bg-white shadow-sm open:shadow-md">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 [&::-webkit-details-marker]:hidden">
                    <h3 className="flex items-center gap-3 font-heading text-lg font-bold text-navy-900">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm text-gold-300">
                        {index + 1}
                      </span>
                      {category.title}
                    </h3>
                    <ChevronDown
                      aria-hidden="true"
                      className="size-5 shrink-0 text-navy-700 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    />
                  </summary>
                  <div className="flex flex-col gap-3 border-t border-border px-5 py-4 text-muted-foreground">
                    {category.paragraphs?.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {category.listIntroduction && (
                      <p className="font-semibold text-navy-900">
                        {category.listIntroduction}
                      </p>
                    )}
                    {category.list && <CheckList items={category.list} />}
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why it matters, and proposals */}
      <section
        aria-labelledby="why-matters-heading"
        className="section-spacing"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading
              id="why-matters-heading"
              eyebrow="Value"
              title={pricingGuide.whyItMattersTitle}
            />
            {pricingGuide.whyItMattersParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            <p className="border-l-4 border-gold-500 pl-4 text-lg font-semibold text-navy-900">
              {pricingGuide.objective}
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-navy-900 security-pattern p-6 text-white sm:p-8">
            <Receipt aria-hidden="true" className="size-8 text-gold-400" />
            <h2 className="text-2xl font-bold uppercase">
              {pricingGuide.proposalsTitle}
            </h2>
            {pricingGuide.proposalsParagraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed text-navy-100">
                {paragraph}
              </p>
            ))}
            <Button
              asChild
              variant="accent"
              size="xl"
              className="h-auto min-h-12 self-start py-3 text-center whitespace-normal"
            >
              <Link href={requestServiceLink.href}>
                Request a Security Proposal
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
