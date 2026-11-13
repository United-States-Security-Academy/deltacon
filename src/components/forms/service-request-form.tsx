"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  useForm,
  useWatch,
  type UseFormRegisterReturn,
} from "react-hook-form";
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
import {
  additionalServices,
  contractDurations,
  coverageTypes,
  findQuotePrefillForService,
  needsSecurityOfficers,
  officerClassifications,
  primaryServiceTypes,
} from "@/config/service-request-options";
import { cn } from "@/lib/utils";
import {
  maximumOfficersRequired,
  otherIndustryValue,
  serviceRequestFieldNames,
  serviceRequestFormSchema,
  type ServiceRequestFormInput,
} from "@/lib/validation/submission-schemas";
import { submitServiceRequest } from "@/server/actions/public/submit-service-request";

type ServiceRequestFormOutput = z.output<typeof serviceRequestFormSchema>;

const industryOptions = [
  ...industries.map((industry) => ({
    value: industry.slug,
    label: industry.name,
  })),
  { value: otherIndustryValue, label: "Other" },
];

const contractDurationOptions = contractDurations.map((duration) => ({
  value: duration.id,
  label: duration.label,
}));

const securityNeedsExample =
  "Example: We manage a distribution warehouse in Houston and need two unarmed security officers overnight to control entry, verify truck drivers, conduct hourly foot patrols, and document suspicious activity. We need coverage beginning December 1 for a 12-month contract.";

export function ServiceRequestForm({
  preselectedServiceSlug,
  preselectedIndustrySlug,
  prefilledMessage,
  prefilledSiteLocation,
}: {
  /** A service page's slug; picks the matching quote options. */
  preselectedServiceSlug?: string;
  preselectedIndustrySlug?: string;
  /** e.g. the self-assessment score and focus areas. */
  prefilledMessage?: string;
  /** e.g. "Dallas–Fort Worth, TX" when opened from a location page. */
  prefilledSiteLocation?: string;
}) {
  const spamProtection = useSpamProtection();
  const [bannerErrorMessage, setBannerErrorMessage] = useState<string>();
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const prefill = findQuotePrefillForService(preselectedServiceSlug);

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestFormInput, unknown, ServiceRequestFormOutput>({
    resolver: zodResolver(serviceRequestFormSchema),
    defaultValues: {
      primaryServiceType: prefill?.primaryServiceType,
      officerClassification: prefill?.officerClassification,
      additionalServices: prefill?.additionalServices ?? [],
      industrySlug: industries.some(
        (industry) => industry.slug === preselectedIndustrySlug,
      )
        ? (preselectedIndustrySlug as ServiceRequestFormInput["industrySlug"])
        : "",
      siteLocation: prefilledSiteLocation,
      message: prefilledMessage,
    },
  });

  // Consulting, staffing and custodial requests don't need officer details.
  const showOfficerQuestions = needsSecurityOfficers(
    useWatch({ control, name: "primaryServiceType" }),
  );

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
      showServerFieldErrors(result.fieldErrors, setError, serviceRequestFieldNames),
    );
  });

  if (hasSubmitted) {
    return (
      <FormSuccessMessage title="Quote request received">
        <p>
          Thank you. Your request has been sent to our security team and
          we&apos;ve emailed you a copy. We usually respond within one business
          day.
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
      className="relative flex flex-col gap-10"
    >
      <p
        id="service-request-required-note"
        className="-mb-4 text-sm text-muted-foreground"
      >
        Fields marked <span className="text-flag-red">*</span> are required.
      </p>

      {bannerErrorMessage && <FormErrorBanner message={bannerErrorMessage} />}

      <FormSection number={1} title="Contact & Organization Information">
        <FormField
          fieldId="company-name"
          label="Company / Organization Name"
          isRequired
          errorMessage={errors.companyName?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("companyName")}
              type="text"
              autoComplete="organization"
              placeholder="Business or government agency name"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="full-name"
          label="Contact Person"
          isRequired
          errorMessage={errors.fullName?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("fullName")}
              type="text"
              autoComplete="name"
              placeholder="Full name"
              className={formControlClassName}
            />
          )}
        </FormField>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            fieldId="email"
            label="Email Address"
            isRequired
            errorMessage={errors.email?.message}
          >
            {(controlProps) => (
              <input
                {...controlProps}
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="name@company.com"
                className={formControlClassName}
              />
            )}
          </FormField>

          <FormField
            fieldId="phone"
            label="Phone Number"
            isRequired
            errorMessage={errors.phone?.message}
          >
            {(controlProps) => (
              <input
                {...controlProps}
                {...register("phone")}
                type="tel"
                autoComplete="tel"
                placeholder="(###) ###-####"
                className={formControlClassName}
              />
            )}
          </FormField>
        </div>

        <FormField
          fieldId="site-location"
          label="Security Service Location"
          isRequired
          errorMessage={errors.siteLocation?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("siteLocation")}
              type="text"
              autoComplete="street-address"
              placeholder="Facility address, city, state, ZIP"
              className={formControlClassName}
            />
          )}
        </FormField>

        <FormField
          fieldId="industry"
          label="Industry"
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
      </FormSection>

      <FormSection number={2} title="Security Services Requested">
        <ChoiceGroup
          groupId="primary-service-type"
          legend="Primary Service Type"
          isRequired
          errorMessage={errors.primaryServiceType?.message}
        >
          {primaryServiceTypes.map((option) => (
            <ChoiceOption
              key={option.id}
              type="radio"
              value={option.id}
              label={option.label}
              registration={register("primaryServiceType")}
              isInvalid={Boolean(errors.primaryServiceType)}
            />
          ))}
        </ChoiceGroup>

        {showOfficerQuestions && (
          <ChoiceGroup
            groupId="officer-classification"
            legend="Security Officer Classification"
            isRequired
            errorMessage={errors.officerClassification?.message}
          >
            {officerClassifications.map((option) => (
              <ChoiceOption
                key={option.id}
                type="radio"
                value={option.id}
                label={option.label}
                registration={register("officerClassification")}
                isInvalid={Boolean(errors.officerClassification)}
              />
            ))}
          </ChoiceGroup>
        )}

        <ChoiceGroup
          groupId="additional-services"
          legend="Additional Services Needed"
          hint="Select all that apply."
          errorMessage={errors.additionalServices?.message}
        >
          {additionalServices.map((option) => (
            <ChoiceOption
              key={option.id}
              type="checkbox"
              value={option.id}
              label={option.label}
              registration={register("additionalServices")}
              isInvalid={Boolean(errors.additionalServices)}
            />
          ))}
        </ChoiceGroup>

        {showOfficerQuestions && (
          <FormField
            fieldId="officers-required"
            label="Number of Security Officers Required"
            isRequired
            errorMessage={errors.officersRequired?.message}
            className="md:max-w-xs"
          >
            {(controlProps) => (
              <input
                {...controlProps}
                {...register("officersRequired")}
                type="number"
                inputMode="numeric"
                min={1}
                max={maximumOfficersRequired}
                step={1}
                className={formControlClassName}
              />
            )}
          </FormField>
        )}
      </FormSection>

      <FormSection number={3} title="Coverage Schedule & Contract Duration">
        <ChoiceGroup
          groupId="coverage-type"
          legend="Required Coverage"
          isRequired
          errorMessage={errors.coverageType?.message}
        >
          {coverageTypes.map((option) => (
            <ChoiceOption
              key={option.id}
              type="radio"
              value={option.id}
              label={option.label}
              registration={register("coverageType")}
              isInvalid={Boolean(errors.coverageType)}
            />
          ))}
        </ChoiceGroup>

        <FormField
          fieldId="coverage-hours"
          label="Coverage Hours / Shifts"
          errorMessage={errors.coverageHours?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("coverageHours")}
              type="text"
              placeholder="e.g., Mon–Fri, 7 AM–7 PM; two officers per shift"
              className={formControlClassName}
            />
          )}
        </FormField>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            fieldId="contract-duration"
            label="Contract Duration"
            isRequired
            errorMessage={errors.contractDuration?.message}
          >
            {(controlProps) => (
              <NativeSelect
                {...controlProps}
                {...register("contractDuration")}
                options={contractDurationOptions}
                placeholder="Choose a contract duration"
              />
            )}
          </FormField>

          <FormField
            fieldId="preferred-start-date"
            label="Anticipated Service Start Date"
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
      </FormSection>

      <FormSection number={4} title="Describe Your Security Needs">
        <FormField
          fieldId="message"
          label="Your security needs"
          isRequired
          hint="Please explain exactly why security services are needed. Describe your facility, any current security concerns, recent incidents, special risks, required officer duties, and what you expect Deltacon Security to accomplish."
          errorMessage={errors.message?.message}
        >
          {(controlProps) => (
            <Textarea
              {...controlProps}
              {...register("message")}
              rows={6}
              placeholder={securityNeedsExample}
              className={cn(formControlClassName, "h-auto min-h-40 py-2.5")}
            />
          )}
        </FormField>
      </FormSection>

      <div className="flex flex-col gap-6">
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
            {isSubmitting ? "Sending…" : "Send Quote Request"}
          </Button>
          <p className="text-sm text-muted-foreground">
            By sending this form you agree to our{" "}
            <Link href="/privacy" className="underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </form>
  );
}

/** A numbered part of the form, e.g. "2. Security Services Requested". */
function FormSection({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: ReactNode;
}) {
  // A plain div, not <section>: four named landmarks would clutter screen
  // reader navigation, and the heading already marks where each part starts.
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        number > 1 && "border-t border-border pt-8",
      )}
    >
      <h3 className="text-xl font-bold text-navy-900">
        {number}. {title}
      </h3>
      {children}
    </div>
  );
}

/**
 * A set of radio buttons or checkboxes under one question. The fieldset and
 * legend make screen readers announce the question with each choice.
 */
function ChoiceGroup({
  groupId,
  legend,
  isRequired = false,
  hint,
  errorMessage,
  children,
}: {
  groupId: string;
  legend: string;
  isRequired?: boolean;
  hint?: string;
  errorMessage?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${groupId}-hint` : undefined;
  const errorId = errorMessage ? `${groupId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      id={groupId}
      aria-describedby={describedBy}
      className="flex min-w-0 flex-col gap-2"
    >
      <legend className="mb-2 text-sm font-semibold text-navy-900">
        {legend}
        {isRequired ? (
          <>
            <span aria-hidden="true" className="ml-2 text-flag-red">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </>
        ) : (
          <span className="ml-2 font-normal text-muted-foreground">
            (optional)
          </span>
        )}
      </legend>
      {hint && (
        <p id={hintId} className="-mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">{children}</div>
      {errorMessage && (
        <p id={errorId} className="text-sm font-medium text-flag-red">
          {errorMessage}
        </p>
      )}
    </fieldset>
  );
}

function ChoiceOption({
  type,
  value,
  label,
  registration,
  isInvalid,
}: {
  type: "radio" | "checkbox";
  value: string;
  label: string;
  registration: UseFormRegisterReturn;
  isInvalid: boolean;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border border-input bg-white px-3 py-2.5 text-base text-charcoal transition-colors hover:border-navy-600 has-checked:border-gold-600 has-checked:bg-gold-300/15 has-focus-visible:ring-3 has-focus-visible:ring-gold-500/30",
        isInvalid && "border-flag-red",
      )}
    >
      <input
        {...registration}
        type={type}
        value={value}
        aria-invalid={isInvalid}
        className="mt-0.5 size-5 shrink-0 accent-navy-900 focus-visible:outline-none"
      />
      <span>{label}</span>
    </label>
  );
}
