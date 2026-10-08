import { describe, expect, it } from "vitest";

import { availabilityValues, jobPositionSlugs } from "@/config/job-positions";
import { services } from "@/config/services";
import { trainingCourses } from "@/config/training-courses";
import {
  cvFileDetailsSchema,
  emailRule,
  jobApplicationFormSchema,
  phoneRule,
  serviceRequestFormSchema,
  serviceRequestSubmissionSchema,
  toFieldErrors,
  trainingEnquiryFormSchema,
} from "@/lib/validation/submission-schemas";

/** A service request that passes every rule; tests change one field at a time. */
const validServiceRequest = {
  fullName: "Jordan Rivers",
  companyName: "Rivers Retail",
  email: "jordan@example.com",
  phone: "(832) 555-0101",
  serviceSlug: services[0].slug,
  industrySlug: "other",
  siteLocation: "Sugar Land, TX",
  estimatedScope: "2 guards, nights",
  preferredStartDate: "",
  message: "We need overnight cover for our store.",
};

function texasDateFromToday(daysFromToday: number): string {
  const date = new Date(Date.now() + daysFromToday * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(date);
}

describe("contact field rules", () => {
  it("accepts and trims a normal email address", () => {
    expect(emailRule.parse("  jordan@example.com ")).toBe("jordan@example.com");
  });

  it.each(["", "jordan", "jordan@", "@example.com", "a b@example.com"])(
    "rejects the email address %j",
    (email) => {
      expect(emailRule.safeParse(email).success).toBe(false);
    },
  );

  it.each(["832-555-0101", "+1 (832) 555 0101", "832.247.7457"])(
    "accepts the phone number %j",
    (phone) => {
      expect(phoneRule.safeParse(phone).success).toBe(true);
    },
  );

  it.each([
    ["too short", "555-0101"],
    ["letters", "832-CALL-NOW"],
    ["too long", "1234567890123456"],
  ])("rejects a phone number that is %s", (_reason, phone) => {
    expect(phoneRule.safeParse(phone).success).toBe(false);
  });
});

describe("Request Service form", () => {
  it("accepts a complete request", () => {
    const result = serviceRequestFormSchema.safeParse(validServiceRequest);
    expect(result.success).toBe(true);
  });

  it("turns an empty company name and start date into 'not given'", () => {
    const result = serviceRequestFormSchema.parse({
      ...validServiceRequest,
      companyName: "  ",
    });
    expect(result.companyName).toBeUndefined();
    expect(result.preferredStartDate).toBeUndefined();
  });

  it("rejects a service that doesn't exist", () => {
    const result = serviceRequestFormSchema.safeParse({
      ...validServiceRequest,
      serviceSlug: "made-up-service",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a start date in the past but accepts today", () => {
    const yesterday = serviceRequestFormSchema.safeParse({
      ...validServiceRequest,
      preferredStartDate: texasDateFromToday(-1),
    });
    const today = serviceRequestFormSchema.safeParse({
      ...validServiceRequest,
      preferredStartDate: texasDateFromToday(0),
    });
    expect(yesterday.success).toBe(false);
    expect(today.success).toBe(true);
  });

  it("requires a message of at least 10 characters", () => {
    const result = serviceRequestFormSchema.safeParse({
      ...validServiceRequest,
      message: "Help",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).message).toMatch(/at least 10/);
    }
  });

  it("requires the security check on the server", () => {
    const result =
      serviceRequestSubmissionSchema.safeParse(validServiceRequest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).turnstileToken).toBe(
        "Please complete the security check.",
      );
    }
  });
});

describe("Apply Now form", () => {
  const validApplication = {
    fullName: "Sam Ortiz",
    email: "sam@example.com",
    phone: "832-555-0102",
    positionSlug: jobPositionSlugs[0],
    yearsOfExperience: 3,
    location: "Houston, TX",
    availability: availabilityValues[0],
    coverNote: "I have three years of retail security experience.",
  };

  it("accepts a complete application", () => {
    expect(jobApplicationFormSchema.safeParse(validApplication).success).toBe(
      true,
    );
  });

  it.each([-1, 2.5, 61])("rejects %d years of experience", (years) => {
    const result = jobApplicationFormSchema.safeParse({
      ...validApplication,
      yearsOfExperience: years,
    });
    expect(result.success).toBe(false);
  });

  it.each([
    ["resume.pdf", "application/pdf"],
    [
      "Resume.DOCX",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    // Some browsers leave the file type blank.
    ["resume.pdf", ""],
  ])("accepts the CV file %s", (fileName, fileType) => {
    const result = cvFileDetailsSchema.safeParse({
      fileName,
      fileType,
      fileSizeInBytes: 200_000,
    });
    expect(result.success).toBe(true);
  });

  it.each([
    ["an executable renamed by type", "resume.exe", "application/pdf"],
    ["an old Word file", "resume.doc", "application/msword"],
    ["a PDF with a fake type", "resume.pdf", "text/html"],
  ])("rejects %s", (_reason, fileName, fileType) => {
    const result = cvFileDetailsSchema.safeParse({
      fileName,
      fileType,
      fileSizeInBytes: 200_000,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty CV and one over 5 MB", () => {
    for (const fileSizeInBytes of [0, 5 * 1024 * 1024 + 1]) {
      const result = cvFileDetailsSchema.safeParse({
        fileName: "resume.pdf",
        fileType: "application/pdf",
        fileSizeInBytes,
      });
      expect(result.success).toBe(false);
    }
  });
});

describe("training enquiry form", () => {
  const validEnquiry = {
    fullName: "Lee Chen",
    email: "lee@example.com",
    phone: "832-555-0103",
    courseSlug: trainingCourses[0].slug,
    numberOfTrainees: 4,
  };

  it("accepts an enquiry without a message", () => {
    const result = trainingEnquiryFormSchema.parse(validEnquiry);
    expect(result.message).toBe("");
  });

  it.each([0, 501])("rejects %d trainees", (numberOfTrainees) => {
    const result = trainingEnquiryFormSchema.safeParse({
      ...validEnquiry,
      numberOfTrainees,
    });
    expect(result.success).toBe(false);
  });
});

describe("toFieldErrors", () => {
  it("keeps the first message for each field", () => {
    const result = serviceRequestFormSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      const fieldErrors = toFieldErrors(result.error);
      expect(Object.keys(fieldErrors)).toEqual(
        expect.arrayContaining(["fullName", "email", "phone", "message"]),
      );
      expect(typeof fieldErrors.fullName).toBe("string");
    }
  });
});
