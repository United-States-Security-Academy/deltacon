/**
 * Creates an admin account (or promotes an existing Supabase user to admin).
 * There is no public sign-up, so this is how the first admin gets in. Later
 * admins can be invited from Admin → Users.
 *
 *   npm run admin:create -- --email you@deltacon1.com --name "Jane Doe"
 *   npm run admin:create -- --email you@deltacon1.com --name "Jane Doe" --password "a-strong-password"
 *
 * Without --password a strong temporary password is generated and printed.
 */
import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { adminUsers } from "@/lib/database/schema";

import {
  connectToDatabase,
  requireEnvironmentVariable,
} from "./script-helpers";

const commandLineSchema = z.object({
  email: z.email("Pass a valid --email"),
  name: z.string().trim().min(2, "Pass the admin's full name with --name"),
  password: z
    .string()
    .min(12, "Passwords must be at least 12 characters")
    .optional(),
});

function readCommandLine() {
  const { values } = parseArgs({
    options: {
      email: { type: "string" },
      name: { type: "string" },
      password: { type: "string" },
    },
  });
  const result = commandLineSchema.safeParse(values);
  if (!result.success) {
    console.error(z.prettifyError(result.error));
    console.error(
      '\nUsage: npm run admin:create -- --email you@example.com --name "Full Name" [--password "..."]',
    );
    process.exit(1);
  }
  return result.data;
}

async function findUserIdByEmail(
  supabase: SupabaseClient,
  email: string,
): Promise<string | undefined> {
  const usersPerPage = 200;
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: usersPerPage,
    });
    if (error) throw error;
    const matchingUser = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase(),
    );
    if (matchingUser) return matchingUser.id;
    if (data.users.length < usersPerPage) return undefined;
  }
}

async function createAdmin() {
  const { email: enteredEmail, name, password } = readCommandLine();
  const email = enteredEmail.toLowerCase();

  const supabase = createClient(
    requireEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnvironmentVariable("SUPABASE_SECRET_KEY"),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  let userId = await findUserIdByEmail(supabase, email);
  let generatedPassword: string | undefined;

  if (userId) {
    console.log(`Found existing user ${email}.`);
    if (password) {
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        password,
      });
      if (error) throw error;
      console.log("Password updated.");
    }
  } else {
    generatedPassword = password
      ? undefined
      : randomBytes(12).toString("base64url");
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: password ?? generatedPassword,
      email_confirm: true,
      user_metadata: { display_name: name },
    });
    if (error) throw error;
    userId = data.user.id;
    console.log(`Created user ${email}.`);
  }

  const { database, closeConnection } = connectToDatabase();
  try {
    await database
      .insert(adminUsers)
      .values({ userId, email, displayName: name })
      .onConflictDoUpdate({
        target: adminUsers.userId,
        set: { email, displayName: name },
      });
  } finally {
    await closeConnection();
  }

  console.log(`✓ ${name} <${email}> is now an admin.`);
  if (generatedPassword) {
    console.log(`\nTemporary password: ${generatedPassword}`);
    console.log("Sign in at /admin/login and change it straight away.");
  }
}

createAdmin().catch((error: unknown) => {
  console.error("Could not create admin:", error);
  process.exit(1);
});
