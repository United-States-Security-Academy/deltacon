import { sql } from "drizzle-orm";
import { pgPolicy } from "drizzle-orm/pg-core";
import { anonRole, authenticatedRole } from "drizzle-orm/supabase";

/**
 * Building blocks for Row Level Security policies.
 *
 * `public.is_admin()` is created in the first migration. It is a
 * SECURITY DEFINER function, so it can look up the admin_users table without
 * triggering that table's own policies (which would loop forever).
 */
export const currentUserIsAdmin = sql`(select public.is_admin())`;

/** Both website visitors (anon) and signed-in users. */
export const everyone = [anonRole, authenticatedRole];

/** Full read/write access for admins. */
export function adminFullAccessPolicy(tableName: string) {
  return pgPolicy(`admins can manage ${tableName}`, {
    for: "all",
    to: authenticatedRole,
    using: currentUserIsAdmin,
    withCheck: currentUserIsAdmin,
  });
}

/** Anyone, signed in or not, may read every row. */
export function publicReadPolicy(tableName: string) {
  return pgPolicy(`anyone can read ${tableName}`, {
    for: "select",
    to: everyone,
    using: sql`true`,
  });
}
