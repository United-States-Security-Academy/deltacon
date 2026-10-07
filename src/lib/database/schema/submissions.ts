import { sql } from "drizzle-orm";
import {
  date,
  index,
  integer,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { adminFullAccessPolicy, everyone } from "./access-rules";
import { adminUsers } from "./admin-users";
import { submissionFormTypeEnum, submissionStatusEnum } from "./enums";

/**
 * Every form submission has one row here with the fields all forms share,
 * plus one row in the matching details table below.
 *
 * Visitors may only INSERT. They cannot read anything back, so the server
 * generates the id before inserting instead of relying on RETURNING.
 */
export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formType: submissionFormTypeEnum("form_type").notNull(),
    status: submissionStatusEnum("status").notNull().default("new"),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    /** One-way hash of the visitor's IP address, kept for abuse checks only. */
    ipAddressHash: text("ip_address_hash"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("submissions_inbox_index").on(
      table.formType,
      table.status,
      table.createdAt.desc(),
    ),
    pgPolicy("visitors can create new submissions", {
      for: "insert",
      to: everyone,
      withCheck: sql`${table.status} = 'new'`,
    }),
    adminFullAccessPolicy("submissions"),
  ],
);

function submissionIdColumn() {
  return uuid("submission_id")
    .primaryKey()
    .references(() => submissions.id, { onDelete: "cascade" });
}

function visitorInsertPolicy(tableName: string) {
  return pgPolicy(`visitors can create ${tableName}`, {
    for: "insert",
    to: everyone,
    withCheck: sql`true`,
  });
}

export const serviceRequestDetails = pgTable(
  "service_request_details",
  {
    submissionId: submissionIdColumn(),
    companyName: text("company_name"),
    serviceSlug: text("service_slug").notNull(),
    industrySlug: text("industry_slug").notNull(),
    siteLocation: text("site_location").notNull(),
    /** Number of guards needed or a short description of the scope. */
    estimatedScope: text("estimated_scope").notNull(),
    preferredStartDate: date("preferred_start_date"),
    message: text("message").notNull(),
  },
  () => [
    visitorInsertPolicy("service request details"),
    adminFullAccessPolicy("service request details"),
  ],
);

export const jobApplicationDetails = pgTable(
  "job_application_details",
  {
    submissionId: submissionIdColumn(),
    positionSlug: text("position_slug").notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    location: text("location").notNull(),
    availability: text("availability").notNull(),
    coverNote: text("cover_note").notNull(),
    /** Path of the CV inside the private "cv-uploads" storage bucket. */
    // Unique so one upload ticket can never be attached to two applications.
    cvStoragePath: text("cv_storage_path").notNull().unique(),
    cvOriginalFileName: text("cv_original_file_name").notNull(),
    cvFileSizeInBytes: integer("cv_file_size_in_bytes").notNull(),
  },
  () => [
    visitorInsertPolicy("job application details"),
    adminFullAccessPolicy("job application details"),
  ],
);

export const trainingEnquiryDetails = pgTable(
  "training_enquiry_details",
  {
    submissionId: submissionIdColumn(),
    courseSlug: text("course_slug").notNull(),
    numberOfTrainees: integer("number_of_trainees").notNull(),
    message: text("message").notNull(),
  },
  () => [
    visitorInsertPolicy("training enquiry details"),
    adminFullAccessPolicy("training enquiry details"),
  ],
);

/** Internal notes written by admins. Never visible to the public. */
export const submissionNotes = pgTable(
  "submission_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submissionId: uuid("submission_id")
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    authorUserId: uuid("author_user_id").references(() => adminUsers.userId, {
      onDelete: "set null",
    }),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("submission_notes_by_submission_index").on(
      table.submissionId,
      table.createdAt,
    ),
    adminFullAccessPolicy("submission notes"),
  ],
);

export type Submission = typeof submissions.$inferSelect;
export type ServiceRequestDetails = typeof serviceRequestDetails.$inferSelect;
export type JobApplicationDetails = typeof jobApplicationDetails.$inferSelect;
export type TrainingEnquiryDetails = typeof trainingEnquiryDetails.$inferSelect;
export type SubmissionNote = typeof submissionNotes.$inferSelect;
