"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
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
import { trainingCourses } from "@/config/training-courses";
import { cn } from "@/lib/utils";
import {
  trainingEnquiryFormSchema,
  type TrainingEnquiryFormInput,
} from "@/lib/validation/submission-schemas";
import { submitTrainingEnquiry } from "@/server/actions/public/submit-training-enquiry";

type TrainingEnquiryFormOutput = z.output<typeof trainingEnquiryFormSchema>;

const courseOptions = trainingCourses.map((course) => ({
  value: course.slug,
  label: course.name,
}));

const formFieldNames = Object.keys(trainingEnquiryFormSchema.shape);

export function TrainingEnquiryForm({
  preselectedCourseSlug,
}: {
  preselectedCourseSlug?: string;
}) {
  // The form can appear more than once on a page (section + dialog), so every
  // field id is made unique.
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;

  const spamProtection = useSpamProtection();
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TrainingEnquiryFormInput, unknown, TrainingEnquiryFormOutput>({
    resolver: zodResolver(trainingEnquiryFormSchema),
    defaultValues: {
      courseSlug:
        preselectedCourseSlug as TrainingEnquiryFormInput["courseSlug"],
      numberOfTrainees: 1,
    },
  });

  const sendForm = handleSubmit(async (formValues) => {
    setBannerErrorMessage(undefined);
    if (!spamProtection.turnstileToken) {
      spamProtection.setTurnstileErrorMessage(missingTurnstileMessage);
      return;
    }

    const result = await submitTrainingEnquiry({
      ...formValues,
      turnstileToken: spamProtection.turnstileToken,
      website: spamProtection.readHoneypotValue(),
    });

    if (result.status === "success") {
      setHasSubmitted(true);
      return;
    }
    spamProtection.requestNewTurnstileToken();
    setBannerErrorMessage(result.message);
    spamProtection.setTurnstileErrorMessage(
      showServerFieldErrors(result.fieldErrors, setError, formFieldNames),
    );
  });

  if (hasSubmitted) {
    return (
      <FormSuccessMessage title="Enquiry received">
        <p>
          Thank you. We&apos;ve received your training enquiry and emailed you a
          copy. We&apos;ll be in touch soon with dates and pricing.
        </p>
      </FormSuccessMessage>
    );
  }

  return (
    <form
      onSubmit={sendForm}
      noValidate
      className="relative flex flex-col gap-5"
    >
      {bannerErrorMessage && <FormErrorBanner message={bannerErrorMessage} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          fieldId={fieldId("full-name")}
          label="Name"
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
          fieldId={fieldId("email")}
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
          fieldId={fieldId("phone")}
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
          fieldId={fieldId("trainees")}
          label="Number of trainees"
          isRequired
          errorMessage={errors.numberOfTrainees?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("numberOfTrainees", { valueAsNumber: true })}
              type="number"
              inputMode="numeric"
              min={1}
              max={500}
              className={formControlClassName}
            />
          )}
        </FormField>
      </div>

      <FormField
        fieldId={fieldId("course")}
        label="Course"
        isRequired
        errorMessage={errors.courseSlug?.message}
      >
        {(controlProps) => (
          <NativeSelect
            {...controlProps}
            {...register("courseSlug")}
            options={courseOptions}
            placeholder="Choose a course"
          />
        )}
      </FormField>

      <FormField
        fieldId={fieldId("message")}
        label="Message"
        hint="Preferred dates, location or any questions."
        errorMessage={errors.message?.message}
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            {...register("message")}
            rows={4}
            className={cn(formControlClassName, "h-auto min-h-28 py-2.5")}
          />
        )}
      </FormField>

      <HoneypotField inputRef={spamProtection.honeypotInputRef} />

      <TurnstileWidget
        onTokenChange={spamProtection.handleTurnstileTokenChange}
        resetCounter={spamProtection.turnstileResetCounter}
        errorMessage={spamProtection.turnstileErrorMessage}
      />

      <div>
        <Button
          type="submit"
          variant="accent"
          size="xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}
