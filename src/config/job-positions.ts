/**
 * Roles applicants can choose on the Apply Now form. Edit this list when
 * vacancies change.
 */

export const jobPositions = [
  {
    slug: "unarmed-security-officer",
    name: "Unarmed Security Officer (Level II)",
  },
  {
    slug: "armed-security-officer",
    name: "Armed Security Officer (Level III)",
  },
  {
    slug: "personal-protection-officer",
    name: "Personal Protection Officer (Level IV)",
  },
  { slug: "mobile-patrol-officer", name: "Mobile Patrol Officer" },
  { slug: "fire-watch-officer", name: "Fire Watch Officer" },
  { slug: "event-security-staff", name: "Event Security Staff" },
  {
    slug: "correctional-security-officer",
    name: "Detention / Correctional Security Officer",
  },
  {
    slug: "off-duty-peace-officer",
    name: "Off-Duty Peace Officer (TCOLE)",
  },
  { slug: "security-supervisor", name: "Security Supervisor" },
  {
    slug: "dispatch-operations-officer",
    name: "Dispatch & Operations Center Officer",
  },
] as const;

export type JobPositionSlug = (typeof jobPositions)[number]["slug"];

export const jobPositionSlugs = jobPositions.map(
  (position) => position.slug,
) as [JobPositionSlug, ...JobPositionSlug[]];

export const availabilityOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "weekends", label: "Weekends only" },
  { value: "nights", label: "Nights" },
  { value: "flexible", label: "Flexible / any shift" },
] as const;

export type AvailabilityValue = (typeof availabilityOptions)[number]["value"];

export const availabilityValues = availabilityOptions.map(
  (option) => option.value,
) as [AvailabilityValue, ...AvailabilityValue[]];
