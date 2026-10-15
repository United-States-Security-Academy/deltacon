"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { isLinkActive, type MainNavigationItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

/** Leaving the menu with the mouse waits this long, so it doesn't flicker shut. */
const closeDelayInMilliseconds = 150;

/**
 * A header item that opens a list of links, e.g. "Services".
 *
 * - Opens on hover, or on click/Enter/Space for touch and keyboard users.
 * - Escape closes it and returns focus to the button; tabbing or clicking
 *   away closes it too.
 * - Built as a disclosure (a button that shows a list of normal links),
 *   which screen readers announce clearly.
 */
export function NavigationDropdown({
  item,
  currentPath,
  isActive,
}: {
  item: MainNavigationItem;
  currentPath: string;
  isActive: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  // True when hovering opened the menu: the click that usually follows
  // should keep it open, not close it straight away.
  const wasOpenedByHover = useRef(false);
  const panelId = useId();

  function openOnHover(event: React.PointerEvent) {
    // Touch screens tap instead of hovering; the click handles those.
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    if (!isOpen) wasOpenedByHover.current = true;
    setIsOpen(true);
  }

  function toggleOnClick() {
    if (wasOpenedByHover.current) {
      wasOpenedByHover.current = false;
      setIsOpen(true);
      return;
    }
    setIsOpen((open) => !open);
  }

  function closeSoon(event: React.PointerEvent) {
    if (event.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      wasOpenedByHover.current = false;
      setIsOpen(false);
    }, closeDelayInMilliseconds);
  }

  // Clicking or tapping anywhere else closes the menu.
  useEffect(() => {
    if (!isOpen) return;
    function closeOnOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, [isOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <li
      ref={containerRef}
      className="relative"
      onPointerEnter={openOnHover}
      onPointerLeave={closeSoon}
      onKeyDown={(event) => {
        if (event.key === "Escape" && isOpen) {
          setIsOpen(false);
          buttonRef.current?.focus();
        }
      }}
      onBlur={(event) => {
        // Close once keyboard focus has moved outside the menu.
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggleOnClick}
        className={cn(
          "relative flex items-center gap-1 rounded-sm px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:text-gold-300",
          "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold-500 after:transition-transform",
          (isActive || isOpen) && "text-gold-300",
          isActive && "after:scale-x-100",
        )}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 transition-transform motion-reduce:transition-none",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        id={panelId}
        hidden={!isOpen}
        // pt-3 bridges the gap below the button so the mouse can reach the list.
        className="absolute top-full left-0 z-50 pt-3"
      >
        <ul className="min-w-60 overflow-hidden rounded-lg border border-navy-700 bg-navy-975 py-2 shadow-xl shadow-black/40">
          {item.children?.map((child) => {
            const isChildActive = isLinkActive(currentPath, child.href);
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={isChildActive ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block border-l-2 border-transparent px-4 py-2.5 text-sm font-semibold tracking-wider text-navy-100 uppercase transition-colors hover:border-gold-500 hover:bg-white/5 hover:text-gold-300 focus-visible:bg-white/5",
                    isChildActive && "border-gold-500 text-gold-300",
                  )}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
