import {
  ArrowRight,
  Download,
  FileText,
  Mail,
  MapPin,
  Phone,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";

import { GuideRichText } from "@/components/guide/guide-rich-text";
import { ServiceTabs } from "@/components/sections/service-tabs";
import { Button } from "@/components/ui/button";
import { companyDetails } from "@/config/company-details";
import {
  licensingQuickGuides,
  type LicensingQuickGuide,
} from "@/config/licensing-guide";

/** One level's quick guide, laid out like the printed flyer. */
function QuickGuidePanel({ guide }: { guide: LicensingQuickGuide }) {
  const headingId = `quick-guide-${guide.id}`;
  const address = companyDetails.officeAddress;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <article
        aria-labelledby={headingId}
        className="overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-navy-950/5"
      >
        <header className="relative isolate overflow-hidden bg-navy-900 security-pattern px-6 py-8 text-white sm:px-10">
          <span
            aria-hidden="true"
            className="absolute -right-4 -bottom-10 -z-10 font-heading text-[9rem] leading-none font-bold text-white/[0.05] uppercase"
          >
            {guide.level.replace("Level ", "")}
          </span>
          <p className="font-heading text-xs font-semibold tracking-[0.3em] text-gold-300 uppercase">
            {companyDetails.name} · Applicant quick guide
          </p>
          <h3
            id={headingId}
            className="mt-3 text-3xl leading-tight font-bold uppercase sm:text-4xl"
          >
            <span className="text-gold-400">{guide.level}</span>{" "}
            <span aria-hidden="true" className="text-white/40">
              |
            </span>{" "}
            {guide.title}
          </h3>
          <p className="mt-2 text-lg text-navy-100">{guide.tagline}</p>
        </header>

        <div className="flex flex-col gap-8 px-6 py-8 sm:px-10">
          {/* Steps on a vertical timeline */}
          <ol className="relative flex flex-col gap-7 before:absolute before:top-5 before:bottom-5 before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-gold-500 before:to-navy-200">
            {guide.steps.map((step, index) => (
              <li key={step.title} className="relative flex gap-5">
                <span
                  aria-hidden="true"
                  className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-900 font-heading text-lg font-bold text-gold-300 ring-4 ring-white"
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1 pt-1.5">
                  <h4 className="font-heading text-lg leading-snug font-bold tracking-wide text-navy-900 uppercase">
                    <span className="sr-only">Step {index + 1}: </span>
                    {step.title}
                  </h4>
                  <p className="text-base leading-relaxed">
                    <GuideRichText text={step.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex gap-3 rounded-lg border-l-4 border-flag-red bg-flag-red/5 p-4">
            <TriangleAlert
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-flag-red"
            />
            <div className="flex flex-col gap-1 text-base">
              <p className="font-heading font-bold tracking-wide text-flag-red uppercase">
                {guide.beforeStarting.title}
              </p>
              <p>
                <GuideRichText text={guide.beforeStarting.text} />
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{guide.sources}</p>
        </div>
      </article>

      <aside
        aria-label={`${guide.level} resources`}
        className="flex flex-col gap-4 lg:sticky lg:top-28"
      >
        {/* Printable flyer */}
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-gold-500/40 bg-gradient-to-br from-gold-300/25 via-white to-white p-6">
          <span className="flex size-12 items-center justify-center rounded-xl bg-navy-900 text-gold-300">
            <FileText aria-hidden="true" className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-heading text-lg font-bold text-navy-900 uppercase">
              Take it with you
            </p>
            <p className="text-sm text-muted-foreground">
              {guide.pdfPath
                ? `A one-page ${guide.level} flyer to print or save, with every link clickable.`
                : `A printable ${guide.level} flyer is on its way. Until then, use this page or contact us for a copy.`}
            </p>
          </div>
          {guide.pdfPath && (
            <Button asChild variant="accent" size="lg" className="w-full">
              <a href={guide.pdfPath} download>
                <Download aria-hidden="true" />
                Download PDF
                <span className="sr-only"> ({guide.level} quick guide)</span>
              </a>
            </Button>
          )}
          <Link
            href={guide.courseHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-gold-700"
          >
            View the {guide.level} course
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-3 rounded-2xl bg-navy-900 p-6 text-white">
          <p className="font-heading text-sm font-semibold tracking-[0.2em] text-gold-300 uppercase">
            Questions? Contact us
          </p>
          <a
            href={`tel:${companyDetails.phoneInternational}`}
            className="flex items-center gap-3 text-base font-medium hover:text-gold-300"
          >
            <Phone aria-hidden="true" className="size-4 text-gold-400" />
            {companyDetails.phoneDisplay}
          </a>
          <a
            href={`mailto:${companyDetails.email}`}
            className="flex items-center gap-3 text-base font-medium break-all hover:text-gold-300"
          >
            <Mail
              aria-hidden="true"
              className="size-4 shrink-0 text-gold-400"
            />
            {companyDetails.email}
          </a>
          <p className="flex items-start gap-3 text-sm text-navy-100">
            <MapPin
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-gold-400"
            />
            <span>
              {address.streetAddress}, {address.city}, {address.stateCode}{" "}
              {address.postalCode}
            </span>
          </p>
        </div>
      </aside>
    </div>
  );
}

/**
 * "Quick guides by level": the client's Level II, III and IV flyers as
 * tabs, each with its printable PDF where one is available.
 */
export function LicensingQuickGuidesSection() {
  return (
    <section
      id="quick-guides"
      aria-labelledby="quick-guides-heading"
      className="scroll-mt-24 section-spacing"
    >
      <div className="page-container flex flex-col gap-8">
        <div className="flex max-w-3xl flex-col gap-3">
          <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
            Applicant quick guides
          </p>
          <h2
            id="quick-guides-heading"
            className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl"
          >
            Already know your level?
          </h2>
          <p className="text-lg text-muted-foreground">
            Pick your license for a one-page summary of exactly what to do, from
            training to your first shift.
          </p>
        </div>

        <ServiceTabs
          label="Quick guides by license level"
          tabs={licensingQuickGuides.map((guide) => {
            const Icon = guide.icon;
            return {
              id: guide.id,
              label: guide.level,
              note: guide.title,
              icon: <Icon aria-hidden="true" />,
              panel: <QuickGuidePanel guide={guide} />,
            };
          })}
        />
      </div>
    </section>
  );
}
