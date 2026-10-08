"use client";

import { ArrowDown, ArrowUp, ChevronsUp, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useTransition } from "react";

import { formControlClassName } from "@/components/forms/form-field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPublicMediaUrl } from "@/lib/storage/public-media";
import { cn } from "@/lib/utils";
import { galleryImageDetailsSchema } from "@/lib/validation/gallery-schemas";
import { toFieldErrors } from "@/lib/validation/submission-schemas";
import {
  deleteGalleryImage,
  saveGalleryOrder,
  updateGalleryImage,
} from "@/server/actions/admin/gallery-actions";
import type { AdminGalleryImage } from "@/server/queries/admin-gallery";

type CategoryOption = { id: string; name: string };

/** Waits briefly after a move so several quick moves are saved together. */
const orderSaveDelayInMilliseconds = 900;

export function GalleryImageManager({
  images,
  categories,
}: {
  images: AdminGalleryImage[];
  categories: CategoryOption[];
}) {
  const [orderedIds, setOrderedIds] = useState(() =>
    images.map((image) => image.id),
  );
  const [orderMessage, setOrderMessage] = useState<{
    text: string;
    isError: boolean;
  }>();
  const [, startSaving] = useTransition();
  const saveTimer = useRef<number | undefined>(undefined);

  // Keeps the admin's arrangement while also picking up photos that were just
  // added (shown first) or removed elsewhere.
  const imagesById = new Map(images.map((image) => [image.id, image]));
  const knownIds = new Set(orderedIds);
  const displayedIds = [
    ...images
      .filter((image) => !knownIds.has(image.id))
      .map((image) => image.id),
    ...orderedIds.filter((id) => imagesById.has(id)),
  ];
  const categoryNames = new Map(
    categories.map((category) => [category.id, category.name]),
  );

  function moveImage(fromIndex: number, toIndex: number) {
    if (toIndex < 0 || toIndex >= displayedIds.length || toIndex === fromIndex)
      return;
    const newOrder = [...displayedIds];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    setOrderedIds(newOrder);
    setOrderMessage({ text: "Saving the new order…", isError: false });

    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      startSaving(async () => {
        const result = await saveGalleryOrder(newOrder);
        setOrderMessage(
          result.status === "error"
            ? { text: result.message, isError: true }
            : { text: "Order saved.", isError: false },
        );
      });
    }, orderSaveDelayInMilliseconds);
  }

  if (displayedIds.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-white px-5 py-12 text-center text-muted-foreground shadow-sm">
        No photos yet. Add some above and they&apos;ll appear here and on the
        website&apos;s gallery page.
      </p>
    );
  }

  return (
    <section
      aria-labelledby="gallery-photos-heading"
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="gallery-photos-heading"
          className="text-lg font-bold text-navy-900 uppercase"
        >
          Photos ({displayedIds.length})
        </h2>
        <p
          role="status"
          className={cn(
            "text-sm",
            orderMessage?.isError ? "text-flag-red" : "text-muted-foreground",
          )}
        >
          {orderMessage?.text ??
            "The website shows photos in this order. Use the arrows to rearrange them."}
        </p>
      </div>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {displayedIds.map((id, index) => {
          const image = imagesById.get(id)!;
          const position = index + 1;
          return (
            <li
              key={id}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-navy-900">
                <Image
                  src={getPublicMediaUrl(image.storagePath)}
                  alt={image.altText}
                  fill
                  sizes="(min-width: 1536px) 20vw, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw"
                  placeholder={image.blurPlaceholder ? "blur" : "empty"}
                  blurDataURL={image.blurPlaceholder ?? undefined}
                  className="object-cover"
                />
                <span className="absolute top-2 left-2 rounded-full bg-navy-950/80 px-2 py-0.5 text-xs font-semibold text-white">
                  {position}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-1 p-4">
                <p className="line-clamp-2 text-sm font-medium text-navy-900">
                  {image.altText}
                </p>
                {image.caption && (
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    Caption: {image.caption}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {image.categoryId
                    ? (categoryNames.get(image.categoryId) ??
                      "Unknown category")
                    : "No category"}
                  {" · "}
                  {image.widthInPixels}×{image.heightInPixels}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-1 border-t border-border px-2 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => moveImage(index, 0)}
                >
                  <ChevronsUp aria-hidden="true" />
                  <span className="sr-only">
                    Move photo {position} to the start
                  </span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => moveImage(index, index - 1)}
                >
                  <ArrowUp aria-hidden="true" />
                  <span className="sr-only">Move photo {position} earlier</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={index === displayedIds.length - 1}
                  onClick={() => moveImage(index, index + 1)}
                >
                  <ArrowDown aria-hidden="true" />
                  <span className="sr-only">Move photo {position} later</span>
                </Button>
                <span className="flex-1" />
                <EditGalleryImageDialog
                  image={image}
                  position={position}
                  categories={categories}
                />
                <DeleteGalleryImageButton image={image} position={position} />
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function EditGalleryImageDialog({
  image,
  position,
  categories,
}: {
  image: AdminGalleryImage;
  position: number;
  categories: CategoryOption[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState({
    altText: image.altText,
    caption: image.caption ?? "",
    categoryId: image.categoryId ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSaving, startSaving] = useTransition();
  const fieldId = `gallery-image-${image.id}`;

  function openChange(open: boolean) {
    if (open) {
      // Start from the saved values each time the dialog opens.
      setValues({
        altText: image.altText,
        caption: image.caption ?? "",
        categoryId: image.categoryId ?? "",
      });
      setFieldErrors({});
      setErrorMessage(undefined);
    }
    setIsOpen(open);
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = galleryImageDetailsSchema.safeParse(values);
    if (!validation.success) {
      setFieldErrors(toFieldErrors(validation.error));
      return;
    }
    setFieldErrors({});
    startSaving(async () => {
      const result = await updateGalleryImage(image.id, values);
      if (result.status === "error") {
        setErrorMessage(result.message);
        setFieldErrors(result.fieldErrors ?? {});
      } else {
        setIsOpen(false);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={openChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          <Pencil aria-hidden="true" />
          <span className="sr-only">Edit photo {position}</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit photo {position}</DialogTitle>
          <DialogDescription>
            Changes show on the website straight away.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={save} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`${fieldId}-alt`}
              className="text-sm font-semibold text-navy-900"
            >
              Description
            </label>
            <input
              id={`${fieldId}-alt`}
              value={values.altText}
              maxLength={200}
              aria-invalid={fieldErrors.altText ? true : undefined}
              aria-describedby={
                fieldErrors.altText ? `${fieldId}-alt-error` : undefined
              }
              onChange={(event) =>
                setValues({ ...values, altText: event.target.value })
              }
              className={formControlClassName}
            />
            {fieldErrors.altText && (
              <p id={`${fieldId}-alt-error`} className="text-sm text-flag-red">
                {fieldErrors.altText}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`${fieldId}-caption`}
              className="text-sm font-semibold text-navy-900"
            >
              Caption{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <input
              id={`${fieldId}-caption`}
              value={values.caption}
              maxLength={300}
              aria-invalid={fieldErrors.caption ? true : undefined}
              onChange={(event) =>
                setValues({ ...values, caption: event.target.value })
              }
              className={formControlClassName}
            />
            {fieldErrors.caption && (
              <p className="text-sm text-flag-red">{fieldErrors.caption}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              htmlFor={`${fieldId}-category`}
              className="text-sm font-semibold text-navy-900"
            >
              Category
            </label>
            <select
              id={`${fieldId}-category`}
              value={values.categoryId}
              onChange={(event) =>
                setValues({ ...values, categoryId: event.target.value })
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
          {errorMessage && (
            <p role="alert" className="text-sm text-flag-red">
              {errorMessage}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteGalleryImageButton({
  image,
  position,
}: {
  image: AdminGalleryImage;
  position: number;
}) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isDeleting, startDeleting] = useTransition();

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            className="text-flag-red"
          >
            <Trash2 aria-hidden="true" />
            <span className="sr-only">Delete photo {position}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{image.altText}&rdquo; will be removed from the website and
              the file deleted. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                startDeleting(async () => {
                  const result = await deleteGalleryImage(image.id);
                  if (result.status === "error")
                    setErrorMessage(result.message);
                })
              }
              className="bg-flag-red text-white hover:bg-flag-red/90"
            >
              Delete photo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {errorMessage && (
        <p role="alert" className="w-full text-xs text-flag-red">
          {errorMessage}
        </p>
      )}
    </>
  );
}
