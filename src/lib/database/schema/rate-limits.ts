import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Counters for IP-based rate limiting of the public forms.
 *
 * Row Level Security is enabled with no policies, so nothing can reach this
 * table through the Supabase API. Only the server's own database connection
 * reads and writes it.
 */
export const rateLimits = pgTable("rate_limits", {
  /** "<form name>:<hashed IP address>" */
  key: text("key").primaryKey(),
  windowStartedAt: timestamp("window_started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  requestCount: integer("request_count").notNull().default(1),
}).enableRLS();
