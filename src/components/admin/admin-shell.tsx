import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { AdminMobileMenu } from "@/components/admin/admin-mobile-menu";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { CompanyLogo } from "@/components/layout/company-logo";
import type { SignedInAdmin } from "@/server/auth/require-admin";

function SignedInAdminCard({ admin }: { admin: SignedInAdmin }) {
  return (
    <div className="flex flex-col gap-2 border-t border-navy-800 pt-4">
      <div className="px-3">
        <p className="truncate text-sm font-semibold text-white">
          {admin.displayName}
        </p>
        <p className="truncate text-xs text-navy-200">{admin.email}</p>
      </div>
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-navy-100 transition-colors hover:bg-white/10 hover:text-white"
      >
        <ExternalLink aria-hidden="true" className="size-5" />
        View website
        <span className="sr-only">(opens in a new tab)</span>
      </Link>
      <SignOutButton />
    </div>
  );
}

/** Admin page frame: sidebar on large screens, top bar with menu on small ones. */
export function AdminShell({
  admin,
  children,
}: {
  admin: SignedInAdmin;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between gap-6 overflow-y-auto bg-navy-950 px-3 py-6 lg:flex">
        <div className="flex flex-col gap-8">
          <div className="px-3">
            <CompanyLogo size="header" className="origin-left scale-[0.8]" />
          </div>
          <AdminNavigation />
        </div>
        <SignedInAdminCard admin={admin} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-navy-950 px-4 lg:hidden">
          <CompanyLogo size="header" className="origin-left scale-[0.7]" />
          <AdminMobileMenu footer={<SignedInAdminCard admin={admin} />} />
        </header>
        <main id="main-content" className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
