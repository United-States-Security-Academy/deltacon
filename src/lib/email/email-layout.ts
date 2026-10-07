import { companyDetails } from "@/config/company-details";
import type { SubmissionSummaryRow } from "@/lib/submissions/submission-summary";

/** Makes user-supplied text safe to place inside HTML. */
export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Escapes text and keeps the line breaks people typed. */
function escapeMultilineText(text: string): string {
  return escapeHtml(text).replaceAll("\n", "<br>");
}

const brandColours = {
  navy: "#10213a",
  gold: "#c9a44c",
  paper: "#f7f5f0",
  text: "#1f2329",
  mutedText: "#4b5563",
};

/** Two-column table of submitted values. */
export function renderSummaryTable(rows: SubmissionSummaryRow[]): string {
  const tableRows = rows
    .map(
      (row) => `
        <tr>
          <th align="left" valign="top" style="padding:8px 12px;width:38%;font-size:14px;color:${brandColours.mutedText};border-bottom:1px solid #e2ded4;">${escapeHtml(row.label)}</th>
          <td valign="top" style="padding:8px 12px;font-size:14px;color:${brandColours.text};border-bottom:1px solid #e2ded4;">${escapeMultilineText(row.value)}</td>
        </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#ffffff;">${tableRows}</table>`;
}

export function summaryAsPlainText(rows: SubmissionSummaryRow[]): string {
  return rows.map((row) => `${row.label}: ${row.value}`).join("\n");
}

type EmailLayoutOptions = {
  /** Shown in the inbox preview line. */
  previewText: string;
  heading: string;
  /** Already-escaped HTML for the main content. */
  bodyHtml: string;
};

/** Simple, email-client-safe branded wrapper (tables and inline styles only). */
export function renderEmailLayout({
  previewText,
  heading,
  bodyHtml,
}: EmailLayoutOptions): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(heading)}</title>
  </head>
  <body style="margin:0;padding:0;background:${brandColours.paper};font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(previewText)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${brandColours.paper};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:6px;overflow:hidden;">
            <tr>
              <td style="background:${brandColours.navy};padding:20px 24px;border-bottom:4px solid ${brandColours.gold};">
                <p style="margin:0;font-size:20px;font-weight:bold;letter-spacing:2px;color:#ffffff;text-transform:uppercase;">${escapeHtml(companyDetails.name)}</p>
                <p style="margin:4px 0 0;font-size:12px;letter-spacing:3px;color:${brandColours.gold};text-transform:uppercase;">${escapeHtml(companyDetails.motto)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 16px;font-size:22px;color:${brandColours.navy};">${escapeHtml(heading)}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px;background:${brandColours.paper};font-size:12px;color:${brandColours.mutedText};">
                ${escapeHtml(companyDetails.name)} · ${escapeHtml(companyDetails.location.region)}, USA
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function paragraph(html: string): string {
  return `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${brandColours.text};">${html}</p>`;
}

export function button(label: string, url: string): string {
  return `<p style="margin:24px 0 0;"><a href="${escapeHtml(url)}" style="display:inline-block;background:${brandColours.gold};color:#0a1626;font-weight:bold;text-decoration:none;padding:12px 20px;border-radius:6px;">${escapeHtml(label)}</a></p>`;
}
