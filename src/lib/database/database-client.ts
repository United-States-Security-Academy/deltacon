import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { serverEnvironment } from "@/lib/environment/server-environment";

import * as schema from "./schema";

function createDatabaseConnection() {
  return postgres(serverEnvironment.DATABASE_URL, {
    // Supabase's transaction pooler does not support prepared statements.
    prepare: false,
    // Give up quickly if the database is unreachable, so pages fall back to
    // their defaults instead of hanging (postgres.js waits 30 seconds by default).
    connect_timeout: 10,
    // Serverless functions should hold very few connections each.
    max: 5,
  });
}

// Reuse one connection pool across hot reloads in development.
const globalForDatabase = globalThis as unknown as {
  databaseConnection?: ReturnType<typeof createDatabaseConnection>;
};

const databaseConnection =
  globalForDatabase.databaseConnection ?? createDatabaseConnection();

if (serverEnvironment.NODE_ENV !== "production") {
  globalForDatabase.databaseConnection = databaseConnection;
}

/**
 * Privileged database access that BYPASSES Row Level Security.
 *
 * Only use this directly for server-side housekeeping that no user is acting
 * on (rate limiting, reading notification settings, cron jobs). For anything a
 * visitor or admin does, use `runAsVisitor` or `runAsSignedInUser` from
 * ./access-roles so the RLS policies are enforced.
 */
export const privilegedDatabase = drizzle(databaseConnection, { schema });

export type Database = typeof privilegedDatabase;
export type DatabaseTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];
