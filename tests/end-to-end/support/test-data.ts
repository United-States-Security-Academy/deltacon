import { createHmac, randomBytes } from "node:crypto";
import { existsSync } from "node:fs";

import { createClient } from "@supabase/supabase-js";
import postgres from "postgres";

/*
 * Direct access to the test database for setting up and cleaning up.
 *
 * Every record a test creates is recognisable, so the clean-up step can find
 * it even if a test fails half-way:
 * - email addresses start with "e2e-" and end with "@example.com"
 * - post addresses start with "e2e-"
 * - gallery photo descriptions start with "E2E"
 * - the temporary admin's email starts with "e2e-admin-"
 */

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

function requiredVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is missing. The browser tests need a real Supabase project in .env.local.`,
    );
  }
  return value;
}

export const testEmailDomain = "example.com";
export const testAdminDisplayName = "E2E Test Admin";

export function createDatabaseConnection() {
  return postgres(
    process.env.DATABASE_DIRECT_URL ?? requiredVariable("DATABASE_URL"),
    { prepare: false, max: 1 },
  );
}

export function createSecretSupabaseClient() {
  return createClient(
    requiredVariable("NEXT_PUBLIC_SUPABASE_URL"),
    requiredVariable("SUPABASE_SECRET_KEY"),
    { auth: { persistSession: false } },
  );
}

/** A unique, recognisable email address for one test. */
export function testEmailAddress(label: string): string {
  return `e2e-${label}-${randomBytes(4).toString("hex")}@${testEmailDomain}`;
}

export type TestAdmin = { email: string; password: string; userId: string };

export async function createTestAdmin(): Promise<TestAdmin> {
  const supabase = createSecretSupabaseClient();
  const email = `e2e-admin-${randomBytes(4).toString("hex")}@${testEmailDomain}`;
  const password = randomBytes(18).toString("base64url");
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;

  const sql = createDatabaseConnection();
  try {
    await sql`insert into admin_users (user_id, email, display_name)
      values (${data.user.id}, ${email}, ${testAdminDisplayName})`;
  } finally {
    await sql.end();
  }
  return { email, password, userId: data.user.id };
}

/** The rate-limit keys the local test server uses (it sees no real IP). */
function localRateLimitHashes(): string[] {
  const secret = requiredVariable("IP_HASH_SECRET");
  return ["unknown", "::1", "127.0.0.1", "::ffff:127.0.0.1"].map((ipAddress) =>
    createHmac("sha256", secret).update(ipAddress).digest("hex"),
  );
}

/** Deletes everything the browser tests may have created. */
export async function removeTestData(): Promise<string> {
  const supabase = createSecretSupabaseClient();
  const sql = createDatabaseConnection();
  try {
    const cvFiles = await sql<{ path: string }[]>`
      select details.cv_storage_path as path
      from job_application_details details
      join submissions on submissions.id = details.submission_id
      where submissions.email like ${`e2e-%@${testEmailDomain}`}`;
    if (cvFiles.length > 0) {
      await supabase.storage
        .from("cv-uploads")
        .remove(cvFiles.map((file) => file.path));
    }
    const submissions = await sql`
      delete from submissions where email like ${`e2e-%@${testEmailDomain}`} returning id`;

    const posts =
      await sql`delete from posts where slug like 'e2e-%' returning id`;
    await sql`delete from tags where slug like 'e2e-%'`;

    const photos = await sql<{ storage_path: string }[]>`
      delete from gallery_images where alt_text like 'E2E%' returning storage_path`;
    if (photos.length > 0) {
      await supabase.storage
        .from("site-media")
        .remove(photos.map((photo) => photo.storage_path));
    }
    await sql`delete from gallery_categories where slug like 'e2e-%'`;

    const hashes = localRateLimitHashes();
    await sql`delete from rate_limits
      where split_part(key, ':', 2) = any(${hashes})`;

    const admins = await sql<{ user_id: string }[]>`
      select user_id from admin_users where email like ${`e2e-admin-%@${testEmailDomain}`}`;
    for (const admin of admins)
      await supabase.auth.admin.deleteUser(admin.user_id);
    // Accounts whose admin row was already gone.
    const strayUsers = await sql<{ id: string }[]>`
      select id from auth.users where email like ${`e2e-admin-%@${testEmailDomain}`}`;
    for (const user of strayUsers)
      await supabase.auth.admin.deleteUser(user.id);

    return `${submissions.length} submissions, ${posts.length} posts, ${photos.length} photos, ${admins.length + strayUsers.length} temporary admin accounts`;
  } finally {
    await sql.end();
  }
}

/** Finds a submission saved by a test, with its details. */
export async function findTestSubmission(email: string) {
  const sql = createDatabaseConnection();
  try {
    const [submission] = await sql`
      select submissions.id, submissions.form_type, submissions.status,
             details.cv_storage_path, details.cv_original_file_name
      from submissions
      left join job_application_details details on details.submission_id = submissions.id
      where submissions.email = ${email}`;
    return submission;
  } finally {
    await sql.end();
  }
}

/** Saves a training enquiry straight into the database, for admin tests. */
export async function insertTestTrainingEnquiry(
  fullName: string,
  email: string,
) {
  const sql = createDatabaseConnection();
  try {
    const [submission] = await sql<{ id: string }[]>`
      insert into submissions (form_type, full_name, email, phone)
      values ('training_enquiry', ${fullName}, ${email}, '832-555-0199')
      returning id`;
    await sql`insert into training_enquiry_details (submission_id, course_slug, number_of_trainees, message)
      values (${submission!.id}, 'level-2-unarmed-officer', 3, 'Inserted by a browser test')`;
    return submission!.id;
  } finally {
    await sql.end();
  }
}
