import Link from "next/link";

import { Button } from "@/components/ui/button";
import { applyNowLink, requestServiceLink } from "@/config/navigation";

type CallToActionBandProps = {
  title?: string;
  description?: string;
};

/** Closing banner used at the bottom of most pages. */
export function CallToActionBand({
  title = "Ready to secure your business?",
  description = "Tell us about your site and we'll come back to you with a tailored security proposal, usually within one business day.",
}: CallToActionBandProps) {
  return (
    <section
      aria-labelledby="call-to-action-heading"
      className="bg-navy-950 security-pattern text-white"
    >
      <div className="page-container flex flex-col items-start gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div data-reveal="left" className="flex max-w-2xl flex-col gap-3">
          <h2
            id="call-to-action-heading"
            className="text-3xl font-bold uppercase sm:text-4xl"
          >
            {title}
          </h2>
          <p className="text-lg text-navy-100">{description}</p>
        </div>
        <div data-reveal="right" className="flex flex-wrap gap-4">
          <Button asChild variant="accent" size="xl">
            <Link href={requestServiceLink.href}>
              {requestServiceLink.label}
            </Link>
          </Button>
          <Button asChild variant="outlineOnDark" size="xl">
            <Link href={applyNowLink.href}>Join Our Team</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
