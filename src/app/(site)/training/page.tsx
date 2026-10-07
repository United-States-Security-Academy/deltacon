import { BadgeCheck } from "lucide-react";
import Link from "next/link";

import { TrainingEnquiryForm } from "@/components/forms/training-enquiry-form";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { LicensingPathway } from "@/components/sections/licensing-pathway";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { TrainingAcademySection } from "@/components/sections/training-academy-section";
import { TrainingCourseCard } from "@/components/sections/training-course-card";
import { Button } from "@/components/ui/button";
import {
  findCoursesForAcademy,
  findTrainingAcademy,
  specializedUssaCertifications,
} from "@/config/training-courses";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Security Training & Licensing Courses",
  description:
    "Texas Level II, III and IV security licensing, pepper spray, renewals, License to Carry, active shooter response, defensive tactics, maritime security, First Aid/CPR/AED and bloodborne pathogens training from USSA and Deltacon Tactical Academy.",
  path: "/training",
});

const pageSections = [
  {
    label: "United States Security Academy",
    href: "#united-states-security-academy",
  },
  { label: "Licensing pathway", href: "#licensing-pathway" },
  { label: "Deltacon Tactical Academy", href: "#deltacon-tactical-academy" },
  { label: "Enquire", href: "#training-enquiry" },
];

export default function TrainingPage() {
  const securityAcademy = findTrainingAcademy("united-states-security-academy");
  const tacticalAcademy = findTrainingAcademy("deltacon-tactical-academy");

  return (
    <>
      <PageHeader
        eyebrow="Training"
        title="Security training & licensing"
        introduction="Texas security licensing, renewals and specialized training through the United States Security Academy (USSA) and Deltacon Tactical Academy, taught by instructors with military, law enforcement and private security experience."
        breadcrumbs={[{ label: "Training" }]}
      >
        <nav aria-label="On this page">
          <ul className="flex flex-wrap gap-2">
            {pageSections.map((pageSection) => (
              <li key={pageSection.href}>
                <a
                  href={pageSection.href}
                  className="inline-block rounded-full border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-gold-400 hover:text-gold-300"
                >
                  {pageSection.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>

      <TrainingAcademySection academy={securityAcademy}>
        <div
          id="licensing-pathway"
          className="flex scroll-mt-24 flex-col gap-6 rounded-lg bg-paper p-6 sm:p-8"
        >
          <div className="flex max-w-3xl flex-col gap-3">
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
              Texas security licensing
            </p>
            <h3 className="text-2xl font-bold text-navy-900 uppercase sm:text-3xl">
              Your licensing pathway
            </h3>
            <p className="text-lg text-muted-foreground">
              Start with Level II and progress to armed and personal protection
              licences. Select a step to see the full course details.
            </p>
          </div>
          <LicensingPathway />
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="text-2xl font-bold text-navy-900 uppercase">
            USSA courses
          </h3>
          <ul
            data-reveal-stagger
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
          >
            {findCoursesForAcademy(securityAcademy.id).map((course) => (
              <li key={course.slug}>
                <TrainingCourseCard course={course} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-2xl font-bold text-navy-900 uppercase">
            Specialized USSA certification courses
          </h3>
          <p className="max-w-3xl text-muted-foreground">
            Deltacon officers also complete specialized USSA courses required
            for their assignments and industries.
          </p>
          <ul data-reveal-stagger className="grid gap-4 md:grid-cols-3">
            {specializedUssaCertifications.map((certification) => (
              <li
                key={certification.code}
                className="flex gap-3 rounded-lg border-l-4 border-gold-500 bg-white p-5 shadow-sm"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="mt-0.5 size-6 shrink-0 text-gold-600"
                />
                <div className="flex flex-col gap-1">
                  <p className="font-heading text-sm font-semibold tracking-widest text-gold-700">
                    {certification.code}
                  </p>
                  <p className="font-semibold text-navy-900">
                    {certification.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Required for: {certification.requiredFor}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </TrainingAcademySection>

      <TrainingAcademySection
        academy={tacticalAcademy}
        imageOnLeft
        className="bg-paper"
      >
        <ul
          data-reveal-stagger
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-4"
        >
          {findCoursesForAcademy(tacticalAcademy.id).map((course) => (
            <li key={course.slug}>
              <TrainingCourseCard course={course} />
            </li>
          ))}
        </ul>
      </TrainingAcademySection>

      <section
        aria-labelledby="mobile-training-team-heading"
        className="bg-navy-900 security-pattern text-white"
      >
        <div className="page-container flex flex-col items-start gap-5 py-12 md:flex-row md:items-center md:justify-between">
          <div className="flex max-w-2xl flex-col gap-2">
            <h2
              id="mobile-training-team-heading"
              className="text-2xl font-bold uppercase sm:text-3xl"
            >
              We can bring the training to you
            </h2>
            <p className="text-navy-100">
              The Deltacon Mobile Training Team (DMTT) delivers customized,
              on-site instruction, including site-specific planning, tabletop
              exercises and drills, for organizations throughout Texas.
            </p>
          </div>
          <Button asChild variant="accent" size="xl">
            <Link href="/services/mobile-training-team">
              About the Mobile Training Team
            </Link>
          </Button>
        </div>
      </section>

      <section
        id="training-enquiry"
        aria-labelledby="training-enquiry-heading"
        className="scroll-mt-24 section-spacing"
      >
        <div className="page-container grid gap-10 lg:grid-cols-[2fr_3fr]">
          <SectionHeading
            id="training-enquiry-heading"
            eyebrow="Enrol or book a group"
            title="Enquire about training"
            description="Tell us which course you're interested in and how many people need training. We'll reply with dates, locations and pricing."
          />
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
            <TrainingEnquiryForm />
          </div>
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
