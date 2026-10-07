"use client";

import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  applyNowLink,
  isLinkActive,
  mainNavigationLinks,
  requestServiceLink,
} from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Slide-out menu for small screens. Built on the Radix Dialog primitive, which
 * traps focus inside the menu, closes on Escape, and returns focus to the
 * menu button when closed.
 */
export function MobileNavigationMenu() {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-white hover:bg-white/10 hover:text-white xl:hidden"
        >
          <MenuIcon aria-hidden="true" className="size-6" />
          <span className="sr-only">Open main menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full max-w-sm border-navy-700 bg-navy-900 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]:hover]:bg-white/10"
      >
        <SheetHeader className="border-b border-navy-700">
          <SheetTitle className="font-heading text-lg tracking-widest text-white uppercase">
            Menu
          </SheetTitle>
          <SheetDescription className="sr-only">
            Site navigation links
          </SheetDescription>
        </SheetHeader>

        <nav aria-label="Main" className="flex flex-1 flex-col px-4">
          <ul className="flex flex-col">
            {mainNavigationLinks.map((link) => {
              const isActive = isLinkActive(currentPath, link.href);
              return (
                <li key={link.href}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block border-b border-navy-800 px-2 py-3.5 text-base font-medium text-navy-100 transition-colors hover:text-gold-300",
                        isActive && "text-gold-300",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-3 pb-6">
            <SheetClose asChild>
              <Button asChild variant="accent" size="xl">
                <Link href={requestServiceLink.href}>
                  {requestServiceLink.label}
                </Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild variant="outlineOnDark" size="xl">
                <Link href={applyNowLink.href}>{applyNowLink.label}</Link>
              </Button>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
