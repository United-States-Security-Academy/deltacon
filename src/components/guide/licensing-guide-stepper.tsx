"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Info,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { GuideRichText } from "@/components/guide/guide-rich-text";
import { Button } from "@/components/ui/button";
import {
  careerPathways,
  licensingGuideClosing,
  licensingGuideSteps,
  type GuideBlock,
  type GuideStep,
} from "@/config/licensing-guide";
import { cn } from "@/lib/utils";

const stepCount = licensingGuideSteps.length;

function formatStepNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

/** The three licence levels side by side, each building on the last. */
function PathwayCards() {
  return (
    <ol className="grid gap-4 md:grid-cols-3">
      {careerPathways.map((pathway, index) => (
        <li
          key={pathway.level}
          className="relative flex flex-col gap-3 rounded-xl border border-border bg-paper p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="rounded-full bg-navy-900 px-3 py-1 font-heading text-sm font-semibold tracking-widest text-gold-300 uppercase">
              {pathway.level}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {pathway.commonName}
            </span>
          </div>
          <h3 className="text-xl leading-tight font-bold text-navy-900 uppercase">
            {pathway.name}
          </h3>
          <dl className="flex flex-col gap-2 text-base">
            <div>
              <dt className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Required training
              </dt>
              <dd>{pathway.requiredTraining}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold tracking-wider text-gold-700 uppercase">
                Intended duties
              </dt>
              <dd>{pathway.intendedDuties}</dd>
            </div>
          </dl>
          {index < careerPathways.length - 1 && (
            <ArrowRight
              aria-hidden="true"
              className="absolute top-1/2 -right-4 z-10 hidden size-6 -translate-y-1/2 rounded-full bg-gold-500 p-1 text-navy-950 md:block"
            />
          )}
        </li>
      ))}
    </ol>
  );
}

/** A document checklist the reader can tick off (kept only on this page). */
function DocumentChecklist({
  stepId,
  items,
}: {
  stepId: string;
  items: Extract<GuideBlock, { kind: "checklist" }>["items"];
}) {
  const [checkedIndexes, setCheckedIndexes] = useState<Set<number>>(
    () => new Set(),
  );

  function toggleItem(index: number) {
    setCheckedIndexes((previous) => {
      const next = new Set(previous);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p aria-live="polite" className="text-sm font-semibold text-navy-800">
        {checkedIndexes.size} of {items.length} ready
      </p>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => {
          const checkboxId = `${stepId}-item-${index}`;
          const isChecked = checkedIndexes.has(index);
          return (
            <li key={checkboxId}>
              <label
                htmlFor={checkboxId}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-base transition-colors",
                  isChecked
                    ? "border-gold-500 bg-gold-300/15"
                    : "border-border hover:border-gold-500",
                )}
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleItem(index)}
                  className="mt-1 size-5 shrink-0 accent-navy-900"
                />
                <span className={cn(isChecked && "text-muted-foreground")}>
                  <GuideRichText text={item} />
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function GuideBlockContent({
  block,
  stepId,
}: {
  block: GuideBlock;
  stepId: string;
}) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p>
          <GuideRichText text={block.text} />
        </p>
      );
    case "bulletList":
      return (
        <ul className="flex list-disc flex-col gap-2 pl-6 marker:text-gold-600">
          {block.items.map((item, index) => (
            <li key={index}>
              <GuideRichText text={item} />
            </li>
          ))}
        </ul>
      );
    case "numberedList":
      return (
        <ol className="flex flex-col gap-3">
          {block.items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-gold-300"
              >
                {index + 1}
              </span>
              <span className="pt-0.5">
                <span className="sr-only">{index + 1}. </span>
                <GuideRichText text={item} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "checklist":
      return <DocumentChecklist stepId={stepId} items={block.items} />;
    case "callout": {
      const isWarning = block.tone === "warning";
      const Icon = isWarning ? TriangleAlert : Info;
      return (
        <div
          className={cn(
            "flex gap-3 rounded-lg border-l-4 p-4 text-base",
            isWarning
              ? "border-flag-red bg-flag-red/5"
              : "border-navy-700 bg-navy-100/70",
          )}
        >
          <Icon
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-5 shrink-0",
              isWarning ? "text-flag-red" : "text-navy-700",
            )}
          />
          <div className="flex flex-col gap-1">
            <p
              className={cn(
                "font-semibold",
                isWarning ? "text-flag-red" : "text-navy-900",
              )}
            >
              {block.title}
            </p>
            <p>
              <GuideRichText text={block.text} />
            </p>
          </div>
        </div>
      );
    }
    case "pathwayCards":
      return <PathwayCards />;
  }
}

function StepProgressList({
  currentStepIndex,
  furthestStepIndex,
  isFinished,
  onSelectStep,
}: {
  currentStepIndex: number;
  furthestStepIndex: number;
  isFinished: boolean;
  onSelectStep: (index: number) => void;
}) {
  const completedCount = isFinished ? stepCount : currentStepIndex;
  const progressPercent = Math.round((completedCount / stepCount) * 100);

  return (
    <nav
      aria-label="Guide steps"
      className="flex flex-col gap-4 rounded-2xl bg-navy-900 p-5 text-white lg:sticky lg:top-28"
    >
      <div className="flex flex-col gap-2">
        <p className="flex items-baseline justify-between font-heading text-sm font-semibold tracking-widest text-gold-300 uppercase">
          <span>
            {isFinished
              ? "Guide complete"
              : `Step ${currentStepIndex + 1} of ${stepCount}`}
          </span>
          <span className="text-navy-200">{progressPercent}%</span>
        </p>
        <div
          role="progressbar"
          aria-label="Progress through the guide"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          className="h-1.5 overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-300 transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <ol className="flex flex-wrap gap-2 lg:flex-col lg:gap-0.5">
        {licensingGuideSteps.map((step, index) => {
          const isCurrent = !isFinished && index === currentStepIndex;
          const isComplete = isFinished || index < furthestStepIndex;
          const isReachable = index <= furthestStepIndex;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelectStep(index)}
                disabled={!isReachable}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg text-left text-sm transition-colors lg:w-full lg:px-2 lg:py-1.5",
                  isCurrent
                    ? "text-gold-300 lg:bg-white/10"
                    : "text-navy-100 enabled:hover:text-gold-300",
                  !isReachable && "cursor-not-allowed text-navy-200/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors",
                    isCurrent && "border-gold-400 bg-gold-500 text-navy-950",
                    !isCurrent &&
                      isComplete &&
                      "border-gold-500/60 bg-gold-500/15 text-gold-300",
                    !isCurrent && !isComplete && "border-white/20",
                  )}
                >
                  {isComplete && !isCurrent ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                {/* Phones show numbered circles only; the title is read out. */}
                <span className="sr-only lg:not-sr-only">
                  {step.shortTitle}
                </span>
                {isComplete && !isCurrent && (
                  <span className="sr-only"> (done)</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function StepPanel({
  step,
  index,
  isVisible,
  headingRef,
  onBack,
  onNext,
}: {
  step: GuideStep;
  index: number;
  isVisible: boolean;
  headingRef: (element: HTMLHeadingElement | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const Icon = step.icon;
  const nextStep = licensingGuideSteps[index + 1];
  const headingId = `guide-step-${step.id}`;

  return (
    <section
      aria-labelledby={headingId}
      hidden={!isVisible}
      className="guide-step-panel overflow-hidden rounded-2xl border border-border bg-white shadow-lg shadow-navy-950/5"
    >
      <header className="relative isolate overflow-hidden bg-navy-900 security-pattern px-6 py-7 text-white sm:px-10 sm:py-9">
        <span
          aria-hidden="true"
          className="absolute -top-6 right-2 -z-10 font-heading text-[8rem] leading-none font-bold text-white/[0.06] sm:text-[11rem]"
        >
          {formatStepNumber(index)}
        </span>
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gold-500 text-navy-950 shadow-lg shadow-gold-500/20">
            <Icon aria-hidden="true" className="size-7" />
          </span>
          <div className="flex flex-col gap-1.5">
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-300 uppercase">
              Step {index + 1} of {stepCount}
            </p>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="text-2xl leading-tight font-bold uppercase outline-none sm:text-3xl"
            >
              {step.title}
            </h2>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-5 px-6 py-8 text-lg leading-relaxed sm:px-10">
        {step.keyFact && (
          <aside
            aria-label="Key figure"
            className="flex items-center gap-4 rounded-xl border border-gold-500/40 bg-gradient-to-r from-gold-300/20 to-transparent p-4"
          >
            <span className="shrink-0 font-heading text-3xl font-bold text-gold-700 sm:text-4xl">
              {step.keyFact.figure}
            </span>
            <span className="text-base text-navy-900">
              {step.keyFact.label}
            </span>
          </aside>
        )}
        {step.blocks.map((block, blockIndex) => (
          <GuideBlockContent key={blockIndex} block={block} stepId={step.id} />
        ))}
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-border bg-paper px-6 py-5 sm:px-10">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={index === 0}
        >
          <ArrowLeft aria-hidden="true" />
          Back
        </Button>
        <Button variant="accent" size="lg" onClick={onNext}>
          {nextStep ? (
            <>
              Next
              <span className="hidden sm:inline">: {nextStep.shortTitle}</span>
              <ArrowRight aria-hidden="true" />
            </>
          ) : (
            <>
              Finish the guide
              <Flag aria-hidden="true" />
            </>
          )}
        </Button>
      </footer>
    </section>
  );
}

/**
 * The licensing guide, one step at a time: "Next" reveals the following
 * step, and steps already seen can be revisited from the progress list.
 * Every step is in the page's HTML (hidden until reached), so search engines
 * and printouts still have the whole guide.
 */
export function LicensingGuideStepper() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [furthestStepIndex, setFurthestStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const stepHeadings = useRef<(HTMLHeadingElement | null)[]>([]);
  const finishedHeading = useRef<HTMLHeadingElement>(null);
  const panelArea = useRef<HTMLDivElement>(null);
  const hasMoved = useRef(false);

  function goToStep(index: number) {
    hasMoved.current = true;
    setIsFinished(false);
    setCurrentStepIndex(index);
    setFurthestStepIndex((furthest) => Math.max(furthest, index));
  }

  function finishGuide() {
    hasMoved.current = true;
    setFurthestStepIndex(stepCount - 1);
    setIsFinished(true);
  }

  function startAgain() {
    hasMoved.current = true;
    setIsFinished(false);
    setCurrentStepIndex(0);
  }

  // After moving, bring the new step's heading into view and focus it, so
  // keyboard and screen reader users continue from the top of the step.
  useEffect(() => {
    if (!hasMoved.current) return;
    const heading = isFinished
      ? finishedHeading.current
      : stepHeadings.current[currentStepIndex];
    heading?.focus({ preventScroll: true });
    const panelTop = panelArea.current?.getBoundingClientRect().top ?? 0;
    if (panelTop < 0 || panelTop > window.innerHeight * 0.5) {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      panelArea.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  }, [currentStepIndex, isFinished]);

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <StepProgressList
        currentStepIndex={currentStepIndex}
        furthestStepIndex={furthestStepIndex}
        isFinished={isFinished}
        onSelectStep={goToStep}
      />

      <div ref={panelArea} className="min-w-0 scroll-mt-28">
        {licensingGuideSteps.map((step, index) => (
          <StepPanel
            key={step.id}
            step={step}
            index={index}
            isVisible={!isFinished && index === currentStepIndex}
            headingRef={(element) => {
              stepHeadings.current[index] = element;
            }}
            onBack={() => goToStep(index - 1)}
            onNext={() =>
              index + 1 < stepCount ? goToStep(index + 1) : finishGuide()
            }
          />
        ))}

        <section
          aria-labelledby="guide-finished-heading"
          hidden={!isFinished}
          className="guide-step-panel relative isolate overflow-hidden rounded-2xl bg-navy-900 security-pattern px-6 py-12 text-center text-white sm:px-12"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgb(201_164_76/0.25),transparent_65%)]"
          />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
            <span className="flex size-16 items-center justify-center rounded-full bg-gold-500 text-navy-950 shadow-[0_0_40px_rgb(214_181_98/0.5)]">
              <Check aria-hidden="true" className="size-8" />
            </span>
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-300 uppercase">
              All {stepCount} steps complete
            </p>
            <h2
              id="guide-finished-heading"
              ref={finishedHeading}
              tabIndex={-1}
              className="text-3xl font-bold uppercase outline-none sm:text-4xl"
            >
              {licensingGuideClosing.title}
            </h2>
            <p className="text-lg leading-relaxed text-navy-100">
              {licensingGuideClosing.text}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="xl">
                <Link href="/training">
                  Explore licensing courses
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outlineOnDark" size="xl">
                <Link href="/apply">Apply to join Deltacon</Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <Button
                variant="ghost"
                onClick={() => goToStep(stepCount - 1)}
                className="text-navy-100 hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft aria-hidden="true" />
                Back to step {stepCount}
              </Button>
              <Button
                variant="ghost"
                onClick={startAgain}
                className="text-navy-100 hover:bg-white/10 hover:text-white"
              >
                <RotateCcw aria-hidden="true" />
                Start again
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
