import { z } from "zod";

import {
  submissionFormTypeEnum,
  submissionStatusEnum,
} from "@/lib/database/schema/enums";

/*
 * Rules for the admin submissions inbox: the filters in the address bar and
 * the changes admins can make. Shared by the forms and the server actions.
 */

export const submissionIdRule = z.uuid("That submission doesn't exist.");

export const submissionStatusRule = z.enum(submissionStatusEnum.enumValues, {
  error: "Choose a valid status.",
});

export const submissionNoteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, "Write a note before saving.")
    .max(5000, "Notes can be up to 5,000 characters."),
});

/** Turns the inbox's address-bar values into safe filters; bad values are ignored. */
export const submissionFiltersSchema = z.object({
  formType: z
    .enum(submissionFormTypeEnum.enumValues)
    .optional()
    .catch(undefined),
  status: submissionStatusRule.optional().catch(undefined),
  search: z
    .string()
    .trim()
    .max(100)
    .transform((value) => value || undefined)
    .optional()
    .catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).catch(1).default(1),
});

export type SubmissionFilters = z.infer<typeof submissionFiltersSchema>;

/** Reads the filters from Next.js search params (`?type=&status=&q=&page=`). */
export function readSubmissionFilters(
  searchParams: Record<string, string | string[] | undefined>,
): SubmissionFilters {
  const firstValue = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  return submissionFiltersSchema.parse({
    formType: firstValue(searchParams.type),
    status: firstValue(searchParams.status),
    search: firstValue(searchParams.q),
    page: firstValue(searchParams.page),
  });
}

/** Builds an inbox address from filters, leaving out empty ones. */
export function buildSubmissionFiltersQuery(
  filters: Partial<SubmissionFilters>,
): string {
  const query = new URLSearchParams();
  if (filters.formType) query.set("type", filters.formType);
  if (filters.status) query.set("status", filters.status);
  if (filters.search) query.set("q", filters.search);
  if (filters.page && filters.page > 1) query.set("page", String(filters.page));
  const text = query.toString();
  return text ? `?${text}` : "";
}
