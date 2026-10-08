"use client";

import type { JSONContent } from "@tiptap/core";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import {
  EditorContent,
  useEditor,
  useEditorState,
  type Editor,
} from "@tiptap/react";
import {
  Bold,
  Heading2,
  Heading3,
  Heading4,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  LoaderCircle,
  Redo2,
  SeparatorHorizontal,
  SquareCode,
  Strikethrough,
  TextQuote,
  Underline,
  Undo2,
  Unlink,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";

import { TextPromptDialog } from "@/components/admin/posts/text-prompt-dialog";
import { postContentExtensions } from "@/lib/blog/post-content-extensions";
import { getPublicMediaUrl } from "@/lib/storage/public-media";
import {
  acceptedImageTypesForInput,
  uploadPublicImage,
} from "@/lib/storage/upload-public-image";
import { cn } from "@/lib/utils";

type ToolbarButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
  isDisabled?: boolean;
};

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
  isActive = false,
  isDisabled = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={isActive}
      title={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-md text-navy-800 transition-colors hover:bg-navy-100 disabled:opacity-40",
        isActive && "bg-navy-900 text-gold-300 hover:bg-navy-800",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="mx-1 h-6 w-px bg-border" />;
}

type PromptKind = "link" | "video" | "imageDescription";

function isValidLink(value: string): string | undefined {
  if (!value) return undefined; // empty removes the link
  return /^(https?:\/\/|mailto:|tel:|\/)/.test(value)
    ? undefined
    : "Start the link with https://, mailto:, tel: or / for a page on this site.";
}

function isYoutubeLink(value: string): string | undefined {
  return /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+/.test(
    value,
  )
    ? undefined
    : "Paste a YouTube video address, e.g. https://www.youtube.com/watch?v=…";
}

function EditorToolbar({
  editor,
  onRequestPrompt,
  onChooseImage,
  isUploadingImage,
}: {
  editor: Editor;
  onRequestPrompt: (kind: PromptKind) => void;
  onChooseImage: () => void;
  isUploadingImage: boolean;
}) {
  // Re-render the toolbar when the selection or formatting changes.
  const state = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) => ({
      canUndo: currentEditor.can().undo(),
      canRedo: currentEditor.can().redo(),
      isHeading2: currentEditor.isActive("heading", { level: 2 }),
      isHeading3: currentEditor.isActive("heading", { level: 3 }),
      isHeading4: currentEditor.isActive("heading", { level: 4 }),
      isBold: currentEditor.isActive("bold"),
      isItalic: currentEditor.isActive("italic"),
      isUnderline: currentEditor.isActive("underline"),
      isStrike: currentEditor.isActive("strike"),
      isBulletList: currentEditor.isActive("bulletList"),
      isOrderedList: currentEditor.isActive("orderedList"),
      isBlockquote: currentEditor.isActive("blockquote"),
      isCodeBlock: currentEditor.isActive("codeBlock"),
      isLink: currentEditor.isActive("link"),
    }),
  });
  const chain = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className="sticky top-16 z-10 flex flex-wrap items-center gap-0.5 rounded-t-lg border border-b-0 border-border bg-white/95 p-1.5 backdrop-blur lg:top-0"
    >
      <ToolbarButton
        label="Undo"
        icon={Undo2}
        onClick={() => chain().undo().run()}
        isDisabled={!state.canUndo}
      />
      <ToolbarButton
        label="Redo"
        icon={Redo2}
        onClick={() => chain().redo().run()}
        isDisabled={!state.canRedo}
      />
      <ToolbarDivider />
      <ToolbarButton
        label="Heading"
        icon={Heading2}
        onClick={() => chain().toggleHeading({ level: 2 }).run()}
        isActive={state.isHeading2}
      />
      <ToolbarButton
        label="Subheading"
        icon={Heading3}
        onClick={() => chain().toggleHeading({ level: 3 }).run()}
        isActive={state.isHeading3}
      />
      <ToolbarButton
        label="Small heading"
        icon={Heading4}
        onClick={() => chain().toggleHeading({ level: 4 }).run()}
        isActive={state.isHeading4}
      />
      <ToolbarDivider />
      <ToolbarButton
        label="Bold"
        icon={Bold}
        onClick={() => chain().toggleBold().run()}
        isActive={state.isBold}
      />
      <ToolbarButton
        label="Italic"
        icon={Italic}
        onClick={() => chain().toggleItalic().run()}
        isActive={state.isItalic}
      />
      <ToolbarButton
        label="Underline"
        icon={Underline}
        onClick={() => chain().toggleUnderline().run()}
        isActive={state.isUnderline}
      />
      <ToolbarButton
        label="Strikethrough"
        icon={Strikethrough}
        onClick={() => chain().toggleStrike().run()}
        isActive={state.isStrike}
      />
      <ToolbarDivider />
      <ToolbarButton
        label="Bulleted list"
        icon={List}
        onClick={() => chain().toggleBulletList().run()}
        isActive={state.isBulletList}
      />
      <ToolbarButton
        label="Numbered list"
        icon={ListOrdered}
        onClick={() => chain().toggleOrderedList().run()}
        isActive={state.isOrderedList}
      />
      <ToolbarButton
        label="Quote"
        icon={TextQuote}
        onClick={() => chain().toggleBlockquote().run()}
        isActive={state.isBlockquote}
      />
      <ToolbarButton
        label="Code block"
        icon={SquareCode}
        onClick={() => chain().toggleCodeBlock().run()}
        isActive={state.isCodeBlock}
      />
      <ToolbarButton
        label="Divider line"
        icon={SeparatorHorizontal}
        onClick={() => chain().setHorizontalRule().run()}
      />
      <ToolbarDivider />
      <ToolbarButton
        label={state.isLink ? "Edit link" : "Add link"}
        icon={Link2}
        onClick={() => onRequestPrompt("link")}
        isActive={state.isLink}
      />
      {state.isLink && (
        <ToolbarButton
          label="Remove link"
          icon={Unlink}
          onClick={() => chain().extendMarkRange("link").unsetLink().run()}
        />
      )}
      <ToolbarButton
        label={isUploadingImage ? "Uploading image…" : "Add image"}
        icon={isUploadingImage ? LoaderCircle : ImagePlus}
        onClick={onChooseImage}
        isDisabled={isUploadingImage}
      />
      <ToolbarButton
        label="Add YouTube video"
        icon={Video}
        onClick={() => onRequestPrompt("video")}
      />
    </div>
  );
}

type RichTextEditorProps = {
  initialContent: JSONContent;
  onChange: (content: JSONContent) => void;
  labelId: string;
  errorMessage?: string;
};

/**
 * Distraction-free post editor: headings, bold/italic/underline, lists,
 * quotes, links, images (uploaded to storage), YouTube videos, code blocks and
 * undo/redo. Uses the same building blocks as the server, so what you see is
 * what gets published.
 */
export function RichTextEditor({
  initialContent,
  onChange,
  labelId,
  errorMessage,
}: RichTextEditorProps) {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [openPrompt, setOpenPrompt] = useState<PromptKind | null>(null);
  const [pendingImageUrl, setPendingImageUrl] = useState<string>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState<string>();

  const editor = useEditor({
    extensions: [
      ...postContentExtensions,
      Placeholder.configure({ placeholder: "Start writing your post…" }),
      CharacterCount,
    ],
    content: initialContent,
    // Rendered only in the browser, so there is no server/client mismatch.
    immediatelyRender: false,
    editorProps: {
      attributes: {
        "aria-labelledby": labelId,
        "aria-multiline": "true",
        role: "textbox",
        class:
          "prose prose-lg max-w-none min-h-[28rem] px-5 py-4 focus:outline-none prose-headings:font-heading prose-headings:uppercase prose-headings:text-navy-900 prose-a:text-gold-700 prose-img:rounded-lg",
      },
    },
    onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getJSON()),
  });

  const wordCount = useEditorState({
    editor,
    selector: ({ editor: currentEditor }) =>
      currentEditor?.storage.characterCount.words() ?? 0,
  });

  async function handleImageChosen(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editor) return;
    setImageErrorMessage(undefined);
    setIsUploadingImage(true);
    const result = await uploadPublicImage(file, "posts");
    setIsUploadingImage(false);
    if ("error" in result) {
      setImageErrorMessage(result.error);
      return;
    }
    // Ask for a description before inserting, for screen-reader users.
    setPendingImageUrl(getPublicMediaUrl(result.storagePath));
    setOpenPrompt("imageDescription");
  }

  return (
    <div className="flex flex-col gap-2">
      {editor && (
        <EditorToolbar
          editor={editor}
          onRequestPrompt={setOpenPrompt}
          onChooseImage={() => imageInputRef.current?.click()}
          isUploadingImage={isUploadingImage}
        />
      )}
      <div
        className={cn(
          "-mt-2 rounded-b-lg border border-border bg-white",
          errorMessage && "border-flag-red",
        )}
      >
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between gap-3 text-sm">
        <p className="font-medium text-flag-red">
          {errorMessage ?? imageErrorMessage}
        </p>
        <p className="text-muted-foreground" aria-live="polite">
          {wordCount} words
        </p>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept={acceptedImageTypesForInput}
        onChange={handleImageChosen}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />

      {editor && (
        <>
          <TextPromptDialog
            isOpen={openPrompt === "link"}
            title="Link"
            description="Paste the address to link to. Leave it empty to remove the link."
            fieldLabel="Link address"
            placeholder="https://"
            initialValue={editor.getAttributes("link").href ?? ""}
            submitLabel="Save link"
            validate={isValidLink}
            onSubmit={(href) => {
              const chain = editor.chain().focus().extendMarkRange("link");
              if (href) chain.setLink({ href }).run();
              else chain.unsetLink().run();
            }}
            onClose={() => setOpenPrompt(null)}
          />
          <TextPromptDialog
            isOpen={openPrompt === "video"}
            title="YouTube video"
            description="Paste the address of a YouTube video to show it in the post."
            fieldLabel="YouTube address"
            placeholder="https://www.youtube.com/watch?v=…"
            submitLabel="Add video"
            validate={isYoutubeLink}
            onSubmit={(source) =>
              editor.chain().focus().setYoutubeVideo({ src: source }).run()
            }
            onClose={() => setOpenPrompt(null)}
          />
          <TextPromptDialog
            isOpen={openPrompt === "imageDescription"}
            title="Describe the image"
            description="A short description helps people using screen readers and improves search results."
            fieldLabel="Image description"
            placeholder="e.g. Security officer checking a visitor's badge"
            submitLabel="Insert image"
            validate={(value) =>
              value ? undefined : "Please describe the image."
            }
            onSubmit={(altText) => {
              if (pendingImageUrl) {
                editor
                  .chain()
                  .focus()
                  .setImage({ src: pendingImageUrl, alt: altText })
                  .run();
              }
              setPendingImageUrl(undefined);
            }}
            onClose={() => setOpenPrompt(null)}
          />
        </>
      )}
    </div>
  );
}
