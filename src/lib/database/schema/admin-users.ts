import { pgPolicy, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

import { currentUserIsAdmin } from "./access-rules";

/**
 * People allowed into /admin. A Supabase Auth account alone is not enough:
 * the user must also have a row here. There is no public sign-up.
 */
export const adminUsers = pgTable(
  "admin_users",
  {
    userId: uuid("user_id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  () => [
    pgPolicy("admins can read admin users", {
      for: "select",
      to: authenticatedRole,
      using: currentUserIsAdmin,
    }),
    // Adding and removing admins happens server-side with the secret key,
    // so no insert/update/delete policies are granted here.
  ],
);

export type AdminUser = typeof adminUsers.$inferSelect;
