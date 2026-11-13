import { findIndustryBySlug } from "@/config/industries";
import { availabilityOptions, jobPositions } from "@/config/job-positions";
import { findRequestableService } from "@/config/requestable-services";
import {
  additionalServices,
  contractDurations,
  coverageTypes,
  officerClassifications,
  optionLabel,
  primaryServiceTypes,
} from "@/config/service-request-options";
import { trainingCourses } from "@/config/training-courses";
import type { SubmissionFormType } from "@/lib/database/schema/enums";

/** One labelled value, e.g. { label: "Service needed", value: "Mobile Patrol" }. */
export type SubmissionSummaryRow = { label: string; value: string };

export const submissionFormTypeLabels: Record<SubmissionFormType, string> = {
  service_request: "Service request",
  job_application: "Job application",
  training_enquiry: "Training enquiry",
};

/** Plural names, e.g. for inbox tabs ("enquiry" can't just take an "s"). */
export const submissionFormTypePluralLabels: Record<
  SubmissionFormType,
  string
> = {
  service_request: "Service requests",
  job_application: "Job applications",
  training_enquiry: "Training enquiries",
};

export type ContactFields = {
  fullName: string;
  email: string;
  phone: string;
};

/**
 * A service request from the quote form (2026-11-13 onwards) or from the
 * older form, which had a service slug and an "estimated scope" instead.
 */
export type ServiceRequestFields = ContactFields & {
  companyName?: string | null;
  industrySlug?: string | null;
  siteLocation: string;
  preferredStartDate?: string | null;
  message: string;
  primaryServiceType?: string | null;
  officerClassification?: string | null;
  additionalServices?: string[] | null;
  officersRequired?: number | null;
  coverageType?: string | null;
  coverageHours?: string | null;
  contractDuration?: string | null;
  // Older requests only.
  serviceSlug?: string | null;
  estimatedScope?: string | null;
};

export type JobApplicationFields = ContactFields & {
  positionSlug: string;
  yearsOfExperience: number;
  location: string;
  availability: string;
  coverNote: string;
  cvOriginalFileName: string;
};

export type TrainingEnquiryFields = ContactFields & {
  courseSlug: string;
  numberOfTrainees: number;
  message: string;
};

// Readable names for stored slugs. Unknown slugs (e.g. a service removed from
// the config later) fall back to the raw value so nothing is ever hidden.

export function serviceName(serviceSlug: string): string {
  return findRequestableService(serviceSlug)?.name ?? serviceSlug;
}

export function industryName(industrySlug: string): string {
  if (industrySlug === "other") return "Other";
  return findIndustryBySlug(industrySlug)?.name ?? industrySlug;
}

export function jobPositionName(positionSlug: string): string {
  return (
    jobPositions.find((position) => position.slug === positionSlug)?.name ??
    positionSlug
  );
}

export function availabilityLabel(availability: string): string {
  return (
    availabilityOptions.find((option) => option.value === availability)
      ?.label ?? availability
  );
}

export function trainingCourseName(courseSlug: string): string {
  return (
    trainingCourses.find((course) => course.slug === courseSlug)?.name ??
    courseSlug
  );
}

function contactRows(fields: ContactFields): SubmissionSummaryRow[] {
  return [
    { label: "Full name", value: fields.fullName },
    { label: "Email", value: fields.email },
    { label: "Phone", value: fields.phone },
  ];
}

export function primaryServiceTypeLabel(id: string): string {
  return optionLabel(primaryServiceTypes, id);
}

export function officerClassificationLabel(id: string): string {
  return optionLabel(officerClassifications, id);
}

export function additionalServicesLabel(ids: readonly string[]): string {
  return ids.map((id) => optionLabel(additionalServices, id)).join(", ");
}

export function coverageTypeLabel(id: string): string {
  return optionLabel(coverageTypes, id);
}

export function contractDurationLabel(id: string): string {
  return optionLabel(contractDurations, id);
}

const notGiven = "Not given";

/** The answers about the service itself, in the order the form asks them. */
function requestedServiceRows(
  fields: ServiceRequestFields,
): SubmissionSummaryRow[] {
  if (!fields.primaryServiceType) {
    // A request from the older form.
    return [
      {
        label: "Service needed",
        value: fields.serviceSlug ? serviceName(fields.serviceSlug) : notGiven,
      },
      {
        label: "Guards / estimated scope",
        value: fields.estimatedScope || notGiven,
      },
    ];
  }
  const rows: SubmissionSummaryRow[] = [
    {
      label: "Primary service type",
      value: primaryServiceTypeLabel(fields.primaryServiceType),
    },
  ];
  if (fields.officerClassification) {
    rows.push({
      label: "Officer classification",
      value: officerClassificationLabel(fields.officerClassification),
    });
  }
  rows.push({
    label: "Additional services",
    value: fields.additionalServices?.length
      ? additionalServicesLabel(fields.additionalServices)
      : "None",
  });
  if (fields.officersRequired != null) {
    rows.push({
      label: "Officers required",
      value: String(fields.officersRequired),
    });
  }
  rows.push(
    {
      label: "Required coverage",
      value: fields.coverageType
        ? coverageTypeLabel(fields.coverageType)
        : notGiven,
    },
    { label: "Coverage hours / shifts", value: fields.coverageHours || notGiven },
    {
      label: "Contract duration",
      value: fields.contractDuration
        ? contractDurationLabel(fields.contractDuration)
        : notGiven,
    },
  );
  return rows;
}

export function summariseServiceRequest(
  fields: ServiceRequestFields,
): SubmissionSummaryRow[] {
  return [
    ...contactRows(fields),
    { label: "Company / organization", value: fields.companyName || notGiven },
    { label: "Security service location", value: fields.siteLocation },
    {
      label: "Industry",
      value: fields.industrySlug ? industryName(fields.industrySlug) : notGiven,
    },
    ...requestedServiceRows(fields),
    {
      label: "Anticipated start date",
      value: fields.preferredStartDate || notGiven,
    },
    { label: "Security needs", value: fields.message },
  ];
}

export function summariseJobApplication(
  fields: JobApplicationFields,
): SubmissionSummaryRow[] {
  return [
    ...contactRows(fields),
    { label: "Position", value: jobPositionName(fields.positionSlug) },
    { label: "Years of experience", value: String(fields.yearsOfExperience) },
    { label: "Location", value: fields.location },
    { label: "Availability", value: availabilityLabel(fields.availability) },
    { label: "Cover note", value: fields.coverNote },
    { label: "CV", value: fields.cvOriginalFileName },
  ];
}

export function summariseTrainingEnquiry(
  fields: TrainingEnquiryFields,
): SubmissionSummaryRow[] {
  return [
    ...contactRows(fields),
    { label: "Course", value: trainingCourseName(fields.courseSlug) },
    { label: "Number of trainees", value: String(fields.numberOfTrainees) },
    { label: "Message", value: fields.message || "Not given" },
  ];
}
