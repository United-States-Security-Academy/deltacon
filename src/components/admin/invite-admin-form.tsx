"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { FormField, formControlClassName } from "@/components/forms/form-field";
import { FormErrorBanner } from "@/components/forms/form-status-messages";
import { showServerFieldErrors } from "@/components/forms/use-spam-protection";
import { Button } from "@/components/ui/button";
import {
  inviteAdminSchema,
  type InviteAdminFormInput,
} from "@/lib/validation/admin-schemas";
import { inviteAdmin } from "@/server/actions/admin/admin-users-actions";

const formFieldNames = Object.keys(inviteAdminSchema.shape);

/** Invite a colleague to the admin area by email. */
export function InviteAdminForm() {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [invitedEmail, setInvitedEmail] = useState<string>();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteAdminFormInput>({
    resolver: zodResolver(inviteAdminSchema),
  });

  const sendInvite = handleSubmit(async (formValues) => {
    setErrorMessage(undefined);
    setInvitedEmail(undefined);
    const result = await inviteAdmin(formValues);
    if (result.status === "success") {
      setInvitedEmail(formValues.email);
      reset();
      return;
    }
    setErrorMessage(result.message);
    showServerFieldErrors(result.fieldErrors, setError, formFieldNames);
  });

  return (
    <form onSubmit={sendInvite} noValidate className="flex flex-col gap-5">
      {errorMessage && <FormErrorBanner message={errorMessage} />}
      {invitedEmail && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm font-medium text-green-800"
        >
          <CircleCheck aria-hidden="true" className="size-5 shrink-0" />
          Invitation sent to {invitedEmail}.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          fieldId="invite-full-name"
          label="Full name"
          isRequired
          errorMessage={errors.fullName?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("fullName")}
              type="text"
              autoComplete="off"
              className={formControlClassName}
            />
          )}
        </FormField>
        <FormField
          fieldId="invite-email"
          label="Email"
          isRequired
          errorMessage={errors.email?.message}
        >
          {(controlProps) => (
            <input
              {...controlProps}
              {...register("email")}
              type="email"
              autoComplete="off"
              className={formControlClassName}
            />
          )}
        </FormField>
      </div>
      <div>
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending invitation…" : "Send invitation"}
        </Button>
      </div>
    </form>
  );
}
