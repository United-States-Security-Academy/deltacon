import type {
  JobApplicationDetails,
  ServiceRequestDetails,
  Submission,
  TrainingEnquiryDetails,
} from "@/lib/database/schema";
import type { SubmissionFormType } from "@/lib/database/schema/enums";
import { submissionStatusAppearance } from "@/lib/submissions/submission-status";
import {
  additionalServicesLabel,
  availabilityLabel,
  contractDurationLabel,
  coverageTypeLabel,
  industryName,
  jobPositionName,
  officerClassificationLabel,
  primaryServiceTypeLabel,
  serviceName,
  submissionFormTypeLabels,
  trainingCourseName,
} from "@/lib/submissions/submission-summary";

export type SubmissionForCsv = Submission & {
  serviceRequest: ServiceRequestDetails | null;
  jobApplication: JobApplicationDetails | null;
  trainingEnquiry: TrainingEnquiryDetails | null;
};

type CsvColumn = {
  heading: string;
  value: (submission: SubmissionForCsv) => string | number | null | undefined;
};

const sharedColumns: CsvColumn[] = [
  {
    heading: "Received (Central time)",
    value: (row) => formatCsvDate(row.createdAt),
  },
  { heading: "Form", value: (row) => submissionFormTypeLabels[row.formType] },
  {
    heading: "Status",
    value: (row) => submissionStatusAppearance[row.status].label,
  },
  { heading: "Full name", value: (row) => row.fullName },
  { heading: "Email", value: (row) => row.email },
  { heading: "Phone", value: (row) => row.phone },
];

/** Applies a label lookup to a stored id, leaving empty cells empty. */
function labelled(
  id: string | null | undefined,
  toLabel: (id: string) => string,
): string | undefined {
  return id ? toLabel(id) : undefined;
}

const serviceRequestColumns: CsvColumn[] = [
  {
    heading: "Company / organization",
    value: (row) => row.serviceRequest?.companyName,
  },
  {
    heading: "Security service location",
    value: (row) => row.serviceRequest?.siteLocation,
  },
  {
    heading: "Industry",
    value: (row) => labelled(row.serviceRequest?.industrySlug, industryName),
  },
  {
    heading: "Primary service type",
    value: (row) =>
      labelled(row.serviceRequest?.primaryServiceType, primaryServiceTypeLabel),
  },
  {
    heading: "Officer classification",
    value: (row) =>
      labelled(
        row.serviceRequest?.officerClassification,
        officerClassificationLabel,
      ),
  },
  {
    heading: "Additional services",
    value: (row) =>
      row.serviceRequest?.additionalServices &&
      additionalServicesLabel(row.serviceRequest.additionalServices),
  },
  {
    heading: "Officers required",
    value: (row) => row.serviceRequest?.officersRequired,
  },
  {
    heading: "Required coverage",
    value: (row) =>
      labelled(row.serviceRequest?.coverageType, coverageTypeLabel),
  },
  {
    heading: "Coverage hours / shifts",
    value: (row) => row.serviceRequest?.coverageHours,
  },
  {
    heading: "Contract duration",
    value: (row) =>
      labelled(row.serviceRequest?.contractDuration, contractDurationLabel),
  },
  {
    heading: "Anticipated start date",
    value: (row) => row.serviceRequest?.preferredStartDate,
  },
  // Requests sent before the quote form (2026-11-13) have these instead.
  {
    heading: "Service needed (older requests)",
    value: (row) => labelled(row.serviceRequest?.serviceSlug, serviceName),
  },
  {
    heading: "Guards / estimated scope (older requests)",
    value: (row) => row.serviceRequest?.estimatedScope,
  },
];

const jobApplicationColumns: CsvColumn[] = [
  {
    heading: "Position",
    value: (row) =>
      row.jobApplication && jobPositionName(row.jobApplication.positionSlug),
  },
  {
    heading: "Years of experience",
    value: (row) => row.jobApplication?.yearsOfExperience,
  },
  {
    heading: "Applicant location",
    value: (row) => row.jobApplication?.location,
  },
  {
    heading: "Availability",
    value: (row) =>
      row.jobApplication && availabilityLabel(row.jobApplication.availability),
  },
  { heading: "Cover note", value: (row) => row.jobApplication?.coverNote },
  {
    heading: "CV file name",
    value: (row) => row.jobApplication?.cvOriginalFileName,
  },
];

const trainingEnquiryColumns: CsvColumn[] = [
  {
    heading: "Course",
    value: (row) =>
      row.trainingEnquiry && trainingCourseName(row.trainingEnquiry.courseSlug),
  },
  {
    heading: "Number of trainees",
    value: (row) => row.trainingEnquiry?.numberOfTrainees,
  },
];

const messageColumn: CsvColumn = {
  heading: "Message",
  value: (row) => row.serviceRequest?.message ?? row.trainingEnquiry?.message,
};

/** Only the columns that matter for the chosen form; all of them otherwise. */
function columnsFor(formType: SubmissionFormType | undefined): CsvColumn[] {
  switch (formType) {
    case "service_request":
      return [...sharedColumns, ...serviceRequestColumns, messageColumn];
    case "job_application":
      return [...sharedColumns, ...jobApplicationColumns];
    case "training_enquiry":
      return [...sharedColumns, ...trainingEnquiryColumns, messageColumn];
    default:
      return [
        ...sharedColumns,
        ...serviceRequestColumns,
        ...trainingEnquiryColumns,
        messageColumn,
        ...jobApplicationColumns,
      ];
  }
}

const csvDateFormat = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "America/Chicago",
});

/** "2026-10-08 14:05": sorts correctly and spreadsheets read it as a date. */
function formatCsvDate(date: Date): string {
  return csvDateFormat.format(date).replace(",", "");
}

/**
 * Makes one value safe for a CSV cell.
 *
 * Text a visitor typed that starts with =, +, -, @ (or a tab/return) would be
 * run as a formula by Excel or Google Sheets, so it gets a leading apostrophe.
 * Cells with commas, quotes or line breaks are wrapped in quotes.
 */
export function toCsvCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  let text = String(value);
  if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * Builds the CSV file. It starts with a byte-order mark so Excel opens
 * accented names correctly, and uses Windows line endings for the same reason.
 */
export function buildSubmissionsCsv(
  rows: SubmissionForCsv[],
  formType: SubmissionFormType | undefined,
): string {
  const columns = columnsFor(formType);
  const lines = [
    columns.map((column) => toCsvCell(column.heading)).join(","),
    ...rows.map((row) =>
      columns.map((column) => toCsvCell(column.value(row))).join(","),
    ),
  ];
  return `﻿${lines.join("\r\n")}\r\n`;
}
