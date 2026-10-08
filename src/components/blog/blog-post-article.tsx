import { CalendarDays, Clock, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { formatPublishedDate } from "@/components/blog/post-card";
import { ShareButtons } from "@/components/blog/share-buttons";
import { Breadcrumbs } from "@/components/sections/breadcrumbs";
import { postCategoryLabels } from "@/config/post-categories";
import type { PostCategory } from "@/lib/database/schema/enums";
import { getPublicMediaUrl } from "@/lib/storage/public-media";

export type BlogPostArticleData = {
  title: string;
  excerpt: string;
  category: PostCategory;
  coverImagePath: string | null;
  coverImageAltText: string | null;
  /** ISO date. */
  publishedAt: string;
  readingTimeInMinutes: number;
  authorName: string;
  /** Sanitised on the server when the post was saved. */
  contentHtml: string;
  tagNames: string[];
};

/**
 * A full blog post: title area, cover image, content, tags and sharing.
 * Used by the public post page and by the admin preview, so the preview
 * always matches what visitors will see.
 */
export function BlogPostArticle({
  post,
  shareUrl,
}: {
  post: BlogPostArticleData;
  shareUrl: string;
}) {
  return (
    <article>
      <header className="bg-navy-900 security-pattern text-white">
        <div className="hero-entrance page-container flex max-w-4xl flex-col gap-5 py-14 lg:py-20">
          <Breadcrumbs
            items={[
              { label: "Blog & Media", href: "/blog" },
              { label: post.title },
            ]}
          />
          <Link
            href={`/blog?category=${post.category}`}
            className="self-start rounded-full bg-gold-500 px-3 py-1 text-xs font-bold tracking-widest text-navy-950 uppercase"
          >
            {postCategoryLabels[post.category]}
          </Link>
          <h1 className="text-4xl font-bold uppercase sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg leading-relaxed text-navy-100">
              {post.excerpt}
            </p>
          )}
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-navy-100">
            <li className="flex items-center gap-2">
              <UserRound aria-hidden="true" className="size-4 text-gold-400" />
              <span className="sr-only">Written by </span>
              {post.authorName}
            </li>
            <li className="flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="size-4 text-gold-400"
              />
              <span className="sr-only">Published </span>
              <time dateTime={post.publishedAt}>
                {formatPublishedDate(post.publishedAt)}
              </time>
            </li>
            <li className="flex items-center gap-2">
              <Clock aria-hidden="true" className="size-4 text-gold-400" />
              {post.readingTimeInMinutes} min read
            </li>
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="scanner-line h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
        />
      </header>

      <div className="page-container max-w-4xl py-10 lg:py-14">
        {post.coverImagePath && (
          <div className="relative -mt-2 mb-10 aspect-[16/9] overflow-hidden rounded-xl shadow-lg">
            <Image
              src={getPublicMediaUrl(post.coverImagePath)}
              alt={post.coverImageAltText ?? ""}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy-900 prose-headings:uppercase prose-a:text-gold-700 prose-blockquote:border-gold-500 prose-blockquote:text-navy-800 prose-pre:bg-navy-950 prose-img:rounded-lg [&_div[data-youtube-video]]:my-8 [&_iframe]:aspect-video [&_iframe]:h-auto [&_iframe]:w-full [&_iframe]:rounded-lg"
          // Generated from the editor document and sanitised with a strict
          // allowlist on the server (see lib/blog/process-post-content.ts).
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <footer className="mt-12 flex flex-col gap-6 border-t border-border pt-8">
          {post.tagNames.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-navy-900">Tags:</span>
              <ul className="flex flex-wrap gap-2">
                {post.tagNames.map((tagName) => (
                  <li
                    key={tagName}
                    className="rounded-full bg-navy-100 px-3 py-1 text-sm text-navy-900"
                  >
                    {tagName}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <ShareButtons url={shareUrl} title={post.title} />
        </footer>
      </div>
    </article>
  );
}
