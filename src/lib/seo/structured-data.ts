import { companyDetails } from "@/config/company-details";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/*
 * Structured data (schema.org JSON-LD) describing the company and its pages,
 * so search engines can show richer results: the business's address and
 * phone number, breadcrumb trails, services and courses.
 */

const organizationId = `${siteUrl}/#organization`;

/** Social profiles that point at a real page, not just a site's home page. */
function realSocialProfileUrls(): string[] {
  return companyDetails.socialLinks
    .map((link) => link.url)
    .filter((url) => {
      try {
        return new URL(url).pathname.replace(/\/$/, "") !== "";
      } catch {
        return false;
      }
    });
}

/** The company as a local business: shown once, on the home page. */
export function buildLocalBusinessData() {
  const { officeAddress, location } = companyDetails;
  const sameAs = realSocialProfileUrls();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": organizationId,
    name: companyDetails.name,
    description: companyDetails.description,
    slogan: companyDetails.slogan,
    url: siteUrl,
    logo: absoluteUrl("/brand/deltacon-badge-512.png"),
    image: absoluteUrl("/opengraph-image"),
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
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function buildWebSiteData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: companyDetails.name,
    url: siteUrl,
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/blog")}?q={search_term_string}`,
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
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
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
    url: absoluteUrl(service.path),
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
    url: absoluteUrl(course.path),
    provider: {
      "@type": "Organization",
      name: course.providerName,
      ...(course.providerUrl ? { sameAs: course.providerUrl } : {}),
    },
  };
}

/**
 * Turns structured data into script text. "<" is escaped so text from the
 * database can never close the script tag early.
 */
export function serializeStructuredData(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
