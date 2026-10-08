/*
 * Fake configuration for unit tests. Nothing here is a real key, so a test
 * can never reach the real database, email service or Cloudflare.
 */
export const testSupabaseUrl = "https://test-project.supabase.co";

Object.assign(process.env, {
  NEXT_PUBLIC_SITE_URL: "https://www.example.com",
  NEXT_PUBLIC_SUPABASE_URL: testSupabaseUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "test-publishable-key",
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: "1x00000000000000000000AA",
  DATABASE_URL: "postgresql://test:test@127.0.0.1:1/test",
  SUPABASE_SECRET_KEY: "test-secret-key",
  RESEND_API_KEY: "re_test_key",
  EMAIL_FROM_ADDRESS: "Test <test@example.com>",
  TURNSTILE_SECRET_KEY: "1x0000000000000000000000000000000AA",
  IP_HASH_SECRET: "unit-test-ip-hash-secret-at-least-32-characters",
  CRON_SECRET: "unit-test-cron-secret",
});
