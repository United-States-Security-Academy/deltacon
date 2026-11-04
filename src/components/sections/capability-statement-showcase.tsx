import {
  BadgeCheck,
  Check,
  Download,
  ExternalLink,
  FileText,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  businessCredentials,
  capabilityStatementFileSize,
  capabilityStatementPath,
  governmentContactEmail,
} from "@/config/government-contracting";

/** Capabilities shown in the preview's matrix (as on the PDF). */
const previewCapabilities = [
  "Armed Security",
  "Unarmed Security",
  "Firewatch Services",
  "Executive Protection",
  "Patrol Services",
  "Event Security",
  "Emergency Response",
  "Temporary Staffing",
  "Custodial Services",
  "Security Training",
  "Risk Assessments",
  "Government Contract Staffing",
];

/**
 * A miniature of the capability statement's first page, drawn in HTML from
 * the same facts as the page (so it stays readable and accessible). It is a
 * picture of the document, so its text is hidden from screen readers; the
 * link around it says what it opens.
 */
function CapabilityStatementPreview() {
  const identifiers = businessCredentials.companyInformation.filter((item) =>
    ["Unique Entity ID — UEI", "CAGE Code"].includes(item.label),
  );
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none flex aspect-[8.5/11] w-full flex-col overflow-hidden rounded-md bg-white text-[0.55rem] leading-tight text-charcoal shadow-2xl ring-1 ring-black/10 select-none sm:text-[0.6rem]"
    >
      <div className="flex flex-col gap-0.5 bg-navy-900 px-4 py-3 text-white">
        <span className="text-[0.45rem] font-semibold tracking-[0.2em] text-gold-300 uppercase">
          Government &amp; critical infrastructure protective services
        </span>
        <span className="font-heading text-base leading-none font-bold sm:text-lg">
          DELTACON GLOBAL INC.
        </span>
        <span>Capability Statement</span>
      </div>
      <div className="grid flex-1 grid-cols-[38%_1fr]">
        <div className="flex flex-col gap-2 bg-[#2f3338] p-3 text-white">
          <span className="font-semibold tracking-wider text-gold-300 uppercase">
            Certifications
          </span>
          {businessCredentials.certifications.map((certification) => (
            <span key={certification.abbreviation} className="flex gap-1">
              <BadgeCheck className="size-2.5 shrink-0 text-gold-300" />
              {certification.abbreviation}
            </span>
          ))}
          <span className="mt-1 font-semibold tracking-wider text-gold-300 uppercase">
            Company information
          </span>
          {identifiers.map((identifier) => (
            <span key={identifier.label} className="flex flex-col">
              <span className="text-[0.45rem] text-navy-200 uppercase">
                {identifier.label.replace("Unique Entity ID — ", "")}
              </span>
              <span className="font-bold">{identifier.value}</span>
            </span>
          ))}
          <span className="mt-1 font-semibold tracking-wider text-gold-300 uppercase">
            NAICS
          </span>
          {businessCredentials.naicsCodes.map((naics) => (
            <span key={naics.code} className="font-bold">
              {naics.code}
            </span>
          ))}
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className="border-b border-navy-200 pb-0.5 font-bold tracking-wider text-navy-900 uppercase">
            Who we are
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="h-1 rounded bg-navy-100" />
            <span className="h-1 rounded bg-navy-100" />
            <span className="h-1 w-3/4 rounded bg-navy-100" />
          </span>
          <span className="border-b border-navy-200 pb-0.5 font-bold tracking-wider text-navy-900 uppercase">
            Capability matrix
          </span>
          <span className="grid grid-cols-1 gap-0.5">
            {previewCapabilities.map((capability) => (
              <span
                key={capability}
                className="flex items-center justify-between gap-1 rounded-sm bg-navy-100/60 px-1 py-px"
              >
                {capability}
                <Check className="size-2.5 shrink-0 text-navy-700" />
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className="bg-navy-900 px-3 py-1.5 text-center text-[0.45rem] text-gold-300 italic">
        Reliable. Responsive. Mission Ready.
      </div>
    </div>
  );
}

/**
 * The capability statement at the bottom of the government contracting page:
 * a preview of the document that opens the PDF, with view and download
 * buttons. Without a PDF, visitors can request one by email.
 */
export function CapabilityStatementShowcase() {
  const requestLink = `mailto:${governmentContactEmail}?subject=${encodeURIComponent("Capability Statement Request")}`;

  return (
    <section
      aria-labelledby="capability-statement-heading"
      className="relative isolate overflow-hidden bg-paper section-spacing"
    >
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-[radial-gradient(ellipse_at_center,rgb(201_164_76/0.18),transparent_70%)] lg:block"
      />
      <div className="page-container grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="flex flex-col items-start gap-5">
          <p className="flex items-center gap-2 font-heading text-sm font-semibold tracking-[0.3em] text-gold-700 uppercase">
            <FileText aria-hidden="true" className="size-4" />
            For contracting officers
          </p>
          <h2
            id="capability-statement-heading"
            className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl"
          >
            Our Capability Statement
          </h2>
          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Everything a procurement team needs on one page: certifications, UEI
            and CAGE code, NAICS codes, core capabilities, emergency
            mobilization, training academies and government contract experience.
          </p>
          <ul className="flex flex-wrap gap-2">
            {businessCredentials.certifications.map((certification) => (
              <li
                key={certification.abbreviation}
                className="rounded-full border border-navy-200 bg-white px-3 py-1 text-sm font-semibold text-navy-800"
              >
                {certification.abbreviation}
              </li>
            ))}
          </ul>
          {capabilityStatementPath ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button asChild variant="accent" size="xl">
                <a
                  href={capabilityStatementPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink aria-hidden="true" />
                  View capability statement
                  <span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="xl">
                <a
                  href={capabilityStatementPath}
                  download="Deltacon-Capability-Statement.pdf"
                >
                  <Download aria-hidden="true" />
                  Download PDF
                  <span className="text-sm font-normal text-muted-foreground">
                    ({capabilityStatementFileSize})
                  </span>
                </a>
              </Button>
            </div>
          ) : (
            <Button asChild variant="accent" size="xl">
              <a href={requestLink}>
                <Mail aria-hidden="true" />
                Request our capability statement
              </a>
            </Button>
          )}
        </div>

        {capabilityStatementPath ? (
          <a
            href={capabilityStatementPath}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mx-auto block w-full max-w-sm rounded-md focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
          >
            <span className="sr-only">
              Open the Deltacon Global Inc. capability statement (PDF, opens in
              a new tab)
            </span>
            {/* A second sheet behind the preview, like a stack of paper. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 translate-x-3 translate-y-3 rotate-2 rounded-md bg-navy-900/80 shadow-lg transition-transform group-hover:translate-x-4 group-hover:translate-y-4 motion-reduce:transition-none"
            />
            <span className="relative block -rotate-1 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-0 motion-reduce:transition-none">
              <CapabilityStatementPreview />
              <span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center rounded-md bg-navy-950/0 opacity-0 transition-[opacity,background-color] group-hover:bg-navy-950/45 group-hover:opacity-100 motion-reduce:transition-none"
              >
                <span className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 font-semibold text-navy-950 shadow-lg">
                  <ExternalLink className="size-4" />
                  View PDF
                </span>
              </span>
            </span>
          </a>
        ) : (
          <div className="mx-auto w-full max-w-sm opacity-60">
            <CapabilityStatementPreview />
          </div>
        )}
      </div>
    </section>
  );
}
