import { describe, expect, it } from "vitest";

import { createSlug } from "@/lib/blog/create-slug";
import {
  documentHasContent,
  processPostContent,
} from "@/lib/blog/process-post-content";

import { testSupabaseUrl } from "./support/test-environment";

const ownImage = `${testSupabaseUrl}/storage/v1/object/public/site-media/posts/2026-10/photo.jpg`;

function paragraph(...content: object[]) {
  return { type: "paragraph", content };
}
function text(value: string, marks?: object[]) {
  return { type: "text", text: value, ...(marks ? { marks } : {}) };
}
function link(href: string) {
  return { type: "link", attrs: { href } };
}
function htmlFor(...content: object[]) {
  return processPostContent({ type: "doc", content }).html;
}

describe("processPostContent: what stays", () => {
  it("keeps headings, lists, quotes and code", () => {
    const html = htmlFor(
      { type: "heading", attrs: { level: 2 }, content: [text("Retail tips")] },
      {
        type: "bulletList",
        content: [
          { type: "listItem", content: [paragraph(text("Lock side doors"))] },
        ],
      },
      { type: "blockquote", content: [paragraph(text("Stay alert"))] },
      { type: "codeBlock", content: [text("Gate code")] },
    );
    expect(html).toContain("<h2>Retail tips</h2>");
    expect(html).toContain("<li><p>Lock side doors</p></li>");
    expect(html).toContain("<blockquote>");
    expect(html).toContain("<pre><code");
  });

  it("opens outside links in a new tab without passing on the page", () => {
    const html = htmlFor(
      paragraph(text("Report", [link("https://example.com/report")])),
    );
    expect(html).toContain(
      'href="https://example.com/report" target="_blank" rel="noopener noreferrer"',
    );
  });

  it("keeps the site's own images, served optimised and lazily", () => {
    const html = htmlFor({
      type: "image",
      attrs: { src: ownImage, alt: "Officer at a gate" },
    });
    expect(html).toContain(
      `src="/_next/image?url=${encodeURIComponent(ownImage)}`,
    );
    expect(html).toContain('alt="Officer at a gate"');
    expect(html).toContain('loading="lazy"');
  });

  it("embeds YouTube through the privacy-friendly domain", () => {
    const html = htmlFor({
      type: "youtube",
      attrs: { src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    });
    expect(html).toMatch(
      /<iframe[^>]+src="https:\/\/www\.youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/,
    );
  });
});

describe("processPostContent: what is removed", () => {
  it("removes javascript: links", () => {
    const html = htmlFor(
      paragraph(text("Click", [link("javascript:alert(1)")])),
    );
    expect(html).not.toContain("javascript:");
  });

  it("shows typed HTML as harmless text", () => {
    const html = htmlFor(paragraph(text("<script>alert('x')</script>")));
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });

  it("drops images from other websites (for example tracking pixels)", () => {
    const html = htmlFor({
      type: "image",
      attrs: { src: "https://tracker.example.com/pixel.gif", alt: "pixel" },
    });
    expect(html).not.toContain("tracker.example.com");
    expect(html).not.toContain("<img");
  });

  it("drops images that only pretend to be from our storage", () => {
    const html = htmlFor({
      type: "image",
      attrs: { src: `https://evil.example.com/?${ownImage}`, alt: "fake" },
    });
    expect(html).not.toContain("<img");
  });
});

describe("processPostContent: text and reading time", () => {
  it("extracts searchable text and never shows less than a minute's reading", () => {
    const result = processPostContent({
      type: "doc",
      content: [paragraph(text("Short post"))],
    });
    expect(result.plainText.trim()).toBe("Short post");
    expect(result.readingTimeInMinutes).toBe(1);
  });

  it("estimates longer posts at about 220 words a minute", () => {
    const words = Array.from({ length: 1100 }, () => "word").join(" ");
    const result = processPostContent({
      type: "doc",
      content: [paragraph(text(words))],
    });
    expect(result.readingTimeInMinutes).toBe(5);
  });

  it("knows when a document is empty", () => {
    expect(
      documentHasContent({ type: "doc", content: [{ type: "paragraph" }] }),
    ).toBe(false);
    expect(
      documentHasContent({ type: "doc", content: [paragraph(text("Hi"))] }),
    ).toBe(true);
    expect(
      documentHasContent({
        type: "doc",
        content: [{ type: "image", attrs: { src: ownImage } }],
      }),
    ).toBe(true);
  });
});

describe("createSlug", () => {
  it.each([
    ["5 Tips for Retail Security!", "5-tips-for-retail-security"],
    ["Safety & Security", "safety-and-security"],
    ["Café Résumé", "cafe-resume"],
    ["  --Hello   World--  ", "hello-world"],
    ["!!!", ""],
  ])("turns %j into %j", (title, slug) => {
    expect(createSlug(title)).toBe(slug);
  });

  it("keeps addresses to 80 characters without a trailing dash", () => {
    const slug = createSlug(`${"word ".repeat(40)}`);
    expect(slug.length).toBeLessThanOrEqual(80);
    expect(slug.endsWith("-")).toBe(false);
  });
});
