/*
 * Content of the Government Contracting Solutions page (/government-
 * contracting), from the client's document "LANDING PAGE FOR - Government
 * Contracting Solutions" (2026-11-04). Edit the wording here.
 */

export const governmentContactEmail = "gov@deltacon1.com";

/**
 * The capability statement PDF in /public (supplied 2026-11-04 as
 * "Deltacon-Capability-Statement-Updated.pdf"). Set to null to hide it; the
 * buttons then ask for a copy by email instead.
 */
export const capabilityStatementPath: string | null =
  "/documents/deltacon-capability-statement.pdf";

/** Shown next to the download button. */
export const capabilityStatementFileSize = "86 KB";

export const governmentContracting = {
  eyebrow: "Government Contracting Solutions",
  title: "Government & Critical Infrastructure Protective Services",
  tagline: "Veteran-Owned Security, Staffing & Emergency Response Solutions",
  introduction: [
    "Deltacon Global Inc., doing business as Deltacon Security Group, provides professional security, workforce staffing, emergency response, security training, consulting, and custodial services for government agencies and organizations responsible for essential facilities and public services.",
    "Headquartered in Sugar Land, Texas, Deltacon combines veteran leadership, trained personnel, and practical operational support to help clients protect people, safeguard property, maintain continuity, and meet contract requirements. Our capabilities support federal, state, county, municipal, education, healthcare, commercial, industrial, and critical infrastructure environments.",
    "Whether an agency requires security officers at multiple facilities, temporary administrative personnel, emergency security coverage, or training for its workforce, Deltacon develops service solutions around the assignment’s scope, operating conditions, and performance expectations.",
  ],
  serviceArea: "Serving Texas",
  licensingFootprint:
    "Security Company Licensing in Texas, Florida & Louisiana",
};

export const missionFocusedPartner = {
  title: "A Mission-Focused Government Services Partner",
  paragraphs: [
    "Government facilities must remain accessible to the people they serve while maintaining appropriate protection, accountability, and operational readiness. Deltacon helps agencies balance these responsibilities through professional personnel, defined duties, responsive coordination, and services tailored to each location.",
    "We support recurring contracts, temporary assignments, special events, workforce shortages, emergency deployments, and operations involving multiple facilities. Our service portfolio allows procurement teams to evaluate related security, staffing, training, and facility support requirements through one company.",
  ],
  capabilitiesIntroduction: "Our government contracting capabilities include:",
  capabilities: [
    "Armed and unarmed security officer services.",
    "Mobile and foot patrol services.",
    "Executive and personal protection.",
    "Firewatch services.",
    "Event security.",
    "Emergency security response.",
    "Administrative, government, general labor, and skilled staffing.",
    "Private security training and compliance instruction.",
    "Threat and risk assessments.",
    "Security consulting and corporate security programs.",
    "Custodial, commercial cleaning, and facility support services.",
  ],
};

export type ServiceDescription = {
  title: string;
  paragraphs: string[];
  listIntroduction?: string;
  list?: string[];
  closing?: string;
};

export const protectiveServices: ServiceDescription[] = [
  {
    title: "Armed Security Officers",
    paragraphs: [
      "Deltacon provides licensed armed security personnel for assignments requiring an enhanced protective presence. Services are structured around the facility’s security requirements, public interaction, operating hours, and approved post orders.",
    ],
    listIntroduction:
      "Depending on the contract scope, officer responsibilities may include:",
    list: [
      "Protecting personnel, visitors, property, and designated assets.",
      "Monitoring entrances and controlling access.",
      "Conducting assigned foot patrols and security checks.",
      "Observing and reporting suspicious activity.",
      "Supporting facility rules and established security procedures.",
      "Responding to incidents within the officer’s training and authority.",
      "Coordinating with designated agency representatives and emergency responders.",
      "Preparing activity and incident reports.",
    ],
  },
  {
    title: "Unarmed Security Officers",
    paragraphs: [
      "Our unarmed security services support facilities that require a visible, professional security presence with an emphasis on observation, communication, access management, and customer service.",
      "Assignments may include reception and lobby security, visitor assistance, entrance monitoring, facility patrols, event support, and reporting of security or safety concerns.",
      "Deltacon aligns each assignment with the client’s operating environment, including public offices, educational facilities, healthcare settings, administrative buildings, and other designated locations.",
    ],
  },
  {
    title: "Patrol Services",
    paragraphs: [
      "Deltacon provides patrol services to help agencies monitor facilities, grounds, parking areas, and designated property boundaries.",
    ],
    listIntroduction: "Patrol assignments can support:",
    list: [
      "Exterior and interior security checks.",
      "Parking area observation.",
      "Identification and reporting of unsecured doors or access points.",
      "Observation of suspicious activity and visible property damage.",
      "Reporting of lighting failures, safety hazards, and other unusual conditions.",
      "Scheduled or intermittent coverage based on contract requirements.",
    ],
    closing:
      "Patrol routes, frequency, reporting expectations, and escalation procedures are established for the assignment.",
  },
  {
    title: "Executive & Personal Protection",
    paragraphs: [
      "Deltacon provides executive and personal protection services for assignments requiring dedicated protective personnel. Services are planned around the individual’s needs, location, schedule, and identified risks.",
      "Assignments may include protective coverage for executives, officials, visiting representatives, and other authorized individuals, subject to applicable licensing requirements and the agreed scope of services.",
    ],
  },
  {
    title: "Firewatch Services",
    paragraphs: [
      "Deltacon provides firewatch personnel for facilities requiring temporary observation and reporting during fire protection system impairments or other designated conditions.",
    ],
    listIntroduction: "Services may include:",
    list: [
      "Patrols of assigned areas.",
      "Observation for signs of smoke, fire, and unsafe conditions.",
      "Documentation of patrol activity.",
      "Prompt notification of designated facility contacts.",
      "Activation of emergency reporting procedures when necessary.",
      "Coordination with facility personnel under established instructions.",
    ],
    closing:
      "Firewatch assignments are organized around site conditions, facility procedures, and applicable directions from the authority having jurisdiction.",
  },
  {
    title: "Event Security",
    paragraphs: [
      "Deltacon supports government functions, public meetings, community activities, and other events requiring organized security coverage.",
      "Services may include entrance monitoring, access control, crowd observation, designated area protection, patrols, and coordination with event representatives. Staffing plans reflect the venue layout, anticipated attendance, event schedule, and specific security requirements.",
    ],
  },
];

export const emergencyResponse = {
  title: "Emergency Security & Rapid Response",
  introduction:
    "Unexpected events can disrupt staffing, expose facilities, and place additional demands on public agencies. Deltacon provides emergency security and personnel support to help clients maintain protection and continuity during changing conditions.",
  listIntroduction: "Our emergency response capabilities support:",
  list: [
    "Natural disasters and severe weather.",
    "Critical incidents and unexpected facility disruptions.",
    "Urgent security coverage requirements.",
    "Labor shortages and staffing interruptions.",
    "Temporary protection of affected facilities.",
    "Short notice increases in personnel requirements.",
  ],
  mobilization: {
    figure: "500",
    headline:
      "trained security officers and emergency response personnel within 24 hours anywhere in Texas",
    statement:
      "Deltacon’s stated mobilization capability is up to 500 trained security officers and emergency response personnel within 24 hours anywhere in Texas, subject to assignment requirements, personnel availability, site accessibility, and deployment conditions.",
  },
  closing:
    "Deployment planning addresses personnel qualifications, reporting locations, shift coverage, supervision, communications, and the duties required at each site.",
};

export const staffingSolutions = {
  title: "Government Staffing & Workforce Solutions",
  introduction:
    "Deltacon provides workforce support to help agencies address vacancies, temporary workload increases, special projects, and operational demands.",
  services: [
    {
      title: "Administrative Staffing",
      text: "Administrative personnel can support office functions, clerical work, records processing, data entry, and other duties identified in the contract scope.",
    },
    {
      title: "Government Staffing",
      text: "Deltacon supports agency-specific staffing requirements by aligning personnel with defined roles, schedules, qualifications, and reporting responsibilities.",
    },
    {
      title: "General Labor",
      text: "General labor staffing supports approved assignments requiring additional personnel for routine operational tasks, temporary projects, and other defined support activities.",
    },
    {
      title: "Skilled Personnel",
      text: "Deltacon provides staffing solutions for assignments requiring particular experience, training, or job skills. Personnel requirements are established during scope development to support an appropriate match between the worker and the assignment.",
    },
  ],
  closing:
    "Our staffing approach focuses on clear job requirements, dependable coverage, communication, and responsiveness to changing operational needs.",
};

export const trainingAndConsulting = {
  title: "Security Training & Consulting",
  introduction:
    "Deltacon helps organizations strengthen security readiness through professional training, risk assessment, and practical operational guidance.",
  services: [
    {
      title: "Private Security Training",
      text: "Our training capabilities support the development and continuing education of security personnel. Instruction is matched to the course, assignment, and applicable requirements.",
    },
    {
      title: "Threat & Risk Assessments",
      text: "Deltacon evaluates physical security concerns to help clients identify vulnerabilities, understand exposure, and prioritize protective measures. Assessment scopes may address facility access, existing procedures, officer deployment, visitor movement, and other conditions relevant to the assignment.",
    },
    {
      title: "Security Consulting",
      text: "We assist organizations with the development and improvement of security practices, operating procedures, protective coverage, and response planning. Recommendations are developed around the client’s facilities, personnel, operational needs, and available resources.",
    },
    {
      title: "Organizational & Corporate Security Programs",
      text: "Deltacon supports coordinated security programs for organizations managing individual facilities or multiple locations. Services may include reviewing coverage requirements, defining officer responsibilities, and improving consistency across assigned sites.",
    },
    {
      title: "Compliance Training",
      text: "Deltacon provides instruction designed to help personnel understand applicable responsibilities, approved procedures, and professional standards. Course content and delivery are determined by the training requirement and agreed scope.",
    },
  ],
};

export const trainingAcademies = {
  title: "Training Excellence: Two Security Academies",
  introduction:
    "Deltacon operates two active Texas security training academies:",
  academies: [
    { name: "Deltacon Tactical Academy", licenseNumber: "Y07327301" },
    {
      name: "United States Security Academy (USSA)",
      licenseNumber: "F28377901",
    },
  ],
  paragraphs: [
    "Our academies support private security education, professional development, and specialized instruction. Texas Department of Public Safety licensed instructors deliver applicable regulated instruction within their authorized areas.",
    "Our training resources support workforce readiness and help connect operational requirements with relevant instruction.",
  ],
  trainedOfficers: {
    figure: "350+",
    label: "security officers trained during the preceding seven years",
    statement:
      "Deltacon’s capability statement reports more than 350 security officers trained during the preceding seven years, reflecting the company’s investment in developing professional security personnel.",
  },
};

export const custodialServices = {
  title: "Custodial & Facility Support Services",
  introduction:
    "Clean, orderly facilities support public service delivery and day-to-day operations. Deltacon provides custodial services for government buildings, commercial properties, offices, and industrial environments.",
  listIntroduction: "Our capabilities include:",
  list: [
    "Commercial cleaning.",
    "Government facility cleaning.",
    "Office cleaning.",
    "Industrial cleaning.",
    "Related facility support within the agreed scope.",
  ],
  closing:
    "Cleaning schedules and service responsibilities are developed around facility use, access restrictions, operating hours, and client priorities.",
};

export const contractExperience = {
  title: "Government Contract Experience",
  introduction:
    "Deltacon’s government contract experience includes work for the following agencies and public institutions:",
  agencies: [
    {
      name: "Texas Health and Human Services Commission — Region 3",
      experience:
        "Services covering 19 counties across the Dallas–Fort Worth region.",
    },
    {
      name: "Texas Health and Human Services Commission — Region 8",
      experience: "Services at multiple locations in and around Bexar County.",
    },
    {
      name: "Tarrant County",
      experience: "Services at multiple facilities in and around Fort Worth.",
    },
    {
      name: "Dallas Independent School District",
      experience: "Government and education sector contract experience.",
    },
    {
      name: "Fort Bend Independent School District",
      experience: "Government and education sector contract experience.",
    },
  ],
  paragraphs: [
    "This experience demonstrates familiarity with public-sector environments, geographically dispersed assignments, and the importance of consistent service delivery.",
    "Contract-specific experience and relevant supporting information can be discussed during procurement review.",
  ],
};

export const businessCredentials = {
  title: "Certifications, Registrations & Business Identifiers",
  introduction:
    "Deltacon Global Inc.’s capability statement identifies the following business certifications and procurement registrations:",
  certifications: [
    {
      abbreviation: "SDVOSB",
      name: "Service-Disabled Veteran-Owned Small Business",
    },
    { abbreviation: "VOSB", name: "Veteran-Owned Small Business" },
    { abbreviation: "VetHUB", name: "Texas Certified VetHUB" },
    {
      abbreviation: "SAM",
      name: "System for Award Management — SAM Registered",
    },
    {
      abbreviation: "CMBL",
      name: "Texas Centralized Master Bidders List — CMBL Registered",
    },
  ],
  closing:
    "These credentials help procurement teams identify Deltacon for relevant supplier outreach, market research, and contracting opportunities, subject to each procurement’s eligibility requirements.",
  companyInformation: [
    { label: "Legal business name", value: "Deltacon Global Inc." },
    { label: "Operating brand", value: "Deltacon Security Group" },
    { label: "Headquarters", value: "Sugar Land, Texas" },
    { label: "Unique Entity ID — UEI", value: "LJ7NB35XS4C6" },
    { label: "CAGE Code", value: "813H7" },
    {
      label: "Security licensing footprint",
      value: "Texas, Florida, and Louisiana",
    },
  ],
  naicsCodes: [
    { code: "561612", category: "Security Guards and Patrol Services" },
    { code: "561320", category: "Temporary Help Services" },
    { code: "561720", category: "Janitorial Services" },
  ],
  naicsNote:
    "Security training and consulting are additional capabilities. The applicable classification for a specific requirement should be addressed during procurement review.",
};

export const governmentAwards = [
  {
    title: "HIRE Vets Medallion Award",
    highlight: "7 consecutive years",
    paragraphs: [
      "Deltacon’s capability statement identifies seven consecutive years of HIREVets Medallion recognition, from 2019 through 2025.",
      "This recognition reflects the company’s commitment to veteran employment and the value veterans bring to its workforce.",
    ],
  },
  {
    title: "2026 Inc. 5000 Recognition",
    highlight: "America’s fastest-growing",
    paragraphs: [
      "Deltacon Global Inc. was recognized on the 2026 Inc. 5000 list of America’s fastest-growing private companies, marking a milestone in the company’s growth.",
    ],
  },
];

export const reasonsAgenciesChooseDeltacon = [
  {
    title: "Veteran leadership and service commitment.",
    text: "Our veteran-owned business brings a mission-focused approach to personnel management, preparedness, and contract performance.",
  },
  {
    title: "Multiple complementary capabilities.",
    text: "Security, staffing, emergency response, training, consulting, and custodial services provide options for agencies managing interconnected operational needs.",
  },
  {
    title: "Government contract experience.",
    text: "Our experience includes state agencies, county facilities, and public-school districts.",
  },
  {
    title: "Rapid emergency mobilization.",
    text: "Deltacon maintains a stated capability to organize substantial personnel deployments across Texas for urgent assignments.",
  },
  {
    // TODO(site owner): this says "Three" but the academies section above
    // says "two". Confirm the right number with the client.
    title: "Dedicated training resources.",
    text: "Three security academies support personnel development and professional instruction.",
  },
  {
    title: "Firewatch specialization.",
    text: "Dedicated Firewatch capabilities help facilities address temporary monitoring requirements.",
  },
  {
    title: "Regional licensing footprint.",
    text: "Security company licensing in Texas, Florida, and Louisiana supports consideration for assignments within those jurisdictions, subject to applicable requirements.",
  },
  {
    title: "Procurement visibility.",
    text: "SAM and Texas CMBL registration, together with veteran business credentials, help purchasing teams identify and evaluate Deltacon.",
  },
];

export const governmentContactSection = {
  title: "Discuss Your Government Contracting Requirements",
  paragraphs: [
    "Deltacon welcomes inquiries from contracting officers, procurement departments, agency administrators, facility managers, emergency management teams, and prime contractors seeking support within our capabilities.",
    "Contact us to discuss a solicitation, planned requirement, upcoming contract, temporary staffing need, or emergency deployment.",
  ],
  checklistIntroduction: "To help us evaluate your needs, please include:",
  checklist: [
    "Service location",
    "Scope of work",
    "Anticipated start date",
    "Operating hours",
    "Personnel requirements",
    "Solicitation number, when available",
  ],
  pillars: [
    "Professional Security",
    "Emergency Response",
    "Workforce Solutions",
    "Training Excellence",
  ],
  motto: "Reliable. Responsive. Mission Ready.",
};
