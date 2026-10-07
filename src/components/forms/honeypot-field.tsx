"use client";

import { useId, type Ref } from "react";

/**
 * Spam trap. Hidden from sighted visitors and screen readers, and skipped by
 * the keyboard, so only automated bots fill it in. The server ignores any
 * submission where it has a value.
 */
export function HoneypotField({
  inputRef,
}: {
  inputRef: Ref<HTMLInputElement>;
}) {
  // Unique per form, because a page can show more than one form.
  const inputId = `${useId()}-website`;

  return (
    <div
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px overflow-hidden"
    >
      <label htmlFor={inputId}>Leave this field empty</label>
      <input
        ref={inputRef}
        id={inputId}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}
