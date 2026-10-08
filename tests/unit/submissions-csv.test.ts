import { describe, expect, it } from "vitest";

import {
  buildSubmissionsCsv,
  toCsvCell,
  type SubmissionForCsv,
} from "@/lib/submissions/submissions-csv";

describe("toCsvCell", () => {
  it("leaves plain values alone", () => {
    expect(toCsvCell("Jordan Rivers")).toBe("Jordan Rivers");
    expect(toCsvCell(42)).toBe("42");
    expect(toCsvCell(null)).toBe("");
    expect(toCsvCell(undefined)).toBe("");
  });

  it("quotes commas, quotes and line breaks", () => {
    expect(toCsvCell("Rivers, Inc")).toBe('"Rivers, Inc"');
    expect(toCsvCell('The "best" guards')).toBe('"The ""best"" guards"');
    expect(toCsvCell("Line one\nLine two")).toBe('"Line one\nLine two"');
  });

  it.each(["=SUM(A1:A9)", "+1 call me", "-2", "@cmd", "\tTab"])(
    "stops %j from running as a spreadsheet formula",
    (value) => {
      expect(toCsvCell(value).replace(/^"/, "").startsWith("'")).toBe(true);
    },
  );

  it("keeps numbers that are negative as numbers", () => {
    expect(toCsvCell(-2)).toBe("-2");
  });
});

describe("buildSubmissionsCsv", () => {
  const serviceRequest: SubmissionForCsv = {
    id: "1",
    formType: "service_request",
    status: "new",
    fullName: '=HYPERLINK("http://evil")',
    email: "jordan@example.com",
    phone: "832-555-0101",
    ipAddressHash: "hash",
    userAgent: "browser",
    createdAt: new Date("2026-10-08T19:05:00Z"),
    updatedAt: new Date("2026-10-08T19:05:00Z"),
    serviceRequest: {
      submissionId: "1",
      companyName: "Rivers, Inc",
      serviceSlug: "mobile-patrol",
      industrySlug: "retail",
      siteLocation: "Sugar Land",
      estimatedScope: "2 guards",
      preferredStartDate: null,
      message: "Please call",
    },
    jobApplication: null,
    trainingEnquiry: null,
  };

  it("starts with a byte-order mark and uses Windows line endings for Excel", () => {
    const csv = buildSubmissionsCsv([serviceRequest], "service_request");
    expect(csv.charCodeAt(0)).toBe(0xfeff);
    expect(csv.split("\r\n")).toHaveLength(3);
  });

  it("only includes the columns for the chosen form", () => {
    const [heading] = buildSubmissionsCsv([], "service_request")
      .slice(1)
      .split("\r\n");
    expect(heading).toContain("Service needed");
    expect(heading).not.toContain("CV file name");
    expect(heading).not.toContain("Number of trainees");
  });

  it("shows readable names, Texas times and neutralised formulas", () => {
    const [, row] = buildSubmissionsCsv([serviceRequest], "service_request")
      .slice(1)
      .split("\r\n");
    expect(row).toContain("2026-10-08 14:05");
    expect(row).toContain("Service request");
    expect(row).toContain(`"'=HYPERLINK(""http://evil"")"`);
    expect(row).toContain('"Rivers, Inc"');
    expect(row).toContain("Mobile Patrol");
  });

  it("includes every column when no form is chosen", () => {
    const [heading] = buildSubmissionsCsv([], undefined).slice(1).split("\r\n");
    for (const column of [
      "Service needed",
      "Course",
      "CV file name",
      "Message",
    ]) {
      expect(heading).toContain(column);
    }
  });
});
