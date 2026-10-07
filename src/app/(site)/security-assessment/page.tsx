import { SecurityAssessmentQuiz } from "@/components/assessment/security-assessment-quiz";
import { PageHeader } from "@/components/sections/page-header";
import { createPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = createPageMetadata({
  title: "How Secure Is Your Business? Free Self-Assessment",
  description:
    "Take our free 3-minute security self-assessment. Answer 12 quick questions about lighting, entry points, cameras, opening hours and past incidents to get a score and personalised recommendations.",
  path: "/security-assessment",
});

export default function SecurityAssessmentPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free self-assessment"
        title="How secure is your business?"
        introduction="A short, friendly check-up of your site's security. Get your score and personalised recommendations in about three minutes."
        breadcrumbs={[{ label: "Security Self-Assessment" }]}
      />
      <div className="bg-paper section-spacing">
        <div className="page-container">
          <SecurityAssessmentQuiz />
        </div>
      </div>
    </>
  );
}
