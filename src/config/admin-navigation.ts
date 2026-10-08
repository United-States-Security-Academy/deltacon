import {
  LayoutDashboard,
  UserCog,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type AdminNavigationLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

/**
 * Links in the admin sidebar. Posts, Submissions, Gallery and Settings are
 * added here as each part of the admin is built.
 */
export const adminNavigationLinks: AdminNavigationLink[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Admin users", href: "/admin/users", icon: UsersRound },
  { label: "My account", href: "/admin/account", icon: UserCog },
];

/** The dashboard link is only "current" on /admin itself. */
export function isAdminLinkActive(currentPath: string, linkHref: string) {
  if (linkHref === "/admin") return currentPath === "/admin";
  return currentPath === linkHref || currentPath.startsWith(`${linkHref}/`);
}
