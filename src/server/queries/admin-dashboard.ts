import "server-only";

import { count, desc, eq, gte } from "drizzle-orm";

import { runAsSignedInUser } from "@/lib/database/access-roles";
import {
  posts,
  submissionFormTypeEnum,
  submissions,
  type PostStatus,
  type SubmissionFormType,
  type SubmissionStatus,
} from "@/lib/database/schema";

export type DashboardSummary = {
  newSubmissionsByFormType: Record<SubmissionFormType, number>;
  submissionsInLast30Days: number;
  recentSubmissions: {
    id: string;
    formType: SubmissionFormType;
    fullName: string;
    email: string;
    status: SubmissionStatus;
    createdAt: Date;
  }[];
  recentPosts: {
    id: string;
    title: string;
    status: PostStatus;
    updatedAt: Date;
  }[];
};

/**
 * Everything the admin dashboard shows, read as the signed-in admin so the
 * database's Row Level Security confirms they're allowed to see it.
 */
export async function getDashboardSummary(
  adminUserId: string,
): Promise<DashboardSummary> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return runAsSignedInUser(adminUserId, async (transaction) => {
    const newSubmissionCounts = await transaction
      .select({ formType: submissions.formType, total: count() })
      .from(submissions)
      .where(eq(submissions.status, "new"))
      .groupBy(submissions.formType);

    const [{ total: submissionsInLast30Days }] = await transaction
      .select({ total: count() })
      .from(submissions)
      .where(gte(submissions.createdAt, thirtyDaysAgo));

    const recentSubmissions = await transaction
      .select({
        id: submissions.id,
        formType: submissions.formType,
        fullName: submissions.fullName,
        email: submissions.email,
        status: submissions.status,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .orderBy(desc(submissions.createdAt))
      .limit(8);

    const recentPosts = await transaction
      .select({
        id: posts.id,
        title: posts.title,
        status: posts.status,
        updatedAt: posts.updatedAt,
      })
      .from(posts)
      .orderBy(desc(posts.updatedAt))
      .limit(5);

    const newSubmissionsByFormType = Object.fromEntries(
      submissionFormTypeEnum.enumValues.map((formType) => [
        formType,
        newSubmissionCounts.find((row) => row.formType === formType)?.total ??
          0,
      ]),
    ) as Record<SubmissionFormType, number>;

    return {
      newSubmissionsByFormType,
      submissionsInLast30Days,
      recentSubmissions,
      recentPosts,
    };
  });
}
