"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How far the page must scroll before the header tightens. */
const scrollDistanceBeforeCompacting = 24;

/**
 * The sticky <header> element. Once the visitor scrolls down it gets
 * data-scrolled="true", which the header's children use (through the
 * "group/header" class) to become slimmer with a deeper shadow.
 */
export function StickyHeaderFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let animationFrameId = 0;
    const updateScrolledState = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        header.dataset.scrolled = String(
          window.scrollY > scrollDistanceBeforeCompacting,
        );
      });
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrolledState);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <header ref={headerRef} data-scrolled="false" className={className}>
      {children}
    </header>
  );
}
