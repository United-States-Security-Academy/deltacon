"use server";

import { after } from "next/server";

import { summariseJobApplication } from "@/lib/submissions/submission-summary";
import {
  cvUploadRequestSchema,
  type FormActionError,
  jobApplicationSubmissionSchema,
  type FormActionResult,
} from "@/lib/validation/submission-schemas";
import {
  prepareCvUpload,
  readCvUploadTicket,
  verifyUploadedCv,
} from "@/server/submissions/cv-upload";
import {
  savingFailed,
  securityCheckFailed,
  silentlyDiscarded,
  submissionSucceeded,
  tooManyAttempts,
  validationFailed,
} from "@/server/submissions/form-action-results";
import {
  isRateLimited,
  publicFormRateLimit,
} from "@/server/submissions/rate-limit";
import { getRequestDetails } from "@/server/submissions/request-details";
import { saveJobApplication } from "@/server/submissions/save-submission";
import { sendSubmissionEmails } from "@/server/submissions/submission-emails";
import { isTurnstileTokenValid } from "@/server/submissions/turnstile-verification";

export type CvUploadLinkResult =
  | {
      status: "success";
      storagePath: string;
      uploadToken: string;
      contentType: string;
      ticket: string;
    }
  | FormActionError;

/**
 * Step 1 of applying: after the Turnstile check, hand the browser a one-time
 * link for uploading the CV straight to private storage.
 */
export async function requestCvUploadLink(
  fileDetails: unknown,
): Promise<CvUploadLinkResult> {
  const validation = cvUploadRequestSchema.safeParse(fileDetails);
  if (!validation.success) {
    return validationFailed(validation.error);
  }
  const uploadRequest = validation.data;

  // A bot filled the honeypot: refuse quietly without revealing why.
  if (uploadRequest.website) return savingFailed;

  const requestDetails = await getRequestDetails();
  if (
    await isRateLimited({
      actionName: "job-application",
      ipAddressHash: requestDetails.ipAddressHash,
      ...publicFormRateLimit,
    })
  ) {
    return tooManyAttempts;
  }

  if (
    !(await isTurnstileTokenValid(
      uploadRequest.turnstileToken,
      requestDetails.ipAddress,
    ))
  ) {
    return securityCheckFailed;
  }

  try {
    const preparedUpload = await prepareCvUpload(uploadRequest.fileName);
    return { status: "success", ...preparedUpload };
  } catch (error) {
    console.error("Could not create a CV upload link.", error);
    return savingFailed;
  }
}

/** Step 2 of applying: save the application once the CV is uploaded. */
export async function submitJobApplication(
  formValues: unknown,
): Promise<FormActionResult> {
  const validation = jobApplicationSubmissionSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const submission = validation.data;

  if (submission.website) return silentlyDiscarded;

  const uploadTicket = readCvUploadTicket(submission.cvUploadTicket);
  if (!uploadTicket) {
    return {
      status: "error",
      message:
        "Your CV upload has expired. Please attach your CV again and resubmit.",
      fieldErrors: { cvFile: "Please attach your CV again." },
    };
  }

  const verifiedCv = await verifyUploadedCv(uploadTicket.storagePath);
  if (!verifiedCv) {
    return {
      status: "error",
      message:
        "We couldn't read your CV. Please upload a PDF or Word (.docx) file.",
      fieldErrors: {
        cvFile: "Please upload a valid PDF or Word (.docx) file.",
      },
    };
  }

  const requestDetails = await getRequestDetails();
  let submissionId: string;
  try {
    submissionId = await saveJobApplication(
      submission,
      uploadTicket,
      verifiedCv,
      requestDetails,
    );
  } catch (error) {
    console.error("Could not save job application.", error);
    return savingFailed;
  }

  after(() =>
    sendSubmissionEmails({
      submissionId,
      formType: "job_application",
      submitterName: submission.fullName,
      submitterEmail: submission.email,
      summaryRows: summariseJobApplication({
        ...submission,
        cvOriginalFileName: uploadTicket.originalFileName,
      }),
    }),
  );

  return submissionSucceeded;
}
