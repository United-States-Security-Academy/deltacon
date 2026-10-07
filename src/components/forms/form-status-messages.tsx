"use client";

import { CircleCheck, TriangleAlert } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Replaces the form after a successful submission. Focus moves here so
 * keyboard and screen-reader users hear the confirmation straight away.
 */
export function FormSuccessMessage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageRef.current?.focus();
  }, []);

  return (
    <div
      ref={messageRef}
      tabIndex={-1}
      role="status"
      className="flex flex-col items-start gap-4 rounded-lg border border-green-700/30 bg-green-50 p-6 outline-none sm:p-8"
    >
      <CircleCheck aria-hidden="true" className="size-10 text-green-700" />
      <h2 className="text-2xl font-bold text-navy-900 uppercase">{title}</h2>
      <div className="flex flex-col gap-3 text-charcoal">{children}</div>
    </div>
  );
}

/** Summary error shown at the top of a form; announced immediately. */
export function FormErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-md border border-flag-red/40 bg-red-50 p-4 text-sm text-flag-red"
    >
      <TriangleAlert aria-hidden="true" className="size-5 shrink-0" />
      <p className="font-medium">{message}</p>
    </div>
  );
}
