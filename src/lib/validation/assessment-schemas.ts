import { z } from "zod";

import { assessmentAnswersSchema } from "@/lib/security-assessment/score-assessment";

import {
  emailRule,
  fullNameRule,
  honeypotRule,
  turnstileTokenRule,
} from "./submission-schemas";

/** Fields of the "Email me my results" form. */
export const assessmentEmailFormSchema = z.object({
  fullName: fullNameRule,
  email: emailRule,
  companyName: z
    .string()
    .trim()
    .max(150, "Company name must be 150 characters or fewer.")
    .optional()
    .transform((companyName) => (companyName ? companyName : undefined)),
});

export const assessmentEmailRequestSchema = assessmentEmailFormSchema.extend({
  answers: assessmentAnswersSchema,
  turnstileToken: turnstileTokenRule,
  website: honeypotRule,
});

export type AssessmentEmailFormInput = z.input<
  typeof assessmentEmailFormSchema
>;
export type AssessmentEmailRequest = z.output<
  typeof assessmentEmailRequestSchema
>;
