/*
 * Security headers sent with every page. Used by next.config.ts.
 *
 * The Content Security Policy lists every outside service the site uses, so a
 * browser refuses anything else (for example a script injected by an
 * attacker, or the site being shown inside another site's frame):
 *
 * - Supabase:   uploaded images, admin sign-in and admin uploads
 * - Cloudflare: the Turnstile spam check on forms
 * - jsDelivr:   the home page hero video
 * - YouTube:    videos embedded in blog posts (privacy-enhanced domain)
 *
 * Scripts allow 'unsafe-inline' because Next.js adds small inline scripts to
 * pages that are built ahead of time and cached. The alternative (a random
 * nonce per request) would force every page to be rendered on every visit.
 * Everything else is locked down, and no outside script host is allowed
 * except Cloudflare's.
 */

type SecurityHeaderOptions = {
  supabaseUrl: string | undefined;
  isDevelopment: boolean;
  /** Vercel preview deployments show Vercel's feedback toolbar. */
  isVercelPreview: boolean;
};

export function buildContentSecurityPolicy({
  supabaseUrl,
  isDevelopment,
  isVercelPreview,
}: SecurityHeaderOptions): string {
  const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";
  const vercelToolbar = isVercelPreview ? "https://vercel.live" : "";

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      // Next.js development mode evaluates code for fast refresh.
      isDevelopment ? "'unsafe-eval'" : "",
      "https://challenges.cloudflare.com",
      vercelToolbar,
    ],
    "style-src": ["'self'", "'unsafe-inline'", vercelToolbar],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      supabaseOrigin,
      vercelToolbar,
      isVercelPreview ? "https://vercel.com" : "",
    ],
    "media-src": ["'self'", "https://cdn.jsdelivr.net", supabaseOrigin],
    "font-src": ["'self'", "data:", vercelToolbar],
    "connect-src": [
      "'self'",
      supabaseOrigin,
      "https://challenges.cloudflare.com",
      isDevelopment ? "ws:" : "",
      vercelToolbar,
      isVercelPreview ? "wss://ws-us3.pusher.com" : "",
    ],
    "frame-src": [
      "https://challenges.cloudflare.com",
      "https://www.youtube-nocookie.com",
      "https://www.youtube.com",
      vercelToolbar,
    ],
    "worker-src": ["'self'", "blob:"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": ["'none'"],
    "manifest-src": ["'self'"],
  };

  const policy = Object.entries(directives).map(([name, sources]) =>
    [name, ...sources.filter(Boolean)].join(" "),
  );
  if (!isDevelopment) policy.push("upgrade-insecure-requests");
  return policy.join("; ");
}

export function buildSecurityHeaders(
  options: SecurityHeaderOptions,
): { key: string; value: string }[] {
  const headers = [
    {
      key: "Content-Security-Policy",
      value: buildContentSecurityPolicy(options),
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    // Older browsers that don't understand frame-ancestors.
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    {
      key: "Permissions-Policy",
      value:
        "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
    },
    { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ];
  if (!options.isDevelopment) {
    // Two years; browsers then always use HTTPS for this site.
    headers.push({
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains",
    });
  }
  return headers;
}
