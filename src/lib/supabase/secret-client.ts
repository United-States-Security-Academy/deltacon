import "server-only";

import { createClient } from "@supabase/supabase-js";

import { publicEnvironment } from "@/lib/environment/public-environment";
import { serverEnvironment } from "@/lib/environment/server-environment";

/**
 * Supabase client using the SECRET key. It bypasses Row Level Security, so
 * only use it on the server for jobs that genuinely need it (CV storage,
 * inviting admins) and always after checking who is asking.
 */
export function createSecretSupabaseClient() {
  return createClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    serverEnvironment.SUPABASE_SECRET_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
