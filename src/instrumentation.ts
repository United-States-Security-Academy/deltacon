/**
 * Runs once when the server starts. Checking every environment variable here
 * means a missing or malformed secret stops the app immediately with a clear
 * message, instead of failing later on the first form submission.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { parseEnvironment, publicEnvironmentSchema, serverEnvironmentSchema } =
    await import("./lib/environment/environment-schemas");

  parseEnvironment(publicEnvironmentSchema, process.env, "public");
  parseEnvironment(serverEnvironmentSchema, process.env, "server");
}
