import { ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { veteransProgramBanner } from "@/config/training-courses";

/*
 * The flag is drawn in a 600 × 400 box. Every stripe edge follows the same
 * cubic curve (control points 90 units above and below the line), so the
 * stripes stack without gaps and the whole flag appears to ripple.
 */
const flagWidth = 600;
const flagHeight = 400;
const stripeHeight = flagHeight / 13;
const waveDepth = 90;
const cantonWidth = flagWidth * 0.4;
const cantonHeight = stripeHeight * 7;

/** How far the wave lifts or drops the flag at a given x position. */
function waveOffsetAt(x: number) {
  const progress = x / flagWidth;
  return 3 * waveDepth * progress * (1 - progress) * (2 * progress - 1);
}

/** A band between two wavy lines, from `top` down to `top + height`. */
function wavyBandPath(top: number, height: number) {
  const bottom = top + height;
  return [
    `M 0 ${top}`,
    `C ${flagWidth / 3} ${top - waveDepth}, ${(flagWidth * 2) / 3} ${top + waveDepth}, ${flagWidth} ${top}`,
    `L ${flagWidth} ${bottom}`,
    `C ${(flagWidth * 2) / 3} ${bottom + waveDepth}, ${flagWidth / 3} ${bottom - waveDepth}, 0 ${bottom}`,
    "Z",
  ].join(" ");
}

/** Points of a five-pointed star centred on 0,0. */
const starPoints = Array.from({ length: 10 }, (_, pointIndex) => {
  const radius = pointIndex % 2 === 0 ? 7 : 2.9;
  const angle = (Math.PI / 5) * pointIndex - Math.PI / 2;
  return `${(radius * Math.cos(angle)).toFixed(2)},${(radius * Math.sin(angle)).toFixed(2)}`;
}).join(" ");

/** 50 stars in nine alternating rows of six and five, riding the wave. */
const starPositions = Array.from({ length: 9 }, (_, rowIndex) => {
  const isLongRow = rowIndex % 2 === 0;
  const starCount = isLongRow ? 6 : 5;
  return Array.from({ length: starCount }, (_, columnIndex) => {
    const x = ((isLongRow ? 1 : 2) + columnIndex * 2) * (cantonWidth / 12);
    const y = ((rowIndex + 1) * cantonHeight) / 10 + waveOffsetAt(x);
    return { x, y };
  });
}).flat();

/** Sweeping gold light lines, drawn in a 1200 × 400 box stretched to fit. */
const lightStreakPaths = [
  "M -50 385 C 320 340, 700 290, 1250 50",
  "M -50 365 C 360 345, 720 250, 1250 115",
  "M 180 410 C 520 330, 820 230, 1250 15",
  "M -50 300 C 420 385, 820 345, 1250 335",
  "M 320 410 C 640 360, 930 300, 1250 210",
];

function WavingFlag() {
  return (
    <svg
      viewBox={`0 0 ${flagWidth} ${flagHeight}`}
      preserveAspectRatio="xMinYMid slice"
      className="size-full"
    >
      <defs>
        <clipPath id="veterans-flag-canton">
          <rect width={cantonWidth} height={flagHeight} />
        </clipPath>
        {/* Light and shadow across the folds, matching the wave. */}
        <linearGradient id="veterans-flag-folds" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.21" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0.4" />
          <stop offset="0.79" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <g transform="rotate(-6 300 200) scale(1.12)">
        {Array.from({ length: 13 }, (_, stripeIndex) => (
          <path
            key={stripeIndex}
            d={wavyBandPath(stripeIndex * stripeHeight, stripeHeight + 0.5)}
            fill={stripeIndex % 2 === 0 ? "#b4202f" : "#f2efe8"}
          />
        ))}
        <g clipPath="url(#veterans-flag-canton)">
          <path d={wavyBandPath(0, cantonHeight)} fill="#1b2b63" />
          {starPositions.map((star) => (
            <polygon
              key={`${star.x}-${star.y}`}
              points={starPoints}
              transform={`translate(${star.x} ${star.y})`}
              fill="#f7f5f0"
            />
          ))}
        </g>
        <rect
          width={flagWidth}
          height={flagHeight}
          fill="url(#veterans-flag-folds)"
        />
      </g>
    </svg>
  );
}

function GoldLightStreaks() {
  return (
    <svg
      viewBox="0 0 1200 400"
      preserveAspectRatio="none"
      className="absolute inset-0 size-full"
    >
      <defs>
        <linearGradient
          id="veterans-streak-gold"
          gradientUnits="userSpaceOnUse"
          x1="0"
          x2="1200"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="#c9a44c" stopOpacity="0" />
          <stop offset="0.35" stopColor="#c9a44c" stopOpacity="0.55" />
          <stop offset="0.75" stopColor="#fff1c2" stopOpacity="0.95" />
          <stop offset="1" stopColor="#e3c77a" stopOpacity="0.4" />
        </linearGradient>
        <filter
          id="veterans-streak-glow"
          x="-10%"
          y="-50%"
          width="120%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* Soft glow under each line. */}
      <g filter="url(#veterans-streak-glow)" opacity="0.7">
        {lightStreakPaths.map((path) => (
          <path
            key={path}
            d={path}
            fill="none"
            stroke="url(#veterans-streak-gold)"
            strokeWidth="5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
      {lightStreakPaths.map((path, index) => (
        <path
          key={path}
          d={path}
          fill="none"
          stroke="url(#veterans-streak-gold)"
          strokeWidth={index % 2 === 0 ? 1.5 : 1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* Bright pulses that travel along the lines (motion only). */}
      {lightStreakPaths.slice(0, 3).map((path, index) => (
        <path
          key={path}
          d={path}
          pathLength={1000}
          fill="none"
          stroke="#fff8dc"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="light-streak-pulse"
          style={{ animationDelay: `${index * 1.6}s` }}
        />
      ))}
    </svg>
  );
}

/**
 * Banner inviting U.S. military veterans to train tuition-free at the United
 * States Security Academy. All wording comes from `veteransProgramBanner`;
 * the flag and light lines are drawn in code, so they scale to any screen.
 */
export function VeteransProgramBanner() {
  const banner = veteransProgramBanner;

  return (
    <aside
      aria-labelledby="veterans-banner-heading"
      data-reveal="zoom"
      className="relative isolate overflow-hidden rounded-2xl border border-navy-700 bg-gradient-to-br from-navy-800 via-navy-900 to-navy-975 text-white shadow-2xl shadow-navy-950/30"
    >
      {/* Artwork: flag on the left fading into navy, gold light sweeping across. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute inset-y-0 left-0 w-full [mask-image:linear-gradient(to_right,#000_25%,transparent_90%)] opacity-35 md:w-[55%] md:[mask-image:linear-gradient(to_right,#000_45%,transparent_98%)] md:opacity-100">
          <WavingFlag />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_60%_0%,rgb(42_69_112/0.55),transparent_70%)]" />
        <GoldLightStreaks />
      </div>

      <div className="flex flex-col gap-8 px-6 py-10 sm:px-10 md:py-12 md:pr-10 md:pl-[38%] lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:py-14 lg:pr-12 lg:pl-[34%]">
        <div className="flex flex-col items-start gap-4">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold-500/50 bg-navy-975/50 px-3.5 py-1.5 font-heading text-xs font-semibold tracking-[0.3em] text-gold-300 uppercase backdrop-blur-sm">
            <ShieldCheck aria-hidden="true" className="size-4" />
            {banner.eyebrow}
          </p>
          <h3
            id="veterans-banner-heading"
            className="text-4xl leading-[0.95] font-bold uppercase [text-shadow:0_2px_18px_rgb(5_14_29/0.7)] sm:text-5xl xl:text-6xl"
          >
            {banner.headingStart}{" "}
            <span className="bg-gradient-to-b from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
              {banner.headingHighlight}
            </span>
          </h3>
          <p className="text-lg font-semibold text-white sm:text-xl">
            {banner.tagline}
          </p>
          <p className="flex items-center gap-2 text-sm text-navy-100 sm:text-base">
            <ShieldCheck
              aria-hidden="true"
              className="size-4 shrink-0 text-gold-400"
            />
            {banner.eligibility}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2.5 lg:items-center">
          <Button
            asChild
            variant="accent"
            size="xl"
            className="h-14 rounded-full bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 px-9 font-heading text-lg font-bold tracking-wider uppercase shadow-[0_0_36px_rgb(214_181_98/0.45)] ring-1 ring-gold-300/70 transition-shadow hover:shadow-[0_0_48px_rgb(214_181_98/0.65)]"
          >
            <a href={banner.applyUrl} target="_blank" rel="noopener noreferrer">
              {banner.buttonLabel}
              <ArrowRight aria-hidden="true" className="size-5" />
              <span className="sr-only">
                {" "}
                to the veterans program (opens the United States Security
                Academy website in a new tab)
              </span>
            </a>
          </Button>
          <p className="text-sm text-navy-200">{banner.buttonNote}</p>
        </div>
      </div>
    </aside>
  );
}
