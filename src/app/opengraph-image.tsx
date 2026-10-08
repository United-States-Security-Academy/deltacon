import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { companyDetails } from "@/config/company-details";

/*
 * The picture shown when a page is shared on LinkedIn, Facebook, X or in a
 * messaging app. It's drawn once at build time from the badge and brand
 * colours. Blog posts with a cover image use their cover instead.
 */

export const alt = `${companyDetails.name}: ${companyDetails.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const badge = await readFile(
    join(process.cwd(), "public/brand/deltacon-badge-512.png"),
  );
  const badgeSource = `data:image/png;base64,${badge.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 88px",
        background: "linear-gradient(135deg, #050e1d 0%, #10213a 100%)",
        borderBottom: "12px solid #c9a44c",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse only supports <img> */}
      <img src={badgeSource} width={328} height={410} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            color: "#e3c77a",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          DELTACON
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: 10,
            lineHeight: 1,
          }}
        >
          SECURITY GROUP
        </div>
        <div
          style={{
            marginTop: 16,
            width: 120,
            height: 4,
            background: "#c9a44c",
          }}
        />
        <div style={{ fontSize: 30, color: "#d6dceb", maxWidth: 620 }}>
          {companyDetails.tagline}
        </div>
        <div style={{ fontSize: 26, color: "#c9a44c", fontStyle: "italic" }}>
          {companyDetails.slogan}
        </div>
      </div>
    </div>,
    size,
  );
}
