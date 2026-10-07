import "server-only";

import { companyDetails } from "@/config/company-details";
import { privilegedDatabase } from "@/lib/database/database-client";
import { adminSettings } from "@/lib/database/schema";

/**
 * Where new-submission alerts are sent (editable in Admin → Settings).
 * Read with the privileged connection because no visitor or admin is acting
 * here; the server is sending its own notification.
 */
export async function getNotificationEmailAddress(): Promise<string> {
  try {
    const savedSettings = await privilegedDatabase
      .select({ notificationEmail: adminSettings.notificationEmail })
      .from(adminSettings)
      .limit(1);
    return savedSettings[0]?.notificationEmail ?? companyDetails.email;
  } catch (error) {
    console.error("Could not load the notification email address.", error);
    return companyDetails.email;
  }
}
