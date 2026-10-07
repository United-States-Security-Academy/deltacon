"use client";

import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import type { Affiliation } from "@/config/affiliations";

/**
 * Each row repeats its logos this many times. Half of the copies are enough
 * to fill even very wide screens, so moving the track by exactly half its
 * width loops without a visible jump or gap.
 */
const copiesPerRow = 4;

function LogoTile({
  affiliation,
  isRepeatedCopy,
}: {
  affiliation: Affiliation;
  /** Copies exist only for the visual loop, so screen readers skip them. */
  isRepeatedCopy: boolean;
}) {
  return (
    // Spacing is padding (not flex gap) so every copy is exactly the same
    // width, which keeps the loop seamless.
    <li
      aria-hidden={isRepeatedCopy || undefined}
      className={
        isRepeatedCopy ? "marquee-copy shrink-0 pr-4" : "shrink-0 pr-4"
      }
    >
      <div className="flex h-full w-48 flex-col items-center gap-3 rounded-lg border border-border bg-white p-4 text-center transition-[box-shadow,border-color] hover:border-gold-500 hover:shadow-md sm:w-56">
        <div className="flex h-20 w-full items-center justify-center">
          <Image
            src={affiliation.logo}
            alt=""
            sizes="200px"
            className="max-h-20 w-auto max-w-full object-contain"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs leading-snug font-medium text-navy-900">
            {affiliation.name}
          </p>
          {affiliation.detail && (
            <p className="text-xs text-gold-700">{affiliation.detail}</p>
          )}
        </div>
      </div>
    </li>
  );
}

function MarqueeRow({
  affiliations,
  direction,
  label,
}: {
  affiliations: Affiliation[];
  direction: "left" | "right";
  label: string;
}) {
  return (
    <div className="marquee-row py-2">
      <ul
        aria-label={label}
        data-direction={direction}
        className="marquee-track"
        style={{ "--marquee-duration": "55s" } as React.CSSProperties}
      >
        {Array.from({ length: copiesPerRow }, (_, copyIndex) =>
          affiliations.map((affiliation) => (
            <LogoTile
              key={`${copyIndex}-${affiliation.name}`}
              affiliation={affiliation}
              isRepeatedCopy={copyIndex > 0}
            />
          )),
        )}
      </ul>
    </div>
  );
}

/**
 * Two rows of affiliation logos sliding in opposite directions. Pauses on
 * hover or keyboard focus, and has a pause/play button (WCAG 2.2.2). Visitors
 * who prefer reduced motion see a still grid instead (see globals.css).
 */
export function LogoMarquee({ affiliations }: { affiliations: Affiliation[] }) {
  const [isPaused, setIsPaused] = useState(false);
  const middleIndex = Math.ceil(affiliations.length / 2);

  return (
    <div
      data-paused={isPaused}
      className="marquee flex flex-col items-center gap-4"
    >
      <div className="flex w-full flex-col gap-2">
        <MarqueeRow
          affiliations={affiliations.slice(0, middleIndex)}
          direction="left"
          label="Memberships and associations"
        />
        <MarqueeRow
          affiliations={affiliations.slice(middleIndex)}
          direction="right"
          label="Recognitions and partners"
        />
      </div>

      <button
        type="button"
        onClick={() => setIsPaused((wasPaused) => !wasPaused)}
        className="marquee-pause-button flex size-10 items-center justify-center rounded-full border border-border text-navy-800 transition-colors hover:border-gold-500 hover:text-navy-950"
      >
        {isPaused ? (
          <Play aria-hidden="true" className="size-4" />
        ) : (
          <Pause aria-hidden="true" className="size-4" />
        )}
        {/* Icon-only button: this text is read by screen readers, not shown. */}
        <span className="sr-only">
          {isPaused ? "Play logo carousel" : "Pause logo carousel"}
        </span>
      </button>
    </div>
  );
}
