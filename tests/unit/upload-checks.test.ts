import { createHmac } from "node:crypto";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import {
  readGalleryImage,
  UnreadableImageError,
} from "@/server/gallery/read-gallery-image";
import {
  contentTypeForCvFileName,
  hasValidCvFileSignature,
  readCvUploadTicket,
} from "@/server/submissions/cv-upload";
import { hashIpAddress } from "@/server/submissions/request-details";

/** Builds a CV upload ticket the same way the server does, with the test secret. */
function makeTicket(payload: object, secret = process.env.IP_HASH_SECRET!) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = createHmac("sha256", secret)
    .update(`cv-upload-ticket:${encodedPayload}`)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

const ticketContents = {
  storagePath: "applications/2026-10/3f2b8c1a-9d4e-4f6a-8b2c-1d3e5f7a9b0c.pdf",
  originalFileName: "resume.pdf",
};

describe("CV upload tickets", () => {
  it("accepts a genuine ticket that hasn't expired", () => {
    const ticket = makeTicket({
      ...ticketContents,
      expiresAt: Date.now() + 60_000,
    });
    expect(readCvUploadTicket(ticket)).toMatchObject(ticketContents);
  });

  it("refuses an expired ticket", () => {
    const ticket = makeTicket({ ...ticketContents, expiresAt: Date.now() - 1 });
    expect(readCvUploadTicket(ticket)).toBeUndefined();
  });

  it("refuses a ticket signed with another key", () => {
    const ticket = makeTicket(
      { ...ticketContents, expiresAt: Date.now() + 60_000 },
      "someone-elses-secret-that-is-long-enough",
    );
    expect(readCvUploadTicket(ticket)).toBeUndefined();
  });

  it("refuses a ticket whose contents were changed", () => {
    const ticket = makeTicket({
      ...ticketContents,
      expiresAt: Date.now() + 60_000,
    });
    const [, signature] = ticket.split(".");
    const changedPayload = Buffer.from(
      JSON.stringify({
        ...ticketContents,
        storagePath: "applications/someone-elses-cv.pdf",
        expiresAt: Date.now() + 60_000,
      }),
    ).toString("base64url");
    expect(
      readCvUploadTicket(`${changedPayload}.${signature}`),
    ).toBeUndefined();
  });

  it.each(["", "not-a-ticket", "a.b.c", "."])(
    "refuses the ticket %j",
    (ticket) => {
      expect(readCvUploadTicket(ticket)).toBeUndefined();
    },
  );
});

describe("CV file contents", () => {
  const encode = (text: string) => new TextEncoder().encode(text);
  const wordDocumentType =
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  it("recognises real PDF and Word files", () => {
    expect(
      hasValidCvFileSignature(encode("%PDF-1.7\n..."), "application/pdf"),
    ).toBe(true);
    const docx = new Uint8Array([
      0x50,
      0x4b,
      0x03,
      0x04,
      ...encode("....word/document.xml"),
    ]);
    expect(hasValidCvFileSignature(docx, wordDocumentType)).toBe(true);
  });

  it("rejects files that only have a CV-like name", () => {
    expect(
      hasValidCvFileSignature(
        encode("<html><script>alert(1)</script>"),
        "application/pdf",
      ),
    ).toBe(false);
    const plainZip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0, 0]);
    expect(hasValidCvFileSignature(plainZip, wordDocumentType)).toBe(false);
  });

  it("works out the file type from the name", () => {
    expect(contentTypeForCvFileName("CV.PDF")).toBe("application/pdf");
    expect(contentTypeForCvFileName("cv.docx")).toBe(wordDocumentType);
  });
});

describe("visitor IP addresses", () => {
  it("are stored only as a keyed one-way hash", () => {
    const hash = hashIpAddress("203.0.113.7");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain("203.0.113.7");
    expect(hashIpAddress("203.0.113.7")).toBe(hash);
    expect(hashIpAddress("203.0.113.8")).not.toBe(hash);
  });
});

describe("gallery photo checks", () => {
  async function makeJpeg(width: number, height: number, orientation?: number) {
    const image = sharp({
      create: { width, height, channels: 3, background: "#10213a" },
    }).jpeg();
    const bytes = await (
      orientation ? image.withMetadata({ orientation }) : image
    ).toBuffer();
    return new Uint8Array(bytes).buffer;
  }

  it("measures a photo and makes a tiny blurred preview", async () => {
    const facts = await readGalleryImage(await makeJpeg(1200, 800));
    expect(facts.widthInPixels).toBe(1200);
    expect(facts.heightInPixels).toBe(800);
    expect(facts.blurPlaceholder).toMatch(/^data:image\/webp;base64,/);
    expect(facts.blurPlaceholder.length).toBeLessThan(1000);
  });

  it("measures a phone photo taken sideways the right way up", async () => {
    const facts = await readGalleryImage(await makeJpeg(900, 600, 6));
    expect([facts.widthInPixels, facts.heightInPixels]).toEqual([600, 900]);
  });

  it("refuses a file that isn't an image", async () => {
    const notAnImage = new TextEncoder().encode("<svg onload=alert(1)>");
    await expect(
      readGalleryImage(new Uint8Array(notAnImage).buffer),
    ).rejects.toBeInstanceOf(UnreadableImageError);
  });

  it("refuses an enormous image designed to exhaust memory", async () => {
    const enormous = await sharp({
      create: { width: 10_000, height: 9_000, channels: 3, background: "#000" },
    })
      .png({ compressionLevel: 9 })
      .toBuffer();
    await expect(
      readGalleryImage(new Uint8Array(enormous).buffer),
    ).rejects.toBeInstanceOf(UnreadableImageError);
  });
});
