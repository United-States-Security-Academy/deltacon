import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

import { AdminPageHeading } from "@/components/admin/admin-page-heading";
import { GalleryCategoryManager } from "@/components/admin/gallery/gallery-category-manager";
import { GalleryImageManager } from "@/components/admin/gallery/gallery-image-manager";
import { GalleryUploader } from "@/components/admin/gallery/gallery-uploader";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/server/auth/require-admin";
import { getAdminGallery } from "@/server/queries/admin-gallery";

export const metadata: Metadata = { title: "Gallery" };

export default async function AdminGalleryPage() {
  const admin = await requireAdmin();
  const { images, categories } = await getAdminGallery(admin.userId);
  const categoryOptions = categories.map(({ id, name }) => ({ id, name }));

  return (
    <>
      <AdminPageHeading
        title="Gallery"
        description="Photos shown on the website's gallery page and the home page."
        actions={
          <Button asChild variant="outline" size="lg">
            <a href="/gallery" target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              View gallery
            </a>
          </Button>
        }
      />
      <div className="mb-10 grid gap-8 xl:grid-cols-[3fr_2fr]">
        <GalleryUploader categories={categoryOptions} />
        <GalleryCategoryManager categories={categories} />
      </div>
      <GalleryImageManager images={images} categories={categoryOptions} />
    </>
  );
}
