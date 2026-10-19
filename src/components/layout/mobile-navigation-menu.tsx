"use client";

import { ChevronDown, MenuIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

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
  type MainNavigationItem,
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
        className="w-full max-w-sm border-navy-800 bg-navy-975 text-white [&_[data-slot=sheet-close]]:text-white [&_[data-slot=sheet-close]:hover]:bg-white/10"
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
              if (link.children) {
                return (
                  <MobileNavigationGroup
                    key={link.href}
                    item={link}
                    currentPath={currentPath}
                  />
                );
              }
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

/**
 * A menu item such as "Services" whose links stay hidden until the item is
 * tapped. Built as a disclosure: a button that shows or hides a list of links.
 */
function MobileNavigationGroup({
  item,
  currentPath,
}: {
  item: MainNavigationItem;
  currentPath: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();
  const isGroupActive =
    item.children?.some((child) => isLinkActive(currentPath, child.href)) ??
    false;

  return (
    <li className="border-b border-navy-800">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((expanded) => !expanded)}
        className={cn(
          "flex w-full items-center justify-between px-2 py-3.5 text-left text-base font-medium text-navy-100 transition-colors hover:text-gold-300",
          (isGroupActive || isExpanded) && "text-gold-300",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-5 transition-transform motion-reduce:transition-none",
            isExpanded && "rotate-180",
          )}
        />
      </button>

      <ul id={panelId} hidden={!isExpanded} className="flex flex-col pb-2">
        {item.children?.map((child) => {
          const isChildActive = isLinkActive(currentPath, child.href);
          return (
            <li key={child.href}>
              <SheetClose asChild>
                <Link
                  href={child.href}
                  aria-current={isChildActive ? "page" : undefined}
                  className={cn(
                    "block py-2.5 pr-2 pl-5 text-base font-medium text-navy-100 transition-colors hover:text-gold-300",
                    isChildActive && "text-gold-300",
                  )}
                >
                  {child.label}
                </Link>
              </SheetClose>
            </li>
          );
        })}
      </ul>
    </li>
  );
}
