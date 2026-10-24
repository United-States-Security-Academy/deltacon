import {
  CalendarDays,
  Landmark,
  ListOrdered,
  Phone,
  Users,
} from "lucide-react";

import { GuideRichText } from "@/components/guide/guide-rich-text";
import { LicensingGuideStepper } from "@/components/guide/licensing-guide-stepper";
import { LicensingQuickGuidesSection } from "@/components/guide/licensing-quick-guides-section";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import {
  dpsContacts,
  governingLaws,
  licensingGuide,
  licensingGuideClosing,
  licensingGuideSteps,
} from "@/config/licensing-guide";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Guide: Security Guard Licensing in Texas",
  description:
    "Step-by-step guide to Texas security officer licensing: choose Level II, III or IV, check eligibility, train, apply through TOPS, get fingerprinted, affiliate with an employer and renew.",
  path: "/guide",
});

const guideHighlights = [
  { icon: CalendarDays, label: `Updated ${licensingGuide.updatedOn}` },
  { icon: ListOrdered, label: `${licensingGuideSteps.length} steps` },
  { icon: Users, label: "Unarmed · Armed · Personal protection" },
];

export default function LicensingGuidePage() {
  return (
    <>
      <PageHeader
        eyebrow="Licensing guide"
        title={licensingGuide.title}
        introduction={licensingGuide.subtitle}
        breadcrumbs={[{ label: "Guide" }]}
      >
        <ul className="flex flex-wrap gap-2">
          {guideHighlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <li
                key={highlight.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-navy-100"
              >
                <Icon aria-hidden="true" className="size-4 text-gold-400" />
                {highlight.label}
              </li>
            );
          })}
        </ul>
      </PageHeader>

      <section aria-label="The guide" className="bg-paper section-spacing">
        <div className="page-container flex flex-col gap-10">
          <div className="flex max-w-4xl flex-col gap-4 border-l-4 border-gold-500 pl-5 text-lg leading-relaxed sm:pl-6">
            {licensingGuide.introduction.map((paragraph, index) => (
              <p key={index}>
                <GuideRichText text={paragraph} />
              </p>
            ))}
            <p className="text-base text-muted-foreground">
              Work through one step at a time and press{" "}
              <strong className="text-navy-900">Next</strong> when you&apos;re
              ready to continue. Already know your license level?{" "}
              <a
                href="#quick-guides"
                className="font-semibold text-navy-800 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-700"
              >
                Jump to the Level II, III and IV quick guides
              </a>
              .
            </p>
          </div>

          <LicensingGuideStepper />
        </div>
      </section>

      <LicensingQuickGuidesSection />

      <section
        aria-labelledby="guide-reference-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
              Reference
            </p>
            <h2
              id="guide-reference-heading"
              className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl"
            >
              Laws and official contacts
            </h2>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[3fr_2fr]">
            {/* Governing laws */}
            <div className="flex flex-col gap-5 rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold text-navy-900 uppercase">
                <Landmark aria-hidden="true" className="size-6 text-gold-600" />
                Which Texas laws govern the process?
              </h3>
              <p className="text-lg leading-relaxed">
                <GuideRichText text={governingLaws.introduction} />
              </p>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] border-collapse text-left text-base">
                  <caption className="sr-only">
                    Useful provisions and their subjects
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-navy-900">
                      <th scope="col" className="py-2 pr-4 font-semibold">
                        Provision
                      </th>
                      <th scope="col" className="py-2 font-semibold">
                        Subject
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {governingLaws.provisions.map((row) => (
                      <tr
                        key={row.provision}
                        className="border-b border-border last:border-0"
                      >
                        <th
                          scope="row"
                          className="py-3 pr-4 font-semibold whitespace-nowrap text-navy-900"
                        >
                          {row.provision}
                        </th>
                        <td className="py-3">{row.subject}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                <GuideRichText text={governingLaws.furtherReading} />
              </p>
            </div>

            {/* DPS contacts */}
            <div className="flex flex-col gap-5 rounded-2xl bg-navy-900 security-pattern p-6 text-white sm:p-8">
              <h3 className="flex items-center gap-3 text-2xl font-bold uppercase">
                <Phone aria-hidden="true" className="size-6 text-gold-400" />
                Texas DPS licensing contacts
              </h3>
              <p>
                <strong>{dpsContacts.organisation}</strong>
                <br />
                <span className="text-navy-100">{dpsContacts.division}</span>
              </p>
              <dl className="flex flex-col gap-4">
                {dpsContacts.items.map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <dt className="text-xs font-semibold tracking-wider text-gold-300 uppercase">
                      {item.label}
                    </dt>
                    <dd className="text-base">
                      <GuideRichText
                        text={item.value}
                        linkClassName="text-white hover:text-gold-300"
                      />
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-white/15 pt-4 text-sm leading-relaxed text-navy-100">
                <GuideRichText
                  text={dpsContacts.publishedEmail}
                  linkClassName="break-all text-white hover:text-gold-300"
                />
              </p>
            </div>
          </div>

          <p className="max-w-4xl text-sm text-muted-foreground italic">
            {licensingGuideClosing.disclaimer}
          </p>
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
