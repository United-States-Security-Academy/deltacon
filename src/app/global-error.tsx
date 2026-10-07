"use client";

import { useEffect } from "react";

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  retry: () => void;
};

/**
 * Last-resort error page, used only if the root layout itself fails. It
 * replaces the whole document, so global CSS is not available: styles are
 * inline and kept to the brand colours.
 */
export default function GlobalErrorPage({
  error,
  retry,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en-US">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#10213a",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1rem",
        }}
      >
        <title>Something went wrong | Deltacon Security Group</title>
        <main>
          <h1 style={{ fontSize: "2rem", textTransform: "uppercase" }}>
            Something went wrong
          </h1>
          <p style={{ color: "#c9d3e3", maxWidth: "32rem" }}>
            The site is having trouble right now. Please try again in a moment.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0a1626",
              background: "#c9a44c",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
