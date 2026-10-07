"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { FormField, formControlClassName } from "@/components/forms/form-field";
import { FormErrorBanner } from "@/components/forms/form-status-messages";
import { HoneypotField } from "@/components/forms/honeypot-field";
import { TurnstileWidget } from "@/components/forms/turnstile-widget";
import {
  missingTurnstileMessage,
  showServerFieldErrors,
  useSpamProtection,
} from "@/components/forms/use-spam-protection";
import { Button } from "@/components/ui/button";
import type { AssessmentAnswers } from "@/lib/security-assessment/score-assessment";
import {
  assessmentEmailFormSchema,
  type AssessmentEmailFormInput,
} from "@/lib/validation/assessment-schemas";
import { emailAssessmentResults } from "@/server/actions/public/email-assessment-results";

type AssessmentEmailFormOutput = z.output<typeof assessmentEmailFormSchema>;

const formFieldNames = Object.keys(assessmentEmailFormSchema.shape);

/** "Email me my results" form shown on the results screen. */
export function EmailResultsForm({ answers }: { answers: AssessmentAnswers }) {
  const spamProtection = useSpamProtection();
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string>();
  const [sentToEmail, setSentToEmail] = useState<string>();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<AssessmentEmailFormInput, unknown, AssessmentEmailFormOutput>({
    resolver: zodResolver(assessmentEmailFormSchema),
  });

  const sendResults = handleSubmit(async (formValues) => {
    setBannerErrorMessage(undefined);
    if (!spamProtection.turnstileToken) {
      spamProtection.setTurnstileErrorMessage(missingTurnstileMessage);
      return;
    }

    const result = await emailAssessmentResults({
      ...formValues,
      answers,
      turnstileToken: spamProtection.turnstileToken,
      website: spamProtection.readHoneypotValue(),
    });

    if (result.status === "success") {
      setSentToEmail(formValues.email);
      return;
    }
    spamProtection.requestNewTurnstileToken();
    setBannerErrorMessage(result.message);
    spamProtection.setTurnstileErrorMessage(
      showServerFieldErrors(result.fieldErrors, setError, formFieldNames),
    );
  });

  if (sentToEmail) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-lg border border-green-700/30 bg-green-50 p-5 text-charcoal"
      >
        <MailCheck
          aria-hidden="true"
          className="size-6 shrink-0 text-green-700"
        />
        <p>
          Your results are on their way to <strong>{sentToEmail}</strong>. If
          you don&apos;t see them in a few minutes, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={sendResults}
      noValidate
      className="relative flex flex-col gap-5"
    >
      {bannerErrorMessage && <FormErrorBanner message={bannerErrorMessage} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          fieldId="assessment-full-name"
          label="Your name"
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
          fieldId="assessment-email"
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
      </div>
      <FormField
        fieldId="assessment-company"
        label="Company"
        errorMessage={errors.companyName?.message}
      >
        {(controlProps) => (
          <input
            {...controlProps}
            {...register("companyName")}
            type="text"
            autoComplete="organization"
            className={formControlClassName}
          />
        )}
      </FormField>

      <HoneypotField inputRef={spamProtection.honeypotInputRef} />
      <TurnstileWidget
        onTokenChange={spamProtection.handleTurnstileTokenChange}
        resetCounter={spamProtection.turnstileResetCounter}
        errorMessage={spamProtection.turnstileErrorMessage}
      />

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Email me my results"}
        </Button>
        <p className="text-sm text-muted-foreground">
          We&apos;ll email your results and a copy goes to our team so we can
          help if you&apos;d like. No spam. See our{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
