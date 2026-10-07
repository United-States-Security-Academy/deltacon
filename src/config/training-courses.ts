import {
  Anchor,
  Biohazard,
  Crosshair,
  GraduationCap,
  HandFist,
  HeartPulse,
  RefreshCw,
  ShieldAlert,
  ShieldHalf,
  SprayCan,
  UserCheck,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";

import armedSecurityOfficersImage from "@/assets/services/armed-security-officers.jpg";
import mobileTrainingTeamImage from "@/assets/services/mobile-training-team.jpg";

/**
 * Training academies and courses, taken from the company's training document.
 * Edit this file to change the Training pages, the home page's featured
 * courses and the "Course" options on the training enquiry form.
 */

// ---------- Academies ----------

export type TrainingAcademy = {
  id: "united-states-security-academy" | "deltacon-tactical-academy";
  name: string;
  shortName: string;
  tagline: string;
  introduction: string[];
  image: StaticImageData;
  imageAltText: string;
};

export const trainingAcademies = [
  {
    id: "united-states-security-academy",
    name: "United States Security Academy",
    shortName: "USSA",
    tagline: "The Deltacon Training Advantage",
    introduction: [
      "Deltacon Global's United States Security Academy (USSA) provides career-focused training for security officers and private investigators. Our instructors combine professional experience with interactive scenarios and practical exercises to build knowledge, sound judgment, and confidence.",
      "Our Texas security licensing programs follow applicable Texas Department of Public Safety requirements. Additional industry-specific instruction prepares students for the responsibilities and challenges of their assignments.",
      "Through our academies and training partnerships, we offer professional development in protective services, emergency response, customer service, and specialized security operations. Our goal is to prepare professionals who protect people and property with competence, accountability, and respect.",
    ],
    image: armedSecurityOfficersImage,
    imageAltText:
      "Security officer in a protective vest training on a firing range",
  },
  {
    id: "deltacon-tactical-academy",
    name: "Deltacon Tactical Academy",
    shortName: "Tactical Academy",
    tagline: "Continuing education & specialized training",
    introduction: [
      "Deltacon Tactical Academy provides continuing education (CE) and specialized training for security and protective service professionals. Our instructional team draws on experience in military service, law enforcement, investigations, border protection, and private security.",
      "Training combines professional knowledge with supervised exercises and realistic scenarios. Programs emphasize situational awareness, defensive skills, emergency readiness, sound judgment, and accountability.",
      "We also develop customized instruction for organizations seeking to strengthen their personnel's readiness for specific assignments and operating environments.",
    ],
    image: mobileTrainingTeamImage,
    imageAltText:
      "Deltacon instructors teaching security officers beside a mobile training van",
  },
] as const satisfies readonly TrainingAcademy[];

export type TrainingAcademyId = (typeof trainingAcademies)[number]["id"];

export function findTrainingAcademy(id: TrainingAcademyId): TrainingAcademy {
  return trainingAcademies.find((academy) => academy.id === id)!;
}

// ---------- Courses ----------

/** A short labelled fact shown on cards and course pages, e.g. "Minimum length: 45 hours". */
export type CourseFact = { label: string; value: string };

export type TrainingCourse = {
  slug: string;
  name: string;
  academyId: TrainingAcademyId;
  /** Licence level, if the course is part of the Texas licensing pathway. */
  licenceLevel?: string;
  icon: LucideIcon;
  /** One or two sentences used on cards and in search results. */
  summary: string;
  /** Paragraphs shown on the course's own page. */
  description: string[];
  prerequisite?: string;
  keyFacts: CourseFact[];
  topicsCovered: string[];
  /** Shown in the "Featured training" section on the home page. */
  isFeatured: boolean;
};

export const trainingCourses = [
  // United States Security Academy: Texas licensing courses
  {
    slug: "level-2-unarmed-officer",
    name: "Private Security Level II — Unarmed Officer Training",
    academyId: "united-states-security-academy",
    licenceLevel: "Level II",
    icon: GraduationCap,
    summary:
      "The foundational course for non-commissioned security officers, and the first step on the pathway to commissioned and Personal Protection Officer licences.",
    description: [
      "This foundational course prepares students for work as non-commissioned security officers. Instruction covers the security officer's role, observation and reporting, professional conduct, communication, conflict de-escalation, and emergency awareness.",
      "Students complete the required curriculum and examination while developing practical skills through examples and scenarios. Level II training is also part of the training pathway for commissioned security officers and Personal Protection Officers, subject to applicable exemptions.",
    ],
    keyFacts: [
      { label: "Prepares you for", value: "Non-commissioned security officer" },
      { label: "Assessment", value: "Required curriculum and examination" },
    ],
    topicsCovered: [
      "The security officer's role",
      "Observation and reporting",
      "Professional conduct",
      "Communication",
      "Conflict de-escalation",
      "Emergency awareness",
    ],
    isFeatured: true,
  },
  {
    slug: "level-3-armed-officer",
    name: "Private Security Level III — Armed Officer Training",
    academyId: "united-states-security-academy",
    licenceLevel: "Level III",
    icon: ShieldHalf,
    summary:
      "Classroom instruction, defensive tactics, firearms safety and supervised range qualification for commissioned (armed) security duties.",
    description: [
      "This program prepares students for commissioned security duties through classroom instruction, defensive tactics, firearms safety, and supervised range qualification. Training emphasizes de-escalation, lawful decision-making, safe equipment handling, and professional accountability.",
      "The Texas-required course includes a minimum of 45 hours and an examination, including firearms qualification. Firearms proficiency must be demonstrated within 90 days of the application date. Successful training completion supports the licensing application; DPS separately determines licensing eligibility.",
    ],
    prerequisite:
      "Completion of Level II training, unless an applicable exemption applies.",
    keyFacts: [
      { label: "Minimum length", value: "45 hours" },
      { label: "Assessment", value: "Examination and firearms qualification" },
      {
        label: "Firearms proficiency",
        value: "Within 90 days of the application date",
      },
    ],
    topicsCovered: [
      "Classroom instruction",
      "Defensive tactics",
      "Firearms safety",
      "Supervised range qualification",
      "De-escalation",
      "Lawful decision-making",
      "Safe equipment handling",
      "Professional accountability",
    ],
    isFeatured: true,
  },
  {
    slug: "level-4-personal-protection-officer",
    name: "Private Security Level IV — Personal Protection Officer Training",
    academyId: "united-states-security-academy",
    licenceLevel: "Level IV",
    icon: UserCheck,
    summary:
      "Prepares security professionals for personal and executive protection assignments through scenario-based instruction.",
    description: [
      "This course prepares security professionals for personal and executive protection assignments. Topics include threat assessment, protective planning, situational awareness, professional communication, conflict avoidance, emergency coordination, and client confidentiality.",
      "Students apply their knowledge through scenarios involving executives, public figures, and private individuals. Texas requires a minimum 15-hour Level IV course and examination, subject to applicable exemptions. Applicants must also meet the separate requirements for Personal Protection Officer licensing.",
    ],
    prerequisite:
      "Completion of the applicable Level II and Level III training requirements.",
    keyFacts: [
      { label: "Minimum length", value: "15 hours" },
      { label: "Assessment", value: "Examination" },
      {
        label: "Prepares you for",
        value: "Personal Protection Officer (PPO) licensing",
      },
    ],
    topicsCovered: [
      "Threat assessment",
      "Protective planning",
      "Situational awareness",
      "Professional communication",
      "Conflict avoidance",
      "Emergency coordination",
      "Client confidentiality",
    ],
    isFeatured: true,
  },
  {
    slug: "pepper-spray",
    name: "Private Security Pepper Spray Training",
    academyId: "united-states-security-academy",
    licenceLevel: "Level III supplement",
    icon: SprayCan,
    summary:
      "Safe and responsible use of OC pepper spray during security duties, with a separate pepper spray training certificate.",
    description: [
      "This course provides instruction in the safe and responsible use of OC pepper spray during security duties. Topics include de-escalation, use-of-force considerations, device limitations, safe handling, exposure response, decontamination, and incident reporting.",
      "Students who successfully complete the approved curriculum receive a separate pepper spray training certificate. DPS identifies this training as a supplement to Level III instruction; certification does not provide unrestricted authority to use force.",
    ],
    prerequisite:
      "Successful completion of the approved Level III training course.",
    keyFacts: [
      {
        label: "You receive",
        value: "A separate pepper spray training certificate",
      },
      { label: "Type", value: "Supplement to Level III instruction" },
    ],
    topicsCovered: [
      "De-escalation",
      "Use-of-force considerations",
      "Device limitations",
      "Safe handling",
      "Exposure response",
      "Decontamination",
      "Incident reporting",
    ],
    isFeatured: false,
  },

  // Deltacon Tactical Academy: continuing education and specialized training
  {
    slug: "level-4-ppo-renewal",
    name: "Level IV Personal Protection Officer — Renewal & Continuing Education",
    academyId: "deltacon-tactical-academy",
    licenceLevel: "Level IV renewal",
    icon: RefreshCw,
    summary:
      "Continuing education for licensed Personal Protection Officers, structured around DPS renewal requirements.",
    description: [
      "This course supports the continuing education needs of licensed Personal Protection Officers. Instruction reinforces protective planning, threat awareness, de-escalation, emergency coordination, and professional responsibilities.",
      "Scenario-based exercises help students evaluate changing conditions and make appropriate decisions while protecting clients. The course is structured around applicable DPS renewal requirements. DPS identifies six hours of Level III or Level IV continuing education for PPOs, with proficiency certification required as applicable to renewal.",
    ],
    keyFacts: [
      {
        label: "DPS requirement",
        value: "6 hours of Level III or Level IV continuing education",
      },
      {
        label: "Also required",
        value: "Proficiency certification, as applicable to renewal",
      },
    ],
    topicsCovered: [
      "Protective planning",
      "Threat awareness",
      "De-escalation",
      "Emergency coordination",
      "Professional responsibilities",
      "Scenario-based decision-making",
    ],
    isFeatured: false,
  },
  {
    slug: "level-3-armed-officer-renewal",
    name: "Level III Armed Security Officer — Renewal & Continuing Education",
    academyId: "deltacon-tactical-academy",
    licenceLevel: "Level III renewal",
    icon: UserRoundCheck,
    summary:
      "Helps commissioned officers maintain essential knowledge and demonstrate the firearms proficiency required for renewal.",
    description: [
      "This course helps commissioned security officers maintain essential knowledge and demonstrate the proficiency required for renewal. Instruction reinforces use-of-force decision-making, defensive tactics, firearms safety, and professional responsibilities.",
      "Students must successfully complete the required instructional and practical components. DPS requires six hours of continuing education and submission of a firearms proficiency certificate for commissioned officer renewal. Firearms proficiency must be demonstrated within 90 days of the renewal application date.",
    ],
    keyFacts: [
      { label: "DPS requirement", value: "6 hours of continuing education" },
      {
        label: "Also required",
        value: "Firearms proficiency certificate",
      },
      {
        label: "Firearms proficiency",
        value: "Within 90 days of the renewal application date",
      },
    ],
    topicsCovered: [
      "Use-of-force decision-making",
      "Defensive tactics",
      "Firearms safety",
      "Professional responsibilities",
    ],
    isFeatured: false,
  },
  {
    slug: "texas-license-to-carry",
    name: "Texas License to Carry — Handgun Training",
    academyId: "deltacon-tactical-academy",
    icon: Crosshair,
    summary:
      "Classroom or online instruction and supervised handgun proficiency training for anyone pursuing a Texas License to Carry.",
    description: [
      "Deltacon provides classroom and/or online instruction and supervised handgun proficiency training for individuals pursuing a Texas License to Carry.",
      "Instruction covers responsible handgun ownership, safe handling and storage, conflict avoidance, and applicable legal responsibilities. Range instruction emphasizes safety and the proficiency needed to complete the required assessment.",
      "Our instructors support new and experienced handgun owners through clear instruction and individual coaching. Course completion provides training documentation for the application process; license issuance remains subject to DPS approval.",
    ],
    keyFacts: [
      {
        label: "Format",
        value: "Classroom and/or online, plus range instruction",
      },
      { label: "For", value: "New and experienced handgun owners" },
    ],
    topicsCovered: [
      "Responsible handgun ownership",
      "Safe handling and storage",
      "Conflict avoidance",
      "Applicable legal responsibilities",
      "Range safety and proficiency",
    ],
    isFeatured: false,
  },
  {
    slug: "active-shooter-response",
    name: "Active Shooter Awareness & Emergency Response",
    academyId: "deltacon-tactical-academy",
    icon: ShieldAlert,
    summary:
      "Prepares employees and security personnel to recognize warning signs, report concerns and take protective action during an active shooter emergency.",
    description: [
      "This course prepares employees and security personnel to recognize warning signs, report concerns, and take protective action during an active shooter emergency.",
      "Instruction emphasizes escape when safe, securing a location when escape is unavailable, emergency communication, and coordination with responding law enforcement. Security personnel receive instruction consistent with their authorized duties and the organization's emergency plan.",
      "Deltacon's Mobile Training Team can assist with site-specific planning, tabletop exercises, and drills for schools, hospitals, businesses, places of worship, and other facilities.",
    ],
    keyFacts: [
      { label: "For", value: "Employees and security personnel" },
      {
        label: "On-site options",
        value: "Site-specific planning, tabletop exercises and drills",
      },
    ],
    topicsCovered: [
      "Recognizing warning signs",
      "Reporting concerns",
      "Escaping when safe",
      "Securing a location",
      "Emergency communication",
      "Coordinating with law enforcement",
    ],
    isFeatured: false,
  },
  {
    slug: "defensive-tactics",
    name: "Defensive Tactics & Personal Safety",
    academyId: "deltacon-tactical-academy",
    icon: HandFist,
    summary:
      "Awareness, judgment and practical defensive skills for threatening encounters, with an emphasis on controlled, proportionate responses.",
    description: [
      "This course develops awareness, judgment, and practical defensive skills for threatening encounters. Training emphasizes recognizing danger early, maintaining personal space, de-escalating conflict, and disengaging when possible.",
      "Supervised exercises introduce protective responses appropriate to the participant's role and training level. Students also learn to consider the consequences of physical intervention, recognize injuries, request assistance, and document incidents.",
      "The program promotes controlled, proportionate responses and responsible decision-making under stress.",
    ],
    keyFacts: [
      { label: "Format", value: "Supervised practical exercises" },
      {
        label: "Tailored to",
        value: "Each participant's role and training level",
      },
    ],
    topicsCovered: [
      "Recognizing danger early",
      "Maintaining personal space",
      "De-escalating conflict",
      "Disengaging when possible",
      "Consequences of physical intervention",
      "Recognizing injuries and requesting assistance",
      "Documenting incidents",
    ],
    isFeatured: false,
  },
  {
    slug: "maritime-security",
    name: "Maritime Security Training",
    academyId: "deltacon-tactical-academy",
    icon: Anchor,
    summary:
      "Maritime security training tailored to vessel operators, port facilities and related organizations.",
    description: [
      "Deltacon provides maritime security training tailored to the needs of vessel operators, port facilities, and related organizations.",
      "Instruction addresses access control, security awareness, suspicious activity reporting, communication, emergency procedures, and coordination with vessel and facility leadership. Training incorporates the operating conditions and responsibilities of each assignment.",
      "Our instructors draw on maritime experience to help personnel understand shipboard and port environments, protect sensitive areas, and follow established security procedures.",
    ],
    keyFacts: [
      {
        label: "For",
        value: "Vessel operators, port facilities and related organizations",
      },
    ],
    topicsCovered: [
      "Access control",
      "Security awareness",
      "Suspicious activity reporting",
      "Communication",
      "Emergency procedures",
      "Coordination with vessel and facility leadership",
    ],
    isFeatured: false,
  },
  {
    slug: "first-aid-cpr-aed",
    name: "First Aid, CPR & AED Certification",
    academyId: "deltacon-tactical-academy",
    icon: HeartPulse,
    summary:
      "American Red Cross First Aid, CPR and AED certification for security personnel and other participants.",
    description: [
      "Through our American Red Cross training partnership, Deltacon provides First Aid, CPR, and AED instruction for security personnel and other participants.",
      "Students learn to recognize emergencies, activate emergency services, and provide initial assistance within their training. Instruction includes CPR, AED use, choking response, and first aid, with adult and pediatric coverage according to the selected course.",
      "Participants must complete the required instruction and skills assessments to earn the applicable American Red Cross certification.",
    ],
    keyFacts: [
      { label: "Certification", value: "American Red Cross" },
      { label: "Coverage", value: "Adult and pediatric, by course selected" },
      { label: "Assessment", value: "Skills assessments" },
    ],
    topicsCovered: [
      "Recognizing emergencies",
      "Activating emergency services",
      "CPR",
      "AED use",
      "Choking response",
      "First aid",
    ],
    isFeatured: false,
  },
  {
    slug: "bloodborne-pathogens",
    name: "Bloodborne Pathogens Awareness",
    academyId: "deltacon-tactical-academy",
    icon: Biohazard,
    summary:
      "Helps security personnel and other employees understand and reduce the risks of occupational exposure to blood and infectious materials.",
    description: [
      "This course helps security personnel and other employees understand the risks associated with occupational exposure to blood and potentially infectious materials, including concerns involving hepatitis B, hepatitis C, and HIV.",
      "Instruction covers exposure prevention, standard precautions, personal protective equipment, safe reporting procedures, and the importance of prompt medical evaluation following a suspected exposure.",
      "Training emphasizes avoiding unnecessary contact, following the employer's exposure control procedures, and leaving specialized cleanup to authorized personnel. Workplace-specific instruction supplements the course to address employees' actual duties and exposure risks.",
    ],
    keyFacts: [
      { label: "For", value: "Security personnel and other employees" },
      {
        label: "Tailored to",
        value: "Employees' actual duties and exposure risks",
      },
    ],
    topicsCovered: [
      "Exposure prevention",
      "Standard precautions",
      "Personal protective equipment",
      "Safe reporting procedures",
      "Prompt medical evaluation after exposure",
      "Following exposure control procedures",
    ],
    isFeatured: false,
  },
] as const satisfies readonly TrainingCourse[];

export type TrainingCourseSlug = (typeof trainingCourses)[number]["slug"];

export const trainingCourseSlugs = trainingCourses.map(
  (course) => course.slug,
) as [TrainingCourseSlug, ...TrainingCourseSlug[]];

export const featuredTrainingCourses: readonly TrainingCourse[] =
  trainingCourses.filter((course) => course.isFeatured);

export function findTrainingCourseBySlug(
  slug: string,
): TrainingCourse | undefined {
  return trainingCourses.find((course) => course.slug === slug);
}

export function findCoursesForAcademy(
  academyId: TrainingAcademyId,
): TrainingCourse[] {
  return trainingCourses.filter((course) => course.academyId === academyId);
}

/**
 * The Texas licensing pathway, in order. Shown as a step-by-step diagram on
 * the Training page.
 */
export const licensingPathwayCourseSlugs: TrainingCourseSlug[] = [
  "level-2-unarmed-officer",
  "level-3-armed-officer",
  "level-4-personal-protection-officer",
];

/**
 * Specialized USSA certification courses named in the services and industries
 * documents. Listed on the Training page so visitors can see them in one place.
 */
export const specializedUssaCertifications = [
  {
    code: "USSA-FW-201",
    name: "Fire Watch Officer Certification Course",
    requiredFor: "Fire watch officers and many industry assignments",
  },
  {
    code: "USSA-CS-101",
    name: "Customer Service Excellence for Security Professionals",
    requiredFor: "Every Deltacon employee",
  },
  {
    code: "USSA-DCS-401",
    name: "National Data Center Security Officer Course",
    requiredFor: "Officers assigned to data center security",
  },
];
