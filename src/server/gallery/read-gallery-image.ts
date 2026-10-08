import "server-only";

import sharp from "sharp";

/** Formats the gallery accepts, checked from the file's contents rather than its name. */
const acceptedFormats = new Set(["jpeg", "png", "webp", "avif", "gif", "heif"]);

/** Larger than any real camera photo; stops "decompression bomb" files. */
const maximumPixelCount = 80_000_000;

export type GalleryImageFacts = {
  widthInPixels: number;
  heightInPixels: number;
  /** A tiny blurred version, shown while the full photo loads. */
  blurPlaceholder: string;
};

export class UnreadableImageError extends Error {}

/**
 * Opens an uploaded photo to confirm it really is an image, then measures it
 * (so the page can reserve the right space and never jumps) and makes a
 * tiny blurred preview.
 */
export async function readGalleryImage(
  imageBytes: ArrayBuffer,
): Promise<GalleryImageFacts> {
  try {
    const image = sharp(Buffer.from(imageBytes), {
      limitInputPixels: maximumPixelCount,
      animated: false,
    }).autoOrient();
    const metadata = await image.metadata();
    if (!metadata.format || !acceptedFormats.has(metadata.format)) {
      throw new UnreadableImageError("Unsupported image format.");
    }

    // autoOrient() means phone photos taken sideways report their upright size.
    const isTurned = (metadata.orientation ?? 1) >= 5;
    const widthInPixels = isTurned ? metadata.height : metadata.width;
    const heightInPixels = isTurned ? metadata.width : metadata.height;
    if (!widthInPixels || !heightInPixels) {
      throw new UnreadableImageError("The image has no size.");
    }

    const preview = await image
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 40 })
      .toBuffer();

    return {
      widthInPixels,
      heightInPixels,
      blurPlaceholder: `data:image/webp;base64,${preview.toString("base64")}`,
    };
  } catch (error) {
    if (error instanceof UnreadableImageError) throw error;
    throw new UnreadableImageError("The file could not be read as an image.", {
      cause: error,
    });
  }
}
