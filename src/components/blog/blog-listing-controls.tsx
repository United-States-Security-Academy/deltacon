import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

import { formControlClassName } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
  postCategoryLabels,
  postCategoryOrder,
} from "@/config/post-categories";
import type { PostCategory } from "@/lib/database/schema/enums";
import { cn } from "@/lib/utils";

/** Builds a /blog link, keeping only the filters that are set. */
export function buildBlogListingPath(filters: {
  category?: PostCategory;
  search?: string;
  page?: number;
}): string {
  const searchParameters = new URLSearchParams();
  if (filters.category) searchParameters.set("category", filters.category);
  if (filters.search) searchParameters.set("q", filters.search);
  if (filters.page && filters.page > 1) {
    searchParameters.set("page", String(filters.page));
  }
  const query = searchParameters.toString();
  return query ? `/blog?${query}` : "/blog";
}

/** "All / Blog / News / Press & Media" tabs. */
export function BlogCategoryTabs({
  activeCategory,
  search,
}: {
  activeCategory?: PostCategory;
  search?: string;
}) {
  const tabs = [
    { label: "All", category: undefined },
    ...postCategoryOrder.map((category) => ({
      label: postCategoryLabels[category],
      category,
    })),
  ];

  return (
    <nav aria-label="Post categories">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.category === activeCategory;
          return (
            <li key={tab.label}>
              <Link
                href={buildBlogListingPath({ category: tab.category, search })}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-block rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
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
  );
}

/** Search box; a plain GET form, so it works without JavaScript. */
export function BlogSearchForm({
  activeCategory,
  search,
}: {
  activeCategory?: PostCategory;
  search?: string;
}) {
  return (
    <form
      action="/blog"
      method="get"
      role="search"
      className="flex w-full gap-2 sm:max-w-sm"
    >
      {activeCategory && (
        <input type="hidden" name="category" value={activeCategory} />
      )}
      <label htmlFor="blog-search" className="sr-only">
        Search posts
      </label>
      <input
        id="blog-search"
        type="search"
        name="q"
        defaultValue={search}
        placeholder="Search posts"
        maxLength={100}
        className={formControlClassName}
      />
      <Button type="submit" variant="default" size="lg" className="h-11">
        <Search aria-hidden="true" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}

/** Previous / next page links with "Page 2 of 5". */
export function BlogPagination({
  currentPage,
  totalPages,
  activeCategory,
  search,
}: {
  currentPage: number;
  totalPages: number;
  activeCategory?: PostCategory;
  search?: string;
}) {
  if (totalPages <= 1) return null;
  const linkClassName =
    "inline-flex items-center gap-1 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-gold-500";

  return (
    <nav
      aria-label="Blog pages"
      className="flex items-center justify-center gap-4"
    >
      {currentPage > 1 ? (
        <Link
          href={buildBlogListingPath({
            category: activeCategory,
            search,
            page: currentPage - 1,
          })}
          rel="prev"
          className={linkClassName}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Newer posts
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages ? (
        <Link
          href={buildBlogListingPath({
            category: activeCategory,
            search,
            page: currentPage + 1,
          })}
          rel="next"
          className={linkClassName}
        >
          Older posts
          <ChevronRight aria-hidden="true" className="size-4" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
