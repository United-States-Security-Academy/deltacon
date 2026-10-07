"use client";

import { useEffect, useRef } from "react";

type AnimatedNumberProps = {
  /** The figure to show, e.g. "13", "500+" or "24/7". */
  value: string;
  /** How long the count-up takes, in milliseconds. */
  durationInMilliseconds?: number;
};

/** Splits "500+" into 500 and "+". Returns undefined for values like "24/7". */
function splitNumberAndSuffix(
  value: string,
): { targetNumber: number; suffix: string } | undefined {
  const match = /^(\d+)(\D*)$/.exec(value);
  if (!match) return undefined;
  return { targetNumber: Number(match[1]), suffix: match[2] ?? "" };
}

/** Starts quickly and slows down near the end. */
function easeOutCubic(progress: number): number {
  return 1 - Math.pow(1 - progress, 3);
}

/**
 * Counts up from 0 to the figure when it scrolls into view.
 *
 * - The real figure is in the server-rendered HTML, so search engines and
 *   visitors without JavaScript always see the correct number.
 * - Visitors who prefer reduced motion see the final number straight away.
 * - Screen readers only ever hear the final figure, not the counting.
 * - The digits are updated directly on the element, so React does not
 *   re-render on every animation frame.
 */
export function AnimatedNumber({
  value,
  durationInMilliseconds = 1600,
}: AnimatedNumberProps) {
  const countingTextRef = useRef<HTMLSpanElement>(null);
  const numberParts = splitNumberAndSuffix(value);

  useEffect(() => {
    const countingText = countingTextRef.current;
    const parts = splitNumberAndSuffix(value);
    if (!countingText || !parts) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const { targetNumber, suffix } = parts;
    const showNumber = (numberToShow: number) => {
      countingText.textContent = `${numberToShow}${suffix}`;
    };
    let animationFrameId = 0;

    function runCountUp() {
      const startTime = performance.now();
      const showNextFrame = (currentTime: number) => {
        const progress = Math.min(
          (currentTime - startTime) / durationInMilliseconds,
          1,
        );
        showNumber(Math.round(easeOutCubic(progress) * targetNumber));
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(showNextFrame);
        }
      };
      animationFrameId = requestAnimationFrame(showNextFrame);
    }

    // Start from zero, then count up the first time the figure is on screen.
    showNumber(0);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          runCountUp();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(countingText);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      showNumber(targetNumber);
    };
  }, [value, durationInMilliseconds]);

  if (!numberParts) return <>{value}</>;

  return (
    <>
      <span className="sr-only">{value}</span>
      {/* Fixed-width digits stop the figure from wobbling while it counts. */}
      <span
        ref={countingTextRef}
        aria-hidden="true"
        className="inline-block tabular-nums"
      >
        {value}
      </span>
    </>
  );
}
