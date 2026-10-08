import type { Metadata } from "next";

import { companyDetails } from "@/config/company-details";

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
