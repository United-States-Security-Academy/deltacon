import type { Metadata } from "next";

import { companyDetails } from "@/config/company-details";

// The admin area is always rendered per request and never stored in the
// page cache (most pages already read the sign-in cookie; this guarantees it
// for the rest too, e.g. sign-in and password pages).
export const dynamic = "force-dynamic";

/** Settings shared by every admin page: never indexed by search engines. */
export const metadata: Metadata = {
  title: {
    default: `Admin | ${companyDetails.name}`,
    template: `%s | Admin | ${companyDetails.name}`,
  },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-paper">{children}</div>
  );
}
