import type { StaticImageData } from "next/image";

import armedSecurityOfficersImage from "@/assets/services/armed-security-officers.jpg";
import emergencyRapidResponseImage from "@/assets/services/emergency-rapid-response.jpg";
import firewatchImage from "@/assets/services/fire-watch.jpg";
import mobilePatrolImage from "@/assets/services/mobile-patrol.jpg";
import { companyDetails } from "@/config/company-details";
import { governmentContactEmail } from "@/config/government-contracting";
import { previousLocationSlugs } from "@/config/location-links";

/*
 * Location pages (/locations/<slug>). All page content lives here, so a new
 * office is one more object in `locations`; the page components contain no
 * city-specific text.
 *
 * Copy: docs/locations/dallas-fort-worth.md (+ dfw-pricing.md, which wins
 * where they differ) and docs/locations/houston-sugar-land.md. Use the
 * copy's wording; don't invent rates, credentials, cities or claims.
 *
 * To avoid duplicate content between location pages, the full cost
 * breakdown lives on /security-guard-pricing (config/pricing-guide.ts) and
 * the academies and instructor credentials on /training-advantage
 * (config/training-advantage.ts). Location pages keep their rate table, a
 * short local summary and links to those pages.
 */

export type LocationLink = { label: string; href: string };

export type LocationPhoto = {
  image: StaticImageData;
  /** Describes what the photo actually shows. */
  altText: string;
};

export type LocationOffice = {
  name: string;
  streetAddress: string;
  city: string;
  stateCode: string;
  postalCode: string;
  phoneDisplay: string;
  /** E.164, for tel: links and structured data. */
  phoneInternational: string;
  /** General enquiries email shown on the page, if any. */
  email?: string;
  /** e.g. "Mon–Fri 8 a.m.–5 p.m."; null until confirmed (not shown). */
  hours: string | null;
  /** Office coordinates; null until confirmed (left out of the map data). */
  coordinates: { latitude: number; longitude: number } | null;
};

export type TitledText = { title: string; text: string };

export type LocationServiceSection = {
  title: string;
  paragraphs: string[];
  listIntroduction?: string;
  list?: string[];
  closing?: string;
  /** The matching service pages on this site. */
  links?: LocationLink[];
  /** Shows "Call <office phone> <callPrompt>" with a tap-to-call link. */
  callPrompt?: string;
};

export type LocationIndustrySection = {
  title: string;
  list?: string[];
  paragraphs?: string[];
  /** Named clients; shown only when the location's showClientNames is true. */
  clientExperience?: string;
  /** The matching industry pages, where they exist. */
  links?: LocationLink[];
};

export type LocationRate = {
  service: string;
  /** Small second line under the service, e.g. who the service is for. */
  detail?: string;
  /** Whole dollars per hour; both null means "Custom Quote". */
  minimumPerHour: number | null;
  maximumPerHour: number | null;
};

export type LocationFaq = {
  question: string;
  paragraphs: string[];
  list?: string[];
  /** Paragraphs after the list. */
  closingParagraphs?: string[];
};

export type Location = {
  slug: string;
  /** e.g. "Dallas–Fort Worth Metro": used in the menu, breadcrumbs, links and cards. */
  name: string;
  /**
   * The company headquarters. Its structured data describes the company
   * itself ("/#organization") instead of a separate branch business.
   */
  isHeadquarters: boolean;
  /** Name in local-business structured data (branches only). */
  businessName: string;
  /** Prefilled into "Site location" when the request form is opened from this page. */
  requestFormSiteLocation: string;
  search: { title: string; description: string };
  /** Summary on the /locations hub. */
  hubSummary: string;
  office: LocationOffice;
  /** Public-sector client names stay hidden until publication is approved. */
  showClientNames: boolean;
  hero: {
    heading: string;
    tagline: string;
    introduction: string;
    primaryCallToAction: string;
    secondaryCallToAction: string;
    /**
     * Every county and city the location serves, shown as an expandable
     * "places we serve" panel in the hero. County names without "County".
     */
    placesServed?: { counties: string[]; citiesAndTowns: string[] };
  };
  partner: {
    title: string;
    leadParagraphs: string[];
    paragraphs: string[];
    listIntroduction?: string;
    list?: string[];
    closing?: string;
    photo: LocationPhoto;
  };
  services: {
    title: string;
    introduction: string;
    sections: LocationServiceSection[];
  };
  /** Short local summary; the details are on /training-advantage. */
  training: { title: string; summary: string[]; link: LocationLink };
  industries: {
    title: string;
    introduction: string[];
    sections: LocationIndustrySection[];
  };
  /** Region-specific security topics; hidden until a topic has text. */
  regionalFocus?: {
    title: string;
    topics: { title: string; paragraphs: string[] }[];
  };
  pricing: {
    title: string;
    /** Short local summary above the table. */
    summary: string[];
    ratesTitle: string;
    ratesTableCaption: string;
    rates: LocationRate[];
    disclaimer: string;
    proposal?: { title: string; paragraphs: string[]; callPrompt: string };
    /** The full cost breakdown (/security-guard-pricing). */
    link: LocationLink;
  };
  government: {
    title: string;
    introduction: string[];
    listIntroduction: string;
    list: string[];
    paragraphs: string[];
    /** Government contracting email, if the copy gives one. */
    email?: string;
    link: LocationLink;
  };
  areas: {
    title: string;
    subtitle?: string;
    introduction: string;
    /**
     * Cities, optionally grouped (a null group name means no heading).
     * `suffix` is shown after the list, e.g. "and surrounding communities".
     */
    cityGroups: { name: string | null; cities: string[]; suffix?: string }[];
    paragraphs: string[];
    /** A bold call to action at the end, if any. */
    callout?: string;
    officeTitle: string;
    officeDescription?: string;
    photo: LocationPhoto;
  };
  whyChoose?: {
    title: string;
    introduction: string[];
    reasons: TitledText[];
  };
  awards?: {
    title: string;
    introduction: string[];
    items: TitledText[];
  };
  gettingStarted: {
    title: string;
    introduction: string;
    steps: { title: string; text: string }[];
  };
  faq: { title: string; items: LocationFaq[] };
  finalCallToAction: {
    title: string;
    subtitle?: string;
    paragraphs: string[];
    heading: string;
    officeLabel: string;
    closingLine: string;
  };
};

/** "$28–$35", or "Custom Quote" when the rate is set per assignment. */
export function formatRate(rate: LocationRate): string {
  if (rate.minimumPerHour === null || rate.maximumPerHour === null) {
    return "Custom Quote";
  }
  return `$${rate.minimumPerHour}–$${rate.maximumPerHour}`;
}

/** Lowest to highest published hourly rate, e.g. "$28–$45 per hour". */
export function describePriceRange(rates: LocationRate[]): string | null {
  const minimums = rates.flatMap((rate) =>
    rate.minimumPerHour === null ? [] : [rate.minimumPerHour],
  );
  const maximums = rates.flatMap((rate) =>
    rate.maximumPerHour === null ? [] : [rate.maximumPerHour],
  );
  if (minimums.length === 0) return null;
  return `$${Math.min(...minimums)}–$${Math.max(...maximums)} per hour`;
}

/** "Fire Watch Security Officer, $30–$40; and Off-Duty Law Enforcement, $85–$125". */
function listRatesInWords(rates: LocationRate[]): string {
  const parts = rates
    .filter((rate) => rate.minimumPerHour !== null)
    .map((rate) => `${rate.service}, ${formatRate(rate)}`);
  return parts.length > 1
    ? `${parts.slice(0, -1).join("; ")}; and ${parts.at(-1)}`
    : (parts[0] ?? "");
}

/** Lowest to highest rate in words, e.g. "$28 to $45". */
function rangeInWords(rates: LocationRate[]): string {
  const range = describePriceRange(rates) ?? "";
  return range.replace(" per hour", "").replace("–", " to ");
}

/** The rates as one sentence, so a pricing FAQ always matches the table. */
function describeRatesInWords(rates: LocationRate[]): string {
  const customQuote = rates.filter((rate) => rate.minimumPerHour === null);
  const list = listRatesInWords(rates);
  const customSentence = customQuote.length
    ? ` ${customQuote.map((rate) => rate.service).join(" and ")} are quoted individually.`
    : "";
  return `${list}.${customSentence}`;
}

/** The whole answer as plain text (for the FAQPage structured data). */
export function faqAnswerAsText(faq: LocationFaq): string {
  return [
    ...faq.paragraphs,
    ...(faq.list ?? []),
    ...(faq.closingParagraphs ?? []),
  ]
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Every city on the page, across all groups. */
/** Every city the location serves: the coverage-area groups, then any others from the hero list. */
export function allCities(location: Location): string[] {
  return [
    ...new Set([
      ...location.areas.cityGroups.flatMap((group) => group.cities),
      ...(location.hero.placesServed?.citiesAndTowns ?? []),
    ]),
  ];
}

/** Counties the location serves, e.g. "Fort Bend" (without "County"). */
export function allCounties(location: Location): string[] {
  return location.hero.placesServed?.counties ?? [];
}

const pricingGuideLink: LocationLink = {
  label: "What is included in our hourly bill rate",
  href: "/security-guard-pricing",
};

const trainingAdvantageLink: LocationLink = {
  label: "Our academies and instructor credentials",
  href: "/training-advantage",
};

// Both markets currently publish the same estimated ranges (client rate
// sheet "Estimated Security Service Billing Rates", 2026-11-14).
const unarmedLevelTwo: LocationRate = {
  service: "Unarmed Security Officer – Level II",
  minimumPerHour: 28,
  maximumPerHour: 35,
};
const armedLevelThree: LocationRate = {
  service: "Armed Security Officer – Level III",
  minimumPerHour: 35,
  maximumPerHour: 45,
};
const personalProtectionLevelFour: LocationRate = {
  service: "Personal Protection Officer – Level IV",
  minimumPerHour: 69,
  maximumPerHour: 89,
};
const fireWatchOfficer: LocationRate = {
  service: "Fire Watch Security Officer",
  minimumPerHour: 30,
  maximumPerHour: 40,
};
const vehicleSecurityPatrol: LocationRate = {
  service: "Vehicle Security Patrol",
  minimumPerHour: 33,
  maximumPerHour: 45,
};
const emergencyResponse: LocationRate = {
  service: "Emergency Response",
  detail: "Commercial, City, County, Statewide or FEMA",
  minimumPerHour: 55,
  maximumPerHour: 125,
};
const offDutyLawEnforcement: LocationRate = {
  service: "Off-Duty Law Enforcement",
  minimumPerHour: 85,
  maximumPerHour: 125,
};
const specializedAssignments: LocationRate = {
  service: "Specialized Security Assignments",
  minimumPerHour: null,
  maximumPerHour: null,
};

const estimatedBillingRates: LocationRate[] = [
  unarmedLevelTwo,
  armedLevelThree,
  personalProtectionLevelFour,
  fireWatchOfficer,
  vehicleSecurityPatrol,
  emergencyResponse,
  offDutyLawEnforcement,
  specializedAssignments,
];

/** Everyday guard and patrol work, quoted together in the Houston pricing FAQ. */
const commonAssignmentRates = [
  unarmedLevelTwo,
  armedLevelThree,
  fireWatchOfficer,
  vehicleSecurityPatrol,
];
const advancedServiceRates = [
  personalProtectionLevelFour,
  emergencyResponse,
  offDutyLawEnforcement,
];

// --- Houston & Sugar Land (headquarters) ------------------------------------

const houstonSugarLandRates = estimatedBillingRates;

const houstonSugarLand: Location = {
  slug: "houston-metro-area",
  name: "Houston Metro Area",
  isHeadquarters: true,
  businessName: companyDetails.name,
  requestFormSiteLocation: "Houston & Sugar Land, TX",
  search: {
    title: "Security Guard Services Houston & Sugar Land | Deltacon",
    description:
      "Armed and unarmed security guards in Houston, Sugar Land and Fort Bend County. Veteran-owned, Texas DPS licensed, headquartered in Sugar Land, with 24/7 operations support.",
  },
  hubSummary:
    "Deltacon Security Group provides professional armed and unarmed security guard services throughout Houston, Sugar Land, Fort Bend County, and the Greater Houston metropolitan area.",
  office: {
    name: "Sugar Land Headquarters",
    streetAddress: companyDetails.officeAddress.streetAddress,
    city: companyDetails.officeAddress.city,
    stateCode: companyDetails.officeAddress.stateCode,
    postalCode: companyDetails.officeAddress.postalCode,
    phoneDisplay: companyDetails.phoneDisplay,
    phoneInternational: companyDetails.phoneInternational,
    email: companyDetails.email,
    // TODO(site owner): headquarters office hours, e.g. "Mon–Fri 8 a.m.–5 p.m.".
    hours: null,
    // TODO(site owner): headquarters map coordinates (latitude/longitude).
    // Not guessed: wrong coordinates hurt local search.
    coordinates: null,
  },
  showClientNames: false,
  hero: {
    heading: "Security Guard Services in Houston Metro Area, TX",
    tagline:
      "Headquartered in Sugar Land | Veteran-Owned | Texas DPS Licensed | 24/7 Operations Support",
    introduction:
      "Deltacon Security Group provides professional armed and unarmed security guard services throughout Houston, Sugar Land, Fort Bend County, and the Greater Houston metropolitan area.",
    primaryCallToAction: "Request a Security Proposal",
    secondaryCallToAction: `Call ${companyDetails.phoneDisplay}`,
    placesServed: {
      counties: [
        "Austin",
        "Brazoria",
        "Chambers",
        "Fort Bend",
        "Galveston",
        "Harris",
        "Jefferson",
        "Liberty",
        "Montgomery",
        "San Jacinto",
        "Waller",
        "Walker",
        "Matagorda",
        "Colorado",
        "Wharton",
      ],
      citiesAndTowns: [
        "Alvin",
        "Angleton",
        "Atascocita",
        "Baytown",
        "Beaumont",
        "Bellaire",
        "Channelview",
        "Clute",
        "Conroe",
        "Cypress",
        "Deer Park",
        "Dickinson",
        "Freeport",
        "Friendswood",
        "Fulshear",
        "Galena Park",
        "Galveston",
        "Greater Katy",
        "Humble",
        "Jacinto City",
        "Katy",
        "La Marque",
        "La Porte",
        "Lake Jackson",
        "League City",
        "Mission Bend",
        "Missouri City",
        "Pasadena",
        "Pearland",
        "Porter",
        "Richmond",
        "Rosenberg",
        "Santa Fe",
        "Seabrook",
        "South Houston",
        "Spring",
        "Stafford",
        "Sugar Land",
        "Texas City",
        "The Woodlands",
        "Tomball",
        "Webster",
        "West University Place",
      ],
    },
  },
  partner: {
    title: "Your Local Security Company, Headquartered in Sugar Land",
    leadParagraphs: [
      "From commercial properties and industrial facilities to residential communities, construction sites, healthcare facilities, warehouses, and government properties, we deliver customized security solutions designed around your property's specific risks and operational requirements.",
      "Our services include armed security officers, unarmed security guards, mobile patrol, fire watch, alarm response, emergency security deployment, and specialized protective services.",
      "With our headquarters in Sugar Land, experienced field supervision, a 24-hour manned operations center, and two company-owned security training academies, Deltacon brings local management, professional training, and operational accountability to every assignment.",
    ],
    paragraphs: [
      "Deltacon Security Group was established to provide dependable, professionally managed security services to businesses, property owners, institutions, and government organizations throughout Greater Houston.",
      "Being headquartered in Sugar Land gives us a direct connection to the communities and businesses we serve throughout Fort Bend County and the Greater Houston area.",
      "Our local management, field supervisors, and 24-hour operations team coordinate security assignments, officer scheduling, site supervision, incident reporting, and emergency coverage.",
      "Houston presents unique security challenges, including industrial and petrochemical facilities, energy infrastructure, shipping and logistics operations, commercial developments, healthcare campuses, and large residential communities.",
      "We understand that each property has different vulnerabilities. That is why we develop site-specific security plans instead of relying on generic security packages.",
      "Our objective is straightforward: provide qualified security professionals, dependable supervision, responsive communication, and documented accountability.",
    ],
    // TODO(site owner): replace with a photo from Houston/Sugar Land (and
    // update the description to match it).
    photo: {
      image: emergencyRapidResponseImage,
      altText:
        "Security officers helping residents through a disaster-damaged neighborhood",
    },
  },
  services: {
    title: "Professional Security Services Throughout Greater Houston",
    introduction:
      "Deltacon provides customized security solutions for commercial, industrial, residential, institutional, and government properties.",
    sections: [
      {
        title: "Armed Security Guards – Texas Level III",
        paragraphs: [
          "Our commissioned Level III security officers provide an elevated security presence for properties requiring armed protection, enhanced deterrence, and specialized security procedures.",
        ],
        listIntroduction: "Services may include:",
        list: [
          "Industrial and commercial security.",
          "Critical infrastructure protection.",
          "High-value asset protection.",
          "Construction site security.",
          "Access control and perimeter protection.",
          "Specialized armed security assignments.",
        ],
        closing:
          "Armed assignments are evaluated based on the property's risk profile and applicable Texas licensing requirements.",
        links: [
          {
            label: "Armed security officers",
            href: "/services/armed-security-officers",
          },
        ],
      },
      {
        title: "Unarmed Security Guards – Texas Level II",
        paragraphs: [
          "Our unarmed security officers provide professional access control, visitor management, surveillance, customer assistance, and general property protection.",
        ],
        listIntroduction: "Ideal for:",
        list: [
          "Commercial office buildings.",
          "Retail centers.",
          "Residential communities.",
          "Healthcare facilities.",
          "Educational institutions.",
          "Construction sites.",
          "Warehouses and distribution facilities.",
        ],
        links: [
          {
            label: "Unarmed security officers",
            href: "/services/unarmed-security-officers",
          },
        ],
      },
      {
        title: "Mobile Security Patrol",
        paragraphs: [
          "Our mobile patrol services provide visible security coverage for commercial, industrial, residential, and remote properties.",
        ],
        listIntroduction: "Services include:",
        list: [
          "Scheduled and randomized property patrols.",
          "Perimeter and access-point inspections.",
          "Parking lot and building checks.",
          "Suspicious activity reporting.",
          "Alarm response.",
          "After-hours property inspections.",
        ],
        closing:
          "Mobile patrol can be structured as dedicated coverage or scheduled visits, depending on your property's needs.",
        links: [{ label: "Mobile patrol", href: "/services/mobile-patrol" }],
      },
      {
        title: "Fire Watch and Alarm Response",
        paragraphs: [
          "Deltacon provides fire watch security personnel for properties experiencing fire alarm or suppression system outages, construction activities, hot work, and other situations requiring fire watch coverage.",
        ],
        listIntroduction: "Our services include:",
        list: [
          "24-hour fire watch staffing.",
          "Fire watch patrols and monitoring.",
          "Fire hazard identification and reporting.",
          "Required activity documentation.",
          "Alarm response coordination.",
          "Short-notice fire watch deployment, subject to availability.",
        ],
        links: [{ label: "Fire watch", href: "/services/fire-watch" }],
      },
      {
        title: "Emergency and Rapid-Response Security",
        paragraphs: [
          "When unexpected situations arise, having a responsive security provider matters.",
          "Deltacon coordinates emergency security staffing and armed or unarmed mobile security vehicle deployment through its operations center.",
        ],
        listIntroduction: "Emergency assignments may include:",
        list: [
          "Short-notice security staffing.",
          "Emergency property protection.",
          "Security following break-ins or property damage.",
          "Temporary coverage during staffing shortages.",
          "Emergency fire watch.",
          "Additional security during severe weather and operational disruptions.",
        ],
        closing:
          "Deployment timing depends on location, staffing availability, assignment requirements, and prevailing conditions.",
        links: [
          {
            label: "Emergency & rapid response",
            href: "/services/emergency-rapid-response",
          },
        ],
      },
      {
        title: "Specialized Security Assignments",
        paragraphs: [],
        listIntroduction: "We also evaluate specialized assignments involving:",
        list: [
          "Executive and personal protection.",
          "Texas Level IV personal protection services.",
          "Off-duty law enforcement security, when available and appropriately contracted.",
          "Detention and correctional security assignments.",
          "Specialized institutional and government security.",
        ],
        closing:
          "Contact our office to discuss specialized security requirements.",
        links: [
          {
            label: "Personal protection",
            href: "/services/personal-protection",
          },
          { label: "Off-duty police", href: "/services/off-duty-police" },
          {
            label: "Detention & correctional security",
            href: "/services/detention-correctional-security",
          },
        ],
      },
    ],
  },
  training: {
    title: "Two Company-Owned Security Training Academies",
    summary: [
      "One of Deltacon's most significant advantages is our ownership and operation of two active Texas-licensed security training academies.",
      "Unlike security providers that depend entirely on outside training organizations, Deltacon has direct access to its own security training infrastructure.",
      "Our academies provide a foundation for professional development, regulatory training, continuing education, and specialized security instruction.",
    ],
    link: trainingAdvantageLink,
  },
  industries: {
    title: "Industries We Protect in Houston and Surrounding Communities",
    introduction: [
      "Deltacon understands that security requirements differ significantly between industries. Our security plans are developed around the property's operations, potential threats, access requirements, and business continuity needs.",
      "Industries we serve include:",
    ],
    sections: [
      {
        title: "Industrial, Manufacturing, and Petrochemical Facilities",
        paragraphs: [
          "Gatehouse security, employee and visitor access control, perimeter protection, facility patrols, and industrial site security.",
        ],
        links: [
          {
            label: "Chemical & petrochemical security",
            href: "/industries/chemical-petrochemical",
          },
        ],
      },
      {
        title: "Energy, Oil and Gas, and Utilities",
        paragraphs: [
          "Security for energy infrastructure, utility facilities, equipment yards, remote locations, and other high-value operational assets.",
        ],
        links: [
          {
            label: "Critical infrastructure security",
            href: "/industries/critical-infrastructure",
          },
        ],
      },
      {
        title: "Logistics, Warehousing, and Distribution Centers",
        paragraphs: [
          "Truck gate access control, loading dock monitoring, trailer yard inspections, cargo theft deterrence, and after-hours security.",
        ],
        links: [
          {
            label: "Warehousing & storage security",
            href: "/industries/warehousing-storage",
          },
          {
            label: "Ports of entry security",
            href: "/industries/ports-of-entry",
          },
        ],
      },
      {
        title: "Commercial Properties and Office Buildings",
        paragraphs: [
          "Lobby security, visitor management, employee access control, parking area patrols, and tenant protection.",
        ],
        links: [
          {
            label: "Commercial real estate security",
            href: "/industries/commercial-real-estate",
          },
        ],
      },
      {
        title: "Healthcare and Medical Facilities",
        paragraphs: [
          "Professional security coverage for healthcare properties, clinics, medical offices, and institutional environments.",
        ],
        links: [
          { label: "Healthcare security", href: "/industries/healthcare" },
        ],
      },
      {
        title: "Residential Communities and Multifamily Properties",
        paragraphs: [
          "Security patrols, access control, parking enforcement support, perimeter inspections, and general property protection.",
        ],
        links: [
          {
            label: "Residential security",
            href: "/industries/gated-multi-unit-residential",
          },
        ],
      },
      {
        title: "Construction Sites and Development Projects",
        paragraphs: [
          "Equipment and material protection, access management, perimeter security, and overnight coverage.",
        ],
        links: [
          {
            label: "Construction site security",
            href: "/industries/construction",
          },
        ],
      },
      {
        title: "Retail, Automotive, and Self-Storage Properties",
        paragraphs: [
          "Visible deterrence, inventory protection, parking lot patrols, access control, and after-hours security.",
        ],
        links: [{ label: "Retail security", href: "/industries/retail" }],
      },
      {
        title: "Schools, Government, and Public Facilities",
        paragraphs: [
          "Security staffing, access management, visitor screening, and customized public-sector security assignments.",
        ],
        links: [
          {
            label: "Educational campus security",
            href: "/industries/educational-corporate-campus",
          },
          {
            label: "Government contracting",
            href: "/government-contracting",
          },
        ],
      },
      {
        title: "Financial Institutions and Data Centers",
        paragraphs: [
          "Specialized access control, security presence, monitoring, and protection of sensitive facilities.",
        ],
        links: [
          {
            label: "Financial institution security",
            href: "/industries/financial-institutions",
          },
          {
            label: "Data center security",
            href: "/industries/data-centers",
          },
        ],
      },
    ],
  },
  regionalFocus: {
    title: "Security for the Houston Region",
    // The section stays hidden until at least one topic has text, so no
    // placeholder ever shows on the live site.
    topics: [
      {
        title: "Port of Houston and Ship Channel Facilities",
        // TODO(site owner): copy about security for the Port of Houston and
        // related shipping/logistics facilities. Not in the supplied copy.
        paragraphs: [],
      },
      {
        title: "Petrochemical and Energy Corridors",
        // TODO(site owner): copy about the petrochemical and energy corridors
        // (e.g. which areas and facility types). Not in the supplied copy.
        paragraphs: [],
      },
      {
        title: "Hurricane-Season Security",
        // TODO(site owner): copy about hurricane-season and severe-weather
        // security support. Not in the supplied copy.
        paragraphs: [],
      },
    ],
  },
  pricing: {
    title: "Transparent Security Guard Pricing in Greater Houston",
    summary: [
      "At Deltacon Security Group, we believe prospective clients should understand the costs associated with professional security services.",
      "We provide the following estimated hourly billing ranges to help businesses and property managers develop preliminary security budgets.",
    ],
    ratesTitle: "Estimated Security Service Billing Rates – Houston Metro Area",
    ratesTableCaption:
      "Estimated hourly billing rates for common security assignments in the Houston metro area",
    rates: houstonSugarLandRates,
    disclaimer:
      "Important Pricing Notice: These figures are preliminary budgeting estimates, not guaranteed contract rates, fixed prices, or binding offers. Actual pricing is determined by the specific assignment and may change based on staffing, scheduling, location, risk, and contractual requirements.",
    proposal: {
      title: "Request a Customized Security Proposal",
      paragraphs: [
        "Every property has different security requirements.",
        "Deltacon develops customized written proposals based on the client's location, staffing requirements, coverage schedule, risk exposure, and operational needs.",
        "Contact our Sugar Land headquarters for a security assessment and written proposal.",
      ],
      callPrompt: "Call:",
    },
    link: pricingGuideLink,
  },
  government: {
    title: "Government and Public-Sector Security Services",
    introduction: [
      "Deltacon Security Group welcomes opportunities to support federal, state, county, municipal, educational, and other public-sector organizations.",
      "As a Service-Disabled Veteran-Owned Small Business, Deltacon is positioned to participate in applicable government contracting opportunities and private-sector subcontracting arrangements.",
    ],
    listIntroduction: "Our organization is interested in working with:",
    list: [
      "Federal government agencies.",
      "State and county agencies.",
      "Municipal governments.",
      "Public school districts.",
      "Government facilities.",
      "Public infrastructure organizations.",
      "Government prime contractors.",
      "Institutional and public-sector organizations.",
    ],
    paragraphs: [
      "We understand that government security assignments may require additional documentation, employee screening, insurance, licensing, reporting, contract compliance, and performance standards.",
      "Deltacon maintains federal registration and Texas public procurement credentials.",
      "Government procurement professionals and prime contractors may request our capability statement and additional company information.",
    ],
    email: governmentContactEmail,
    link: { label: "Government Contracting", href: "/government-contracting" },
  },
  areas: {
    title: "Our Security Service Coverage Area",
    subtitle: "Headquartered in Sugar Land. Serving Greater Houston.",
    introduction:
      "Deltacon Security Group operates from its Sugar Land headquarters and provides security services throughout Greater Houston, Fort Bend County, and surrounding areas. Our primary service area includes:",
    cityGroups: [
      {
        name: "Fort Bend County",
        cities: [
          "Sugar Land",
          "Missouri City",
          "Stafford",
          "Richmond",
          "Rosenberg",
          "Katy",
          "Fulshear",
        ],
        suffix: "and surrounding communities",
      },
      {
        name: "Greater Houston",
        cities: [
          "Houston",
          "Pearland",
          "Pasadena",
          "Bellaire",
          "West University Place",
          "South Houston",
          "Friendswood",
          "Webster",
          "Deer Park",
          "Baytown",
          "La Porte",
        ],
        suffix: "and surrounding communities",
      },
      {
        name: "North and Northwest Houston",
        cities: [
          "Cypress",
          "Tomball",
          "Spring",
          "The Woodlands",
          "Conroe",
          "Humble",
          "Atascocita",
        ],
        suffix: "and surrounding communities",
      },
      {
        name: "Brazoria and Galveston Areas",
        cities: [
          "Alvin",
          "Angleton",
          "Lake Jackson",
          "Freeport",
          "Texas City",
          "Galveston",
          "Dickinson",
          "La Marque",
        ],
        suffix: "and surrounding communities",
      },
    ],
    paragraphs: [
      "Service availability depends on assignment requirements, staffing, location, and scheduling.",
      "For locations outside our regular service area, contact us to discuss availability and deployment requirements.",
    ],
    callout:
      "Need security services in Houston, Sugar Land, or Fort Bend County? Contact our headquarters.",
    officeTitle: "Sugar Land Headquarters",
    // TODO(site owner): replace with a photo of the Sugar Land headquarters
    // or Houston officers (and update the description to match it).
    photo: {
      image: firewatchImage,
      altText:
        "Fire watch officers monitoring hot work and putting out a fire on a construction site",
    },
  },
  whyChoose: {
    title: "Why Deltacon Security Group?",
    introduction: [
      "Selecting a security company means choosing an organization responsible for protecting your property, employees, customers, and operations.",
      "Deltacon combines local management, professional training, security industry experience, and structured operational oversight.",
    ],
    reasons: [
      {
        title: "Locally Headquartered in Sugar Land",
        text: "Our headquarters is located in Sugar Land, Texas, allowing us to maintain a regional management presence and coordinate security assignments throughout Greater Houston.",
      },
      {
        title: "24-Hour Manned Operations Center",
        text: "Our operations center coordinates scheduling, field supervision, communications, incident reporting, and emergency security requirements.",
      },
      {
        title: "Veteran-Owned and Certified",
        text: "Deltacon is a Service-Disabled Veteran-Owned Small Business (SDVOSB), with federal contracting registration and public-sector business credentials.",
      },
      {
        title: "Professional Security Management",
        text: "Our approach emphasizes site-specific post orders, officer briefings, supervision, communication, and documented activity reporting.",
      },
    ],
  },
  awards: {
    title: "Awards, Certifications, Memberships, and Achievements",
    introduction: [
      "Deltacon Security Group is committed to professional standards, business growth, and industry participation.",
      "Our company credentials and achievements include:",
    ],
    items: [
      {
        title: "2026 Inc. 5000 Recognition",
        text: "Named to the 2026 Inc. 5000 list of America's fastest-growing private companies.",
      },
      {
        title: "SBA Service-Disabled Veteran-Owned Small Business",
        text: "Certified Service-Disabled Veteran-Owned Small Business, supporting eligibility for applicable government contracting opportunities.",
      },
      {
        title: "Texas DPS Security Company License",
        text: `Texas Department of Public Safety Private Security License No. ${companyDetails.securityLicenseNumber}.`,
      },
      {
        title: "Federal Government Registration",
        text: "Registered in SAM.gov and listed on the Texas Centralized Master Bidders List (CMBL).",
      },
      {
        title: "Fort Bend Chamber of Commerce",
        text: "Member of the Fort Bend Chamber of Commerce.",
      },
      {
        title: "ASIS International",
        text: "Member of ASIS International, a professional association serving the security management industry.",
      },
      {
        title: "InfraGard",
        text: "Member of InfraGard, a public-private partnership focused on protecting critical infrastructure.",
      },
    ],
  },
  gettingStarted: {
    title: "How to Get Started With Deltacon",
    introduction:
      "We make the process of establishing professional security coverage straightforward.",
    steps: [
      {
        title: "Tell Us About Your Property",
        text: "Provide your location, type of property, operating hours, security concerns, and desired coverage.",
      },
      {
        title: "Site Assessment",
        text: "We evaluate your property and identify potential vulnerabilities, staffing requirements, and recommended security measures.",
      },
      {
        title: "Customized Security Plan",
        text: "We prepare a written proposal outlining recommended personnel, armed or unarmed coverage, schedules, responsibilities, and pricing.",
      },
      {
        title: "Officer Briefing and Deployment",
        text: "Before beginning an assignment, officers receive the applicable site instructions and post orders.",
      },
      {
        title: "Ongoing Supervision and Reporting",
        text: "Our management team coordinates security operations, supervision, communication, and incident documentation.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions About Security Services in Houston",
    items: [
      {
        question: "Where is Deltacon Security Group headquartered?",
        paragraphs: [
          "Our headquarters is located at 12808 W. Airport Blvd, Suite 224, Sugar Land, Texas 77478. We provide security services throughout Houston, Fort Bend County, and surrounding communities.",
        ],
      },
      {
        question: "Does Deltacon provide armed security guards in Houston?",
        paragraphs: [
          "Yes. Deltacon provides commissioned Texas Level III armed security officers for assignments requiring armed protection. Officer assignments are based on site requirements, applicable licensing, and operational considerations.",
        ],
      },
      {
        question: "Does Deltacon provide unarmed security guards?",
        paragraphs: [
          "Yes. Our Level II unarmed security officers provide access control, visitor management, property patrols, customer assistance, and general security coverage.",
        ],
      },
      {
        question: "Can Deltacon provide emergency security services?",
        paragraphs: [
          "Yes. Our operations center coordinates emergency and short-notice security staffing, including armed and unarmed coverage, mobile security vehicle patrol, and fire watch services. Actual deployment times depend on location and staffing availability.",
        ],
      },
      {
        question: "How quickly can Deltacon provide security guards?",
        paragraphs: [
          "Deployment depends on the number of officers required, assignment location, licensing requirements, and scheduling. Contact our office to discuss your required start date and coverage needs.",
        ],
      },
      {
        question: "How much do security guards cost in Houston?",
        paragraphs: [
          `Our preliminary hourly budgeting estimates range from ${rangeInWords(commonAssignmentRates)} for common unarmed, armed, fire watch, and mobile patrol assignments. Estimates for higher-level services are ${listRatesInWords(advancedServiceRates)}. Actual pricing depends on the scope and requirements of each contract. Specialized services require customized quotations.`,
        ],
      },
      {
        question: "Are Deltacon security officers licensed and trained?",
        paragraphs: [
          `Yes. Deltacon operates under Texas DPS Private Security License No. ${companyDetails.securityLicenseNumber}. Security personnel must meet applicable licensing, background screening, and training requirements before assignment.`,
        ],
      },
      {
        question: "Does Deltacon operate its own security training schools?",
        paragraphs: [
          "Yes. Deltacon owns and operates two Texas-licensed security training academies: United States Security Academy (USSA), License No. F28377901, and Deltacon Tactical Academy, License No. Y07327301.",
          "Our in-house instructional capabilities include Level III Classroom, Level III Firearms, Level IV Personal Protection, Level I Alarm, and Continuing Education instruction.",
        ],
      },
      {
        question: "Does Deltacon work with government agencies?",
        paragraphs: [
          "Yes. Deltacon is a Service-Disabled Veteran-Owned Small Business and maintains federal and Texas public procurement registrations. We welcome applicable government contracting and subcontracting opportunities.",
        ],
      },
      {
        question: "What areas around Houston does Deltacon serve?",
        paragraphs: [
          "Our primary service area includes Houston, Sugar Land, Missouri City, Stafford, Richmond, Rosenberg, Katy, Pearland, Pasadena, Cypress, Spring, The Woodlands, Conroe, Baytown, Galveston, and other surrounding communities. Contact us to confirm coverage for your specific location.",
        ],
      },
    ],
  },
  finalCallToAction: {
    title: "Contact Deltacon Security Group – Sugar Land Headquarters",
    subtitle: "Professional Security Starts With the Right Security Partner.",
    paragraphs: [
      "Whether you need one unarmed security officer, a team of commissioned armed officers, ongoing mobile patrol, emergency fire watch, or a comprehensive security program, Deltacon is ready to discuss your requirements.",
      "Our team will work with you to understand your property, identify security needs, and develop a customized proposal.",
    ],
    heading: "Request Your Security Proposal Today.",
    officeLabel: "Headquarters",
    closingLine:
      "Veteran-Owned | Texas DPS Licensed | Fully Insured | 24/7 Operations Support",
  },
};

// --- Dallas–Fort Worth ------------------------------------------------------

const dallasFortWorthRates = estimatedBillingRates;

const dallasFortWorth: Location = {
  slug: "dallas-fort-worth-metro",
  name: "Dallas–Fort Worth Metro",
  isHeadquarters: false,
  businessName: "Deltacon Security Group – Dallas",
  requestFormSiteLocation: "Dallas–Fort Worth, TX",
  search: {
    title: "Security Guard Services Dallas–Fort Worth | Deltacon",
    description:
      "Armed and unarmed security guards in Dallas–Fort Worth. Veteran-owned, Texas DPS licensed, insured, with two in-house security training academies.",
  },
  hubSummary:
    "Deltacon Security Group provides professional security guard services throughout Dallas, Fort Worth, and the greater Dallas–Fort Worth Metroplex.",
  office: {
    name: "Dallas Office",
    streetAddress: "8585 N. Stemmons Freeway, Suite 427S",
    city: "Dallas",
    stateCode: "TX",
    postalCode: "75247",
    phoneDisplay: "817-825-2872",
    phoneInternational: "+18178252872",
    // TODO(site owner): Dallas office hours, e.g. "Mon–Fri 8 a.m.–5 p.m.".
    hours: null,
    // TODO(site owner): Dallas office map coordinates (latitude/longitude).
    // Not guessed: wrong coordinates hurt local search.
    coordinates: null,
  },
  showClientNames: false,
  hero: {
    heading: "Security Guard Services in Dallas–Fort Worth Metro, TX",
    tagline: "Professional. Prepared. Accountable. Protecting North Texas.",
    introduction:
      "Deltacon Security Group provides professional security guard services throughout Dallas, Fort Worth, and the greater Dallas–Fort Worth Metroplex. We deliver customized armed and unarmed security solutions, mobile patrol, fire watch, personal protection, and specialized security staffing for commercial properties, industrial facilities, government agencies, healthcare organizations, educational institutions, construction projects, and residential communities.",
    primaryCallToAction: "Request a Security Proposal",
    secondaryCallToAction: "Call Our Dallas Office",
    placesServed: {
      counties: [
        "Collin",
        "Dallas",
        "Denton",
        "Ellis",
        "Hood",
        "Hunt",
        "Johnson",
        "Kaufman",
        "Parker",
        "Rockwall",
        "Somervell",
        "Tarrant",
        "Wise",
      ],
      citiesAndTowns: [
        "Dallas",
        "Fort Worth",
        "Arlington",
        "Plano",
        "Irving",
        "McKinney",
        "Frisco",
        "Denton",
        "Richardson",
        "Allen",
        "Carrollton",
        "Lewisville",
        "Flower Mound",
        "Little Elm",
        "Prosper",
        "Celina",
        "The Colony",
        "Argyle",
        "DeSoto",
        "Duncanville",
        "Cedar Hill",
        "Lancaster",
        "Waxahachie",
        "Ennis",
        "Hutchins",
        "Grand Prairie",
        "Grapevine",
        "Euless",
        "Bedford",
        "Hurst",
        "Colleyville",
        "Southlake",
        "Keller",
        "North Richland Hills",
        "Haltom City",
        "Mansfield",
        "Burleson",
        "Weatherford",
        "Azle",
        "Decatur",
      ],
    },
  },
  partner: {
    title: "Your Dallas–Fort Worth Security Partner",
    leadParagraphs: [
      "As a veteran-owned, Texas Department of Public Safety (DPS) licensed security company, we combine professional security operations with a significant investment in our own security training infrastructure.",
      "From a single security post to complex, multi-location security operations, Deltacon delivers security solutions designed around your property, operational requirements, and budget.",
    ],
    paragraphs: [
      "The Dallas–Fort Worth Metroplex is one of the nation's largest and most economically diverse metropolitan areas. Its commercial buildings, distribution centers, manufacturing facilities, healthcare campuses, construction projects, educational institutions, government properties, and residential communities all have different security requirements.",
      "Deltacon Security Group understands that effective security requires more than placing an officer at a location.",
      "It requires proper personnel selection, professional training, supervision, accountability, communication, and clearly defined post orders.",
    ],
    listIntroduction: "Our security management approach emphasizes:",
    list: [
      "Properly licensed and qualified security officers.",
      "Customized security plans based on site-specific needs.",
      "Armed and unarmed security personnel.",
      "Professional supervision and operational oversight.",
      "Clear communication and incident reporting.",
      "Ongoing training and continuing education.",
      "Consistent performance and accountability.",
      "Security staffing solutions that can adapt to changing client requirements.",
    ],
    closing:
      "With our Dallas office located at 8585 N. Stemmons Freeway, Suite 427S, Dallas, TX 75247, Deltacon is positioned to serve organizations throughout Dallas, Fort Worth, and surrounding North Texas communities.",
    // TODO(site owner): replace with a photo of Deltacon officers in
    // Dallas–Fort Worth (and update the description to match it).
    photo: {
      image: armedSecurityOfficersImage,
      altText:
        "Deltacon security officer in a protective vest training on a firing range",
    },
  },
  services: {
    title: "Security Guard Services in Dallas–Fort Worth",
    introduction:
      "Deltacon provides a comprehensive range of private security services designed to address different levels of risk, staffing requirements, and operational environments.",
    sections: [
      {
        title: "Armed Security Guard Services – Level III",
        paragraphs: [
          "Our Texas DPS-licensed commissioned security officers provide an armed security presence for assignments requiring additional protective capabilities.",
        ],
        listIntroduction: "Armed security services may be appropriate for:",
        list: [
          "High-value commercial and industrial properties.",
          "Financial institutions and sensitive facilities.",
          "Distribution centers and warehouses.",
          "Government and public-sector facilities.",
          "High-risk commercial environments.",
          "Construction projects with elevated security concerns.",
          "Properties requiring an armed security presence.",
        ],
        closing:
          "Each assignment is evaluated to determine the appropriate staffing, officer qualifications, equipment, and operational requirements.",
        links: [
          {
            label: "Armed security officers",
            href: "/services/armed-security-officers",
          },
        ],
      },
      {
        title: "Unarmed Security Guard Services – Level II",
        paragraphs: [
          "Professional unarmed security officers provide a visible security presence while supporting daily property operations.",
        ],
        listIntroduction: "Services include:",
        list: [
          "Access control and visitor management.",
          "Lobby and reception security.",
          "Employee and contractor verification.",
          "Facility patrols.",
          "Incident documentation.",
          "Parking area monitoring.",
          "Customer and tenant assistance.",
          "Security presence during business and non-business hours.",
        ],
        closing:
          "Unarmed security is an effective option for businesses and properties that need professional protection, access management, and deterrence without an armed assignment.",
        links: [
          {
            label: "Unarmed security officers",
            href: "/services/unarmed-security-officers",
          },
        ],
      },
      {
        title: "Mobile Security Patrol",
        paragraphs: [
          "Our mobile patrol services provide security coverage for properties requiring periodic inspections, visible deterrence, and perimeter monitoring.",
        ],
        listIntroduction: "Mobile patrol solutions can include:",
        list: [
          "Parking lot and perimeter patrols.",
          "Commercial property inspections.",
          "Warehouse and industrial facility checks.",
          "Construction site patrols.",
          "Gate and access point inspections.",
          "After-hours property checks.",
          "Incident identification and reporting.",
        ],
        closing:
          "Mobile patrol programs can be customized around the size of your property, frequency of inspections, and security concerns.",
        links: [{ label: "Mobile patrol", href: "/services/mobile-patrol" }],
      },
      {
        title: "Fire Watch Security Services",
        paragraphs: [
          "Deltacon provides fire watch security staffing for facilities that require designated personnel during fire alarm, sprinkler, fire protection system, or other applicable system impairments, as well as qualifying construction and hot-work activities.",
        ],
        listIntroduction: "Fire watch assignments can include:",
        list: [
          "Continuous monitoring of designated areas.",
          "Fire hazard observation.",
          "Required patrols and documentation.",
          "Communication of emergencies.",
          "Reporting of unsafe conditions.",
          "Coordination with designated property personnel.",
        ],
        closing:
          "Fire watch requirements are customized according to applicable fire codes, the authority having jurisdiction, and the specific property or project requirements.",
        links: [{ label: "Fire watch", href: "/services/fire-watch" }],
      },
      {
        title: "Executive Protection and Personal Protection – Level IV",
        paragraphs: [
          "For clients requiring specialized personal security, Deltacon can provide Level IV personal protection services.",
        ],
        listIntroduction: "Potential assignments include:",
        list: [
          "Executive protection.",
          "Personal security details.",
          "High-profile individual protection.",
          "Secure transportation assignments.",
          "Special-event protection.",
          "Protective security planning.",
        ],
        links: [
          {
            label: "Personal protection",
            href: "/services/personal-protection",
          },
        ],
      },
      {
        title: "Emergency and Short-Notice Security Staffing",
        paragraphs: [
          "Security needs can arise unexpectedly. Whether you are dealing with an emergency, an unexpected staffing requirement, a property incident, or a temporary operational change, Deltacon can evaluate your requirements and available staffing resources.",
        ],
        callPrompt: "to discuss your security staffing needs.",
        links: [
          {
            label: "Emergency & rapid response",
            href: "/services/emergency-rapid-response",
          },
        ],
      },
    ],
  },
  training: {
    title:
      "The Deltacon Training Advantage: Two Active Security Training Academies",
    summary: [
      "Our advantage is more than providing security officers. We own and operate two active security training academies, maintain in-house Texas DPS-licensed security instructors, and have the ability to support professional development and continuing education within our own organization.",
    ],
    link: trainingAdvantageLink,
  },
  industries: {
    title: "Industries We Protect Throughout Dallas–Fort Worth",
    introduction: [
      "Deltacon provides security solutions for a wide range of industries and property types.",
    ],
    sections: [
      {
        title: "Commercial Properties and Office Buildings",
        list: [
          "Corporate offices.",
          "Multi-tenant office buildings.",
          "Commercial developments.",
          "Lobby and reception security.",
          "Access control and visitor management.",
        ],
        links: [
          {
            label: "Commercial real estate security",
            href: "/industries/commercial-real-estate",
          },
        ],
      },
      {
        title: "Warehousing, Distribution, and Logistics",
        list: [
          "Distribution centers.",
          "Shipping and receiving facilities.",
          "Warehouse security.",
          "Truck yards and transportation facilities.",
          "Inventory and perimeter protection.",
        ],
        links: [
          {
            label: "Warehousing & storage security",
            href: "/industries/warehousing-storage",
          },
        ],
      },
      {
        title: "Manufacturing and Industrial Facilities",
        list: [
          "Manufacturing plants.",
          "Industrial properties.",
          "Production facilities.",
          "Restricted-access areas.",
          "Employee and contractor access control.",
        ],
        // No dedicated manufacturing industry page exists yet.
      },
      {
        title: "Healthcare and Medical Facilities",
        list: [
          "Medical offices.",
          "Clinics.",
          "Healthcare campuses.",
          "Patient and visitor access management.",
          "Security presence for healthcare personnel and facilities.",
        ],
        links: [
          { label: "Healthcare security", href: "/industries/healthcare" },
        ],
      },
      {
        title: "Construction Site Security",
        list: [
          "Commercial construction projects.",
          "Residential construction developments.",
          "Equipment and material protection.",
          "After-hours security.",
          "Perimeter inspections.",
          "Fire watch staffing.",
        ],
        links: [
          {
            label: "Construction site security",
            href: "/industries/construction",
          },
        ],
      },
      {
        title: "Retail and Shopping Centers",
        list: [
          "Retail establishments.",
          "Shopping centers.",
          "Parking areas.",
          "Loss prevention support.",
          "Opening and closing security.",
          "Customer and employee safety.",
        ],
        links: [{ label: "Retail security", href: "/industries/retail" }],
      },
      {
        title: "Residential Communities and Multifamily Properties",
        list: [
          "Apartment communities.",
          "Gated communities.",
          "Condominium developments.",
          "Residential access control.",
          "Amenity and common-area patrols.",
        ],
        links: [
          {
            label: "Residential security",
            href: "/industries/gated-multi-unit-residential",
          },
        ],
      },
      {
        title: "Educational Institutions",
        list: [
          "Private educational institutions.",
          "School facilities.",
          "Educational campuses.",
          "Special events.",
          "Access management and campus security.",
        ],
        links: [
          {
            label: "Educational campus security",
            href: "/industries/educational-corporate-campus",
          },
        ],
      },
      {
        title: "Government and Public-Sector Facilities",
        paragraphs: [
          "Deltacon also supports government and public-sector security requirements, including assignments involving public facilities, government operations, and institutional environments.",
        ],
        clientExperience:
          "Our experience includes public-sector work involving Texas Health and Human Services Commission Region 3, Tarrant County facilities, and Dallas Independent School District. Client names and specific project descriptions are subject to applicable publication permissions.",
        links: [
          {
            label: "Government contracting",
            href: "/government-contracting",
          },
        ],
      },
    ],
  },
  pricing: {
    title: "Transparent Security Guard Pricing in Dallas–Fort Worth",
    summary: [
      "At Deltacon Security Group, we believe in providing prospective clients with meaningful pricing information so they can make informed decisions when selecting a professional security services provider.",
      "For budgeting and planning purposes, the following are indicative hourly client billing rate ranges for common security assignments throughout the Dallas–Fort Worth Metroplex.",
    ],
    ratesTitle: "Estimated Dallas–Fort Worth Security Service Billing Rates",
    ratesTableCaption:
      "Estimated hourly client billing rates for common security assignments in Dallas–Fort Worth",
    rates: dallasFortWorthRates,
    disclaimer:
      "These figures are provided as planning estimates and are not guaranteed contract rates, fixed prices, or binding offers.",
    proposal: {
      title: "Customized Security Proposals",
      paragraphs: [
        "Our commitment is to provide competitive security service rates while maintaining the professional personnel, training, insurance, equipment, supervision, and administrative infrastructure necessary to deliver dependable security services throughout Dallas–Fort Worth.",
      ],
      callPrompt:
        "For a customized security services proposal, call Deltacon Security Group at",
    },
    link: pricingGuideLink,
  },
  government: {
    title: "Government and Public-Sector Security Services",
    introduction: [
      "Deltacon Security Group is a Service-Disabled Veteran-Owned Small Business (SDVOSB) and maintains experience supporting public-sector security requirements.",
    ],
    listIntroduction: "Our organization is positioned to work with:",
    list: [
      "Federal government agencies.",
      "State agencies.",
      "County governments.",
      "Municipal governments.",
      "School districts.",
      "Public facilities.",
      "Government prime contractors.",
      "Institutional and public-sector organizations.",
    ],
    paragraphs: [
      "We understand that government security contracts may involve additional requirements concerning staffing, licensing, employee screening, reporting, insurance, contract compliance, and performance standards.",
      "For government procurement professionals and prime contractors seeking a qualified security services provider in North Texas, Deltacon welcomes opportunities to discuss contract requirements and potential teaming arrangements.",
      "Please visit our Government Contracting page for additional company information, registration details, and capabilities.",
    ],
    link: {
      label: "Visit our Government Contracting page",
      href: "/government-contracting",
    },
  },
  areas: {
    title: "Serving Dallas, Fort Worth, and the Greater DFW Metroplex",
    introduction:
      "Deltacon Security Group serves clients throughout the Dallas–Fort Worth metropolitan area, including:",
    cityGroups: [
      {
        name: null,
        cities: [
          "Dallas",
          "Fort Worth",
          "Arlington",
          "Irving",
          "Grand Prairie",
          "Garland",
          "Plano",
          "Frisco",
          "McKinney",
          "Denton",
          "Mesquite",
          "Carrollton",
          "Richardson",
          "Lewisville",
          "Mansfield",
        ],
      },
    ],
    paragraphs: [
      "We support security requirements throughout Dallas, Tarrant, Collin, and Denton counties, subject to staffing availability and assignment requirements.",
      "Whether your property is located in downtown Dallas, the Fort Worth business district, a North Texas industrial corridor, or a growing suburban commercial development, Deltacon can evaluate your security needs and develop an appropriate service proposal.",
    ],
    officeTitle: "Our Dallas Office",
    officeDescription:
      "Contact our Dallas office to discuss commercial security, armed and unarmed officers, mobile patrol, fire watch, personal protection, or government security requirements.",
    // TODO(site owner): replace with a photo of the Dallas office or Dallas
    // officers (and update the description to match it).
    photo: {
      image: mobilePatrolImage,
      altText:
        "Deltacon Security Group marked patrol vehicles parked side by side",
    },
  },
  gettingStarted: {
    title: "How to Get Started With Deltacon Security Group",
    introduction:
      "We make it straightforward to begin developing a professional security program for your organization.",
    steps: [
      {
        title: "Discuss Your Security Requirements",
        text: "Tell us about your property, location, operating hours, security concerns, and staffing needs.",
      },
      {
        title: "Evaluate Your Property",
        text: "We review your security requirements and, where appropriate, conduct a site assessment to identify potential vulnerabilities and determine suitable security coverage.",
      },
      {
        title: "Develop a Customized Security Proposal",
        text: "We prepare a written proposal outlining recommended staffing, service responsibilities, coverage schedules, and pricing.",
      },
      {
        title: "Coordinate Staffing and Deployment",
        text: "Once an agreement is established, we coordinate the appropriate personnel, post orders, training requirements, and deployment details.",
      },
      {
        title: "Maintain Communication and Accountability",
        text: "We emphasize communication, supervision, incident reporting, and ongoing review of security operations.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions – Dallas–Fort Worth Security Services",
    items: [
      {
        question:
          "Does Deltacon provide armed security guards in Dallas and Fort Worth?",
        paragraphs: [
          "Yes. Deltacon provides Texas DPS-licensed Level III commissioned security officers for assignments requiring armed security coverage. Staffing and officer qualifications are determined by the specific assignment.",
        ],
      },
      {
        question: "Does Deltacon provide unarmed security officers?",
        paragraphs: [
          "Yes. We provide Level II unarmed security services for commercial properties, warehouses, office buildings, residential communities, retail locations, and other facilities.",
        ],
      },
      {
        question:
          "How much does a security guard cost per hour in Dallas–Fort Worth?",
        paragraphs: [
          // Built from the rate table so the two always match.
          `For budgeting and planning purposes, our estimated hourly client billing rates in Dallas–Fort Worth are: ${describeRatesInWords(dallasFortWorthRates)}`,
          "These figures are planning estimates, not guaranteed contract rates, fixed prices, or binding offers. Actual pricing depends on the service type, officer qualifications, armed or unarmed requirements, scheduling, site risk, equipment, insurance, and contract specifications.",
          "We provide customized written proposals based on each client's requirements.",
        ],
      },
      {
        question:
          "What is included in Deltacon's hourly security billing rate?",
        paragraphs: [
          "Our hourly billing rate accounts for employee wages, training, vacation and other non-billable employment costs, payroll taxes, workers' compensation, liability insurance, applicable medical benefits, uniforms, equipment, background screening, licensing, local and corporate administrative expenses, and company profit.",
          "We believe clients should understand the full cost structure associated with professional security services.",
        ],
      },
      {
        question:
          "What makes Deltacon different from other Dallas security companies?",
        paragraphs: [
          "One of our distinguishing advantages is our ownership and operation of two active Texas security training academies:",
        ],
        list: [
          "The United States Security Academy (USSA), License F28377901.",
          "DeltaCon Tactical Academy, License Y07327301.",
        ],
        closingParagraphs: [
          "We also maintain in-house Texas DPS-licensed instructors in Level III classroom instruction, Level III firearms instruction, Level IV personal protection instruction, Level I alarm instruction, and continuing education.",
          "This training infrastructure gives Deltacon additional control over training coordination, continuing education, and professional development.",
        ],
      },
      {
        question: "Does Deltacon provide mobile patrol services?",
        paragraphs: [
          "Yes. We provide mobile patrol solutions for commercial properties, industrial facilities, warehouses, construction projects, and other properties requiring periodic security inspections and patrol coverage.",
        ],
      },
      {
        question: "Can Deltacon provide emergency fire watch services?",
        paragraphs: [
          "Yes. We can evaluate emergency and scheduled fire watch requirements and coordinate staffing based on the assignment, location, applicable requirements, and available personnel.",
        ],
      },
      {
        question: "Does Deltacon work with government agencies?",
        paragraphs: [
          "Yes. Deltacon has experience with public-sector security requirements and operates as a Service-Disabled Veteran-Owned Small Business.",
        ],
      },
      {
        question: "What areas of Dallas–Fort Worth does Deltacon serve?",
        paragraphs: [
          "We serve Dallas, Fort Worth, Arlington, Plano, Irving, Garland, Grand Prairie, Frisco, McKinney, Denton, Mesquite, Carrollton, Richardson, Lewisville, Mansfield, and other North Texas communities, subject to assignment requirements and staffing availability.",
        ],
      },
      {
        question: "How do I request a security proposal?",
        paragraphs: [
          "Call our Dallas office at 817-825-2872 or contact Deltacon through our website. Provide your property location, desired coverage hours, and security requirements so we can evaluate your needs and prepare a customized proposal.",
        ],
      },
    ],
  },
  finalCallToAction: {
    title:
      "Protect Your Dallas–Fort Worth Property With Deltacon Security Group",
    paragraphs: [
      "When the security of your employees, customers, property, equipment, and operations matters, selecting the right security provider is an important business decision.",
      "Deltacon Security Group brings together professional security operations, veteran-owned business leadership, two active security training academies, and in-house Texas DPS-licensed instructors.",
      "We believe professional security begins with properly trained people, responsible management, transparent pricing, and a commitment to accountability.",
      "Whether you need one unarmed security officer, an armed security team, mobile patrol, fire watch, personal protection, or a comprehensive security staffing program, Deltacon is ready to discuss your requirements.",
    ],
    heading: "Contact Deltacon Security Group Today",
    officeLabel: "Dallas Office",
    closingLine:
      "Deltacon Security Group – Professional Security Services Throughout Dallas–Fort Worth and Texas.",
  },
};

/** Every location page, headquarters first (the order the hub lists them). */
export const locations: Location[] = [houstonSugarLand, dallasFortWorth];

/** Finds a location by its slug, or by a slug it had before (see previousLocationSlugs). */
export function findLocationBySlug(slug: string): Location | undefined {
  const currentSlug = Object.hasOwn(previousLocationSlugs, slug)
    ? previousLocationSlugs[slug]
    : slug;
  return locations.find((location) => location.slug === currentSlug);
}

/** One-line office address, e.g. for map searches. */
export function formatOfficeAddress(office: LocationOffice): string {
  return `${office.streetAddress}, ${office.city}, ${office.stateCode} ${office.postalCode}`;
}
