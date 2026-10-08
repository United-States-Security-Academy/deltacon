import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { formControlClassName } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
  submissionFormTypeEnum,
  submissionStatusEnum,
} from "@/lib/database/schema/enums";
import {
  formatAdminDate,
  submissionStatusAppearance,
} from "@/lib/submissions/submission-status";
import {
  submissionFormTypeLabels,
  submissionFormTypePluralLabels,
} from "@/lib/submissions/submission-summary";
import { cn } from "@/lib/utils";
import {
  buildSubmissionFiltersQuery,
  readSubmissionFilters,
} from "@/lib/validation/submission-inbox-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import {
  listAdminSubmissions,
  maximumExportRows,
  submissionsPerPage,
} from "@/server/queries/admin-submissions";

export const metadata: Metadata = { title: "Submissions" };

export default async function AdminSubmissionsPage({
  searchParams,
}: PageProps<"/admin/submissions">) {
  const admin = await requireAdmin();
  const filters = readSubmissionFilters(await searchParams);
  const { submissions, totalCount } = await listAdminSubmissions(
    admin.userId,
    filters,
  );

  const pageCount = Math.max(1, Math.ceil(totalCount / submissionsPerPage));
  const firstShown =
    totalCount === 0 ? 0 : (filters.page - 1) * submissionsPerPage + 1;
  const lastShown = Math.min(filters.page * submissionsPerPage, totalCount);
  const hasFilters = Boolean(
    filters.formType || filters.status || filters.search,
  );
  const exportQuery = buildSubmissionFiltersQuery({ ...filters, page: 1 });

  const formTypeTabs = [
    { label: "All forms", formType: undefined },
    ...submissionFormTypeEnum.enumValues.map((formType) => ({
      label: submissionFormTypePluralLabels[formType],
      formType,
    })),
  ];

  return (
    <>
      <AdminPageHeading
        title="Submissions"
        description="Service requests, job applications and training enquiries from the website."
        actions={
          totalCount > 0 && (
            <Button asChild variant="outline" size="lg">
              <a href={`/admin/submissions/export${exportQuery}`} download>
                <Download aria-hidden="true" />
                Export CSV
              </a>
            </Button>
          )
        }
      />

      <nav aria-label="Filter by form" className="mb-4">
        <ul className="flex flex-wrap gap-2">
          {formTypeTabs.map((tab) => {
            const isActive = tab.formType === filters.formType;
            return (
              <li key={tab.label}>
                <Link
                  href={`/admin/submissions${buildSubmissionFiltersQuery({ ...filters, formType: tab.formType, page: 1 })}`}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "inline-block rounded-full border px-4 py-1.5 text-sm font-semibold",
                    isActive
                      ? "border-navy-900 bg-navy-900 text-gold-300"
                      : "border-border bg-white text-navy-900 hover:border-gold-500",
                  )}
                >
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <form
        method="get"
        role="search"
        className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        {filters.formType && (
          <input type="hidden" name="type" value={filters.formType} />
        )}
        <div className="flex flex-col gap-1 sm:w-48">
          <label
            htmlFor="submission-status-filter"
            className="text-sm font-semibold text-navy-900"
          >
            Status
          </label>
          <select
            id="submission-status-filter"
            name="status"
            defaultValue={filters.status ?? ""}
            className={cn(formControlClassName, "pr-8")}
          >
            <option value="">Any status</option>
            {submissionStatusEnum.enumValues.map((status) => (
              <option key={status} value={status}>
                {submissionStatusAppearance[status].label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-1 flex-col gap-1 sm:max-w-sm">
          <label
            htmlFor="submission-search"
            className="text-sm font-semibold text-navy-900"
          >
            Name, email or phone
          </label>
          <input
            id="submission-search"
            type="search"
            name="q"
            defaultValue={filters.search}
            className={formControlClassName}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" size="lg" className="h-11">
            <Search aria-hidden="true" />
            Filter
          </Button>
          {hasFilters && (
            <Button asChild variant="ghost" size="lg" className="h-11">
              <Link href="/admin/submissions">Clear</Link>
            </Button>
          )}
        </div>
      </form>

      <section
        aria-label="Submissions"
        className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
      >
        {submissions.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted-foreground">
            {hasFilters
              ? "No submissions match these filters."
              : "No submissions yet. Enquiries and applications from the website will appear here."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper text-xs tracking-wider text-navy-700 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Name
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Form
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Phone
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Received
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {submissions.map((submission) => {
                  const status = submissionStatusAppearance[submission.status];
                  return (
                    <tr
                      key={submission.id}
                      className={cn(
                        "hover:bg-paper/60",
                        submission.status === "new" && "bg-gold-300/10",
                      )}
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/submissions/${submission.id}`}
                          className={cn(
                            "text-navy-900 hover:text-gold-700 hover:underline",
                            submission.status === "new"
                              ? "font-bold"
                              : "font-semibold",
                          )}
                        >
                          {submission.fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {submission.email}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-navy-800">
                        {submissionFormTypeLabels[submission.formType]}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-navy-800">
                        {submission.phone}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
                            status.badgeClassName,
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {formatAdminDate(submission.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {totalCount > 0 && (
        <div className="mt-4 flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>
            Showing {firstShown}–{lastShown} of {totalCount}
            {totalCount > maximumExportRows &&
              ` · CSV exports include the newest ${maximumExportRows.toLocaleString("en-US")}`}
          </p>
          {pageCount > 1 && (
            <nav aria-label="Pages" className="flex items-center gap-2">
              {filters.page > 1 ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/admin/submissions${buildSubmissionFiltersQuery({ ...filters, page: filters.page - 1 })}`}
                  >
                    <ChevronLeft aria-hidden="true" />
                    Previous
                  </Link>
                </Button>
              ) : null}
              <span aria-current="page">
                Page {filters.page} of {pageCount}
              </span>
              {filters.page < pageCount ? (
                <Button asChild variant="outline" size="sm">
                  <Link
                    href={`/admin/submissions${buildSubmissionFiltersQuery({ ...filters, page: filters.page + 1 })}`}
                  >
                    Next
                    <ChevronRight aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </nav>
          )}
        </div>
      )}
    </>
  );
}
