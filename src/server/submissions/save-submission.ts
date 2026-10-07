import "server-only";

import { randomUUID } from "node:crypto";

import { runAsVisitor } from "@/lib/database/access-roles";
import {
  jobApplicationDetails,
  serviceRequestDetails,
  submissions,
  trainingEnquiryDetails,
  type SubmissionFormType,
} from "@/lib/database/schema";
import type {
  JobApplicationSubmission,
  ServiceRequestSubmission,
  TrainingEnquirySubmission,
} from "@/lib/validation/submission-schemas";

import type { RequestDetails } from "./request-details";
import type { VerifiedCv, CvUploadTicket } from "./cv-upload";

type ContactAndRequest = {
  formType: SubmissionFormType;
  fullName: string;
  email: string;
  phone: string;
  requestDetails: RequestDetails;
};

/**
 * Inserts the shared submission row. Visitors are not allowed to read rows
 * back (RLS), so the id is generated here instead of using RETURNING.
 */
function submissionRow({
  formType,
  fullName,
  email,
  phone,
  requestDetails,
}: ContactAndRequest) {
  return {
    id: randomUUID(),
    formType,
    fullName,
    email,
    phone,
    ipAddressHash: requestDetails.ipAddressHash,
    userAgent: requestDetails.userAgent,
  };
}

/** Saves a Request Service submission and returns its id. */
export async function saveServiceRequest(
  submission: ServiceRequestSubmission,
  requestDetails: RequestDetails,
): Promise<string> {
  const row = submissionRow({
    formType: "service_request",
    ...submission,
    requestDetails,
  });

  await runAsVisitor(async (transaction) => {
    await transaction.insert(submissions).values(row);
    await transaction.insert(serviceRequestDetails).values({
      submissionId: row.id,
      companyName: submission.companyName ?? null,
      serviceSlug: submission.serviceSlug,
      industrySlug: submission.industrySlug,
      siteLocation: submission.siteLocation,
      estimatedScope: submission.estimatedScope,
      preferredStartDate: submission.preferredStartDate ?? null,
      message: submission.message,
    });
  });
  return row.id;
}

/** Saves an Apply Now submission (the CV is already verified) and returns its id. */
export async function saveJobApplication(
  submission: JobApplicationSubmission,
  uploadTicket: CvUploadTicket,
  verifiedCv: VerifiedCv,
  requestDetails: RequestDetails,
): Promise<string> {
  const row = submissionRow({
    formType: "job_application",
    ...submission,
    requestDetails,
  });

  await runAsVisitor(async (transaction) => {
    await transaction.insert(submissions).values(row);
    await transaction.insert(jobApplicationDetails).values({
      submissionId: row.id,
      positionSlug: submission.positionSlug,
      yearsOfExperience: submission.yearsOfExperience,
      location: submission.location,
      availability: submission.availability,
      coverNote: submission.coverNote,
      cvStoragePath: verifiedCv.storagePath,
      cvOriginalFileName: uploadTicket.originalFileName,
      cvFileSizeInBytes: verifiedCv.fileSizeInBytes,
    });
  });
  return row.id;
}

/** Saves a training enquiry and returns its id. */
export async function saveTrainingEnquiry(
  submission: TrainingEnquirySubmission,
  requestDetails: RequestDetails,
): Promise<string> {
  const row = submissionRow({
    formType: "training_enquiry",
    ...submission,
    requestDetails,
  });

  await runAsVisitor(async (transaction) => {
    await transaction.insert(submissions).values(row);
    await transaction.insert(trainingEnquiryDetails).values({
      submissionId: row.id,
      courseSlug: submission.courseSlug,
      numberOfTrainees: submission.numberOfTrainees,
      message: submission.message,
    });
  });
  return row.id;
}
