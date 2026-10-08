import { describe, expect, it } from "vitest";

import {
  galleryCategoryChoiceRule,
  galleryOrderSchema,
  galleryStoragePathRule,
  newGalleryImageSchema,
} from "@/lib/validation/gallery-schemas";
import {
  postFieldsSchema,
  postSaveIntentSchema,
  slugRule,
} from "@/lib/validation/post-schemas";
import {
  buildSubmissionFiltersQuery,
  readSubmissionFilters,
} from "@/lib/validation/submission-inbox-schemas";

const uuid = "3f2b8c1a-9d4e-4f6a-8b2c-1d3e5f7a9b0c";

describe("blog post rules", () => {
  const validPost = {
    title: "Five retail security tips",
    slug: "five-retail-security-tips",
    excerpt: "Simple steps that stop shoplifting.",
    category: "blog",
    tagNames: ["Retail"],
    coverImagePath: `posts/2026-10/${uuid}.jpg`,
    coverImageAltText: "Officer at a store entrance",
    seoTitle: "",
    metaDescription: "",
    contentJson: { type: "doc", content: [] },
  };

  it("accepts a complete post", () => {
    expect(postFieldsSchema.safeParse(validPost).success).toBe(true);
  });

  it.each(["retail-tips", "tips-2026", "a"])(
    "accepts the address %j",
    (slug) => {
      expect(slugRule.safeParse(slug).success).toBe(true);
    },
  );

  it.each([
    "Retail-Tips",
    "retail--tips",
    "-tips",
    "tips-",
    "retail tips",
    "tips/../x",
  ])("rejects the address %j", (slug) => {
    expect(slugRule.safeParse(slug).success).toBe(false);
  });

  it.each([
    ["outside the posts folder", `gallery/2026-10/${uuid}.jpg`],
    ["climbing out with ..", `posts/../gallery/2026-10/${uuid}.jpg`],
    ["a non-image file", `posts/2026-10/${uuid}.html`],
    ["a full URL", `https://evil.example.com/${uuid}.jpg`],
  ])("rejects a cover image %s", (_reason, coverImagePath) => {
    const result = postFieldsSchema.safeParse({ ...validPost, coverImagePath });
    expect(result.success).toBe(false);
  });

  it("allows no cover image", () => {
    const result = postFieldsSchema.safeParse({
      ...validPost,
      coverImagePath: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects content that isn't an editor document", () => {
    const result = postFieldsSchema.safeParse({
      ...validPost,
      contentJson: { type: "html", value: "<script></script>" },
    });
    expect(result.success).toBe(false);
  });

  it("limits tags to 10", () => {
    const result = postFieldsSchema.safeParse({
      ...validPost,
      tagNames: Array.from({ length: 11 }, (_, index) => `Tag ${index}`),
    });
    expect(result.success).toBe(false);
  });

  it("needs a date with a time zone to schedule a post", () => {
    expect(
      postSaveIntentSchema.safeParse({
        intent: "schedule",
        publishAt: "2026-12-01T09:00:00-06:00",
      }).success,
    ).toBe(true);
    expect(
      postSaveIntentSchema.safeParse({
        intent: "schedule",
        publishAt: "tomorrow",
      }).success,
    ).toBe(false);
    expect(postSaveIntentSchema.safeParse({ intent: "delete" }).success).toBe(
      false,
    );
  });
});

describe("gallery rules", () => {
  it("only accepts uploads in the gallery folder", () => {
    expect(
      galleryStoragePathRule.safeParse(`gallery/2026-10/${uuid}.webp`).success,
    ).toBe(true);
    for (const path of [
      `posts/2026-10/${uuid}.webp`,
      `gallery/../posts/${uuid}.webp`,
      `gallery/2026-10/${uuid}.svg`,
      `gallery/2026-10/not-a-uuid.jpg`,
    ]) {
      expect(galleryStoragePathRule.safeParse(path).success, path).toBe(false);
    }
  });

  it("requires a real description for every photo", () => {
    const photo = {
      storagePath: `gallery/2026-10/${uuid}.jpg`,
      caption: "",
      categoryId: "",
    };
    expect(
      newGalleryImageSchema.safeParse({ ...photo, altText: "   " }).success,
    ).toBe(false);
    expect(
      newGalleryImageSchema.safeParse({ ...photo, altText: "Officer at gate" })
        .success,
    ).toBe(true);
  });

  it("turns an empty category choice into no category", () => {
    expect(galleryCategoryChoiceRule.parse("")).toBeNull();
    expect(galleryCategoryChoiceRule.parse(uuid)).toBe(uuid);
    expect(galleryCategoryChoiceRule.safeParse("drop table").success).toBe(
      false,
    );
  });

  it("rejects an order that lists a photo twice", () => {
    expect(galleryOrderSchema.safeParse([uuid, uuid]).success).toBe(false);
    expect(galleryOrderSchema.safeParse([uuid]).success).toBe(true);
  });
});

describe("submissions inbox filters", () => {
  it("reads valid filters from the address bar", () => {
    expect(
      readSubmissionFilters({
        type: "job_application",
        status: "new",
        q: "  smith ",
        page: "3",
      }),
    ).toEqual({
      formType: "job_application",
      status: "new",
      search: "smith",
      page: 3,
    });
  });

  it("ignores values that aren't allowed instead of failing", () => {
    expect(
      readSubmissionFilters({
        type: "nonsense",
        status: "hacked",
        q: "",
        page: "-4",
      }),
    ).toEqual({
      formType: undefined,
      status: undefined,
      search: undefined,
      page: 1,
    });
  });

  it("builds short inbox addresses, leaving out empty filters", () => {
    expect(buildSubmissionFiltersQuery({})).toBe("");
    expect(
      buildSubmissionFiltersQuery({ formType: "service_request", page: 1 }),
    ).toBe("?type=service_request");
    expect(buildSubmissionFiltersQuery({ search: "a&b", page: 2 })).toBe(
      "?q=a%26b&page=2",
    );
  });
});
