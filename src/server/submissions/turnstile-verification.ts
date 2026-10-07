import "server-only";

import { z } from "zod";

import { serverEnvironment } from "@/lib/environment/server-environment";

const turnstileVerifyUrl =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const turnstileResponseSchema = z.object({
  success: z.boolean(),
  "error-codes": z.array(z.string()).optional(),
});

/**
 * Asks Cloudflare whether the Turnstile token from the form is genuine.
 * Each token can only be verified once.
 */
export async function isTurnstileTokenValid(
  token: string,
  ipAddress: string,
): Promise<boolean> {
  try {
    const response = await fetch(turnstileVerifyUrl, {
      method: "POST",
      body: new URLSearchParams({
        secret: serverEnvironment.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ipAddress,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const result = turnstileResponseSchema.parse(await response.json());
    if (!result.success) {
      console.warn("Turnstile rejected a token:", result["error-codes"]);
    }
    return result.success;
  } catch (error) {
    console.error("Turnstile verification failed.", error);
    return false;
  }
}
