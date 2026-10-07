import { ArrowRight, ClipboardCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { assessmentQuestions } from "@/config/security-assessment";

/** Banner inviting visitors to take the security self-assessment. */
export function SecurityAssessmentPromo() {
  return (
    <section
      aria-labelledby="assessment-promo-heading"
      className="bg-white py-14 lg:py-20"
    >
      <div className="page-container">
        <div
          data-reveal="zoom"
          className="relative flex flex-col items-start gap-6 overflow-hidden rounded-xl bg-navy-900 security-pattern p-8 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-start gap-5">
            <span className="hidden size-16 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-navy-950 sm:flex">
              <ClipboardCheck aria-hidden="true" className="size-8" />
            </span>
            <div className="flex max-w-2xl flex-col gap-2">
              <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
                Free 3-minute self-assessment
              </p>
              <h2
                id="assessment-promo-heading"
                className="text-3xl font-bold uppercase sm:text-4xl"
              >
                How secure is your business?
              </h2>
              <p className="text-lg text-navy-100">
                Answer {assessmentQuestions.length} quick questions about your
                lighting, entry points, cameras and opening hours, and get a
                score with personalised recommendations.
              </p>
            </div>
          </div>
          <Button asChild variant="accent" size="xl" className="shrink-0">
            <Link href="/security-assessment">
              Take the assessment
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
