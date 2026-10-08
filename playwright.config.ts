import { defineConfig, devices } from "@playwright/test";

/*
 * Browser tests (tests/end-to-end). They build the site and run it on
 * http://localhost:3100, then click through it like a visitor and an admin.
 *
 * They use the Supabase project in .env.local. Everything a test creates is
 * marked "e2e" and deleted again when the run ends (see support/test-data.ts).
 *
 * The test server is started with three safe overrides:
 * - Cloudflare's official always-pass Turnstile test keys, so forms can be
 *   submitted by a robot browser;
 * - an email key that doesn't work, so no real emails are sent to the
 *   company inbox or anyone else. (A failed email never blocks a form.)
 *
 * Set E2E_SKIP_BUILD=1 to reuse the last test build (only after a full run,
 * otherwise the real Turnstile key would be built into the page).
 */

const port = 3100;

export default defineConfig({
  testDir: "tests/end-to-end",
  // The tests share one database, so they run one at a time.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // Generous, so a slow connection to Supabase (e.g. far away or on a
  // mobile hotspot) doesn't cause false failures.
  timeout: 180_000,
  expect: { timeout: 45_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  globalSetup: "./tests/end-to-end/support/global-setup.ts",
  globalTeardown: "./tests/end-to-end/support/global-teardown.ts",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: process.env.E2E_SKIP_BUILD
      ? `npm run start -- -p ${port}`
      : `npm run build && npm run start -- -p ${port}`,
    url: `http://localhost:${port}`,
    timeout: 600_000,
    reuseExistingServer: false,
    stdout: "ignore",
    stderr: "pipe",
    env: {
      NEXT_PUBLIC_SITE_URL: `http://localhost:${port}`,
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
      TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
      RESEND_API_KEY: "re_e2e_tests_send_no_email",
    },
  },
});
