import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  GraduationCap,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Receipt,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PlacesServed } from "@/components/locations/places-served";
import { PageHeader } from "@/components/sections/page-header";
import { SectionHeading } from "@/components/sections/section-heading";
import { StructuredDataScript } from "@/components/seo/structured-data-script";
import { Button } from "@/components/ui/button";
import { companyDetails } from "@/config/company-details";
import {
  findLocationBySlug,
  formatOfficeAddress,
  formatRate,
  locations,
  type Location,
  type LocationLink,
} from "@/config/locations";
import { requestServiceLink } from "@/config/navigation";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import {
  buildFaqPageData,
  buildLocationBusinessData,
} from "@/lib/seo/structured-data";

// Every location page is built ahead of time from config/locations.ts.
export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/locations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const location = findLocationBySlug(slug);
  if (!location) return {};
  const metadata = createPageMetadata({
    title: location.search.title,
    description: location.search.description,
    path: `/locations/${location.slug}`,
  });
  // The title already ends in "| Deltacon", so no site-name suffix.
  return { ...metadata, title: { absolute: location.search.title } };
}

/** Long button labels wrap onto two lines on phones instead of overflowing. */
const wrappingButtonClassName =
  "h-auto min-h-12 py-3 text-center whitespace-normal";

function requestProposalHref(location: Location) {
  return `${requestServiceLink.href}?location=${location.slug}`;
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
          ? "grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2"
          : "flex flex-col gap-2.5"
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

function PhoneLink({ location }: { location: Location }) {
  return (
    <a
      href={`tel:${location.office.phoneInternational}`}
      className="font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-700"
    >
      {location.office.phoneDisplay}
    </a>
  );
}

function RelatedLinks({ links }: { links?: LocationLink[] }) {
  if (!links?.length) return null;
  return (
    <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="inline-flex items-center gap-2 font-semibold text-gold-700 hover:text-navy-900"
          >
            {link.label}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** The office address as lines, inside an <address>. */
function OfficeAddress({ location }: { location: Location }) {
  const { office } = location;
  return (
    <>
      {office.streetAddress}
      <br />
      {office.city}, {office.stateCode} {office.postalCode}
    </>
  );
}

export default async function LocationPage({
  params,
}: PageProps<"/locations/[slug]">) {
  const { slug } = await params;
  const location = findLocationBySlug(slug);
  if (!location) notFound();

  const {
    office,
    hero,
    partner,
    services,
    training,
    industries,
    regionalFocus,
    pricing,
    government,
    areas,
    whyChoose,
    awards,
    gettingStarted,
    faq,
    finalCallToAction,
  } = location;
  const mapSearch = encodeURIComponent(
    `${companyDetails.name}, ${formatOfficeAddress(office)}`,
  );
  const regionalTopics =
    regionalFocus?.topics.filter((topic) => topic.paragraphs.length > 0) ?? [];

  return (
    <>
      <StructuredDataScript
        data={[
          buildLocationBusinessData(location),
          buildFaqPageData(faq.items),
        ]}
      />

      {/* 1. Hero */}
      <PageHeader
        eyebrow={`${location.name} · ${office.name}`}
        title={hero.heading}
        introduction={
          <div className="flex flex-col gap-3">
            <p className="font-heading text-xl font-semibold text-gold-300">
              {hero.tagline}
            </p>
            <p>{hero.introduction}</p>
          </div>
        }
        breadcrumbs={[
          { label: "Locations", href: "/locations" },
          { label: location.name },
        ]}
      >
        <div className="flex flex-col gap-5">
          <ul className="flex flex-col gap-2 text-navy-100 sm:flex-row sm:flex-wrap sm:gap-x-6">
            <li className="flex items-center gap-2">
              <Phone aria-hidden="true" className="size-4 text-gold-400" />
              <a
                href={`tel:${office.phoneInternational}`}
                className="font-semibold text-white hover:text-gold-300"
              >
                {office.phoneDisplay}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-gold-400"
              />
              <address className="not-italic">
                {formatOfficeAddress(office)}
              </address>
            </li>
            <li className="flex items-center gap-2">
              <BadgeCheck aria-hidden="true" className="size-4 text-gold-400" />
              Texas DPS License # {companyDetails.securityLicenseNumber}
            </li>
          </ul>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              variant="accent"
              size="xl"
              className={wrappingButtonClassName}
            >
              <Link href={requestProposalHref(location)}>
                {hero.primaryCallToAction}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outlineOnDark"
              size="xl"
              className={wrappingButtonClassName}
            >
              <a href={`tel:${office.phoneInternational}`}>
                <Phone aria-hidden="true" />
                {hero.secondaryCallToAction}
              </a>
            </Button>
          </div>
          {hero.placesServed && (
            <PlacesServed
              areaName={`the ${location.name}`}
              counties={hero.placesServed.counties}
              citiesAndTowns={hero.placesServed.citiesAndTowns}
              headquartersCity={
                location.isHeadquarters ? office.city : undefined
              }
              phoneDisplay={office.phoneDisplay}
              phoneInternational={office.phoneInternational}
            />
          )}
        </div>
      </PageHeader>

      {/* 2. Local security partner */}
      <section aria-labelledby="partner-heading" className="section-spacing">
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-5">
            <SectionHeading
              id="partner-heading"
              eyebrow={location.name}
              title={partner.title}
            />
            {[...partner.leadParagraphs, ...partner.paragraphs].map(
              (paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ),
            )}
            {partner.list && (
              <div className="flex flex-col gap-3 rounded-xl border-l-4 border-gold-500 bg-paper p-6">
                {partner.listIntroduction && (
                  <p className="font-semibold text-navy-900">
                    {partner.listIntroduction}
                  </p>
                )}
                <CheckList items={partner.list} columns={2} />
              </div>
            )}
            {partner.closing && (
              <p className="text-lg leading-relaxed text-muted-foreground">
                {partner.closing}
              </p>
            )}
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-navy-900 shadow-lg lg:sticky lg:top-28">
            <Image
              src={partner.photo.image}
              alt={partner.photo.altText}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. Pricing: local rate table; the full breakdown is on /security-guard-pricing */}
      <section
        id="pricing"
        aria-labelledby="pricing-heading"
        className="scroll-mt-24 bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="pricing-heading"
            eyebrow="Pricing"
            title={pricing.title}
          />
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
            <div className="flex flex-col gap-5">
              <h3 className="text-2xl font-bold text-navy-900 uppercase">
                {pricing.ratesTitle}
              </h3>
              {pricing.summary.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-lg leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
              <Link
                href={pricing.link.href}
                className="inline-flex items-center gap-2 self-start rounded-lg border border-gold-500/50 bg-white px-4 py-3 font-semibold text-navy-900 shadow-sm transition-colors hover:border-gold-500 hover:text-gold-700"
              >
                <Receipt aria-hidden="true" className="size-5 text-gold-600" />
                {pricing.link.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
                <table className="w-full text-left">
                  <caption className="bg-navy-900 px-5 py-4 text-left font-heading text-base font-bold tracking-wide text-white">
                    {pricing.ratesTableCaption}
                  </caption>
                  <thead>
                    <tr className="border-b-2 border-gold-500 text-sm text-navy-900">
                      <th scope="col" className="px-5 py-3 font-semibold">
                        Security Service
                      </th>
                      <th
                        scope="col"
                        className="px-5 py-3 text-right font-semibold"
                      >
                        Estimated Hourly Billing Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pricing.rates.map((rate) => (
                      <tr key={rate.service}>
                        <th
                          scope="row"
                          className="px-5 py-3.5 font-medium text-navy-900"
                        >
                          {rate.service}
                          {rate.detail && (
                            <span className="block text-sm font-normal text-muted-foreground">
                              {rate.detail}
                            </span>
                          )}
                        </th>
                        {rate.minimumPerHour === null ? (
                          <td className="px-5 py-3.5 text-right">
                            <Link
                              href={requestProposalHref(location)}
                              className="font-heading text-lg font-bold text-navy-900 underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
                            >
                              Request a Custom Quote
                            </Link>
                          </td>
                        ) : (
                          <td className="px-5 py-3.5 text-right font-heading text-xl font-bold whitespace-nowrap text-gold-700">
                            {formatRate(rate)}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p
                role="note"
                className="rounded-lg border-l-4 border-navy-700 bg-white px-4 py-3 text-sm font-medium text-navy-900"
              >
                {pricing.disclaimer}
              </p>
            </div>
          </div>
          {pricing.proposal && (
            <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <div className="flex max-w-3xl flex-col gap-3">
                <h3 className="text-2xl font-bold text-navy-900 uppercase">
                  {pricing.proposal.title}
                </h3>
                {pricing.proposal.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                <p className="font-semibold text-navy-900">
                  {pricing.proposal.callPrompt}{" "}
                  <PhoneLink location={location} />
                  {office.email && (
                    <>
                      {" · "}
                      <a
                        href={`mailto:${office.email}`}
                        className="underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-700"
                      >
                        {office.email}
                      </a>
                    </>
                  )}
                </p>
              </div>
              <Button
                asChild
                variant="accent"
                size="xl"
                className={`${wrappingButtonClassName} shrink-0 self-start lg:self-center`}
              >
                <Link href={requestProposalHref(location)}>
                  {hero.primaryCallToAction}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Services (white, so it alternates with Pricing above) */}
      <section aria-labelledby="services-heading" className="section-spacing">
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="services-heading"
            eyebrow="Services"
            title={services.title}
            description={services.introduction}
          />
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            {services.sections.map((service) => (
              <article
                key={service.title}
                className="flex flex-col gap-4 rounded-xl border border-border bg-paper p-6 sm:p-8"
              >
                <h3 className="text-xl font-bold text-navy-900 uppercase sm:text-2xl">
                  {service.title}
                </h3>
                {service.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-muted-foreground"
                  >
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
                  <p className="leading-relaxed text-muted-foreground">
                    {service.closing}
                  </p>
                )}
                {service.callPrompt && (
                  <p className="leading-relaxed text-muted-foreground">
                    Call <PhoneLink location={location} /> {service.callPrompt}
                  </p>
                )}
                <RelatedLinks links={service.links} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Training advantage (summary; details on /training-advantage) */}
      <section
        aria-labelledby="training-heading"
        className="bg-navy-900 security-pattern py-14 text-white lg:py-20"
      >
        <div className="page-container grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-4">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
              <GraduationCap aria-hidden="true" className="size-4" />
              Training advantage
            </p>
            <h2
              id="training-heading"
              className="text-3xl font-bold uppercase sm:text-4xl"
            >
              {training.title}
            </h2>
            {training.summary.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-navy-100"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex lg:justify-end">
            <Button
              asChild
              variant="accent"
              size="xl"
              className={`${wrappingButtonClassName} max-w-full`}
            >
              <Link href={training.link.href}>
                {training.link.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. Industries */}
      <section aria-labelledby="industries-heading" className="section-spacing">
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="industries-heading"
            eyebrow="Industries"
            title={industries.title}
            description={industries.introduction.join(" ")}
          />
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
            {industries.sections.map((industry) => (
              <article
                key={industry.title}
                className="flex h-full flex-col gap-4 rounded-xl border border-border p-6"
              >
                <h3 className="flex items-start gap-3 text-lg leading-snug font-bold text-navy-900 uppercase">
                  <Building2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-gold-600"
                  />
                  {industry.title}
                </h3>
                {industry.list && <CheckList items={industry.list} />}
                {industry.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {location.showClientNames && industry.clientExperience && (
                  <p className="leading-relaxed text-muted-foreground">
                    {industry.clientExperience}
                  </p>
                )}
                <RelatedLinks links={industry.links} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Region-specific topics (shown once they have text) */}
      {regionalFocus && regionalTopics.length > 0 && (
        <section
          aria-labelledby="regional-focus-heading"
          className="bg-paper section-spacing"
        >
          <div className="page-container flex flex-col gap-10">
            <SectionHeading
              id="regional-focus-heading"
              eyebrow={location.name}
              title={regionalFocus.title}
            />
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
              {regionalTopics.map((topic) => (
                <article
                  key={topic.title}
                  className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-navy-900 uppercase">
                    {topic.title}
                  </h3>
                  {topic.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Government */}
      <section
        aria-labelledby="government-heading"
        className="bg-navy-950 security-pattern section-spacing text-white"
      >
        <div className="page-container grid grid-cols-1 items-start gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
              <Landmark aria-hidden="true" className="size-4" />
              Public sector
            </p>
            <h2
              id="government-heading"
              className="text-3xl font-bold uppercase sm:text-4xl"
            >
              {government.title}
            </h2>
            {[...government.introduction, ...government.paragraphs].map(
              (paragraph) => (
                <p key={paragraph} className="leading-relaxed text-navy-100">
                  {paragraph}
                </p>
              ),
            )}
            {government.email && (
              <p className="flex items-center gap-2">
                <Mail aria-hidden="true" className="size-4 text-gold-400" />
                <span className="text-navy-100">
                  For government contracting inquiries:
                </span>
                <a
                  href={`mailto:${government.email}`}
                  className="font-semibold break-all hover:text-gold-300"
                >
                  {government.email}
                </a>
              </p>
            )}
            <Button
              asChild
              variant="accent"
              size="xl"
              className={`${wrappingButtonClassName} self-start`}
            >
              <Link href={government.link.href}>
                {government.link.label}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
            <p className="font-semibold">{government.listIntroduction}</p>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {government.list.map((item) => (
                <li key={item} className="flex items-start gap-2 text-navy-100">
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
      </section>

      {/* 8. Areas served and the office */}
      <section aria-labelledby="areas-heading" className="section-spacing">
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="areas-heading"
            eyebrow="Areas served"
            title={areas.title}
          />
          <div className="flex flex-col gap-6">
            {areas.subtitle && (
              <h3 className="text-2xl font-bold text-navy-900 uppercase">
                {areas.subtitle}
              </h3>
            )}
            <p className="max-w-4xl text-lg leading-relaxed text-muted-foreground">
              {areas.introduction}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {areas.cityGroups.map((group) => (
                <div
                  key={group.name ?? "cities"}
                  className={
                    group.name
                      ? "flex flex-col gap-3 rounded-xl border border-border p-5"
                      : "flex flex-col gap-3 md:col-span-2"
                  }
                >
                  {group.name && (
                    <h4 className="font-heading text-lg font-bold text-navy-900">
                      {group.name}
                    </h4>
                  )}
                  <ul className="flex flex-wrap gap-2">
                    {group.cities.map((city) => (
                      <li
                        key={city}
                        className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-paper px-3.5 py-1.5 text-sm font-semibold text-navy-900"
                      >
                        <MapPin
                          aria-hidden="true"
                          className="size-3.5 text-gold-600"
                        />
                        {city}
                      </li>
                    ))}
                  </ul>
                  {group.suffix && (
                    <p className="text-sm text-muted-foreground">
                      …{group.suffix}.
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex max-w-4xl flex-col gap-3 text-lg leading-relaxed text-muted-foreground">
              {areas.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {areas.callout && (
                <p className="font-semibold text-navy-900">
                  {areas.callout} <PhoneLink location={location} />
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="flex flex-col gap-5 rounded-2xl bg-navy-900 security-pattern p-6 text-white sm:p-8">
              <h3 className="text-2xl font-bold uppercase">
                {areas.officeTitle}
              </h3>
              <address className="flex flex-col gap-3 not-italic">
                <span className="font-semibold">{companyDetails.name}</span>
                <span className="flex items-start gap-3 text-navy-100">
                  <MapPin
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-gold-400"
                  />
                  <span>
                    <OfficeAddress location={location} />
                  </span>
                </span>
                <a
                  href={`tel:${office.phoneInternational}`}
                  className="flex items-center gap-3 text-lg font-semibold hover:text-gold-300"
                >
                  <Phone aria-hidden="true" className="size-5 text-gold-400" />
                  Telephone: {office.phoneDisplay}
                </a>
                {office.email && (
                  <a
                    href={`mailto:${office.email}`}
                    className="flex items-center gap-3 break-all hover:text-gold-300"
                  >
                    <Mail
                      aria-hidden="true"
                      className="size-5 shrink-0 text-gold-400"
                    />
                    {office.email}
                  </a>
                )}
                {office.hours && (
                  <span className="flex items-center gap-3 text-navy-100">
                    <Clock
                      aria-hidden="true"
                      className="size-5 text-gold-400"
                    />
                    {office.hours}
                  </span>
                )}
              </address>
              {areas.officeDescription && (
                <p className="leading-relaxed text-navy-100">
                  {areas.officeDescription}
                </p>
              )}
              <div className="relative mt-auto aspect-video overflow-hidden rounded-xl">
                <Image
                  src={areas.photo.image}
                  alt={areas.photo.altText}
                  fill
                  sizes="(min-width: 1024px) 35vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative min-h-80 flex-1 overflow-hidden rounded-2xl border border-border bg-paper">
                <iframe
                  title={`Map showing the ${companyDetails.name} ${office.name} at ${formatOfficeAddress(office)}`}
                  src={`https://www.google.com/maps?q=${mapSearch}&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full border-0"
                />
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapSearch}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start text-sm font-semibold text-gold-700 hover:text-navy-900"
              >
                <ExternalLink aria-hidden="true" className="size-4" />
                Get directions in Google Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us (optional) */}
      {whyChoose && (
        <section
          aria-labelledby="why-choose-heading"
          className="bg-paper section-spacing"
        >
          <div className="page-container flex flex-col gap-10">
            <SectionHeading
              id="why-choose-heading"
              eyebrow="Why Deltacon"
              title={whyChoose.title}
              description={whyChoose.introduction.join(" ")}
            />
            <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyChoose.reasons.map((reason, index) => (
                <li
                  key={reason.title}
                  className="flex flex-col gap-2 rounded-xl bg-white p-6 shadow-sm"
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
      )}

      {/* Awards and memberships (optional) */}
      {awards && (
        <section aria-labelledby="awards-heading" className="section-spacing">
          <div className="page-container flex flex-col gap-10">
            <SectionHeading
              id="awards-heading"
              eyebrow="Credentials"
              title={awards.title}
              description={awards.introduction.join(" ")}
            />
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {awards.items.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-2 rounded-xl border border-border p-5"
                >
                  <Award aria-hidden="true" className="size-6 text-gold-600" />
                  <h3 className="font-heading text-base leading-snug font-bold text-navy-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* 9. Getting started */}
      <section
        aria-labelledby="getting-started-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-10">
          <SectionHeading
            id="getting-started-heading"
            eyebrow="Getting started"
            title={gettingStarted.title}
            description={gettingStarted.introduction}
          />
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {gettingStarted.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex flex-col gap-3 rounded-xl bg-white p-6 shadow-sm"
              >
                <span className="font-heading text-sm font-semibold tracking-[0.2em] text-gold-700 uppercase">
                  Step {index + 1}
                </span>
                <h3 className="text-lg leading-snug font-bold text-navy-900">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 10. FAQ */}
      <section aria-labelledby="faq-heading" className="section-spacing">
        <div className="page-container flex flex-col gap-8">
          <SectionHeading id="faq-heading" eyebrow="FAQ" title={faq.title} />
          <div className="flex max-w-4xl flex-col gap-3">
            {faq.items.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-border bg-white open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-heading text-lg leading-snug font-bold text-navy-900">
                    {item.question}
                  </h3>
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 text-navy-700 transition-transform group-open:rotate-180 motion-reduce:transition-none"
                  />
                </summary>
                <div className="flex flex-col gap-3 border-t border-border px-5 py-4 leading-relaxed text-muted-foreground">
                  {item.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {item.list && <CheckList items={item.list} />}
                  {item.closingParagraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Final call to action */}
      <section
        aria-labelledby="final-call-to-action-heading"
        className="bg-navy-900 security-pattern section-spacing text-white"
      >
        <div className="page-container grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div className="flex flex-col gap-5">
            <h2
              id="final-call-to-action-heading"
              className="text-3xl font-bold uppercase sm:text-4xl"
            >
              {finalCallToAction.title}
            </h2>
            {finalCallToAction.subtitle && (
              <p className="font-heading text-xl font-semibold text-gold-300">
                {finalCallToAction.subtitle}
              </p>
            )}
            {finalCallToAction.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-navy-100"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex flex-col gap-5 rounded-2xl bg-white p-6 text-charcoal shadow-xl sm:p-8">
            <h3 className="text-xl font-bold text-navy-900 uppercase">
              {finalCallToAction.heading}
            </h3>
            <address className="flex flex-col gap-2 not-italic">
              <span className="font-heading text-sm font-semibold tracking-[0.25em] text-gold-700 uppercase">
                {finalCallToAction.officeLabel}
              </span>
              <span className="text-navy-900">
                <OfficeAddress location={location} />
              </span>
              <a
                href={`tel:${office.phoneInternational}`}
                className="flex items-center gap-2 text-xl font-bold text-navy-900 hover:text-gold-700"
              >
                <Phone aria-hidden="true" className="size-5 text-gold-600" />
                Call: {office.phoneDisplay}
              </a>
              {office.email && (
                <a
                  href={`mailto:${office.email}`}
                  className="flex items-center gap-2 break-all text-navy-900 hover:text-gold-700"
                >
                  <Mail
                    aria-hidden="true"
                    className="size-5 shrink-0 text-gold-600"
                  />
                  General inquiries: {office.email}
                </a>
              )}
              {government.email && (
                <a
                  href={`mailto:${government.email}`}
                  className="flex items-center gap-2 break-all text-navy-900 hover:text-gold-700"
                >
                  <Landmark
                    aria-hidden="true"
                    className="size-5 shrink-0 text-gold-600"
                  />
                  Government contracting: {government.email}
                </a>
              )}
            </address>
            <div className="flex flex-col gap-3">
              <Button
                asChild
                variant="accent"
                size="xl"
                className={wrappingButtonClassName}
              >
                <Link href={requestProposalHref(location)}>
                  {hero.primaryCallToAction}
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className={wrappingButtonClassName}
              >
                <a href={`tel:${office.phoneInternational}`}>
                  <Phone aria-hidden="true" />
                  {hero.secondaryCallToAction}
                </a>
              </Button>
            </div>
            <p className="border-t border-border pt-4 text-center text-sm font-semibold text-navy-900">
              {finalCallToAction.closingLine}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
