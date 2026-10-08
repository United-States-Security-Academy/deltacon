"use client";

import { ImagePlus, LoaderCircle, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { getPublicMediaUrl } from "@/lib/storage/public-media";
import {
  acceptedImageTypesForInput,
  uploadPublicImage,
} from "@/lib/storage/upload-public-image";

type CoverImageFieldProps = {
  storagePath: string | null;
  onChange: (storagePath: string | null) => void;
  errorMessage?: string;
};

/** Upload, preview, replace or remove the post's cover image. */
export function CoverImageField({
  storagePath,
  onChange,
  errorMessage,
}: CoverImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string>();

  async function handleFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadErrorMessage(undefined);
    setIsUploading(true);
    const result = await uploadPublicImage(file, "posts");
    setIsUploading(false);
    if ("error" in result) setUploadErrorMessage(result.error);
    else onChange(result.storagePath);
  }

  const shownError = uploadErrorMessage ?? errorMessage;

  return (
    <div className="flex flex-col gap-3">
      {storagePath ? (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-navy-900">
          <Image
            src={getPublicMediaUrl(storagePath)}
            alt="Cover image preview"
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-paper text-navy-700 transition-colors hover:border-gold-500"
        >
          {isUploading ? (
            <LoaderCircle aria-hidden="true" className="size-8 animate-spin" />
          ) : (
            <ImagePlus aria-hidden="true" className="size-8" />
          )}
          <span className="text-sm font-medium">
            {isUploading ? "Uploading…" : "Upload a cover image"}
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WebP or AVIF, up to 10 MB. Wide images (16:9) look best.
          </span>
        </button>
      )}

      {storagePath && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {isUploading ? "Uploading…" : "Replace"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(null)}
            className="text-flag-red"
          >
            <X aria-hidden="true" />
            Remove
          </Button>
        </div>
      )}

      {shownError && (
        <p role="alert" className="text-sm font-medium text-flag-red">
          {shownError}
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedImageTypesForInput}
        onChange={handleFileChosen}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
