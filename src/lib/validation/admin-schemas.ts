import { z } from "zod";

import { emailRule, fullNameRule } from "./submission-schemas";

/*
 * Validation for the admin sign-in, password and admin-invite forms. Shared by
 * the browser (instant feedback) and the server actions (the real check).
 */

export const signInSchema = z.object({
  email: emailRule,
  password: z
    .string()
    .min(1, "Please enter your password.")
    .max(200, "That password is too long."),
});

export const passwordResetRequestSchema = z.object({
  email: emailRule,
});

export const minimumPasswordLength = 12;

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(
        minimumPasswordLength,
        `Use at least ${minimumPasswordLength} characters.`,
      )
      .max(72, "Use 72 characters or fewer.")
      .refine(
        (password) => /[a-zA-Z]/.test(password) && /[0-9]/.test(password),
        "Use a mix of letters and numbers.",
      ),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "The two passwords don't match.",
    path: ["confirmPassword"],
  });

export const inviteAdminSchema = z.object({
  fullName: fullNameRule,
  email: emailRule,
});

export type SignInFormInput = z.input<typeof signInSchema>;
export type PasswordResetRequestInput = z.input<
  typeof passwordResetRequestSchema
>;
export type NewPasswordFormInput = z.input<typeof newPasswordSchema>;
export type InviteAdminFormInput = z.input<typeof inviteAdminSchema>;
