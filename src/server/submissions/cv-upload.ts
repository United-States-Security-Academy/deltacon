import "server-only";

import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { serverEnvironment } from "@/lib/environment/server-environment";
import { createSecretSupabaseClient } from "@/lib/supabase/secret-client";
import {
  allowedCvFileTypes,
  maximumCvFileSizeInBytes,
  type AllowedCvFileType,
} from "@/lib/validation/submission-schemas";

/*
 * How a CV gets uploaded safely:
 *
 * 1. The applicant passes the Turnstile check and the server creates a
 *    one-time signed upload URL for a random path in the PRIVATE "cv-uploads"
 *    bucket, plus a signed "ticket" naming that path.
 * 2. The browser uploads the file straight to Supabase Storage. Files go
 *    direct because Vercel limits request bodies to about 4.5 MB.
 * 3. The browser submits the form with the ticket. The server checks the
 *    ticket's signature and expiry, then downloads the file and checks its
 *    real size and file signature (not just its name) before saving.
 */

export const cvUploadBucket = "cv-uploads";

const ticketLifetimeInMilliseconds = 30 * 60 * 1000;

const cvUploadTicketSchema = z.object({
  storagePath: z.string(),
  originalFileName: z.string(),
  expiresAt: z.number(),
});

export type CvUploadTicket = z.infer<typeof cvUploadTicketSchema>;

function signTicketPayload(encodedPayload: string): string {
  return createHmac("sha256", serverEnvironment.IP_HASH_SECRET)
    .update(`cv-upload-ticket:${encodedPayload}`)
    .digest("base64url");
}

export function contentTypeForCvFileName(fileName: string): AllowedCvFileType {
  return fileName.toLowerCase().endsWith(".pdf")
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
}

/** Keeps a readable, safe version of the applicant's file name for display. */
function cleanFileName(fileName: string): string {
  const withoutFolders = fileName.split(/[\\/]/).pop() ?? "cv";
  return withoutFolders.replace(/[^\w.\- ()]/g, "_").slice(0, 150);
}

export type PreparedCvUpload = {
  storagePath: string;
  uploadToken: string;
  contentType: AllowedCvFileType;
  ticket: string;
};

/** Step 1: reserve a random storage path and create the upload link and ticket. */
export async function prepareCvUpload(
  originalFileName: string,
): Promise<PreparedCvUpload> {
  const contentType = contentTypeForCvFileName(originalFileName);
  const fileExtension = allowedCvFileTypes[contentType];
  const yearAndMonth = new Date().toISOString().slice(0, 7);
  const storagePath = `applications/${yearAndMonth}/${randomUUID()}${fileExtension}`;

  const supabase = createSecretSupabaseClient();
  const { data, error } = await supabase.storage
    .from(cvUploadBucket)
    .createSignedUploadUrl(storagePath);
  if (error) throw error;

  const encodedPayload = Buffer.from(
    JSON.stringify({
      storagePath,
      originalFileName: cleanFileName(originalFileName),
      expiresAt: Date.now() + ticketLifetimeInMilliseconds,
    } satisfies CvUploadTicket),
  ).toString("base64url");

  return {
    storagePath,
    uploadToken: data.token,
    contentType,
    ticket: `${encodedPayload}.${signTicketPayload(encodedPayload)}`,
  };
}

/** Returns the ticket's contents if the signature is genuine and not expired. */
export function readCvUploadTicket(ticket: string): CvUploadTicket | undefined {
  const [encodedPayload, signature] = ticket.split(".");
  if (!encodedPayload || !signature) return undefined;

  const expectedSignature = Buffer.from(signTicketPayload(encodedPayload));
  const receivedSignature = Buffer.from(signature);
  if (
    expectedSignature.length !== receivedSignature.length ||
    !timingSafeEqual(expectedSignature, receivedSignature)
  ) {
    return undefined;
  }

  try {
    const payload = cvUploadTicketSchema.parse(
      JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")),
    );
    return payload.expiresAt > Date.now() ? payload : undefined;
  } catch {
    return undefined;
  }
}

/** True when the bytes really are a PDF or a Word .docx document. */
export function hasValidCvFileSignature(
  fileBytes: Uint8Array,
  contentType: AllowedCvFileType,
): boolean {
  if (contentType === "application/pdf") {
    // Every PDF starts with "%PDF-".
    return Buffer.from(fileBytes.subarray(0, 5)).toString("latin1") === "%PDF-";
  }
  // A .docx is a ZIP archive ("PK\x03\x04") containing a "word/" folder.
  const startsLikeZip =
    fileBytes[0] === 0x50 &&
    fileBytes[1] === 0x4b &&
    fileBytes[2] === 0x03 &&
    fileBytes[3] === 0x04;
  return startsLikeZip && Buffer.from(fileBytes).includes("word/");
}

export type VerifiedCv = { storagePath: string; fileSizeInBytes: number };

/**
 * Step 3: confirms the uploaded file exists, is within the size limit and is
 * genuinely a PDF or DOCX. Invalid files are deleted straight away.
 */
export async function verifyUploadedCv(
  storagePath: string,
): Promise<VerifiedCv | undefined> {
  const supabase = createSecretSupabaseClient();
  const { data: file, error } = await supabase.storage
    .from(cvUploadBucket)
    .download(storagePath);
  if (error || !file) return undefined;

  const fileBytes = new Uint8Array(await file.arrayBuffer());
  const isValid =
    fileBytes.length > 0 &&
    fileBytes.length <= maximumCvFileSizeInBytes &&
    hasValidCvFileSignature(fileBytes, contentTypeForCvFileName(storagePath));

  if (!isValid) {
    await supabase.storage.from(cvUploadBucket).remove([storagePath]);
    return undefined;
  }
  return { storagePath, fileSizeInBytes: fileBytes.length };
}
