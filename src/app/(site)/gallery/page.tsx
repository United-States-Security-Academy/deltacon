import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { GalleryGrid } from "@/components/gallery/gallery-grid";
import { CallToActionBand } from "@/components/sections/call-to-action-band";
import { PageHeader } from "@/components/sections/page-header";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { cn } from "@/lib/utils";
import {
  galleryImagesPerPage,
  getGalleryCategoriesWithImages,
  getGalleryPage,
  type PublicGalleryCategory,
} from "@/server/queries/gallery";

type GallerySearchParameters = Awaited<PageProps<"/gallery">["searchParams"]>;

/** Builds a /gallery link, keeping only the filters that are set. */
function buildGalleryPath(filters: { categorySlug?: string; page?: number }) {
  const searchParameters = new URLSearchParams();
  if (filters.categorySlug)
    searchParameters.set("category", filters.categorySlug);
  if (filters.page && filters.page > 1)
    searchParameters.set("page", String(filters.page));
  const query = searchParameters.toString();
  return query ? `/gallery?${query}` : "/gallery";
}

/** Reads ?category= and ?page=, ignoring values that don't match anything. */
function readGalleryFilters(
  searchParameters: GallerySearchParameters,
  categories: PublicGalleryCategory[],
) {
  const activeCategory = categories.find(
    (category) => category.slug === searchParameters.category,
  );
  const pageNumber = Number(searchParameters.page);
  const currentPage =
    Number.isInteger(pageNumber) && pageNumber > 1
      ? Math.min(pageNumber, 500)
      : 1;
  return { activeCategory, currentPage };
}

export async function generateMetadata({
  searchParams,
}: PageProps<"/gallery">): Promise<Metadata> {
  const categories = await getGalleryCategoriesWithImages();
  const { activeCategory, currentPage } = readGalleryFilters(
    await searchParams,
    categories,
  );
  const metadata = createPageMetadata({
    title: activeCategory ? `${activeCategory.name} | Gallery` : "Gallery",
    description:
      "Photos of Deltacon Security Group officers at work, in training and in the community across Texas.",
    path: buildGalleryPath({ categorySlug: activeCategory?.slug }),
  });
  if (currentPage > 1) metadata.robots = { index: false, follow: true };
  return metadata;
}

export default async function GalleryPage({
  searchParams,
}: PageProps<"/gallery">) {
  const categories = await getGalleryCategoriesWithImages();
  const { activeCategory, currentPage } = readGalleryFilters(
    await searchParams,
    categories,
  );
  const { images, totalCount } = await getGalleryPage({
    categoryId: activeCategory?.id,
    page: currentPage,
  });
  const totalPages = Math.max(1, Math.ceil(totalCount / galleryImagesPerPage));

  const tabs = [
    { label: "All photos", slug: undefined },
    ...categories.map((category) => ({
      label: category.name,
      slug: category.slug,
    })),
  ];
  const pageLinkClassName =
    "inline-flex items-center gap-1 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-navy-900 transition-colors hover:border-gold-500";

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Deltacon in action"
        introduction="Our officers on duty, in training and out in the community."
        breadcrumbs={[{ label: "Gallery" }]}
      />

      <section
        aria-labelledby="gallery-photos-heading"
        className="bg-paper section-spacing"
      >
        <div className="page-container flex flex-col gap-8">
          <h2 id="gallery-photos-heading" className="sr-only">
            {activeCategory ? `${activeCategory.name} photos` : "Photos"}
          </h2>

          {categories.length > 0 && (
            <nav aria-label="Photo categories">
              <ul className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const isActive = tab.slug === activeCategory?.slug;
                  return (
                    <li key={tab.label}>
                      <Link
                        href={buildGalleryPath({ categorySlug: tab.slug })}
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
          )}

          {images.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-white px-6 py-16 text-center">
              <Images aria-hidden="true" className="size-10 text-gold-600" />
              <p className="text-lg font-semibold text-navy-900">
                Photos are on their way.
              </p>
              <p className="max-w-md text-muted-foreground">
                We&apos;re putting together photos of our team at work. Check
                back soon.
              </p>
            </div>
          ) : (
            <GalleryGrid images={images} />
          )}

          {totalPages > 1 && (
            <nav
              aria-label="Gallery pages"
              className="flex items-center justify-center gap-4"
            >
              {currentPage > 1 ? (
                <Link
                  href={buildGalleryPath({
                    categorySlug: activeCategory?.slug,
                    page: currentPage - 1,
                  })}
                  rel="prev"
                  className={pageLinkClassName}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={buildGalleryPath({
                    categorySlug: activeCategory?.slug,
                    page: currentPage + 1,
                  })}
                  rel="next"
                  className={pageLinkClassName}
                >
                  Next
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>
      </section>

      <CallToActionBand />
    </>
  );
}
