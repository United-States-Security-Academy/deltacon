"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { PasswordInput } from "@/components/admin/password-input";
import { FormField } from "@/components/forms/form-field";
import { FormErrorBanner } from "@/components/forms/form-status-messages";
import { Button } from "@/components/ui/button";
import {
  minimumPasswordLength,
  newPasswordSchema,
  type NewPasswordFormInput,
} from "@/lib/validation/admin-schemas";
import { setAdminPassword } from "@/server/actions/admin/admin-auth-actions";

type SetPasswordFormProps = {
  /** Where to go after saving; leave out to stay on the page and show a message. */
  continueTo?: string;
  submitLabel?: string;
};

/** Choose or change the signed-in admin's password. */
export function SetPasswordForm({
  continueTo,
  submitLabel = "Save password",
}: SetPasswordFormProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [hasSaved, setHasSaved] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPasswordFormInput>({
    resolver: zodResolver(newPasswordSchema),
  });

  const savePassword = handleSubmit(async (formValues) => {
    setErrorMessage(undefined);
    setHasSaved(false);
    const result = await setAdminPassword(formValues);
    if (result.status === "error") {
      setErrorMessage(result.message);
      return;
    }
    if (continueTo) {
      router.push(continueTo);
    } else {
      reset();
      setHasSaved(true);
    }
  });

  return (
    <form onSubmit={savePassword} noValidate className="flex flex-col gap-5">
      {errorMessage && <FormErrorBanner message={errorMessage} />}
      {hasSaved && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm font-medium text-green-800"
        >
          <CircleCheck aria-hidden="true" className="size-5" />
          Your password has been changed.
        </p>
      )}

      <FormField
        fieldId="new-password"
        label="New password"
        isRequired
        hint={`At least ${minimumPasswordLength} characters, with letters and numbers.`}
        errorMessage={errors.password?.message}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            {...register("password")}
            autoComplete="new-password"
          />
        )}
      </FormField>

      <FormField
        fieldId="confirm-password"
        label="Confirm new password"
        isRequired
        errorMessage={errors.confirmPassword?.message}
      >
        {(controlProps) => (
          <PasswordInput
            {...controlProps}
            {...register("confirmPassword")}
            autoComplete="new-password"
          />
        )}
      </FormField>

      <Button type="submit" variant="accent" size="xl" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : submitLabel}
      </Button>
    </form>
  );
}
