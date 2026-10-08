import { expect, test, type Page } from "@playwright/test";

import { findTestSubmission, testEmailAddress } from "./support/test-data";

/** Waits for Cloudflare's test widget to hand the form its pass token. */
async function waitForSecurityCheck(page: Page) {
  await expect(page.locator('input[name="cf-turnstile-response"]')).toHaveValue(
    /.+/,
    {
      timeout: 30_000,
    },
  );
}

/** Picks the first real option of a drop-down (the first one is the "choose…" prompt). */
async function chooseFirstOption(page: Page, label: string) {
  const select = page.getByLabel(label);
  const firstValue = await select
    .locator("option")
    .nth(1)
    .getAttribute("value");
  await select.selectOption(firstValue!);
}

test.describe("Request Service form", () => {
  test("explains what's missing instead of sending an empty form", async ({
    page,
  }) => {
    await page.goto("/request-service");
    await page.getByRole("button", { name: "Send request" }).click();
    await expect(page.getByText("Please enter your full name.")).toBeVisible();
    await expect(
      page.getByText("Please enter your email address."),
    ).toBeVisible();
    await expect(page.getByLabel("Full name")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  test("sends a complete request and saves it", async ({ page }) => {
    const email = testEmailAddress("service");
    await page.goto("/request-service");
    await page.getByLabel("Full name").fill("E2E Service Visitor");
    await page.getByLabel("Company").fill("E2E Testing Ltd");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Phone").fill("832-555-0101");
    await chooseFirstOption(page, "Service needed");
    await page.getByLabel("Industry").selectOption("other");
    await page.getByLabel("Site location").fill("Sugar Land, TX");
    await page
      .getByLabel("Number of guards / estimated scope")
      .fill("2 guards");
    await page
      .getByLabel("Message")
      .fill("Automated test request, please ignore.");
    await waitForSecurityCheck(page);
    await page.getByRole("button", { name: "Send request" }).click();

    await expect(page.getByText("Request received")).toBeVisible();
    const saved = await findTestSubmission(email);
    expect(saved?.form_type).toBe("service_request");
    expect(saved?.status).toBe("new");
  });
});

test("Apply Now form uploads a CV and saves the application", async ({
  page,
}) => {
  const email = testEmailAddress("applicant");
  await page.goto("/apply");
  await page.getByLabel("Full name").fill("E2E Applicant");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Phone").fill("832-555-0102");
  await chooseFirstOption(page, "Position applied for");
  await page.getByLabel("Years of security experience").fill("3");
  await page.getByLabel("Where do you live?").fill("Houston, TX");
  await chooseFirstOption(page, "Availability");
  await page
    .getByLabel("Short cover note")
    .fill("Automated test application with a small PDF, please ignore.");
  await page.locator('input[type="file"]').setInputFiles({
    name: "e2e-test-cv.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4\n% automated test CV\n%%EOF\n"),
  });
  await waitForSecurityCheck(page);
  await page.getByRole("button", { name: "Submit application" }).click();

  await expect(page.getByText("Application received")).toBeVisible({
    timeout: 30_000,
  });
  const saved = await findTestSubmission(email);
  expect(saved?.form_type).toBe("job_application");
  expect(saved?.cv_original_file_name).toBe("e2e-test-cv.pdf");
  expect(saved?.cv_storage_path).toMatch(/^applications\//);
});

test("Apply Now refuses a CV that isn't a PDF or Word file", async ({
  page,
}) => {
  await page.goto("/apply");
  await page.locator('input[type="file"]').setInputFiles({
    name: "not-a-cv.exe",
    mimeType: "application/octet-stream",
    buffer: Buffer.from("MZ"),
  });
  await page.getByRole("button", { name: "Submit application" }).click();
  await expect(
    page.getByText("Your CV must be a PDF or Word (.docx) file."),
  ).toBeVisible();
});

test("training enquiry form sends from a course page", async ({ page }) => {
  const email = testEmailAddress("trainee");
  await page.goto("/training/level-2-unarmed-officer");
  const form = page
    .locator("form")
    .filter({ has: page.getByRole("button", { name: "Send enquiry" }) });
  await form
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("E2E Trainee");
  await form.getByLabel("Email").fill(email);
  await form.getByLabel("Phone").fill("832-555-0103");
  await form.getByLabel("Number of trainees").fill("4");
  await waitForSecurityCheck(page);
  await form.getByRole("button", { name: "Send enquiry" }).click();

  await expect(page.getByText("Enquiry received")).toBeVisible();
  expect((await findTestSubmission(email))?.form_type).toBe("training_enquiry");
});
