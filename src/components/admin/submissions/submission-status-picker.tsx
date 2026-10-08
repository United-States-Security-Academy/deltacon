"use client";

import { useState, useTransition } from "react";

import { formControlClassName } from "@/components/forms/form-field";
import {
  submissionStatusEnum,
  type SubmissionStatus,
} from "@/lib/database/schema/enums";
import { submissionStatusAppearance } from "@/lib/submissions/submission-status";
import { cn } from "@/lib/utils";
import { updateSubmissionStatus } from "@/server/actions/admin/submission-actions";

/** Changes a submission's status as soon as a new one is picked. */
export function SubmissionStatusPicker({
  submissionId,
  currentStatus,
}: {
  submissionId: string;
  currentStatus: SubmissionStatus;
}) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [message, setMessage] = useState<{ text: string; isError: boolean }>();
  const [isSaving, startSaving] = useTransition();

  function changeStatus(newStatus: SubmissionStatus) {
    const previousStatus = selectedStatus;
    setSelectedStatus(newStatus);
    setMessage(undefined);
    startSaving(async () => {
      const result = await updateSubmissionStatus(submissionId, newStatus);
      if (result.status === "error") {
        setSelectedStatus(previousStatus);
        setMessage({ text: result.message, isError: true });
      } else {
        setMessage({ text: "Status saved.", isError: false });
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="submission-status"
        className="text-sm font-semibold text-navy-900"
      >
        Status
      </label>
      <select
        id="submission-status"
        value={selectedStatus}
        disabled={isSaving}
        onChange={(event) =>
          changeStatus(event.target.value as SubmissionStatus)
        }
        className={cn(formControlClassName, "pr-8")}
      >
        {submissionStatusEnum.enumValues.map((status) => (
          <option key={status} value={status}>
            {submissionStatusAppearance[status].label}
          </option>
        ))}
      </select>
      <p
        role="status"
        className={cn(
          "min-h-5 text-sm",
          message?.isError ? "text-flag-red" : "text-muted-foreground",
        )}
      >
        {isSaving ? "Saving…" : message?.text}
      </p>
    </div>
  );
}
