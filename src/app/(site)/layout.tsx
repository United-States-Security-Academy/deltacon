import { PublicSiteShell } from "@/components/layout/public-site-shell";

/** Layout shared by every public page. */
export default function PublicSiteLayout({ children }: LayoutProps<"/">) {
  return <PublicSiteShell>{children}</PublicSiteShell>;
}
