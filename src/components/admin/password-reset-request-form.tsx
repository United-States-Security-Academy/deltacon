"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormField, formControlClassName } from "@/components/forms/form-field";
import { FormErrorBanner } from "@/components/forms/form-status-messages";
import { Button } from "@/components/ui/button";
import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from "@/lib/validation/admin-schemas";
import { requestPasswordReset } from "@/server/actions/admin/admin-auth-actions";

export function PasswordResetRequestForm() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasSent, setHasSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema),
  });

  const sendResetLink = handleSubmit(async (formValues) => {
    setErrorMessage(undefined);
    const result = await requestPasswordReset(formValues);
    if (result.status === "success") setHasSent(true);
    else setErrorMessage(result.message);
  });

  if (hasSent) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-4 text-center"
      >
        <MailCheck aria-hidden="true" className="size-10 text-green-700" />
        <p className="text-charcoal">
          If that email belongs to an admin, we&apos;ve sent a link to reset the
          password. It can only be used once and expires soon.
        </p>
        <Link
          href="/admin/login"
          className="font-medium text-gold-700 underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={sendResetLink} noValidate className="flex flex-col gap-5">
      {errorMessage && <FormErrorBanner message={errorMessage} />}
      <FormField
        fieldId="reset-email"
        label="Email"
        isRequired
        errorMessage={errors.email?.message}
      >
        {(controlProps) => (
          <input
            {...controlProps}
            {...register("email")}
            type="email"
            autoComplete="username"
            className={formControlClassName}
          />
        )}
      </FormField>
      <Button type="submit" variant="accent" size="xl" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
      <Link
        href="/admin/login"
        className="self-center text-sm font-medium text-gold-700 underline-offset-4 hover:underline"
      >
        Back to sign in
      </Link>
    </form>
  );
}
