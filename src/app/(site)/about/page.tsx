import { BadgeCheck, Target } from "lucide-react";
import Image from "next/image";

import deltaconBadge from "@/assets/deltacon-badge.png";
import { AffiliationsSection } from "@/components/sections/affiliations-section";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { CompanyStatisticsBand } from "@/components/sections/company-statistics-band";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
import {
  companyStory,
  companyValues,
  leadershipTeam,
  licencesAndCertifications,
  missionStatement,
} from "@/config/about-content";
import { companyDetails } from "@/config/company-details";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn about Deltacon Security: our story, mission, values, leadership team and licences.",
  path: "/about",
});

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .map((namePart) => namePart[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About Deltacon"
        title="Who we are"
        introduction={`${companyDetails.name} is a licensed private security company serving clients across ${companyDetails.location.region}.`}
        breadcrumbs={[{ label: "About" }]}
      />

      <section aria-labelledby="our-story-heading" className="section-spacing">
        <div className="page-container grid items-center gap-12 lg:grid-cols-[3fr_2fr]">
          <div className="flex flex-col gap-5">
            <SectionHeading
              id="our-story-heading"
              eyebrow="Our story"
              title={companyStory.heading}
            />
            {companyStory.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div
            data-reveal="zoom"
            className="flex justify-center rounded-lg bg-navy-900 security-pattern p-10"
          >
            <Image
              src={deltaconBadge}
              alt={`${companyDetails.name} badge with the motto ${companyDetails.motto}`}
              className="h-auto w-full max-w-64"
              sizes="256px"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="mission-and-values-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-12">
          <div
            data-reveal="left"
            className="flex flex-col gap-6 rounded-lg border-l-4 border-gold-500 bg-white p-8 shadow-sm"
          >
            <h2
              id="mission-and-values-heading"
              className="flex items-center gap-3 text-2xl font-bold text-navy-900 uppercase"
            >
              <Target aria-hidden="true" className="size-7 text-gold-600" />
              Our mission
            </h2>
            <p className="max-w-4xl text-xl leading-relaxed text-charcoal">
              {missionStatement}
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <h2 className="text-3xl font-bold text-navy-900 uppercase">
              Our values
            </h2>
            <ul
              data-reveal-stagger
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {companyValues.map((value) => {
                const Icon = value.icon;
                return (
                  <li
                    key={value.name}
                    className="flex flex-col gap-3 rounded-lg bg-white p-6 shadow-sm"
                  >
                    <Icon aria-hidden="true" className="size-8 text-gold-600" />
                    <h3 className="text-xl font-bold text-navy-900 uppercase">
                      {value.name}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="leadership-heading" className="section-spacing">
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="leadership-heading"
            eyebrow="Leadership"
            title="The team behind Deltacon"
            description="Experienced security professionals who stay personally involved in every client relationship."
          />
          <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
            {leadershipTeam.map((teamMember) => (
              <li
                key={teamMember.role}
                className="flex flex-col gap-4 rounded-lg border border-border p-6"
              >
                <span
                  aria-hidden="true"
                  className="flex size-16 items-center justify-center rounded-full bg-navy-900 font-heading text-2xl font-bold text-gold-400"
                >
                  {getInitials(teamMember.name)}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-navy-900 uppercase">
                    {teamMember.name}
                  </h3>
                  <p className="font-medium text-gold-700">{teamMember.role}</p>
                </div>
                <p className="text-muted-foreground">{teamMember.biography}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="licences-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="licences-heading"
            eyebrow="Compliance"
            title="Licences & certifications"
            description="We operate fully within Texas private security regulations, and our officers' licences are kept current at all times."
          />
          <ul data-reveal-stagger className="grid gap-6 md:grid-cols-3">
            {licencesAndCertifications.map((licence) => (
              <li
                key={licence.name}
                className="flex gap-4 rounded-lg bg-white p-6 shadow-sm"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="size-8 shrink-0 text-gold-600"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-navy-900 uppercase">
                    {licence.name}
                  </h3>
                  <p className="text-sm font-medium text-navy-700">
                    {licence.issuer}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {licence.detail}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <AffiliationsSection className="border-t border-border" />
      <CompanyStatisticsBand />
      <WhyChooseUsSection />
      <CallToActionBand />
    </>
  );
}
