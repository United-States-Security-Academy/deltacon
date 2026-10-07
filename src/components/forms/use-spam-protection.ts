"use client";

import { useCallback, useRef, useState } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

/**
 * Keeps the Turnstile token and honeypot for a form. A Turnstile token can be
 * used only once, so after every attempt that reached the server call
 * `requestNewTurnstileToken()` to get a fresh one.
 */
export function useSpamProtection() {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetCounter, setTurnstileResetCounter] = useState(0);
  const [turnstileErrorMessage, setTurnstileErrorMessage] = useState<string>();
  const honeypotInputRef = useRef<HTMLInputElement>(null);

  const handleTurnstileTokenChange = useCallback((token: string | null) => {
    setTurnstileToken(token);
    if (token) setTurnstileErrorMessage(undefined);
  }, []);

  const requestNewTurnstileToken = useCallback(() => {
    setTurnstileResetCounter((counter) => counter + 1);
  }, []);

  const readHoneypotValue = useCallback(
    () => honeypotInputRef.current?.value ?? "",
    [],
  );

  return {
    turnstileToken,
    turnstileResetCounter,
    turnstileErrorMessage,
    setTurnstileErrorMessage,
    handleTurnstileTokenChange,
    requestNewTurnstileToken,
    honeypotInputRef,
    readHoneypotValue,
  };
}

export const missingTurnstileMessage =
  "Please complete the security check before sending.";

/**
 * Shows the server's per-field messages next to the matching fields. Returns
 * the Turnstile message, if any, so the form can show it by the widget.
 */
export function showServerFieldErrors<FormValues extends FieldValues>(
  fieldErrors: Record<string, string> | undefined,
  setError: UseFormSetError<FormValues>,
  formFieldNames: readonly string[],
): string | undefined {
  if (!fieldErrors) return undefined;
  for (const [fieldName, message] of Object.entries(fieldErrors)) {
    if (formFieldNames.includes(fieldName)) {
      setError(fieldName as Path<FormValues>, { type: "server", message });
    }
  }
  return fieldErrors.turnstileToken;
}
