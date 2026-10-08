import type { JSONContent } from "@tiptap/core";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PostEditor } from "@/components/admin/posts/post-editor";
import { requireAdmin } from "@/server/auth/require-admin";
import { getAdminPost, listTagNames } from "@/server/queries/admin-posts";

export const metadata: Metadata = { title: "Edit post" };

const uuidPattern = /^[0-9a-f-]{36}$/i;

export default async function EditPostPage({
  params,
}: PageProps<"/admin/posts/[id]/edit">) {
  const admin = await requireAdmin();
  const { id } = await params;
  if (!uuidPattern.test(id)) notFound();

  const [post, existingTagNames] = await Promise.all([
    getAdminPost(admin.userId, id),
    listTagNames(admin.userId),
  ]);
  if (!post) notFound();

  return (
    <>
      <Link
        href="/admin/posts"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-navy-700 hover:text-navy-950"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        All posts
      </Link>
      <h1 className="sr-only">Edit post: {post.title}</h1>
      <PostEditor
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          category: post.category,
          tagNames: post.tagNames,
          coverImagePath: post.coverImagePath,
          coverImageAltText: post.coverImageAltText ?? "",
          seoTitle: post.seoTitle ?? "",
          metaDescription: post.metaDescription ?? "",
          contentJson: post.contentJson as JSONContent,
          status: post.status,
          publishedAt: post.publishedAt?.toISOString() ?? null,
        }}
        existingTagNames={existingTagNames}
      />
    </>
  );
}
