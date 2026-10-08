import { ArrowLeft, FileDown, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeleteSubmissionButton } from "@/components/admin/submissions/delete-submission-button";
import { SubmissionNoteForm } from "@/components/admin/submissions/submission-note-form";
import { SubmissionStatusPicker } from "@/components/admin/submissions/submission-status-picker";
import { Button } from "@/components/ui/button";
import {
  formatAdminDate,
  submissionStatusAppearance,
} from "@/lib/submissions/submission-status";
import {
  submissionFormTypeLabels,
  submissionFormTypePluralLabels,
  summariseJobApplication,
  summariseServiceRequest,
  summariseTrainingEnquiry,
  type SubmissionSummaryRow,
} from "@/lib/submissions/submission-summary";
import { cn } from "@/lib/utils";
import { submissionIdRule } from "@/lib/validation/submission-inbox-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import {
  getAdminSubmission,
  type AdminSubmissionDetail,
} from "@/server/queries/admin-submissions";

export const metadata: Metadata = { title: "Submission" };

/** The form-specific answers, without the contact details shown separately. */
function answerRows(submission: AdminSubmissionDetail): SubmissionSummaryRow[] {
  const contact = {
    fullName: submission.fullName,
    email: submission.email,
    phone: submission.phone,
  };
  let rows: SubmissionSummaryRow[] = [];
  if (submission.serviceRequest) {
    rows = summariseServiceRequest({
      ...contact,
      ...submission.serviceRequest,
    });
  } else if (submission.jobApplication) {
    rows = summariseJobApplication({
      ...contact,
      ...submission.jobApplication,
    });
  } else if (submission.trainingEnquiry) {
    rows = summariseTrainingEnquiry({
      ...contact,
      ...submission.trainingEnquiry,
    });
  }
  const shownElsewhere = new Set(["Full name", "Email", "Phone", "CV"]);
  return rows.filter((row) => !shownElsewhere.has(row.label));
}

function formatFileSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default async function SubmissionDetailPage({
  params,
}: PageProps<"/admin/submissions/[id]">) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!submissionIdRule.safeParse(id).success) notFound();
  const submission = await getAdminSubmission(admin.userId, id);
  if (!submission) notFound();

  const status = submissionStatusAppearance[submission.status];
  const formLabel = submissionFormTypeLabels[submission.formType];
  const cvFile = submission.jobApplication;

  return (
    <>
      <Link
        href={`/admin/submissions?type=${submission.formType}`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-950"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All {submissionFormTypePluralLabels[submission.formType].toLowerCase()}
      </Link>

      <header className="mb-8 flex flex-col gap-2">
        <p className="text-sm font-semibold tracking-wider text-gold-700 uppercase">
          {formLabel}
        </p>
        <h1 className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl">
          {submission.fullName}
        </h1>
        <p className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>Received {formatAdminDate(submission.createdAt)}</span>
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
              status.badgeClassName,
            )}
          >
            {status.label}
          </span>
        </p>
      </header>

      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        <div className="flex flex-col gap-8">
          <section
            aria-labelledby="contact-heading"
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <h2
              id="contact-heading"
              className="mb-4 text-lg font-bold text-navy-900 uppercase"
            >
              Contact
            </h2>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={`mailto:${submission.email}`}>
                  <Mail aria-hidden="true" />
                  {submission.email}
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`tel:${submission.phone.replace(/[^\d+]/g, "")}`}>
                  <Phone aria-hidden="true" />
                  {submission.phone}
                </a>
              </Button>
            </div>
          </section>

          <section
            aria-labelledby="details-heading"
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <h2
              id="details-heading"
              className="mb-4 text-lg font-bold text-navy-900 uppercase"
            >
              Details
            </h2>
            <dl className="divide-y divide-border">
              {answerRows(submission).map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4"
                >
                  <dt className="text-sm font-semibold text-navy-700">
                    {row.label}
                  </dt>
                  <dd className="break-words whitespace-pre-line text-charcoal">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            {cvFile && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-paper p-4">
                <Button asChild variant="accent">
                  <a href={`/admin/submissions/${submission.id}/cv`}>
                    <FileDown aria-hidden="true" />
                    Download CV
                  </a>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {cvFile.cvOriginalFileName} (
                  {formatFileSize(cvFile.cvFileSizeInBytes)})
                </span>
              </div>
            )}
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section
            aria-label="Manage"
            className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <SubmissionStatusPicker
              submissionId={submission.id}
              currentStatus={submission.status}
            />
          </section>

          <section
            aria-labelledby="notes-heading"
            className="rounded-xl border border-border bg-white p-5 shadow-sm"
          >
            <h2
              id="notes-heading"
              className="mb-1 text-lg font-bold text-navy-900 uppercase"
            >
              Internal notes
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Only admins can see these.
            </p>
            {submission.notes.length > 0 && (
              <ol className="mb-6 flex flex-col gap-3">
                {submission.notes.map((note) => (
                  <li key={note.id} className="rounded-lg bg-paper p-3">
                    <p className="break-words whitespace-pre-line text-charcoal">
                      {note.body}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {note.authorName ?? "A former admin"} ·{" "}
                      {formatAdminDate(note.createdAt)}
                    </p>
                  </li>
                ))}
              </ol>
            )}
            <SubmissionNoteForm submissionId={submission.id} />
          </section>

          <section
            aria-label="Delete"
            className="rounded-xl border border-flag-red/30 bg-white p-5 shadow-sm"
          >
            <DeleteSubmissionButton
              submissionId={submission.id}
              personName={submission.fullName}
              hasCv={Boolean(cvFile)}
            />
          </section>
        </div>
      </div>
    </>
  );
}
