import { expect, type Page } from "@playwright/test";

/** Signs in through the real login page as the temporary test admin. */
export async function signInAsTestAdmin(page: Page) {
  const email = process.env.E2E_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("The test admin wasn't created.");

  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(email);
  await page
    .getByRole("textbox", { name: "Password", exact: true })
    .fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: /Welcome, E2E/ }),
  ).toBeVisible();
}
