import { notFound, redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { submissionIdRule } from "@/lib/validation/submission-inbox-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import { getSubmissionCvFile } from "@/server/queries/admin-submissions";
import { cvUploadBucket } from "@/server/submissions/cv-upload";

/** Long enough to start the download, short enough that a shared link is useless. */
const signedLinkLifetimeInSeconds = 60;

/**
 * Sends the admin to a short-lived download link for an applicant's CV.
 * CVs live in a private bucket; the link is signed with the admin's own
 * session, so the storage access rules decide whether it's allowed.
 */
export async function GET(
  _request: Request,
  { params }: RouteContext<"/admin/submissions/[id]/cv">,
) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!submissionIdRule.safeParse(id).success) notFound();

  const cvFile = await getSubmissionCvFile(admin.userId, id);
  if (!cvFile) notFound();

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.storage
    .from(cvUploadBucket)
    .createSignedUrl(cvFile.storagePath, signedLinkLifetimeInSeconds, {
      download: cvFile.originalFileName,
    });
  if (error || !data) {
    console.error("Could not create a CV download link.", error);
    return new Response("The CV file could not be found.", {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  redirect(data.signedUrl);
}
