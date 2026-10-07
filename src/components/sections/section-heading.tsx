import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  /** Use "dark" when the section has a navy background. */
  tone?: "light" | "dark";
  alignment?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  tone = "light",
  alignment = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      data-reveal
      className={cn(
        "flex max-w-3xl flex-col gap-3",
        alignment === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "flex items-center gap-3 font-heading text-sm font-semibold tracking-[0.3em] uppercase",
            tone === "dark" ? "text-gold-400" : "text-gold-700",
          )}
        >
          <span aria-hidden="true" className="eyebrow-rule" />
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        className={cn(
          "text-3xl font-bold uppercase sm:text-4xl",
          tone === "dark" ? "text-white" : "text-navy-900",
        )}
      >
        {title}
      </h2>
      {description && (
        <div
          className={cn(
            "text-lg leading-relaxed",
            tone === "dark" ? "text-navy-100" : "text-muted-foreground",
          )}
        >
          {description}
        </div>
      )}
    </div>
  );
}
