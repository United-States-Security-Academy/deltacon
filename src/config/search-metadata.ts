/**
 * The title and description search engines show for each public page, kept
 * in one place so they stay unique and within length.
 *
 * - Title: under 60 characters. " | Deltacon Security Group" is added after
 *   it automatically (except on the home page).
 * - Description: 140–160 characters, a real summary of the page.
 * - Only facts already on the site are used. Keep it that way: no ratings,
 *   claims or places that the page itself doesn't support.
 *
 * Pages without an entry here use the title and summary from their own
 * config (services.ts, industries.ts, training-courses.ts, …).
 */
export type SearchMetadata = { title: string; description: string };

export const searchMetadataByPath: Record<string, SearchMetadata> = {
  "/": {
    title: "Deltacon Security Group | Licensed Security Guards in Texas",
    description:
      "Licensed unarmed and armed security officers, personal protection, mobile patrol, fire watch and security training across Texas, from Sugar Land, TX.",
  },

  // Services
  "/services": {
    title: "Security Guard Services in Texas",
    description:
      "Unarmed and armed security officers, personal protection, emergency response, fire watch, mobile patrol, correctional security and off-duty police in Texas.",
  },
  "/services/unarmed-security-officers": {
    title: "Unarmed Security Guard Services in Texas (Level II)",
    description:
      "Licensed, non-commissioned Level II security officers who protect people, property and business operations while keeping a courteous, welcoming presence.",
  },
  "/services/armed-security-officers": {
    title: "Armed Security Guard Services in Texas (Level III)",
    description:
      "Licensed, commissioned Level III armed security officers for assignments that need an enhanced protective presence for people, property and critical assets.",
  },
  "/services/personal-protection": {
    title: "Personal Protection & Bodyguard Services in Texas",
    description:
      "Licensed Level IV Personal Protection Officers (bodyguards) for executives, public figures, private individuals and anyone facing personal security concerns.",
  },
  "/services/emergency-rapid-response": {
    title: "Emergency & Rapid Response Security in Texas",
    description:
      "Security support that protects lives, property and infrastructure during unexpected incidents, backed by our 24/7 Dispatch and Operations Command Center.",
  },
  "/services/fire-watch": {
    title: "Fire Watch Guard Services in Texas",
    description:
      "Certified Fire Watch officers for fire protection system outages, hot work and construction sites, available 24/7 for emergency and scheduled assignments.",
  },
  "/services/mobile-patrol": {
    title: "Mobile Security Patrol Services in Texas",
    description:
      "Dedicated and intermittent patrols for commercial, residential, industrial and remote sites, by bicycle, trike, golf cart or vehicle, with drones available.",
  },
  "/services/detention-correctional-security": {
    title: "Detention & Correctional Security Officers in Texas",
    description:
      "Detention and correctional security from officers experienced in federal, state and county correctional facilities, licensed under Texas DPS requirements.",
  },
  "/services/off-duty-police": {
    title: "Off-Duty Police Officers for Hire in Texas",
    description:
      "Experienced off-duty law enforcement officers holding TCOLE credentials, for security assignments that need specialized knowledge and a strong presence.",
  },
  "/services/mobile-training-team": {
    title: "On-Site Security Training for Organizations in Texas",
    description:
      "The Deltacon Mobile Training Team delivers customized security training at your location anywhere in Texas, taught by experienced security instructors.",
  },
  "/security-guard-pricing": {
    title: "Security Guard Pricing: What Your Hourly Rate Covers",
    description:
      "See what goes into a professional security guard hourly bill rate: wages, payroll taxes, insurance, training, uniforms, licensing, supervision and overhead.",
  },
  "/training-advantage": {
    title: "Our Training Advantage: Two Texas Security Academies",
    description:
      "Deltacon Security Group owns two Texas DPS-licensed security training academies and keeps in-house licensed instructors for classroom, firearms and PPO work.",
  },
  "/locations": {
    title: "Security Guard Locations in Texas",
    description:
      "Find the Deltacon Security Group office that serves your area, including our Dallas office for Dallas–Fort Worth and our Sugar Land, Texas headquarters.",
  },
  "/government-contracting": {
    title: "Government Contracting Security & Staffing Services",
    description:
      "Veteran-owned security, staffing, emergency response, training and custodial services for government agencies. SDVOSB, SAM registered, CAGE 813H7.",
  },
  "/consulting": {
    title: "Physical Security Consulting & Risk Assessments",
    description:
      "Physical security consulting that helps government agencies, communities and businesses identify security risks and build practical protective solutions.",
  },
  "/staffing": {
    title: "Staffing & Recruitment Services in Texas",
    description:
      "Flexible staffing and recruitment for government agencies, communities and businesses: permanent placement, temporary, temp-to-hire and seasonal staff.",
  },
  "/custodial-services": {
    title: "Commercial Custodial & Janitorial Services in Texas",
    description:
      "Custodial and janitorial services tailored to your facility, schedule and cleaning priorities, from routine office cleaning to comprehensive building care.",
  },

  // Industries
  "/industries": {
    title: "Security Services by Industry in Texas",
    description:
      "Security for retail, healthcare, construction, banks, hotels, residential, data centers, ports, petrochemical, campuses and critical infrastructure in Texas.",
  },
  "/industries/retail": {
    title: "Retail Security Guard Services in Texas",
    description:
      "Customer-focused security officers for retailers, malls and shopping centers, protecting employees, customers, merchandise and property across Texas.",
  },
  "/industries/critical-infrastructure": {
    title: "Critical Infrastructure Security Services",
    description:
      "Security officers who help protect critical infrastructure, supporting national security, public safety and the continuity of essential operations in Texas.",
  },
  "/industries/healthcare": {
    title: "Hospital & Healthcare Security Services in Texas",
    description:
      "Security for hospitals, nursing homes, clinics and research centers, protecting patients, staff and visitors with professionalism and compassion.",
  },
  "/industries/warehousing-storage": {
    title: "Warehouse & Self-Storage Security in Texas",
    description:
      "Security for warehouses, self-storage, distribution and fulfillment centers, protecting personnel, inventory, tenants' property and equipment in Texas.",
  },
  "/industries/construction": {
    title: "Construction Site Security Services in Texas",
    description:
      "Security officers and patrols that protect construction workers, equipment, materials and property through every phase of your project in Texas.",
  },
  "/industries/financial-institutions": {
    title: "Bank & Credit Union Security Services in Texas",
    description:
      "Security for banks, credit unions and ATM service operations in Texas, including Bank Protection Officers and ATM Technician Escort Guards on site.",
  },
  "/industries/hospitality-tourism": {
    title: "Hotel & Hospitality Security Services in Texas",
    description:
      "Courteous, discreet security officers for hotels, resorts, lodging properties and tourism destinations in Texas that support a positive guest experience.",
  },
  "/industries/gated-multi-unit-residential": {
    title: "Apartment & Gated Community Security in Texas",
    description:
      "Security for gated communities, apartment complexes, condominiums and residential high-rises in Texas, so residents and families feel safe at home.",
  },
  "/industries/commercial-real-estate": {
    title: "Office Building & High-Rise Security in Texas",
    description:
      "Security for commercial properties, office buildings and high-rise complexes in Texas, protecting tenants, employees, visitors and property.",
  },
  "/industries/ports-of-entry": {
    title: "Airport, Seaport & Border Facility Security",
    description:
      "Security for airports, seaports and border facilities, protecting personnel, travelers, cargo and infrastructure with trained, licensed security officers.",
  },
  "/industries/chemical-petrochemical": {
    title: "Chemical & Petrochemical Plant Security in Texas",
    description:
      "Security for chemical and petrochemical facilities, protecting personnel, property and critical assets while supporting safe, continuous operations.",
  },
  "/industries/data-centers": {
    title: "Data Center Security Services",
    description:
      "Highly trained armed and unarmed officers for data centers, protecting personnel, facilities and critical infrastructure without interrupting operations.",
  },
  "/industries/educational-corporate-campus": {
    title: "School & Corporate Campus Security in Texas",
    description:
      "Armed and unarmed security officers for schools, colleges and corporate campuses in Texas, protecting students, faculty, employees and visitors.",
  },

  // Training
  "/training": {
    title: "Texas Security Guard Training & Licensing Courses",
    description:
      "Texas Level II, III and IV security officer licensing, renewals, License to Carry, pepper spray and specialized courses from USSA and Deltacon Tactical Academy.",
  },
  "/training/level-2-unarmed-officer": {
    title: "Texas Level II Security Officer Training (Unarmed)",
    description:
      "The Texas Level II non-commissioned security officer course: the first step toward armed (Level III) and Personal Protection Officer (Level IV) licenses.",
  },
  "/training/level-3-armed-officer": {
    title: "Texas Level III Armed Security Officer Training",
    description:
      "Texas Level III commissioned officer course: classroom instruction, defensive tactics, firearms safety and supervised range qualification for armed duties.",
  },
  "/training/level-4-personal-protection-officer": {
    title: "Texas Level IV Personal Protection Officer Training",
    description:
      "Texas Level IV Personal Protection Officer (PPO) course that prepares security professionals for executive protection through scenario-based instruction.",
  },
  "/training/pepper-spray": {
    title: "Pepper Spray (OC) Training for Security Officers",
    description:
      "Safe, responsible use of OC pepper spray during security duties, for Texas security officers, with a separate pepper spray training certificate on completion.",
  },
  "/training/level-4-ppo-renewal": {
    title: "Texas Level IV PPO Renewal & Continuing Education",
    description:
      "Continuing education for licensed Texas Personal Protection Officers (Level IV), structured around Texas DPS renewal requirements to keep your license current.",
  },
  "/training/level-3-armed-officer-renewal": {
    title: "Texas Level III Armed Officer Renewal Course",
    description:
      "Renewal course for commissioned Texas Level III officers: refresh essential knowledge and demonstrate the firearms proficiency required for license renewal.",
  },
  "/training/texas-license-to-carry": {
    title: "Texas License to Carry (LTC) Handgun Training",
    description:
      "Classroom or online instruction and supervised handgun proficiency training for anyone in Texas who is pursuing a License to Carry (LTC) for a handgun.",
  },
  "/training/active-shooter-response": {
    title: "Active Shooter Awareness & Response Training",
    description:
      "Training that prepares employees and security staff to recognize warning signs, report concerns and take protective action during an active shooter emergency.",
  },
  "/training/defensive-tactics": {
    title: "Defensive Tactics & Personal Safety Training",
    description:
      "Practical defensive skills, awareness and judgment for threatening encounters, with an emphasis on controlled, proportionate responses for security officers.",
  },
  "/training/maritime-security": {
    title: "Maritime Security Training for Vessels & Ports",
    description:
      "Maritime security training tailored to vessel operators, port facilities and related organizations, from Deltacon Security Group training in Texas.",
  },
  "/training/first-aid-cpr-aed": {
    title: "American Red Cross First Aid, CPR & AED Course",
    description:
      "American Red Cross First Aid, CPR and AED certification for security officers and other participants, from an American Red Cross training partner.",
  },
  "/training/bloodborne-pathogens": {
    title: "Bloodborne Pathogens Awareness Training",
    description:
      "Training that helps security officers and other employees understand and reduce the risks of occupational exposure to blood and other infectious materials.",
  },
  "/guide": {
    title: "How to Get a Security Guard License in Texas",
    description:
      "Step-by-step guide to Texas security guard licensing: choose Level II, III or IV, check eligibility, train, apply in TOPS, get fingerprinted and renew.",
  },

  // Company, forms and media
  "/request-service": {
    title: "Request Security Services: Free Quote",
    description:
      "Tell us about your site and security needs, and Deltacon Security Group will send you a tailored proposal, usually within one business day, at no cost.",
  },
  "/security-assessment": {
    title: "Free Business Security Self-Assessment",
    description:
      "Answer 12 quick questions about lighting, entry points, cameras, opening hours and past incidents to get a security score and personalized recommendations.",
  },
  "/apply": {
    title: "Security Officer Jobs in Texas: Apply Now",
    description:
      "Join Deltacon Security Group. Apply for security officer, patrol, event security, supervisor and protection roles with a licensed Texas security company.",
  },
  "/about": {
    title: "About Deltacon Security Group",
    description:
      "Deltacon Security Group is a licensed Texas security company (DPS License B05205701) based in Sugar Land. Learn about our story, mission, values and licenses.",
  },
  "/blog": {
    title: "Security News, Advice & Press",
    description:
      "News, practical security advice and press releases from Deltacon Security Group, protecting businesses, communities and government agencies across Texas.",
  },
  "/gallery": {
    title: "Photo Gallery: Our Security Officers at Work",
    description:
      "Photos of Deltacon Security Group officers on duty, in training and in the community across Texas, from event security to executive protection assignments.",
  },
  "/privacy": {
    title: "Privacy Policy",
    description:
      "How Deltacon Security Group collects, uses, stores and protects the personal information you submit on this website, including forms, job applications and CVs.",
  },
};
