/**
 * The owner's admin account. It can't be removed by anyone from the admin
 * area (the server refuses), so the company can never be locked out by
 * another admin. To change it, edit this address and redeploy.
 */
export const superAdminEmail = "admin@deltacon1.com";

/** True when this email belongs to the super admin (case doesn't matter). */
export function isSuperAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === superAdminEmail;
}
