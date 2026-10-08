import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cache } from "react";

import { privilegedDatabase } from "@/lib/database/database-client";
import { adminUsers } from "@/lib/database/schema";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export type SignedInAdmin = {
  userId: string;
  email: string;
  displayName: string;
};

/**
 * The signed-in admin, or null. The session is verified with Supabase Auth
 * (getUser contacts the Auth server, so revoked sessions are rejected), then
 * the user must also have a row in admin_users. Cached for the request so
 * layouts and pages can both call it cheaply.
 */
export const getSignedInAdmin = cache(
  async (): Promise<SignedInAdmin | null> => {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const [adminRecord] = await privilegedDatabase
      .select({
        userId: adminUsers.userId,
        email: adminUsers.email,
        displayName: adminUsers.displayName,
      })
      .from(adminUsers)
      .where(eq(adminUsers.userId, user.id))
      .limit(1);

    return adminRecord ?? null;
  },
);

/**
 * Use at the top of every admin page and admin server action. Anyone who is
 * not a signed-in admin is sent to the login page.
 */
export async function requireAdmin(): Promise<SignedInAdmin> {
  const admin = await getSignedInAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

/**
 * Only allows redirects back into the admin area, so a crafted
 * "?redirectTo=https://evil.example" link can't send admins elsewhere.
 */
export function safeAdminRedirectPath(requestedPath: unknown): string {
  if (
    typeof requestedPath === "string" &&
    requestedPath.startsWith("/admin") &&
    !requestedPath.startsWith("//") &&
    !requestedPath.includes("\\")
  ) {
    return requestedPath;
  }
  return "/admin";
}
