import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { publicEnvironment } from "@/lib/environment/public-environment";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * It reads and refreshes the signed-in admin's session from cookies, using
 * only the public (publishable) key.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server Components cannot set cookies. That's fine: the proxy
            // refreshes the session cookies on every admin request.
          }
        },
      },
    },
  );
}
