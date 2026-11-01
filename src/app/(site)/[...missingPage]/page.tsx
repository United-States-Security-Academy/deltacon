import type { Metadata } from "next";
import { notFound } from "next/navigation";

/*
 * Any address that matches no other page lands here, so its 404 is shown
 * inside the public layout (header and footer) by (site)/not-found.tsx.
 * Rendered per request and never cached: otherwise every random address
 * (often from bots) would be stored as its own cached page.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function MissingPage() {
  notFound();
}
