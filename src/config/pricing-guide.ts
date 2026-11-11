/*
 * Content of /security-guard-pricing: the full explanation of what goes into
 * an hourly security bill rate, shared by every location page (which each
 * keep only their local rate table and a short summary). Wording from
 * docs/locations/dallas-fort-worth.md and docs/locations/dfw-pricing.md
 * (the more detailed versions), with the Houston copy's section heading
 * "What Determines Your Security Guard Pricing?".
 */

export type CostCategory = {
  title: string;
  paragraphs?: string[];
  listIntroduction?: string;
  list?: string[];
};

export const pricingGuide = {
  eyebrow: "Security guard pricing",
  title: "Transparent Security Guard Pricing",
  introduction:
    "At Deltacon Security Group, we believe customers should understand what goes into the hourly cost of professional security services.",
  payingForTitle: "Understanding What You Are Paying For",
  payingForParagraphs: [
    "The hourly rate billed to a client is not simply the security officer's hourly wage.",
    "Providing a qualified, properly licensed, insured, equipped, and professionally managed security officer involves numerous direct and indirect expenses.",
    "Our billing structure accounts for the actual cost of maintaining a professional security operation, supporting employees, meeting regulatory requirements, and delivering dependable services.",
  ],
  factorsTitle: "What Determines Your Security Guard Pricing?",
  factorsIntroduction:
    "Actual pricing depends on the specific assignment and may be influenced by several factors, including:",
  factors: [
    "Number of security officers required.",
    "Assignment schedule and total coverage hours.",
    "Geographic location and site accessibility.",
    "Armed versus unarmed security requirements.",
    "Risk exposure and complexity of the assignment.",
    "Officer qualifications, licensing, and experience.",
    "Required uniforms, equipment, and vehicles.",
    "Supervisory and management requirements.",
    "Insurance and contractual requirements.",
    "Contract duration and total service hours.",
  ],
  factorsClosing: [
    "Night shifts, weekends, holidays, overtime requirements, emergency deployment, and specialized security assignments may also affect the final hourly billing rate.",
    "Specialized services, including Level IV personal protection, complex security operations, and assignments requiring additional qualifications or equipment, are evaluated individually.",
  ],
  includedTitle: "What Is Included in Our Hourly Bill Rate?",
  includedIntroduction: [
    "A professional security company must account for considerably more than the wages paid to an employee.",
    "Our hourly billing structure helps support the following expenses:",
  ],
  costCategories: [
    {
      title: "Employee Compensation and Employment-Related Costs",
      list: [
        "Employee hourly wages.",
        "Non-billed employee training.",
        "Non-billable vacation pay.",
        "Non-billable overtime expenses.",
        "Non-billable holiday premiums.",
        "Other non-billable employee costs, including continuing education and security guard license renewals.",
      ],
    },
    {
      title: "Payroll Taxes and Statutory Employment Expenses",
      list: [
        "Federal Insurance Contributions Act (FICA) taxes, including applicable employer Social Security and Medicare contributions.",
        "Federal Unemployment Insurance (FUI/FUTA).",
        "Texas Workforce Commission unemployment insurance contributions (Texas SUI/SUTA).",
        "Other applicable employer payroll obligations.",
      ],
    },
    {
      title: "Insurance and Employee Benefits",
      list: [
        "Workers' compensation insurance.",
        "General and professional liability insurance, as applicable.",
        "Medical benefits, where applicable.",
        "Other applicable employee benefit expenses.",
      ],
    },
    {
      title: "Uniforms, Equipment, and Employee Support",
      list: [
        "Professional security uniforms.",
        "Required equipment.",
        "Equipment maintenance and replacement.",
        "Training materials and supplies.",
        "Operational support resources.",
      ],
    },
    {
      title: "Regulatory and Contractual Compliance",
      list: [
        "Background investigations and employee screening.",
        "Security licensing and renewal expenses.",
        "Continuing education.",
        "Performance bonds, where required by contract.",
        "Applicable contractual compliance expenses.",
      ],
    },
    {
      title: "Local General and Administrative Expenses (Local G&A)",
      paragraphs: [
        "Local G&A refers to the general and administrative expenses associated with supporting security operations in the local service area.",
      ],
      listIntroduction: "These expenses may include:",
      list: [
        "Local supervision and management.",
        "Scheduling and staffing coordination.",
        "Field inspections.",
        "Client communications.",
        "Local operational support.",
        "Regional administrative expenses.",
      ],
    },
    {
      title: "Corporate General and Administrative Expenses (Corporate G&A)",
      paragraphs: [
        "Corporate G&A represents the centralized business expenses necessary to operate and maintain the company as a whole.",
      ],
      listIntroduction: "These expenses may include:",
      list: [
        "Executive and corporate management.",
        "Accounting and financial administration.",
        "Human resources.",
        "Payroll administration.",
        "Corporate insurance and compliance administration.",
        "Information technology and business systems.",
        "Contract administration.",
        "Company-wide operational infrastructure.",
      ],
    },
    {
      title: "Company Profit",
      paragraphs: [
        "Like any professionally managed business, Deltacon must maintain a reasonable profit to support continued operations, reinvest in training, maintain infrastructure, develop employees, and sustain long-term service capabilities.",
      ],
    },
  ] satisfies CostCategory[],
  whyItMattersTitle: "Why This Matters to Our Clients",
  whyItMattersParagraphs: [
    "A security provider offering an unusually low hourly rate may not necessarily be providing the same level of employee support, insurance protection, training, supervision, or operational infrastructure.",
    "We believe clients should evaluate the complete service being provided, not just the hourly number appearing on a proposal.",
    "Deltacon's approach is to provide competitive pricing while maintaining the resources necessary to deliver professional, dependable, and accountable security services.",
  ],
  objective:
    "Our objective is straightforward: provide properly supported security personnel, professional management, and transparent pricing that reflects the true cost of delivering quality security services.",
  proposalsTitle: "Customized Security Proposals",
  proposalsParagraphs: [
    "Deltacon Security Group provides customized written proposals based on each client's operational requirements.",
    "Our goal is to ensure prospective clients understand the proposed staffing, service responsibilities, coverage schedule, and associated costs before entering into a service agreement.",
    "We believe transparent pricing helps establish realistic expectations and creates stronger, longer-lasting client relationships.",
  ],
};
