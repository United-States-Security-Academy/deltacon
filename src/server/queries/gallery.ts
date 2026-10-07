import "server-only";

import { asc, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { cacheTags } from "@/lib/cache-tags";
import { runAsVisitor } from "@/lib/database/access-roles";
import { galleryImages } from "@/lib/database/schema";

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
