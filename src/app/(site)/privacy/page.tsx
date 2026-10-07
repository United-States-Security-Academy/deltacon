import Link from "next/link";

import { PageHeader } from "@/components/sections/page-header";
import { companyDetails } from "@/config/company-details";
import { createPageMetadata } from "@/lib/seo/page-metadata";
import { getPublicContactDetails } from "@/server/queries/site-settings";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description: `How ${companyDetails.name} collects, uses and protects personal information submitted through this website.`,
  path: "/privacy",
});

// TODO before launch: have this policy reviewed by a qualified lawyer and
// update the "Last updated" date whenever it changes.
const lastUpdated = "October 6, 2026";

export default async function PrivacyPolicyPage() {
  const contactDetails = await getPublicContactDetails();

  return (
    <>
      <PageHeader
        title="Privacy policy"
        introduction={<p>Last updated: {lastUpdated}</p>}
        breadcrumbs={[{ label: "Privacy Policy" }]}
      />

      <div className="section-spacing">
        <article className="page-container prose prose-lg max-w-3xl prose-headings:font-heading prose-headings:text-navy-900 prose-headings:uppercase prose-a:text-gold-700">
          <p>
            {companyDetails.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects
            your privacy. This policy explains what personal information we
            collect through this website, why we collect it, and how we keep it
            safe.
          </p>

          <h2>Information we collect</h2>
          <p>
            We only collect information you choose to send us through our forms:
          </p>
          <ul>
            <li>
              <strong>Service requests:</strong> your name, company, email,
              phone number, site location and details of the security you need.
            </li>
            <li>
              <strong>Job applications:</strong> your name, contact details,
              experience, availability, cover note and the CV you upload.
            </li>
            <li>
              <strong>Training enquiries:</strong> your name, contact details,
              the course you are interested in and number of trainees.
            </li>
          </ul>
          <p>
            To protect our forms from spam and abuse we also record a one-way
            (irreversible) hash of your IP address and your browser type. We use
            Cloudflare Turnstile to check that submissions come from a real
            person.
          </p>

          <h2>How we use your information</h2>
          <ul>
            <li>
              To respond to your enquiry and provide the services you ask about.
            </li>
            <li>To assess job applications and contact candidates.</li>
            <li>To arrange and deliver training.</li>
            <li>To prevent spam, fraud and abuse of this website.</li>
          </ul>
          <p>
            We do not sell your personal information and we do not use it for
            advertising.
          </p>

          <h2>How we protect it</h2>
          <p>
            Submissions are stored in a secure database that only authorised
            Deltacon staff can access. CVs are kept in private storage and can
            only be opened by our administrators through short-lived, secure
            links. All data is transmitted over encrypted (HTTPS) connections.
          </p>

          <h2>Service providers</h2>
          <p>
            We use trusted providers to run this website: Vercel (hosting),
            Supabase (database and file storage), Resend (email delivery) and
            Cloudflare (spam protection). They process data only on our
            instructions.
          </p>

          <h2>Cookies</h2>
          <p>
            This website does not use advertising or tracking cookies.
            Cloudflare Turnstile may set cookies that are strictly necessary for
            spam protection, and our staff area uses a secure sign-in cookie.
          </p>

          <h2>How long we keep it</h2>
          <p>
            We keep enquiries and applications only as long as needed for the
            purpose they were sent for, and for any period required by law.
            Unsuccessful job applications are deleted after 12 months.
          </p>

          <h2>Your rights</h2>
          <p>
            You can ask us for a copy of the personal information we hold about
            you, ask us to correct it, or ask us to delete it. To make a
            request, email{" "}
            <a href={`mailto:${contactDetails.email}`}>
              {contactDetails.email}
            </a>
            .
          </p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The latest version will
            always be on this page. Return to the{" "}
            <Link href="/">home page</Link>.
          </p>
        </article>
      </div>
    </>
  );
}
