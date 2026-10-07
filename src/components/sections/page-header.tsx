import type { ReactNode } from "react";

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/sections/breadcrumbs";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  introduction?: ReactNode;
  breadcrumbs: BreadcrumbItem[];
  children?: ReactNode;
};

/** Dark banner at the top of every inner page, holding the page's only <h1>. */
export function PageHeader({
  eyebrow,
  title,
  introduction,
  breadcrumbs,
  children,
}: PageHeaderProps) {
  return (
    <header className="relative overflow-hidden bg-navy-900 security-pattern text-white">
      <div className="hero-entrance page-container flex flex-col gap-5 py-14 lg:py-20">
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow && (
          <p className="font-heading text-sm font-semibold tracking-[0.3em] text-gold-400 uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="max-w-4xl text-4xl font-bold uppercase sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        {introduction && (
          <div className="max-w-2xl text-lg leading-relaxed text-navy-100">
            {introduction}
          </div>
        )}
        {children}
      </div>
      <div
        aria-hidden="true"
        className="scanner-line h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
      />
    </header>
  );
}
