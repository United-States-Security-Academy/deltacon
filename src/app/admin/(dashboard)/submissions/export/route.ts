import { buildSubmissionsCsv } from "@/lib/submissions/submissions-csv";
import { readSubmissionFilters } from "@/lib/validation/submission-inbox-schemas";
import { requireAdmin } from "@/server/auth/require-admin";
import { listSubmissionsForExport } from "@/server/queries/admin-submissions";

/** Downloads the submissions matching the inbox's current filters as a CSV file. */
export async function GET(request: Request) {
  const admin = await requireAdmin();
  const searchParams = Object.fromEntries(new URL(request.url).searchParams);
  // The page number is ignored: an export includes every matching row.
  const filters = readSubmissionFilters(searchParams);

  const rows = await listSubmissionsForExport(admin.userId, filters);
  const csv = buildSubmissionsCsv(rows, filters.formType);

  const today = new Date().toISOString().slice(0, 10);
  const formName = filters.formType?.replace(/_/g, "-") ?? "all";
  const fileName = `deltacon-submissions-${formName}-${today}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      // Contains personal details: never keep a copy in any cache.
      "Cache-Control": "private, no-store",
    },
  });
}
