import { BadgeCheck } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/sections/section-heading";
import { affiliationGroups, membershipNumbers } from "@/config/affiliations";
import { cn } from "@/lib/utils";

/**
 * Recognitions, awards and affiliations: membership numbers, then logos
 * grouped by type on uniform white tiles. Each logo's name is printed beneath
 * it, so the image itself has empty alt text (screen readers would otherwise
 * read every name twice).
 */
export function AffiliationsSection({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="affiliations-heading"
      className={cn("bg-white section-spacing", className)}
    >
      <div className="page-container flex flex-col gap-12">
        <div className="flex flex-col items-center gap-6">
          <SectionHeading
            id="affiliations-heading"
            eyebrow="Recognitions, awards & affiliations"
            title="Recognized and trusted"
            description="Deltacon is a proud member of leading business, security and industry organizations, and is recognized for its support of veterans and the community."
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

        {affiliationGroups.map((group) => (
          <div key={group.heading} className="flex flex-col gap-5">
            <h3 className="flex items-center gap-4 text-sm font-semibold tracking-[0.25em] text-navy-700 uppercase">
              <span>{group.heading}</span>
              <span aria-hidden="true" className="h-px flex-1 bg-border" />
            </h3>
            {/* Centered wrap keeps part-filled rows balanced. */}
            <ul
              data-reveal-stagger
              className="flex flex-wrap justify-center gap-4"
            >
              {group.affiliations.map((affiliation) => (
                <li
                  key={affiliation.name}
                  className="flex basis-[calc(50%-0.5rem)] flex-col items-center gap-3 rounded-lg border border-border bg-white p-4 text-center transition-[box-shadow,border-color] hover:border-gold-500 hover:shadow-md sm:basis-[calc(33.333%-0.667rem)] lg:basis-[calc(25%-0.75rem)] xl:basis-[calc(20%-0.8rem)]"
                >
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
                      <p className="text-xs text-gold-700">
                        {affiliation.detail}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
