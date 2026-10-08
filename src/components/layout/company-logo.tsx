import Image from "next/image";
import Link from "next/link";

import { companyDetails } from "@/config/company-details";
import { cn } from "@/lib/utils";

import deltaconBadge from "@/assets/deltacon-badge.png";

type LogoSize = "header" | "footer";

/** Badge height, text sizes and slogan visibility for each place the logo appears. */
const logoSizeClasses: Record<
  LogoSize,
  { badge: string; name: string; subtitle: string; slogan: string }
> = {
  header: {
    badge: "h-20",
    name: "text-[2rem] lg:text-[2.4rem]",
    subtitle: "text-[0.95rem] lg:text-[1.1rem]",
    // Too small to read on phones, so the slogan starts at tablet width.
    slogan: "hidden md:flex text-[0.6rem] lg:text-[0.625rem]",
  },
  footer: {
    badge: "h-20",
    name: "text-[2.2rem]",
    subtitle: "text-[1rem]",
    slogan: "flex text-[0.66rem]",
  },
};

/*
 * Tight line spacing, measured from the fonts themselves:
 * - Barlow Condensed capitals are 0.70em tall, with 0.30em of empty space
 *   above them and 0.20em below. line-height 0.8 removes the space below and
 *   a -0.1em top margin removes the rest above, so each line is exactly as
 *   tall as its capital letters.
 * - Inter (the slogan) capitals are 0.728em tall; line-height 0.728 trims the
 *   space above and below evenly.
 * The gaps between lines are then set precisely below.
 *
 * Note: list the font-size class BEFORE these line-height classes. The class
 * merger treats a later font-size as replacing an earlier line-height.
 */
const capitalsOnlyHeading = "leading-[0.8] -mt-[0.1em]";
const capitalsOnlySlogan = "leading-[0.728]";

/** Polished gold, light at the top with a darker band, like brushed metal. */
const metallicGoldText =
  "bg-[linear-gradient(180deg,#fbeeb8_0%,#e9cf86_22%,#c9a44c_48%,#9c7a2a_62%,#d9b964_82%,#f3dd9a_100%)] bg-clip-text text-transparent";

/** Bright white fading to cool silver. */
const silverText =
  "bg-[linear-gradient(180deg,#ffffff_0%,#eef2f8_45%,#b8c3d6_100%)] bg-clip-text text-transparent";

/**
 * Spreads letters evenly across the full width of the wordmark, so every line
 * of the logo starts and ends at exactly the same place at any size. The
 * gradient is applied to each letter so it renders reliably in all browsers.
 */
function SpreadLetters({
  text,
  className,
  letterClassName,
}: {
  text: string;
  className?: string;
  letterClassName: string;
}) {
  return (
    <span className={cn("flex w-full justify-between", className)}>
      {Array.from(text).map((character, index) =>
        character === " " ? (
          <span key={index} className="w-[0.35em]" />
        ) : (
          <span key={index} className={letterClassName}>
            {character}
          </span>
        ),
      )}
    </span>
  );
}

type CompanyLogoProps = {
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
};

/**
 * The Deltacon badge with its wordmark:
 *   DELTACON          (metallic gold)
 *   SECURITY GROUP    (white to silver)
 *   — Trusted to be there…when it matters. —
 * All lines share one width, set by whichever line is naturally widest.
 * Built entirely in code, so it stays sharp at every size.
 */
export function CompanyLogo({
  size = "header",
  showWordmark = true,
  className,
}: CompanyLogoProps) {
  const sizeClasses = logoSizeClasses[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center gap-3 rounded-sm sm:gap-4",
        className,
      )}
      aria-label={`${companyDetails.name} home page`}
    >
      <Image
        src={deltaconBadge}
        alt=""
        // Rendered up to 80px tall; this width gives sharp results on
        // high-density screens. The CSS height classes set the actual size.
        width={128}
        height={Math.round((128 * deltaconBadge.height) / deltaconBadge.width)}
        sizes="128px"
        priority
        className={cn(
          "w-auto drop-shadow-[0_4px_10px_rgb(0_0_0/0.45)]",
          sizeClasses.badge,
        )}
      />
      {showWordmark && (
        <span aria-hidden="true" className="inline-flex flex-col">
          <SpreadLetters
            text="Deltacon"
            className={cn(
              "font-heading font-bold uppercase drop-shadow-[0_2px_2px_rgb(0_0_0/0.55)]",
              sizeClasses.name,
              capitalsOnlyHeading,
            )}
            letterClassName={metallicGoldText}
          />
          <SpreadLetters
            text="Security Group"
            className={cn(
              "font-heading font-bold uppercase drop-shadow-[0_1px_1px_rgb(0_0_0/0.5)]",
              sizeClasses.subtitle,
              capitalsOnlyHeading,
              // 4px of visible space under "DELTACON".
              "mt-[calc(4px-0.1em)]",
            )}
            letterClassName={silverText}
          />
          <span
            className={cn(
              // 6px of visible space under "SECURITY GROUP".
              "mt-[6px] w-full items-center gap-1.5",
              sizeClasses.slogan,
              capitalsOnlySlogan,
            )}
          >
            <span className="h-px min-w-3 flex-1 bg-gradient-to-r from-transparent to-gold-500" />
            <span className="font-medium whitespace-nowrap text-white/90 italic">
              {companyDetails.slogan}
            </span>
            <span className="h-px min-w-3 flex-1 bg-gradient-to-l from-transparent to-gold-500" />
          </span>
        </span>
      )}
    </Link>
  );
}
