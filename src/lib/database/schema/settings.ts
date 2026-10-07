import { sql } from "drizzle-orm";
import {
  check,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import type { SocialLink } from "@/config/company-details";

import { adminFullAccessPolicy, publicReadPolicy } from "./access-rules";

/**
 * Contact details shown on the public site. A single row (id = 1) that admins
 * edit in Admin → Settings, so changes go live without a redeploy.
 */
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    companyEmail: text("company_email").notNull(),
    phoneDisplay: text("phone_display").notNull(),
    phoneInternational: text("phone_international").notNull(),
    socialLinks: jsonb("social_links")
      .$type<SocialLink[]>()
      .notNull()
      .default([]),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("site_settings_single_row", sql`${table.id} = 1`),
    publicReadPolicy("site settings"),
    adminFullAccessPolicy("site settings"),
  ],
);

/** Private settings that must never be readable by visitors. Single row. */
export const adminSettings = pgTable(
  "admin_settings",
  {
    id: integer("id").primaryKey().default(1),
    /** Where new-submission notification emails are sent. */
    notificationEmail: text("notification_email").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    check("admin_settings_single_row", sql`${table.id} = 1`),
    adminFullAccessPolicy("admin settings"),
  ],
);

export type SiteSettings = typeof siteSettings.$inferSelect;
export type AdminSettings = typeof adminSettings.$inferSelect;
