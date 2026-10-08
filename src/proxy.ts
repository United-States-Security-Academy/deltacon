import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { publicEnvironment } from "@/lib/environment/public-environment";

/** Admin pages that must be reachable without being signed in. */
const publicAdminPaths = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/auth/confirm",
];

function isPublicAdminPath(pathname: string): boolean {
  return publicAdminPaths.some(
    (publicPath) =>
      pathname === publicPath || pathname.startsWith(`${publicPath}/`),
  );
}

/**
 * Runs before every /admin request:
 * 1. Refreshes the Supabase session cookies so signed-in admins stay signed in.
 * 2. Sends visitors who are not signed in to the login page.
 *
 * This is only a first, fast check. Every admin page and action also verifies
 * on the server that the user is an admin, and the database's Row Level
 * Security checks again, so nothing relies on the proxy alone.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    publicEnvironment.NEXT_PUBLIC_SUPABASE_URL,
    publicEnvironment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // Verifies the session token and refreshes it when it is about to expire.
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims?.sub);
  const { pathname, search } = request.nextUrl;

  if (!isSignedIn && !isPublicAdminPath(pathname)) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Signed-in visitors on /admin/login are handled by the login page itself:
  // only it knows whether they are actually an admin. Redirecting here would
  // loop for someone signed in who isn't an admin.

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
