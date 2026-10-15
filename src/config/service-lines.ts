/**
 * The company's lines of business, shown in the header's "Services"
 * dropdown.
 *
 * Security Services has its own full page (/services, from services.ts).
 * The others each have a simple page built from the details below. To fill
 * one in, write its introduction and paragraphs: the "coming soon" message
 * disappears as soon as it has paragraphs, and the page is then listed for
 * search engines.
 */

export type ServiceLine = {
  /** Shown in the dropdown and as the page title. */
  label: string;
  href: string;
};

export type ServiceLinePageContent = ServiceLine & {
  /** One or two sentences under the page title. */
  introduction: string;
  /** The page's main text, one paragraph per item. Empty = coming soon. */
  paragraphs: string[];
};

export const consultingServiceLine: ServiceLinePageContent = {
  label: "Consulting",
  href: "/consulting",
  introduction: "",
  paragraphs: [],
};

export const staffingServiceLine: ServiceLinePageContent = {
  label: "Staffing",
  href: "/staffing",
  introduction: "",
  paragraphs: [],
};

export const custodialServiceLine: ServiceLinePageContent = {
  label: "Custodial Services",
  href: "/custodial-services",
  introduction: "",
  paragraphs: [],
};

/** In the order they appear in the dropdown. */
export const serviceLines: ServiceLine[] = [
  { label: "Security Services", href: "/services" },
  consultingServiceLine,
  staffingServiceLine,
  custodialServiceLine,
];

/** Pages that already have content, for the sitemap. */
export function serviceLinePagesWithContent(): ServiceLinePageContent[] {
  return [
    consultingServiceLine,
    staffingServiceLine,
    custodialServiceLine,
  ].filter((serviceLine) => serviceLine.paragraphs.length > 0);
}
