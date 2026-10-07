import { existsSync } from "node:fs";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/lib/database/schema";

// Scripts run outside Next.js, so load .env.local ourselves.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export function requireEnvironmentVariable(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Missing environment variable ${name}. Add it to .env.local.`,
    );
    process.exit(1);
  }
  return value;
}

/** Opens a privileged database connection for a one-off script. */
export function connectToDatabase() {
  const connectionUrl =
    process.env.DATABASE_DIRECT_URL ||
    requireEnvironmentVariable("DATABASE_URL");
  const connection = postgres(connectionUrl, { prepare: false, max: 1 });
  return {
    database: drizzle(connection, { schema }),
    closeConnection: () => connection.end(),
  };
}
