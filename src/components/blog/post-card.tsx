import Image from "next/image";
import Link from "next/link";

import deltaconBadge from "@/assets/deltacon-badge.png";
import { postCategoryLabels } from "@/config/post-categories";
import { getPublicMediaUrl } from "@/lib/storage/public-media";
import type { PostSummary } from "@/server/queries/posts";

const publishedDateFormat = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Chicago",
});

export function formatPublishedDate(isoDate: string): string {
  return publishedDateFormat.format(new Date(isoDate));
}

export function PostCard({ post }: { post: PostSummary }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="hover-shine relative aspect-[16/9] overflow-hidden bg-navy-900">
        {post.coverImagePath ? (
          <Image
            src={getPublicMediaUrl(post.coverImagePath)}
            alt={post.coverImageAltText ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center security-pattern">
            <Image
              src={deltaconBadge}
              alt=""
              className="h-3/5 w-auto opacity-80"
              sizes="120px"
            />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="text-xs font-semibold tracking-widest text-gold-700 uppercase">
          {postCategoryLabels[post.category]}
        </p>
        <h3 className="text-xl font-bold text-navy-900 uppercase">
          {/* The ::after makes the whole card clickable through this one link. */}
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-[''] hover:text-gold-700"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="line-clamp-3 flex-1 text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <p className="text-sm text-navy-700">
          <time dateTime={post.publishedAt}>
            {formatPublishedDate(post.publishedAt)}
          </time>
          <span aria-hidden="true"> · </span>
          {post.readingTimeInMinutes} min read
        </p>
      </div>
    </article>
  );
}
