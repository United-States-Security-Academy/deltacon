import { describe, expect, it } from "vitest";

import { isSuperAdminEmail, superAdminEmail } from "@/config/admin-roles";

describe("super admin", () => {
  it("is admin@deltacon1.com", () => {
    expect(superAdminEmail).toBe("admin@deltacon1.com");
  });

  it("matches regardless of letter case or surrounding spaces", () => {
    expect(isSuperAdminEmail("admin@deltacon1.com")).toBe(true);
    expect(isSuperAdminEmail("Admin@Deltacon1.com")).toBe(true);
    expect(isSuperAdminEmail("  ADMIN@DELTACON1.COM ")).toBe(true);
  });

  it("doesn't match other or missing addresses", () => {
    expect(isSuperAdminEmail("info@deltacon1.com")).toBe(false);
    expect(isSuperAdminEmail("admin@deltacon1.com.evil.example")).toBe(false);
    expect(isSuperAdminEmail("")).toBe(false);
    expect(isSuperAdminEmail(null)).toBe(false);
    expect(isSuperAdminEmail(undefined)).toBe(false);
  });
});
