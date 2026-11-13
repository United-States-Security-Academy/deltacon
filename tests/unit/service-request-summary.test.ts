import { describe, expect, it } from "vitest";

import { summariseServiceRequest } from "@/lib/submissions/submission-summary";

const contact = {
  fullName: "Jordan Rivers",
  email: "jordan@example.com",
  phone: "832-555-0101",
};

function asObject(rows: { label: string; value: string }[]) {
  return Object.fromEntries(rows.map((row) => [row.label, row.value]));
}

describe("service request summary (emails and admin inbox)", () => {
  it("lists the quote form answers by their labels", () => {
    const summary = asObject(
      summariseServiceRequest({
        ...contact,
        companyName: "Rivers Retail",
        siteLocation: "Houston, TX",
        industrySlug: null,
        primaryServiceType: "on-site-guards",
        officerClassification: "unarmed-level-2",
        additionalServices: ["foot-patrol"],
        officersRequired: 2,
        coverageType: "24-7",
        coverageHours: null,
        contractDuration: "ongoing",
        preferredStartDate: null,
        message: "Warehouse cover",
      }),
    );
    expect(summary).toMatchObject({
      "Company / organization": "Rivers Retail",
      "Security service location": "Houston, TX",
      Industry: "Not given",
      "Primary service type": "On-site security guard services",
      "Officer classification": "Unarmed Security Officer — Level II",
      "Additional services": "Foot patrol",
      "Officers required": "2",
      "Required coverage": "24 Hours / 7 Days a Week",
      "Coverage hours / shifts": "Not given",
      "Contract duration": "Ongoing contract",
      "Anticipated start date": "Not given",
      "Security needs": "Warehouse cover",
    });
    expect(summary).not.toHaveProperty("Service needed");
  });

  it("leaves out officer rows for consulting, staffing and custodial requests", () => {
    const summary = asObject(
      summariseServiceRequest({
        ...contact,
        siteLocation: "Dallas, TX",
        primaryServiceType: "custodial-services",
        additionalServices: [],
        coverageType: "daytime",
        contractDuration: "1-3-years",
        message: "Office cleaning",
      }),
    );
    expect(summary["Primary service type"]).toBe("Custodial services");
    expect(summary["Additional services"]).toBe("None");
    expect(summary).not.toHaveProperty("Officer classification");
    expect(summary).not.toHaveProperty("Officers required");
  });

  it("still shows requests sent with the older form", () => {
    const summary = asObject(
      summariseServiceRequest({
        ...contact,
        companyName: null,
        serviceSlug: "mobile-patrol",
        industrySlug: "other",
        siteLocation: "Sugar Land",
        estimatedScope: "2 guards",
        preferredStartDate: "2026-11-01",
        message: "Please call",
      }),
    );
    expect(summary).toMatchObject({
      "Company / organization": "Not given",
      "Service needed": "Mobile Patrol Services",
      "Guards / estimated scope": "2 guards",
      Industry: "Other",
    });
    expect(summary).not.toHaveProperty("Primary service type");
  });
});
