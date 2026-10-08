import {
  BriefcaseBusiness,
  ClipboardList,
  GraduationCap,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import type { SubmissionFormType } from "@/lib/database/schema/enums";
import {
  formatAdminDate,
  postStatusAppearance,
  submissionStatusAppearance,
} from "@/lib/submissions/submission-status";
import { submissionFormTypeLabels } from "@/lib/submissions/submission-summary";
import { cn } from "@/lib/utils";
import { requireAdmin } from "@/server/auth/require-admin";
import { getDashboardSummary } from "@/server/queries/admin-dashboard";

export const metadata: Metadata = { title: "Dashboard" };

const formTypeCards: {
  formType: SubmissionFormType;
  label: string;
  icon: LucideIcon;
}[] = [
  {
    formType: "service_request",
    label: "New service requests",
    icon: ClipboardList,
  },
  {
    formType: "job_application",
    label: "New job applications",
    icon: BriefcaseBusiness,
  },
  {
    formType: "training_enquiry",
    label: "New training enquiries",
    icon: GraduationCap,
  },
];

function StatusBadge({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  const summary = await getDashboardSummary(admin.userId);
  const firstName = admin.displayName.split(" ")[0] ?? admin.displayName;

  return (
    <>
      <AdminPageHeading
        title={`Welcome, ${firstName}`}
        description="Here's what's happening on the website."
      />

      {/* Counts */}
      <section aria-label="Submission counts" className="mb-10">
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {formTypeCards.map((card) => {
            const Icon = card.icon;
            const newCount = summary.newSubmissionsByFormType[card.formType];
            return (
              <li
                key={card.formType}
                className="relative flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm transition-colors hover:border-gold-500"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <p className="font-heading text-3xl font-bold text-navy-900">
                    {newCount}
                  </p>
                  <Link
                    href={`/admin/submissions?type=${card.formType}&status=new`}
                    className="text-sm text-muted-foreground after:absolute after:inset-0 hover:text-navy-900 hover:underline"
                  >
                    {card.label}
                  </Link>
                </div>
              </li>
            );
          })}
          <li className="flex items-center gap-4 rounded-xl border border-border bg-white p-5 shadow-sm">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
              <Inbox aria-hidden="true" className="size-6" />
            </span>
            <div>
              <p className="font-heading text-3xl font-bold text-navy-900">
                {summary.submissionsInLast30Days}
              </p>
              <p className="text-sm text-muted-foreground">
                Submissions in the last 30 days
              </p>
            </div>
          </li>
        </ul>
      </section>

      <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
        {/* Recent submissions */}
        <section
          aria-labelledby="recent-submissions-heading"
          className="rounded-xl border border-border bg-white shadow-sm"
        >
          <h2
            id="recent-submissions-heading"
            className="border-b border-border px-5 py-4 text-lg font-bold text-navy-900 uppercase"
          >
            Recent submissions
          </h2>
          {summary.recentSubmissions.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground">
              No submissions yet. New enquiries and applications from the
              website will appear here.
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
                      Status
                    </th>
                    <th scope="col" className="px-5 py-3 font-semibold">
                      Received
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {summary.recentSubmissions.map((submission) => {
                    const status =
                      submissionStatusAppearance[submission.status];
                    return (
                      <tr key={submission.id}>
                        <td className="px-5 py-3">
                          <Link
                            href={`/admin/submissions/${submission.id}`}
                            className="font-medium text-navy-900 hover:text-gold-700 hover:underline"
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
                        <td className="px-5 py-3">
                          <StatusBadge
                            label={status.label}
                            className={status.badgeClassName}
                          />
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

        {/* Recent posts */}
        <section
          aria-labelledby="recent-posts-heading"
          className="rounded-xl border border-border bg-white shadow-sm"
        >
          <h2
            id="recent-posts-heading"
            className="border-b border-border px-5 py-4 text-lg font-bold text-navy-900 uppercase"
          >
            Recent posts
          </h2>
          {summary.recentPosts.length === 0 ? (
            <p className="px-5 py-8 text-center text-muted-foreground">
              No blog posts yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {summary.recentPosts.map((post) => {
                const status = postStatusAppearance[post.status];
                return (
                  <li
                    key={post.id}
                    className="flex items-center justify-between gap-3 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="block truncate font-medium text-navy-900 hover:text-gold-700 hover:underline"
                      >
                        {post.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Updated {formatAdminDate(post.updatedAt)}
                      </p>
                    </div>
                    <StatusBadge
                      label={status.label}
                      className={status.badgeClassName}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
