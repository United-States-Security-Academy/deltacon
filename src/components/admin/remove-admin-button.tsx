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
import { removeAdmin } from "@/server/actions/admin/admin-users-actions";

/** "Remove" with a confirmation step, so admins aren't deleted by accident. */
export function RemoveAdminButton({
  userId,
  displayName,
}: {
  userId: string;
  displayName: string;
}) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isRemoving, startRemoving] = useTransition();

  function confirmRemoval() {
    setErrorMessage(undefined);
    startRemoving(async () => {
      const result = await removeAdmin(userId);
      if (result.status === "error") setErrorMessage(result.message);
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            size="sm"
            disabled={isRemoving}
            className="text-flag-red"
          >
            <Trash2 aria-hidden="true" />
            {isRemoving ? "Removing…" : "Remove"}
            <span className="sr-only"> {displayName}</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {displayName}?</AlertDialogTitle>
            <AlertDialogDescription>
              They will be signed out and won&apos;t be able to sign in to the
              admin again. Posts and notes they wrote are kept. You can invite
              them again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoval}
              className="bg-flag-red text-white hover:bg-flag-red/90"
            >
              Remove admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {errorMessage && (
        <p role="alert" className="text-xs text-flag-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
