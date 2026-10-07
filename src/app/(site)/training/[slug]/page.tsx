import { Check, CornerDownRight, GraduationCap } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { TrainingEnquiryForm } from "@/components/forms/training-enquiry-form";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { TrainingCourseCard } from "@/components/sections/training-course-card";
import { Button } from "@/components/ui/button";
import {
  findCoursesForAcademy,
  findTrainingAcademy,
  findTrainingCourseBySlug,
  trainingCourses,
} from "@/config/training-courses";
import { createPageMetadata } from "@/lib/seo/page-metadata";

// Only the courses in config/training-courses.ts exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return trainingCourses.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/training/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = findTrainingCourseBySlug(slug);
  if (!course) return {};

  return createPageMetadata({
    title: course.name,
    description: course.summary,
    path: `/training/${course.slug}`,
  });
}

export default async function TrainingCourseDetailPage({
  params,
}: PageProps<"/training/[slug]">) {
  const { slug } = await params;
  const course = findTrainingCourseBySlug(slug);
  if (!course) notFound();

  const academy = findTrainingAcademy(course.academyId);
  const otherCoursesFromAcademy = findCoursesForAcademy(course.academyId)
    .filter((otherCourse) => otherCourse.slug !== course.slug)
    .slice(0, 3);
  const Icon = course.icon;

  return (
    <>
      <PageHeader
        eyebrow={
          course.licenceLevel
            ? `${academy.name} · ${course.licenceLevel}`
            : academy.name
        }
        title={course.name}
        introduction={course.summary}
        breadcrumbs={[
          { label: "Training", href: "/training" },
          { label: course.name },
        ]}
      >
        <div>
          <Button asChild variant="accent" size="xl">
            <a href="#course-enquiry">Enquire about this course</a>
          </Button>
        </div>
      </PageHeader>

      <div className="section-spacing">
        <div className="page-container grid items-start gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-10">
            <section
              aria-labelledby="course-overview-heading"
              className="flex flex-col gap-5"
            >
              <h2
                id="course-overview-heading"
                className="flex items-center gap-3 text-3xl font-bold text-navy-900 uppercase"
              >
                <Icon aria-hidden="true" className="size-8 text-gold-600" />
                About this course
              </h2>
              {course.description.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section
              aria-labelledby="course-topics-heading"
              className="flex flex-col gap-5"
            >
              <h2
                id="course-topics-heading"
                className="text-2xl font-bold text-navy-900 uppercase"
              >
                What you&apos;ll learn
              </h2>
              <ul data-reveal-stagger className="grid gap-3 sm:grid-cols-2">
                {course.topicsCovered.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-3 rounded-lg border border-border bg-white p-4"
                  >
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-gold-400">
                      <Check aria-hidden="true" className="size-4" />
                    </span>
                    <span className="font-medium text-navy-900">{topic}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside
            data-reveal="right"
            aria-labelledby="course-facts-heading"
            className="flex flex-col gap-5 rounded-lg bg-navy-900 security-pattern p-6 text-white lg:sticky lg:top-28 lg:p-8"
          >
            <h2
              id="course-facts-heading"
              className="text-2xl font-bold uppercase"
            >
              Course at a glance
            </h2>
            <dl className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <dt className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
                  Taught by
                </dt>
                <dd className="flex items-center gap-2">
                  <GraduationCap
                    aria-hidden="true"
                    className="size-5 text-gold-400"
                  />
                  {academy.name}
                </dd>
              </div>
              {course.prerequisite && (
                <div className="flex flex-col gap-1">
                  <dt className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
                    Prerequisite
                  </dt>
                  <dd className="flex gap-2">
                    <CornerDownRight
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0 text-gold-400"
                    />
                    {course.prerequisite}
                  </dd>
                </div>
              )}
              {course.keyFacts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1">
                  <dt className="text-sm font-semibold tracking-widest text-gold-400 uppercase">
                    {fact.label}
                  </dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
            <Button asChild variant="accent" size="lg" className="mt-2">
              <a href="#course-enquiry">Enquire now</a>
            </Button>
          </aside>
        </div>
      </div>

      <section
        id="course-enquiry"
        aria-labelledby="course-enquiry-heading"
        className="scroll-mt-24 bg-paper section-spacing"
      >
        <div className="page-container grid gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="flex flex-col gap-3">
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
              Enrol or book a group
            </p>
            <h2
              id="course-enquiry-heading"
              className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl"
            >
              Enquire about this course
            </h2>
            <p className="text-lg text-muted-foreground">
              Send us your details and we&apos;ll reply with upcoming dates,
              locations and pricing. For groups, we can also run this course at
              your site through our{" "}
              <Link
                href="/services/mobile-training-team"
                className="font-semibold text-gold-700 underline"
              >
                Mobile Training Team
              </Link>
              .
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm sm:p-8">
            <TrainingEnquiryForm preselectedCourseSlug={course.slug} />
          </div>
        </div>
      </section>

      {otherCoursesFromAcademy.length > 0 && (
        <section
          aria-labelledby="other-courses-heading"
          className="section-spacing"
        >
          <div className="page-container flex flex-col gap-8">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <h2
                id="other-courses-heading"
                className="text-3xl font-bold text-navy-900 uppercase"
              >
                More from {academy.name}
              </h2>
              <Link
                href="/training"
                className="font-semibold text-gold-700 hover:text-navy-900"
              >
                All training courses
              </Link>
            </div>
            <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
              {otherCoursesFromAcademy.map((otherCourse) => (
                <li key={otherCourse.slug}>
                  <TrainingCourseCard course={otherCourse} />
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
