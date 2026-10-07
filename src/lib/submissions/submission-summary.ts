import { findIndustryBySlug } from "@/config/industries";
import { availabilityOptions, jobPositions } from "@/config/job-positions";
import { findServiceBySlug } from "@/config/services";
import { trainingCourses } from "@/config/training-courses";
import type { SubmissionFormType } from "@/lib/database/schema/enums";

/** One labelled value, e.g. { label: "Service needed", value: "Mobile Patrol" }. */
export type SubmissionSummaryRow = { label: string; value: string };

export const submissionFormTypeLabels: Record<SubmissionFormType, string> = {
  service_request: "Service request",
  job_application: "Job application",
  training_enquiry: "Training enquiry",
};

export type ContactFields = {
  fullName: string;
  email: string;
  phone: string;
};

export type ServiceRequestFields = ContactFields & {
  companyName?: string | null;
  serviceSlug: string;
  industrySlug: string;
  siteLocation: string;
  estimatedScope: string;
  preferredStartDate?: string | null;
  message: string;
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
  return findServiceBySlug(serviceSlug)?.name ?? serviceSlug;
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

export function summariseServiceRequest(
  fields: ServiceRequestFields,
): SubmissionSummaryRow[] {
  return [
    ...contactRows(fields),
    { label: "Company", value: fields.companyName || "Not given" },
    { label: "Service needed", value: serviceName(fields.serviceSlug) },
    { label: "Industry", value: industryName(fields.industrySlug) },
    { label: "Site location", value: fields.siteLocation },
    { label: "Guards / estimated scope", value: fields.estimatedScope },
    {
      label: "Preferred start date",
      value: fields.preferredStartDate || "Not given",
    },
    { label: "Message", value: fields.message },
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
