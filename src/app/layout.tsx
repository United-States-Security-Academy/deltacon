import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { ScrollRevealController } from "@/components/layout/scroll-reveal-controller";
import { companyDetails } from "@/config/company-details";
import { siteUrl } from "@/lib/site-url";

import "./globals.css";

// Fonts are self-hosted from src/assets/fonts (open-source, SIL OFL licence),
// so builds never depend on reaching Google Fonts.
const interFont = localFont({
  variable: "--font-inter",
  src: "../assets/fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});

const barlowCondensedFont = localFont({
  variable: "--font-barlow-condensed",
  src: [
    {
      path: "../assets/fonts/barlow-condensed-latin-500-normal.woff2",
      weight: "500",
    },
    {
      path: "../assets/fonts/barlow-condensed-latin-600-normal.woff2",
      weight: "600",
    },
    {
      path: "../assets/fonts/barlow-condensed-latin-700-normal.woff2",
      weight: "700",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${companyDetails.name} | ${companyDetails.tagline}`,
    template: `%s | ${companyDetails.name}`,
  },
  description: companyDetails.description,
  applicationName: companyDetails.name,
  openGraph: {
    type: "website",
    siteName: companyDetails.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: "#10213a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-US"
      className={`${interFont.variable} ${barlowCondensedFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {children}
        <ScrollRevealController />
      </body>
    </html>
  );
}
