import { ArrowRight, Compass, FileText } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  licensingGuide,
  licensingGuideSteps,
  licensingQuickGuides,
} from "@/config/licensing-guide";

/** How many of the guide's steps are previewed before "+ N more". */
const previewStepCount = 4;

/**
 * Home page invitation to the step-by-step Texas licensing guide, with a
 * preview of its first steps drawn as a route.
 */
export function LicensingGuidePromo() {
  const previewSteps = licensingGuideSteps.slice(0, previewStepCount);
  const remainingStepCount = licensingGuideSteps.length - previewStepCount;

  return (
    <section
      aria-labelledby="licensing-guide-promo-heading"
      className="bg-white py-14 lg:py-20"
    >
      <div className="page-container">
        <div
          data-reveal="up"
          className="relative isolate grid grid-cols-1 items-center gap-10 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-paper via-white to-gold-300/10 p-8 shadow-sm sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14 lg:p-14"
        >
          <Compass
            aria-hidden="true"
            className="absolute -top-16 -left-16 -z-10 size-64 text-gold-500/[0.07]"
          />

          <div className="flex flex-col items-start gap-5">
            <p className="flex items-center gap-3 font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
              <span aria-hidden="true" className="eyebrow-rule" />
              Free licensing guide
            </p>
            <h2
              id="licensing-guide-promo-heading"
              className="text-3xl leading-tight font-bold text-navy-900 uppercase sm:text-4xl"
            >
              Not sure where to start?{" "}
              <span className="text-gold-600">
                Follow the pathway to your Texas license.
              </span>
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Our {licensingGuideSteps.length}-step guide walks you through
              choosing your level, checking eligibility, training, applying in
              TOPS, fingerprints and your first shift, one step at a time.
            </p>
            <ul className="flex flex-wrap gap-2">
              {licensingQuickGuides.map((guide) => (
                <li
                  key={guide.id}
                  className="rounded-full border border-navy-200 bg-white px-3 py-1 text-sm font-medium text-navy-800"
                >
                  <span className="font-semibold">{guide.level}</span>{" "}
                  <span className="text-muted-foreground">· {guide.title}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
              <Button asChild variant="accent" size="xl">
                <Link href="/guide">
                  Start the guide
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="/guide#quick-guides">
                  <FileText aria-hidden="true" />
                  Quick guides by level
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Updated {licensingGuide.updatedOn}
            </p>
          </div>

          {/* Preview of the route through the guide */}
          <Link
            href="/guide"
            aria-label={`Preview: the first ${previewStepCount} steps of the guide. Open the full guide.`}
            className="group relative flex flex-col gap-1 rounded-2xl bg-navy-900 security-pattern p-6 text-white shadow-xl shadow-navy-950/20 transition-transform hover:-translate-y-1 motion-reduce:transition-none sm:p-8"
          >
            <p className="mb-4 flex items-center justify-between font-heading text-xs font-semibold tracking-[0.3em] text-gold-300 uppercase">
              <span>Your route</span>
              <span className="text-navy-200">
                {licensingGuideSteps.length} steps
              </span>
            </p>
            <ol
              data-reveal-stagger
              className="relative flex flex-col gap-4 before:absolute before:top-4 before:bottom-4 before:left-4 before:border-l-2 before:border-dashed before:border-gold-500/50"
            >
              {previewSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.id}
                    className="relative flex items-center gap-4"
                  >
                    <span
                      className={
                        index === 0
                          ? "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-gold-500 text-sm font-bold text-navy-950 shadow-[0_0_18px_rgb(214_181_98/0.6)]"
                          : "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-gold-500/60 bg-navy-900 text-sm font-bold text-gold-300"
                      }
                    >
                      {index + 1}
                    </span>
                    <span className="flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2.5">
                      <span className="text-base font-medium">
                        {step.shortTitle}
                      </span>
                      <Icon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-gold-400"
                      />
                    </span>
                  </li>
                );
              })}
              <li className="relative flex items-center gap-4 text-navy-200">
                <span className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-dashed border-white/30 bg-navy-900 text-xs font-bold">
                  +{remainingStepCount}
                </span>
                <span className="text-sm">more steps to your first shift</span>
              </li>
            </ol>
            <span className="mt-5 inline-flex items-center gap-2 self-end text-sm font-semibold text-gold-300">
              Open the guide
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
