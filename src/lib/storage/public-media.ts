/** Name of the public Supabase Storage bucket for site images. */
export const publicMediaBucket = "site-media";

/**
 * Turns a path inside the public "site-media" bucket into a full URL that
 * next/image can load.
 */
export function getPublicMediaUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const encodedPath = storagePath
    .split("/")
    .map((pathSegment) => encodeURIComponent(pathSegment))
    .join("/");
  return `${supabaseUrl}/storage/v1/object/public/${publicMediaBucket}/${encodedPath}`;
}
