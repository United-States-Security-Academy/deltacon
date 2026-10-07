import Image from "next/image";
import Link from "next/link";

import { companyDetails } from "@/config/company-details";
import { cn } from "@/lib/utils";

import deltaconBadge from "@/assets/deltacon-badge.png";

type LogoSize = "header" | "footer";

/** Badge height and wordmark text sizes for each place the logo appears. */
const logoSizeClasses: Record<
  LogoSize,
  { badge: string; name: string; subtitle: string }
> = {
  header: {
    badge: "h-16 sm:h-[4.5rem] lg:h-20",
    name: "text-[1.75rem] sm:text-[2rem] lg:text-[2.25rem]",
    subtitle: "text-[0.6rem] sm:text-[0.68rem] lg:text-[0.75rem]",
  },
  footer: {
    badge: "h-20",
    name: "text-[2rem]",
    subtitle: "text-[0.7rem]",
  },
};

type CompanyLogoProps = {
  size?: LogoSize;
  showWordmark?: boolean;
  className?: string;
};

/**
 * The Deltacon badge with the "DELTACON / SECURITY GROUP" wordmark.
 * "SECURITY GROUP" is spread letter by letter across exactly the width of
 * "DELTACON", so the two lines always line up at every screen size.
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
        className={cn("w-auto", sizeClasses.badge)}
      />
      {showWordmark && (
        <span aria-hidden="true" className="inline-flex flex-col gap-1">
          <span
            className={cn(
              "font-heading leading-none font-bold tracking-[0.06em] text-white uppercase",
              sizeClasses.name,
            )}
          >
            Deltacon
          </span>
          <span
            className={cn(
              "flex w-full justify-between font-heading leading-none font-semibold text-gold-400 uppercase",
              sizeClasses.subtitle,
            )}
          >
            {Array.from("Security Group").map((character, index) => (
              <span
                key={index}
                className={character === " " ? "w-[0.4em]" : undefined}
              >
                {character}
              </span>
            ))}
          </span>
        </span>
      )}
    </Link>
  );
}
