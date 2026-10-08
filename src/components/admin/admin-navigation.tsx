"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  adminNavigationLinks,
  isAdminLinkActive,
} from "@/config/admin-navigation";
import { cn } from "@/lib/utils";

/** Admin sidebar links, highlighting the current page. */
export function AdminNavigation({
  onNavigate,
}: {
  /** Called after a link is chosen (closes the mobile menu). */
  onNavigate?: () => void;
}) {
  const currentPath = usePathname();

  return (
    <nav aria-label="Admin">
      <ul className="flex flex-col gap-1">
        {adminNavigationLinks.map((link) => {
          const Icon = link.icon;
          const isActive = isAdminLinkActive(currentPath, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-gold-500 text-navy-950"
                    : "text-navy-100 hover:bg-white/10 hover:text-white",
                )}
              >
                <Icon aria-hidden="true" className="size-5" />
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
