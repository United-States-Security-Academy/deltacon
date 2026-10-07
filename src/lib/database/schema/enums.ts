import { pgEnum } from "drizzle-orm/pg-core";

export const submissionFormTypeEnum = pgEnum("submission_form_type", [
  "service_request",
  "job_application",
  "training_enquiry",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "new",
  "in_progress",
  "contacted",
  "closed",
]);

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "scheduled",
]);

export const postCategoryEnum = pgEnum("post_category", [
  "blog",
  "news",
  "press",
]);

export type SubmissionFormType =
  (typeof submissionFormTypeEnum.enumValues)[number];
export type SubmissionStatus = (typeof submissionStatusEnum.enumValues)[number];
export type PostStatus = (typeof postStatusEnum.enumValues)[number];
export type PostCategory = (typeof postCategoryEnum.enumValues)[number];
