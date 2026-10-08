import { randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import sharp from "sharp";

import { signInAsTestAdmin } from "./support/admin-session";
import {
  insertTestTrainingEnquiry,
  testEmailAddress,
} from "./support/test-data";

test.describe("signing in", () => {
  test("signed-out visitors are sent to the login page", async ({ page }) => {
    await page.goto("/admin/posts");
    await expect(page).toHaveURL(/\/admin\/login\?redirectTo=%2Fadmin%2Fposts/);
  });

  test("a wrong password is refused", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByLabel("Email").fill(process.env.E2E_ADMIN_EMAIL!);
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill("not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("the admin can sign in", async ({ page }) => {
    await signInAsTestAdmin(page);
  });
});

test("an admin writes, publishes and deletes a blog post", async ({ page }) => {
  const title = `E2E test post ${randomBytes(3).toString("hex")}`;
  await signInAsTestAdmin(page);
  await page.goto("/admin/posts");
  await page.getByRole("button", { name: "New post" }).click();
  await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]+\/edit$/);

  await page.getByRole("textbox", { name: "Title", exact: true }).fill(title);
  await page
    .getByLabel("Summary")
    .fill("A post written by an automated browser test.");
  const editor = page.locator('[contenteditable="true"]').first();
  await editor.click();
  await page.keyboard.type(
    "This post checks that publishing works from start to finish.",
  );
  await page.getByRole("button", { name: "Publish now" }).click();
  await expect(page.getByRole("link", { name: /View live/ })).toBeVisible();

  const slug = await page
    .getByRole("textbox", { name: "Web address" })
    .inputValue();
  expect(slug).toMatch(/^e2e-test-post-/);

  // The post appears on the public blog straight away.
  await page.goto("/blog");
  await expect(page.getByRole("link", { name: title }).first()).toBeVisible();
  await page.goto(`/blog/${slug}`);
  await expect(
    page.getByRole("heading", { level: 1, name: title }),
  ).toBeVisible();
  await expect(
    page.getByText("This post checks that publishing works"),
  ).toBeVisible();

  // Deleting takes it off the site.
  await page.goto("/admin/posts");
  await page.getByRole("link", { name: title }).click();
  await page.getByRole("button", { name: "Delete post" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete post" })
    .click();
  await expect(page).toHaveURL(/\/admin\/posts$/);
  expect((await page.goto(`/blog/${slug}`))?.status()).toBe(404);
});

test("an admin works through a submission in the inbox", async ({ page }) => {
  const fullName = `E2E Inbox ${randomBytes(3).toString("hex")}`;
  await insertTestTrainingEnquiry(fullName, testEmailAddress("inbox"));
  await signInAsTestAdmin(page);

  await page.goto("/admin/submissions?type=training_enquiry");
  await page.getByRole("link", { name: fullName }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: fullName }),
  ).toBeVisible();

  await page.getByLabel("Status").selectOption("contacted");
  await expect(page.getByText("Status saved.")).toBeVisible();

  const noteBox = page.getByLabel("Add a note");
  await noteBox.fill("Called back by the automated test.");
  await page.getByRole("button", { name: "Save note" }).click();
  // The box empties only once the note is saved.
  await expect(noteBox).toHaveValue("");
  await expect(
    page.getByRole("listitem").filter({
      hasText: "Called back by the automated test.",
    }),
  ).toBeVisible();

  // The CSV export includes it.
  await page.goto(
    `/admin/submissions?type=training_enquiry&q=${encodeURIComponent(fullName)}`,
  );
  const downloadStarted = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export CSV" }).click();
  const download = await downloadStarted;
  expect(download.suggestedFilename()).toMatch(
    /^deltacon-submissions-training-enquiry-.*\.csv$/,
  );
  const csv = await (
    await import("node:fs/promises")
  ).readFile(await download.path(), "utf8");
  expect(csv).toContain(fullName);
  expect(csv).toContain("Contacted");

  await page.getByRole("link", { name: fullName }).click();
  await page.getByRole("button", { name: "Delete submission" }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete for good" })
    .click();
  await expect(page).toHaveURL(/\/admin\/submissions$/);
  await expect(page.getByRole("link", { name: fullName })).toHaveCount(0);
});

test("an admin adds a photo to the gallery and removes it", async ({
  page,
}) => {
  const description = `E2E photo of a patrol car ${randomBytes(3).toString("hex")}`;
  const photo = await sharp({
    create: { width: 1200, height: 800, channels: 3, background: "#1e3557" },
  })
    .jpeg()
    .toBuffer();

  await signInAsTestAdmin(page);
  await page.goto("/admin/gallery");
  await page.locator('input[type="file"]').setInputFiles({
    name: "e2e-photo.jpg",
    mimeType: "image/jpeg",
    buffer: photo,
  });
  await page.getByRole("button", { name: "Upload 1 photo" }).click();
  // A description is required before anything uploads.
  await expect(
    page.getByText("Add a description to every photo before uploading."),
  ).toBeVisible();
  await page.getByLabel("Description").fill(description);
  await page.getByRole("button", { name: "Upload 1 photo" }).click();
  await expect(page.getByText("1 photo added to the gallery.")).toBeVisible({
    timeout: 30_000,
  });

  const photoCard = page.getByRole("listitem").filter({ hasText: description });
  await expect(photoCard).toContainText("1200×800");

  await page.goto("/gallery");
  await expect(page.getByRole("img", { name: description })).toBeVisible();
  await page.getByRole("button", { name: "Open larger view" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");

  await page.goto("/admin/gallery");
  await photoCard.getByRole("button", { name: /Delete photo/ }).click();
  await page
    .getByRole("alertdialog")
    .getByRole("button", { name: "Delete photo" })
    .click();
  await expect(
    page.getByRole("listitem").filter({ hasText: description }),
  ).toHaveCount(0);
});
