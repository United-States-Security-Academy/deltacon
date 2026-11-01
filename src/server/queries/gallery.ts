import "server-only";

import { asc, count, desc, eq, exists } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { cacheTags } from "@/lib/cache-tags";
import { runAsVisitor } from "@/lib/database/access-roles";
import { galleryCategories, galleryImages } from "@/lib/database/schema";

export type GalleryImageSummary = {
  id: string;
  storagePath: string;
  widthInPixels: number;
  heightInPixels: number;
  blurPlaceholder: string | null;
  altText: string;
  caption: string | null;
  categoryId: string | null;
};

/**
 * The first few gallery images, in the order admins arranged them, for the
 * home page. The home page is static, so this only runs when it is rebuilt
 * (on deploy or a gallery change). It throws on database errors so Next.js
 * keeps the last good page instead of saving one without photos.
 */
export async function getGalleryPreviewImages(
  numberOfImages: number,
): Promise<GalleryImageSummary[]> {
  return runAsVisitor((transaction) =>
    transaction
      .select({
        id: galleryImages.id,
        storagePath: galleryImages.storagePath,
        widthInPixels: galleryImages.widthInPixels,
        heightInPixels: galleryImages.heightInPixels,
        blurPlaceholder: galleryImages.blurPlaceholder,
        altText: galleryImages.altText,
        caption: galleryImages.caption,
        categoryId: galleryImages.categoryId,
      })
      .from(galleryImages)
      .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.createdAt))
      .limit(numberOfImages),
  );
}

/** How many photos each page of the public gallery shows. */
export const galleryImagesPerPage = 24;

const gallerySummaryColumns = {
  id: galleryImages.id,
  storagePath: galleryImages.storagePath,
  widthInPixels: galleryImages.widthInPixels,
  heightInPixels: galleryImages.heightInPixels,
  blurPlaceholder: galleryImages.blurPlaceholder,
  altText: galleryImages.altText,
  caption: galleryImages.caption,
  categoryId: galleryImages.categoryId,
};

export type PublicGalleryCategory = { id: string; name: string; slug: string };

/*
 * The /gallery page is rendered per request (it reads ?category= and
 * ?page=), so its data is cached under the "gallery" tag with no timer;
 * gallery changes in the admin refresh that tag. Database errors are thrown
 * inside the cache (so they are never stored) and caught outside it.
 */

const getCachedGalleryCategoriesWithImages = unstable_cache(
  async (): Promise<PublicGalleryCategory[]> =>
    runAsVisitor((transaction) =>
      transaction
        .select({
          id: galleryCategories.id,
          name: galleryCategories.name,
          slug: galleryCategories.slug,
        })
        .from(galleryCategories)
        .where(
          exists(
            transaction
              .select({ id: galleryImages.id })
              .from(galleryImages)
              .where(eq(galleryImages.categoryId, galleryCategories.id)),
          ),
        )
        .orderBy(asc(galleryCategories.sortOrder), asc(galleryCategories.name)),
    ),
  ["gallery-categories-with-images"],
  { tags: [cacheTags.gallery], revalidate: false },
);

/** Categories that have at least one photo, in the order admins set. */
export async function getGalleryCategoriesWithImages(): Promise<
  PublicGalleryCategory[]
> {
  try {
    return await getCachedGalleryCategoriesWithImages();
  } catch (error) {
    console.error("Could not load gallery categories.", error);
    return [];
  }
}

type GalleryPageFilters = { categoryId?: string; page: number };
type GalleryPage = { images: GalleryImageSummary[]; totalCount: number };

const getCachedGalleryPage = unstable_cache(
  async (filters: GalleryPageFilters): Promise<GalleryPage> =>
    runAsVisitor(async (transaction) => {
      const where = filters.categoryId
        ? eq(galleryImages.categoryId, filters.categoryId)
        : undefined;
      const [{ total }] = await transaction
        .select({ total: count() })
        .from(galleryImages)
        .where(where);
      const images = await transaction
        .select(gallerySummaryColumns)
        .from(galleryImages)
        .where(where)
        .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.createdAt))
        .limit(galleryImagesPerPage)
        .offset((filters.page - 1) * galleryImagesPerPage);
      return { images, totalCount: total };
    }),
  ["gallery-page"],
  { tags: [cacheTags.gallery], revalidate: false },
);

/** One page of gallery photos, optionally from a single category. */
export async function getGalleryPage(
  filters: GalleryPageFilters,
): Promise<GalleryPage> {
  try {
    return await getCachedGalleryPage(filters);
  } catch (error) {
    console.error("Could not load gallery images.", error);
    return { images: [], totalCount: 0 };
  }
}
