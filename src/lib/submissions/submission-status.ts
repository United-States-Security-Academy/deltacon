import type { PostStatus, SubmissionStatus } from "@/lib/database/schema/enums";

/** How each submission status is labelled and coloured in the admin. */
export const submissionStatusAppearance: Record<
  SubmissionStatus,
  { label: string; badgeClassName: string }
> = {
  new: { label: "New", badgeClassName: "bg-gold-500 text-navy-950" },
  in_progress: {
    label: "In progress",
    badgeClassName: "bg-navy-100 text-navy-900",
  },
  contacted: {
    label: "Contacted",
    badgeClassName: "bg-green-100 text-green-800",
  },
  closed: { label: "Closed", badgeClassName: "bg-gray-200 text-gray-700" },
};

export const postStatusAppearance: Record<
  PostStatus,
  { label: string; badgeClassName: string }
> = {
  draft: { label: "Draft", badgeClassName: "bg-gray-200 text-gray-700" },
  scheduled: {
    label: "Scheduled",
    badgeClassName: "bg-navy-100 text-navy-900",
  },
  published: {
    label: "Published",
    badgeClassName: "bg-green-100 text-green-800",
  },
};

const adminDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Chicago",
});

/** Dates in the admin are shown in Texas (Central) time. */
export function formatAdminDate(date: Date): string {
  return adminDateFormat.format(date);
}
