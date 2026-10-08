"use client";

import type { JSONContent } from "@tiptap/core";
import {
  CalendarClock,
  ExternalLink,
  Eye,
  LoaderCircle,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { CoverImageField } from "@/components/admin/posts/cover-image-field";
import { RichTextEditor } from "@/components/admin/posts/rich-text-editor";
import {
  FormField,
  formControlClassName,
  NativeSelect,
} from "@/components/forms/form-field";
import { FormErrorBanner } from "@/components/forms/form-status-messages";
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
import { Textarea } from "@/components/ui/textarea";
import {
  postCategoryLabels,
  postCategoryOrder,
} from "@/config/post-categories";
import { createSlug } from "@/lib/blog/create-slug";
import type { PostCategory, PostStatus } from "@/lib/database/schema/enums";
import { formatAdminDate } from "@/lib/submissions/submission-status";
import { cn } from "@/lib/utils";
import type { PostSaveIntent } from "@/lib/validation/post-schemas";
import {
  deletePost,
  savePost,
  suggestPostSlug,
} from "@/server/actions/admin/post-actions";

export type EditablePost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: PostCategory;
  tagNames: string[];
  coverImagePath: string | null;
  coverImageAltText: string;
  seoTitle: string;
  metaDescription: string;
  contentJson: JSONContent;
  status: PostStatus;
  /** ISO date, or null. */
  publishedAt: string | null;
};

type PostFieldValues = Omit<EditablePost, "id" | "status" | "publishedAt">;
type SaveState = "saved" | "unsaved" | "saving" | "failed";

const autosaveDelayInMilliseconds = 2500;

const categoryOptions = postCategoryOrder.map((category) => ({
  value: category,
  label: postCategoryLabels[category],
}));

/** "Today 2:30 PM" style value for a datetime-local input, in the browser's time zone. */
function toDateTimeInputValue(date: Date): string {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function PostEditor({
  post,
  existingTagNames,
}: {
  post: EditablePost;
  existingTagNames: string[];
}) {
  const [fieldValues, setFieldValues] = useState<PostFieldValues>(() => ({
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    tagNames: post.tagNames,
    coverImagePath: post.coverImagePath,
    coverImageAltText: post.coverImageAltText,
    seoTitle: post.seoTitle,
    metaDescription: post.metaDescription,
    contentJson: post.contentJson,
  }));
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [publishedAt, setPublishedAt] = useState<string | null>(
    post.publishedAt,
  );
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<Date>();
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [newTagName, setNewTagName] = useState("");
  const [isSchedulePanelOpen, setIsSchedulePanelOpen] = useState(false);
  const [scheduleValue, setScheduleValue] = useState(() =>
    toDateTimeInputValue(new Date(Date.now() + 24 * 60 * 60 * 1000)),
  );
  const [busyIntent, setBusyIntent] = useState<PostSaveIntent["intent"] | null>(
    null,
  );

  // The web address follows the title until someone edits it by hand, and
  // never changes automatically once the post has been public.
  const [isSlugAutomatic, setIsSlugAutomatic] = useState(
    post.status === "draft" &&
      !post.publishedAt &&
      (post.slug.startsWith("untitled-") ||
        post.slug === createSlug(post.title)),
  );

  const lastSavedSnapshot = useRef(JSON.stringify(fieldValues));
  const latestFieldValues = useRef(fieldValues);
  useEffect(() => {
    latestFieldValues.current = fieldValues;
  }, [fieldValues]);

  function updateField<FieldName extends keyof PostFieldValues>(
    fieldName: FieldName,
    value: PostFieldValues[FieldName],
  ) {
    setFieldValues((previousValues) => ({
      ...previousValues,
      [fieldName]: value,
    }));
    setFieldErrors((previousErrors) => {
      if (!previousErrors[fieldName]) return previousErrors;
      const remainingErrors = { ...previousErrors };
      delete remainingErrors[fieldName];
      return remainingErrors;
    });
  }

  const runSave = useCallback(
    async (intent: PostSaveIntent): Promise<boolean> => {
      const valuesBeingSaved = latestFieldValues.current;
      setSaveState("saving");
      setBusyIntent(intent.intent);
      setBannerErrorMessage(undefined);
      const result = await savePost(post.id, valuesBeingSaved, intent);
      setBusyIntent(null);

      if (result.status === "error") {
        setSaveState("failed");
        setBannerErrorMessage(result.message);
        setFieldErrors(result.fieldErrors ?? {});
        return false;
      }
      lastSavedSnapshot.current = JSON.stringify(valuesBeingSaved);
      setSaveState(
        JSON.stringify(latestFieldValues.current) === lastSavedSnapshot.current
          ? "saved"
          : "unsaved",
      );
      setLastSavedAt(new Date(result.savedAt));
      setStatus(result.postStatus);
      setPublishedAt(result.publishedAt);
      setFieldErrors({});
      if (result.postStatus !== "draft") setIsSlugAutomatic(false);
      return true;
    },
    [post.id],
  );

  // Track unsaved changes, and autosave drafts a moment after typing stops.
  // Published and scheduled posts are only saved when "Update" is pressed,
  // so half-finished edits never appear on the live site.
  useEffect(() => {
    const hasChanges =
      JSON.stringify(fieldValues) !== lastSavedSnapshot.current;
    if (!hasChanges) return;
    setSaveState((currentState) =>
      currentState === "saving" ? currentState : "unsaved",
    );
    if (status !== "draft") return;
    const timer = window.setTimeout(() => {
      void runSave({ intent: "save" });
    }, autosaveDelayInMilliseconds);
    return () => window.clearTimeout(timer);
  }, [fieldValues, status, runSave]);

  // Warn before leaving the page with unsaved changes.
  useEffect(() => {
    if (saveState !== "unsaved" && saveState !== "failed") return;
    const warnBeforeLeaving = (event: BeforeUnloadEvent) =>
      event.preventDefault();
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [saveState]);

  function handleTitleChange(title: string) {
    updateField("title", title);
    if (isSlugAutomatic)
      updateField("slug", createSlug(title) || fieldValues.slug);
  }

  async function handleTitleBlur() {
    if (!isSlugAutomatic || !fieldValues.title.trim()) return;
    // Make sure the automatic address isn't already used by another post.
    const uniqueSlug = await suggestPostSlug(post.id, fieldValues.title);
    if (uniqueSlug !== latestFieldValues.current.slug)
      updateField("slug", uniqueSlug);
  }

  function addTag() {
    const tagName = newTagName.trim();
    if (!tagName) return;
    const alreadyAdded = fieldValues.tagNames.some(
      (existing) => existing.toLowerCase() === tagName.toLowerCase(),
    );
    if (!alreadyAdded)
      updateField("tagNames", [...fieldValues.tagNames, tagName]);
    setNewTagName("");
  }

  async function openPreview() {
    if (saveState !== "saved") await runSave({ intent: "save" });
    window.open(`/admin/posts/${post.id}/preview`, "_blank", "noopener");
  }

  async function schedulePost() {
    const publishDate = new Date(scheduleValue);
    if (Number.isNaN(publishDate.getTime())) {
      setFieldErrors({ publishAt: "Please choose a date and time." });
      return;
    }
    const scheduled = await runSave({
      intent: "schedule",
      publishAt: publishDate.toISOString(),
    });
    if (scheduled) setIsSchedulePanelOpen(false);
  }

  const isLiveOnSite =
    status === "published" ||
    (status === "scheduled" &&
      publishedAt !== null &&
      new Date(publishedAt) <= new Date());
  const statusLabel = isLiveOnSite
    ? "Published"
    : status === "scheduled"
      ? "Scheduled"
      : "Draft";
  const saveStateMessage = {
    saving: "Saving…",
    saved: lastSavedAt
      ? `Saved ${lastSavedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
      : "All changes saved",
    unsaved:
      status === "draft"
        ? "Unsaved changes…"
        : "Unsaved changes. Press Update to publish them.",
    failed: "Not saved",
  }[saveState];

  const seoTitlePreview = fieldValues.seoTitle || fieldValues.title;
  const metaDescriptionPreview =
    fieldValues.metaDescription || fieldValues.excerpt;

  return (
    <div className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
      {/* Writing area */}
      <div className="flex min-w-0 flex-col gap-6">
        {bannerErrorMessage && <FormErrorBanner message={bannerErrorMessage} />}

        <FormField
          fieldId="post-title"
          label="Title"
          isRequired
          errorMessage={fieldErrors.title}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              value={fieldValues.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              onBlur={handleTitleBlur}
              className={cn(
                formControlClassName,
                "h-14 font-heading text-2xl font-bold",
              )}
            />
          )}
        </FormField>

        <div className="flex flex-col gap-2">
          <p
            id="post-content-label"
            className="text-sm font-semibold text-navy-900"
          >
            Content{" "}
            <span aria-hidden="true" className="text-flag-red">
              *
            </span>
          </p>
          <RichTextEditor
            initialContent={post.contentJson}
            onChange={(content) => updateField("contentJson", content)}
            labelId="post-content-label"
            errorMessage={fieldErrors.contentJson}
          />
        </div>

        <FormField
          fieldId="post-excerpt"
          label="Summary"
          hint="One or two sentences shown on the blog page and in search results."
          errorMessage={fieldErrors.excerpt}
        >
          {(controlProps) => (
            <Textarea
              {...controlProps}
              value={fieldValues.excerpt}
              onChange={(event) => updateField("excerpt", event.target.value)}
              rows={3}
              maxLength={300}
              className={cn(formControlClassName, "h-auto py-2.5")}
            />
          )}
        </FormField>
      </div>

      {/* Settings sidebar */}
      <aside
        aria-label="Post settings"
        className="flex flex-col gap-5 xl:sticky xl:top-6"
      >
        {/* Publishing */}
        <section
          aria-labelledby="publish-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              id="publish-heading"
              className="text-lg font-bold text-navy-900 uppercase"
            >
              Publish
            </h2>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                isLiveOnSite
                  ? "bg-green-100 text-green-800"
                  : status === "scheduled"
                    ? "bg-navy-100 text-navy-900"
                    : "bg-gray-200 text-gray-700",
              )}
            >
              {statusLabel}
            </span>
          </div>

          {publishedAt && status !== "draft" && (
            <p className="text-sm text-muted-foreground">
              {isLiveOnSite ? "Published" : "Goes live"}{" "}
              {formatAdminDate(new Date(publishedAt))}
            </p>
          )}

          <p
            aria-live="polite"
            className={cn(
              "flex items-center gap-2 text-sm",
              saveState === "failed"
                ? "font-medium text-flag-red"
                : "text-muted-foreground",
            )}
          >
            {saveState === "saving" && (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            )}
            {saveStateMessage}
          </p>

          <div className="flex flex-col gap-2">
            {status === "draft" ? (
              <>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => runSave({ intent: "publish" })}
                  disabled={busyIntent !== null}
                >
                  <Send aria-hidden="true" />
                  {busyIntent === "publish" ? "Publishing…" : "Publish now"}
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsSchedulePanelOpen((isOpen) => !isOpen)}
                  aria-expanded={isSchedulePanelOpen}
                  disabled={busyIntent !== null}
                >
                  <CalendarClock aria-hidden="true" />
                  Schedule for later
                </Button>
              </>
            ) : (
              <Button
                variant="accent"
                size="lg"
                onClick={() =>
                  runSave({
                    intent:
                      status === "scheduled" && !isLiveOnSite
                        ? "save"
                        : "publish",
                  })
                }
                disabled={busyIntent !== null}
              >
                <Send aria-hidden="true" />
                {busyIntent ? "Saving…" : "Update"}
              </Button>
            )}

            {isSchedulePanelOpen && status === "draft" && (
              <div className="flex flex-col gap-3 rounded-lg bg-paper p-3">
                <FormField
                  fieldId="post-publish-at"
                  label="Publish on"
                  isRequired
                  hint="In your computer's time zone."
                  errorMessage={fieldErrors.publishAt}
                >
                  {(controlProps) => (
                    <input
                      {...controlProps}
                      type="datetime-local"
                      value={scheduleValue}
                      min={toDateTimeInputValue(new Date())}
                      onChange={(event) => setScheduleValue(event.target.value)}
                      className={formControlClassName}
                    />
                  )}
                </FormField>
                <Button
                  variant="default"
                  onClick={schedulePost}
                  disabled={busyIntent !== null}
                >
                  {busyIntent === "schedule" ? "Scheduling…" : "Schedule post"}
                </Button>
              </div>
            )}

            {status === "scheduled" && !isLiveOnSite && (
              <Button
                variant="outline"
                onClick={() => runSave({ intent: "publish" })}
                disabled={busyIntent !== null}
              >
                Publish now instead
              </Button>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={openPreview}
                className="text-navy-800"
              >
                <Eye aria-hidden="true" />
                Preview
              </Button>
              {isLiveOnSite && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-navy-800"
                >
                  <a
                    href={`/blog/${fieldValues.slug}`}
                    target="_blank"
                    rel="noopener"
                  >
                    <ExternalLink aria-hidden="true" />
                    View live
                  </a>
                </Button>
              )}
              {status !== "draft" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => runSave({ intent: "unpublish" })}
                  disabled={busyIntent !== null}
                  className="text-navy-800"
                >
                  {busyIntent === "unpublish" ? "Unpublishing…" : "Unpublish"}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Cover image */}
        <section
          aria-labelledby="cover-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
        >
          <h2
            id="cover-heading"
            className="text-lg font-bold text-navy-900 uppercase"
          >
            Cover image
          </h2>
          <CoverImageField
            storagePath={fieldValues.coverImagePath}
            onChange={(storagePath) =>
              updateField("coverImagePath", storagePath)
            }
            errorMessage={fieldErrors.coverImagePath}
          />
          {fieldValues.coverImagePath && (
            <FormField
              fieldId="post-cover-alt"
              label="Describe the image"
              isRequired
              hint="For screen readers and search engines."
              errorMessage={fieldErrors.coverImageAltText}
            >
              {(controlProps) => (
                <input
                  {...controlProps}
                  value={fieldValues.coverImageAltText}
                  onChange={(event) =>
                    updateField("coverImageAltText", event.target.value)
                  }
                  maxLength={200}
                  className={formControlClassName}
                />
              )}
            </FormField>
          )}
        </section>

        {/* Organisation */}
        <section
          aria-labelledby="organise-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
        >
          <h2
            id="organise-heading"
            className="text-lg font-bold text-navy-900 uppercase"
          >
            Category & tags
          </h2>
          <FormField
            fieldId="post-category"
            label="Category"
            isRequired
            errorMessage={fieldErrors.category}
          >
            {(controlProps) => (
              <NativeSelect
                {...controlProps}
                value={fieldValues.category}
                onChange={(event) =>
                  updateField("category", event.target.value as PostCategory)
                }
                options={categoryOptions}
                placeholder="Choose a category"
              />
            )}
          </FormField>

          <FormField
            fieldId="post-new-tag"
            label="Tags"
            hint="Press Enter to add a tag."
            errorMessage={fieldErrors.tagNames}
          >
            {(controlProps) => (
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input
                    {...controlProps}
                    value={newTagName}
                    onChange={(event) => setNewTagName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        addTag();
                      }
                    }}
                    list="existing-tag-names"
                    maxLength={40}
                    className={formControlClassName}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addTag}
                    className="h-11"
                  >
                    Add
                  </Button>
                </div>
                <datalist id="existing-tag-names">
                  {existingTagNames.map((tagName) => (
                    <option key={tagName} value={tagName} />
                  ))}
                </datalist>
                {fieldValues.tagNames.length > 0 && (
                  <ul className="flex flex-wrap gap-2">
                    {fieldValues.tagNames.map((tagName) => (
                      <li
                        key={tagName}
                        className="flex items-center gap-1 rounded-full bg-navy-100 py-1 pr-1 pl-3 text-sm text-navy-900"
                      >
                        {tagName}
                        <button
                          type="button"
                          onClick={() =>
                            updateField(
                              "tagNames",
                              fieldValues.tagNames.filter(
                                (existing) => existing !== tagName,
                              ),
                            )
                          }
                          className="flex size-6 items-center justify-center rounded-full hover:bg-navy-200"
                        >
                          <X aria-hidden="true" className="size-3.5" />
                          <span className="sr-only">Remove tag {tagName}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </FormField>
        </section>

        {/* Address and search */}
        <section
          aria-labelledby="seo-heading"
          className="flex flex-col gap-4 rounded-xl border border-border bg-white p-5 shadow-sm"
        >
          <h2
            id="seo-heading"
            className="text-lg font-bold text-navy-900 uppercase"
          >
            Web address & search
          </h2>
          <FormField
            fieldId="post-slug"
            label="Web address"
            isRequired
            hint={`deltacon…/blog/${fieldValues.slug || "your-post"}`}
            errorMessage={fieldErrors.slug}
          >
            {(controlProps) => (
              <input
                {...controlProps}
                value={fieldValues.slug}
                onChange={(event) => {
                  setIsSlugAutomatic(false);
                  updateField(
                    "slug",
                    event.target.value.toLowerCase().replace(/\s+/g, "-"),
                  );
                }}
                className={formControlClassName}
              />
            )}
          </FormField>
          <FormField
            fieldId="post-seo-title"
            label="Search title"
            hint={`${seoTitlePreview.length}/70 characters. Leave empty to use the post title.`}
            errorMessage={fieldErrors.seoTitle}
          >
            {(controlProps) => (
              <input
                {...controlProps}
                value={fieldValues.seoTitle}
                onChange={(event) =>
                  updateField("seoTitle", event.target.value)
                }
                maxLength={70}
                className={formControlClassName}
              />
            )}
          </FormField>
          <FormField
            fieldId="post-meta-description"
            label="Search description"
            hint={`${metaDescriptionPreview.length}/160 characters. Leave empty to use the summary.`}
            errorMessage={fieldErrors.metaDescription}
          >
            {(controlProps) => (
              <Textarea
                {...controlProps}
                value={fieldValues.metaDescription}
                onChange={(event) =>
                  updateField("metaDescription", event.target.value)
                }
                rows={3}
                maxLength={160}
                className={cn(formControlClassName, "h-auto py-2.5")}
              />
            )}
          </FormField>
          <div
            aria-label="Search result preview"
            className="rounded-lg bg-paper p-3"
          >
            <p className="text-xs text-green-800">
              deltacon1.com › blog › {fieldValues.slug}
            </p>
            <p className="line-clamp-1 text-base font-medium text-[#1a0dab]">
              {seoTitlePreview || "Post title"}
            </p>
            <p className="line-clamp-2 text-sm text-charcoal">
              {metaDescriptionPreview || "Your summary will appear here."}
            </p>
          </div>
        </section>

        {/* Delete */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="self-start text-flag-red">
              <Trash2 aria-hidden="true" />
              Delete post
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this post?</AlertDialogTitle>
              <AlertDialogDescription>
                &ldquo;{fieldValues.title}&rdquo; will be removed permanently
                {isLiveOnSite ? " and taken off the website" : ""}. This
                can&apos;t be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deletePost(post.id)}
                className="bg-flag-red text-white hover:bg-flag-red/90"
              >
                Delete post
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </aside>
    </div>
  );
}
