import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ussaAcademyWebsiteUrl } from "@/config/training-courses";
import { cn } from "@/lib/utils";

type CourseEnquiryLinkProps = {
  courseName: string;
  label?: string;
  variant?: "default" | "accent";
  size?: "lg" | "xl";
  className?: string;
};

/**
 * "Enquire about this course" button. Opens the United States Security
 * Academy website in a new tab, where course enquiries and enrolments are
 * handled.
 */
export function CourseEnquiryLink({
  courseName,
  label = "Enquire about this course",
  variant = "default",
  size = "lg",
  className,
}: CourseEnquiryLinkProps) {
  return (
    <Button asChild variant={variant} size={size} className={cn(className)}>
      <a href={ussaAcademyWebsiteUrl} target="_blank" rel="noopener noreferrer">
        {label}
        <ExternalLink aria-hidden="true" className="size-4" />
        <span className="sr-only">
          : {courseName} (opens the United States Security Academy website in a
          new tab)
        </span>
      </a>
    </Button>
  );
}
