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

/*
 * Request Service details. The quote form was redesigned on 2026-11-13: new
 * requests fill the "quote form" columns; requests from before keep their
 * service slug and estimated scope. Every column added or changed then is
 * nullable, so both kinds of row stay valid.
 */
export const serviceRequestDetails = pgTable(
  "service_request_details",
  {
    submissionId: submissionIdColumn(),
    /** Required on the form since 2026-11-13; older requests may lack it. */
    companyName: text("company_name"),
    /** Older requests only: the chosen service or line of business. */
    serviceSlug: text("service_slug"),
    /** Optional on the form since 2026-11-13. */
    industrySlug: text("industry_slug"),
    siteLocation: text("site_location").notNull(),
    /** Older requests only: number of guards or a short description. */
    estimatedScope: text("estimated_scope"),
    preferredStartDate: date("preferred_start_date"),
    /** "Describe your security needs". */
    message: text("message").notNull(),

    // Quote form (2026-11-13). Values are the option ids in
    // config/service-request-options.ts.
    primaryServiceType: text("primary_service_type"),
    officerClassification: text("officer_classification"),
    additionalServices: text("additional_services").array(),
    officersRequired: integer("officers_required"),
    coverageType: text("coverage_type"),
    coverageHours: text("coverage_hours"),
    contractDuration: text("contract_duration"),
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
