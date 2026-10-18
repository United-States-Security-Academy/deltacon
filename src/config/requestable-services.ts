import { serviceLinesWithContent } from "./service-lines";
import { services } from "./services";

/**
 * Everything a visitor can ask for on the Request Service form: every
 * security service, then each other line of business that has a finished
 * page (e.g. Custodial Services). The form's options, its validation and the
 * names shown in the admin inbox and emails all come from this one list.
 */
export const requestableServices: { slug: string; name: string }[] = [
  ...services.map((service) => ({ slug: service.slug, name: service.name })),
  ...serviceLinesWithContent.map((serviceLine) => ({
    slug: serviceLine.slug,
    name: serviceLine.label,
  })),
];

export const requestableServiceSlugs = requestableServices.map(
  (service) => service.slug,
) as [string, ...string[]];

export function findRequestableService(slug: string) {
  return requestableServices.find((service) => service.slug === slug);
}
