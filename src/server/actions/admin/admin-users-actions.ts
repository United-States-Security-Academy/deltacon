"use server";

import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { privilegedDatabase } from "@/lib/database/database-client";
import { adminUsers } from "@/lib/database/schema";
import { createSecretSupabaseClient } from "@/lib/supabase/secret-client";
import { inviteAdminSchema } from "@/lib/validation/admin-schemas";
import type { FormActionResult } from "@/lib/validation/submission-schemas";
import {
  AccountAlreadyExistsError,
  createAdminAuthLink,
  sendAdminInviteEmail,
} from "@/server/auth/admin-auth-links";
import { requireAdmin } from "@/server/auth/require-admin";
import { validationFailed } from "@/server/submissions/form-action-results";

/*
 * Managing who can use the admin area. Changes to admin_users are made with
 * the privileged connection because the table has no write policies at all;
 * every action below first checks the caller is a signed-in admin.
 */

/** Invites a new admin by email, with a link to choose their password. */
export async function inviteAdmin(
  formValues: unknown,
): Promise<FormActionResult> {
  const currentAdmin = await requireAdmin();

  const validation = inviteAdminSchema.safeParse(formValues);
  if (!validation.success) return validationFailed(validation.error);
  const email = validation.data.email.toLowerCase();
  const { fullName } = validation.data;

  const [existingAdmin] = await privilegedDatabase
    .select({ userId: adminUsers.userId })
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (existingAdmin) {
    return {
      status: "error",
      message: "That person is already an admin.",
      fieldErrors: { email: "This email already belongs to an admin." },
    };
  }

  let link: { url: string; userId: string };
  try {
    link = await createAdminAuthLink("invite", email, fullName);
  } catch (error) {
    if (!(error instanceof AccountAlreadyExistsError)) {
      console.error("Could not create an admin invite.", error);
      return {
        status: "error",
        message: "The invitation couldn't be created. Please try again.",
      };
    }
    // They already have an account (e.g. a former admin): send a
    // set-password link instead of an invite.
    link = await createAdminAuthLink("recovery", email);
  }

  await privilegedDatabase
    .insert(adminUsers)
    .values({ userId: link.userId, email, displayName: fullName })
    .onConflictDoUpdate({
      target: adminUsers.userId,
      set: { email, displayName: fullName },
    });

  const emailSent = await sendAdminInviteEmail({
    email,
    displayName: fullName,
    invitedByName: currentAdmin.displayName,
    confirmationUrl: link.url,
  });

  revalidatePath("/admin/users");
  if (!emailSent) {
    return {
      status: "error",
      message: `${fullName} was added as an admin, but the invitation email couldn't be sent. Remove them and try again.`,
    };
  }
  return { status: "success" };
}

/**
 * Removes an admin completely (their sign-in account is deleted). Admins can't
 * remove themselves, and the last admin can't be removed.
 */
export async function removeAdmin(userId: unknown): Promise<FormActionResult> {
  const currentAdmin = await requireAdmin();
  if (typeof userId !== "string") {
    return { status: "error", message: "That admin couldn't be found." };
  }
  if (userId === currentAdmin.userId) {
    return { status: "error", message: "You can't remove your own account." };
  }

  const [{ numberOfAdmins }] = await privilegedDatabase
    .select({ numberOfAdmins: count() })
    .from(adminUsers);
  if (numberOfAdmins <= 1) {
    return { status: "error", message: "The last admin can't be removed." };
  }

  const supabase = createSecretSupabaseClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    console.error("Could not remove admin.", error);
    return {
      status: "error",
      message: "That admin couldn't be removed. Please try again.",
    };
  }
  // Deleting the account also removes the admin_users row (cascade); this
  // covers the case where the account was already gone.
  await privilegedDatabase
    .delete(adminUsers)
    .where(eq(adminUsers.userId, userId));

  revalidatePath("/admin/users");
  return { status: "success" };
}
