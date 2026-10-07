import { z } from "zod";

import { industrySlugs } from "@/config/industries";
import { availabilityValues, jobPositionSlugs } from "@/config/job-positions";
import { serviceSlugs } from "@/config/services";
import { trainingCourseSlugs } from "@/config/training-courses";

/*
 * Validation rules for the three public forms. The same schemas run in the
 * browser (instant feedback) and on the server (the real check, because
 * anything sent from a browser can be tampered with).
 */

// ---------- Reusable field rules ----------

function requiredText(
  fieldName: string,
  minimumLength: number,
  maximumLength: number,
) {
  return z
    .string()
    .trim()
    .min(1, `Please enter your ${fieldName}.`)
    .min(
      minimumLength,
      `Your ${fieldName} must be at least ${minimumLength} characters.`,
    )
    .max(
      maximumLength,
      `Your ${fieldName} must be ${maximumLength} characters or fewer.`,
    );
}

export const fullNameRule = requiredText("full name", 2, 100);

export const emailRule = z
  .string()
  .trim()
  .min(1, "Please enter your email address.")
  .max(254, "That email address is too long.")
  .pipe(z.email("Please enter a valid email address, like name@example.com."));

export const phoneRule = z
  .string()
  .trim()
  .min(1, "Please enter your phone number.")
  .regex(
    /^[0-9+()\-.\s]+$/,
    "Phone numbers can only contain digits, spaces and + ( ) - .",
  )
  .refine((phone) => {
    const numberOfDigits = phone.replace(/\D/g, "").length;
    return numberOfDigits >= 10 && numberOfDigits <= 15;
  }, "Please enter a full phone number, including the area code.");

function wholeNumber(fieldName: string, minimum: number, maximum: number) {
  return z
    .number({ error: `Please enter the ${fieldName} as a number.` })
    .int(`Please enter the ${fieldName} as a whole number.`)
    .min(minimum, `The ${fieldName} must be at least ${minimum}.`)
    .max(maximum, `The ${fieldName} must be ${maximum} or less.`);
}

function choiceFrom<Options extends [string, ...string[]]>(
  options: Options,
  message: string,
) {
  return z.enum(options, { error: message });
}

/** Today's date in Texas as YYYY-MM-DD, used to reject start dates in the past. */
function todayInTexas(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
  }).format(new Date());
}

const optionalFutureDate = z
  .union([
    z.literal(""),
    z.iso
      .date("Please choose a valid date.")
      .refine(
        (date) => date >= todayInTexas(),
        "The start date can't be in the past.",
      ),
  ])
  .optional()
  .transform((date) => (date ? date : undefined));

// ---------- Spam protection fields added to every submission ----------

export const turnstileTokenRule = z
  .string({ error: "Please complete the security check." })
  .min(1, "Please complete the security check.");

/**
 * Honeypot: an input hidden from people but visible to bots. Real visitors
 * leave it empty. Any value is accepted here so bots get no error hint; the
 * server quietly discards submissions where it is filled.
 */
export const honeypotRule = z.string().max(500).optional();

// ---------- Request Service ----------

export const otherIndustryValue = "other";

export const serviceRequestFormSchema = z.object({
  fullName: fullNameRule,
  companyName: z
    .string()
    .trim()
    .max(150, "Company name must be 150 characters or fewer.")
    .optional()
    .transform((companyName) => (companyName ? companyName : undefined)),
  email: emailRule,
  phone: phoneRule,
  serviceSlug: choiceFrom(serviceSlugs, "Please choose the service you need."),
  industrySlug: choiceFrom(
    [...industrySlugs, otherIndustryValue],
    "Please choose your industry.",
  ),
  siteLocation: requiredText("site location", 2, 200),
  estimatedScope: requiredText("number of guards or estimated scope", 1, 200),
  preferredStartDate: optionalFutureDate,
  message: requiredText("message", 10, 3000),
});

export const serviceRequestSubmissionSchema = serviceRequestFormSchema.extend({
  turnstileToken: turnstileTokenRule,
  website: honeypotRule,
});

export type ServiceRequestFormInput = z.input<typeof serviceRequestFormSchema>;
export type ServiceRequestSubmission = z.output<
  typeof serviceRequestSubmissionSchema
>;

// ---------- Apply Now ----------

export const maximumCvFileSizeInBytes = 5 * 1024 * 1024;

export const allowedCvFileTypes = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
} as const;

export type AllowedCvFileType = keyof typeof allowedCvFileTypes;

/** Describes the CV file the applicant picked (checked before uploading). */
export const cvFileDetailsSchema = z
  .object({
    fileName: z
      .string()
      .trim()
      .min(1, "Please attach your CV.")
      .max(200, "The file name is too long."),
    fileType: z.string(),
    fileSizeInBytes: z
      .number()
      .int()
      .positive("The file appears to be empty.")
      .max(maximumCvFileSizeInBytes, "Your CV must be 5 MB or smaller."),
  })
  .refine(
    ({ fileName, fileType }) => {
      const extension = fileName.toLowerCase().slice(fileName.lastIndexOf("."));
      const allowedExtensions: string[] = Object.values(allowedCvFileTypes);
      // Some browsers leave the type blank, so the extension must always match.
      return (
        allowedExtensions.includes(extension) &&
        (fileType === "" || fileType in allowedCvFileTypes)
      );
    },
    {
      message: "Your CV must be a PDF or Word (.docx) file.",
      path: ["fileName"],
    },
  );

export type CvFileDetails = z.infer<typeof cvFileDetailsSchema>;

export const jobApplicationFormSchema = z.object({
  fullName: fullNameRule,
  email: emailRule,
  phone: phoneRule,
  positionSlug: choiceFrom(
    jobPositionSlugs,
    "Please choose the position you're applying for.",
  ),
  yearsOfExperience: wholeNumber("years of experience", 0, 60),
  location: requiredText("location", 2, 150),
  availability: choiceFrom(
    availabilityValues,
    "Please choose your availability.",
  ),
  coverNote: requiredText("cover note", 20, 3000),
});

/** Step 1 of applying: ask the server for a one-time CV upload link. */
export const cvUploadRequestSchema = cvFileDetailsSchema.and(
  z.object({ turnstileToken: turnstileTokenRule, website: honeypotRule }),
);

/** Step 2 of applying: send the form, proving the CV was uploaded via the ticket. */
export const jobApplicationSubmissionSchema = jobApplicationFormSchema.extend({
  cvUploadTicket: z.string().min(1, "Please attach your CV."),
  website: honeypotRule,
});

export type JobApplicationFormInput = z.input<typeof jobApplicationFormSchema>;
export type JobApplicationSubmission = z.output<
  typeof jobApplicationSubmissionSchema
>;

// ---------- Training enquiry ----------

export const trainingEnquiryFormSchema = z.object({
  fullName: fullNameRule,
  email: emailRule,
  phone: phoneRule,
  courseSlug: choiceFrom(trainingCourseSlugs, "Please choose a course."),
  numberOfTrainees: wholeNumber("number of trainees", 1, 500),
  message: z
    .string()
    .trim()
    .max(2000, "Your message must be 2000 characters or fewer.")
    .optional()
    .transform((message) => message ?? ""),
});

export const trainingEnquirySubmissionSchema = trainingEnquiryFormSchema.extend(
  {
    turnstileToken: turnstileTokenRule,
    website: honeypotRule,
  },
);

export type TrainingEnquiryFormInput = z.input<
  typeof trainingEnquiryFormSchema
>;
export type TrainingEnquirySubmission = z.output<
  typeof trainingEnquirySubmissionSchema
>;

// ---------- Result returned by every form action ----------

export type FormActionResult =
  | { status: "success" }
  | {
      status: "error";
      message: string;
      /** Messages keyed by field name, shown next to each field. */
      fieldErrors?: Record<string, string>;
    };

/** Turns Zod issues into one message per field for the form to display. */
export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const fieldName = String(issue.path[0] ?? "form");
    fieldErrors[fieldName] ??= issue.message;
  }
  return fieldErrors;
}

export type FormActionError = Extract<FormActionResult, { status: "error" }>;
