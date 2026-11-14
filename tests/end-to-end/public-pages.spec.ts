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

test("the Dallas–Fort Worth page is complete and well structured", async ({
  page,
}) => {
  await page.goto("/locations/dallas-fort-worth-metro");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Security Guard Services in Dallas–Fort Worth Metro, TX",
  );
  await expect(page).toHaveTitle(
    "Security Guard Services Dallas–Fort Worth | Deltacon",
  );

  // Pricing: a real table with a caption and the disclaimer right after it.
  const table = page.getByRole("table");
  await expect(table.locator("caption")).toBeVisible();
  await expect(table.getByRole("row")).toHaveCount(9);
  await expect(table).toContainText(
    "Commercial, City, County, Statewide or FEMA",
  );
  await expect(
    table.getByRole("link", { name: "Request a Custom Quote" }),
  ).toHaveAttribute(
    "href",
    "/request-service?location=dallas-fort-worth-metro",
  );
  await expect(
    page.getByText(/not guaranteed contract rates/).first(),
  ).toBeVisible();
  await expect(page.getByText("$30.00")).toHaveCount(0);

  // The FAQ uses <details>, so its text is in the HTML. (The cost
  // breakdown moved to /security-guard-pricing.)
  await expect(page.locator("details")).toHaveCount(10);
  await expect(
    page.getByRole("link", {
      name: /What is included in our hourly bill rate/,
    }),
  ).toHaveAttribute("href", "/security-guard-pricing");
  await expect(
    page.getByRole("link", { name: /academies and instructor credentials/ }),
  ).toHaveAttribute("href", "/training-advantage");

  // Structured data: valid JSON with the expected types.
  const structuredDataTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.flatMap((script) =>
        [JSON.parse(script.textContent ?? "null")]
          .flat()
          .map((block: { "@type": string }) => block["@type"]),
      ),
    );
  expect(structuredDataTypes).toEqual(
    expect.arrayContaining(["LocalBusiness", "FAQPage", "BreadcrumbList"]),
  );

  // Public-sector client names are hidden.
  await expect(page.getByText("Health and Human Services")).toHaveCount(0);

  // The proposal button carries the location to the request form.
  await page
    .getByRole("link", { name: "Request a Security Proposal" })
    .first()
    .click();
  await expect(page).toHaveURL(
    /\/request-service\?location=dallas-fort-worth-metro$/,
  );
  await expect(page.getByLabel("Security Service Location")).toHaveValue(
    "Dallas–Fort Worth, TX",
  );
});

test("the Houston & Sugar Land headquarters page is complete", async ({
  page,
}) => {
  await page.goto("/locations/houston-metro-area");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Security Guard Services in Houston Metro Area, TX",
  );
  await expect(page).toHaveTitle(
    "Security Guard Services Houston & Sugar Land | Deltacon",
  );
  await expect(page.getByRole("table").getByRole("row")).toHaveCount(9);
  await expect(page.locator("details")).toHaveCount(10);

  // Places served: the folded list opens, and its search narrows it down.
  const placesButton = page.getByRole("button", {
    name: "See all places we serve",
  });
  const searchBox = page.getByRole("searchbox", {
    name: "Find your city or county",
  });
  // While folded, the list is in the HTML (for search engines) but inert,
  // so keyboards and screen readers skip it.
  const placesPanel = page.locator(
    `[id="${await placesButton.getAttribute("aria-controls")}"]`,
  );
  await expect(placesPanel).toHaveAttribute("inert");
  await expect(placesPanel).toContainText("Montgomery County");
  await placesButton.click();
  await expect(placesPanel).not.toHaveAttribute("inert");
  await expect(
    page.getByRole("button", { name: "Hide places we serve" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByText("Montgomery County")).toBeVisible();
  await searchBox.fill("katy");
  await expect(
    page.getByRole("heading", { name: /Cities & towns/ }),
  ).toHaveText(/2 of 43/);
  await searchBox.fill("Nowhere Town");
  await expect(page.getByRole("status")).toContainText("No match");

  // Links to the specialist service and industry pages.
  for (const href of [
    "/services/off-duty-police",
    "/services/detention-correctional-security",
    "/industries/chemical-petrochemical",
    "/industries/ports-of-entry",
    "/industries/data-centers",
  ]) {
    await expect(page.locator(`main a[href="${href}"]`).first()).toBeVisible();
  }

  // The region section stays hidden until its copy is written.
  await expect(
    page.getByRole("heading", { name: "Security for the Houston Region" }),
  ).toHaveCount(0);
  await expect(page.getByText("TODO")).toHaveCount(0);

  // The headquarters is described as the company itself.
  const businessIds = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.flatMap((script) =>
        [JSON.parse(script.textContent ?? "null")]
          .flat()
          .filter(
            (block: { "@type": string }) => block["@type"] === "LocalBusiness",
          )
          .map((block: { "@id": string }) => block["@id"]),
      ),
    );
  expect(businessIds).toHaveLength(1);
  expect(businessIds[0]).toMatch(/\/#organization$/);
});

test("the shared pricing and training pages work", async ({ page }) => {
  await page.goto("/security-guard-pricing");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator("details")).toHaveCount(8);
  await expect(
    page.locator('main a[href="/locations/dallas-fort-worth-metro#pricing"]'),
  ).toBeVisible();
  await page.goto("/training-advantage");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByText("F28377901")).toBeVisible();
  await expect(page.getByText("Y07327301")).toBeVisible();
});

test("the old location page addresses redirect permanently to the new ones", async ({
  request,
}) => {
  for (const [previousPath, currentPath] of [
    ["/locations/houston-sugar-land", "/locations/houston-metro-area"],
    ["/locations/dallas-fort-worth", "/locations/dallas-fort-worth-metro"],
  ]) {
    const response = await request.get(previousPath, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(currentPath);
  }
});

test("an unknown ?location= leaves the site location empty", async ({
  page,
}) => {
  await page.goto("/request-service?location=not-a-real-place");
  await expect(page.getByLabel("Security Service Location")).toHaveValue("");
});

test("unknown addresses show a helpful 404 page", async ({ page }) => {
  for (const address of ["/this-page-does-not-exist", "/blog/x/y/z"]) {
    const response = await page.goto(address);
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle(/Page not found/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /home/i }).first(),
    ).toBeVisible();
    // Still inside the public site: header navigation and footer.
    await expect(
      page.getByRole("navigation", { name: "Main" }).first(),
    ).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  }
});

test("the main navigation reaches each section", async ({ page }) => {
  await page.goto("/");
  const mainNavigation = page.getByRole("navigation", { name: "Main" }).first();
  for (const [linkName, path] of [
    ["Industries", "/industries"],
    ["Locations", "/locations"],
    ["Training", "/training"],
    ["Blog & Media", "/blog"],
  ] as const) {
    await mainNavigation
      .getByRole("link", { name: linkName, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("Training, Locations and Blog & Media open their own menus", async ({
  page,
}) => {
  await page.goto("/");
  const mainNavigation = page.getByRole("navigation", { name: "Main" }).first();
  for (const [menuName, linkName, path, heading] of [
    [
      "Training",
      "Licensing Guide",
      "/guide",
      "Pathway to security guard licensing in Texas",
    ],
    [
      "Training",
      "Training Courses",
      "/training",
      "Security training & licensing",
    ],
    ["Blog & Media", "Gallery", "/gallery", "Deltacon in action"],
    ["Blog & Media", "Blog", "/blog", "News & insights"],
    [
      "Locations",
      "Houston Metro Area",
      "/locations/houston-metro-area",
      "Security Guard Services in Houston Metro Area, TX",
    ],
    [
      "Locations",
      "Dallas–Fort Worth Metro",
      "/locations/dallas-fort-worth-metro",
      "Security Guard Services in Dallas–Fort Worth Metro, TX",
    ],
  ] as const) {
    const menuButton = mainNavigation.getByRole("button", {
      name: `Show ${menuName} menu`,
    });
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await mainNavigation
      .getByRole("link", { name: linkName, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }
});

test("the Services dropdown opens each line of business", async ({ page }) => {
  await page.goto("/");
  const mainNavigation = page.getByRole("navigation", { name: "Main" }).first();
  const servicesButton = mainNavigation.getByRole("button", {
    name: "Show Services menu",
  });

  // "Services" itself is a real link to the overview page.
  await mainNavigation
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  for (const [linkName, path, heading] of [
    ["Security Services", "/services", "Security services"],
    [
      "Government Contracting Solutions",
      "/government-contracting",
      "Government & Critical Infrastructure Protective Services",
    ],
    [
      "Consulting",
      "/consulting",
      "Professional Physical Security Consulting & Protective Solutions",
    ],
    ["Staffing", "/staffing", "Staffing"],
    ["Custodial Services", "/custodial-services", "Custodial Services"],
  ] as const) {
    await servicesButton.click();
    await expect(servicesButton).toHaveAttribute("aria-expanded", "true");
    await mainNavigation.getByRole("link", { name: linkName }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }

  // Keyboard: Enter opens it, Escape closes it and returns focus.
  await servicesButton.focus();
  await page.keyboard.press("Enter");
  await expect(servicesButton).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(servicesButton).toHaveAttribute("aria-expanded", "false");
  await expect(servicesButton).toBeFocused();
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
    // Training is a group: tap it to show its pages, then pick one.
    await menu.getByRole("button", { name: "Training" }).click();
    await menu
      .getByRole("link", { name: "Licensing Guide", exact: true })
      .click();
    await expect(page).toHaveURL(/\/guide$/);
    await expect(menu).toBeHidden();
  });

  test("the menu lists every line of business under Services", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open main menu" }).click();
    const menu = page.getByRole("dialog");
    const servicesButton = menu.getByRole("button", { name: "Services" });
    const lineOfBusinessNames = [
      "Security Services",
      "Government Contracting Solutions",
      "Consulting",
      "Staffing",
      "Custodial Services",
    ];

    // Services is a dropdown: its links stay hidden until it is tapped.
    await expect(servicesButton).toHaveAttribute("aria-expanded", "false");
    await expect(
      menu.getByRole("link", { name: "Consulting", exact: true }),
    ).toBeHidden();

    await servicesButton.click();
    await expect(servicesButton).toHaveAttribute("aria-expanded", "true");
    for (const linkName of lineOfBusinessNames) {
      await expect(
        menu.getByRole("link", { name: linkName, exact: true }),
      ).toBeVisible();
    }
    await menu.getByRole("link", { name: "Staffing", exact: true }).click();
    await expect(page).toHaveURL(/\/staffing$/);
  });

  test("pages fit the screen without sideways scrolling", async ({ page }) => {
    for (const path of [
      "/",
      "/services",
      "/request-service",
      "/security-assessment",
      "/blog",
      "/guide",
      "/government-contracting",
      "/about",
      "/locations",
      "/locations/dallas-fort-worth-metro",
      "/locations/houston-metro-area",
      "/security-guard-pricing",
      "/training-advantage",
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

test("the home page service tabs switch between lines of business", async ({
  page,
}) => {
  await page.goto("/");
  const tabs = page.getByRole("tablist", { name: "Our services" });
  const securityTab = tabs.getByRole("tab", { name: /Security/ });
  await expect(securityTab).toHaveAttribute("aria-selected", "true");
  await expect(
    page
      .getByRole("tabpanel")
      .getByRole("link", { name: "All security services" }),
  ).toBeVisible();

  // Clicking shows that tab's panel, with links to its page and quote form.
  await tabs.getByRole("tab", { name: /Staffing/ }).click();
  const staffingPanel = page.getByRole("tabpanel");
  await expect(staffingPanel).toContainText("The Right People");
  await expect(
    staffingPanel.getByRole("link", { name: "Request a Staffing Proposal" }),
  ).toHaveAttribute("href", "/request-service?service=staffing");

  // Keyboard: arrows move between tabs, Home and End jump to the ends.
  await page.keyboard.press("ArrowRight");
  await expect(tabs.getByRole("tab", { name: /Custodial/ })).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Clean Spaces");
  await page.keyboard.press("ArrowRight");
  await expect(securityTab).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(tabs.getByRole("tab", { name: /Custodial/ })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(securityTab).toBeFocused();

  await tabs.getByRole("tab", { name: /Consulting/ }).click();
  await page
    .getByRole("tabpanel")
    .getByRole("link", { name: /Explore Consulting/ })
    .click();
  await expect(page).toHaveURL(/\/consulting$/);
});
