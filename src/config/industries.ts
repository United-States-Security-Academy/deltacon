import {
  Building2,
  FlaskConical,
  HardHat,
  Hospital,
  Hotel,
  House,
  Landmark,
  School,
  Server,
  Ship,
  ShoppingBag,
  UtilityPole,
  Warehouse,
  type LucideIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";

import chemicalPetrochemicalImage from "@/assets/industries/chemical-petrochemical.jpg";
import commercialRealEstateImage from "@/assets/industries/commercial-real-estate.jpg";
import constructionImage from "@/assets/industries/construction.jpg";
import criticalInfrastructureImage from "@/assets/industries/critical-infrastructure.jpg";
import dataCentersImage from "@/assets/industries/data-centers.jpg";
import educationalCorporateCampusImage from "@/assets/industries/educational-corporate-campus.jpg";
import financialInstitutionsImage from "@/assets/industries/financial-institutions.jpg";
import gatedMultiUnitResidentialImage from "@/assets/industries/gated-multi-unit-residential.jpg";
import hospitalityTourismImage from "@/assets/industries/hospitality-tourism.jpg";
import portsOfEntryImage from "@/assets/industries/ports-of-entry.jpg";
import retailImage from "@/assets/industries/retail.jpg";

/**
 * Industries Deltacon serves, taken from the company's "Industries Served"
 * document. Edit this file to change the Industries pages, the home page and
 * the "Industry" options on the Request Service form. Which services apply to
 * each industry is set on each service in config/services.ts.
 */

export type Industry = {
  slug: string;
  /** Short name used on cards, menus and the request form. */
  name: string;
  /** Full heading used on the industry's own page. */
  pageTitle: string;
  icon: LucideIcon;
  image?: StaticImageData;
  imageAltText?: string;
  /** One or two sentences used on cards and in search results. */
  summary: string;
  /** Paragraphs shown on the industry's own page. */
  overview: string[];
  /** What the officers do for this industry. */
  servicesProvided: string[];
  /** Named courses, certifications and memberships relevant to this industry. */
  trainingAndCredentials: string[];
};

const flexibleCoverage =
  "Whether you need coverage for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible security solutions for one facility or multiple locations, tailored to your operational needs.";

const fireWatchCertification =
  "Fire Watch Officer Certification Course — USSA-FW-201";
const customerServiceCourse =
  "Customer Service Excellence for Security Professionals — USSA-CS-101";
const highRiseFireWarden =
  "Houston Fire Department Certified High-Rise Fire Warden";
const redCrossFirstAid = "American Red Cross First Aid and CPR/AED";

export const industries = [
  {
    slug: "retail",
    name: "Retail",
    pageTitle: "Retail Security Services",
    icon: ShoppingBag,
    image: retailImage,
    imageAltText:
      "Two Deltacon security officers at a store entrance helping a shopper",
    summary:
      "Customer-focused security for retailers, malls and shopping outlets, protecting employees, customers, merchandise and property.",
    overview: [
      "Deltacon Security Group provides customized security services for retailers, malls, and shopping outlets, helping protect employees, customers, merchandise, and property while supporting a welcoming shopping experience.",
      "As a member of the National Retail Federation (NRF Member ID 10905654), we understand the importance of retail to the U.S. economy and the role that professional, customer-focused security plays in successful retail operations.",
      "Our state-licensed retail security officers participate in the NRF Foundation's Customer Service and Sales Certified Specialist program and have completed IS-912: Retail Security Awareness. Our officers also receive emergency response training and hold Fire Watch certification, preparing them to recognize hazards, respond to incidents, and assist during emergencies.",
      "At Deltacon Security Group, we recognize that our employees often serve as the first point of contact for our clients' customers, guests, residents, and visitors. Every interaction should reflect courtesy, professionalism, and a commitment to safety. That is why all Deltacon employees, including armed and unarmed officers, supervisors, dispatchers, and administrative personnel, must successfully complete our mandatory course USSA-CS-101 Customer Service Excellence for Security Professionals through our training school, the United States Security Academy (USSA).",
      "Whether you need coverage for a few hours, several days, weeks, or an ongoing assignment, Deltacon offers flexible security solutions for single stores and multiple locations. We tailor our services to your operational needs, helping safeguard your business while treating your customers with courtesy and respect.",
    ],
    servicesProvided: [
      "Protection of employees, customers and merchandise",
      "Theft deterrence",
      "Hazard recognition and incident response",
      "Emergency assistance",
    ],
    trainingAndCredentials: [
      "National Retail Federation member (NRF Member ID 10905654)",
      "NRF Foundation Customer Service and Sales Certified Specialist program",
      "IS-912: Retail Security Awareness",
      "Fire Watch certification",
      customerServiceCourse,
    ],
  },
  {
    slug: "critical-infrastructure",
    name: "Critical Infrastructure",
    pageTitle: "Critical Infrastructure Security Services",
    icon: UtilityPole,
    image: criticalInfrastructureImage,
    imageAltText:
      "Aerial view of a city's power, water, rail, airport and port infrastructure",
    summary:
      "Security that helps protect America's critical infrastructure, supporting national security, public safety and continuity of essential operations.",
    overview: [
      "Deltacon Security Group provides customized security services to help protect America's critical infrastructure, supporting national security, public safety, and continuity of essential operations.",
      "We train and manage dedicated security professionals to meet each facility's unique risks and operational requirements.",
      "Our critical infrastructure team includes leaders who hold or have held state or federal security clearances, including federal Confidential, Secret, or Top-Secret clearances. Their experience supports disciplined security operations and the responsible handling of sensitive information.",
      "Whether you require temporary coverage or long-term protection, Deltacon delivers professional security solutions tailored to your facility, personnel, and mission.",
    ],
    servicesProvided: [
      "Access control",
      "Perimeter protection",
      "Patrols",
      "Threat awareness",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Leaders holding or having held state or federal security clearances (Confidential, Secret or Top-Secret)",
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare Facilities",
    pageTitle: "Healthcare Facilities Security Services",
    icon: Hospital,
    summary:
      "Security for hospitals, nursing homes, emergency departments, clinics and research centers, protecting patients, staff and visitors with professionalism and compassion.",
    overview: [
      "Deltacon Security Group provides customized security services for hospitals, nursing homes, emergency departments, community health centers, research centers, and clinics. We help protect patients, healthcare professionals, visitors, property, and equipment while supporting a safe, respectful, and welcoming care environment.",
      "As a partner member of the International Association for Healthcare Security and Safety (IAHSS), we understand the sensitive nature of healthcare operations and the importance of professionalism, compassion, and confidentiality.",
      "Our state-licensed healthcare security professionals hold the IAHSS Certified Healthcare Security Officer (CHSO) certification and receive emergency response training. They work alongside your healthcare team to help maintain a secure environment for care.",
      flexibleCoverage,
    ],
    servicesProvided: [
      "Access control",
      "Facility patrols",
      "Conflict de-escalation",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Partner member of the International Association for Healthcare Security and Safety (IAHSS)",
      "IAHSS Certified Healthcare Security Officer (CHSO)",
      "Emergency response training",
    ],
  },
  {
    slug: "warehousing-storage",
    name: "Warehousing & Storage",
    pageTitle: "Warehousing & Storage Security Services",
    icon: Warehouse,
    summary:
      "Security for warehouses, self-storage centers and distribution and fulfillment facilities, protecting personnel, inventory, tenants' property and equipment.",
    overview: [
      "Deltacon Security Group provides customized security services for warehouses, self-storage centers, and distribution and fulfillment facilities. We help protect personnel, inventory, tenants' property, and equipment while supporting safe and efficient operations.",
      "We understand the vital role warehousing plays in America's supply chain and the distinct security challenges facing self-storage facilities.",
      "Our state-licensed security professionals receive emergency response training and hold Fire Watch certification, preparing them to recognize hazards, report suspicious activity, and assist during emergencies.",
      "Whether you need coverage for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible security solutions for one facility or multiple locations, tailored to your property and operational needs.",
    ],
    servicesProvided: [
      "Access control",
      "Vehicle and visitor monitoring",
      "Facility and perimeter patrols",
      "Theft deterrence",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Fire Watch certification",
      "Emergency response training",
    ],
  },
  {
    slug: "construction",
    name: "Construction Sites",
    pageTitle: "Construction Site Security Services",
    icon: HardHat,
    image: constructionImage,
    imageAltText:
      "Three Deltacon team members in hard hats in front of a building under construction",
    summary:
      "Protection for construction workers, equipment, materials and property through every phase of your project.",
    overview: [
      "Deltacon Security Group provides customized security services to help protect construction workers, equipment, materials, and property throughout every phase of your project.",
      "Our state-licensed security professionals receive emergency response training and provide a visible presence to deter theft, trespassing, and vandalism. Through access control, site patrols, and observation, they help identify and report fire hazards, water leaks, flooding, and other conditions that could threaten safety or disrupt work.",
      "We work with builders, contractors, project managers, property owners, and other stakeholders to develop a security plan tailored to your site's layout, work schedule, risks, and changing needs.",
      "Whether you require coverage for a few hours, several days, weeks, or the duration of a project, Deltacon offers flexible security solutions for one construction site or multiple locations.",
    ],
    servicesProvided: [
      "Access control",
      "Site patrols",
      "Deterring theft, trespassing and vandalism",
      "Reporting fire hazards, water leaks and flooding",
      "Alarm response",
      "Incident reporting",
      "Conflict de-escalation",
    ],
    trainingAndCredentials: ["Emergency response training"],
  },
  {
    slug: "financial-institutions",
    name: "Financial Institutions",
    pageTitle: "Financial Institutions Security Services",
    icon: Landmark,
    image: financialInstitutionsImage,
    imageAltText: "Entrance of a bank branch with ATMs beside the doors",
    summary:
      "Security for banks, credit unions and ATM service operations, including Bank Protection Officers and ATM Technician Escort Guards.",
    overview: [
      "Deltacon Security Group provides customized security services for banks, credit unions, and ATM service operations. We help protect employees, customers, facilities, and assets while supporting a calm, professional, and welcoming business environment.",
      "Our state-licensed security officers receive emergency response training, and our Bank Protection Officers are required to complete Robbery and Bank Security, an American Bankers Association (ABA) frontline compliance training course.",
      "Our ATM Technician Escort Guards undergo stringent background checks and complete courses provided by the ATM Industry Association (ATMIA). They provide protective watches while technicians service ATM machines, particularly at outdoor locations, monitoring surrounding activity and helping identify potential threats.",
      "We work with your management and service teams to tailor security coverage to your facilities, operating hours, and risks. Whether you need protection for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible services for one location or multiple sites.",
    ],
    servicesProvided: [
      "Bank Protection Officers",
      "ATM Technician Escort Guards",
      "Crime deterrence",
      "Access control",
      "Threat awareness",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "American Bankers Association (ABA): Robbery and Bank Security",
      "ATM Industry Association (ATMIA) courses",
      "Stringent background checks for ATM escort guards",
    ],
  },
  {
    slug: "hospitality-tourism",
    name: "Hospitality & Tourism",
    pageTitle: "Hospitality & Tourism Security Services",
    icon: Hotel,
    image: hospitalityTourismImage,
    imageAltText: "Resort hotel with a swimming pool and palm trees",
    summary:
      "Courteous, discreet security for hotels, resorts, lodging properties and tourism destinations that supports a positive guest experience.",
    overview: [
      "Deltacon Security Group provides customized security services for hotels, resorts, lodging properties, and tourism destinations. We help protect guests, employees, and property while supporting the attentive service and welcoming atmosphere that define a positive guest experience.",
      "Our officers combine a professional security presence with courtesy, discretion, and respect.",
      "Our state-licensed security officers have completed the Certified Lodging Security Officer (CLSO) course and receive emergency response training. They also hold Fire Watch certification, have completed the Houston Fire Department's Certified High-Rise Fire Warden course, and carry American Red Cross First Aid and CPR/AED cards. This preparation supports their ability to assist during emergencies and follow property evacuation procedures.",
      "We work with your management and guest services teams to tailor security coverage to your property, occupancy, events, and operational needs. Whether you require services for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible protection for one property or multiple locations.",
    ],
    servicesProvided: [
      "Lobby security",
      "Access control",
      "Property and parking patrols",
      "Event security",
      "Conflict de-escalation",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Certified Lodging Security Officer (CLSO)",
      "Fire Watch certification",
      highRiseFireWarden,
      redCrossFirstAid,
    ],
  },
  {
    slug: "gated-multi-unit-residential",
    name: "Gated & Multi-Unit Residential",
    pageTitle: "Gated & Multi-Unit Residential Security Services",
    icon: House,
    image: gatedMultiUnitResidentialImage,
    imageAltText: "Gated apartment community with a guardhouse at the entrance",
    summary:
      "Security for gated communities, apartment complexes, condominiums and residential high-rises, where residents and families feel secure.",
    overview: [
      "Deltacon Security Group provides customized security services for gated communities, apartment complexes, condominiums, and residential high-rises. We help protect residents, visitors, and property while supporting a welcoming environment where families can feel secure.",
      "We understand the concerns of builders, property managers, homeowners, and tenants. Our officers provide a visible presence to deter trespassing, theft, and vandalism while treating residents and guests with courtesy and respect.",
      "Our state-licensed security officers receive emergency response training and hold Fire Watch certification. Our officers have also completed the Houston Fire Department's Certified High-Rise Fire Warden course and American Red Cross First Aid and CPR/AED training, preparing them to assist during emergencies and support property evacuation procedures.",
      "We work with property managers and community representatives to tailor coverage to your property's layout, resident needs, and operating policies. Whether you require services for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible security solutions for one community or multiple locations.",
    ],
    servicesProvided: [
      "Gate and access control",
      "Visitor monitoring",
      "Community and parking patrols",
      "Amenity-area checks",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Fire Watch certification",
      highRiseFireWarden,
      redCrossFirstAid,
    ],
  },
  {
    slug: "commercial-real-estate",
    name: "Commercial Real Estate & High-Rise",
    pageTitle: "Commercial Real Estate & High-Rise Security Services",
    icon: Building2,
    image: commercialRealEstateImage,
    imageAltText: "Glass office towers and a high-rise building entrance",
    summary:
      "Security for commercial properties, office buildings and high-rise complexes, protecting tenants, employees, visitors and property.",
    overview: [
      "Deltacon Security Group provides customized security services for commercial properties, office buildings, and high-rise complexes. We help protect tenants, employees, visitors, and property while supporting a professional, welcoming environment.",
      "We understand the security challenges of busy commercial buildings, including public access, multiple tenants, parking facilities, and after-hours operations.",
      "Our state-licensed security officers receive emergency response training and hold Fire Watch certification. Our officers have also completed the Houston Fire Department's Certified High-Rise Fire Warden course and American Red Cross First Aid and CPR/AED training, preparing them to assist with medical emergencies and support building evacuation procedures.",
      "We work with property owners, managers, and building operations teams to tailor security coverage to each property's layout, occupancy, and emergency plans. Whether you need services for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible protection for one property or multiple locations.",
    ],
    servicesProvided: [
      "Lobby security",
      "Access control",
      "Visitor monitoring",
      "Building and parking patrols",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Fire Watch certification",
      highRiseFireWarden,
      redCrossFirstAid,
    ],
  },
  {
    slug: "ports-of-entry",
    name: "Ports of Entry",
    pageTitle:
      "Ports of Entry Security Services — Airports, Seaports & Border Facilities",
    icon: Ship,
    image: portsOfEntryImage,
    imageAltText:
      "A seaport, an airport and a border crossing, labeled sea, air and land",
    summary:
      "Security for airports, seaports and border facilities, protecting personnel, travelers, cargo and infrastructure.",
    overview: [
      "Deltacon Security Group provides customized security services for airports, seaports, and border facilities, helping protect personnel, travelers, cargo, and infrastructure while supporting the safe movement of people and goods.",
      "We understand the importance of ports of entry to national security and commerce. All services are provided within each facility's authorized security procedures.",
      "Our state-licensed security officers receive emergency response training and hold Fire Watch certification. Personnel assigned to maritime facilities complete role-specific training, including AWR-144: Port and Vessel Security for Public Safety and Maritime Personnel. Additional preparation is tailored to the assignment and facility requirements.",
      "We work with facility management and security teams to develop coverage suited to your operating environment, risks, and schedules. Whether you need services for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible security solutions for one facility or multiple locations.",
    ],
    servicesProvided: [
      "Access control",
      "Perimeter patrols",
      "Vehicle and visitor monitoring",
      "Protection of restricted areas",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "Fire Watch certification",
      "AWR-144: Port and Vessel Security for Public Safety and Maritime Personnel",
    ],
  },
  {
    slug: "chemical-petrochemical",
    name: "Chemical & Petrochemical",
    pageTitle: "Chemical & Petrochemical Security Services",
    icon: FlaskConical,
    image: chemicalPetrochemicalImage,
    imageAltText:
      "Petrochemical plant with storage spheres and processing towers",
    summary:
      "Security for chemical and petrochemical facilities, protecting personnel, property and critical assets while supporting safe, continuous operations.",
    overview: [
      "Deltacon Security Group provides customized security services for chemical and petrochemical facilities, helping protect personnel, property, and critical assets while supporting safe and continuous operations.",
      "We understand the sector's unique security challenges, including sensitive processing areas, hazardous materials, and restricted access requirements.",
      "Our state-licensed security officers receive additional emergency response training and hold Fire Watch Officer Certification USSA-FW-201 through our training school, the United States Security Academy (USSA). Officers assigned to this sector are also required to complete DHS/FEMA Chemical Sector Security Awareness Training, supporting their ability to recognize potential threats and follow facility reporting procedures.",
      "We work with your management, safety, and operations teams to develop security coverage tailored to your facility's risks, site procedures, and operational needs. Whether you require services for a few hours, several days, weeks, or a long-term assignment, Deltacon offers flexible protection for one facility or multiple locations.",
    ],
    servicesProvided: [
      "Access control",
      "Perimeter protection",
      "Vehicle and visitor monitoring",
      "Security patrols",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      fireWatchCertification,
      "DHS/FEMA Chemical Sector Security Awareness Training",
    ],
  },
  {
    slug: "data-centers",
    name: "National Data Centers",
    pageTitle: "National Data Center Security Services",
    icon: Server,
    image: dataCentersImage,
    imageAltText: "Data center aisle lined with server racks",
    summary:
      "Highly trained armed and unarmed officers for data centers, protecting personnel, facilities and critical infrastructure while supporting uninterrupted operations.",
    overview: [
      "Deltacon Security Group provides highly trained armed and unarmed security officers for data centers, helping protect personnel, facilities, and critical infrastructure while supporting uninterrupted operations.",
      "We work with your management and operations teams to tailor security coverage to your facility's risks, restricted areas, and operating requirements.",
      "All officers assigned to data center security must complete additional customized training through our training school, the United States Security Academy (USSA). This preparation strengthens their ability to recognize security threats and fire hazards, follow site-specific procedures, and respond promptly to incidents.",
      "Whether you require temporary coverage or long-term protection at one facility or multiple locations nationwide, Deltacon provides security solutions tailored to your mission and operational needs.",
    ],
    servicesProvided: [
      "Access control",
      "Credential verification",
      "Visitor and contractor monitoring",
      "Perimeter and interior patrols",
      "Incident reporting",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [
      "National Data Center Security Officer Course — USSA-DCS-401",
      fireWatchCertification,
    ],
  },
  {
    slug: "educational-corporate-campus",
    name: "Educational & Corporate Campuses",
    pageTitle: "Educational Institutions & Corporate Campus Security Services",
    icon: School,
    image: educationalCorporateCampusImage,
    imageAltText:
      "Security officers greeting students and visitors at a school entrance",
    summary:
      "Armed and unarmed officers for schools, colleges and corporate campuses, protecting students, faculty, employees, visitors and property.",
    overview: [
      "Deltacon Security Group provides armed and unarmed security officers for educational institutions and corporate campuses, helping protect students, faculty, employees, visitors, and property while supporting a welcoming environment for learning and business.",
      "We work with administrators, facility managers, and corporate leadership to customize security coverage to each client's requirements, campus layout, schedules, and emergency procedures.",
      "All officers assigned to these facilities must complete additional customized training through our training school, the United States Security Academy (USSA). This preparation reinforces fire hazard awareness, professional communication, courteous service, and appropriate incident response. Officers also receive site-specific instruction to address the needs of your campus community.",
      "Whether you require temporary coverage, special-event support, or long-term security at one campus or multiple locations, Deltacon provides flexible protection tailored to your institution or organization.",
    ],
    servicesProvided: [
      "Access control",
      "Visitor verification",
      "Building and perimeter patrols",
      "Parking security",
      "Incident reporting",
      "Conflict de-escalation",
      "Emergency response coordination",
    ],
    trainingAndCredentials: [fireWatchCertification, customerServiceCourse],
  },
] as const satisfies readonly Industry[];

export type IndustrySlug = (typeof industries)[number]["slug"];

export const industrySlugs = industries.map((industry) => industry.slug) as [
  IndustrySlug,
  ...IndustrySlug[],
];

export function findIndustryBySlug(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}
