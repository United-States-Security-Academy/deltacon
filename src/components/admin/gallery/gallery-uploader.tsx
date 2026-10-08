"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { formControlClassName } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
  acceptedImageTypesForInput,
  findImageFileProblem,
  uploadPublicImage,
} from "@/lib/storage/upload-public-image";
import { cn } from "@/lib/utils";
import { galleryImageDetailsSchema } from "@/lib/validation/gallery-schemas";
import { toFieldErrors } from "@/lib/validation/submission-schemas";
import { addGalleryImage } from "@/server/actions/admin/gallery-actions";

/** Most photos one batch can hold, so a mistaken folder pick isn't uploaded. */
const maximumPhotosPerBatch = 20;

type PendingPhoto = {
  key: string;
  file: File;
  previewUrl: string;
  altText: string;
  caption: string;
  categoryId: string;
  state: "waiting" | "uploading" | "failed";
  errorMessage?: string;
  fieldErrors?: Record<string, string>;
};

/**
 * Chooses photos, collects a description for each, then uploads them one at
 * a time: the file goes straight to storage, then the server checks it and
 * adds it to the gallery.
 */
export function GalleryUploader({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notice, setNotice] = useState<{ text: string; isError: boolean }>();

  // Frees the browser memory used by previews when they're no longer shown.
  const previewUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  function addFiles(files: FileList | File[]) {
    const chosen = [...files];
    const problems: string[] = [];
    const accepted: PendingPhoto[] = [];
    for (const file of chosen) {
      const problem = findImageFileProblem(file);
      if (problem) {
        problems.push(`${file.name}: ${problem}`);
        continue;
      }
      const previewUrl = URL.createObjectURL(file);
      previewUrls.current.add(previewUrl);
      accepted.push({
        key: crypto.randomUUID(),
        file,
        previewUrl,
        altText: "",
        caption: "",
        categoryId: "",
        state: "waiting",
      });
    }
    setPendingPhotos((current) => {
      const room = maximumPhotosPerBatch - current.length;
      if (accepted.length > room) {
        problems.push(
          `Only ${maximumPhotosPerBatch} photos can be added at a time.`,
        );
        accepted
          .slice(room)
          .forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      }
      return [...current, ...accepted.slice(0, Math.max(0, room))];
    });
    setNotice(
      problems.length > 0
        ? { text: problems.join(" "), isError: true }
        : undefined,
    );
  }

  function updatePhoto(key: string, changes: Partial<PendingPhoto>) {
    setPendingPhotos((current) =>
      current.map((photo) =>
        photo.key === key ? { ...photo, ...changes } : photo,
      ),
    );
  }

  function removePhoto(key: string) {
    setPendingPhotos((current) => {
      const photo = current.find((item) => item.key === key);
      if (photo) {
        URL.revokeObjectURL(photo.previewUrl);
        previewUrls.current.delete(photo.previewUrl);
      }
      return current.filter((item) => item.key !== key);
    });
  }

  function setCategoryForAll(categoryId: string) {
    setPendingPhotos((current) =>
      current.map((photo) => ({ ...photo, categoryId })),
    );
  }

  async function uploadAll() {
    // Check every description first, so nothing uploads until all are ready.
    let allValid = true;
    for (const photo of pendingPhotos) {
      const validation = galleryImageDetailsSchema.safeParse(photo);
      if (!validation.success) {
        allValid = false;
        updatePhoto(photo.key, {
          fieldErrors: toFieldErrors(validation.error),
        });
      } else {
        updatePhoto(photo.key, { fieldErrors: undefined });
      }
    }
    if (!allValid) {
      setNotice({
        text: "Add a description to every photo before uploading.",
        isError: true,
      });
      return;
    }

    setIsUploading(true);
    setNotice(undefined);
    let uploadedCount = 0;
    for (const photo of pendingPhotos) {
      updatePhoto(photo.key, { state: "uploading", errorMessage: undefined });
      const upload = await uploadPublicImage(photo.file, "gallery");
      if ("error" in upload) {
        updatePhoto(photo.key, { state: "failed", errorMessage: upload.error });
        continue;
      }
      const result = await addGalleryImage({
        storagePath: upload.storagePath,
        altText: photo.altText,
        caption: photo.caption,
        categoryId: photo.categoryId,
      });
      if (result.status === "error") {
        updatePhoto(photo.key, {
          state: "failed",
          errorMessage: result.message,
          fieldErrors: result.fieldErrors,
        });
        continue;
      }
      uploadedCount += 1;
      removePhoto(photo.key);
    }
    setIsUploading(false);

    const failedCount = pendingPhotos.length - uploadedCount;
    setNotice(
      failedCount === 0
        ? {
            text: `${uploadedCount} photo${uploadedCount === 1 ? "" : "s"} added to the gallery.`,
            isError: false,
          }
        : {
            text: `${uploadedCount} uploaded, ${failedCount} failed. Check the photos below and try again.`,
            isError: true,
          },
    );
  }

  return (
    <section
      aria-labelledby="gallery-upload-heading"
      className="rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <h2
        id="gallery-upload-heading"
        className="mb-4 text-lg font-bold text-navy-900 uppercase"
      >
        Add photos
      </h2>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDraggingOver(false);
          if (!isUploading) addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex flex-col items-center gap-3 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors",
          isDraggingOver
            ? "border-gold-500 bg-gold-300/10"
            : "border-border bg-paper",
        )}
      >
        <ImagePlus aria-hidden="true" className="size-10 text-navy-700" />
        <p className="text-sm text-muted-foreground">
          Drag photos here, or choose them from your device. JPG, PNG, WebP,
          AVIF or GIF, up to 10 MB each.
        </p>
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          multiple
          accept={acceptedImageTypesForInput}
          className="sr-only"
          disabled={isUploading}
          onChange={(event) => {
            if (event.target.files) addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          Choose photos
        </Button>
      </div>

      {notice && (
        <p
          role={notice.isError ? "alert" : "status"}
          className={cn(
            "mt-4 text-sm",
            notice.isError ? "text-flag-red" : "text-green-800",
          )}
        >
          {notice.text}
        </p>
      )}

      {pendingPhotos.length > 0 && (
        <div className="mt-6 flex flex-col gap-4">
          {categories.length > 0 && (
            <div className="flex flex-col gap-1 sm:max-w-xs">
              <label
                htmlFor="category-for-all"
                className="text-sm font-semibold text-navy-900"
              >
                Category for all photos
              </label>
              <select
                id="category-for-all"
                defaultValue=""
                disabled={isUploading}
                onChange={(event) => setCategoryForAll(event.target.value)}
                className={cn(formControlClassName, "pr-8")}
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <ul className="flex flex-col gap-4">
            {pendingPhotos.map((photo, index) => {
              const altId = `pending-alt-${photo.key}`;
              const altErrorId = `${altId}-error`;
              const altError = photo.fieldErrors?.altText;
              return (
                <li
                  key={photo.key}
                  className={cn(
                    "grid gap-4 rounded-lg border p-4 sm:grid-cols-[8rem_1fr_auto]",
                    photo.state === "failed"
                      ? "border-flag-red/40"
                      : "border-border",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a file that isn't uploaded yet */}
                  <img
                    src={photo.previewUrl}
                    alt=""
                    className="aspect-[4/3] w-full rounded-md bg-navy-900 object-cover sm:w-32"
                  />
                  <div className="flex flex-col gap-3">
                    <p className="truncate text-xs text-muted-foreground">
                      Photo {index + 1}: {photo.file.name}
                    </p>
                    <div className="flex flex-col gap-1">
                      <label
                        htmlFor={altId}
                        className="text-sm font-semibold text-navy-900"
                      >
                        Description{" "}
                        <span className="font-normal text-muted-foreground">
                          (read aloud by screen readers)
                        </span>
                      </label>
                      <input
                        id={altId}
                        value={photo.altText}
                        maxLength={200}
                        disabled={isUploading}
                        placeholder="e.g. Two officers patrolling a retail car park at night"
                        aria-invalid={altError ? true : undefined}
                        aria-describedby={altError ? altErrorId : undefined}
                        onChange={(event) =>
                          updatePhoto(photo.key, {
                            altText: event.target.value,
                          })
                        }
                        className={formControlClassName}
                      />
                      {altError && (
                        <p id={altErrorId} className="text-sm text-flag-red">
                          {altError}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor={`pending-caption-${photo.key}`}
                          className="text-sm font-semibold text-navy-900"
                        >
                          Caption{" "}
                          <span className="font-normal text-muted-foreground">
                            (optional)
                          </span>
                        </label>
                        <input
                          id={`pending-caption-${photo.key}`}
                          value={photo.caption}
                          maxLength={300}
                          disabled={isUploading}
                          onChange={(event) =>
                            updatePhoto(photo.key, {
                              caption: event.target.value,
                            })
                          }
                          className={formControlClassName}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label
                          htmlFor={`pending-category-${photo.key}`}
                          className="text-sm font-semibold text-navy-900"
                        >
                          Category
                        </label>
                        <select
                          id={`pending-category-${photo.key}`}
                          value={photo.categoryId}
                          disabled={isUploading}
                          onChange={(event) =>
                            updatePhoto(photo.key, {
                              categoryId: event.target.value,
                            })
                          }
                          className={cn(formControlClassName, "pr-8")}
                        >
                          <option value="">No category</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {photo.state === "uploading" && (
                      <p role="status" className="text-sm text-navy-700">
                        Uploading…
                      </p>
                    )}
                    {photo.errorMessage && (
                      <p role="alert" className="text-sm text-flag-red">
                        {photo.errorMessage}
                      </p>
                    )}
                  </div>
                  <div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isUploading}
                      onClick={() => removePhoto(photo.key)}
                    >
                      <X aria-hidden="true" />
                      <span className="sr-only">Remove photo {index + 1}</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div>
            <Button
              type="button"
              variant="accent"
              size="lg"
              disabled={isUploading}
              onClick={uploadAll}
            >
              <Upload aria-hidden="true" />
              {isUploading
                ? "Uploading…"
                : `Upload ${pendingPhotos.length} photo${pendingPhotos.length === 1 ? "" : "s"}`}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
