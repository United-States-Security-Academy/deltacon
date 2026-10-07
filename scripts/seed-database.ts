/**
 * Fills a fresh database with the default settings and starter categories.
 * Safe to run more than once: existing rows are left as they are.
 *
 *   npm run db:seed
 */
import { companyDetails } from "@/config/company-details";
import {
  adminSettings,
  galleryCategories,
  siteSettings,
  tags,
} from "@/lib/database/schema";

import { connectToDatabase } from "./script-helpers";

const starterGalleryCategories = [
  { name: "Operations", slug: "operations", sortOrder: 1 },
  { name: "Training", slug: "training", sortOrder: 2 },
  { name: "Events", slug: "events", sortOrder: 3 },
  { name: "Our Team", slug: "our-team", sortOrder: 4 },
];

const starterTags = [
  { name: "Security Tips", slug: "security-tips" },
  { name: "Company News", slug: "company-news" },
  { name: "Training", slug: "training" },
  { name: "Industry Insights", slug: "industry-insights" },
];

async function seedDatabase() {
  const { database, closeConnection } = connectToDatabase();

  try {
    await database
      .insert(siteSettings)
      .values({
        id: 1,
        companyEmail: companyDetails.email,
        phoneDisplay: companyDetails.phoneDisplay,
        phoneInternational: companyDetails.phoneInternational,
        socialLinks: companyDetails.socialLinks,
      })
      .onConflictDoNothing();
    console.log("✓ Site settings");

    await database
      .insert(adminSettings)
      .values({ id: 1, notificationEmail: companyDetails.email })
      .onConflictDoNothing();
    console.log(
      "✓ Admin settings (notifications go to %s)",
      companyDetails.email,
    );

    await database
      .insert(galleryCategories)
      .values(starterGalleryCategories)
      .onConflictDoNothing({ target: galleryCategories.slug });
    console.log("✓ Gallery categories");

    await database
      .insert(tags)
      .values(starterTags)
      .onConflictDoNothing({ target: tags.slug });
    console.log("✓ Blog tags");

    console.log(
      "\nDatabase seeded. Next, create your first admin: npm run admin:create",
    );
  } finally {
    await closeConnection();
  }
}

seedDatabase().catch((error: unknown) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
