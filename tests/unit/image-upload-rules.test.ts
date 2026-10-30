import { describe, expect, it, vi } from "vitest";

// The upload helper imports the browser Supabase client; only the file
// checks are tested here, so the client is replaced with an empty stub.
vi.mock("@/lib/supabase/browser-client", () => ({
  createBrowserSupabaseClient: () => ({}),
}));

const { findImageFileProblem, maximumImageSizeInMegabytes } =
  await import("@/lib/storage/upload-public-image");

const megabyte = 1024 * 1024;

function imageOfSize(sizeInBytes: number, type = "image/jpeg"): File {
  return new File([new Uint8Array(sizeInBytes)], "photo.jpg", { type });
}

describe("image upload limits", () => {
  it("limits blog images (covers and images in posts) to 2 MB", () => {
    expect(maximumImageSizeInMegabytes.posts).toBe(2);
    expect(findImageFileProblem(imageOfSize(2 * megabyte), "posts")).toBe(
      undefined,
    );
    expect(
      findImageFileProblem(imageOfSize(2 * megabyte + 1), "posts"),
    ).toMatch(/2 MB or smaller/);
  });

  it("limits gallery photos to 2 MB too", () => {
    expect(maximumImageSizeInMegabytes.gallery).toBe(2);
    expect(
      findImageFileProblem(imageOfSize(2 * megabyte), "gallery"),
    ).toBeUndefined();
    expect(
      findImageFileProblem(imageOfSize(2 * megabyte + 1), "gallery"),
    ).toMatch(/2 MB or smaller/);
  });

  it("tells the admin how big the rejected image is", () => {
    expect(findImageFileProblem(imageOfSize(3.8 * megabyte), "posts")).toBe(
      "This image is 3.8 MB. Please use an image of 2 MB or smaller.",
    );
  });

  it("still refuses files that aren't images", () => {
    expect(
      findImageFileProblem(imageOfSize(1000, "application/pdf"), "posts"),
    ).toMatch(/JPG, PNG, WebP, AVIF or GIF/);
  });
});
