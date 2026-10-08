import {
  FileText,
  Images,
  Inbox,
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

/** Links in the admin sidebar. Settings is added here once it's built. */
export const adminNavigationLinks: AdminNavigationLink[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Submissions", href: "/admin/submissions", icon: Inbox },
  { label: "Posts", href: "/admin/posts", icon: FileText },
  { label: "Gallery", href: "/admin/gallery", icon: Images },
  { label: "Admin users", href: "/admin/users", icon: UsersRound },
  { label: "My account", href: "/admin/account", icon: UserCog },
];

/** The dashboard link is only "current" on /admin itself. */
export function isAdminLinkActive(currentPath: string, linkHref: string) {
  if (linkHref === "/admin") return currentPath === "/admin";
  return currentPath === linkHref || currentPath.startsWith(`${linkHref}/`);
}
