"use server";

import { after } from "next/server";

import { scoreAssessment } from "@/lib/security-assessment/score-assessment";
import { assessmentEmailRequestSchema } from "@/lib/validation/assessment-schemas";
import type { FormActionResult } from "@/lib/validation/submission-schemas";
import {
  sendLeadNotification,
  sendResultsToVisitor,
} from "@/server/assessment/assessment-emails";
import {
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
import { isTurnstileTokenValid } from "@/server/submissions/turnstile-verification";

/**
 * Emails the visitor their self-assessment results and sends the Deltacon
 * team a copy as a lead. The score is recalculated here from the raw answers,
 * so a tampered score from the browser is never used.
 */
export async function emailAssessmentResults(
  formValues: unknown,
): Promise<FormActionResult> {
  const validation = assessmentEmailRequestSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const request = validation.data;

  if (request.website) return silentlyDiscarded;

  const requestDetails = await getRequestDetails();
  if (
    await isRateLimited({
      actionName: "assessment-email",
      ipAddressHash: requestDetails.ipAddressHash,
      ...publicFormRateLimit,
    })
  ) {
    return tooManyAttempts;
  }

  if (
    !(await isTurnstileTokenValid(
      request.turnstileToken,
      requestDetails.ipAddress,
    ))
  ) {
    return securityCheckFailed;
  }

  const emailDetails = {
    fullName: request.fullName,
    email: request.email,
    companyName: request.companyName,
    result: scoreAssessment(request.answers),
  };

  const visitorEmailSent = await sendResultsToVisitor(emailDetails);
  if (!visitorEmailSent) {
    return {
      status: "error",
      message:
        "Sorry, we couldn't send your results just now. Please check your email address and try again in a moment.",
    };
  }

  // The team's copy is sent after the response so the visitor isn't kept waiting.
  after(() => sendLeadNotification(emailDetails));
  return submissionSucceeded;
}
