import "server-only";

import {
  parseEnvironment,
  serverEnvironmentSchema,
} from "./environment-schemas";

/**
 * Secret environment variables. Importing this file from a client component
 * fails the build (thanks to "server-only"), so secrets never reach the browser.
 */
export const serverEnvironment = parseEnvironment(
  serverEnvironmentSchema,
  process.env,
  "server",
);
