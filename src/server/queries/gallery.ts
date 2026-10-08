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

/** The first few gallery images, in the order admins arranged them. */
export const getGalleryPreviewImages = unstable_cache(
  async (numberOfImages: number): Promise<GalleryImageSummary[]> => {
    try {
      return await runAsVisitor((transaction) =>
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
    } catch (error) {
      console.error("Could not load gallery preview images.", error);
      return [];
    }
  },
  ["gallery-preview-images"],
  { tags: [cacheTags.gallery], revalidate: 3600 },
);

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

/** Categories that have at least one photo, in the order admins set. */
export const getGalleryCategoriesWithImages = unstable_cache(
  async (): Promise<PublicGalleryCategory[]> => {
    try {
      return await runAsVisitor((transaction) =>
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
          .orderBy(
            asc(galleryCategories.sortOrder),
            asc(galleryCategories.name),
          ),
      );
    } catch (error) {
      console.error("Could not load gallery categories.", error);
      return [];
    }
  },
  ["gallery-categories-with-images"],
  { tags: [cacheTags.gallery], revalidate: 3600 },
);

/** One page of gallery photos, optionally from a single category. */
export const getGalleryPage = unstable_cache(
  async (filters: {
    categoryId?: string;
    page: number;
  }): Promise<{ images: GalleryImageSummary[]; totalCount: number }> => {
    try {
      return await runAsVisitor(async (transaction) => {
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
      });
    } catch (error) {
      console.error("Could not load gallery images.", error);
      return { images: [], totalCount: 0 };
    }
  },
  ["gallery-page"],
  { tags: [cacheTags.gallery], revalidate: 3600 },
);
