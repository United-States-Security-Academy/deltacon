import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/*
 * Unit tests (tests/unit): fast checks of the site's rules and helpers that
 * run without a browser, database or network. Browser tests live in
 * tests/end-to-end and run with Playwright.
 */
export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Next.js's "server-only" marker throws outside a server bundle; in
      // tests every module runs on the server anyway.
      "server-only": fileURLToPath(
        new URL("./tests/unit/support/empty-module.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    setupFiles: ["tests/unit/support/test-environment.ts"],
  },
});
