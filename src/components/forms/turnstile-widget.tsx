"use client";

import { useEffect, useRef } from "react";

import { publicEnvironment } from "@/lib/environment/public-environment";

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const turnstileScriptUrl =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptLoading: Promise<TurnstileApi> | undefined;

/** Loads Cloudflare's script once per page, however many widgets are shown. */
function loadTurnstileScript(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  turnstileScriptLoading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = turnstileScriptUrl;
    script.async = true;
    script.onload = () =>
      window.turnstile
        ? resolve(window.turnstile)
        : reject(new Error("Turnstile did not load."));
    script.onerror = () => {
      turnstileScriptLoading = undefined;
      reject(new Error("Turnstile could not be loaded."));
    };
    document.head.appendChild(script);
  });
  return turnstileScriptLoading;
}

type TurnstileWidgetProps = {
  /** Called with a fresh token, or null when the token expires or fails. */
  onTokenChange: (token: string | null) => void;
  /** Change this number to get a new token (each token can be used only once). */
  resetCounter: number;
  errorMessage?: string;
};

/** Cloudflare Turnstile "are you human?" check. */
export function TurnstileWidget({
  onTokenChange,
  resetCounter,
  errorMessage,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    let isCancelled = false;

    loadTurnstileScript()
      .then((turnstile) => {
        if (isCancelled || !containerRef.current) return;
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: publicEnvironment.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
          theme: "light",
          size: "flexible",
          callback: (token) => onTokenChangeRef.current(token),
          "expired-callback": () => onTokenChangeRef.current(null),
          "error-callback": () => onTokenChangeRef.current(null),
        });
      })
      .catch((error: unknown) => console.error(error));

    return () => {
      isCancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetCounter > 0 && widgetIdRef.current && window.turnstile) {
      onTokenChangeRef.current(null);
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetCounter]);

  return (
    <div className="flex flex-col gap-2">
      <div ref={containerRef} className="min-h-[65px]" />
      {errorMessage && (
        <p role="alert" className="text-sm font-medium text-flag-red">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
