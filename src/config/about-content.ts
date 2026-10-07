import {
  Award,
  BadgeCheck,
  Eye,
  Handshake,
  Headset,
  Scale,
  ShieldCheck,
  Swords,
  type LucideIcon,
} from "lucide-react";

import { industries } from "./industries";
import { services } from "./services";
import { trainingCourses } from "./training-courses";

/**
 * Copy for the About page and the "Why choose us" section.
 *
 * TODO before launch: replace every value marked PLACEHOLDER with real,
 * verified information (leadership names, licence numbers, statistics).
 */

export const companyStory = {
  heading: "Protecting Texas with courage, service and integrity",
  paragraphs: [
    "Deltacon Security Group was founded on a simple belief: clients deserve a security partner they can trust completely. Our officers are carefully selected, properly licensed and trained to a standard that goes well beyond the minimum.",
    "Today we protect businesses, communities and people across Texas, from corporate offices and residential estates to industrial sites and large public events. Every client gets a security plan designed around their real risks, and a management team that answers the phone.",
    "We measure ourselves by what doesn't happen on our watch: the incidents prevented, the losses avoided and the people who get home safely.",
  ],
};

export const missionStatement =
  "To deliver professional, reliable security services that protect our clients' people, property and reputation, while setting the standard for integrity and care in our industry.";

export type CompanyValue = {
  name: string;
  icon: LucideIcon;
  description: string;
};

export const companyValues: CompanyValue[] = [
  {
    name: "Courage",
    icon: Swords,
    description:
      "We step forward when others step back, and act decisively to protect the people and places in our care.",
  },
  {
    name: "Service",
    icon: Handshake,
    description:
      "We treat every client, visitor and member of the public with respect, and we go the extra mile without being asked.",
  },
  {
    name: "Integrity",
    icon: Scale,
    description:
      "We are honest in our reports, transparent in our billing and accountable for every shift we deliver.",
  },
  {
    name: "Vigilance",
    icon: Eye,
    description:
      "We stay alert, observant and prepared, because security is about preventing incidents, not just reacting to them.",
  },
];

export type LeadershipTeamMember = {
  name: string;
  role: string;
  biography: string;
};

// PLACEHOLDER: replace with the real leadership team.
export const leadershipTeam: LeadershipTeamMember[] = [
  {
    name: "Leader Name",
    role: "Founder & Chief Executive Officer",
    biography:
      "Short biography describing background, experience and responsibilities.",
  },
  {
    name: "Leader Name",
    role: "Director of Operations",
    biography:
      "Short biography describing background, experience and responsibilities.",
  },
  {
    name: "Leader Name",
    role: "Head of Training & Compliance",
    biography:
      "Short biography describing background, experience and responsibilities.",
  },
];

export type LicenceOrCertification = {
  name: string;
  issuer: string;
  detail: string;
};

// PLACEHOLDER: replace licence numbers and add any other certifications.
export const licencesAndCertifications: LicenceOrCertification[] = [
  {
    name: "Security Services Contractor Licence",
    issuer: "Texas Department of Public Safety – Private Security Program",
    detail: "Licence No. to be added",
  },
  {
    name: "Licensed & Registered Officers",
    issuer: "Texas Department of Public Safety",
    detail: "Every officer holds a current registration for their role",
  },
  {
    name: "Insurance Coverage",
    issuer:
      "Umbrella liability, hired and non-owned auto liability, and workers’ compensation",
    detail:
      "Subject to policy terms. Certificates of insurance available for review",
  },
  {
    name: "United States Security Academy (USSA)",
    issuer: "Deltacon's training school",
    detail:
      "Every employee completes USSA-CS-101 Customer Service Excellence for Security Professionals",
  },
  {
    name: "National Retail Federation (NRF)",
    issuer: "Member",
    detail: "NRF Member ID 10905654",
  },
  {
    name: "International Association for Healthcare Security and Safety (IAHSS)",
    issuer: "Partner member",
    detail:
      "Healthcare officers hold the IAHSS Certified Healthcare Security Officer (CHSO) certification",
  },
];

export type ReasonToChooseUs = {
  title: string;
  icon: LucideIcon;
  description: string;
};

export const reasonsToChooseUs: ReasonToChooseUs[] = [
  {
    title: "Licensed & vetted officers",
    icon: BadgeCheck,
    description:
      "Every officer is licensed, background-checked and trained before their first shift.",
  },
  {
    title: "24/7 operations support",
    icon: Headset,
    description:
      "Supervisors and an operations team are on call around the clock, every day of the year.",
  },
  {
    title: "Tailored security plans",
    icon: ShieldCheck,
    description:
      "No templates. Post orders and staffing are built around a survey of your site.",
  },
  {
    title: "Clear, honest reporting",
    icon: Award,
    description:
      "Daily activity and incident reports so you always know what happened on your site.",
  },
];

export type CompanyStatistic = {
  /** The large figure, e.g. "24/7" or "13". */
  value: string;
  /** Short line under the figure. */
  label: string;
};

/**
 * Figures shown in the statistics band on the home and About pages.
 * Counts are worked out from the config files, so they stay correct when
 * services, industries or courses are added or removed.
 */
export const companyStatistics: CompanyStatistic[] = [
  { value: String(industries.length), label: "Industries Served" },
  { value: String(services.length), label: "Specialist Security Services" },
  { value: String(trainingCourses.length), label: "Training Courses" },
];
