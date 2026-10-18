import {
  ArrowRight,
  Check,
  ClipboardCheck,
  ShieldCheck,
  Sparkles,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import {
  ServiceTabs,
  type ServiceTab,
} from "@/components/sections/service-tabs";
import { Button } from "@/components/ui/button";
import { requestServiceLink } from "@/config/navigation";
import {
  serviceLinesWithContent,
  type ServiceLinePageContent,
} from "@/config/service-lines";
import { services } from "@/config/services";

/** Icons for the tabs, by service line. */
const serviceLineIcons: Record<string, LucideIcon> = {
  consulting: ClipboardCheck,
  staffing: UsersRound,
  "custodial-services": Sparkles,
};

/**
 * The home page "Our services" section: one tab per line of business.
 * Security (the main business) is shown first; Consulting, Staffing and
 * Custodial Services each get a short introduction with links to their
 * full page and to the Request Service form.
 */
export function HomeServicesSection() {
  const tabs: ServiceTab[] = [
    {
      id: "security",
      label: "Security",
      note: `${services.length} services`,
      icon: <ShieldCheck aria-hidden="true" />,
      panel: <SecurityPanel />,
    },
    ...serviceLinesWithContent
      .filter((serviceLine) => serviceLine.homeTab)
      .map((serviceLine) => {
        const Icon = serviceLineIcons[serviceLine.slug] ?? Sparkles;
        return {
          id: serviceLine.slug,
          label: serviceLine.label.replace(/ Services$/, ""),
          note: serviceLine.homeTab!.note,
          icon: <Icon aria-hidden="true" />,
          panel: <ServiceLinePanel serviceLine={serviceLine} />,
        };
      }),
  ];

  return (
    <section
      aria-labelledby="services-heading"
      className="bg-paper section-spacing"
    >
      <div className="page-container flex flex-col gap-10">
        <SectionHeading
          id="services-heading"
          eyebrow="Our services"
          title="One partner for security, staffing and facility services"
          description="From licensed security officers to consulting, staffing and custodial teams, we provide the people and plans to keep your operations running."
        />
        <ServiceTabs tabs={tabs} label="Our services" />
      </div>
    </section>
  );
}

function SecurityPanel() {
  return (
    <div className="flex flex-col gap-8">
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li key={service.slug}>
            <ServiceCard service={service} />
          </li>
        ))}
      </ul>
      <Link
        href="/services"
        className="inline-flex items-center gap-2 self-start font-semibold text-gold-700 hover:text-navy-900"
      >
        All security services
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

function ServiceLinePanel({
  serviceLine,
}: {
  serviceLine: ServiceLinePageContent;
}) {
  const homeTab = serviceLine.homeTab!;
  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-white shadow-sm lg:grid-cols-[2fr_3fr]">
      {serviceLine.image && (
        <div className="relative min-h-56 bg-navy-900 lg:min-h-full">
          <Image
            src={serviceLine.image}
            alt={serviceLine.imageAltText ?? ""}
            fill
            placeholder="blur"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-5 p-6 sm:p-8 lg:p-10">
        {serviceLine.tagline && (
          <p className="font-heading text-sm font-semibold tracking-[0.2em] text-gold-700 uppercase">
            {serviceLine.tagline}
          </p>
        )}
        <h3 className="text-3xl font-bold text-navy-900 uppercase">
          {serviceLine.pageTitle ?? serviceLine.label}
        </h3>
        <p className="text-lg leading-relaxed text-muted-foreground">
          {homeTab.summary}
        </p>
        <ul className="flex flex-wrap gap-2">
          {homeTab.highlights.map((highlight) => (
            <li
              key={highlight}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-paper px-3 py-1.5 text-sm font-medium text-navy-900"
            >
              <Check aria-hidden="true" className="size-3.5 text-gold-600" />
              {highlight}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href={serviceLine.href}>
              Explore {serviceLine.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          {serviceLine.closing && (
            <Button asChild variant="outline" size="lg">
              <Link
                href={`${requestServiceLink.href}?service=${serviceLine.slug}`}
              >
                {serviceLine.closing.quoteButtonLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
