import type { ReactNode } from "react";

/** Title row at the top of each admin page. */
export function AdminPageHeading({
  title,
  description,
  actions,
}: {
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl">
          {title}
        </h1>
        {description && (
          <div className="text-muted-foreground">{description}</div>
        )}
      </div>
      {actions && <div className="flex shrink-0 gap-3">{actions}</div>}
    </div>
  );
}
