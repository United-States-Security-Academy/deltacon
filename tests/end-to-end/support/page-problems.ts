import type { Page } from "@playwright/test";

/**
 * Collects problems a visitor wouldn't see but a browser reports: script
 * errors, content blocked by the security policy, and failed requests.
 */
export function watchForPageProblems(page: Page): string[] {
  const problems: string[] = [];
  page.on("pageerror", (error) =>
    problems.push(`Script error: ${error.message}`),
  );
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    // Turnstile's test widget logs this harmless notice in headless browsers.
    if (/Private Access Token|preloaded using link preload/i.test(text)) return;
    // Failed requests are reported below, with their address.
    if (text.startsWith("Failed to load resource")) return;
    problems.push(`Console error: ${text}`);
  });
  page.on("response", (response) => {
    // Cloudflare's widget probes for a "Private Access Token" and expects a
    // 401 when the browser has none; that's part of its normal check.
    const isTurnstileProbe =
      response.status() === 401 &&
      new URL(response.url()).host === "challenges.cloudflare.com";
    if (response.status() >= 400 && !isTurnstileProbe) {
      problems.push(`HTTP ${response.status()} from ${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    // Navigating away cancels requests still in flight; that's not a fault.
    if (request.failure()?.errorText === "net::ERR_ABORTED") return;
    problems.push(
      `Request failed (${request.failure()?.errorText}): ${request.url()}`,
    );
  });
  return problems;
}
