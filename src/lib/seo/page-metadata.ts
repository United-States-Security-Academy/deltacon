import type { Metadata } from "next";

import { companyDetails } from "@/config/company-details";

type PageMetadataOptions = {
  title: string;
  description: string;
  /** Path of the page, e.g. "/services/mobile-patrol". */
  path: string;
};

/** The picture drawn by src/app/opengraph-image.tsx. */
export const defaultShareImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${companyDetails.name}: ${companyDetails.tagline}`,
};

/**
 * Builds consistent title, description, canonical URL and share tags.
 *
 * Open Graph and Twitter are spelled out in full (including the share
 * picture) because a page's openGraph and twitter objects replace the root
 * layout's instead of merging with them.
 */
export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: companyDetails.name,
      locale: "en_US",
      title,
      description,
      url: path,
      images: [defaultShareImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultShareImage],
    },
  };
}
