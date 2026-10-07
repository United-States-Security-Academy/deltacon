"use client";

import { useEffect } from "react";

const revealSelector =
  "[data-reveal]:not([data-revealed]), [data-reveal-stagger]:not([data-revealed])";

/**
 * Powers the scroll-reveal animations defined in globals.css.
 *
 * Elements marked with data-reveal (or data-reveal-stagger for lists) get
 * data-revealed="animate" the first time they scroll into view, which plays
 * their entrance animation. Anything already on screen when the page loads is
 * marked "instant", so above-the-fold content never flickers.
 *
 * Content is only hidden once this has run (via the "reveal-ready" class), so
 * visitors without JavaScript always see everything. Rendered once in the
 * root layout; it renders nothing itself.
 */
export function ScrollRevealController() {
  useEffect(() => {
    const isOnScreen = (element: Element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top < window.innerHeight && bounds.bottom > 0;
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "animate";
          intersectionObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    const watchElements = (
      elements: Iterable<Element>,
      showOnScreenInstantly: boolean,
    ) => {
      for (const element of elements) {
        if (showOnScreenInstantly && isOnScreen(element)) {
          (element as HTMLElement).dataset.revealed = "instant";
        } else {
          intersectionObserver.observe(element);
        }
      }
    };

    // Content already visible on first load appears without animating.
    watchElements(document.querySelectorAll(revealSelector), true);
    document.documentElement.classList.add("reveal-ready");

    // Pages opened by client-side navigation add new elements later; those
    // animate in, including any that land on screen straight away.
    const mutationObserver = new MutationObserver((mutations) => {
      const addedElements: Element[] = [];
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.matches(revealSelector)) addedElements.push(node);
          addedElements.push(...node.querySelectorAll(revealSelector));
        }
      }
      watchElements(addedElements, false);
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
