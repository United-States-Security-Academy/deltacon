import "server-only";

import { Resend } from "resend";

import { serverEnvironment } from "@/lib/environment/server-environment";

const resendClient = new Resend(serverEnvironment.RESEND_API_KEY);

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

/**
 * Sends one email through Resend. Returns false instead of throwing, so a
 * failed email never undoes a submission that has already been saved.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  try {
    const { error } = await resendClient.emails.send({
      from: serverEnvironment.EMAIL_FROM_ADDRESS,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      replyTo: message.replyTo,
    });
    if (error) {
      console.error(`Email "${message.subject}" was not sent:`, error);
      return false;
    }
    return true;
  } catch (error) {
    console.error(`Email "${message.subject}" was not sent:`, error);
    return false;
  }
}
