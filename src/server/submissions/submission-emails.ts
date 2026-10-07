import "server-only";

import { companyDetails } from "@/config/company-details";
import type { SubmissionFormType } from "@/lib/database/schema/enums";
import {
  button,
  escapeHtml,
  paragraph,
  renderEmailLayout,
  renderSummaryTable,
  summaryAsPlainText,
} from "@/lib/email/email-layout";
import { sendEmail } from "@/lib/email/send-email";
import { absoluteUrl } from "@/lib/site-url";
import {
  submissionFormTypeLabels,
  type SubmissionSummaryRow,
} from "@/lib/submissions/submission-summary";
import { getNotificationEmailAddress } from "@/server/queries/admin-settings";
import { getPublicContactDetails } from "@/server/queries/site-settings";

type SubmissionEmailDetails = {
  submissionId: string;
  formType: SubmissionFormType;
  submitterName: string;
  submitterEmail: string;
  summaryRows: SubmissionSummaryRow[];
};

const acknowledgementCopy: Record<
  SubmissionFormType,
  { subject: string; heading: string; message: string }
> = {
  service_request: {
    subject: "We've received your security request",
    heading: "Thank you for your request",
    message:
      "Thanks for contacting Deltacon Security. A member of our team will review your requirements and get back to you, usually within one business day.",
  },
  job_application: {
    subject: "We've received your application",
    heading: "Thank you for applying",
    message:
      "Thank you for your interest in joining Deltacon Security. Our recruitment team will review your application and contact you if your experience matches the role.",
  },
  training_enquiry: {
    subject: "We've received your training enquiry",
    heading: "Thank you for your enquiry",
    message:
      "Thanks for your interest in our training. We'll be in touch shortly with course dates, availability and pricing.",
  },
};

/** Alerts the Deltacon team that a new submission has arrived. */
async function sendAdminNotification(details: SubmissionEmailDetails) {
  const formLabel = submissionFormTypeLabels[details.formType];
  const adminViewUrl = absoluteUrl(
    `/admin/submissions/${details.submissionId}`,
  );
  const subject = `New ${formLabel.toLowerCase()} from ${details.submitterName}`;

  await sendEmail({
    to: await getNotificationEmailAddress(),
    // Replying goes straight to the person who submitted the form.
    replyTo: details.submitterEmail,
    subject,
    html: renderEmailLayout({
      previewText: subject,
      heading: `New ${formLabel.toLowerCase()}`,
      bodyHtml:
        paragraph(
          `${escapeHtml(details.submitterName)} has sent a new ${escapeHtml(formLabel.toLowerCase())} through the website.`,
        ) +
        renderSummaryTable(details.summaryRows) +
        button("Open in the admin inbox", adminViewUrl),
    }),
    text: `${subject}\n\n${summaryAsPlainText(details.summaryRows)}\n\nOpen in the admin inbox: ${adminViewUrl}`,
  });
}

/** Confirms to the visitor that their submission arrived. */
async function sendSubmitterAcknowledgement(details: SubmissionEmailDetails) {
  const copy = acknowledgementCopy[details.formType];
  const contactDetails = await getPublicContactDetails();
  const firstName =
    details.submitterName.split(" ")[0] ?? details.submitterName;

  await sendEmail({
    to: details.submitterEmail,
    replyTo: contactDetails.email,
    subject: copy.subject,
    html: renderEmailLayout({
      previewText: copy.message,
      heading: copy.heading,
      bodyHtml:
        paragraph(`Hi ${escapeHtml(firstName)},`) +
        paragraph(escapeHtml(copy.message)) +
        paragraph("For your records, here's what you sent us:") +
        renderSummaryTable(details.summaryRows) +
        paragraph(
          `<br>If anything is urgent, call us on <a href="tel:${escapeHtml(contactDetails.phoneInternational)}">${escapeHtml(contactDetails.phoneDisplay)}</a> or simply reply to this email.`,
        ) +
        paragraph(
          `Kind regards,<br>The ${escapeHtml(companyDetails.name)} team`,
        ),
    }),
    text: `Hi ${firstName},\n\n${copy.message}\n\nHere's what you sent us:\n${summaryAsPlainText(details.summaryRows)}\n\nIf anything is urgent, call us on ${contactDetails.phoneDisplay} or reply to this email.\n\nKind regards,\nThe ${companyDetails.name} team`,
  });
}

/** Sends both emails. Failures are logged, never thrown. */
export async function sendSubmissionEmails(details: SubmissionEmailDetails) {
  await Promise.all([
    sendAdminNotification(details),
    sendSubmitterAcknowledgement(details),
  ]);
}
