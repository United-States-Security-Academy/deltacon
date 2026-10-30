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

export type PublicImageFolder = "posts" | "gallery";

/**
 * Largest image allowed in each folder, in megabytes: blog images (covers and
 * images inside posts) and gallery photos. Kept small so pages load quickly.
 */
export const maximumImageSizeInMegabytes: Record<PublicImageFolder, number> = {
  posts: 2,
  gallery: 2,
};

export const acceptedImageTypesForInput =
  Object.keys(acceptedImageTypes).join(",");

/** Returns a problem message, or undefined if the file can be uploaded. */
export function findImageFileProblem(
  file: File,
  folder: PublicImageFolder,
): string | undefined {
  if (!(file.type in acceptedImageTypes)) {
    return "Please choose a JPG, PNG, WebP, AVIF or GIF image.";
  }
  const maximumMegabytes = maximumImageSizeInMegabytes[folder];
  if (file.size > maximumMegabytes * 1024 * 1024) {
    const fileMegabytes = (file.size / (1024 * 1024)).toFixed(1);
    return `This image is ${fileMegabytes} MB. Please use an image of ${maximumMegabytes} MB or smaller.`;
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
  folder: PublicImageFolder,
): Promise<{ storagePath: string } | { error: string }> {
  const problem = findImageFileProblem(file, folder);
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
