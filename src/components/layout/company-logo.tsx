import Image from "next/image";
import Link from "next/link";

import { companyDetails } from "@/config/company-details";
import { cn } from "@/lib/utils";

import deltaconBadge from "@/assets/deltacon-badge.png";

type CompanyLogoProps = {
  /** Height of the badge in pixels; the width scales to keep its shape. */
  badgeHeight?: number;
  showWordmark?: boolean;
  className?: string;
};

export function CompanyLogo({
  badgeHeight = 48,
  showWordmark = true,
  className,
}: CompanyLogoProps) {
  const badgeWidth = Math.round(
    (badgeHeight * deltaconBadge.width) / deltaconBadge.height,
  );

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-3 rounded-sm", className)}
      aria-label={`${companyDetails.name} home page`}
    >
      <Image
        src={deltaconBadge}
        alt=""
        width={badgeWidth}
        height={badgeHeight}
        priority
      />
      {showWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-heading text-xl font-bold tracking-[0.12em] text-white uppercase">
            Deltacon
          </span>
          <span className="font-heading text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">
            Security
          </span>
        </span>
      )}
    </Link>
  );
}
