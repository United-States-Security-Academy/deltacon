import { Fragment, type ReactNode } from "react";

import { ussaAcademyWebsiteUrl } from "@/config/training-courses";

/**
 * Finds every mention of the academy: its full name (with or without
 * "(USSA)" after it), "USSA" on its own, and course codes like "USSA-FW-201".
 */
const ussaMentionPattern =
  /(United States Security Academy(?: \(USSA\))?|USSA(?:-[A-Z]+-\d+)?)/g;

/**
 * A link to the United States Security Academy website, opening in a new
 * tab. It keeps the surrounding text colour, so it reads well on both light
 * and dark backgrounds.
 */
export function UssaLink({ children }: { children: ReactNode }) {
  return (
    <a
      href={ussaAcademyWebsiteUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-gold-500 decoration-1 underline-offset-2 transition-[text-decoration-thickness] hover:decoration-2 focus-visible:decoration-2"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/**
 * Shows text with every mention of the United States Security Academy
 * linked to its website. Don't use it inside another link: links can't
 * contain links.
 */
export function UssaLinkedText({ text }: { text: string }) {
  const parts = text.split(ussaMentionPattern);
  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    // split() with a capture group puts the matches at the odd positions.
    index % 2 === 1 ? (
      <UssaLink key={index}>{part}</UssaLink>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
