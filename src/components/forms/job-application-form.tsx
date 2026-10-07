"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import {
  FormField,
  formControlClassName,
  NativeSelect,
} from "@/components/forms/form-field";
import {
  FormErrorBanner,
  FormSuccessMessage,
} from "@/components/forms/form-status-messages";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import {
  missingTurnstileMessage,
  showServerFieldErrors,
  useSpamProtection,
} from "@/components/forms/use-spam-protection";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { availabilityOptions, jobPositions } from "@/config/job-positions";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser-client";
import { cn } from "@/lib/utils";
import {
  allowedCvFileTypes,
  cvFileDetailsSchema,
  jobApplicationFormSchema,
  type JobApplicationFormInput,
} from "@/lib/validation/submission-schemas";
import {
  requestCvUploadLink,
  submitJobApplication,
} from "@/server/actions/public/submit-job-application";

type JobApplicationFormOutput = z.output<typeof jobApplicationFormSchema>;

const positionOptions = jobPositions.map((position) => ({
  value: position.slug,
  label: position.name,
}));

const formFieldNames = [
  ...Object.keys(jobApplicationFormSchema.shape),
  "cvFile",
];

const acceptedCvFileTypes = [
  ...Object.keys(allowedCvFileTypes),
  ...Object.values(allowedCvFileTypes),
].join(",");

function formatFileSize(sizeInBytes: number): string {
  return sizeInBytes < 1024 * 1024
    ? `${Math.max(1, Math.round(sizeInBytes / 1024))} KB`
    : `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Checks the chosen CV in the browser using the same rules as the server. */
function findCvFileProblem(cvFile: File | null): string | undefined {
  if (!cvFile) return "Please attach your CV.";
  const validation = cvFileDetailsSchema.safeParse({
    fileName: cvFile.name,
    fileType: cvFile.type,
    fileSizeInBytes: cvFile.size,
  });
  return validation.success ? undefined : validation.error.issues[0]?.message;
}

export function JobApplicationForm() {
  const spamProtection = useSpamProtection();
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvErrorMessage, setCvErrorMessage] = useState<string>();
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string>();
  const [progressMessage, setProgressMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFormInput, unknown, JobApplicationFormOutput>({
    resolver: zodResolver(jobApplicationFormSchema),
  });

  function handleCvFileChange(event: ChangeEvent<HTMLInputElement>) {
    const chosenFile = event.target.files?.[0] ?? null;
    setCvFile(chosenFile);
    setCvErrorMessage(chosenFile ? findCvFileProblem(chosenFile) : undefined);
  }

  function showFailure(message: string, fieldErrors?: Record<string, string>) {
    setProgressMessage("");
    setBannerErrorMessage(message);
    spamProtection.requestNewTurnstileToken();
    const turnstileMessage = showServerFieldErrors(
      fieldErrors,
      setError,
      formFieldNames,
    );
    spamProtection.setTurnstileErrorMessage(turnstileMessage);
    if (fieldErrors?.cvFile || fieldErrors?.fileName) {
      setCvErrorMessage(fieldErrors.cvFile ?? fieldErrors.fileName);
    }
  }

  const sendApplication = handleSubmit(
    async (formValues) => {
      setBannerErrorMessage(undefined);

      const cvProblem = findCvFileProblem(cvFile);
      if (cvProblem || !cvFile) {
        setCvErrorMessage(cvProblem);
        document.getElementById("cv-file")?.focus();
        return;
      }
      if (!spamProtection.turnstileToken) {
        spamProtection.setTurnstileErrorMessage(missingTurnstileMessage);
        return;
      }

      // Step 1: get a one-time upload link (this also checks Turnstile).
      setProgressMessage("Preparing your CV upload…");
      const uploadLink = await requestCvUploadLink({
        fileName: cvFile.name,
        fileType: cvFile.type,
        fileSizeInBytes: cvFile.size,
        turnstileToken: spamProtection.turnstileToken,
        website: spamProtection.readHoneypotValue(),
      });
      if (uploadLink.status === "error") {
        showFailure(uploadLink.message, uploadLink.fieldErrors);
        return;
      }

      // Step 2: upload the CV straight to private storage.
      setProgressMessage("Uploading your CV…");
      const { error: uploadError } = await createBrowserSupabaseClient()
        .storage.from("cv-uploads")
        .uploadToSignedUrl(
          uploadLink.storagePath,
          uploadLink.uploadToken,
          cvFile,
          {
            contentType: uploadLink.contentType,
          },
        );
      if (uploadError) {
        showFailure(
          "Your CV couldn't be uploaded. Please check your connection and try again.",
        );
        return;
      }

      // Step 3: send the application.
      setProgressMessage("Sending your application…");
      const result = await submitJobApplication({
        ...formValues,
        cvUploadTicket: uploadLink.ticket,
        website: spamProtection.readHoneypotValue(),
      });
      if (result.status === "error") {
        showFailure(result.message, result.fieldErrors);
        return;
      }

      setProgressMessage("");
      setHasSubmitted(true);
    },
    // Also check the CV when other fields fail, so every problem shows at once.
    () => setCvErrorMessage(findCvFileProblem(cvFile)),
  );

  if (hasSubmitted) {
    return (
      <FormSuccessMessage title="Application received">
        <p>
          Thank you for applying to join Deltacon Security. We&apos;ve received
          your application and CV, and emailed you a confirmation.
        </p>
        <p>
          Our recruitment team reviews every application and will contact you if
          your experience matches the role.
        </p>
        <p>
          <Link href="/about" className="font-semibold text-gold-700 underline">
            Learn more about Deltacon
          </Link>
        </p>
      </FormSuccessMessage>
    );
  }

  const isBusy = isSubmitting;

  return (
    <form
      onSubmit={sendApplication}
      noValidate
      aria-describedby="job-application-required-note"
      className="relative flex flex-col gap-6"
    >
      <p
        id="job-application-required-note"
        className="text-sm text-muted-foreground"
      >
        Fields marked <span className="text-flag-red">*</span> are required.
      </p>

      {bannerErrorMessage && <FormErrorBanner message={bannerErrorMessage} />}

      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          fieldId="full-name"
          label="Full name"
          isRequired
          errorMessage={errors.fullName?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("fullName")}
              type="text"
              autoComplete="name"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="email"
          label="Email"
          isRequired
          errorMessage={errors.email?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("email")}
              type="email"
              autoComplete="email"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="phone"
          label="Phone"
          isRequired
          errorMessage={errors.phone?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("phone")}
              type="tel"
              autoComplete="tel"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="position"
          label="Position applied for"
          isRequired
          errorMessage={errors.positionSlug?.message}
        >
          {(controlProps) => (
            <NativeSelect
              {...controlProps}
              {...register("positionSlug")}
              options={positionOptions}
              placeholder="Choose a position"
            />
          )}
        </FormField>

        <FormField
          fieldId="years-of-experience"
          label="Years of security experience"
          isRequired
          errorMessage={errors.yearsOfExperience?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("yearsOfExperience", { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              min={0}
              max={60}
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="location"
          label="Where do you live?"
          isRequired
          hint="City and state."
          errorMessage={errors.location?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("location")}
              type="text"
              autoComplete="address-level2"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="availability"
          label="Availability"
          isRequired
          errorMessage={errors.availability?.message}
        >
          {(controlProps) => (
            <NativeSelect
              {...controlProps}
              {...register("availability")}
              options={availabilityOptions}
              placeholder="Choose your availability"
            />
          )}
        </FormField>
      </div>

      <FormField
        fieldId="cover-note"
        label="Short cover note"
        isRequired
        hint="Tell us about your experience, licences and why you'd like to join Deltacon."
        errorMessage={errors.coverNote?.message}
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            {...register("coverNote")}
            rows={6}
            className={cn(formControlClassName, "h-auto min-h-36 py-2.5")}
          />
        )}
      </FormField>

      <FormField
        fieldId="cv-file"
        label="CV"
        isRequired
        hint="PDF or Word (.docx), up to 5 MB."
        errorMessage={cvErrorMessage}
      >
        {(controlProps) => (
          <div className="flex flex-col gap-2">
            <input
              {...controlProps}
              type="file"
              accept={acceptedCvFileTypes}
              onChange={handleCvFileChange}
              className={cn(
                formControlClassName,
                "h-auto cursor-pointer py-2 file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-navy-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-navy-800",
              )}
            />
            {cvFile && !cvErrorMessage && (
              <p className="flex items-center gap-2 text-sm text-navy-700">
                <FileText aria-hidden="true" className="size-4 text-gold-600" />
                {cvFile.name} ({formatFileSize(cvFile.size)})
              </p>
            )}
          </div>
        )}
      </FormField>

      <HoneypotField inputRef={spamProtection.honeypotInputRef} />

      <TurnstileWidget
        onTokenChange={spamProtection.handleTurnstileTokenChange}
        resetCounter={spamProtection.turnstileResetCounter}
        errorMessage={spamProtection.turnstileErrorMessage}
      />

      <p aria-live="polite" className="text-sm font-medium text-navy-700">
        {progressMessage}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="accent" size="xl" disabled={isBusy}>
          {isBusy ? "Sending…" : "Submit application"}
        </Button>
        <p className="text-sm text-muted-foreground">
          We handle your CV in line with our{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
