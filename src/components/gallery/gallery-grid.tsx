"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPublicMediaUrl } from "@/lib/storage/public-media";

export type GalleryGridImage = {
  id: string;
  storagePath: string;
  widthInPixels: number;
  heightInPixels: number;
  blurPlaceholder: string | null;
  altText: string;
  caption: string | null;
};

/**
 * The photo grid. Selecting a photo opens it full size in a lightbox, where
 * the arrow keys (or the on-screen buttons) move between photos and Escape
 * closes it. Focus returns to the photo that was opened.
 */
export function GalleryGrid({ images }: { images: GalleryGridImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openImage = openIndex === null ? undefined : images[openIndex];

  function showRelative(step: number) {
    setOpenIndex((current) =>
      current === null
        ? current
        : (current + step + images.length) % images.length,
    );
  }

  return (
    <>
      <ul
        data-reveal-stagger
        className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
      >
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-navy-900 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
            >
              <Image
                src={getPublicMediaUrl(image.storagePath)}
                alt={image.altText}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                placeholder={image.blurPlaceholder ? "blur" : "empty"}
                blurDataURL={image.blurPlaceholder ?? undefined}
                className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-navy-975/70 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
              <Expand
                aria-hidden="true"
                className="absolute right-3 bottom-3 size-5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span className="sr-only">Open larger view</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={openImage !== undefined}
        onOpenChange={(open) => !open && setOpenIndex(null)}
      >
        <DialogContent
          className="max-w-[min(96vw,80rem)] gap-3 border-none bg-navy-975 p-3 text-white sm:max-w-[min(96vw,80rem)] sm:p-4"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") showRelative(1);
            if (event.key === "ArrowLeft") showRelative(-1);
          }}
        >
          {openImage && openIndex !== null && (
            <>
              <DialogTitle className="sr-only">
                Photo {openIndex + 1} of {images.length}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {openImage.altText}. Use the left and right arrow keys to move
                between photos.
              </DialogDescription>
              <div className="relative flex items-center justify-center">
                <Image
                  key={openImage.id}
                  src={getPublicMediaUrl(openImage.storagePath)}
                  alt={openImage.altText}
                  width={openImage.widthInPixels}
                  height={openImage.heightInPixels}
                  sizes="96vw"
                  placeholder={openImage.blurPlaceholder ? "blur" : "empty"}
                  blurDataURL={openImage.blurPlaceholder ?? undefined}
                  className="max-h-[78vh] w-auto rounded-md object-contain"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => showRelative(-1)}
                  disabled={images.length < 2}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40"
                >
                  <ChevronLeft aria-hidden="true" />
                  <span className="sr-only">Previous photo</span>
                </button>
                <div className="min-w-0 flex-1 text-center">
                  {openImage.caption && (
                    <p className="text-sm text-navy-100">{openImage.caption}</p>
                  )}
                  <p aria-live="polite" className="text-xs text-navy-200">
                    {openIndex + 1} / {images.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showRelative(1)}
                  disabled={images.length < 2}
                  className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40"
                >
                  <ChevronRight aria-hidden="true" />
                  <span className="sr-only">Next photo</span>
                </button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
