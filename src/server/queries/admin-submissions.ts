import "server-only";

import { and, asc, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";

import { runAsSignedInUser } from "@/lib/database/access-roles";
import {
  adminUsers,
  jobApplicationDetails,
  serviceRequestDetails,
  submissionNotes,
  submissions,
  trainingEnquiryDetails,
  type JobApplicationDetails,
  type ServiceRequestDetails,
  type Submission,
  type TrainingEnquiryDetails,
} from "@/lib/database/schema";
import type { SubmissionFilters } from "@/lib/validation/submission-inbox-schemas";

/*
 * Submission queries for the admin inbox. They run as the signed-in admin, so
 * the database's Row Level Security confirms they're allowed to read them.
 */

export const submissionsPerPage = 25;

/** The most rows one CSV export will contain. */
export const maximumExportRows = 5000;

function filterConditions(filters: Omit<SubmissionFilters, "page">) {
  const conditions: SQL[] = [];
  if (filters.formType)
    conditions.push(eq(submissions.formType, filters.formType));
  if (filters.status) conditions.push(eq(submissions.status, filters.status));
  if (filters.search) {
    const pattern = `%${filters.search.replace(/[%_\\]/g, "\\$&")}%`;
    conditions.push(
      or(
        ilike(submissions.fullName, pattern),
        ilike(submissions.email, pattern),
        ilike(submissions.phone, pattern),
      ) as SQL,
    );
  }
  return conditions.length > 0 ? and(...conditions) : undefined;
}

export type SubmissionListItem = Pick<
  Submission,
  "id" | "formType" | "status" | "fullName" | "email" | "phone" | "createdAt"
>;

export async function listAdminSubmissions(
  adminUserId: string,
  filters: SubmissionFilters,
): Promise<{ submissions: SubmissionListItem[]; totalCount: number }> {
  const where = filterConditions(filters);

  return runAsSignedInUser(adminUserId, async (transaction) => {
    const [{ total }] = await transaction
      .select({ total: count() })
      .from(submissions)
      .where(where);

    const rows = await transaction
      .select({
        id: submissions.id,
        formType: submissions.formType,
        status: submissions.status,
        fullName: submissions.fullName,
        email: submissions.email,
        phone: submissions.phone,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .where(where)
      .orderBy(desc(submissions.createdAt))
      .limit(submissionsPerPage)
      .offset((filters.page - 1) * submissionsPerPage);

    return { submissions: rows, totalCount: total };
  });
}

export type SubmissionNoteWithAuthor = {
  id: string;
  body: string;
  createdAt: Date;
  /** Null when the admin who wrote it has since been removed. */
  authorName: string | null;
};

export type AdminSubmissionDetail = Submission & {
  serviceRequest: ServiceRequestDetails | null;
  jobApplication: JobApplicationDetails | null;
  trainingEnquiry: TrainingEnquiryDetails | null;
  notes: SubmissionNoteWithAuthor[];
};

/** One submission with its form-specific details and internal notes. */
export async function getAdminSubmission(
  adminUserId: string,
  submissionId: string,
): Promise<AdminSubmissionDetail | null> {
  return runAsSignedInUser(adminUserId, async (transaction) => {
    const [submission] = await transaction
      .select()
      .from(submissions)
      .where(eq(submissions.id, submissionId))
      .limit(1);
    if (!submission) return null;

    const [[serviceRequest], [jobApplication], [trainingEnquiry], notes] =
      await Promise.all([
        transaction
          .select()
          .from(serviceRequestDetails)
          .where(eq(serviceRequestDetails.submissionId, submissionId)),
        transaction
          .select()
          .from(jobApplicationDetails)
          .where(eq(jobApplicationDetails.submissionId, submissionId)),
        transaction
          .select()
          .from(trainingEnquiryDetails)
          .where(eq(trainingEnquiryDetails.submissionId, submissionId)),
        transaction
          .select({
            id: submissionNotes.id,
            body: submissionNotes.body,
            createdAt: submissionNotes.createdAt,
            authorName: adminUsers.displayName,
          })
          .from(submissionNotes)
          .leftJoin(
            adminUsers,
            eq(adminUsers.userId, submissionNotes.authorUserId),
          )
          .where(eq(submissionNotes.submissionId, submissionId))
          .orderBy(asc(submissionNotes.createdAt)),
      ]);

    return {
      ...submission,
      serviceRequest: serviceRequest ?? null,
      jobApplication: jobApplication ?? null,
      trainingEnquiry: trainingEnquiry ?? null,
      notes,
    };
  });
}

/** Where a job applicant's CV is stored, for the download link. */
export async function getSubmissionCvFile(
  adminUserId: string,
  submissionId: string,
): Promise<{ storagePath: string; originalFileName: string } | null> {
  return runAsSignedInUser(adminUserId, async (transaction) => {
    const [cvFile] = await transaction
      .select({
        storagePath: jobApplicationDetails.cvStoragePath,
        originalFileName: jobApplicationDetails.cvOriginalFileName,
      })
      .from(jobApplicationDetails)
      .where(eq(jobApplicationDetails.submissionId, submissionId))
      .limit(1);
    return cvFile ?? null;
  });
}

export type SubmissionExportRow = Submission & {
  serviceRequest: ServiceRequestDetails | null;
  jobApplication: JobApplicationDetails | null;
  trainingEnquiry: TrainingEnquiryDetails | null;
};

/** Every submission matching the filters, newest first, for the CSV export. */
export async function listSubmissionsForExport(
  adminUserId: string,
  filters: Omit<SubmissionFilters, "page">,
): Promise<SubmissionExportRow[]> {
  return runAsSignedInUser(adminUserId, async (transaction) => {
    const rows = await transaction
      .select({
        submission: submissions,
        serviceRequest: serviceRequestDetails,
        jobApplication: jobApplicationDetails,
        trainingEnquiry: trainingEnquiryDetails,
      })
      .from(submissions)
      .leftJoin(
        serviceRequestDetails,
        eq(serviceRequestDetails.submissionId, submissions.id),
      )
      .leftJoin(
        jobApplicationDetails,
        eq(jobApplicationDetails.submissionId, submissions.id),
      )
      .leftJoin(
        trainingEnquiryDetails,
        eq(trainingEnquiryDetails.submissionId, submissions.id),
      )
      .where(filterConditions(filters))
      .orderBy(desc(submissions.createdAt))
      .limit(maximumExportRows);

    return rows.map((row) => ({
      ...row.submission,
      serviceRequest: row.serviceRequest,
      jobApplication: row.jobApplication,
      trainingEnquiry: row.trainingEnquiry,
    }));
  });
}
