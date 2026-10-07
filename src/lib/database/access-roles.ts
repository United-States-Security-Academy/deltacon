import "server-only";

import { sql } from "drizzle-orm";

import {
  privilegedDatabase,
  type DatabaseTransaction,
} from "./database-client";

/**
 * Runs database work as an anonymous website visitor (the Supabase "anon"
 * role), so the same Row Level Security policies apply as for the public API:
 * visitors can only create submissions and read published content.
 *
 * `set local` only lasts until the end of the transaction, so the connection
 * returns to the pool unchanged.
 */
export async function runAsVisitor<Result>(
  work: (transaction: DatabaseTransaction) => Promise<Result>,
): Promise<Result> {
  return privilegedDatabase.transaction(async (transaction) => {
    await transaction.execute(
      sql`select set_config('request.jwt.claims', '{"role":"anon"}', true)`,
    );
    await transaction.execute(sql`set local role anon`);
    return work(transaction);
  });
}

/**
 * Runs database work as a signed-in Supabase user (the "authenticated" role
 * with their user id), so admin-only policies are checked by Postgres itself
 * through `public.is_admin()`, on top of the application's own checks.
 *
 * `userId` must come from a session verified on the server, never from the
 * request body.
 */
export async function runAsSignedInUser<Result>(
  userId: string,
  work: (transaction: DatabaseTransaction) => Promise<Result>,
): Promise<Result> {
  const jwtClaims = JSON.stringify({ sub: userId, role: "authenticated" });

  return privilegedDatabase.transaction(async (transaction) => {
    await transaction.execute(
      sql`select set_config('request.jwt.claims', ${jwtClaims}, true)`,
    );
    await transaction.execute(sql`set local role authenticated`);
    return work(transaction);
  });
}
