import type { ReactNode } from "react";

type StatusMessageProps = {
  /** Large code shown above the heading, e.g. "404". */
  code: string;
  title: string;
  description: string;
  actions: ReactNode;
};

/** Centered message used by the 404 and error pages. */
export function StatusMessage({
  code,
  title,
  description,
  actions,
}: StatusMessageProps) {
  return (
    <section className="flex min-h-[60vh] items-center bg-navy-900 security-pattern text-white">
      <div className="page-container flex flex-col items-center gap-5 py-20 text-center">
        <p
          aria-hidden="true"
          className="font-heading text-7xl font-bold text-gold-400 sm:text-8xl"
        >
          {code}
        </p>
        <h1 className="text-3xl font-bold uppercase sm:text-4xl">{title}</h1>
        <p className="max-w-xl text-lg text-navy-100">{description}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-4">
          {actions}
        </div>
      </div>
    </section>
  );
}
