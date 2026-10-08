"use server";

import { eq, inArray, min, sql } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

import { createSlug } from "@/lib/blog/create-slug";
import { cacheTags } from "@/lib/cache-tags";
import { runAsSignedInUser } from "@/lib/database/access-roles";
import { galleryCategories, galleryImages } from "@/lib/database/schema";
import { publicMediaBucket } from "@/lib/storage/public-media";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import {
  galleryCategoryNameSchema,
  galleryImageDetailsSchema,
  galleryCategoryIdRule,
  galleryImageIdRule,
  galleryOrderSchema,
  newGalleryImageSchema,
} from "@/lib/validation/gallery-schemas";
import { toFieldErrors } from "@/lib/validation/submission-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import {
  readGalleryImage,
  UnreadableImageError,
} from "@/server/gallery/read-gallery-image";

/*
 * Changes admins make to the gallery. Each action checks the caller is an
 * admin, validates its input, and writes as that admin so the database's Row
 * Level Security has the final say. Photo files are uploaded by the admin's
 * browser straight to the public "site-media" bucket first.
 */

export type GalleryActionResult =
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

const missingImage: GalleryActionResult = {
  status: "error",
  message: "That photo no longer exists. Refresh the page.",
};

/** Refreshes every page that shows gallery photos. */
function refreshGalleryPages() {
  revalidateTag(cacheTags.gallery, "max");
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

async function removeStoredFiles(storagePaths: string[]) {
  if (storagePaths.length === 0) return;
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.storage
    .from(publicMediaBucket)
    .remove(storagePaths);
  if (error) console.error("Gallery files could not be deleted.", error);
}

/**
 * Saves a photo the browser has just uploaded. The file is opened and checked
 * on the server; anything that isn't a real image is deleted again.
 */
export async function addGalleryImage(
  formValues: unknown,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const validation = newGalleryImageSchema.safeParse(formValues);
  if (!validation.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(validation.error),
    };
  }
  const { storagePath, altText, caption, categoryId } = validation.data;

  const supabase = await createServerSupabaseClient();
  const { data: file, error: downloadError } = await supabase.storage
    .from(publicMediaBucket)
    .download(storagePath);
  if (downloadError || !file) {
    return {
      status: "error",
      message: "The uploaded photo couldn't be found. Please upload it again.",
    };
  }

  let facts;
  try {
    facts = await readGalleryImage(await file.arrayBuffer());
  } catch (error) {
    if (!(error instanceof UnreadableImageError)) throw error;
    await removeStoredFiles([storagePath]);
    return {
      status: "error",
      message: "That file isn't a photo we can use. Try a JPG, PNG or WebP.",
    };
  }

  await runAsSignedInUser(admin.userId, async (transaction) => {
    // New photos go to the front of the gallery.
    const [{ lowestSortOrder }] = await transaction
      .select({ lowestSortOrder: min(galleryImages.sortOrder) })
      .from(galleryImages);
    await transaction.insert(galleryImages).values({
      storagePath,
      altText,
      caption: caption || null,
      categoryId,
      sortOrder: (lowestSortOrder ?? 1) - 1,
      ...facts,
    });
  });

  refreshGalleryPages();
  return { status: "success" };
}

export async function updateGalleryImage(
  imageId: string,
  formValues: unknown,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const id = galleryImageIdRule.safeParse(imageId);
  if (!id.success) return missingImage;
  const validation = galleryImageDetailsSchema.safeParse(formValues);
  if (!validation.success) {
    return {
      status: "error",
      message: "Check the highlighted fields.",
      fieldErrors: toFieldErrors(validation.error),
    };
  }
  const { altText, caption, categoryId } = validation.data;

  const updated = await runAsSignedInUser(admin.userId, (transaction) =>
    transaction
      .update(galleryImages)
      .set({ altText, caption: caption || null, categoryId })
      .where(eq(galleryImages.id, id.data))
      .returning({ id: galleryImages.id }),
  );
  if (updated.length === 0) return missingImage;

  refreshGalleryPages();
  return { status: "success" };
}

export async function deleteGalleryImage(
  imageId: string,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const id = galleryImageIdRule.safeParse(imageId);
  if (!id.success) return missingImage;

  const deleted = await runAsSignedInUser(admin.userId, (transaction) =>
    transaction
      .delete(galleryImages)
      .where(eq(galleryImages.id, id.data))
      .returning({ storagePath: galleryImages.storagePath }),
  );
  if (deleted.length === 0) return missingImage;

  await removeStoredFiles(deleted.map((image) => image.storagePath));
  refreshGalleryPages();
  return { status: "success" };
}

/** Saves the order of every photo, first to last. */
export async function saveGalleryOrder(
  orderedImageIds: unknown,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const validation = galleryOrderSchema.safeParse(orderedImageIds);
  if (!validation.success) {
    return {
      status: "error",
      message: "The new order couldn't be saved. Refresh the page.",
    };
  }
  const ids = validation.data;

  const saved = await runAsSignedInUser(admin.userId, async (transaction) => {
    const existing = await transaction
      .select({ id: galleryImages.id })
      .from(galleryImages);
    // The list must match the gallery exactly, or someone else changed it meanwhile.
    const existingIds = new Set(existing.map((image) => image.id));
    if (
      existingIds.size !== ids.length ||
      ids.some((id) => !existingIds.has(id))
    ) {
      return false;
    }
    if (ids.length === 0) return true;
    await transaction
      .update(galleryImages)
      .set({
        sortOrder: sql`case ${galleryImages.id} ${sql.join(
          ids.map(
            (id, position) => sql`when ${id}::uuid then ${position}::integer`,
          ),
          sql` `,
        )} end`,
      })
      .where(inArray(galleryImages.id, ids));
    return true;
  });
  if (!saved) {
    return {
      status: "error",
      message:
        "The gallery was changed somewhere else. Refresh the page and try again.",
    };
  }

  refreshGalleryPages();
  return { status: "success" };
}

/* Categories ---------------------------------------------------------------- */

export async function createGalleryCategory(
  formValues: unknown,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const validation = galleryCategoryNameSchema.safeParse(formValues);
  if (!validation.success) {
    return {
      status: "error",
      message: validation.error.issues[0]?.message ?? "Check the name.",
    };
  }
  const { name } = validation.data;
  const slug = createSlug(name);
  if (!slug)
    return { status: "error", message: "Use letters or numbers in the name." };

  const created = await runAsSignedInUser(admin.userId, async (transaction) => {
    const [{ highestSortOrder }] = await transaction
      .select({
        highestSortOrder: sql<
          number | null
        >`max(${galleryCategories.sortOrder})`,
      })
      .from(galleryCategories);
    return transaction
      .insert(galleryCategories)
      .values({ name, slug, sortOrder: (highestSortOrder ?? 0) + 1 })
      .onConflictDoNothing({ target: galleryCategories.slug })
      .returning({ id: galleryCategories.id });
  });
  if (created.length === 0) {
    return {
      status: "error",
      message: "A category with that name already exists.",
    };
  }

  refreshGalleryPages();
  return { status: "success" };
}

/**
 * Renames a category. Its web address (?category=…) stays the same, so links
 * people have shared keep working.
 */
export async function renameGalleryCategory(
  categoryId: string,
  formValues: unknown,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const id = galleryCategoryIdRule.safeParse(categoryId);
  const validation = galleryCategoryNameSchema.safeParse(formValues);
  if (!id.success)
    return { status: "error", message: "That category no longer exists." };
  if (!validation.success) {
    return {
      status: "error",
      message: validation.error.issues[0]?.message ?? "Check the name.",
    };
  }

  const updated = await runAsSignedInUser(admin.userId, (transaction) =>
    transaction
      .update(galleryCategories)
      .set({ name: validation.data.name })
      .where(eq(galleryCategories.id, id.data))
      .returning({ id: galleryCategories.id }),
  );
  if (updated.length === 0)
    return { status: "error", message: "That category no longer exists." };

  refreshGalleryPages();
  return { status: "success" };
}

/** Deletes a category. Its photos stay in the gallery without a category. */
export async function deleteGalleryCategory(
  categoryId: string,
): Promise<GalleryActionResult> {
  const admin = await requireAdmin();
  const id = galleryCategoryIdRule.safeParse(categoryId);
  if (!id.success)
    return { status: "error", message: "That category no longer exists." };

  await runAsSignedInUser(admin.userId, (transaction) =>
    transaction
      .delete(galleryCategories)
      .where(eq(galleryCategories.id, id.data)),
  );

  refreshGalleryPages();
  return { status: "success" };
}
