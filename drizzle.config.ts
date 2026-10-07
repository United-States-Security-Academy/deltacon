import { existsSync } from "node:fs";

import { defineConfig } from "drizzle-kit";

// Load .env.local when running drizzle-kit locally (Vercel injects env vars itself).
if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/database/schema/index.ts",
  out: "./drizzle",
  // Supabase owns the auth, storage and realtime schemas; only manage "public".
  schemaFilter: ["public"],
  // anon, authenticated and service_role already exist in every Supabase project.
  entities: { roles: { provider: "supabase" } },
  dbCredentials: {
    // Migrations need a session connection (port 5432); the app itself uses
    // the transaction pooler in DATABASE_URL.
    url: process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL || "",
  },
  strict: true,
  verbose: true,
});
