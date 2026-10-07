"use server";

import { after } from "next/server";

import { summariseServiceRequest } from "@/lib/submissions/submission-summary";
import {
  serviceRequestSubmissionSchema,
  type FormActionResult,
} from "@/lib/validation/submission-schemas";
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
import { saveServiceRequest } from "@/server/submissions/save-submission";
import { sendSubmissionEmails } from "@/server/submissions/submission-emails";
import { isTurnstileTokenValid } from "@/server/submissions/turnstile-verification";

/** Handles the Request Service form. */
export async function submitServiceRequest(
  formValues: unknown,
): Promise<FormActionResult> {
  const validation = serviceRequestSubmissionSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const submission = validation.data;

  if (submission.website) return silentlyDiscarded;

  const requestDetails = await getRequestDetails();
  if (
    await isRateLimited({
      actionName: "service-request",
      ipAddressHash: requestDetails.ipAddressHash,
      ...publicFormRateLimit,
    })
  ) {
    return tooManyAttempts;
  }

  if (
    !(await isTurnstileTokenValid(
      submission.turnstileToken,
      requestDetails.ipAddress,
    ))
  ) {
    return securityCheckFailed;
  }

  let submissionId: string;
  try {
    submissionId = await saveServiceRequest(submission, requestDetails);
  } catch (error) {
    console.error("Could not save service request.", error);
    return savingFailed;
  }

  // Emails are sent after the response so the visitor isn't kept waiting.
  after(() =>
    sendSubmissionEmails({
      submissionId,
      formType: "service_request",
      submitterName: submission.fullName,
      submitterEmail: submission.email,
      summaryRows: summariseServiceRequest(submission),
    }),
  );

  return submissionSucceeded;
}
