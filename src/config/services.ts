import {
  Car,
  Flame,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  ShieldHalf,
  ShieldUser,
  Siren,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";

import armedSecurityOfficersImage from "@/assets/services/armed-security-officers.jpg";
import emergencyRapidResponseImage from "@/assets/services/emergency-rapid-response.jpg";
import fireWatchImage from "@/assets/services/fire-watch.jpg";
import mobilePatrolImage from "@/assets/services/mobile-patrol.jpg";
import mobileTrainingTeamImage from "@/assets/services/mobile-training-team.jpg";
import offDutyPoliceImage from "@/assets/services/off-duty-police.jpg";
import personalProtectionImage from "@/assets/services/personal-protection.jpg";
import unarmedSecurityOfficersImage from "@/assets/services/unarmed-security-officers.jpg";

import type { IndustrySlug } from "./industries";

/**
 * The services Deltacon offers, taken from the company's services document.
 * Edit this file to change the Services pages, the home page cards and the
 * "Service needed" options on the Request Service form.
 */

export type ServiceHighlight = {
  title: string;
  description?: string;
};

export type Service = {
  slug: string;
  name: string;
  /** Licence level or credential shown above the name, if any. */
  credential?: string;
  icon: LucideIcon;
  image?: StaticImageData;
  imageAltText?: string;
  /** One or two sentences used on cards and in search results. */
  summary: string;
  /** Paragraphs shown on the service's own page. */
  overview: string[];
  highlightsHeading: string;
  highlights: ServiceHighlight[];
  /** Slugs from config/industries.ts. */
  relatedIndustrySlugs: IndustrySlug[];
};

const trainingAcademies =
  "state-licensed instructors at the United States Security Academy (USSA) and Deltacon Tactical Academy";

export const services = [
  {
    slug: "unarmed-security-officers",
    name: "Unarmed Security Guard Services",
    credential: "Non-Commissioned Level II Officers",
    icon: ShieldCheck,
    image: unarmedSecurityOfficersImage,
    imageAltText:
      "Laptop showing “Level II – Unarmed Officer” in front of a Texas flag",
    summary:
      "Professionally trained unarmed officers who protect people, property and business operations while keeping a courteous, welcoming environment.",
    overview: [
      "Deltacon Security Group provides professionally trained unarmed security officers to help protect people, property, and business operations while maintaining a courteous, welcoming environment.",
      "Officers are selected for their professionalism, judgment, communication skills, and ability to follow client-specific procedures.",
      `Our officers receive training through ${trainingAcademies}, supplemented by customized instruction for specific industries and assignments. Training emphasizes observation, conflict de-escalation, emergency awareness, and customer service.`,
      "Whether you need temporary coverage or an ongoing security presence, Deltacon provides unarmed security solutions tailored to your facility and your clients and customers.",
    ],
    highlightsHeading: "Our services include",
    highlights: [
      { title: "Access control" },
      { title: "Visitor assistance" },
      { title: "Facility patrols" },
      { title: "Theft deterrence" },
      { title: "Incident reporting" },
      { title: "Emergency notification" },
    ],
    relatedIndustrySlugs: [
      "retail",
      "healthcare",
      "warehousing-storage",
      "construction",
      "hospitality-tourism",
      "gated-multi-unit-residential",
      "commercial-real-estate",
      "educational-corporate-campus",
      "data-centers",
    ],
  },
  {
    slug: "armed-security-officers",
    name: "Armed Security Guard Services",
    credential: "Commissioned Level III Officers",
    icon: ShieldHalf,
    image: armedSecurityOfficersImage,
    imageAltText:
      "Deltacon security officer in a protective vest training on a firing range",
    summary:
      "Licensed armed officers for assignments that need an enhanced protective presence, safeguarding personnel, customers, property and critical assets.",
    overview: [
      "Deltacon Security Group provides licensed armed security officers for assignments requiring an enhanced protective presence. We help safeguard personnel, customers, property, and critical assets through disciplined security operations and professional service.",
      `Our commissioned officers undergo rigorous selection and training through ${trainingAcademies}, with additional preparation tailored to each client's industry and site requirements.`,
      "Officers may carry authorized defensive equipment, including pepper spray, batons, or conducted-energy devices, when permitted and supported by the required training and assignment policies.",
      "We work with your management team to establish clear post orders, response procedures, and supervision standards. Our officers combine readiness with courtesy, discretion, and respect.",
    ],
    highlightsHeading: "Training emphasizes",
    highlights: [
      { title: "Sound judgment" },
      { title: "De-escalation" },
      { title: "Firearms safety" },
      { title: "Appropriate use of force" },
      { title: "Emergency response" },
      { title: "Accurate incident reporting" },
    ],
    relatedIndustrySlugs: [
      "critical-infrastructure",
      "financial-institutions",
      "chemical-petrochemical",
      "data-centers",
      "ports-of-entry",
      "educational-corporate-campus",
      "retail",
    ],
  },
  {
    slug: "personal-protection",
    name: "Personal Protection Services",
    credential: "Level IV Personal Protection Officers",
    icon: UserCheck,
    image: personalProtectionImage,
    imageAltText:
      "Personal protection officers escorting an executive from a vehicle",
    summary:
      "Licensed Personal Protection Officers (bodyguards) for executives, public figures, private individuals and anyone facing personal security concerns.",
    overview: [
      "Deltacon Security Group provides licensed Personal Protection Officers (PPOs), also known as bodyguards or personal security officers, to help protect executives, public figures, private individuals, and other clients facing personal security concerns.",
      "Each assignment is tailored to the client's activities, schedule, environment, and identified risks.",
      "Our PPOs meet applicable licensing and psychological screening requirements and are selected for physical readiness, emotional intelligence, discretion, and sound judgment. Their training emphasizes situational awareness, professional communication, crisis management, and appropriate protective response.",
      "Whether you require protection for a specific engagement, travel, or an ongoing assignment, Deltacon provides discreet personal security focused on your safety, privacy, and continuity of daily activities.",
    ],
    highlightsHeading: "Our services include",
    highlights: [
      { title: "Threat assessment" },
      { title: "Protective planning" },
      { title: "Advance site assessments" },
      { title: "Protective escorts" },
      { title: "Observation of potential threats" },
      { title: "Emergency coordination" },
      { title: "Confidential incident documentation" },
    ],
    relatedIndustrySlugs: [
      "commercial-real-estate",
      "hospitality-tourism",
      "financial-institutions",
    ],
  },
  {
    slug: "emergency-rapid-response",
    name: "Emergency & Rapid Response Security Services",
    icon: Siren,
    image: emergencyRapidResponseImage,
    imageAltText:
      "Security officers helping residents through a disaster-damaged neighborhood",
    summary:
      "Emergency security support to protect lives, property and infrastructure during unexpected incidents, backed by a 24/7 Dispatch and Operations Command Center.",
    overview: [
      "Deltacon Security Group provides emergency security support to help protect lives, property, and infrastructure during unexpected incidents and disruptions. Our Dispatch and Operations Command Center is staffed 24 hours a day, seven days a week, supporting prompt communication, deployment coordination, and ongoing operational monitoring.",
      `Our commissioned and non-commissioned officers undergo rigorous selection and training through our ${trainingAcademies}, supplemented by customized training for specific industries and assignments.`,
      "Many of our response officers also volunteer with local Community Emergency Response Team (CERT) programs, strengthening their preparation in disaster readiness, fire safety, team organization, light search and rescue, and disaster medical operations.",
      "We tailor each deployment to the client's needs and coordinate with facility management and emergency responders. Whether you require support for a few hours, several days, weeks, or a long-term assignment at one or multiple locations, our team combines professional protection with courteous, responsive customer service.",
    ],
    highlightsHeading: "Our emergency security services include",
    highlights: [
      {
        title: "Alarm response",
        description:
          "Responding to alarm notifications, assessing observable conditions, and coordinating with authorized contacts and emergency services.",
      },
      {
        title: "Break-in & property protection",
        description:
          "Providing security following burglaries, vandalism, damaged entrances, or other incidents that leave facilities vulnerable.",
      },
      {
        title: "Emergency access control",
        description:
          "Securing entry and exit points and monitoring access to affected facilities or restricted areas.",
      },
      {
        title: "Crowd management",
        description:
          "Supporting orderly movement, managing queues, and helping maintain safe access during emergencies and large gatherings.",
      },
      {
        title: "Traffic & parking support",
        description:
          "Assisting with vehicle movement and emergency access within the assignment's authorized scope.",
      },
      {
        title: "Fire watch services",
        description:
          "Providing dedicated observation, documented patrols, hazard reporting, and emergency notifications.",
      },
      {
        title: "Disaster security support",
        description:
          "Protecting affected properties and supporting access control during severe weather, disasters, and recovery operations.",
      },
      {
        title: "Temporary & supplemental staffing",
        description:
          "Providing armed and unarmed officers for urgent coverage, staffing shortages, and extended emergency assignments.",
      },
    ],
    relatedIndustrySlugs: [
      "critical-infrastructure",
      "gated-multi-unit-residential",
      "commercial-real-estate",
      "construction",
      "warehousing-storage",
      "healthcare",
    ],
  },
  {
    slug: "fire-watch",
    name: "Fire Watch & Safety Guard Services",
    icon: Flame,
    image: fireWatchImage,
    imageAltText:
      "Fire watch officers monitoring hot work and putting out a fire on a construction site",
    summary:
      "Certified Fire Watch officers during fire protection system outages, hot work and construction, available 24/7 for emergency and scheduled assignments.",
    overview: [
      "Deltacon Security Group provides certified Fire Watch officers to help protect people, property, and facilities during fire protection system outages, hot work, construction activities, and other conditions requiring dedicated fire watch coverage. Our team is available 24 hours a day, seven days a week for emergency requests and scheduled assignments.",
      "We tailor each assignment to applicable fire codes, workplace safety requirements, local Fire Marshal or authority having jurisdiction directions, and the client's approved fire watch procedures.",
      "Our state-licensed security officers receive additional emergency response training and complete the Fire Watch Officer Certification Course (USSA-FW-201) through our training school, the United States Security Academy (USSA). Officers are clearly identifiable and receive site-specific instructions before beginning their assignments.",
      "We coordinate with property managers, contractors, and facility representatives to establish patrol routes, reporting procedures, and coverage requirements. Dedicated fire watch officers remain focused on their assigned fire watch responsibilities, with additional duties permitted only when applicable requirements allow.",
      "Whether you need emergency coverage for a few hours or continued protection over several days or weeks, Deltacon provides professional fire watch services tailored to your property and operational needs.",
    ],
    highlightsHeading: "Our services include",
    highlights: [
      {
        title: "Fire protection system impairment coverage",
        description:
          "Providing fire watch during sprinkler or fire alarm system outages, subject to the authority having jurisdiction's requirements.",
      },
      {
        title: "Hot work fire watch",
        description:
          "Monitoring designated welding, cutting, and other hot work areas for sparks, smoke, and signs of fire.",
      },
      {
        title: "Documented fire watch patrols",
        description:
          "Inspecting assigned areas at required intervals and maintaining accurate patrol and activity logs.",
      },
      {
        title: "Hazard recognition & reporting",
        description:
          "Identifying and reporting potential fire hazards, blocked exits, smoke, water leaks, flooding, and other unsafe conditions.",
      },
      {
        title: "Emergency notification & evacuation support",
        description:
          "Promptly reporting emergencies, contacting emergency services, and assisting with established evacuation procedures.",
      },
      {
        title: "Facility & event coverage",
        description:
          "Serving residential properties, commercial buildings, government facilities, construction sites, and special events.",
      },
    ],
    relatedIndustrySlugs: [
      "construction",
      "chemical-petrochemical",
      "data-centers",
      "commercial-real-estate",
      "gated-multi-unit-residential",
      "hospitality-tourism",
      "warehousing-storage",
      "educational-corporate-campus",
    ],
  },
  {
    slug: "mobile-patrol",
    name: "Mobile Patrol Services",
    credential: "Dedicated & Intermittent",
    icon: Car,
    image: mobilePatrolImage,
    imageAltText:
      "Deltacon Security Group marked patrol vehicles parked side by side",
    summary:
      "Dedicated and intermittent patrols for commercial, residential, industrial and remote properties, by bicycle, trike, golf cart or vehicle, with drones available.",
    overview: [
      "Deltacon Security Group provides dedicated and intermittent mobile patrol services for commercial properties, residential communities, industrial facilities, and remote locations. Our patrol options include bicycles, trikes, golf carts, and marked or unmarked vehicles, with surveillance drones available for suitable assignments.",
      "Our officers provide a visible security presence, inspect designated areas, monitor access points, identify suspicious activity, and report hazards and incidents.",
      "Our mobile patrol officers hold valid driver's licenses and receive additional training, including the Emergency Vehicle Operations Course (EVOC) for applicable vehicle assignments. We tailor patrol routes, schedules, equipment, and reporting procedures to your property and operational requirements.",
    ],
    highlightsHeading: "Patrol options",
    highlights: [
      {
        title: "Dedicated patrols",
        description: "Officers who remain assigned to your property.",
      },
      {
        title: "Intermittent patrols",
        description:
          "Scheduled or randomized visits based on your security needs.",
      },
      {
        title: "Flexible patrol methods",
        description:
          "Bicycles, trikes, golf carts, and marked or unmarked vehicles.",
      },
      {
        title: "Surveillance drones",
        description: "Available for suitable assignments.",
      },
      {
        title: "Inspections & reporting",
        description:
          "Checking designated areas and access points, and reporting suspicious activity, hazards and incidents.",
      },
    ],
    relatedIndustrySlugs: [
      "gated-multi-unit-residential",
      "construction",
      "warehousing-storage",
      "commercial-real-estate",
      "retail",
    ],
  },
  {
    slug: "detention-correctional-security",
    name: "Detention & Correctional Security Officer Services",
    icon: LockKeyhole,
    summary:
      "Detention and correctional security supported by current and former officers experienced in federal, state and county correctional environments.",
    overview: [
      "Deltacon Security Group provides detention and correctional security supported by a network of current and former officers with experience in federal, state, and county correctional environments.",
      "Our Texas correctional security personnel also hold applicable Texas DPS non-commissioned or commissioned security credentials and receive continuing education through the United States Security Academy (USSA) and Deltacon Tactical Academy. Personnel assigned to correctional duties must meet the facility's qualification, training, and authorization requirements.",
      "We work with facility leadership to establish clear duties, post orders, reporting procedures, and emergency protocols. Our officers emphasize accountability, professional boundaries, respectful treatment, and adherence to institutional policies.",
    ],
    highlightsHeading: "Assignment-specific refresher training covers",
    highlights: [
      { title: "Use of force" },
      { title: "Prison Rape Elimination Act (PREA) awareness" },
      { title: "Inmate classification" },
      { title: "Count procedures" },
      { title: "Security threat groups" },
      { title: "Special inmate populations" },
      { title: "Lockdown procedures" },
      { title: "Contraband detection" },
      { title: "Searches" },
      { title: "Mail handling" },
      { title: "Visitation" },
      { title: "Suicide prevention" },
    ],
    relatedIndustrySlugs: [],
  },
  {
    slug: "off-duty-police",
    name: "Off-Duty Police & Law Enforcement Security Services",
    icon: ShieldUser,
    image: offDutyPoliceImage,
    imageAltText: "Two uniformed police officers standing beside a patrol car",
    summary:
      "Experienced off-duty law enforcement officers, holding TCOLE credentials, for assignments that need specialized knowledge and a strong protective presence.",
    overview: [
      "Deltacon Security Group coordinates experienced off-duty law enforcement officers for security assignments requiring specialized knowledge, strong situational judgment, and a professional protective presence. Our network also includes former and retired law enforcement professionals whose assignments reflect their current credentials and authorized duties.",
      "Texas off-duty peace officers assigned through Deltacon hold applicable Texas Commission on Law Enforcement (TCOLE) credentials. We maintain a pool of officers available for short-notice assignments throughout Texas, subject to availability and agency authorization.",
      "We support distribution centers, retailers, construction sites, government facilities, critical infrastructure, manufacturing plants, office buildings, residential communities, financial institutions, schools, hospitals, stadiums, hotels, resorts, and convention centers.",
      "Deltacon maintains an umbrella liability policy, hired and non-owned automobile liability coverage, and workers' compensation coverage, subject to policy terms. Certificates of insurance are available for review.",
    ],
    highlightsHeading: "Services include",
    highlights: [
      { title: "Special-event security" },
      { title: "Executive protection" },
      { title: "Asset protection" },
      { title: "Access control" },
      { title: "Emergency and alarm response" },
      { title: "Traffic and crowd management" },
      { title: "Sensitive employee separation support" },
      {
        title: "Authorized escort assignments",
        description: "For oversized loads or high-value assets.",
      },
    ],
    relatedIndustrySlugs: [
      "retail",
      "construction",
      "warehousing-storage",
      "financial-institutions",
      "healthcare",
      "hospitality-tourism",
      "educational-corporate-campus",
      "critical-infrastructure",
      "gated-multi-unit-residential",
      "commercial-real-estate",
    ],
  },
  {
    slug: "mobile-training-team",
    name: "Deltacon Mobile Training Team (DMTT)",
    icon: GraduationCap,
    image: mobileTrainingTeamImage,
    imageAltText:
      "Deltacon instructors teaching security officers beside a mobile training van",
    summary:
      "Customized, on-site security training for organizations throughout Texas, delivered by experienced instructors at your location.",
    overview: [
      "Deltacon's Mobile Training Team brings customized security training directly to your organization. We provide on-site instruction for security companies, government agencies, schools, hospitals, hotels, places of worship, manufacturing facilities, ports of entry, retailers, and other organizations throughout Texas.",
      "Our instructional team draws on the experience of U.S. military veterans, retired and off-duty law enforcement officers, former correctional officers, former asset protection managers, ASIS Certified Protection Professionals (CPPs), and instructors from the United States Security Academy (USSA) and Deltacon Tactical Academy.",
      "We tailor instruction to your employees' responsibilities, facility risks, and organizational policies. Whether you need a focused workshop, refresher training, or a broader staff development program, DMTT provides practical instruction at your location, scheduled around your operational needs.",
    ],
    highlightsHeading: "Training can address",
    highlights: [
      { title: "Security awareness" },
      { title: "Customer service" },
      { title: "Conflict de-escalation" },
      { title: "Incident reporting" },
      { title: "Access control" },
      { title: "Workplace violence awareness" },
      { title: "Fire watch" },
      { title: "Emergency response procedures" },
    ],
    relatedIndustrySlugs: [
      "healthcare",
      "hospitality-tourism",
      "educational-corporate-campus",
      "ports-of-entry",
      "retail",
    ],
  },
] as const satisfies readonly Service[];

export type ServiceSlug = (typeof services)[number]["slug"];

export const serviceSlugs = services.map((service) => service.slug) as [
  ServiceSlug,
  ...ServiceSlug[],
];

export function findServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

/** Services relevant to an industry (based on each service's industry list). */
export function findServicesForIndustry(industrySlug: string): Service[] {
  return services.filter((service) =>
    (service.relatedIndustrySlugs as readonly string[]).includes(industrySlug),
  );
}
