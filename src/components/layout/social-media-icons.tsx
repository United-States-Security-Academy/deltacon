import type { SocialLink, SocialPlatform } from "@/config/company-details";

const platformNames: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X (formerly Twitter)",
};

/** Brand marks drawn inline (24×24 viewBox) so no icon font or extra request is needed. */
function PlatformIcon({ platform }: { platform: SocialPlatform }) {
  const sharedProps = {
    viewBox: "0 0 24 24",
    className: "size-5",
    "aria-hidden": true,
    focusable: false,
  } as const;

  switch (platform) {
    case "facebook":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.8-6 5.9-6 .8 0 2.1.2 2.6.3v3.3h-1.4c-1.4 0-2 .5-2 1.9V12h3.9l-.7 3.7h-3.2v8.2C19.4 23.2 24 18.2 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...sharedProps} fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4.5" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0h.01Z" />
        </svg>
      );
    case "x":
      return (
        <svg {...sharedProps} fill="currentColor">
          <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.59-6.64 7.59H.47l8.6-9.83L0 1.15h7.6l5.24 6.93 6.06-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
        </svg>
      );
  }
}

export function SocialMediaIcons({
  socialLinks,
}: {
  socialLinks: SocialLink[];
}) {
  if (socialLinks.length === 0) return null;

  return (
    <ul className="flex items-center gap-3" aria-label="Social media">
      {socialLinks.map((socialLink) => (
        <li key={socialLink.platform}>
          <a
            href={socialLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full border border-navy-700 text-navy-100 transition-colors hover:border-gold-500 hover:text-gold-300"
          >
            <PlatformIcon platform={socialLink.platform} />
            <span className="sr-only">
              {platformNames[socialLink.platform]} (opens in a new tab)
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
