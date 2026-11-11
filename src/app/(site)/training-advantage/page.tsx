import {
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { trainingAdvantage } from "@/config/training-advantage";
import { createPageMetadata } from "@/lib/seo/page-metadata";

// Title and description come from config/search-metadata.ts.
export const metadata = createPageMetadata({
  title: trainingAdvantage.title,
  description: trainingAdvantage.academiesParagraphs[0]!,
  path: "/training-advantage",
});

/**
 * /training-advantage: Deltacon's two academies and in-house instructor
 * credentials. Shared by every location page, which each keep a short
 * summary and link here instead of repeating this text.
 */
export default function TrainingAdvantagePage() {
  return (
    <>
      <PageHeader
        eyebrow={trainingAdvantage.eyebrow}
        title={trainingAdvantage.title}
        introduction={trainingAdvantage.subtitle}
        breadcrumbs={[
          { label: "Training", href: "/training" },
          { label: "Training Advantage" },
        ]}
      />

      {/* Academies */}
      <section aria-labelledby="academies-heading" className="section-spacing">
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading
              id="academies-heading"
              eyebrow="Our academies"
              title={trainingAdvantage.academiesTitle}
            />
            {trainingAdvantage.academiesParagraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            {trainingAdvantage.academiesClosing.map((paragraph) => (
              <p
                key={paragraph}
                className="leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-semibold text-navy-900">
              {trainingAdvantage.academiesIntroduction}
            </p>
            <ul className="flex flex-col gap-4">
              {trainingAdvantage.academies.map((academy) => (
                <li
                  key={academy.licenseNumber}
                  className="flex items-start gap-4 rounded-2xl bg-navy-900 security-pattern p-6 text-white"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-navy-950">
                    <GraduationCap aria-hidden="true" className="size-6" />
                  </span>
                  <div className="flex flex-col gap-1">
                    {academy.website ? (
                      <a
                        href={academy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 self-start font-heading text-xl font-bold underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-300"
                      >
                        {academy.name}
                        <ExternalLink aria-hidden="true" className="size-4" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <span className="font-heading text-xl font-bold">
                        {academy.name}
                      </span>
                    )}
                    <span className="text-gold-300">
                      Texas DPS License Number: {academy.licenseNumber}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Instructors */}
      <section
        aria-labelledby="instructors-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionHeading
              id="instructors-heading"
              eyebrow="Instructors"
              title={trainingAdvantage.instructorsTitle}
            />
            <p className="text-lg leading-relaxed text-muted-foreground">
              {trainingAdvantage.instructorsIntroduction}
            </p>
            {trainingAdvantage.instructorsClosing.map((paragraph) => (
              <p
                key={paragraph}
                className="leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
            <p className="font-semibold text-navy-900">
              {trainingAdvantage.instructorsListIntroduction}
            </p>
            <ul className="flex flex-col gap-3">
              {trainingAdvantage.instructorQualifications.map(
                (qualification) => (
                  <li
                    key={qualification}
                    className="flex items-start gap-3 text-lg text-navy-900"
                  >
                    <BadgeCheck
                      aria-hidden="true"
                      className="mt-1 size-5 shrink-0 text-gold-600"
                    />
                    {qualification}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section aria-label="Our commitment" className="section-spacing">
        <div className="page-container flex max-w-4xl flex-col items-start gap-5">
          <p className="border-l-4 border-gold-500 pl-5 text-2xl font-semibold text-navy-900">
            {trainingAdvantage.emphasis}
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {trainingAdvantage.finalParagraph}
          </p>
          <Button asChild variant="accent" size="xl">
            <Link href="/training">
              View our training courses
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
