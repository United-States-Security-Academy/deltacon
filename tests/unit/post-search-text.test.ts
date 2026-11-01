import { describe, expect, it } from "vitest";

import {
  describeCoverImage,
  describePostForSearch,
} from "@/lib/blog/post-search-text";

const body =
  "By Deltacon Global Inc. DBA Deltacon Security – Texas License # B05205701 · Published January 27, 2026 · 7 min read Hiring a security guard company means trusting another organization with your people, property, and reputation. A polished proposal and competitive hourly rate are useful starting points, but they reveal little about how officers will perform.";

describe("search description for a blog post", () => {
  const post = {
    title: "How to Choose a Security Guard Company in Texas",
    excerpt: "",
    metaDescription: null,
    contentPlainText: body,
  };

  it("uses the admin's search description first", () => {
    expect(
      describePostForSearch({
        ...post,
        metaDescription: "Written for search.",
      }),
    ).toBe("Written for search.");
  });

  it("uses the excerpt when it is a real summary", () => {
    const excerpt =
      "Sugar Land company joins prestigious national ranking and 100 Houston-area honorees";
    expect(describePostForSearch({ ...post, excerpt })).toBe(excerpt);
  });

  it("ignores an excerpt that copies the title or is too short", () => {
    for (const excerpt of [post.title, "FFL"]) {
      const description = describePostForSearch({ ...post, excerpt });
      expect(description.startsWith("Hiring a security guard company")).toBe(
        true,
      );
    }
  });

  it("skips the byline and stays within 160 characters, cut at a word", () => {
    const description = describePostForSearch(post);
    expect(description).not.toMatch(/^By /);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description.endsWith("…")).toBe(true);
    expect(description).not.toMatch(/\s…$/);
  });

  it("removes a byline without a reading time", () => {
    const description = describePostForSearch({
      ...post,
      contentPlainText:
        "By Deltacon Global Inc. DBA Deltacon Security – Texas License # B05205701 · Published September 30, 2021 Federal license authorizes firearms dealing.",
    });
    expect(description).toBe("Federal license authorizes firearms dealing.");
  });
});

describe("cover image alt text", () => {
  const title = "Deltacon Global Named to the 2026 Inc. 5000 List";

  it("keeps a real description", () => {
    expect(
      describeCoverImage({
        title,
        coverImageAltText: "WSS-DELTACON AGREEMENT REPLICA",
      }),
    ).toBe("WSS-DELTACON AGREEMENT REPLICA");
  });

  it("falls back to the post title for empty or placeholder text", () => {
    for (const coverImageAltText of [
      null,
      "",
      "Thumbnail",
      "Deltacon Logo",
      "FFL",
    ]) {
      expect(describeCoverImage({ title, coverImageAltText })).toBe(title);
    }
  });
});
