import { describe, expect, it, vi } from "vitest";

import {
  publicEnvironmentSchema,
  parseEnvironment,
} from "@/lib/environment/environment-schemas";
import { buildSecurityHeaders } from "@/lib/security/security-headers";
import {
  buildBreadcrumbData,
  buildLocalBusinessData,
  serializeStructuredData,
} from "@/lib/seo/structured-data";

import { testSupabaseUrl } from "./support/test-environment";

function headerValue(headers: { key: string; value: string }[], name: string) {
  return headers.find((header) => header.key === name)?.value ?? "";
}

describe("security headers", () => {
  const productionHeaders = buildSecurityHeaders({
    supabaseUrl: testSupabaseUrl,
    isDevelopment: false,
    isVercelPreview: false,
  });
  const policy = headerValue(productionHeaders, "Content-Security-Policy");

  it("only allows the outside services the site uses", () => {
    expect(policy).toContain(`img-src 'self' data: blob: ${testSupabaseUrl}`);
    expect(policy).toContain("media-src 'self' https://cdn.jsdelivr.net");
    expect(policy).toMatch(
      /script-src [^;]*https:\/\/challenges\.cloudflare\.com/,
    );
    expect(policy).toMatch(
      /frame-src [^;]*https:\/\/www\.youtube-nocookie\.com/,
    );
  });

  it("blocks plugins, framing and foreign form targets", () => {
    for (const rule of [
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ]) {
      expect(policy).toContain(rule);
    }
    expect(headerValue(productionHeaders, "X-Frame-Options")).toBe("DENY");
  });

  it("forces HTTPS in production but not in development", () => {
    expect(
      headerValue(productionHeaders, "Strict-Transport-Security"),
    ).toContain("max-age=63072000");
    expect(policy).toContain("upgrade-insecure-requests");
    const developmentHeaders = buildSecurityHeaders({
      supabaseUrl: testSupabaseUrl,
      isDevelopment: true,
      isVercelPreview: false,
    });
    expect(headerValue(developmentHeaders, "Strict-Transport-Security")).toBe(
      "",
    );
  });

  it("allows eval only in development, and Vercel's toolbar only on previews", () => {
    expect(policy).not.toContain("unsafe-eval");
    expect(policy).not.toContain("vercel.live");
    const previewPolicy = headerValue(
      buildSecurityHeaders({
        supabaseUrl: testSupabaseUrl,
        isDevelopment: false,
        isVercelPreview: true,
      }),
      "Content-Security-Policy",
    );
    expect(previewPolicy).toContain("https://vercel.live");
  });

  it("never leaves an empty source in the policy", () => {
    const policyWithoutSupabase = headerValue(
      buildSecurityHeaders({
        supabaseUrl: undefined,
        isDevelopment: false,
        isVercelPreview: false,
      }),
      "Content-Security-Policy",
    );
    expect(policyWithoutSupabase).not.toMatch(/ {2}| ;/);
  });
});

describe("structured data for search engines", () => {
  it("describes the business with its Texas address", () => {
    const business = buildLocalBusinessData();
    expect(business["@type"]).toBe("LocalBusiness");
    expect(business.address.addressRegion).toBe("TX");
    expect(business.telephone).toMatch(/^\+1\d{10}$/);
  });

  it("leaves out social links that only point at a site's home page", () => {
    const business = buildLocalBusinessData() as { sameAs?: string[] };
    for (const url of business.sameAs ?? []) {
      expect(new URL(url).pathname.replace(/\/$/, "")).not.toBe("");
    }
  });

  it("builds a breadcrumb trail that starts at Home", () => {
    const trail = buildBreadcrumbData([
      { label: "Services", href: "/services" },
      { label: "Mobile Patrol" },
    ]);
    expect(trail.itemListElement.map((item) => item.name)).toEqual([
      "Home",
      "Services",
      "Mobile Patrol",
    ]);
    expect(trail.itemListElement[2]).not.toHaveProperty("item");
  });

  it("can never close its script tag early", () => {
    const text = serializeStructuredData({
      headline: "</script><script>alert(1)</script>",
    });
    expect(text).not.toContain("</script>");
    expect(JSON.parse(text).headline).toBe(
      "</script><script>alert(1)</script>",
    );
  });
});

describe("environment variable checks", () => {
  it("stops with a clear message when production settings are missing", () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      expect(() =>
        parseEnvironment(publicEnvironmentSchema, {}, "public"),
      ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("fills in harmless stand-ins during local development", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const environment = parseEnvironment(
        publicEnvironmentSchema,
        {},
        "public (test)",
      );
      expect(environment.NEXT_PUBLIC_TURNSTILE_SITE_KEY).toBe(
        "1x00000000000000000000AA",
      );
      expect(warn).toHaveBeenCalled();
    } finally {
      warn.mockRestore();
      vi.unstubAllEnvs();
    }
  });
});
