import type { ComponentProps, ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Props every form control needs so screen readers link it to its label, hint and error. */
export type FieldControlProps = {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby": string | undefined;
  "aria-required": boolean;
};

type FormFieldProps = {
  fieldId: string;
  label: string;
  isRequired?: boolean;
  hint?: string;
  errorMessage?: string;
  className?: string;
  children: (controlProps: FieldControlProps) => ReactNode;
};

/**
 * Label + control + optional hint + error message, all correctly connected:
 * the error is announced when the field is focused, and the control is marked
 * aria-invalid while it has an error.
 */
export function FormField({
  fieldId,
  label,
  isRequired = false,
  hint,
  errorMessage,
  className,
  children,
}: FormFieldProps) {
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = errorMessage ? `${fieldId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={fieldId} className="text-sm font-semibold text-navy-900">
        {label}
        {isRequired ? (
          <span aria-hidden="true" className="text-flag-red">
            *
          </span>
        ) : (
          <span className="font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {hint && (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      )}
      {children({
        id: fieldId,
        "aria-invalid": Boolean(errorMessage),
        "aria-describedby": describedBy,
        "aria-required": isRequired,
      })}
      {errorMessage && (
        <p id={errorId} className="text-sm font-medium text-flag-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

/** Shared look for inputs, selects and text areas on the public forms. */
export const formControlClassName =
  "h-11 w-full rounded-md border border-input bg-white px-3 text-base text-charcoal shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-gold-600 focus-visible:ring-3 focus-visible:ring-gold-500/30 aria-invalid:border-flag-red aria-invalid:ring-flag-red/15 disabled:opacity-60";

type SelectOption = { value: string; label: string };

/**
 * A native <select>: the most reliable choice for keyboards, screen readers
 * and mobile pickers.
 */
export function NativeSelect({
  options,
  placeholder,
  className,
  ...selectProps
}: ComponentProps<"select"> & {
  options: readonly SelectOption[];
  placeholder: string;
}) {
  return (
    <select
      className={cn(formControlClassName, "pr-8", className)}
      {...selectProps}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
