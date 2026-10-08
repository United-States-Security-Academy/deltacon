"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { runAsSignedInUser } from "@/lib/database/access-roles";
import {
  jobApplicationDetails,
  submissionNotes,
  submissions,
  type SubmissionStatus,
} from "@/lib/database/schema";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import {
  submissionIdRule,
  submissionNoteSchema,
  submissionStatusRule,
} from "@/lib/validation/submission-inbox-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import { cvUploadBucket } from "@/server/submissions/cv-upload";

/*
 * Changes admins make in the submissions inbox. Each action checks the caller
 * is an admin, validates its input, and writes as that admin so the
 * database's Row Level Security has the final say.
 */

export type SubmissionActionResult =
  { status: "success" } | { status: "error"; message: string };

const missingSubmission: SubmissionActionResult = {
  status: "error",
  message: "That submission no longer exists. Refresh the page.",
};

function refreshInboxPages(submissionId: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  revalidatePath(`/admin/submissions/${submissionId}`);
}

export async function updateSubmissionStatus(
  submissionId: string,
  newStatus: SubmissionStatus,
): Promise<SubmissionActionResult> {
  const admin = await requireAdmin();
  const id = submissionIdRule.safeParse(submissionId);
  const status = submissionStatusRule.safeParse(newStatus);
  if (!id.success) return missingSubmission;
  if (!status.success)
    return { status: "error", message: "Choose a valid status." };

  const updated = await runAsSignedInUser(admin.userId, (transaction) =>
    transaction
      .update(submissions)
      .set({ status: status.data, updatedAt: new Date() })
      .where(eq(submissions.id, id.data))
      .returning({ id: submissions.id }),
  );
  if (updated.length === 0) return missingSubmission;

  refreshInboxPages(id.data);
  return { status: "success" };
}

export async function addSubmissionNote(
  submissionId: string,
  formValues: unknown,
): Promise<SubmissionActionResult> {
  const admin = await requireAdmin();
  const id = submissionIdRule.safeParse(submissionId);
  if (!id.success) return missingSubmission;
  const note = submissionNoteSchema.safeParse(formValues);
  if (!note.success) {
    return {
      status: "error",
      message: note.error.issues[0]?.message ?? "Check the note and try again.",
    };
  }

  const saved = await runAsSignedInUser(admin.userId, async (transaction) => {
    const [submission] = await transaction
      .select({ id: submissions.id })
      .from(submissions)
      .where(eq(submissions.id, id.data))
      .limit(1);
    if (!submission) return false;
    await transaction.insert(submissionNotes).values({
      submissionId: id.data,
      authorUserId: admin.userId,
      body: note.data.body,
    });
    return true;
  });
  if (!saved) return missingSubmission;

  refreshInboxPages(id.data);
  return { status: "success" };
}

/** Deletes a submission, its notes and (for job applications) the CV file. */
export async function deleteSubmission(
  submissionId: string,
): Promise<SubmissionActionResult> {
  const admin = await requireAdmin();
  const id = submissionIdRule.safeParse(submissionId);
  if (!id.success) return missingSubmission;

  const deleted = await runAsSignedInUser(admin.userId, async (transaction) => {
    const [cvFile] = await transaction
      .select({ storagePath: jobApplicationDetails.cvStoragePath })
      .from(jobApplicationDetails)
      .where(eq(jobApplicationDetails.submissionId, id.data))
      .limit(1);
    // Details and notes are removed with it (ON DELETE CASCADE).
    const removedRows = await transaction
      .delete(submissions)
      .where(eq(submissions.id, id.data))
      .returning({ id: submissions.id });
    return {
      found: removedRows.length > 0,
      cvStoragePath: cvFile?.storagePath,
    };
  });
  if (!deleted.found) return missingSubmission;

  if (deleted.cvStoragePath) {
    // Uses the admin's own session, so the storage access rules apply.
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.storage
      .from(cvUploadBucket)
      .remove([deleted.cvStoragePath]);
    if (error) console.error("The CV file could not be deleted.", error);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/submissions");
  redirect("/admin/submissions");
}
