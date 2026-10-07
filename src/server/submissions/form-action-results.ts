import "server-only";

import type { z } from "zod";

import {
  toFieldErrors,
  type FormActionError,
  type FormActionResult,
} from "@/lib/validation/submission-schemas";

/** Messages shown to visitors when a submission can't be accepted. */

export function validationFailed(error: z.ZodError): FormActionError {
  return {
    status: "error",
    message: "Please check the highlighted fields and try again.",
    fieldErrors: toFieldErrors(error),
  };
}

export const tooManyAttempts: FormActionError = {
  status: "error",
  message:
    "You've sent several submissions in a short time. Please wait a few minutes and try again.",
};

export const securityCheckFailed: FormActionError = {
  status: "error",
  message:
    "We couldn't confirm the security check. Please complete it again and resubmit.",
  fieldErrors: { turnstileToken: "Please complete the security check again." },
};

export const savingFailed: FormActionError = {
  status: "error",
  message:
    "Sorry, something went wrong on our side and your form wasn't sent. Please try again in a moment.",
};

/**
 * Returned when the honeypot field was filled. It looks like success so bots
 * learn nothing, but nothing is saved or emailed.
 */
export const silentlyDiscarded: FormActionResult = { status: "success" };

export const submissionSucceeded: FormActionResult = { status: "success" };
