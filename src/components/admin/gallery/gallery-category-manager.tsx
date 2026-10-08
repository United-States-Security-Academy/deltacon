"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, useTransition } from "react";

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
import { galleryCategoryNameSchema } from "@/lib/validation/gallery-schemas";
import {
  createGalleryCategory,
  deleteGalleryCategory,
  renameGalleryCategory,
} from "@/server/actions/admin/gallery-actions";
import type { AdminGalleryCategory } from "@/server/queries/admin-gallery";

/** Adds, renames and deletes the categories visitors can filter the gallery by. */
export function GalleryCategoryManager({
  categories,
}: {
  categories: AdminGalleryCategory[];
}) {
  const [newName, setNewName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isAdding, startAdding] = useTransition();

  function addCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = galleryCategoryNameSchema.safeParse({ name: newName });
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message);
      return;
    }
    setErrorMessage(undefined);
    startAdding(async () => {
      const result = await createGalleryCategory(validation.data);
      if (result.status === "error") setErrorMessage(result.message);
      else setNewName("");
    });
  }

  return (
    <section
      aria-labelledby="gallery-categories-heading"
      className="rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <h2
        id="gallery-categories-heading"
        className="mb-1 text-lg font-bold text-navy-900 uppercase"
      >
        Categories
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Visitors can filter the gallery by these. Empty categories are hidden on
        the website.
      </p>

      {categories.length > 0 && (
        <ul className="mb-5 divide-y divide-border">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      )}

      <form onSubmit={addCategory} noValidate className="flex flex-col gap-2">
        <label
          htmlFor="new-gallery-category"
          className="text-sm font-semibold text-navy-900"
        >
          New category
        </label>
        <div className="flex gap-2">
          <input
            id="new-gallery-category"
            value={newName}
            maxLength={40}
            placeholder="e.g. Community events"
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={
              errorMessage ? "new-gallery-category-error" : undefined
            }
            onChange={(event) => setNewName(event.target.value)}
            className={formControlClassName}
          />
          <Button type="submit" size="lg" className="h-11" disabled={isAdding}>
            <Plus aria-hidden="true" />
            Add
          </Button>
        </div>
        {errorMessage && (
          <p
            id="new-gallery-category-error"
            role="alert"
            className="text-sm text-flag-red"
          >
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}

function CategoryRow({ category }: { category: AdminGalleryCategory }) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [name, setName] = useState(category.name);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSaving, startSaving] = useTransition();
  const inputId = `gallery-category-${category.id}`;

  function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = galleryCategoryNameSchema.safeParse({ name });
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message);
      return;
    }
    startSaving(async () => {
      const result = await renameGalleryCategory(category.id, validation.data);
      if (result.status === "error") {
        setErrorMessage(result.message);
      } else {
        setErrorMessage(undefined);
        setIsRenaming(false);
      }
    });
  }

  const photoCount = `${category.imageCount} photo${category.imageCount === 1 ? "" : "s"}`;

  return (
    <li className="flex flex-col gap-1 py-3">
      {isRenaming ? (
        <form
          onSubmit={saveName}
          noValidate
          className="flex items-center gap-2"
        >
          <label htmlFor={inputId} className="sr-only">
            New name for {category.name}
          </label>
          <input
            id={inputId}
            value={name}
            maxLength={40}
            autoFocus
            onChange={(event) => setName(event.target.value)}
            className={formControlClassName}
          />
          <Button type="submit" variant="ghost" size="icon" disabled={isSaving}>
            <Check aria-hidden="true" />
            <span className="sr-only">Save name</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setName(category.name);
              setErrorMessage(undefined);
              setIsRenaming(false);
            }}
          >
            <X aria-hidden="true" />
            <span className="sr-only">Cancel renaming</span>
          </Button>
        </form>
      ) : (
        <div className="flex items-center gap-2">
          <p className="flex-1">
            <span className="font-medium text-navy-900">{category.name}</span>
            <span className="ml-2 text-xs text-muted-foreground">
              {photoCount}
            </span>
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsRenaming(true)}
          >
            <Pencil aria-hidden="true" />
            <span className="sr-only">Rename {category.name}</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isSaving}
                className="text-flag-red"
              >
                <Trash2 aria-hidden="true" />
                <span className="sr-only">Delete {category.name}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete the {category.name} category?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {category.imageCount > 0
                    ? `Its ${photoCount} stay in the gallery, just without a category.`
                    : "It has no photos."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    startSaving(async () => {
                      const result = await deleteGalleryCategory(category.id);
                      if (result.status === "error")
                        setErrorMessage(result.message);
                    })
                  }
                  className="bg-flag-red text-white hover:bg-flag-red/90"
                >
                  Delete category
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
      {errorMessage && (
        <p role="alert" className="text-sm text-flag-red">
          {errorMessage}
        </p>
      )}
    </li>
  );
}
