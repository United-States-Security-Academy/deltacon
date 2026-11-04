import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  Landmark,
  Mail,
  Phone,
  ShieldCheck,
  Siren,
  SprayCan,
  Users,
} from "lucide-react";
import Link from "next/link";

import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { CapabilityStatementShowcase } from "@/components/sections/capability-statement-showcase";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredDataScript } from "@/components/seo/structured-data-script";
import { Button } from "@/components/ui/button";
import { companyDetails } from "@/config/company-details";
import {
  businessCredentials,
  capabilityStatementPath,
  contractExperience,
  custodialServices,
  emergencyResponse,
  governmentAwards,
  governmentContactEmail,
  governmentContactSection,
  governmentContracting,
  missionFocusedPartner,
  protectiveServices,
  reasonsAgenciesChooseDeltacon,
  staffingSolutions,
  trainingAcademies,
  trainingAndConsulting,
  type ServiceDescription,
} from "@/config/government-contracting";
import { requestServiceLink } from "@/config/navigation";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { buildServiceData } from "@/lib/seo/structured-data";

const pagePath = "/government-contracting";

/** Long button labels wrap onto two lines on phones instead of overflowing. */
const wrappingButtonClassName =
  "h-auto min-h-12 py-3 text-center whitespace-normal";

export const metadata = createPageMetadata({
  title: "Government Contracting Solutions",
  description: governmentContracting.introduction[0]!,
  path: pagePath,
});

const scopeOfWorkEmailLink = `mailto:${governmentContactEmail}?subject=${encodeURIComponent("Scope of Work")}`;
const capabilityStatementRequestLink = `mailto:${governmentContactEmail}?subject=${encodeURIComponent("Capability Statement Request")}`;

/** Opens the capability statement PDF in a new tab, else asks for it by email. */
function CapabilityStatementButton({
  variant,
}: {
  variant: "outlineOnDark" | "outline";
}) {
  return (
    <Button
      asChild
      variant={variant}
      size="xl"
      className={wrappingButtonClassName}
    >
      {capabilityStatementPath ? (
        <a
          href={capabilityStatementPath}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileText aria-hidden="true" />
          View Our Capability Statement
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
      ) : (
        <a href={capabilityStatementRequestLink}>
          <FileText aria-hidden="true" />
          Request Our Capability Statement
        </a>
      )}
    </Button>
  );
}

function CheckList({
  items,
  columns = 1,
}: {
  items: string[];
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={
        columns === 2
          ? "grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2"
          : "flex flex-col gap-3"
      }
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
            <Check aria-hidden="true" className="size-3.5" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ServiceDescriptionCard({ service }: { service: ServiceDescription }) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
      <h3 className="text-xl font-bold text-navy-900 uppercase sm:text-2xl">
        {service.title}
      </h3>
      {service.paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-muted-foreground">
          {paragraph}
        </p>
      ))}
      {service.list && (
        <div className="flex flex-col gap-3">
          {service.listIntroduction && (
            <p className="font-semibold text-navy-900">
              {service.listIntroduction}
            </p>
          )}
          <CheckList items={service.list} />
        </div>
      )}
      {service.closing && (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {service.closing}
        </p>
      )}
    </article>
  );
}

export default function GovernmentContractingPage() {
  return (
    <>
      <StructuredDataScript
        data={buildServiceData({
          name: governmentContracting.eyebrow,
          summary: governmentContracting.introduction[0]!,
          path: pagePath,
        })}
      />

      <PageHeader
        eyebrow={governmentContracting.eyebrow}
        title={governmentContracting.title}
        introduction={governmentContracting.tagline}
        breadcrumbs={[
          { label: "Services", href: "/services" },
          { label: governmentContracting.eyebrow },
        ]}
      >
        <div className="flex flex-col gap-5">
          <ul className="flex flex-wrap gap-2">
            {[
              `Texas DPS License # ${companyDetails.securityLicenseNumber}`,
              governmentContracting.serviceArea,
              governmentContracting.licensingFootprint,
            ].map((highlight) => (
              <li
                key={highlight}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-4 py-2 text-sm font-medium text-navy-100"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="size-4 text-gold-400"
                />
                {highlight}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              variant="accent"
              size="xl"
              className={wrappingButtonClassName}
            >
              <Link href={requestServiceLink.href}>
                Request a Government Contracting Consultation
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <CapabilityStatementButton variant="outlineOnDark" />
          </div>
        </div>
      </PageHeader>

      {/* Overview and procurement quick facts */}
      <section
        aria-labelledby="government-overview-heading"
        className="section-spacing"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-5">
            <SectionHeading
              id="government-overview-heading"
              eyebrow="Veteran-owned"
              title={governmentContracting.tagline}
            />
            {governmentContracting.introduction.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <aside
            aria-label="Procurement quick facts"
            className="flex flex-col gap-4 rounded-2xl bg-navy-900 security-pattern p-6 text-white sm:p-8 lg:sticky lg:top-28"
          >
            <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.25em] text-gold-300 uppercase">
              <Landmark aria-hidden="true" className="size-4" />
              Procurement quick facts
            </p>
            <dl className="flex flex-col divide-y divide-white/10">
              {[
                ...businessCredentials.companyInformation.filter((item) =>
                  ["Unique Entity ID — UEI", "CAGE Code"].includes(item.label),
                ),
                {
                  label: "NAICS codes",
                  value: businessCredentials.naicsCodes
                    .map((naics) => naics.code)
                    .join(" · "),
                },
                {
                  label: "Texas DPS License",
                  value: companyDetails.securityLicenseNumber,
                },
                {
                  label: "Certifications",
                  value: businessCredentials.certifications
                    .map((certification) => certification.abbreviation)
                    .join(" · "),
                },
              ].map((fact) => (
                <div key={fact.label} className="flex flex-col gap-0.5 py-3">
                  <dt className="text-xs font-semibold tracking-wider text-gold-300 uppercase">
                    {fact.label}
                  </dt>
                  <dd className="font-heading text-lg font-bold tracking-wide">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href={`mailto:${governmentContactEmail}`}
              className="flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-white"
            >
              <Mail aria-hidden="true" className="size-4" />
              {governmentContactEmail}
            </a>
          </aside>
        </div>
      </section>

      {/* Mission-focused partner and capabilities */}
      <section
        aria-labelledby="mission-partner-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionHeading
              id="mission-partner-heading"
              eyebrow="Your government services partner"
              title={missionFocusedPartner.title}
            />
            {missionFocusedPartner.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-4 rounded-xl border-l-4 border-gold-500 bg-white p-6 shadow-sm sm:p-8">
            <p className="font-heading text-lg font-bold text-navy-900 uppercase">
              {missionFocusedPartner.capabilitiesIntroduction}
            </p>
            <CheckList items={missionFocusedPartner.capabilities} />
          </div>
        </div>
      </section>

      {/* Security guard and protective services */}
      <section
        aria-labelledby="protective-services-heading"
        className="section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="protective-services-heading"
            eyebrow="Security"
            title="Security Guard & Protective Services"
          />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {protectiveServices.map((service) => (
              <ServiceDescriptionCard key={service.title} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Emergency security and rapid response */}
      <section
        aria-labelledby="emergency-response-heading"
        className="relative isolate overflow-hidden bg-navy-950 security-pattern section-spacing text-white"
      >
        <div className="page-container grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
              <Siren aria-hidden="true" className="size-4" />
              Emergency response
            </p>
            <h2
              id="emergency-response-heading"
              className="text-3xl font-bold uppercase sm:text-4xl"
            >
              {emergencyResponse.title}
            </h2>
            <p className="text-lg leading-relaxed text-navy-100">
              {emergencyResponse.introduction}
            </p>
            <p className="font-semibold">
              {emergencyResponse.listIntroduction}
            </p>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {emergencyResponse.list.map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-100">
                  <Check
                    aria-hidden="true"
                    className="mt-1 size-4 shrink-0 text-gold-400"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5 rounded-2xl border border-gold-500/40 bg-white/5 p-6 backdrop-blur-sm sm:p-8">
            <p className="flex flex-col gap-1">
              <span className="font-heading text-7xl leading-none font-bold text-gold-400 sm:text-8xl">
                {emergencyResponse.mobilization.figure}
              </span>
              <span className="text-lg font-semibold">
                {emergencyResponse.mobilization.headline}
              </span>
            </p>
            <p className="text-sm leading-relaxed text-navy-100">
              {emergencyResponse.mobilization.statement}
            </p>
            <p className="border-t border-white/15 pt-4 text-sm leading-relaxed text-navy-100">
              {emergencyResponse.closing}
            </p>
          </div>
        </div>
      </section>

      {/* Staffing */}
      <section
        aria-labelledby="government-staffing-heading"
        className="section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="government-staffing-heading"
            eyebrow="Workforce"
            title={staffingSolutions.title}
            description={staffingSolutions.introduction}
          />
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {staffingSolutions.services.map((service) => (
              <li
                key={service.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <Users aria-hidden="true" className="size-7 text-gold-600" />
                <h3 className="text-lg font-bold text-navy-900 uppercase">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.text}</p>
              </li>
            ))}
          </ul>
          <p className="max-w-3xl text-lg text-muted-foreground">
            {staffingSolutions.closing}
          </p>
        </div>
      </section>

      {/* Training and consulting, and the academies */}
      <section
        aria-labelledby="training-consulting-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="training-consulting-heading"
            eyebrow="Training & consulting"
            title={trainingAndConsulting.title}
            description={trainingAndConsulting.introduction}
          />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainingAndConsulting.services.map((service) => (
              <li
                key={service.title}
                className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm"
              >
                <ShieldCheck
                  aria-hidden="true"
                  className="size-7 text-gold-600"
                />
                <h3 className="text-lg font-bold text-navy-900 uppercase">
                  {service.title}
                </h3>
                <p className="text-muted-foreground">{service.text}</p>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 items-stretch gap-6 overflow-hidden rounded-2xl bg-navy-900 security-pattern text-white lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="flex flex-col gap-5 p-6 sm:p-10">
              <h3 className="flex items-center gap-3 text-2xl font-bold uppercase sm:text-3xl">
                <GraduationCap
                  aria-hidden="true"
                  className="size-8 shrink-0 text-gold-400"
                />
                {trainingAcademies.title}
              </h3>
              <p className="text-navy-100">{trainingAcademies.introduction}</p>
              <ul className="flex flex-col gap-3">
                {trainingAcademies.academies.map((academy) => (
                  <li
                    key={academy.name}
                    className="flex flex-col gap-1 rounded-lg border border-white/15 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-heading text-lg font-bold">
                      {academy.name}
                    </span>
                    <span className="text-sm text-gold-300">
                      Texas DPS License # {academy.licenseNumber}
                    </span>
                  </li>
                ))}
              </ul>
              {trainingAcademies.paragraphs.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-navy-100">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="flex flex-col justify-center gap-3 border-t border-white/10 bg-gold-500/10 p-6 sm:p-10 lg:border-t-0 lg:border-l">
              <span className="font-heading text-7xl leading-none font-bold text-gold-400">
                {trainingAcademies.trainedOfficers.figure}
              </span>
              <span className="text-lg font-semibold">
                {trainingAcademies.trainedOfficers.label}
              </span>
              <p className="text-sm leading-relaxed text-navy-100">
                {trainingAcademies.trainedOfficers.statement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Custodial */}
      <section
        aria-labelledby="custodial-support-heading"
        className="section-spacing"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <SectionHeading
              id="custodial-support-heading"
              eyebrow="Facility support"
              title={custodialServices.title}
            />
            <p className="text-lg leading-relaxed text-muted-foreground">
              {custodialServices.introduction}
            </p>
            <p className="text-muted-foreground">{custodialServices.closing}</p>
          </div>
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-paper p-6 sm:p-8">
            <p className="flex items-center gap-2 font-heading text-lg font-bold text-navy-900 uppercase">
              <SprayCan aria-hidden="true" className="size-5 text-gold-600" />
              {custodialServices.listIntroduction}
            </p>
            <CheckList items={custodialServices.list} />
          </div>
        </div>
      </section>

      {/* Contract experience */}
      <section
        aria-labelledby="contract-experience-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="contract-experience-heading"
            eyebrow="Past performance"
            title={contractExperience.title}
            description={contractExperience.introduction}
          />
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {contractExperience.agencies.map((agency) => (
              <li
                key={agency.name}
                className="flex gap-4 rounded-xl border-l-4 border-gold-500 bg-white p-6 shadow-sm"
              >
                <Building2
                  aria-hidden="true"
                  className="mt-1 size-6 shrink-0 text-navy-700"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-heading text-lg leading-snug font-bold text-navy-900">
                    {agency.name}
                  </h3>
                  <p className="text-muted-foreground">{agency.experience}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex max-w-3xl flex-col gap-3 text-muted-foreground">
            {contractExperience.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications, identifiers and NAICS */}
      <section
        aria-labelledby="business-credentials-heading"
        className="section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="business-credentials-heading"
            eyebrow="Procurement"
            title={businessCredentials.title}
            description={businessCredentials.introduction}
          />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {businessCredentials.certifications.map((certification) => (
              <li
                key={certification.abbreviation}
                className="flex flex-col items-center gap-2 rounded-xl border border-gold-500/40 bg-gradient-to-b from-gold-300/15 to-white p-5 text-center"
              >
                <BadgeCheck
                  aria-hidden="true"
                  className="size-7 text-gold-600"
                />
                <span className="font-heading text-xl font-bold text-navy-900">
                  {certification.abbreviation}
                </span>
                <span className="text-sm text-muted-foreground">
                  {certification.name}
                </span>
              </li>
            ))}
          </ul>
          <p className="max-w-3xl text-muted-foreground">
            {businessCredentials.closing}
          </p>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <h3 className="bg-navy-900 px-6 py-4 font-heading text-lg font-bold tracking-wide text-white uppercase">
                Company information
              </h3>
              <dl className="divide-y divide-border">
                {[
                  ...businessCredentials.companyInformation,
                  {
                    label: "Government contracting email",
                    value: governmentContactEmail,
                  },
                  {
                    label: "Government contracting telephone",
                    value: companyDetails.phoneDisplay,
                  },
                  { label: "Website", value: "www.deltacon1.com" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 gap-1 px-6 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-4"
                  >
                    <dt className="font-semibold text-navy-900">{row.label}</dt>
                    <dd className="break-words text-muted-foreground">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
              <h3 className="bg-navy-900 px-6 py-4 font-heading text-lg font-bold tracking-wide text-white uppercase">
                NAICS codes
              </h3>
              <table className="w-full text-left">
                <caption className="sr-only">
                  NAICS codes and service categories
                </caption>
                <thead className="sr-only">
                  <tr>
                    <th scope="col">NAICS code</th>
                    <th scope="col">Service category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {businessCredentials.naicsCodes.map((naics) => (
                    <tr key={naics.code}>
                      <th
                        scope="row"
                        className="px-6 py-3 font-heading text-xl font-bold text-gold-700"
                      >
                        {naics.code}
                      </th>
                      <td className="px-6 py-3 text-muted-foreground">
                        {naics.category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="border-t border-border px-6 py-4 text-sm text-muted-foreground">
                {businessCredentials.naicsNote}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section
        aria-labelledby="government-awards-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="government-awards-heading"
            eyebrow="Recognition"
            title="Awards & Recognition"
          />
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {governmentAwards.map((award) => (
              <li
                key={award.title}
                className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                    <Award aria-hidden="true" className="size-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-navy-900 uppercase">
                      {award.title}
                    </h3>
                    <p className="text-sm font-semibold text-gold-700">
                      {award.highlight}
                    </p>
                  </div>
                </div>
                {award.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why agencies choose Deltacon */}
      <section
        aria-labelledby="why-agencies-heading"
        className="section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="why-agencies-heading"
            eyebrow="Why Deltacon"
            title="Why Agencies Choose Deltacon"
          />
          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasonsAgenciesChooseDeltacon.map((reason, index) => (
              <li
                key={reason.title}
                className="flex flex-col gap-2 rounded-xl border border-border p-6"
              >
                <span
                  aria-hidden="true"
                  className="font-heading text-3xl font-bold text-gold-600"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-heading text-lg font-bold text-navy-900">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground">{reason.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Contact */}
      <section
        aria-labelledby="government-contact-heading"
        className="bg-navy-900 security-pattern section-spacing text-white"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
              {governmentContactSection.motto}
            </p>
            <h2
              id="government-contact-heading"
              className="text-3xl font-bold uppercase sm:text-4xl"
            >
              {governmentContactSection.title}
            </h2>
            {governmentContactSection.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-navy-100"
              >
                {paragraph}
              </p>
            ))}
            <div className="flex flex-col gap-3 rounded-xl border border-white/15 bg-white/5 p-5">
              <p className="flex items-center gap-2 font-semibold">
                <ClipboardList
                  aria-hidden="true"
                  className="size-5 text-gold-400"
                />
                {governmentContactSection.checklistIntroduction}
              </p>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {governmentContactSection.checklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-navy-100"
                  >
                    <Check
                      aria-hidden="true"
                      className="mt-1 size-4 shrink-0 text-gold-400"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-2xl bg-white p-6 text-charcoal shadow-xl sm:p-8">
            <div className="flex flex-col gap-1">
              <p className="font-heading text-sm font-semibold tracking-[0.25em] text-gold-700 uppercase">
                Government Contracting Contact
              </p>
              <p className="text-lg font-bold text-navy-900">
                Deltacon Global Inc.
              </p>
              <p className="text-navy-900">{companyDetails.name}</p>
              <p className="text-muted-foreground">Sugar Land, Texas</p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${companyDetails.phoneInternational}`}
                className="flex items-center gap-3 text-lg font-semibold text-navy-900 hover:text-gold-700"
              >
                <Phone aria-hidden="true" className="size-5 text-gold-600" />
                {companyDetails.phoneDisplay}
              </a>
              <a
                href={`mailto:${governmentContactEmail}`}
                className="flex items-center gap-3 text-lg font-semibold break-all text-navy-900 hover:text-gold-700"
              >
                <Mail
                  aria-hidden="true"
                  className="size-5 shrink-0 text-gold-600"
                />
                {governmentContactEmail}
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="accent"
                size="xl"
                className={wrappingButtonClassName}
              >
                <Link href={requestServiceLink.href}>
                  Request a Government Contracting Consultation
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className={wrappingButtonClassName}
              >
                <a href={scopeOfWorkEmailLink}>
                  <Mail aria-hidden="true" />
                  Submit Your Scope of Work
                </a>
              </Button>
              <CapabilityStatementButton variant="outline" />
            </div>
            <p className="border-t border-border pt-4 text-center text-sm text-muted-foreground italic">
              {governmentContactSection.pillars.join(" • ")}
            </p>
          </div>
        </div>
      </section>

      <CapabilityStatementShowcase />

      <CallToActionBand />
    </>
  );
}
