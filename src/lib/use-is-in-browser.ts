"use client";

import { useSyncExternalStore } from "react";

const subscribeToNothing = () => () => {};

/** False in the server HTML and during hydration, true once in the browser. */
export function useIsInBrowser(): boolean {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
}
