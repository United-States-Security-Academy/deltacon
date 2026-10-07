"use client";

import {
  ArrowRight,
  CalendarCheck,
  Mail,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ShieldHalf,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { EmailResultsForm } from "@/components/assessment/email-results-form";
import { AnimatedNumber } from "@/components/sections/animated-number";
import { Button } from "@/components/ui/button";
import {
  buildSiteSurveyPath,
  type AssessmentAnswers,
  type AssessmentResult,
} from "@/lib/security-assessment/score-assessment";
import { cn } from "@/lib/utils";

const ratingAppearance = {
  "well-protected": {
    icon: ShieldCheck,
    ringColour: "stroke-green-600",
    badgeClassName: "bg-green-100 text-green-800",
  },
  "some-gaps": {
    icon: ShieldHalf,
    ringColour: "stroke-gold-500",
    badgeClassName: "bg-gold-300/40 text-gold-700",
  },
  "high-risk": {
    icon: ShieldAlert,
    ringColour: "stroke-flag-red",
    badgeClassName: "bg-red-100 text-flag-red",
  },
} as const;

/** Colour of an area's bar: green when strong, gold in the middle, red when weak. */
function barColour(scorePercentage: number): string {
  if (scorePercentage >= 80) return "bg-green-600";
  if (scorePercentage >= 55) return "bg-gold-500";
  return "bg-flag-red";
}

/** Circular score gauge that fills up to the score once it is shown. */
function ScoreRing({
  scorePercentage,
  ringColour,
}: {
  scorePercentage: number;
  ringColour: string;
}) {
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    // Start empty, then fill on the next frame so the CSS transition plays.
    const animationFrameId = requestAnimationFrame(() =>
      setDisplayedPercentage(scorePercentage),
    );
    return () => cancelAnimationFrame(animationFrameId);
  }, [scorePercentage]);

  return (
    <div className="relative size-44 shrink-0 sm:size-52">
      <svg
        viewBox="0 0 128 128"
        className="size-full -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="12"
          className="stroke-white/15"
        />
        <circle
          cx="64"
          cy="64"
          r={radius}
          fill="none"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={
            circumference - (displayedPercentage / 100) * circumference
          }
          className={cn(
            "transition-[stroke-dashoffset] duration-[1600ms] ease-out",
            ringColour,
          )}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-5xl font-bold text-white sm:text-6xl">
          <AnimatedNumber value={String(scorePercentage)} />
        </span>
        <span className="text-sm text-navy-200">out of 100</span>
      </div>
    </div>
  );
}

type AssessmentResultsProps = {
  result: AssessmentResult;
  answers: AssessmentAnswers;
  onRetake: () => void;
};

/** Score, rating, breakdown by area, recommendations and next steps. */
export function AssessmentResults({
  result,
  answers,
  onRetake,
}: AssessmentResultsProps) {
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);
  const appearance = ratingAppearance[result.rating.id];
  const RatingIcon = appearance.icon;

  useEffect(() => {
    resultsHeadingRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {/* Score */}
      <section
        aria-labelledby="assessment-results-heading"
        className="flex flex-col items-center gap-8 rounded-xl bg-navy-900 security-pattern p-6 text-white sm:p-10 md:flex-row"
      >
        <ScoreRing
          scorePercentage={result.scorePercentage}
          ringColour={appearance.ringColour}
        />
        <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
          <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
            Your security score
          </p>
          <h2
            id="assessment-results-heading"
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="flex items-center gap-3 text-3xl font-bold uppercase outline-none sm:text-4xl"
          >
            <RatingIcon aria-hidden="true" className="size-8 text-gold-400" />
            <span>
              <span className="sr-only">
                You scored {result.scorePercentage} out of 100:{" "}
              </span>
              {result.rating.label}
            </span>
          </h2>
          <p className="max-w-xl text-lg text-navy-100">
            {result.rating.summary}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="accent" size="xl">
              <Link href={buildSiteSurveyPath(result)}>
                <CalendarCheck aria-hidden="true" />
                Book a site survey
              </Link>
            </Button>
            <Button asChild variant="outlineOnDark" size="xl">
              <a href="#email-results">
                <Mail aria-hidden="true" />
                Email me my results
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Score by area */}
      <section
        aria-labelledby="assessment-areas-heading"
        className="flex flex-col gap-5"
      >
        <h2
          id="assessment-areas-heading"
          className="text-2xl font-bold text-navy-900 uppercase"
        >
          Score by area
        </h2>
        <ul data-reveal-stagger className="grid gap-4 sm:grid-cols-2">
          {result.categories.map((category) => (
            <li
              key={category.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-navy-900">
                  {category.name}
                </span>
                <span className="font-heading text-lg font-bold text-navy-900">
                  {category.scorePercentage}
                  <span className="text-sm font-normal text-muted-foreground">
                    /100
                  </span>
                </span>
              </div>
              <div
                aria-hidden="true"
                className="h-2.5 overflow-hidden rounded-full bg-navy-100"
              >
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-1000",
                    barColour(category.scorePercentage),
                  )}
                  style={{ width: `${category.scorePercentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Recommendations */}
      <section
        aria-labelledby="assessment-recommendations-heading"
        className="flex flex-col gap-5"
      >
        <h2
          id="assessment-recommendations-heading"
          className="text-2xl font-bold text-navy-900 uppercase"
        >
          Your personalised recommendations
        </h2>
        {result.recommendations.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-5 text-charcoal">
            None of your answers raised a priority concern. A professional site
            survey can still confirm there are no hidden gaps.
          </p>
        ) : (
          <ol data-reveal-stagger className="flex flex-col gap-4">
            {result.recommendations.map((recommendation, index) => (
              <li
                key={recommendation.questionId}
                className="flex gap-4 rounded-lg border-l-4 border-gold-500 bg-white p-5 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy-900 font-heading text-lg font-bold text-gold-400"
                >
                  {index + 1}
                </span>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">
                      {recommendation.title}
                    </h3>
                    {recommendation.pointsEarned === 0 && (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-flag-red">
                        Priority
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {recommendation.advice}
                  </p>
                  <Link
                    href={`/services/${recommendation.serviceSlug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-navy-900"
                  >
                    How we help: {recommendation.serviceName}
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* Email results */}
      <section
        id="email-results"
        aria-labelledby="email-results-heading"
        className="scroll-mt-28 rounded-xl border border-border bg-paper p-6 sm:p-8"
      >
        <div className="mb-6 flex flex-col gap-2">
          <h2
            id="email-results-heading"
            className="text-2xl font-bold text-navy-900 uppercase"
          >
            Email me my results
          </h2>
          <p className="text-muted-foreground">
            Get a copy of your score and recommendations to keep or share with
            your team.
          </p>
        </div>
        <EmailResultsForm answers={answers} />
      </section>

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted-foreground">
          This self-assessment is a general guide based on your answers. It is
          not a substitute for a professional security survey.
        </p>
        <Button
          variant="ghost"
          size="lg"
          onClick={onRetake}
          className="text-navy-800"
        >
          <RotateCcw aria-hidden="true" />
          Retake the assessment
        </Button>
      </div>
    </div>
  );
}
