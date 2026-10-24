import { serviceLines } from "./service-lines";

export type NavigationLink = {
  label: string;
  href: string;
};

/** A header item; items with `children` open a dropdown instead of linking. */
export type MainNavigationItem = NavigationLink & {
  children?: NavigationLink[];
};

/** Main navigation links, in the order they appear in the header. */
export const mainNavigationLinks: MainNavigationItem[] = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services", children: serviceLines },
  { label: "Industries", href: "/industries" },
  { label: "Training", href: "/training" },
  { label: "Guide", href: "/guide" },
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
  ...mainNavigationLinks.map(({ label, href }) => ({ label, href })),
  requestServiceLink,
  applyNowLink,
  { label: "Security Self-Assessment", href: "/security-assessment" },
  { label: "Privacy Policy", href: "/privacy" },
];

/** True when the current page is this item or one of its dropdown links. */
export function isNavigationItemActive(
  currentPath: string,
  item: MainNavigationItem,
): boolean {
  if (item.children) {
    return item.children.some((child) => isLinkActive(currentPath, child.href));
  }
  return isLinkActive(currentPath, item.href);
}

/** Returns true when the link should be shown as the current page. */
export function isLinkActive(currentPath: string, linkHref: string): boolean {
  if (linkHref === "/") return currentPath === "/";
  return currentPath === linkHref || currentPath.startsWith(`${linkHref}/`);
}
