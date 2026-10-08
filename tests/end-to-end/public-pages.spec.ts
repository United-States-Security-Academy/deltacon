import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { watchForPageProblems } from "./support/page-problems";

// Content fades in as it scrolls into view; with reduced motion it's shown
// straight away, so the accessibility check sees the finished page.
test.use({ reducedMotion: "reduce" });

/** Every public page, read from the live sitemap. */
async function readSitemapPaths(baseURL: string): Promise<string[]> {
  const sitemap = await (await fetch(`${baseURL}/sitemap.xml`)).text();
  return [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
    (match) => new URL(match[1]!).pathname,
  );
}

test("every page in the sitemap loads cleanly and meets WCAG 2.1 AA", async ({
  page,
  baseURL,
}) => {
  test.setTimeout(15 * 60_000);
  const paths = await readSitemapPaths(baseURL!);
  expect(paths.length).toBeGreaterThan(40);

  const failures: string[] = [];
  for (const path of paths) {
    const problems = watchForPageProblems(page);
    const response = await page.goto(path, { waitUntil: "load" });
    if (response?.status() !== 200)
      failures.push(`${path}: HTTP ${response?.status()}`);
    if ((await page.locator("h1").count()) !== 1)
      failures.push(`${path}: expected one <h1>`);

    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      // The decorative hero video and Cloudflare's own widget aren't ours to fix.
      .exclude("video")
      .exclude("iframe")
      .analyze();
    for (const violation of accessibility.violations) {
      const where = violation.nodes
        .slice(0, 3)
        .map((node) => node.target.join(" "))
        .join(" | ");
      failures.push(
        `${path}: [${violation.impact}] ${violation.id}: ${violation.help} (${where})`,
      );
    }
    failures.push(...problems.map((problem) => `${path}: ${problem}`));
    page.removeAllListeners();
  }

  expect(failures, failures.join("\n")).toEqual([]);
});

test("unknown addresses show a helpful 404 page", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
});

test("the main navigation reaches each section", async ({ page }) => {
  await page.goto("/");
  const mainNavigation = page.getByRole("navigation", { name: "Main" }).first();
  for (const [linkName, path] of [
    ["Services", "/services"],
    ["Industries", "/industries"],
    ["Training", "/training"],
    ["Gallery", "/gallery"],
  ] as const) {
    await mainNavigation
      .getByRole("link", { name: linkName, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("the skip link jumps straight to the page content", async ({ page }) => {
  await page.goto("/services");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: /skip to/i });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

  test("the menu opens, navigates and closes", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open main menu" }).click();
    const menu = page.getByRole("dialog");
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Training", exact: true }).click();
    await expect(page).toHaveURL(/\/training$/);
    await expect(menu).toBeHidden();
  });

  test("pages fit the screen without sideways scrolling", async ({ page }) => {
    for (const path of [
      "/",
      "/services",
      "/request-service",
      "/security-assessment",
      "/blog",
    ]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      expect(overflow, `${path} scrolls sideways`).toBeLessThanOrEqual(0);
    }
  });
});

test("security headers are sent with every page", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-powered-by"]).toBeUndefined();
});
