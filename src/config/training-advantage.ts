import { ussaAcademyWebsiteUrl } from "@/config/training-courses";

/*
 * Content of /training-advantage: Deltacon's two academies and in-house
 * instructor credentials, shared by every location page (which each keep a
 * short summary and a link here). Wording from
 * docs/locations/dallas-fort-worth.md, plus one sentence from
 * docs/locations/houston-sugar-land.md.
 */

export type TrainingAcademy = {
  name: string;
  licenseNumber: string;
  website?: string;
};

export const trainingAdvantage = {
  eyebrow: "Training advantage",
  title: "The Deltacon Training Advantage",
  subtitle: "Two Active Security Training Academies",
  academiesTitle: "Professional Security Training Is Part of Our Organization",
  academiesParagraphs: [
    "One of Deltacon Security Group's most significant competitive advantages is our ownership and operation of two active security training schools.",
    "Unlike security providers that must rely entirely on outside training organizations, Deltacon has invested in its own security education and training infrastructure.",
  ],
  academiesIntroduction: "Our academies include:",
  academies: [
    {
      name: "The United States Security Academy (USSA)",
      licenseNumber: "F28377901",
      website: ussaAcademyWebsiteUrl,
    },
    { name: "DeltaCon Tactical Academy", licenseNumber: "Y07327301" },
  ] satisfies TrainingAcademy[],
  academiesClosing: [
    "These training organizations provide an additional foundation for professional security training, continuing education, firearms instruction, and specialized security development.",
    "Our ownership of these academies demonstrates our commitment to the security profession and our investment in the education and development of security personnel.",
  ],
  instructorsTitle: "In-House Texas DPS-Licensed Security Instructors",
  instructorsIntroduction:
    "Deltacon's in-house training capabilities include Texas DPS-licensed instructors in multiple areas of private security education.",
  instructorsListIntroduction: "Our instructor qualifications include:",
  instructorQualifications: [
    "Level III Classroom Instructor.",
    "Level III Firearms Instructor.",
    "Level IV Personal Protection Instructor.",
    "Level I Alarm Instructor.",
    "Continuing Education Instructor.",
  ],
  instructorsClosing: [
    "Having these instructional capabilities within our organization provides an important operational advantage.",
    "It gives us greater control over training coordination, professional development, continuing education, and the reinforcement of applicable security training standards.",
    "It also allows Deltacon to maintain a stronger connection between security operations and the professional education of the personnel working in the field.",
    // From the Houston copy.
    "It also provides an organizational advantage when recruiting, developing, and preparing security personnel for specialized assignments.",
  ],
  emphasis:
    "We believe that better-trained security professionals contribute to better-prepared security operations.",
  finalParagraph:
    "Our training infrastructure is an investment in our employees, our clients, and the quality of the services we provide.",
};
