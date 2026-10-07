import type { Metadata } from "next";

type PageMetadataOptions = {
  title: string;
  description: string;
  /** Path of the page, e.g. "/services/mobile-patrol". */
  path: string;
};

/** Builds consistent title, description, canonical URL and Open Graph tags. */
export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
    twitter: { title, description },
  };
}
