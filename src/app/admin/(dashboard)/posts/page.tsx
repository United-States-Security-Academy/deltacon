import { FilePlus2, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { formControlClassName } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { postCategoryLabels } from "@/config/post-categories";
import type { PostStatus } from "@/lib/database/schema/enums";
import {
  formatAdminDate,
  postStatusAppearance,
} from "@/lib/submissions/submission-status";
import { cn } from "@/lib/utils";
import { createPost } from "@/server/actions/admin/post-actions";
import { requireAdmin } from "@/server/auth/require-admin";
import { listAdminPosts } from "@/server/queries/admin-posts";

export const metadata: Metadata = { title: "Posts" };

const statusFilters: { label: string; status?: PostStatus }[] = [
  { label: "All" },
  { label: "Drafts", status: "draft" },
  { label: "Scheduled", status: "scheduled" },
  { label: "Published", status: "published" },
];

export default async function AdminPostsPage({
  searchParams,
}: PageProps<"/admin/posts">) {
  const admin = await requireAdmin();
  const { status, q } = await searchParams;
  const activeStatus = statusFilters.find(
    (filter) => filter.status === status,
  )?.status;
  const search =
    typeof q === "string" && q.trim() ? q.trim().slice(0, 100) : undefined;
  const posts = await listAdminPosts(admin.userId, {
    status: activeStatus,
    search,
  });
  const now = new Date();

  return (
    <>
      <AdminPageHeading
        title="Posts"
        description="Write and manage blog posts, news and press releases."
        actions={
          <form action={createPost}>
            <Button type="submit" variant="accent" size="lg">
              <FilePlus2 aria-hidden="true" />
              New post
            </Button>
          </form>
        }
      />

      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <nav aria-label="Filter by status">
          <ul className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => {
              const isActive = filter.status === activeStatus;
              const href = filter.status
                ? `/admin/posts?status=${filter.status}`
                : "/admin/posts";
              return (
                <li key={filter.label}>
                  <Link
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-block rounded-full border px-4 py-1.5 text-sm font-semibold",
                      isActive
                        ? "border-navy-900 bg-navy-900 text-gold-300"
                        : "border-border bg-white text-navy-900 hover:border-gold-500",
                    )}
                  >
                    {filter.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <form
          method="get"
          role="search"
          className="flex w-full gap-2 sm:max-w-sm"
        >
          {activeStatus && (
            <input type="hidden" name="status" value={activeStatus} />
          )}
          <label htmlFor="post-search" className="sr-only">
            Search posts
          </label>
          <input
            id="post-search"
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Search by title or address"
            className={formControlClassName}
          />
          <Button type="submit" variant="default" size="lg" className="h-11">
            <Search aria-hidden="true" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      <section
        aria-label="Posts"
        className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
      >
        {posts.length === 0 ? (
          <p className="px-5 py-12 text-center text-muted-foreground">
            {search || activeStatus
              ? "No posts match these filters."
              : "No posts yet. Press “New post” to write your first one."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper text-xs tracking-wider text-navy-700 uppercase">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Title
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Publish date
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Last edited
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map((post) => {
                  // A scheduled post whose date has passed is already live.
                  const isLive =
                    post.status === "published" ||
                    (post.status === "scheduled" &&
                      post.publishedAt !== null &&
                      post.publishedAt <= now);
                  const appearance =
                    postStatusAppearance[isLive ? "published" : post.status];
                  return (
                    <tr key={post.id} className="hover:bg-paper/60">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
                          className="font-semibold text-navy-900 hover:text-gold-700 hover:underline"
                        >
                          {post.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          /blog/{post.slug}
                        </p>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={cn(
                            "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold",
                            appearance.badgeClassName,
                          )}
                        >
                          {appearance.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-navy-800">
                        {postCategoryLabels[post.category]}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {post.publishedAt
                          ? formatAdminDate(post.publishedAt)
                          : "—"}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">
                        {formatAdminDate(post.updatedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
