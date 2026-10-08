import { createBrowserSupabaseClient } from "@/lib/supabase/browser-client";

import { publicMediaBucket } from "./public-media";

/** Image types the public "site-media" bucket accepts (the bucket enforces this too). */
export const acceptedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
} as const;

export const maximumImageSizeInBytes = 10 * 1024 * 1024;

export const acceptedImageTypesForInput =
  Object.keys(acceptedImageTypes).join(",");

/** Returns a problem message, or undefined if the file can be uploaded. */
export function findImageFileProblem(file: File): string | undefined {
  if (!(file.type in acceptedImageTypes)) {
    return "Please choose a JPG, PNG, WebP, AVIF or GIF image.";
  }
  if (file.size > maximumImageSizeInBytes) {
    return "Images must be 10 MB or smaller.";
  }
  return undefined;
}

/**
 * Uploads an image to the public "site-media" bucket from the browser, as the
 * signed-in admin (storage policies only allow admins to upload). Files get a
 * random name inside a dated folder, e.g. "posts/2026-10/1f3a….jpg".
 */
export async function uploadPublicImage(
  file: File,
  folder: "posts" | "gallery",
): Promise<{ storagePath: string } | { error: string }> {
  const problem = findImageFileProblem(file);
  if (problem) return { error: problem };

  const extension =
    acceptedImageTypes[file.type as keyof typeof acceptedImageTypes];
  const yearAndMonth = new Date().toISOString().slice(0, 7);
  const storagePath = `${folder}/${yearAndMonth}/${crypto.randomUUID()}.${extension}`;

  const { error } = await createBrowserSupabaseClient()
    .storage.from(publicMediaBucket)
    .upload(storagePath, file, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) {
    return { error: "The image couldn't be uploaded. Please try again." };
  }
  return { storagePath };
}
