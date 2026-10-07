import { BadgeCheck } from "lucide-react";

import { LogoMarquee } from "@/components/sections/logo-marquee";
import { SectionHeading } from "@/components/sections/section-heading";
import { affiliationGroups, membershipNumbers } from "@/config/affiliations";
import { cn } from "@/lib/utils";

/** Every affiliation in one list, in the order they are grouped in the config. */
const allAffiliations = affiliationGroups.flatMap(
  (group) => group.affiliations,
);

/**
 * Recognitions, awards and affiliations: membership numbers, then two rows of
 * logos sliding in opposite directions.
 */
export function AffiliationsSection({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="affiliations-heading"
      className={cn("overflow-hidden bg-white section-spacing", className)}
    >
      <div className="flex flex-col gap-10">
        <div className="page-container flex flex-col items-center gap-6">
          <SectionHeading
            id="affiliations-heading"
            eyebrow="Recognitions, awards & affiliations"
            title="Recognized and trusted"
            description="Deltacon Security Group is a proud member of leading business, security and industry organizations, and is recognized for its support of veterans and the community."
            alignment="center"
          />
          <ul
            data-reveal-stagger
            className="flex flex-wrap justify-center gap-3"
          >
            {membershipNumbers.map((membership) => (
              <li
                key={membership.organisation}
                className="flex items-center gap-2 rounded-full border border-gold-500/60 bg-paper px-4 py-2 text-sm text-navy-900"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="size-4 text-gold-600"
                />
                <span>
                  {membership.organisation}{" "}
                  <span className="font-semibold">No. {membership.number}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="zoom">
          <LogoMarquee affiliations={allAffiliations} />
        </div>
      </div>
    </section>
  );
}
