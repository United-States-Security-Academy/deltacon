"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/components/admin/password-input";
import { FormField, formControlClassName } from "@/components/forms/form-field";
import { FormErrorBanner } from "@/components/forms/form-status-messages";
import { Button } from "@/components/ui/button";
import {
  signInSchema,
  type SignInFormInput,
} from "@/lib/validation/admin-schemas";
import { signInAdmin } from "@/server/actions/admin/admin-auth-actions";

export function SignInForm({ redirectTo }: { redirectTo?: string }) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormInput>({ resolver: zodResolver(signInSchema) });

  const signIn = handleSubmit(async (formValues) => {
    setErrorMessage(undefined);
    // On success the server redirects into the admin area.
    const result = await signInAdmin(formValues, redirectTo);
    if (result?.status === "error") setErrorMessage(result.message);
  });

  return (
    <form onSubmit={signIn} noValidate className="flex flex-col gap-5">
      {errorMessage && <FormErrorBanner message={errorMessage} />}

      <FormField
        fieldId="sign-in-email"
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

      <FormField
        fieldId="sign-in-password"
        label="Password"
        isRequired
        errorMessage={errors.password?.message}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            {...register("password")}
            autoComplete="current-password"
          />
        )}
      </FormField>

      <Button type="submit" variant="accent" size="xl" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <Link
        href="/admin/forgot-password"
        className="self-center text-sm font-medium text-gold-700 underline-offset-4 hover:underline"
      >
        Forgot your password?
      </Link>
    </form>
  );
}
