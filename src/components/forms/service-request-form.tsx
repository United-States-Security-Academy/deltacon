"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
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
import { industries } from "@/config/industries";
import { services } from "@/config/services";
import { cn } from "@/lib/utils";
import {
  otherIndustryValue,
  serviceRequestFormSchema,
  type ServiceRequestFormInput,
} from "@/lib/validation/submission-schemas";
import { submitServiceRequest } from "@/server/actions/public/submit-service-request";

type ServiceRequestFormOutput = z.output<typeof serviceRequestFormSchema>;

const serviceOptions = services.map((service) => ({
  value: service.slug,
  label: service.name,
}));

const industryOptions = [
  ...industries.map((industry) => ({
    value: industry.slug,
    label: industry.name,
  })),
  { value: otherIndustryValue, label: "Other" },
];

const formFieldNames = Object.keys(serviceRequestFormSchema.shape);

export function ServiceRequestForm({
  preselectedServiceSlug,
  preselectedIndustrySlug,
  prefilledMessage,
}: {
  preselectedServiceSlug?: string;
  preselectedIndustrySlug?: string;
  /** e.g. the self-assessment score and focus areas. */
  prefilledMessage?: string;
}) {
  const spamProtection = useSpamProtection();
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestFormInput, unknown, ServiceRequestFormOutput>({
    resolver: zodResolver(serviceRequestFormSchema),
    defaultValues: {
      serviceSlug: services.some(
        (service) => service.slug === preselectedServiceSlug,
      )
        ? (preselectedServiceSlug as ServiceRequestFormInput["serviceSlug"])
        : undefined,
      industrySlug: industries.some(
        (industry) => industry.slug === preselectedIndustrySlug,
      )
        ? (preselectedIndustrySlug as ServiceRequestFormInput["industrySlug"])
        : undefined,
      message: prefilledMessage,
    },
  });

  const sendForm = handleSubmit(async (formValues) => {
    setBannerErrorMessage(undefined);
    if (!spamProtection.turnstileToken) {
      spamProtection.setTurnstileErrorMessage(missingTurnstileMessage);
      return;
    }

    const result = await submitServiceRequest({
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
      <FormSuccessMessage title="Request received">
        <p>
          Thank you. Your request has been sent to our team and we&apos;ve
          emailed you a copy. We usually respond within one business day.
        </p>
        <p>
          <Link
            href="/services"
            className="font-semibold text-gold-700 underline"
          >
            Explore our services
          </Link>
        </p>
      </FormSuccessMessage>
    );
  }

  return (
    <form
      onSubmit={sendForm}
      noValidate
      aria-describedby="service-request-required-note"
      className="relative flex flex-col gap-6"
    >
      <p
        id="service-request-required-note"
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
          fieldId="company-name"
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
          fieldId="service"
          label="Service needed"
          isRequired
          errorMessage={errors.serviceSlug?.message}
        >
          {(controlProps) => (
            <NativeSelect
              {...controlProps}
              {...register("serviceSlug")}
              options={serviceOptions}
              placeholder="Choose a service"
            />
          )}
        </FormField>

        <FormField
          fieldId="industry"
          label="Industry"
          isRequired
          errorMessage={errors.industrySlug?.message}
        >
          {(controlProps) => (
            <NativeSelect
              {...controlProps}
              {...register("industrySlug")}
              options={industryOptions}
              placeholder="Choose your industry"
            />
          )}
        </FormField>

        <FormField
          fieldId="site-location"
          label="Site location"
          isRequired
          hint="City or full address of the site to be protected."
          errorMessage={errors.siteLocation?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("siteLocation")}
              type="text"
              autoComplete="street-address"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="estimated-scope"
          label="Number of guards / estimated scope"
          isRequired
          hint="For example: 2 officers, 24/7, or a one-day event for 500 guests."
          errorMessage={errors.estimatedScope?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("estimatedScope")}
              type="text"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="preferred-start-date"
          label="Preferred start date"
          errorMessage={errors.preferredStartDate?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("preferredStartDate")}
              type="date"
              className={formControlClassName}
            />
          )}
        </FormField>
      </div>

      <FormField
        fieldId="message"
        label="Message"
        isRequired
        hint="Tell us about the site, any concerns and anything else we should know."
        errorMessage={errors.message?.message}
      >
        {(controlProps) => (
          <Textarea
            {...controlProps}
            {...register("message")}
            rows={6}
            className={cn(formControlClassName, "h-auto min-h-36 py-2.5")}
          />
        )}
      </FormField>

      <HoneypotField inputRef={spamProtection.honeypotInputRef} />

      <TurnstileWidget
        onTokenChange={spamProtection.handleTurnstileTokenChange}
        resetCounter={spamProtection.turnstileResetCounter}
        errorMessage={spamProtection.turnstileErrorMessage}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          variant="accent"
          size="xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending…" : "Send request"}
        </Button>
        <p className="text-sm text-muted-foreground">
          By sending this form you agree to our{" "}
          <Link href="/privacy" className="underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
