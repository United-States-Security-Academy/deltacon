import "server-only";

import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html/server";
import sanitizeHtml from "sanitize-html";

import { publicMediaBucket } from "@/lib/storage/public-media";

import { postContentExtensions } from "./post-content-extensions";

/*
 * Turns the editor's saved document into safe HTML for the public site.
 *
 * Even though the editor only produces allowed elements, everything that
 * arrives from a browser is treated as untrusted: the HTML is generated on
 * the server from the document, then passed through a strict allowlist.
 * Scripts, event handlers, styles and unknown elements are always removed.
 */

const wordsReadPerMinute = 220;

/** Images may only come from the site's own public storage bucket. */
function isOwnPublicImage(source: string): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(
    supabaseUrl &&
    source.startsWith(
      `${supabaseUrl}/storage/v1/object/public/${publicMediaBucket}/`,
    ),
  );
}

/** Embeds may only be YouTube video players. */
function isYoutubeEmbed(source: string): boolean {
  return /^https:\/\/www\.youtube(-nocookie)?\.com\/embed\/[\w-]+/.test(source);
}

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "h2",
    "h3",
    "h4",
    "strong",
    "em",
    "u",
    "s",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "br",
    "hr",
    "img",
    "div",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "loading", "decoding", "width", "height"],
    div: ["data-youtube-video"],
    iframe: [
      "src",
      "width",
      "height",
      "allowfullscreen",
      "allow",
      "title",
      "loading",
    ],
    ol: ["start"],
    code: ["class"],
  },
  allowedClasses: { code: [/^language-[\w-]+$/] },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href", "src"],
  allowProtocolRelative: false,
  // Images are checked in transformTags below (which runs first and
  // rewrites their address), embeds here.
  exclusiveFilter: (frame) =>
    frame.tag === "iframe" && !isYoutubeEmbed(frame.attribs.src ?? ""),
  transformTags: {
    // External links open in a new tab and pass no referrer or page access.
    a: (tagName, attributes) => {
      const href = attributes.href ?? "";
      const linkAttributes: sanitizeHtml.Attributes = { href };
      if (/^https?:\/\//.test(href)) {
        linkAttributes.target = "_blank";
        linkAttributes.rel = "noopener noreferrer";
      }
      return { tagName, attribs: linkAttributes };
    },
    // Images from the site's own storage are served through Next.js image
    // optimisation and load lazily. Any other image becomes a tag that isn't
    // on the allowlist, so it is dropped.
    img: (tagName, attributes) => {
      const source = attributes.src ?? "";
      if (!isOwnPublicImage(source)) {
        return { tagName: "removed-image", attribs: {} };
      }
      return {
        tagName,
        attribs: {
          src: `/_next/image?url=${encodeURIComponent(source)}&w=1200&q=80`,
          alt: attributes.alt ?? "",
          ...(attributes.title ? { title: attributes.title } : {}),
          loading: "lazy",
          decoding: "async",
        },
      };
    },
    iframe: (tagName, attributes) => ({
      tagName,
      attribs: {
        ...attributes,
        title: attributes.title ?? "YouTube video",
        loading: "lazy",
        allow:
          "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen",
      },
    }),
  },
};

/** Collects all the text in a document, for search and reading time. */
function extractPlainText(node: JSONContent): string {
  if (node.type === "text") return node.text ?? "";
  const childText = (node.content ?? []).map(extractPlainText);
  const isBlock = node.type !== "text" && node.type !== "hardBreak";
  return childText.join(isBlock ? " " : "");
}

export type ProcessedPostContent = {
  html: string;
  plainText: string;
  readingTimeInMinutes: number;
};

export function processPostContent(
  document: JSONContent,
): ProcessedPostContent {
  const unsafeHtml = generateHTML(document, postContentExtensions);
  const html = sanitizeHtml(unsafeHtml, sanitizeOptions);
  const plainText = extractPlainText(document).replace(/\s+/g, " ").trim();
  const wordCount = plainText ? plainText.split(" ").length : 0;
  return {
    html,
    plainText,
    readingTimeInMinutes: Math.max(
      1,
      Math.round(wordCount / wordsReadPerMinute),
    ),
  };
}

/** True when the document has any text, image or video in it. */
export function documentHasContent(document: JSONContent): boolean {
  const visit = (node: JSONContent): boolean =>
    (node.type === "text" && Boolean(node.text?.trim())) ||
    node.type === "image" ||
    node.type === "youtube" ||
    (node.content ?? []).some(visit);
  return visit(document);
}
