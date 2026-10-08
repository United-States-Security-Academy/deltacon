import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { StructuredDataScript } from "@/components/seo/structured-data-script";
import { buildBreadcrumbData } from "@/lib/seo/structured-data";

export type BreadcrumbItem = {
  label: string;
  /** Leave out for the current page. */
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      <StructuredDataScript data={buildBreadcrumbData(items)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-navy-200">
          <li>
            <Link href="/" className="rounded-sm hover:text-gold-300">
              Home
            </Link>
          </li>
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-1.5">
              <ChevronRight
                aria-hidden="true"
                className="size-3.5 text-navy-600"
              />
              {item.href ? (
                <Link
                  href={item.href}
                  className="rounded-sm hover:text-gold-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-gold-300">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
