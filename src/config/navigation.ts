export type NavigationLink = {
  label: string;
  href: string;
};

/** Main navigation links, in the order they appear in the header. */
export const mainNavigationLinks: NavigationLink[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Training", href: "/training" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog & Media", href: "/blog" },
];

/** Call-to-action buttons shown after the main navigation links. */
export const requestServiceLink: NavigationLink = {
  label: "Request Service",
  href: "/request-service",
};

export const applyNowLink: NavigationLink = {
  label: "Apply Now",
  href: "/apply",
};

export const footerQuickLinks: NavigationLink[] = [
  { label: "Home", href: "/" },
  ...mainNavigationLinks,
  requestServiceLink,
  applyNowLink,
  { label: "Security Self-Assessment", href: "/security-assessment" },
  { label: "Privacy Policy", href: "/privacy" },
];

/** Returns true when the link should be shown as the current page. */
export function isLinkActive(currentPath: string, linkHref: string): boolean {
  if (linkHref === "/") return currentPath === "/";
  return currentPath === linkHref || currentPath.startsWith(`${linkHref}/`);
}
