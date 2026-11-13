/*
 * Choices on the Request Service ("Request a Security Guard Quote") form.
 * The ids are what the database stores; the labels are what visitors, the
 * admin inbox, the emails and the CSV export show. Never change an id once
 * requests use it (old requests would lose their label); change the label.
 */

type FormOption<Id extends string = string> = { id: Id; label: string };

/** Shown under "Prefer to speak with our security team?" on the form. */
export const quoteRequestEmail = "bids@deltacon1.com";

export const primaryServiceTypes = [
  { id: "on-site-guards", label: "On-site security guard services" },
  { id: "vehicle-patrol", label: "Vehicle security patrol" },
  { id: "foot-patrol", label: "Foot patrol" },
  { id: "fire-watch", label: "Fire watch" },
  { id: "emergency-response", label: "Emergency security response" },
  { id: "event-security", label: "Event security" },
  { id: "other-specialized", label: "Other specialized security" },
  // Other lines of business, so their pages can still link to this form.
  { id: "security-consulting", label: "Security consulting" },
  { id: "staffing", label: "Staffing" },
  { id: "custodial-services", label: "Custodial services" },
] as const satisfies readonly FormOption[];

export type PrimaryServiceTypeId = (typeof primaryServiceTypes)[number]["id"];

/** Services that don't put security officers on site, so officer type and count are optional. */
const servicesWithoutOfficers: readonly PrimaryServiceTypeId[] = [
  "security-consulting",
  "staffing",
  "custodial-services",
];

export function needsSecurityOfficers(
  primaryServiceType: string | null | undefined,
): boolean {
  return !servicesWithoutOfficers.includes(
    primaryServiceType as PrimaryServiceTypeId,
  );
}

export const officerClassifications = [
  { id: "unarmed-level-2", label: "Unarmed Security Officer — Level II" },
  { id: "armed-level-3", label: "Armed Security Officer — Level III" },
  { id: "armed-and-unarmed", label: "Both armed and unarmed officers" },
  { id: "recommendation", label: "Need professional recommendation" },
] as const satisfies readonly FormOption[];

export const additionalServices = [
  { id: "vehicle-patrol", label: "Vehicle patrol" },
  { id: "foot-patrol", label: "Foot patrol" },
  { id: "fire-watch", label: "Fire watch" },
  { id: "access-control", label: "Access control" },
  { id: "cctv-monitoring", label: "CCTV monitoring" },
  { id: "emergency-response", label: "Emergency response" },
  { id: "off-duty-law-enforcement", label: "Off-duty law enforcement" },
  { id: "security-supervision", label: "Security supervision" },
] as const satisfies readonly FormOption[];

export const coverageTypes = [
  { id: "24-7", label: "24 Hours / 7 Days a Week" },
  { id: "daytime", label: "Daytime Only" },
  { id: "overnight", label: "Overnight Only" },
  { id: "weekends", label: "Weekends Only" },
  { id: "custom", label: "Custom Schedule" },
] as const satisfies readonly FormOption[];

export const contractDurations = [
  { id: "one-day", label: "One day assignment" },
  { id: "2-7-days", label: "2–7 days" },
  { id: "1-4-weeks", label: "1–4 weeks" },
  { id: "1-3-months", label: "1–3 months" },
  { id: "3-12-months", label: "3–12 months" },
  { id: "1-3-years", label: "1–3 years" },
  { id: "ongoing", label: "Ongoing contract" },
  { id: "emergency-temporary", label: "Emergency/Temporary" },
] as const satisfies readonly FormOption[];

/** The option ids as a non-empty tuple, the shape z.enum() needs. */
export function optionIds<Option extends FormOption>(
  options: readonly Option[],
) {
  return options.map((option) => option.id) as [
    Option["id"],
    ...Option["id"][],
  ];
}

/**
 * The label for a stored id. An unknown id (e.g. an option removed later)
 * falls back to the raw value so nothing is ever hidden.
 */
export function optionLabel(
  options: readonly FormOption[],
  id: string,
): string {
  return options.find((option) => option.id === id)?.label ?? id;
}

type QuotePrefill = {
  primaryServiceType: PrimaryServiceTypeId;
  officerClassification?: (typeof officerClassifications)[number]["id"];
  additionalServices?: (typeof additionalServices)[number]["id"][];
};

/**
 * What to pre-select when a service page links to the form with
 * ?service=<slug>. Slugs are from config/services.ts and
 * config/service-lines.ts.
 */
const prefillByServiceSlug: Record<string, QuotePrefill> = {
  "unarmed-security-officers": {
    primaryServiceType: "on-site-guards",
    officerClassification: "unarmed-level-2",
  },
  "armed-security-officers": {
    primaryServiceType: "on-site-guards",
    officerClassification: "armed-level-3",
  },
  "personal-protection": { primaryServiceType: "other-specialized" },
  "emergency-rapid-response": { primaryServiceType: "emergency-response" },
  "fire-watch": { primaryServiceType: "fire-watch" },
  "mobile-patrol": { primaryServiceType: "vehicle-patrol" },
  "detention-correctional-security": {
    primaryServiceType: "other-specialized",
  },
  "off-duty-police": {
    primaryServiceType: "other-specialized",
    additionalServices: ["off-duty-law-enforcement"],
  },
  "mobile-training-team": { primaryServiceType: "other-specialized" },
  consulting: { primaryServiceType: "security-consulting" },
  staffing: { primaryServiceType: "staffing" },
  "custodial-services": { primaryServiceType: "custodial-services" },
};

export function findQuotePrefillForService(
  serviceSlug: string | undefined,
): QuotePrefill | undefined {
  // hasOwn so URL text like "toString" can't reach Object.prototype.
  return serviceSlug && Object.hasOwn(prefillByServiceSlug, serviceSlug)
    ? prefillByServiceSlug[serviceSlug]
    : undefined;
}
