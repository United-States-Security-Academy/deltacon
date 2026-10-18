"use client";

import { useId, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ServiceTab = {
  id: string;
  label: string;
  /** Small line under the label, e.g. "11 services". */
  note: string;
  icon: ReactNode;
  panel: ReactNode;
};

/**
 * Tabs that switch between lines of business, following the standard
 * accessible tabs pattern:
 *
 * - Left/Right arrows move between tabs (and show them), Home/End jump to
 *   the first/last one; Tab moves on into the visible panel.
 * - Screen readers announce "tab 2 of 4, selected".
 * - Every panel is in the page from the start (only hidden), so search
 *   engines see all of the content.
 */
export function ServiceTabs({
  tabs,
  label,
}: {
  tabs: ServiceTab[];
  /** Describes the tab list for screen readers, e.g. "Our services". */
  label: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const idPrefix = useId();
  const tabId = (index: number) => `${idPrefix}-tab-${index}`;
  const panelId = (index: number) => `${idPrefix}-panel-${index}`;

  function selectAndFocus(index: number) {
    const wrappedIndex = (index + tabs.length) % tabs.length;
    setSelectedIndex(wrappedIndex);
    tabRefs.current[wrappedIndex]?.focus();
    tabRefs.current[wrappedIndex]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }

  function handleKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    if (event.key in moves) {
      event.preventDefault();
      selectAndFocus(moves[event.key]!);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Scrolls sideways on narrow screens */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <div
          role="tablist"
          aria-label={label}
          className="flex min-w-max gap-2 rounded-xl border border-border bg-white p-1.5 shadow-sm sm:min-w-0"
        >
          {tabs.map((tab, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={tab.id}
                ref={(element) => {
                  tabRefs.current[index] = element;
                }}
                id={tabId(index)}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={panelId(index)}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                className={cn(
                  "flex flex-1 items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-gold-500 motion-reduce:transition-none",
                  isSelected
                    ? "bg-navy-900 text-white shadow-md"
                    : "text-navy-900 hover:bg-paper",
                )}
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-md [&_svg]:size-5",
                    isSelected
                      ? "bg-gold-500 text-navy-950"
                      : "bg-navy-100 text-navy-800",
                  )}
                >
                  {tab.icon}
                </span>
                <span className="flex flex-col">
                  <span className="font-heading text-base font-bold tracking-wide whitespace-nowrap uppercase">
                    {tab.label}
                  </span>
                  <span
                    className={cn(
                      "text-xs whitespace-nowrap",
                      isSelected ? "text-gold-300" : "text-muted-foreground",
                    )}
                  >
                    {tab.note}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          id={panelId(index)}
          role="tabpanel"
          aria-labelledby={tabId(index)}
          hidden={index !== selectedIndex}
          className="motion-safe:animate-in motion-safe:duration-300 motion-safe:fade-in"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
