"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { privilegedDatabase } from "@/lib/database/database-client";
import { adminUsers } from "@/lib/database/schema";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import {
  newPasswordSchema,
  passwordResetRequestSchema,
  signInSchema,
} from "@/lib/validation/admin-schemas";
import type { FormActionResult } from "@/lib/validation/submission-schemas";
import {
  createAdminAuthLink,
  sendPasswordResetEmail,
} from "@/server/auth/admin-auth-links";
import {
  requireAdmin,
  safeAdminRedirectPath,
} from "@/server/auth/require-admin";
import {
  tooManyAttempts,
  validationFailed,
} from "@/server/submissions/form-action-results";
import { isRateLimited } from "@/server/submissions/rate-limit";
import { getRequestDetails } from "@/server/submissions/request-details";

const incorrectSignIn: FormActionResult = {
  status: "error",
  // Deliberately vague: never reveal whether the email or the password was wrong.
  message: "Incorrect email or password.",
};

async function isAdminUser(userId: string): Promise<boolean> {
  const [adminRecord] = await privilegedDatabase
    .select({ userId: adminUsers.userId })
    .from(adminUsers)
    .where(eq(adminUsers.userId, userId))
    .limit(1);
  return Boolean(adminRecord);
}

/** Email + password sign-in. Only users listed in admin_users get in. */
export async function signInAdmin(
  formValues: unknown,
  requestedRedirectPath: unknown,
): Promise<FormActionResult> {
  const validation = signInSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const { email, password } = validation.data;

  // Slows down password guessing: 8 attempts per 15 minutes per visitor.
  const { ipAddressHash } = await getRequestDetails();
  if (
    await isRateLimited({
      actionName: "admin-sign-in",
      ipAddressHash,
      maximumRequests: 8,
      windowInSeconds: 15 * 60,
    })
  ) {
    return {
      status: "error",
      message:
        "Too many sign-in attempts. Please wait 15 minutes and try again.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error || !data.user) return incorrectSignIn;

  if (!(await isAdminUser(data.user.id))) {
    // A valid account that isn't an admin gets the same message as a wrong
    // password, and its session is ended straight away.
    await supabase.auth.signOut();
    return incorrectSignIn;
  }

  redirect(safeAdminRedirectPath(requestedRedirectPath));
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/admin/login?signedOut=1");
}

/**
 * Sends a password-reset link if the email belongs to an admin. Always reports
 * success, so the form can't be used to discover which emails are admins.
 */
export async function requestPasswordReset(
  formValues: unknown,
): Promise<FormActionResult> {
  const validation = passwordResetRequestSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const { email } = validation.data;

  const { ipAddressHash } = await getRequestDetails();
  if (
    await isRateLimited({
      actionName: "admin-password-reset",
      ipAddressHash,
      maximumRequests: 3,
      windowInSeconds: 15 * 60,
    })
  ) {
    return tooManyAttempts;
  }

  const [adminRecord] = await privilegedDatabase
    .select({ email: adminUsers.email })
    .from(adminUsers)
    .where(eq(adminUsers.email, email.toLowerCase()))
    .limit(1);

  if (adminRecord) {
    try {
      const { url } = await createAdminAuthLink("recovery", adminRecord.email);
      await sendPasswordResetEmail({
        email: adminRecord.email,
        confirmationUrl: url,
      });
    } catch (error) {
      console.error("Could not send a password reset link.", error);
    }
  }
  return { status: "success" };
}

/**
 * Called when the admin presses "Continue" on the link landing page. Checking
 * the one-time token only on this button press (not when the page opens)
 * stops email link scanners from using the link up before the admin does.
 */
export async function confirmAdminAuthLink(
  tokenHash: unknown,
  linkType: unknown,
): Promise<FormActionResult> {
  if (
    typeof tokenHash !== "string" ||
    tokenHash.length < 10 ||
    (linkType !== "invite" && linkType !== "recovery")
  ) {
    return {
      status: "error",
      message: "This link isn't valid. Please ask for a new one.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.verifyOtp({
    type: linkType,
    token_hash: tokenHash,
  });
  if (error) {
    return {
      status: "error",
      message:
        "This link has expired or has already been used. Please ask for a new one.",
    };
  }
  redirect("/admin/set-password");
}

/** Sets a new password for the signed-in admin (after an invite or reset, or from Account). */
export async function setAdminPassword(
  formValues: unknown,
): Promise<FormActionResult> {
  await requireAdmin();

  const validation = newPasswordSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({
    password: validation.data.password,
  });
  if (error) {
    return {
      status: "error",
      message:
        error.code === "same_password"
          ? "Please choose a password you haven't used before."
          : "Your password couldn't be updated. Please try again.",
    };
  }
  return { status: "success" };
}
