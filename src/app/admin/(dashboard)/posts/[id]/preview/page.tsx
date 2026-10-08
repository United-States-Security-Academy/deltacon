import { Eye, Pencil } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogPostArticle } from "@/components/blog/blog-post-article";
import { absoluteUrl } from "@/lib/site-url";
import { requireAdmin } from "@/server/auth/require-admin";
import { getAdminPost } from "@/server/queries/admin-posts";

export const metadata: Metadata = { title: "Preview post" };

const uuidPattern = /^[0-9a-f-]{36}$/i;

/** Shows a post exactly as visitors will see it, including drafts. */
export default async function PreviewPostPage({
  params,
}: PageProps<"/admin/posts/[id]/preview">) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();
  const post = await getAdminPost(admin.userId, id);
  if (!post) notFound();

  return (
    <div className="-mx-4 -my-8 sm:-mx-8 lg:-mx-10">
      <div
        role="status"
        className="flex flex-wrap items-center justify-between gap-3 bg-gold-500 px-4 py-3 text-sm font-semibold text-navy-950 sm:px-8"
      >
        <span className="flex items-center gap-2">
          <Eye aria-hidden="true" className="size-4" />
          Preview: this is how the post will look on the website.
        </span>
        <Link
          href={`/admin/posts/${post.id}/edit`}
          className="inline-flex items-center gap-1.5 underline"
        >
          <Pencil aria-hidden="true" className="size-4" />
          Back to editing
        </Link>
      </div>
      <div className="bg-white">
        <BlogPostArticle
          post={{
            title: post.title,
            excerpt: post.excerpt,
            category: post.category,
            coverImagePath: post.coverImagePath,
            coverImageAltText: post.coverImageAltText,
            publishedAt: (post.publishedAt ?? new Date()).toISOString(),
            readingTimeInMinutes: post.readingTimeInMinutes,
            authorName: post.authorName,
            contentHtml: post.contentHtml,
            tagNames: post.tagNames,
          }}
          shareUrl={absoluteUrl(`/blog/${post.slug}`)}
        />
      </div>
    </div>
  );
}
