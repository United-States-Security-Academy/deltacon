"use client";

import { Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { deleteSubmission } from "@/server/actions/admin/submission-actions";

/** Permanently deletes a submission, after a confirmation step. */
export function DeleteSubmissionButton({
  submissionId,
  personName,
  hasCv,
}: {
  submissionId: string;
  personName: string;
  hasCv: boolean;
}) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isDeleting, startDeleting] = useTransition();

  function confirmDeletion() {
    setErrorMessage(undefined);
    startDeleting(async () => {
      // On success the action redirects back to the inbox.
      const result = await deleteSubmission(submissionId);
      if (result.status === "error") setErrorMessage(result.message);
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            disabled={isDeleting}
            className="text-flag-red"
          >
            <Trash2 aria-hidden="true" />
            {isDeleting ? "Deleting…" : "Delete submission"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete the submission from {personName}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Their details{hasCv ? ", CV file" : ""} and all notes will be
              deleted for good. This can&apos;t be undone. Consider exporting it
              to CSV first if you need a record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeletion}
              className="bg-flag-red text-white hover:bg-flag-red/90"
            >
              Delete for good
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {errorMessage && (
        <p role="alert" className="text-sm text-flag-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
