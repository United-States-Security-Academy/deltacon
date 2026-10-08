import { createTestAdmin, removeTestData } from "./test-data";

/**
 * Runs once before the browser tests: clears anything left by an earlier,
 * interrupted run and creates a temporary admin account. Its details are
 * handed to the tests through environment variables, never written to disk.
 */
export default async function globalSetup() {
  const leftovers = await removeTestData();
  console.log(`Cleared leftovers from earlier runs: ${leftovers}.`);

  const admin = await createTestAdmin();
  process.env.E2E_ADMIN_EMAIL = admin.email;
  process.env.E2E_ADMIN_PASSWORD = admin.password;
}
