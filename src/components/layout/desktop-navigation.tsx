"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  applyNowLink,
  isLinkActive,
  mainNavigationLinks,
  requestServiceLink,
} from "@/config/navigation";
import { cn } from "@/lib/utils";

export function DesktopNavigation() {
  const currentPath = usePathname();

  return (
    <nav aria-label="Main" className="hidden items-center gap-6 xl:flex">
      <ul className="flex items-center gap-1">
        {mainNavigationLinks.map((link) => {
          const isActive = isLinkActive(currentPath, link.href);
          return (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-sm px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:text-gold-300",
                  "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform",
                  isActive && "text-gold-300 after:scale-x-100",
                )}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-3">
        <Button asChild variant="accent" size="lg">
          <Link href={requestServiceLink.href}>{requestServiceLink.label}</Link>
        </Button>
        <Button asChild variant="outlineOnDark" size="lg">
          <Link href={applyNowLink.href}>{applyNowLink.label}</Link>
        </Button>
      </div>
    </nav>
  );
}
