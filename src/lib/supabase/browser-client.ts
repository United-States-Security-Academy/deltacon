import { createBrowserClient } from "@supabase/ssr";

import { publicEnvironment } from "@/lib/environment/public-environment";

/** Supabase client for use in the browser, with the public (publishable) key only. */
export function createBrowserSupabaseClient() {
  return createBrowserClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
