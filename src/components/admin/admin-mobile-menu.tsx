"use client";

import { MenuIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/** Slide-out admin menu for phones and tablets. */
export function AdminMobileMenu({ footer }: { footer: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="text-white hover:bg-white/10 hover:text-white lg:hidden"
        >
          <MenuIcon aria-hidden="true" className="size-6" />
          <span className="sr-only">Open admin menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 border-navy-800 bg-navy-950 text-white [&_[data-slot=sheet-close]]:text-white"
      >
        <SheetHeader className="border-b border-navy-800">
          <SheetTitle className="font-heading text-lg tracking-widest text-white uppercase">
            Admin
          </SheetTitle>
          <SheetDescription className="sr-only">
            Admin navigation
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-1 flex-col justify-between gap-6 px-3 pb-6">
          <AdminNavigation onNavigate={() => setIsOpen(false)} />
          {footer}
        </div>
      </SheetContent>
    </Sheet>
  );
}
