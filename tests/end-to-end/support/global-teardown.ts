import { removeTestData } from "./test-data";

/** Runs once after the browser tests: deletes everything they created. */
export default async function globalTeardown() {
  const removed = await removeTestData();
  console.log(`Removed test data: ${removed}.`);
}
