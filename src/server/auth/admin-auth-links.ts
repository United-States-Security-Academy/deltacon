import "server-only";

import { companyDetails } from "@/config/company-details";
import {
  button,
  escapeHtml,
  paragraph,
  renderEmailLayout,
} from "@/lib/email/email-layout";
import { sendEmail } from "@/lib/email/send-email";
import { absoluteUrl } from "@/lib/site-url";
import { createSecretSupabaseClient } from "@/lib/supabase/secret-client";

/*
 * Invite and password-reset links for admins.
 *
 * Supabase creates a one-time token; the link points to our own
 * /admin/auth/confirm route, which checks the token on the server, signs the
 * admin in and sends them to "set your password". The email is sent through
 * Resend from the company's verified domain, rather than Supabase's default
 * (rate-limited, unbranded) sender.
 */

export type AdminAuthLinkType = "invite" | "recovery";

/** Where the admin lands after following the link. */
const setPasswordPath = "/admin/set-password";

function buildConfirmationUrl(
  tokenHash: string,
  type: AdminAuthLinkType,
): string {
  const searchParameters = new URLSearchParams({
    token_hash: tokenHash,
    type,
    next: setPasswordPath,
  });
  return absoluteUrl(`/admin/auth/confirm?${searchParameters.toString()}`);
}

/** Thrown when an invite is sent to an email that already has an account. */
export class AccountAlreadyExistsError extends Error {}

/**
 * Creates a sign-in link. For "invite" this also creates the Supabase account
 * (without a password) if it doesn't exist yet.
 */
export async function createAdminAuthLink(
  type: AdminAuthLinkType,
  email: string,
  displayName?: string,
): Promise<{ url: string; userId: string }> {
  const supabase = createSecretSupabaseClient();
  const { data, error } =
    type === "invite"
      ? await supabase.auth.admin.generateLink({
          type: "invite",
          email,
          options: { data: { display_name: displayName } },
        })
      : await supabase.auth.admin.generateLink({ type: "recovery", email });

  if (error) {
    if (
      type === "invite" &&
      (error.code === "email_exists" ||
        /already.*registered/i.test(error.message))
    ) {
      throw new AccountAlreadyExistsError(error.message);
    }
    throw error;
  }

  return {
    url: buildConfirmationUrl(data.properties.hashed_token, type),
    userId: data.user.id,
  };
}

export async function sendAdminInviteEmail({
  email,
  displayName,
  invitedByName,
  confirmationUrl,
}: {
  email: string;
  displayName: string;
  invitedByName: string;
  confirmationUrl: string;
}): Promise<boolean> {
  const subject = `You've been invited to the ${companyDetails.name} website admin`;
  return sendEmail({
    to: email,
    subject,
    html: renderEmailLayout({
      previewText: `${invitedByName} invited you to manage the ${companyDetails.name} website.`,
      heading: "You're invited to the website admin",
      bodyHtml:
        paragraph(
          `Hi ${escapeHtml(displayName.split(" ")[0] ?? displayName)},`,
        ) +
        paragraph(
          `${escapeHtml(invitedByName)} has invited you to help manage the ${escapeHtml(companyDetails.name)} website: blog posts, form submissions, the gallery and settings.`,
        ) +
        paragraph(
          "Click the button below to choose your password and sign in.",
        ) +
        button("Accept invitation", confirmationUrl) +
        paragraph(
          `<br><span style="font-size:13px;color:#4b5563;">This link can only be used once and expires after 24 hours. If you weren't expecting this invitation, you can ignore this email.</span>`,
        ),
    }),
    text: `${invitedByName} has invited you to manage the ${companyDetails.name} website.\n\nAccept the invitation and choose your password: ${confirmationUrl}\n\nThe link can only be used once and expires after 24 hours.`,
  });
}

export async function sendPasswordResetEmail({
  email,
  confirmationUrl,
}: {
  email: string;
  confirmationUrl: string;
}): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `Reset your ${companyDetails.name} admin password`,
    html: renderEmailLayout({
      previewText: "Use this link to choose a new password.",
      heading: "Reset your password",
      bodyHtml:
        paragraph(
          "We received a request to reset the password for your website admin account.",
        ) +
        button("Choose a new password", confirmationUrl) +
        paragraph(
          `<br><span style="font-size:13px;color:#4b5563;">This link can only be used once and expires soon. If you didn't ask to reset your password, you can ignore this email; your password won't change.</span>`,
        ),
    }),
    text: `Choose a new password for your ${companyDetails.name} website admin account: ${confirmationUrl}\n\nIf you didn't ask for this, ignore this email.`,
  });
}
