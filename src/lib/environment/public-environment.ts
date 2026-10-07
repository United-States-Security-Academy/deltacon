import {
  parseEnvironment,
  publicEnvironmentSchema,
} from "./environment-schemas";

/**
 * Browser-safe environment variables.
 *
 * Next.js only inlines NEXT_PUBLIC_ variables that are referenced by their
 * full name, so each one is read explicitly rather than passing process.env.
 */
export const publicEnvironment = parseEnvironment(
  publicEnvironmentSchema,
  {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  "public",
);
