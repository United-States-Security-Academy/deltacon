"use client";

import { useEffect, useState, type FormEvent } from "react";

import { formControlClassName } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type TextPromptDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  fieldLabel: string;
  initialValue?: string;
  placeholder?: string;
  submitLabel: string;
  /** Returns an error message to show, or undefined if the value is fine. */
  validate?: (value: string) => string | undefined;
  onSubmit: (value: string) => void;
  onClose: () => void;
};

/** A small accessible dialog that asks for one piece of text (a link, a video address…). */
export function TextPromptDialog({
  isOpen,
  title,
  description,
  fieldLabel,
  initialValue = "",
  placeholder,
  submitLabel,
  validate,
  onSubmit,
  onClose,
}: TextPromptDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (isOpen) {
      // Reset the field each time the dialog opens.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(initialValue);
      setErrorMessage(undefined);
    }
  }, [isOpen, initialValue]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmedValue = value.trim();
    const problem = validate?.(trimmedValue);
    if (problem) {
      setErrorMessage(problem);
      return;
    }
    onSubmit(trimmedValue);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl font-bold text-navy-900 uppercase">
              {title}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="text-prompt-value"
              className="font-semibold text-navy-900"
            >
              {fieldLabel}
            </Label>
            <input
              id="text-prompt-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={placeholder}
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? "text-prompt-error" : undefined}
              className={formControlClassName}
              autoFocus
            />
            {errorMessage && (
              <p
                id="text-prompt-error"
                className="text-sm font-medium text-flag-red"
              >
                {errorMessage}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="accent">
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
