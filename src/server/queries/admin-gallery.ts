import "server-only";

import { asc, count, desc, eq } from "drizzle-orm";

import { runAsSignedInUser } from "@/lib/database/access-roles";
import { galleryCategories, galleryImages } from "@/lib/database/schema";

/*
 * Gallery queries for the admin area, run as the signed-in admin so the
 * database's Row Level Security confirms access.
 */

export type AdminGalleryImage = {
  id: string;
  storagePath: string;
  widthInPixels: number;
  heightInPixels: number;
  blurPlaceholder: string | null;
  altText: string;
  caption: string | null;
  categoryId: string | null;
};

export type AdminGalleryCategory = {
  id: string;
  name: string;
  slug: string;
  imageCount: number;
};

export async function getAdminGallery(adminUserId: string): Promise<{
  images: AdminGalleryImage[];
  categories: AdminGalleryCategory[];
}> {
  return runAsSignedInUser(adminUserId, async (transaction) => {
    const images = await transaction
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
      .orderBy(asc(galleryImages.sortOrder), desc(galleryImages.createdAt));

    const categories = await transaction
      .select({
        id: galleryCategories.id,
        name: galleryCategories.name,
        slug: galleryCategories.slug,
        imageCount: count(galleryImages.id),
      })
      .from(galleryCategories)
      .leftJoin(
        galleryImages,
        eq(galleryImages.categoryId, galleryCategories.id),
      )
      .groupBy(galleryCategories.id)
      .orderBy(asc(galleryCategories.sortOrder), asc(galleryCategories.name));

    return { images, categories };
  });
}
