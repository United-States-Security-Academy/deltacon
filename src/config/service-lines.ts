import type { StaticImageData } from "next/image";

import consultingImage from "@/assets/service-lines/consulting.jpg";
import custodialServicesImage from "@/assets/service-lines/custodial-services.jpg";
import staffingImage from "@/assets/service-lines/staffing.jpg";

/**
 * The company's lines of business, shown in the header's "Services"
 * dropdown.
 *
 * Security Services has its own full page (/services, from services.ts).
 * The others each have a page built from the details below. A page shows a
 * "coming soon" message until it has introduction paragraphs; once it does,
 * it is listed for search engines and can be chosen on the Request Service
 * form.
 */

export type ServiceLine = {
  /** Shown in the dropdown and as the page title. */
  label: string;
  href: string;
};

export type ServiceLineOffering = {
  title: string;
  /** Optional bold line under the title. */
  subtitle?: string;
  description: string;
  /** Extra paragraphs after the description. */
  moreParagraphs?: string[];
  /** A closing line shown in bold. */
  emphasis?: string;
  /** Shown as a wide card across the whole row (for longer entries). */
  isFeatured?: boolean;
};

/** A group of example roles, e.g. "Healthcare & Care Support". */
export type ServiceLinePositionGroup = {
  title: string;
  introduction: string;
  positions: string[];
  /** A short note after the list, e.g. about credentials. */
  note?: string;
};

export type ServiceLineTextSection = {
  heading: string;
  paragraphs: string[];
  /** Bullet points shown after the paragraphs. */
  list?: string[];
};

export type ServiceLinePageContent = ServiceLine & {
  /** Used in links to the Request Service form, e.g. ?service=custodial-services. */
  slug: string;
  /** The page's main heading, when it should differ from the menu label. */
  pageTitle?: string;
  /** The tab for this line of business in the home page "Our services" section. */
  homeTab?: {
    /** Small line under the tab label, e.g. "11 services". */
    note: string;
    /** One or two sentences introducing the service. */
    summary: string;
    /** Four to six short highlights, shown as chips. */
    highlights: string[];
  };
  /** Short line under the title, e.g. "Clean Spaces. Professional Care." */
  tagline?: string;
  /** Opening paragraphs. Empty = the page shows "coming soon". */
  paragraphs: string[];
  image?: StaticImageData;
  imageAltText?: string;
  offeringsHeading?: string;
  offerings?: ServiceLineOffering[];
  facilitiesServed?: { heading: string; introduction: string; items: string[] };
  positionGroups?: { heading: string; groups: ServiceLinePositionGroup[] };
  /** Further sections, each with a heading, paragraphs and an optional list. */
  sections?: ServiceLineTextSection[];
  /** The closing message beside the quote button. */
  closing?: { heading: string; text?: string; quoteButtonLabel: string };
};

// From the client's document "Professional Physical Security Consulting".
export const consultingServiceLine: ServiceLinePageContent = {
  label: "Consulting",
  href: "/consulting",
  slug: "consulting",
  pageTitle: "Professional Physical Security Consulting & Protective Solutions",
  tagline: "Identify Risks. Plan Protection. Deploy with Confidence.",
  homeTab: {
    note: "Assessments & planning",
    summary:
      "We help government agencies, communities, international organizations, and businesses identify security risks, address vulnerabilities, and implement effective protection, from individual properties to large public events.",
    highlights: [
      "Site assessments",
      "Security planning",
      "Large event security",
      "Crowd management",
      "Executive protection",
      "112+ years of combined experience",
    ],
  },
  paragraphs: [
    "Deltacon Security Group (DSG) helps government agencies and facilities, communities, international organizations, and businesses identify security risks, address vulnerabilities, and implement effective protection. From individual properties to complex facilities and large public events, we develop security strategies tailored to your environment, operations, and needs.",
  ],
  image: consultingImage,
  imageAltText:
    "Deltacon Security Group consultants in a meeting room reviewing a security plan, with a facility map and camera feeds on a wall screen",
  sections: [
    {
      heading: "Site assessments & security planning",
      paragraphs: [
        "Our site assessments examine potential threats, vulnerabilities, and gaps in existing protective measures. We evaluate perimeter protection, access controls, lighting, surveillance coverage, visitor management, pedestrian and vehicle traffic, emergency procedures, and security staffing.",
        "Based on our findings, we provide practical recommendations and a customized security plan that defines officer duties, staffing levels, post locations, patrol coverage, and response procedures. We determine the appropriate combination of:",
      ],
      list: [
        "Armed and unarmed security officers",
        "Executive protection and personal protective services",
        "Foot patrols and mobile vehicle patrols",
        "Access control, entry screening, and visitor verification",
        "Event security, crowd management, and parking support",
        "Emergency response and evacuation support",
      ],
    },
    {
      heading: "Security consulting for facilities & large events",
      paragraphs: [
        "We provide assessments, planning, and protective services for government buildings, commercial properties, residential communities, international organizations, and other facilities. Our event capabilities extend to concerts, sporting events, stadiums, arenas, parks, conventions, and convention centers.",
        "We assess venue layouts, attendance, entry and exit points, restricted areas, crowd movement, parking, and emergency access to develop coordinated security coverage before, during, and after each event.",
      ],
    },
    {
      heading: "Experience that informs every recommendation",
      paragraphs: [
        "Our consulting team brings more than 112 years of combined experience, including service across various military branches, combat deployments, federal, state, and local law enforcement, corrections, emergency response, and professional security leadership. This range of experience supports informed assessments, practical planning, and effective implementation.",
      ],
    },
    {
      heading: "From assessment to protection",
      paragraphs: [
        "DSG provides more than recommendations. We can supply the security personnel, supervision, and protective services needed to put your plan into action. Whether you need an initial assessment, improvements to an existing security program, or complete security coverage, we help safeguard your people, property, and operations.",
      ],
    },
  ],
  closing: {
    heading: "Identify risks. Plan protection. Deploy with confidence.",
    quoteButtonLabel: "Request a Security Consultation",
  },
};

// From the client's document "Staffing & Workforce Solutions".
export const staffingServiceLine: ServiceLinePageContent = {
  label: "Staffing",
  href: "/staffing",
  slug: "staffing",
  tagline: "The Right People. The Right Skills. When You Need Them.",
  homeTab: {
    note: "10 industries",
    summary:
      "Flexible staffing and recruitment for government agencies, communities, and businesses of all sizes, from a single temporary employee to a large workforce supporting multiple locations.",
    highlights: [
      "Permanent placement",
      "Temporary & temp-to-hire",
      "Emergency & short-notice",
      "Seasonal & holiday",
      "Nights & weekends",
      "Event staffing",
    ],
  },
  paragraphs: [
    "Deltacon Global provides flexible staffing and recruitment solutions for government agencies, communities, and businesses of all sizes. From a single temporary employee to a large workforce supporting multiple locations, we help organizations fill essential positions, manage changing workloads, and keep operations moving.",
    "Our services include permanent placement, temporary staffing, temporary-to-hire assignments, seasonal and cyclical staffing, holiday coverage, overnight shifts, weekend support, and event staffing. Each assignment is built around your operational needs, required qualifications, workplace environment, and schedule.",
  ],
  image: staffingImage,
  imageAltText:
    "Deltacon staff from different fields standing together: an office professional, a warehouse worker in a safety vest, a construction worker in a hard hat, a nurse, a hospitality worker and a security officer",
  offeringsHeading: "Staffing options that fit your operations",
  offerings: [
    {
      title: "Permanent Placement & Direct Hire",
      description:
        "Build your team with candidates selected for the position’s responsibilities, required experience, and organizational fit. We support recruitment, candidate screening, and placement for frontline, administrative, technical, supervisory, and professional roles.",
    },
    {
      title: "Temporary Staffing",
      description:
        "Fill short-term vacancies, cover employee absences, support special projects, and respond to increased demand. Temporary assignments can range from a single shift to an extended engagement, depending on your needs.",
    },
    {
      title: "Temporary-to-Hire Staffing",
      description:
        "Evaluate an employee’s performance in your workplace before making a permanent hiring decision. This arrangement gives employers and candidates an opportunity to assess the position, expectations, and working relationship.",
    },
    {
      title: "Seasonal, Cyclical & Holiday Staffing",
      description:
        "Prepare for predictable changes in demand, including holiday shopping, inventory cycles, peak shipping periods, tourism seasons, enrollment periods, and recurring production schedules. We help supplement your regular workforce when activity increases.",
    },
    {
      title: "Night, Weekend & Extended-Hours Coverage",
      description:
        "Maintain continuity beyond standard business hours with personnel for overnight operations, weekend shifts, holidays, and rotating schedules. Coverage can support warehouses, facilities, customer service operations, hospitality properties, and other businesses operating around the clock.",
    },
    {
      title: "Event & Large-Scale Workforce Support",
      description:
        "Staff events of all sizes, from community gatherings and business meetings to conventions, festivals, exhibitions, and major public events. We coordinate staffing around attendance, venue requirements, operating hours, and assigned responsibilities.",
    },
    {
      title: "Emergency & Short-Notice Staffing",
      subtitle: "Unexpected Absences. Dependable Support.",
      description:
        "Deltacon Global helps facilities maintain operations when regular employees are unavailable—whether due to tardiness, illness, vacation, family emergencies, sudden resignations, severe weather, transportation disruptions, labor strikes, or other unexpected circumstances.",
      moreParagraphs: [
        "We coordinate temporary personnel for individual shifts, extended absences, and urgent workforce shortages, including nights, weekends, and holidays. Staffing support covers administrative, custodial, warehouse, retail, hospitality, healthcare, security, and other facility roles, with personnel matched to the position’s qualifications and site requirements.",
        "Our employees undergo comprehensive background checks and a 10-panel drug screening, receive site-specific training, and benefit from ongoing professional development. Availability and deployment times depend on the location, required skills, and assignment conditions.",
      ],
      emphasis:
        "Contact Deltacon Global for emergency staffing support to help keep your facility operating.",
      isFeatured: true,
    },
  ],
  positionGroups: {
    heading: "Personnel for a wide range of industries",
    groups: [
      {
        title: "Healthcare & Care Support",
        introduction:
          "Deltacon Global supports healthcare facilities, clinics, residential care settings, and related organizations with personnel matched to the assignment’s qualifications and responsibilities.",
        positions: [
          "Registered nurses and licensed vocational or practical nurses",
          "Certified nursing assistants and patient care support personnel",
          "Medical assistants and medical receptionists",
          "Patient registration and scheduling staff",
          "Administrative, clerical, and records support personnel",
          "Environmental services and facility support staff",
        ],
        note: "Clinical assignments require verification of applicable licenses, certifications, competencies, and facility requirements before placement.",
      },
      {
        title: "Warehousing, Distribution & Logistics",
        introduction:
          "Keep products moving through receiving, storage, fulfillment, and shipping operations.",
        positions: [
          "General warehouse associates and material handlers",
          "Order pickers, packers, and fulfillment associates",
          "Stockers and inventory support personnel",
          "Shipping and receiving clerks",
          "Loaders, unloaders, and freight handlers",
          "Qualified forklift and equipment operators",
          "Delivery drivers, route drivers, and dispatch support staff",
        ],
      },
      {
        title: "Retail & Customer Service",
        introduction:
          "Strengthen your team during daily operations, promotional events, store openings, and peak shopping periods.",
        positions: [
          "Cashiers and checkout associates",
          "Sales floor and customer service representatives",
          "Shelf stockers and merchandise replenishment staff",
          "Inventory and merchandising associates",
          "Order pickup and returns personnel",
          "Call center and customer support representatives",
          "Store setup and promotional support teams",
        ],
      },
      {
        title: "Information Technology & Technical Services",
        introduction:
          "Support everyday technology needs and specialized projects with personnel selected for the required technical skills.",
        positions: [
          "Help desk and desktop support technicians",
          "IT support specialists",
          "Network and systems administrators",
          "Software developers and application support personnel",
          "Data analysts and database support professionals",
          "Cybersecurity professionals",
          "IT project coordinators and technical support staff",
        ],
      },
      {
        title: "Construction, Skilled Trades & General Labor",
        introduction:
          "Supplement project teams with workers matched to the worksite, task requirements, and necessary qualifications.",
        positions: [
          "General laborers and site cleanup crews",
          "Material movers and construction support personnel",
          "Skilled tradespeople with applicable credentials",
          "Maintenance technicians and repair personnel",
          "Qualified equipment operators",
          "Project administrators and timekeeping staff",
        ],
      },
      {
        title: "Manufacturing & Industrial Operations",
        introduction:
          "Support production schedules, packaging operations, and changing order volumes.",
        positions: [
          "Production and assembly workers",
          "Machine operators with relevant qualifications",
          "Packaging and labeling personnel",
          "Quality inspection support staff",
          "Maintenance and industrial support workers",
          "Inventory clerks and production coordinators",
        ],
      },
      {
        title: "Hospitality, Food Service & Events",
        introduction:
          "Deliver attentive service for guests, visitors, and event attendees.",
        positions: [
          "Front desk agents and guest service representatives",
          "Registration attendants, ushers, and ticket scanners",
          "Banquet servers and catering support staff",
          "Food service workers and kitchen assistants",
          "Housekeepers and room attendants",
          "Event setup and breakdown crews",
          "Parking attendants and wayfinding personnel",
          "Event coordinators and administrative support staff",
        ],
        note: "Food handling and other role-specific credentials are verified where required.",
      },
      {
        title: "Government, Education & Community Services",
        introduction:
          "Support public-facing services, administrative operations, and community programs.",
        positions: [
          "Administrative assistants and office support personnel",
          "Receptionists and public information desk attendants",
          "Data entry clerks and records support staff",
          "Program assistants and project support personnel",
          "Facility attendants and custodial workers",
          "Community event and recreation support staff",
          "School office, registration, and operational support personnel",
        ],
      },
      {
        title: "Transportation & Delivery",
        introduction:
          "Support scheduled routes, deliveries, fleet operations, and transportation coordination.",
        positions: [
          "Delivery and route drivers",
          "Appropriately licensed commercial drivers",
          "Dispatchers and transportation coordinators",
          "Driver helpers and loading assistants",
          "Fleet administrative support personnel",
        ],
        note: "Driver assignments are matched to the appropriate license class, driving record, experience, and client requirements.",
      },
      {
        title: "Property Management & Facility Services",
        introduction:
          "Maintain clean, organized, and welcoming commercial and residential properties.",
        positions: [
          "Custodial and janitorial personnel",
          "Day porters and common-area attendants",
          "Maintenance technicians and grounds support workers",
          "Concierge and reception personnel",
          "Leasing office and administrative assistants",
          "Move-in, turnover, and property support crews",
        ],
      },
    ],
  },
  sections: [
    {
      heading: "Comprehensive screening & assignment readiness",
      paragraphs: [
        "Our employees undergo comprehensive background checks and a 10-panel drug screening, conducted in accordance with applicable requirements. Screening is supported by position-specific qualification reviews, which may include employment history, professional licenses, certifications, driving records, and other requirements relevant to the assignment.",
        "We work with each client to define job duties, essential qualifications, reporting relationships, workplace expectations, and onboarding requirements so employees arrive prepared for their responsibilities.",
      ],
    },
    {
      heading: "Training that goes beyond placement",
      paragraphs: [
        "Our commitment continues after recruitment. Employees receive site-specific training for their assigned positions, together with related professional development and continuing education courses provided at no cost to our employees through our industry-leading training schools: United States Security Academy (USSA) and Deltacon Tactical Academy.",
        "Training is matched to the role and may address customer service, professional conduct, workplace safety, communication, emergency awareness, incident reporting, and site procedures. Required clinical, technical, trade, and other occupational qualifications are verified separately for the position.",
        "By investing in ongoing development, we help employees strengthen their skills and provide clients with capable, prepared professionals.",
      ],
    },
    {
      heading: "Responsive workforce coordination",
      paragraphs: [
        "Successful staffing requires clear communication and consistent follow-through. We work with you to establish schedules, attendance expectations, performance standards, and escalation procedures. As workloads change, we help adjust staffing levels and address coverage needs.",
        "Whether you need one cashier for a weekend, nurses for recurring shifts, IT professionals for a project, warehouse teams for the holiday rush, or personnel for a major event, Deltacon builds staffing solutions around your operations.",
      ],
    },
  ],
  closing: {
    heading: "Let’s build your workforce",
    text: "Tell us the positions you need, the qualifications required, your locations, and your schedule. We will work with you to develop a staffing plan for immediate needs and long-term goals. Contact Deltacon to request a customized staffing proposal.",
    quoteButtonLabel: "Request a Staffing Proposal",
  },
};

// From the client's document "Custodial Services".
export const custodialServiceLine: ServiceLinePageContent = {
  label: "Custodial Services",
  href: "/custodial-services",
  slug: "custodial-services",
  tagline: "Clean Spaces. Professional Care. A Better Everyday Environment.",
  homeTab: {
    note: "11 services",
    summary:
      "Custodial and janitorial services tailored to your facility’s needs, operating schedule, and cleaning priorities, from routine office cleaning to comprehensive facility upkeep.",
    highlights: [
      "Janitorial & office cleaning",
      "Restroom sanitation",
      "Floor & carpet care",
      "Day porters",
      "Window cleaning",
      "Event & post-construction cleaning",
    ],
  },
  paragraphs: [
    "A clean, well-maintained facility reflects the professionalism of your organization and creates a welcoming environment for employees, customers, residents, and visitors. We provide custodial and janitorial services tailored to your facility’s needs, operating schedule, and cleaning priorities.",
    "From routine office cleaning to comprehensive facility upkeep, we help businesses, government agencies, and property managers maintain clean, orderly spaces. Whether you need daily service, periodic deep cleaning, or support for a special event, we work with you to establish a practical cleaning plan with clear expectations.",
  ],
  image: custodialServicesImage,
  imageAltText:
    "Custodial staff cleaning a bright office lobby: one operating a floor scrubber, one cleaning windows and one wiping the reception desk",
  offeringsHeading: "Our custodial services",
  offerings: [
    {
      title: "Routine Janitorial and Office Cleaning",
      description:
        "Keep your workplace ready for business with scheduled cleaning of offices, conference rooms, reception areas, hallways, break rooms, and shared workspaces. Services include dusting, vacuuming, sweeping, mopping, waste removal, and cleaning accessible surfaces.",
    },
    {
      title: "Restroom Cleaning and Sanitation",
      description:
        "Maintain clean, presentable restrooms through thorough cleaning of toilets, urinals, sinks, fixtures, mirrors, partitions, and floors. Service plans can include replenishing soap, paper towels, toilet tissue, and other agreed-upon supplies.",
    },
    {
      title: "Floor and Carpet Care",
      description:
        "Protect the appearance of your facility with floor care suited to its surfaces and traffic levels. Services may include routine vacuuming and mopping, carpet extraction, spot treatment, machine scrubbing, buffing, and stripping and refinishing compatible floors.",
    },
    {
      title: "High-Touch Surface Cleaning and Disinfection",
      description:
        "Address frequently touched surfaces such as door handles, light switches, elevator buttons, handrails, counters, and shared workstations. Where disinfection is included, products are selected for the intended use and applied according to label directions, including required contact times.",
    },
    {
      title: "Common Area and Facility Cleaning",
      description:
        "Create a positive first impression with clean lobbies, waiting areas, corridors, elevators, stairwells, employee lounges, and other shared spaces. Cleaning schedules can be adjusted to accommodate busy periods and areas that require additional attention.",
    },
    {
      title: "Day Porter Services",
      description:
        "Support cleanliness throughout the workday with on-site porter services. Duties may include restroom checks, spill response, waste collection, supply replenishment, entrance upkeep, and touch-up cleaning in high-traffic areas.",
    },
    {
      title: "Deep Cleaning and Periodic Detail Services",
      description:
        "Supplement routine service with detailed cleaning of areas that need additional attention. Depending on the agreed scope, services may include baseboards, doors, interior glass, vents, fixtures, and accessible hard-to-reach surfaces.",
    },
    {
      title: "Exterior Window Cleaning",
      description:
        "Deltacon provides professional exterior window cleaning to help your property look clean, bright, and welcoming. We remove dirt, dust, pollen, water spots, and other surface buildup from exterior glass, improving visibility and enhancing your building’s appearance.",
    },
    {
      title: "Event and Venue Cleaning",
      description:
        "Prepare your venue before an event, maintain public areas during activities, and restore the space afterward. Services can include restroom upkeep, waste collection, spill cleanup, seating-area cleaning, and post-event floor care.",
    },
    {
      title: "Move-In, Move-Out, and Post-Construction Cleaning",
      description:
        "Prepare spaces for occupancy or turnover with detailed cleaning following a move, renovation, or completed construction project. Work may include removing ordinary dust and debris, cleaning fixtures and surfaces, and preparing floors and interior spaces for use.",
    },
    {
      title: "Interior Glass and Entrance Care",
      description:
        "Maintain a polished appearance with cleaning of interior windows, glass doors, partitions, and entryways. Service plans can also address entrance mats and routine litter collection around designated building entrances.",
    },
  ],
  facilitiesServed: {
    heading: "Facilities we serve",
    introduction: "Custodial service plans can be developed for:",
    items: [
      "Commercial offices and corporate facilities",
      "Government buildings and public facilities",
      "Schools, colleges, and training centers",
      "Retail stores and shopping centers",
      "Warehouses and distribution centers",
      "Industrial and manufacturing support areas",
      "Residential community common areas",
      "Hospitality properties and event venues",
      "Medical office administrative and public areas",
      "Financial institutions and mixed-use properties",
    ],
  },
  sections: [
    {
      heading: "Cleaning plans built around your operations",
      paragraphs: [
        "Every facility has different priorities. We consider your building’s size, occupancy, floor surfaces, visitor traffic, access requirements, and operating hours when developing a service plan.",
        "Choose daily, nightly, weekly, or periodic cleaning, with daytime or after-hours scheduling as agreed. Clearly defined tasks, service frequencies, and supply responsibilities help keep expectations consistent and make performance easier to evaluate.",
      ],
    },
    {
      heading: "Professional service and quality control",
      paragraphs: [
        "Reliable custodial service depends on consistent execution and clear communication. Our approach emphasizes attention to detail, respect for your property, and responsiveness to changing facility needs.",
        "Service plans can include task checklists, supervisory inspections, documented follow-ups, and a designated point of contact. Personnel follow site-specific access procedures, chemical-handling instructions, and applicable workplace safety practices. Specialized cleaning requirements are reviewed before work begins so the appropriate scope, equipment, and procedures can be established.",
      ],
    },
  ],
  closing: {
    heading: "Let us help you maintain a cleaner facility",
    text: "Give your team a clean place to work and your visitors a welcoming first impression. Contact us to discuss your facility, request a walkthrough, and receive a customized custodial service proposal.",
    quoteButtonLabel: "Request a Custodial Services Quote",
  },
};

const otherServiceLines = [
  consultingServiceLine,
  staffingServiceLine,
  custodialServiceLine,
];

/** In the order they appear in the dropdown. */
export const serviceLines: ServiceLine[] = [
  { label: "Security Services", href: "/services" },
  ...otherServiceLines,
];

export function serviceLineHasContent(
  serviceLine: ServiceLinePageContent,
): boolean {
  return serviceLine.paragraphs.length > 0;
}

/**
 * Lines of business with a finished page: listed in the sitemap and offered
 * on the Request Service form.
 */
export const serviceLinesWithContent: ServiceLinePageContent[] =
  otherServiceLines.filter(serviceLineHasContent);

export function findServiceLineBySlug(
  slug: string,
): ServiceLinePageContent | undefined {
  return otherServiceLines.find((serviceLine) => serviceLine.slug === slug);
}
