import { CompanyLogo } from "@/components/layout/company-logo";
import { companyDetails } from "@/config/company-details";

/** Centered card layout for sign-in, password reset and invite pages. */
export default function AdminAuthLayout({ children }: LayoutProps<"/admin">) {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-navy-950 security-pattern px-4 py-12">
      <div className="mb-8">
        <CompanyLogo size="footer" />
      </div>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl sm:p-8">
        {children}
      </div>
      <p className="mt-8 text-sm text-navy-200">
        {companyDetails.name} website administration
      </p>
    </main>
  );
}
