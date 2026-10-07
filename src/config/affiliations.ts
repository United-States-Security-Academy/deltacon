import type { StaticImageData } from "next/image";

import americanRedCrossLogo from "@/assets/affiliations/american-red-cross.png";
import asisInternationalLogo from "@/assets/affiliations/asis-international.png";
import associatedSecurityServicesLogo from "@/assets/affiliations/associated-security-services-investigators-texas.png";
import esgrLogo from "@/assets/affiliations/esgr.jpg";
import fortBendChamberLogo from "@/assets/affiliations/fort-bend-chamber-of-commerce.png";
import galvestonRegionalChamberLogo from "@/assets/affiliations/galveston-regional-chamber-of-commerce.png";
import hireVetsMedallionLogo from "@/assets/affiliations/hire-vets-medallion.png";
import infragardLogo from "@/assets/affiliations/infragard.png";
import nationalApartmentAssociationLogo from "@/assets/affiliations/national-apartment-association.png";
import nationalRetailFederationLogo from "@/assets/affiliations/national-retail-federation.png";
import presidentsVolunteerServiceAwardLogo from "@/assets/affiliations/presidents-volunteer-service-award.jpg";
import propperLogo from "@/assets/affiliations/propper.png";
import texasApartmentAssociationLogo from "@/assets/affiliations/texas-apartment-association.png";
import texasHotelLodgingAssociationLogo from "@/assets/affiliations/texas-hotel-lodging-association.png";
import usChamberOfCommerceLogo from "@/assets/affiliations/us-chamber-of-commerce.png";
import veteranOwnedSmallBusinessLogo from "@/assets/affiliations/veteran-owned-small-business.png";

/**
 * Recognitions, awards and affiliations, taken from the company's
 * "Recognitions, Awards and Licenses" document. Shown on the home and About
 * pages. To add one, put the logo in src/assets/affiliations and add an entry.
 */

export type Affiliation = {
  name: string;
  logo: StaticImageData;
  /** Optional extra line, e.g. a membership number. */
  detail?: string;
};

export type AffiliationGroup = {
  heading: string;
  affiliations: Affiliation[];
};

/** Membership numbers shown above the logos. */
export const membershipNumbers = [
  { organisation: "U.S. Chamber of Commerce", number: "10041158" },
  { organisation: "National Retail Federation", number: "10905654" },
];

export const affiliationGroups: AffiliationGroup[] = [
  {
    heading: "Chambers of Commerce",
    affiliations: [
      {
        name: "U.S. Chamber of Commerce",
        logo: usChamberOfCommerceLogo,
        detail: "Member No. 10041158",
      },
      {
        name: "Galveston Regional Chamber of Commerce",
        logo: galvestonRegionalChamberLogo,
      },
      { name: "Fort Bend Chamber of Commerce", logo: fortBendChamberLogo },
    ],
  },
  {
    heading: "Security & industry associations",
    affiliations: [
      { name: "ASIS International", logo: asisInternationalLogo },
      { name: "InfraGard", logo: infragardLogo },
      {
        name: "Associated Security Services and Investigators of the State of Texas",
        logo: associatedSecurityServicesLogo,
      },
      {
        name: "National Retail Federation",
        logo: nationalRetailFederationLogo,
        detail: "Member ID 10905654",
      },
      {
        name: "Texas Hotel & Lodging Association",
        logo: texasHotelLodgingAssociationLogo,
      },
      {
        name: "Texas Apartment Association",
        logo: texasApartmentAssociationLogo,
      },
      {
        name: "National Apartment Association",
        logo: nationalApartmentAssociationLogo,
        detail: "Affiliate",
      },
    ],
  },
  {
    heading: "Veteran & service recognitions",
    affiliations: [
      {
        name: "HIRE Vets Medallion Program",
        logo: hireVetsMedallionLogo,
      },
      {
        name: "Employer Support of the Guard and Reserve (ESGR)",
        logo: esgrLogo,
      },
      {
        name: "President's Volunteer Service Award",
        logo: presidentsVolunteerServiceAwardLogo,
        detail: "Certifying Organization",
      },
      {
        name: "Veteran-Owned Small Business",
        logo: veteranOwnedSmallBusinessLogo,
        detail: "VA verified",
      },
    ],
  },
  {
    heading: "Training & industry partners",
    affiliations: [
      {
        name: "American Red Cross",
        logo: americanRedCrossLogo,
        detail: "Training partner",
      },
      { name: "Propper", logo: propperLogo },
    ],
  },
];
