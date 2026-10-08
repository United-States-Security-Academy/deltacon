"use client";

import { Check, Link2, Mail } from "lucide-react";
import { useState } from "react";

type ShareButtonsProps = {
  url: string;
  title: string;
};

const shareLinkClassName =
  "flex size-10 items-center justify-center rounded-full border border-border text-navy-800 transition-colors hover:border-gold-500 hover:text-gold-700";

/** Share a post on LinkedIn, Facebook, X or by email, or copy its link. */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45Z",
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      path: "M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3h-1.4c-1.4 0-2 .5-2 1.9V12h3.9l-.7 3.7h-3.2v8.2C19.4 23.2 24 18.2 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z",
    },
    {
      label: "Share on X",
      href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodedTitle}`,
      path: "M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setHasCopied(true);
      window.setTimeout(() => setHasCopied(false), 2500);
    } catch {
      // Clipboard can be blocked; the visitor can still copy from the address bar.
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-semibold text-navy-900">Share:</span>
      <ul className="flex flex-wrap gap-2">
        {shareLinks.map((shareLink) => (
          <li key={shareLink.label}>
            <a
              href={shareLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className={shareLinkClassName}
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-4"
                fill="currentColor"
              >
                <path d={shareLink.path} />
              </svg>
              <span className="sr-only">
                {shareLink.label} (opens in a new tab)
              </span>
            </a>
          </li>
        ))}
        <li>
          <a
            href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`}
            className={shareLinkClassName}
          >
            <Mail aria-hidden="true" className="size-4" />
            <span className="sr-only">Share by email</span>
          </a>
        </li>
        <li>
          <button
            type="button"
            onClick={copyLink}
            className={shareLinkClassName}
          >
            {hasCopied ? (
              <Check aria-hidden="true" className="size-4 text-green-700" />
            ) : (
              <Link2 aria-hidden="true" className="size-4" />
            )}
            <span className="sr-only">Copy link</span>
          </button>
        </li>
      </ul>
      <span aria-live="polite" className="text-sm text-green-800">
        {hasCopied ? "Link copied" : ""}
      </span>
    </div>
  );
}
