import "server-only";

import { sql } from "drizzle-orm";

import { privilegedDatabase } from "@/lib/database/database-client";

type RateLimitRule = {
  /** Name of the form or action being limited, e.g. "service-request". */
  actionName: string;
  ipAddressHash: string;
  maximumRequests: number;
  windowInSeconds: number;
};

/**
 * Counts this request and reports whether the visitor has gone over the limit.
 * The counter resets once the time window has passed. A single atomic upsert
 * keeps it correct when several requests arrive at once.
 *
 * If the database cannot be reached the request is allowed: the form will
 * fail at the save step anyway, and real visitors shouldn't be blocked by a
 * rate-limit outage.
 */
export async function isRateLimited({
  actionName,
  ipAddressHash,
  maximumRequests,
  windowInSeconds,
}: RateLimitRule): Promise<boolean> {
  const rateLimitKey = `${actionName}:${ipAddressHash}`;

  try {
    const rows = await privilegedDatabase.execute<{
      request_count: number;
    }>(sql`
      insert into rate_limits (key, window_started_at, request_count)
      values (${rateLimitKey}, now(), 1)
      on conflict (key) do update set
        request_count = case
          when rate_limits.window_started_at < now() - make_interval(secs => ${windowInSeconds})
          then 1
          else rate_limits.request_count + 1
        end,
        window_started_at = case
          when rate_limits.window_started_at < now() - make_interval(secs => ${windowInSeconds})
          then now()
          else rate_limits.window_started_at
        end
      returning request_count
    `);
    const requestCount = rows[0]?.request_count ?? 1;
    return requestCount > maximumRequests;
  } catch (error) {
    console.error("Rate limit check failed; allowing the request.", error);
    return false;
  }
}

/** Limits for the public forms: 5 submissions per form per 10 minutes. */
export const publicFormRateLimit = {
  maximumRequests: 5,
  windowInSeconds: 10 * 60,
};
