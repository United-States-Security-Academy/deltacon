import {
  companyDetails,
  keepRealSocialProfiles,
} from "@/config/company-details";
import {
  allCities,
  describePriceRange,
  faqAnswerAsText,
  type Location,
  type LocationFaq,
} from "@/config/locations";
import { canonicalSiteUrl, canonicalUrl } from "@/lib/site-url";

/*
 * Structured data (schema.org JSON-LD) describing the company and its pages,
 * so search engines can show richer results: the business's address and
 * phone number, breadcrumb trails, services and courses.
 */

const organizationId = `${canonicalSiteUrl}/#organization`;

/**
 * The company as a local business: shown once, on the home page. (schema.org
 * has no "SecurityService" type; LocalBusiness is the closest standard one.)
 */
export function buildLocalBusinessData() {
  const { officeAddress, location } = companyDetails;
  const sameAs = keepRealSocialProfiles(companyDetails.socialLinks).map(
    (link) => link.url,
  );
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": organizationId,
    // TODO(site owner): add "geo" (latitude/longitude of the office) and
    // "openingHoursSpecification" once confirmed; they are not on the site yet.
    name: companyDetails.name,
    description: companyDetails.description,
    slogan: companyDetails.slogan,
    url: canonicalSiteUrl,
    logo: canonicalUrl("/brand/deltacon-badge-512.png"),
    image: canonicalUrl("/opengraph-image"),
    telephone: companyDetails.phoneInternational,
    email: companyDetails.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: officeAddress.streetAddress,
      addressLocality: officeAddress.city,
      addressRegion: officeAddress.stateCode,
      postalCode: officeAddress.postalCode,
      addressCountry: location.countryCode,
    },
    areaServed: { "@type": "State", name: location.region },
    parentOrganization: {
      "@type": "Organization",
      name: companyDetails.parentCompanyName,
    },
    // The Texas DPS Private Security Program company license.
    identifier: {
      "@type": "PropertyValue",
      propertyID: "Texas DPS Private Security License",
      value: companyDetails.securityLicenseNumber,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebSiteData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalSiteUrl}/#website`,
    name: companyDetails.name,
    url: canonicalSiteUrl,
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${canonicalUrl("/blog")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** The breadcrumb trail shown at the top of inner pages. */
export function buildBreadcrumbData(items: { label: string; href?: string }[]) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      // The current page (last item) has no link, as schema.org allows.
      ...(item.href ? { item: canonicalUrl(item.href) } : {}),
    })),
  };
}

export function buildServiceData(service: {
  name: string;
  summary: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.summary,
    url: canonicalUrl(service.path),
    provider: {
      "@type": "LocalBusiness",
      "@id": organizationId,
      name: companyDetails.name,
    },
    areaServed: { "@type": "State", name: companyDetails.location.region },
  };
}

export function buildCourseData(course: {
  name: string;
  summary: string;
  path: string;
  providerName: string;
  providerUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.summary,
    url: canonicalUrl(course.path),
    provider: {
      "@type": "Organization",
      name: course.providerName,
      // Where enrolment happens (the United States Security Academy site).
      ...(course.providerUrl
        ? { url: course.providerUrl, sameAs: course.providerUrl }
        : {}),
    },
  };
}

/**
 * A location's business data, built from the location data the page renders.
 *
 * - A branch office is its own LocalBusiness, linked to the company (the
 *   "/#organization" block on the home page) as its parent.
 * - The headquarters is the company itself, at the same address, so it uses
 *   the company's own @id and URL: search engines see one business with
 *   extra detail, not two businesses at one address.
 */
export function buildLocationBusinessData(location: Location) {
  const pageUrl = canonicalUrl(`/locations/${location.slug}`);
  const { office } = location;
  const priceRange = describePriceRange(location.pricing.rates);
  const identity = location.isHeadquarters
    ? {
        "@id": organizationId,
        name: companyDetails.name,
        url: canonicalSiteUrl,
      }
    : {
        "@id": `${pageUrl}#business`,
        name: location.businessName,
        url: pageUrl,
        parentOrganization: { "@id": organizationId },
      };
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    ...identity,
    ...(location.isHeadquarters
      ? {}
      : { description: location.search.description }),
    logo: canonicalUrl("/brand/deltacon-badge-512.png"),
    image: canonicalUrl("/opengraph-image"),
    telephone: office.phoneInternational,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.streetAddress,
      addressLocality: office.city,
      addressRegion: office.stateCode,
      postalCode: office.postalCode,
      addressCountry: companyDetails.location.countryCode,
    },
    // Left out until the office's real coordinates are supplied.
    ...(office.coordinates
      ? {
          geo: {
            "@type": "GeoCoordinates",
            latitude: office.coordinates.latitude,
            longitude: office.coordinates.longitude,
          },
        }
      : {}),
    ...(priceRange ? { priceRange } : {}),
    areaServed: allCities(location).map((city) => ({
      "@type": "City",
      name: city,
      containedInPlace: {
        "@type": "State",
        name: companyDetails.location.region,
      },
    })),
  };
}

/** FAQPage built from the same questions and answers the page shows. */
export function buildFaqPageData(questions: LocationFaq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faqAnswerAsText(faq) },
    })),
  };
}

/**
 * A step-by-step guide as a HowTo, built from the same steps the page shows.
 * (Google no longer shows HowTo rich results, but the markup is valid and
 * still describes the page's structure to search engines.)
 */
export function buildHowToData(guide: {
  name: string;
  description: string;
  path: string;
  steps: { id: string; name: string; text: string }[];
}) {
  const pageUrl = canonicalUrl(guide.path);
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.name,
    description: guide.description,
    url: pageUrl,
    step: guide.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      // Each step's heading on the page has the id "guide-step-<id>".
      url: `${pageUrl}#guide-step-${step.id}`,
    })),
  };
}

/**
 * Turns structured data into script text. "<" is escaped so text from the
 * database can never close the script tag early.
 */
export function serializeStructuredData(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
