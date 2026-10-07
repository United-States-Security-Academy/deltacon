import "server-only";

import { companyDetails } from "@/config/company-details";
import {
  button,
  escapeHtml,
  paragraph,
  renderEmailLayout,
  renderSummaryTable,
} from "@/lib/email/email-layout";
import { sendEmail } from "@/lib/email/send-email";
import {
  buildSiteSurveyPath,
  type AssessmentResult,
} from "@/lib/security-assessment/score-assessment";
import { absoluteUrl } from "@/lib/site-url";
import { getNotificationEmailAddress } from "@/server/queries/admin-settings";
import { getPublicContactDetails } from "@/server/queries/site-settings";

type AssessmentEmailDetails = {
  fullName: string;
  email: string;
  companyName?: string;
  result: AssessmentResult;
};

function renderScoreBlock(result: AssessmentResult): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;background:#10213a;border-radius:6px;">
    <tr>
      <td style="padding:20px 24px;color:#ffffff;">
        <p style="margin:0;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#c9a44c;">Your score</p>
        <p style="margin:4px 0 0;font-size:40px;font-weight:bold;line-height:1;">${result.scorePercentage}<span style="font-size:18px;color:#c9d3e3;">/100</span></p>
        <p style="margin:8px 0 0;font-size:16px;font-weight:bold;">${escapeHtml(result.rating.label)}</p>
      </td>
    </tr>
  </table>`;
}

function renderRecommendations(result: AssessmentResult): string {
  if (result.recommendations.length === 0) {
    return paragraph(
      "Great news: none of your answers raised a priority concern.",
    );
  }
  return result.recommendations
    .map((recommendation, index) => {
      const serviceUrl = absoluteUrl(`/services/${recommendation.serviceSlug}`);
      return `<div style="margin:0 0 14px;padding:14px 16px;border-left:4px solid #c9a44c;background:#f7f5f0;">
        <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#10213a;">${index + 1}. ${escapeHtml(recommendation.title)}</p>
        <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#1f2329;">${escapeHtml(recommendation.advice)}</p>
        <p style="margin:0;font-size:13px;"><a href="${escapeHtml(serviceUrl)}" style="color:#7a5f1c;font-weight:bold;">How we help: ${escapeHtml(recommendation.serviceName)}</a></p>
      </div>`;
    })
    .join("");
}

function renderResultsHtml(result: AssessmentResult): string {
  return (
    renderScoreBlock(result) +
    paragraph(escapeHtml(result.rating.summary)) +
    `<h2 style="margin:24px 0 8px;font-size:17px;color:#10213a;">Score by area</h2>` +
    renderSummaryTable(
      result.categories.map((category) => ({
        label: category.name,
        value: `${category.scorePercentage}/100`,
      })),
    ) +
    `<h2 style="margin:24px 0 8px;font-size:17px;color:#10213a;">Your personalised recommendations</h2>` +
    renderRecommendations(result)
  );
}

function renderResultsText(result: AssessmentResult): string {
  return [
    `Your score: ${result.scorePercentage}/100 (${result.rating.label})`,
    result.rating.summary,
    "",
    "Score by area:",
    ...result.categories.map(
      (category) => `- ${category.name}: ${category.scorePercentage}/100`,
    ),
    "",
    "Recommendations:",
    ...result.recommendations.map(
      (recommendation, index) =>
        `${index + 1}. ${recommendation.title}: ${recommendation.advice} (${recommendation.serviceName})`,
    ),
  ].join("\n");
}

/** Sends the visitor their results. Returns false if the email failed. */
export async function sendResultsToVisitor(
  details: AssessmentEmailDetails,
): Promise<boolean> {
  const contactDetails = await getPublicContactDetails();
  const firstName = details.fullName.split(" ")[0] ?? details.fullName;
  const siteSurveyUrl = absoluteUrl(buildSiteSurveyPath(details.result));
  const subject = `Your security self-assessment: ${details.result.scorePercentage}/100`;

  return sendEmail({
    to: details.email,
    replyTo: contactDetails.email,
    subject,
    html: renderEmailLayout({
      previewText: `You scored ${details.result.scorePercentage}/100. Here are your personalised recommendations.`,
      heading: "Your security self-assessment results",
      bodyHtml:
        paragraph(`Hi ${escapeHtml(firstName)},`) +
        paragraph(
          "Thank you for completing the “How secure is your business?” self-assessment. Here are your results.",
        ) +
        renderResultsHtml(details.result) +
        paragraph(
          "<br>Want a professional opinion? Our team can visit your site, review these areas in person and recommend practical next steps.",
        ) +
        button("Book a site survey", siteSurveyUrl) +
        paragraph(
          `<br>Questions? Call us on <a href="tel:${escapeHtml(contactDetails.phoneInternational)}">${escapeHtml(contactDetails.phoneDisplay)}</a> or reply to this email.`,
        ) +
        paragraph(
          `<span style="font-size:12px;color:#4b5563;">This self-assessment is a general guide based on your answers. It is not a substitute for a professional security survey.</span>`,
        ),
    }),
    text: `Hi ${firstName},\n\nThank you for completing the security self-assessment.\n\n${renderResultsText(details.result)}\n\nBook a site survey: ${siteSurveyUrl}\n\nQuestions? Call ${contactDetails.phoneDisplay} or reply to this email.\n\n${companyDetails.name}`,
  });
}

/** Lets the Deltacon team follow up on the lead. Failures are logged only. */
export async function sendLeadNotification(details: AssessmentEmailDetails) {
  const subject = `New self-assessment lead: ${details.fullName} scored ${details.result.scorePercentage}/100`;

  await sendEmail({
    to: await getNotificationEmailAddress(),
    replyTo: details.email,
    subject,
    html: renderEmailLayout({
      previewText: subject,
      heading: "New security self-assessment",
      bodyHtml:
        paragraph(
          "Someone completed the website self-assessment and asked for their results. Reply to this email to contact them.",
        ) +
        renderSummaryTable([
          { label: "Name", value: details.fullName },
          { label: "Email", value: details.email },
          { label: "Company", value: details.companyName ?? "Not given" },
        ]) +
        "<br>" +
        renderResultsHtml(details.result),
    }),
    text: `${subject}\n\nName: ${details.fullName}\nEmail: ${details.email}\nCompany: ${details.companyName ?? "Not given"}\n\n${renderResultsText(details.result)}`,
  });
}
