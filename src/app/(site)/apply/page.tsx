import { JobApplicationForm } from "@/components/forms/job-application-form";
import { PageHeader } from "@/components/sections/page-header";
import { WhatHappensNext } from "@/components/sections/what-happens-next";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "Careers – Apply Now",
  description:
    "Join Deltacon Security. Apply for security officer, patrol, event security, supervisor and protection roles across Texas.",
  path: "/apply",
});

const nextSteps = [
  {
    title: "Application review",
    description:
      "Our recruitment team reviews your experience, licences and availability.",
  },
  {
    title: "Interview",
    description:
      "Shortlisted candidates are invited to a phone or in-person interview.",
  },
  {
    title: "Checks & onboarding",
    description:
      "Background checks, licence verification and site-specific training before your first shift.",
  },
];

export default function ApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title="Join our team"
        introduction="We're always looking for reliable, professional people who take pride in keeping others safe. Apply below and attach your CV."
        breadcrumbs={[{ label: "Apply Now" }]}
      />

      <div className="bg-paper section-spacing">
        <div className="page-container grid items-start gap-10 lg:grid-cols-[2fr_1fr]">
          <section
            aria-labelledby="job-application-form-heading"
            className="rounded-lg bg-white p-6 shadow-sm sm:p-8"
          >
            <h2
              id="job-application-form-heading"
              className="mb-6 text-2xl font-bold text-navy-900 uppercase"
            >
              Your application
            </h2>
            <JobApplicationForm />
          </section>
          <WhatHappensNext steps={nextSteps} />
        </div>
      </div>
    </>
  );
}
