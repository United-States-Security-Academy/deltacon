"use client";

import { TrainingEnquiryForm } from "@/components/forms/training-enquiry-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type TrainingEnquiryDialogProps = {
  courseSlug: string;
  courseName: string;
  buttonLabel?: string;
  buttonVariant?: "default" | "outline";
};

/**
 * "Enquire" button that opens the training enquiry form in a dialog with the
 * course already chosen. The dialog traps focus, closes on Escape and returns
 * focus to the button afterwards.
 */
export function TrainingEnquiryDialog({
  courseSlug,
  courseName,
  buttonLabel = "Enquire about this course",
  buttonVariant = "default",
}: TrainingEnquiryDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size="lg" className="w-full">
          {buttonLabel}
          <span className="sr-only">: {courseName}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold text-navy-900 uppercase">
            Training enquiry
          </DialogTitle>
          <DialogDescription>
            Tell us about your group and we&apos;ll send you dates and pricing
            for {courseName}.
          </DialogDescription>
        </DialogHeader>
        <TrainingEnquiryForm preselectedCourseSlug={courseSlug} />
      </DialogContent>
    </Dialog>
  );
}
