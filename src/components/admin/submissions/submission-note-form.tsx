"use client";

import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { submissionNoteSchema } from "@/lib/validation/submission-inbox-schemas";
import { addSubmissionNote } from "@/server/actions/admin/submission-actions";

/** Adds an internal note. Notes are only ever seen by admins. */
export function SubmissionNoteForm({ submissionId }: { submissionId: string }) {
  const [body, setBody] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSaving, startSaving] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function saveNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = submissionNoteSchema.safeParse({ body });
    if (!validation.success) {
      setErrorMessage(validation.error.issues[0]?.message);
      textareaRef.current?.focus();
      return;
    }
    setErrorMessage(undefined);
    startSaving(async () => {
      const result = await addSubmissionNote(submissionId, validation.data);
      if (result.status === "error") {
        setErrorMessage(result.message);
      } else {
        setBody("");
      }
    });
  }

  return (
    <form onSubmit={saveNote} noValidate className="flex flex-col gap-3">
      <label
        htmlFor="submission-note"
        className="text-sm font-semibold text-navy-900"
      >
        Add a note
      </label>
      <Textarea
        ref={textareaRef}
        id="submission-note"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={3}
        maxLength={5000}
        placeholder="e.g. Called back, site visit booked for Tuesday."
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={errorMessage ? "submission-note-error" : undefined}
        className="bg-white"
      />
      {errorMessage && (
        <p
          id="submission-note-error"
          role="alert"
          className="text-sm text-flag-red"
        >
          {errorMessage}
        </p>
      )}
      <div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save note"}
        </Button>
      </div>
    </form>
  );
}
