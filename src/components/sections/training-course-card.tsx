import { ArrowRight, CornerDownRight } from "lucide-react";
import Link from "next/link";

import { CourseEnquiryLink } from "@/components/sections/course-enquiry-link";
import {
  findTrainingAcademy,
  type TrainingCourse,
} from "@/config/training-courses";

type TrainingCourseCardProps = {
  course: TrainingCourse;
  /** Number of key facts to show (the course page shows them all). */
  numberOfKeyFacts?: number;
};

export function TrainingCourseCard({
  course,
  numberOfKeyFacts = 2,
}: TrainingCourseCardProps) {
  const Icon = course.icon;
  const academy = findTrainingAcademy(course.academyId);
  const coursePageUrl = `/training/${course.slug}`;

  return (
    <article
      aria-labelledby={`course-${course.slug}-heading`}
      className="flex h-full flex-col gap-4 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-gold-500 text-navy-950">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          {course.licenceLevel && (
            <span className="rounded-full bg-navy-900 px-2.5 py-1 text-xs font-semibold text-gold-300">
              {course.licenceLevel}
            </span>
          )}
          <span className="rounded-full bg-navy-100 px-2.5 py-1 text-xs font-semibold text-navy-800">
            {academy.shortName}
          </span>
        </div>
      </div>

      <h3
        id={`course-${course.slug}-heading`}
        className="text-xl font-bold text-navy-900 uppercase"
      >
        <Link href={coursePageUrl} className="hover:text-gold-700">
          {course.name}
        </Link>
      </h3>
      <p className="leading-relaxed text-muted-foreground">{course.summary}</p>

      {course.prerequisite && (
        <p className="flex gap-2 text-sm text-navy-800">
          <CornerDownRight
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-gold-600"
          />
          <span>
            <span className="font-semibold">Prerequisite:</span>{" "}
            {course.prerequisite}
          </span>
        </p>
      )}

      {numberOfKeyFacts > 0 && course.keyFacts.length > 0 && (
        <dl className="grid gap-2 rounded-md bg-paper p-3 text-sm">
          {course.keyFacts.slice(0, numberOfKeyFacts).map((fact) => (
            <div key={fact.label} className="flex flex-wrap gap-x-2">
              <dt className="font-semibold text-navy-900">{fact.label}:</dt>
              <dd className="text-navy-800">{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-auto flex flex-col gap-3 pt-2">
        <Link
          href={coursePageUrl}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-navy-900"
        >
          Course details
          <span className="sr-only">: {course.name}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
        <CourseEnquiryLink courseName={course.name} className="w-full" />
      </div>
    </article>
  );
}
