"use server";

import { after } from "next/server";

import { summariseTrainingEnquiry } from "@/lib/submissions/submission-summary";
import {
  trainingEnquirySubmissionSchema,
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
import { saveTrainingEnquiry } from "@/server/submissions/save-submission";
import { sendSubmissionEmails } from "@/server/submissions/submission-emails";
import { isTurnstileTokenValid } from "@/server/submissions/turnstile-verification";

/** Handles the training enquiry form. */
export async function submitTrainingEnquiry(
  formValues: unknown,
): Promise<FormActionResult> {
  const validation = trainingEnquirySubmissionSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const submission = validation.data;

  if (submission.website) return silentlyDiscarded;

  const requestDetails = await getRequestDetails();
  if (
    await isRateLimited({
      actionName: "training-enquiry",
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
    submissionId = await saveTrainingEnquiry(submission, requestDetails);
  } catch (error) {
    console.error("Could not save training enquiry.", error);
    return savingFailed;
  }

  after(() =>
    sendSubmissionEmails({
      submissionId,
      formType: "training_enquiry",
      submitterName: submission.fullName,
      submitterEmail: submission.email,
      summaryRows: summariseTrainingEnquiry(submission),
    }),
  );

  return submissionSucceeded;
}
