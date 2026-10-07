import { z } from "zod";

/** Variables that are safe to expose to the browser (NEXT_PUBLIC_ prefix). */
export const publicEnvironmentSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
});

/** Secrets that must only ever be read on the server. */
export const serverEnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  /** Postgres connection string (Supabase "Transaction pooler", port 6543). */
  DATABASE_URL: z.url(),
  /** Supabase secret (service role) key. Used only for Storage signed URLs and admin invites. */
  SUPABASE_SECRET_KEY: z.string().min(1),

  RESEND_API_KEY: z.string().min(1),
  /** Sender shown on outgoing emails, e.g. "Deltacon Security Group <noreply@deltacon1.com>". */
  EMAIL_FROM_ADDRESS: z.string().min(3),

  TURNSTILE_SECRET_KEY: z.string().min(1),

  /** Random string used to hash visitor IP addresses before storing them. */
  IP_HASH_SECRET: z.string().min(32),
  /** Shared secret Vercel Cron sends when calling the scheduled-publish endpoint. */
  CRON_SECRET: z.string().min(16),
});

export type PublicEnvironment = z.infer<typeof publicEnvironmentSchema>;
export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

/**
 * Stand-in values used ONLY in local development when a variable is missing,
 * so the site can be browsed before Supabase, Resend and Turnstile are set up.
 * Pages still render (database lookups fall back to defaults); saving forms,
 * sending email and signing in will not work until real values are added.
 *
 * The Turnstile values are Cloudflare's official always-pass test keys.
 * Production builds never use these: missing variables stop the app there.
 */
const developmentStandInValues: Record<string, string> = {
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54321",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "development-stand-in-key",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  DATABASE_URL: "postgresql://postgres:postgres@127.0.0.1:54322/postgres",
  SUPABASE_SECRET_KEY: "development-stand-in-key",
  RESEND_API_KEY: "re_development_stand_in_key",
  EMAIL_FROM_ADDRESS: "Deltacon Security Group <onboarding@resend.dev>",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
  IP_HASH_SECRET: "development-only-ip-hash-secret-0000000000",
  CRON_SECRET: "development-only-cron-secret",
};

const warnedAboutStandIns = new Set<string>();

/**
 * Parses the variables and throws one readable error listing every problem.
 * In development, missing variables are filled with stand-ins and a warning
 * is printed instead, so the site can run before .env.local exists.
 */
export function parseEnvironment<Schema extends z.ZodType>(
  schema: Schema,
  values: unknown,
  description: string,
): z.infer<Schema> {
  const result = schema.safeParse(values);
  if (result.success) return result.data;

  if (process.env.NODE_ENV === "development") {
    const providedValues = values as Record<string, string | undefined>;
    const missingVariableNames = Object.keys(developmentStandInValues).filter(
      (variableName) =>
        variableName in (schema as unknown as z.ZodObject).shape &&
        !providedValues[variableName],
    );
    const valuesWithStandIns = { ...providedValues };
    for (const variableName of missingVariableNames) {
      valuesWithStandIns[variableName] = developmentStandInValues[variableName];
    }

    const retriedResult = schema.safeParse(valuesWithStandIns);
    if (retriedResult.success) {
      if (!warnedAboutStandIns.has(description)) {
        warnedAboutStandIns.add(description);
        console.warn(
          `⚠ Missing ${description} environment variables: ${missingVariableNames.join(", ")}.\n` +
            "  Using development stand-ins so the site can run. Database, email and sign-in\n" +
            "  will not work until you copy .env.example to .env.local and fill it in.",
        );
      }
      return retriedResult.data;
    }
  }

  throw new Error(
    `Invalid ${description} environment variables (see .env.example):\n${z.prettifyError(result.error)}`,
  );
}
