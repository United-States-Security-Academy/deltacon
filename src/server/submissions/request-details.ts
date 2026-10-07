import "server-only";

import { createHmac } from "node:crypto";

import { headers } from "next/headers";

import { serverEnvironment } from "@/lib/environment/server-environment";

export type RequestDetails = {
  /** Raw IP address, used only for Turnstile and rate limiting. Never stored. */
  ipAddress: string;
  /** Keyed one-way hash of the IP address; this is what gets stored. */
  ipAddressHash: string;
  userAgent: string | null;
};

/** Reads the visitor's IP address and browser from the incoming request. */
export async function getRequestDetails(): Promise<RequestDetails> {
  const requestHeaders = await headers();
  // On Vercel the first address in x-forwarded-for is the real client.
  const ipAddress =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 500) ?? null;

  return { ipAddress, ipAddressHash: hashIpAddress(ipAddress), userAgent };
}

export function hashIpAddress(ipAddress: string): string {
  return createHmac("sha256", serverEnvironment.IP_HASH_SECRET)
    .update(ipAddress)
    .digest("hex");
}
