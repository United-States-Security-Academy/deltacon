import "server-only";

import { runAsSignedInUser } from "@/lib/database/access-roles";
import { adminUsers } from "@/lib/database/schema";

/** All admins, oldest first, for the Users page. Read as the signed-in admin. */
export async function listAdmins(adminUserId: string) {
  return runAsSignedInUser(adminUserId, (transaction) =>
    transaction
      .select({
        userId: adminUsers.userId,
        email: adminUsers.email,
        displayName: adminUsers.displayName,
        createdAt: adminUsers.createdAt,
      })
      .from(adminUsers)
      .orderBy(adminUsers.createdAt),
  );
}
