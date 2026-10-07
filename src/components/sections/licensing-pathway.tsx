import { ArrowDown, ArrowRight, RefreshCw, SprayCan } from "lucide-react";
import Link from "next/link";

import {
  findTrainingCourseBySlug,
  licensingPathwayCourseSlugs,
  type TrainingCourse,
} from "@/config/training-courses";

/**
 * Step-by-step diagram of the Texas security licensing pathway:
 * Level II → Level III → Level IV, with the pepper spray supplement after
 * Level III and renewal courses for licensed officers.
 */
export function LicensingPathway() {
  const pathwayCourses = licensingPathwayCourseSlugs
    .map(findTrainingCourseBySlug)
    .filter((course): course is TrainingCourse => course !== undefined);

  return (
    <div className="flex flex-col gap-6">
      <ol
        data-reveal-stagger
        className="flex flex-col gap-3 md:flex-row md:items-stretch"
      >
        {pathwayCourses.map((course, stepIndex) => {
          const Icon = course.icon;
          const isLastStep = stepIndex === pathwayCourses.length - 1;
          return (
            <li
              key={course.slug}
              className="flex flex-1 flex-col items-stretch gap-3 md:flex-row md:items-center"
            >
              <Link
                href={`/training/${course.slug}`}
                className="flex h-full flex-1 flex-col gap-2 rounded-lg border-2 border-navy-900 bg-white p-5 transition-colors hover:border-gold-500"
              >
                <span className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-navy-900 font-heading text-lg font-bold text-gold-400">
                    <span className="sr-only">Step </span>
                    {stepIndex + 1}
                  </span>
                  <Icon aria-hidden="true" className="size-6 text-gold-600" />
                </span>
                <span className="font-heading text-xl font-bold text-navy-900 uppercase">
                  {course.licenceLevel}
                </span>
                <span className="text-sm text-muted-foreground">
                  {course.name.split("—")[1]?.trim() ?? course.name}
                </span>
              </Link>
              {!isLastStep && (
                <span aria-hidden="true" className="flex justify-center">
                  <ArrowRight className="hidden size-6 text-gold-600 md:block" />
                  <ArrowDown className="size-6 text-gold-600 md:hidden" />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="grid gap-3 md:grid-cols-2">
        <Link
          href="/training/pepper-spray"
          className="flex items-start gap-3 rounded-lg border border-dashed border-gold-600 bg-white p-4 transition-colors hover:bg-paper"
        >
          <SprayCan
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-gold-600"
          />
          <span className="text-sm text-navy-900">
            <span className="font-semibold">After Level III:</span> Pepper Spray
            Training adds a separate pepper spray training certificate.
          </span>
        </Link>
        <a
          href="#deltacon-tactical-academy"
          className="flex items-start gap-3 rounded-lg border border-dashed border-gold-600 bg-white p-4 transition-colors hover:bg-paper"
        >
          <RefreshCw
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-gold-600"
          />
          <span className="text-sm text-navy-900">
            <span className="font-semibold">Already licensed?</span> Level III
            and Level IV renewal and continuing education courses are offered
            through Deltacon Tactical Academy.
          </span>
        </a>
      </div>

      <p className="text-sm text-muted-foreground">
        Each step is subject to applicable exemptions. Successful training
        completion supports your licensing application; the Texas Department of
        Public Safety (DPS) separately determines licensing eligibility.
      </p>
    </div>
  );
}
