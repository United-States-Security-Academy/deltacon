import { ExternalLink } from "lucide-react";

import type { GuideRichText as GuideRichTextValue } from "@/config/licensing-guide";
import { cn } from "@/lib/utils";

/**
 * Shows guide text with its bold parts and links. Links to other websites
 * open in a new tab and say so to screen readers.
 */
export function GuideRichText({
  text,
  linkClassName,
}: {
  text: GuideRichTextValue;
  linkClassName?: string;
}) {
  return (
    <>
      {text.map((part, index) => {
        if (typeof part === "string") return part;

        const content = part.isBold ? <strong>{part.text}</strong> : part.text;
        if (!part.href) return <span key={index}>{content}</span>;

        const isWebAddress = part.href.startsWith("http");
        return (
          <a
            key={index}
            href={part.href}
            {...(isWebAddress && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            className={cn(
              "font-medium text-navy-800 underline decoration-gold-500 decoration-2 underline-offset-4 transition-colors hover:text-gold-700",
              linkClassName,
            )}
          >
            {content}
            {isWebAddress && (
              <>
                <ExternalLink
                  aria-hidden="true"
                  className="ml-1 inline size-3.5 align-baseline"
                />
                <span className="sr-only"> (opens in a new tab)</span>
              </>
            )}
          </a>
        );
      })}
    </>
  );
}
