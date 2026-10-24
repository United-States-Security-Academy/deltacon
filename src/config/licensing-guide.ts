import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  ClipboardList,
  CreditCard,
  FileUp,
  Fingerprint,
  GraduationCap,
  MonitorSmartphone,
  Route,
  Shield,
  Target,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

/*
 * Content of the "Pathway to Security Guard Licensing in Texas" guide at
 * /guide, from the client's document (PATHWAY TO SECURITY GUARD LICENSING IN
 * TEXAS ALL.docx, updated October 23, 2026). Edit the wording here.
 */

/** A piece of text: plain, bold, or a link. */
export type GuideTextPart =
  string | { text: string; isBold?: boolean; href?: string };

/** A sentence or paragraph made of text parts. */
export type GuideRichText = GuideTextPart[];

export type GuideBlock =
  | { kind: "paragraph"; text: GuideRichText }
  | { kind: "bulletList"; items: GuideRichText[] }
  | { kind: "numberedList"; items: GuideRichText[] }
  /** A list the reader can tick off as they go. */
  | { kind: "checklist"; items: GuideRichText[] }
  | {
      kind: "callout";
      tone: "important" | "warning";
      title: string;
      text: GuideRichText;
    }
  | { kind: "pathwayCards" };

export type GuideStep = {
  /** Used in the page address (#step-…) and element ids. */
  id: string;
  title: string;
  /** Short label for the progress list. */
  shortTitle: string;
  icon: LucideIcon;
  /** An optional figure to remember for this step, e.g. "90 days". */
  keyFact?: { figure: string; label: string };
  blocks: GuideBlock[];
};

export const dpsLinks = {
  trainingRequirements:
    "https://www.dps.texas.gov/section/private-security/training-and-continuing-education",
  eligibilityFaq:
    "https://www.dps.texas.gov/section/private-security/faq/eligibilitycompliance-questions",
  topsLicenseSearch:
    "https://tops.portal.texas.gov/psp-self-service/search/index",
  tops: "https://tops.portal.texas.gov/",
  applicationInstructions:
    "https://www.dps.texas.gov/section/private-security/application-instructions-and-examples",
  identogo: "https://www.identogo.com/",
  fingerprintingInstructions:
    "https://www.dps.texas.gov/section/private-security/fingerprinting-instructions",
  workingPriorToLicensure:
    "https://www.dps.texas.gov/section/private-security/working-prior-licensure",
  individualLicensingFaq:
    "https://www.dps.texas.gov/section/private-security/faq/individual-license-questions",
  occupationsCodeChapter1702:
    "https://tcss.legis.texas.gov/resources/oc/htm/oc.1702.htm",
  contactForm: "https://www.dps.texas.gov/apps/rsd/contact/Contact?sProgram=PS",
  privateSecurityProgram:
    "https://www.dps.texas.gov/section/private-security/private-security",
};

export const licensingGuide = {
  title: "Pathway to security guard licensing in Texas",
  subtitle:
    "A step-by-step guide for aspiring unarmed security officers, armed security officers, and personal protection officers",
  updatedOn: "October 23, 2026",
  introduction: [
    [
      "A career in private security begins with understanding the Texas licensing process. The ",
      {
        text: "Texas Department of Public Safety (DPS), Regulatory Services Division, Private Security Program",
        isBold: true,
      },
      " regulates the profession and processes applications through ",
      { text: "Texas Online Private Security (TOPS)", isBold: true },
      ".",
    ],
    [
      "Your pathway depends on the work you intend to perform. Completing a training course is an important step, but DPS determines whether you qualify for a license.",
    ],
  ] satisfies GuideRichText[],
};

/** The three career pathways compared in step 1. */
export const careerPathways = [
  {
    level: "Level II",
    name: "Noncommissioned security officer",
    commonName: "Unarmed security",
    requiredTraining: "Level II training and examination",
    intendedDuties: "Unarmed security duties",
  },
  {
    level: "Level III",
    name: "Commissioned security officer",
    commonName: "Armed security",
    requiredTraining:
      "Level II plus Level III training; Level III includes at least 45 hours and firearms qualification",
    intendedDuties:
      "Armed security duties within the authority of a DPS-issued commission",
  },
  {
    level: "Level IV",
    name: "Personal protection officer",
    commonName: "PPO",
    requiredTraining:
      "Level II, Level III, and at least 15 hours of Level IV training",
    intendedDuties: "Armed personal protection and bodyguard duties",
  },
];

export const licensingGuideSteps: GuideStep[] = [
  {
    id: "choose-your-pathway",
    title: "Choose the right security officer pathway",
    shortTitle: "Choose your pathway",
    icon: Route,
    blocks: [
      { kind: "pathwayCards" },
      {
        kind: "paragraph",
        text: [
          "Level II training is the starting point for all three pathways, subject to applicable exemptions. Level IV builds on the Level III requirements. Review the ",
          {
            text: "DPS training requirements",
            href: dpsLinks.trainingRequirements,
          },
          " before enrolling.",
        ],
      },
    ],
  },
  {
    id: "review-your-eligibility",
    title: "Review your eligibility before paying for training",
    shortTitle: "Check your eligibility",
    icon: UserCheck,
    blocks: [
      {
        kind: "paragraph",
        text: [
          "Applicants must meet the qualifications for their selected license. These include applicable age requirements, criminal history standards, and other statutory and regulatory conditions.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "The principal eligibility provisions include ",
          {
            text: "Texas Occupations Code §§1702.113 and 1702.229",
            isBold: true,
          },
          ". Armed security applicants must also satisfy ",
          { text: "§1702.163", isBold: true },
          ", while personal protection applicants have additional requirements under ",
          { text: "§1702.204", isBold: true },
          ".",
        ],
      },
      {
        kind: "callout",
        tone: "important",
        title: "Answer every question accurately",
        text: [
          "If you have an arrest, pending charge, conviction, deferred adjudication, or another potential eligibility concern, consult DPS before assuming that you qualify or are disqualified.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Start with the official ",
          {
            text: "DPS Eligibility and Compliance FAQ",
            href: dpsLinks.eligibilityFaq,
          },
          ".",
        ],
      },
    ],
  },
  {
    id: "complete-your-training",
    title: "Complete the required training and retain your certificates",
    shortTitle: "Complete your training",
    icon: GraduationCap,
    keyFact: {
      figure: "90 days",
      label:
        "Armed applicants must complete the firearms proficiency demonstration within 90 days of the application date.",
    },
    blocks: [
      {
        kind: "paragraph",
        text: [
          "Choose a provider authorized to deliver your required training. Use the ",
          { text: "TOPS license search", href: dpsLinks.topsLicenseSearch },
          " to check school and instructor credentials.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Pass the required examinations and save clear copies of your completion certificates. Armed applicants must complete the required practical training and firearms qualification. DPS states that the firearms proficiency demonstration must be completed within ",
          { text: "90 days of the application date", isBold: true },
          ".",
        ],
      },
      {
        kind: "callout",
        tone: "important",
        title: "Armed and PPO applicants",
        text: [
          {
            text: "Commissioned security officer and PPO applicants must also submit the required Declaration of Psychological and Emotional Health.",
            isBold: true,
          },
          " Arrange the required psychological assessment with a qualified provider and use the current DPS form.",
        ],
      },
    ],
  },
  {
    id: "gather-your-documents",
    title: "Gather your application information and supporting documents",
    shortTitle: "Gather your documents",
    icon: ClipboardList,
    blocks: [
      {
        kind: "paragraph",
        text: [
          "Prepare the following before opening your application. Tick each item off as you collect it:",
        ],
      },
      {
        kind: "checklist",
        items: [
          [
            "Your legal name, date of birth, identification information, and current contact details.",
          ],
          ["An email address you check regularly."],
          ["Your training certificates."],
          [
            "Your employer’s company license information, if you already have an employer.",
          ],
          [
            "Required psychological documentation for an armed or PPO application.",
          ],
          ["Any court records or other documents requested by DPS."],
          [
            "Evidence of citizenship or qualifying immigration status required by the current application checklist.",
          ],
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Important 2026 update",
        text: [
          "Amendments to the private security licensing rules, effective July 2, 2026, added documentation requirements concerning eligibility for a state-issued professional license under federal law. Follow the current TOPS checklist for the acceptable evidence applicable to you.",
        ],
      },
    ],
  },
  {
    id: "apply-through-tops",
    title: "Start your application through TOPS",
    shortTitle: "Apply through TOPS",
    icon: MonitorSmartphone,
    blocks: [
      {
        kind: "paragraph",
        text: [
          "Visit ",
          {
            text: "Texas Online Private Security — TOPS",
            href: dpsLinks.tops,
            isBold: true,
          },
          " and follow the prompts for an individual application.",
        ],
      },
      {
        kind: "numberedList",
        items: [
          ["Access or establish your TOPS profile."],
          ["Select the appropriate individual license type."],
          ["Enter your personal and contact information."],
          ["Supply employment information if applicable."],
          ["Answer the eligibility questions fully and accurately."],
          ["Review your application before submitting it."],
        ],
      },
      {
        kind: "paragraph",
        text: [
          "If you previously held a Texas private security credential, check whether you already have a profile. Use the account recovery options when needed. The ",
          {
            text: "DPS application instructions and examples",
            href: dpsLinks.applicationInstructions,
          },
          " provide additional assistance.",
        ],
      },
    ],
  },
  {
    id: "pay-and-review-your-checklist",
    title: "Submit payment and review your personalized checklist",
    shortTitle: "Pay and review your checklist",
    icon: CreditCard,
    blocks: [
      {
        kind: "paragraph",
        text: [
          "Pay the fees displayed for your selected application. Where available, an affiliated employer may pay through the TOPS employer-payment option.",
        ],
      },
      {
        kind: "callout",
        tone: "important",
        title: "Budget for every cost",
        text: [
          "Budget separately for training, state application charges, fingerprinting, and any required psychological assessment. Ask your training provider which expenses its tuition includes.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "After submitting a paid application, review the personalized checklist sent by DPS. Use that checklist to identify outstanding requirements.",
        ],
      },
    ],
  },
  {
    id: "get-fingerprinted",
    title: "Complete the required fingerprint appointment",
    shortTitle: "Get fingerprinted",
    icon: Fingerprint,
    blocks: [
      {
        kind: "paragraph",
        text: [
          "New applicants generally must submit electronic fingerprints through ",
          { text: "IdentoGO", isBold: true },
          ", unless eligible for the alternative fingerprint process. The DPS instructions direct applicants to:",
        ],
      },
      {
        kind: "numberedList",
        items: [
          ["Submit their application and payment through TOPS."],
          [
            "Watch for the IdentoGO scheduling email, including in the spam or junk folder.",
          ],
          [
            "Follow the email’s link and enter the requested identifying information.",
          ],
          ["Select an enrollment center and appointment."],
          ["Bring the required identification to the appointment."],
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Use the instructions associated with your private security application so the fingerprints are routed correctly.",
        ],
      },
      {
        kind: "callout",
        tone: "important",
        title: "Fingerprinting assistance",
        text: [
          { text: "IdentoGO", href: dpsLinks.identogo },
          " or ",
          { text: "888-467-2080", href: "tel:+18884672080", isBold: true },
          ". See the complete ",
          {
            text: "DPS fingerprinting instructions",
            href: dpsLinks.fingerprintingInstructions,
          },
          ".",
        ],
      },
    ],
  },
  {
    id: "upload-documents-and-monitor",
    title: "Upload outstanding documents and monitor your application",
    shortTitle: "Upload documents and follow up",
    icon: FileUp,
    blocks: [
      {
        kind: "paragraph",
        text: [
          "In TOPS, open your pending application and select ",
          { text: "“Checklist/Upload Docs.”", isBold: true },
          " Upload each requested document separately and classify it correctly.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Check your email and TOPS account regularly. Respond promptly if DPS requests a clearer certificate, additional identification, court records, or other supporting information.",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "Approval isn’t automatic",
        text: ["Submitting an application does not guarantee approval."],
      },
    ],
  },
  {
    id: "complete-employer-affiliation",
    title: "Complete your employer affiliation",
    shortTitle: "Affiliate with an employer",
    icon: Building2,
    keyFact: {
      figure: "2 years",
      label:
        "A license that stays unaffiliated for two years can't be renewed; you would have to reapply.",
    },
    blocks: [
      {
        kind: "paragraph",
        text: [
          "You can begin the application process without being affiliated with a licensed company. However, DPS explains that an unaffiliated applicant will not receive a pocket card until company affiliation is completed.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Once hired, coordinate with your employer to complete the TOPS affiliation and employment-verification process. DPS also states that a license that remains unaffiliated for two years cannot be renewed; the individual must reapply.",
        ],
      },
      {
        kind: "callout",
        tone: "important",
        title: "Good to know",
        text: [
          "An individual officer credential does not authorize you to operate your own security guard company.",
        ],
      },
    ],
  },
  {
    id: "confirm-authorization",
    title: "Confirm that you are authorized before beginning work",
    shortTitle: "Confirm you can start work",
    icon: BadgeCheck,
    keyFact: {
      figure: "48 hours",
      label:
        "After a substantially complete application (including payment and electronic fingerprints), the employer checks described below may apply.",
    },
    blocks: [
      {
        kind: "paragraph",
        text: [
          {
            text: "A training certificate alone does not authorize you to begin every type of security assignment.",
            isBold: true,
          },
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Texas permits certain applicants to work in an ",
          { text: "unarmed capacity", isBold: true },
          " while an application is pending, but only when the applicable application, background-check, and employer requirements are satisfied.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "DPS explains that if 48 hours have passed after submission of a substantially complete application—including payment and electronic fingerprints—and the required notice or status is unavailable, the employer must conduct the specified DPS criminal history and sex offender database checks and confirm eligibility. Different background-check provisions apply when DPS has already provided the qualifying status.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Your employer should verify compliance with the official ",
          {
            text: "DPS Working Prior to Licensure guidance",
            href: dpsLinks.workingPriorToLicensure,
          },
          ".",
        ],
      },
      {
        kind: "callout",
        tone: "warning",
        title: "No armed work before licensure",
        text: [
          "These pending-application provisions do not permit armed work before licensure.",
        ],
      },
    ],
  },
  {
    id: "maintain-and-renew",
    title: "Maintain your license and plan for renewal",
    shortTitle: "Maintain and renew",
    icon: CalendarClock,
    keyFact: {
      figure: "2 years",
      label: "A first individual license expires two years after issuance.",
    },
    blocks: [
      {
        kind: "paragraph",
        text: [
          "Keep your contact information current, retain your training records, and monitor the expiration date on your credential.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "DPS states that a first individual license expires two years after issuance. Subsequent credentials may align with an existing expiration date. Armed officers must also satisfy applicable continuing education and firearms requalification requirements before renewal.",
        ],
      },
      {
        kind: "paragraph",
        text: [
          "Set reminders well before expiration and review the ",
          {
            text: "DPS individual licensing FAQ",
            href: dpsLinks.individualLicensingFaq,
          },
          " when preparing to renew.",
        ],
      },
    ],
  },
];

/** "Which Texas laws govern the process?" */
export const governingLaws = {
  introduction: [
    "The primary law is the ",
    {
      text: "Texas Private Security Act, Texas Occupations Code Chapter 1702",
      isBold: true,
    },
    ". DPS implements the Act through ",
    { text: "Title 37, Texas Administrative Code, Chapter 35", isBold: true },
    ".",
  ] satisfies GuideRichText,
  provisions: [
    {
      provision: "Occupations Code §1702.221",
      subject: "Individual licensing and employment requirements",
    },
    {
      provision: "Occupations Code §1702.229",
      subject: "Qualifications for an individual license",
    },
    {
      provision: "Occupations Code §1702.163",
      subject: "Qualifications for a security officer commission",
    },
    {
      provision: "Occupations Code §1702.204",
      subject: "Personal protection officer qualifications",
    },
    {
      provision: "Occupations Code §1702.230",
      subject: "Employment before an individual license is issued",
    },
    { provision: "37 TAC §35.21", subject: "Application requirements" },
    { provision: "37 TAC §35.141", subject: "Training requirements" },
    {
      provision: "37 TAC §35.161",
      subject: "Continuing education requirements",
    },
  ],
  furtherReading: [
    "Read the official ",
    {
      text: "Texas Occupations Code Chapter 1702",
      href: dpsLinks.occupationsCodeChapter1702,
    },
    ". Links to the applicable administrative rules are also available through the ",
    { text: "DPS training page", href: dpsLinks.trainingRequirements },
    " and ",
    {
      text: "DPS pending-application employment guidance",
      href: dpsLinks.workingPriorToLicensure,
    },
    ".",
  ] satisfies GuideRichText,
};

/** Texas DPS Private Security licensing contacts. */
export const dpsContacts = {
  organisation: "Texas Department of Public Safety",
  division: "Regulatory Services Division — Private Security Program",
  items: [
    {
      label: "Licensing assistance",
      value: [{ text: "512-424-7293", href: "tel:+15124247293" }],
    },
    {
      label: "Contact Center hours",
      value: ["Monday–Friday, 7 a.m.–6 p.m. Central Time"],
    },
    {
      label: "Online inquiries",
      value: [
        {
          text: "DPS Private Security Contact Form",
          href: dpsLinks.contactForm,
        },
      ],
    },
    {
      label: "Program website",
      value: [
        {
          text: "Texas DPS Private Security",
          href: dpsLinks.privateSecurityProgram,
        },
      ],
    },
    {
      label: "Mail without payment",
      value: [
        "Private Security — MSC 0241, P.O. Box 4087, Austin, TX 78773-0001",
      ],
    },
  ] satisfies { label: string; value: GuideRichText }[],
  publishedEmail: [
    { text: "Published RSD email: ", isBold: true },
    {
      text: "RSD_Customer_Relations@dps.texas.gov",
      href: "mailto:RSD_Customer_Relations@dps.texas.gov",
    },
    ". This address appears on DPS-issued Private Security documentation. For individual application questions, use the current Private Security contact form above to route your inquiry to the appropriate staff.",
  ] satisfies GuideRichText,
};

export const licensingGuideClosing = {
  title: "Begin your security career with preparation",
  text: "Choose your career pathway, verify your eligibility, complete the required training, and follow your TOPS checklist carefully. Keep copies of every certificate and submission, and coordinate with your employer before accepting an assignment.",
  disclaimer:
    "This article provides general guidance. Licensing rules and application requirements can change; the current law, DPS instructions, and your personalized application checklist control.",
};

/*
 * One-page quick guides for each licence level, from the client's flyers
 * (Texas_Level_II/III/IV_…_Licensing_Flyer.pdf, October 23, 2026).
 */

export type LicensingQuickGuide = {
  /** Used for element ids. */
  id: string;
  level: string;
  title: string;
  /** Line under the title. */
  tagline: string;
  icon: LucideIcon;
  steps: { title: string; text: GuideRichText }[];
  /** The "Before your first shift" warning at the bottom of the flyer. */
  beforeStarting: { title: string; text: GuideRichText };
  /** Rules and sources named at the foot of the flyer. */
  sources: string;
  /** The printable flyer in /public, or null until a clean copy is supplied. */
  pdfPath: string | null;
  /** The matching course page on this site. */
  courseHref: string;
};

const psp13FormDetails =
  "https://www.dps.texas.gov/InternetForms/Home/Details/1904";
const psp13FormPdf = "https://www.dps.texas.gov/InternetForms/Forms/PSP-13.pdf";

export const licensingQuickGuides: LicensingQuickGuide[] = [
  {
    id: "level-ii",
    level: "Level II",
    title: "Unarmed security officer",
    tagline: "Noncommissioned security officer",
    icon: Shield,
    steps: [
      {
        title: "Complete Level II training",
        text: [
          "Complete the ",
          {
            text: "DPS-required Level II course",
            href: dpsLinks.trainingRequirements,
          },
          " and pass the examination through an authorized provider. Keep your training certificate.",
        ],
      },
      {
        title: "Apply online through TOPS",
        text: [
          "Visit ",
          { text: "tops.portal.texas.gov", href: dpsLinks.tops },
          ". Access or create your profile, select Noncommissioned Security Officer, answer all questions accurately, and submit payment.",
        ],
      },
      {
        title: "Schedule your fingerprints",
        text: [
          "After submitting your paid application, follow the ",
          {
            text: "IdentoGO email instructions",
            href: dpsLinks.fingerprintingInstructions,
          },
          ". Schedule your appointment and bring the required identification. Fingerprinting fees are separate.",
        ],
      },
      {
        title: "Finish your application checklist",
        text: [
          "Upload your Level II certificate and every document requested in TOPS, including identity or citizenship/immigration evidence as applicable. Monitor your email and application status.",
        ],
      },
      {
        title: "Complete employer affiliation",
        text: [
          "Coordinate with a DPS-licensed security company to confirm your employment in TOPS. You may apply before being hired, but company affiliation is needed to receive your pocket card.",
        ],
      },
      {
        title: "Verify approval & keep your license current",
        text: [
          "Confirm your license status with your employer before assignment. Save your pocket card and track its expiration date. A first individual license is generally valid for two years.",
        ],
      },
    ],
    beforeStarting: {
      title: "Before your first shift",
      text: [
        "A training certificate is not a DPS license. Pending-application work requires employer verification and specific background checks. ",
        {
          text: "Review DPS requirements",
          href: dpsLinks.workingPriorToLicensure,
        },
        ".",
      ],
    },
    sources: "Rules: 37 TAC §§35.21, 35.141. Current DPS requirements control.",
    pdfPath: "/guides/texas-level-ii-unarmed-licensing-quick-guide.pdf",
    courseHref: "/training/level-2-unarmed-officer",
  },
  {
    id: "level-iii",
    level: "Level III",
    title: "Armed security officer",
    tagline: "Commissioned security officer",
    icon: Target,
    steps: [
      {
        title: "Complete Level II + Level III training",
        text: [
          "Complete Level II and the ",
          {
            text: "45-hour minimum Level III course",
            href: dpsLinks.trainingRequirements,
          },
          " through licensed providers. Pass the required exams and practical/firearms qualification. Firearms proficiency must be within 90 days of application.",
        ],
      },
      {
        title: "Complete the psychological assessment",
        text: [
          "Arrange the required MMPI assessment with a qualified psychologist or psychiatrist. Obtain the signed ",
          {
            text: "Declaration of Psychological and Emotional Health (PSP-13)",
            href: psp13FormDetails,
          },
          " for your application.",
        ],
      },
      {
        title: "Apply through TOPS & pay the fees",
        text: [
          "Visit ",
          { text: "tops.portal.texas.gov", href: dpsLinks.tops },
          ". Access your profile, select Commissioned Security Officer, answer eligibility questions accurately, and submit payment. Check eligibility before paying for training.",
        ],
      },
      {
        title: "Complete fingerprints & upload documents",
        text: [
          "Follow the ",
          {
            text: "DPS/IdentoGO fingerprint instructions",
            href: dpsLinks.fingerprintingInstructions,
          },
          ". Upload Level II and III certificates, PSP-13, and all identity/status documents requested by TOPS. Existing applicants should follow their own checklist.",
        ],
      },
      {
        title: "Confirm your employer affiliation",
        text: [
          "Coordinate with a DPS-licensed security company to confirm employment in TOPS. Complete employer affiliation and resolve outstanding checklist items. Monitor your email and application status.",
        ],
      },
      {
        title: "Wait for DPS approval before armed work",
        text: [
          "Your training certificate and paid application do not authorize armed duty. Your employer must verify your issued commission and authorization before assigning armed work. Track your license expiration and renewal requirements.",
        ],
      },
    ],
    beforeStarting: {
      title: "Before your first shift",
      text: [
        { text: "No armed work before licensure.", isBold: true },
        " An LTC or permitless carry does not replace a security officer commission. ",
        {
          text: "Review DPS requirements",
          href: dpsLinks.workingPriorToLicensure,
        },
        ".",
      ],
    },
    sources:
      "Rules: 37 TAC §§35.21, 35.81, 35.141. Current DPS requirements control.",
    // The supplied flyer had a "DOWNLOAD THIS FLYER (PDF) - ChatGPT access
    // required." line with a private chatgpt.com link; this copy has that line
    // and link removed (2026-10-24). Everything else is unchanged.
    pdfPath: "/guides/texas-level-iii-armed-licensing-quick-guide.pdf",
    courseHref: "/training/level-3-armed-officer",
  },
  {
    id: "level-iv",
    level: "Level IV",
    title: "Personal protection officer",
    tagline: "Executive protection · From training to DPS licensure",
    icon: BriefcaseBusiness,
    steps: [
      {
        title: "Confirm eligibility and arrange employer affiliation",
        text: [
          "Be at least ",
          { text: "21", isBold: true },
          "; meet Texas DPS background and firearm-eligibility requirements. Be employed by a DPS-licensed guard or investigations company and arrange your TOPS employer affiliation.",
        ],
      },
      {
        title: "Complete Level II, Level III and Level IV training",
        text: [
          "Complete Level II and ",
          { text: "Level III (minimum 45 hours)", isBold: true },
          ", including the test and firearms qualification. Then complete ",
          { text: "Level IV (minimum 15 hours, in person)", isBold: true },
          " and pass its test through a licensed Level IV school/instructor. See the ",
          {
            text: "DPS training requirements",
            href: dpsLinks.trainingRequirements,
          },
          ".",
        ],
      },
      {
        title: "Complete the required psychological evaluation",
        text: [
          "Have the ",
          { text: "MMPI", isBold: true },
          " administered and interpreted by a licensed psychologist or psychiatrist. Obtain the signed ",
          { text: "PSP-13 psychological health form", href: psp13FormPdf },
          ". If already completed for your commission, confirm that DPS has an acceptable form on file.",
        ],
      },
      {
        title: "Submit your application through TOPS",
        text: [
          "Hold a valid security officer commission or apply for the commission with your PPO application. Use ",
          { text: "Texas Online Private Security (TOPS)", href: dpsLinks.tops },
          "; pay the applicable fees and submit Level II/III/IV certificates, PSP-13 and other checklist items. Coordinate employer approval/affiliation.",
        ],
      },
      {
        title: "Complete fingerprints and the DPS review",
        text: [
          "Follow your application checklist to schedule electronic fingerprints through the DPS-approved vendor, if required. Provide any requested ID, lawful-presence or court records. Monitor TOPS and promptly resolve missing items. See the ",
          {
            text: "DPS application instructions & FAQs",
            href: dpsLinks.individualLicensingFaq,
          },
          ".",
        ],
      },
    ],
    beforeStarting: {
      title: "Before your first PPO assignment",
      text: [
        "Wait for DPS issuance and have your commission and PPO pocket cards in hand. Keep both licenses active, carry both cards on duty, and work only through your affiliated licensed employer. ",
        {
          text: "A training certificate alone does not authorize PPO work.",
          isBold: true,
        },
      ],
    },
    sources:
      "Standard applicant pathway; certain peace-officer exemptions may apply. DPS determines eligibility. Sources: DPS training, individual licensing FAQs, PSP-13; Texas Occupations Code §§1702.204–205.",
    pdfPath: "/guides/texas-level-iv-ppo-licensing-quick-guide.pdf",
    courseHref: "/training/level-4-personal-protection-officer",
  },
];
