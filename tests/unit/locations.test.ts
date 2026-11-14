import { describe, expect, it } from "vitest";

import { industries } from "@/config/industries";
import {
  locationNavigationLinks,
  previousLocationSlugs,
} from "@/config/location-links";
import {
  isNavigationItemActive,
  mainNavigationLinks,
} from "@/config/navigation";
import {
  allCities,
  allCounties,
  describePriceRange,
  findLocationBySlug,
  formatRate,
  locations,
} from "@/config/locations";
import { pricingGuide } from "@/config/pricing-guide";
import { services } from "@/config/services";
import { trainingAdvantage } from "@/config/training-advantage";
import {
  buildFaqPageData,
  buildLocationBusinessData,
} from "@/lib/seo/structured-data";

const dallasFortWorth = findLocationBySlug("dallas-fort-worth-metro")!;
const houstonSugarLand = findLocationBySlug("houston-metro-area")!;

const existingPaths = new Set([
  ...services.map((service) => `/services/${service.slug}`),
  ...industries.map((industry) => `/industries/${industry.slug}`),
  "/government-contracting",
  "/security-guard-pricing",
  "/training-advantage",
]);

describe("location pages", () => {
  it("has both locations, headquarters first", () => {
    expect(locations.map((location) => location.slug)).toEqual([
      "houston-metro-area",
      "dallas-fort-worth-metro",
    ]);
    expect(houstonSugarLand.isHeadquarters).toBe(true);
    expect(dallasFortWorth.isHeadquarters).toBe(false);
    expect(dallasFortWorth.office.phoneInternational).toBe("+18178252872");
    expect(houstonSugarLand.office.phoneInternational).toBe("+18322477457");
    expect(houstonSugarLand.office.postalCode).toBe("77478");
  });

  it("uses the exact search titles", () => {
    expect(dallasFortWorth.search.title).toBe(
      "Security Guard Services Dallas–Fort Worth | Deltacon",
    );
    expect(houstonSugarLand.search.title).toBe(
      "Security Guard Services Houston & Sugar Land | Deltacon",
    );
  });

  it("never mentions a single $30/hour rate", () => {
    const allText = JSON.stringify([locations, pricingGuide]);
    expect(allText).not.toMatch(/\$30(\.00)?\s*(per|\/)/);
  });

  it("shows the published rate ranges", () => {
    for (const location of locations) {
      expect(
        location.pricing.rates.map((rate) => [rate.service, formatRate(rate)]),
      ).toEqual([
        ["Unarmed Security Officer – Level II", "$28–$35"],
        ["Armed Security Officer – Level III", "$35–$45"],
        ["Personal Protection Officer – Level IV", "$69–$89"],
        ["Fire Watch Security Officer", "$30–$40"],
        ["Vehicle Security Patrol", "$33–$45"],
        ["Emergency Response", "$55–$125"],
        ["Off-Duty Law Enforcement", "$85–$125"],
        ["Specialized Security Assignments", "Custom Quote"],
      ]);
      expect(describePriceRange(location.pricing.rates)).toBe(
        "$28–$125 per hour",
      );
    }
  });

  it("answers each pricing FAQ in line with its rate table", () => {
    const dallasAnswer = dallasFortWorth.faq.items
      .find((item) =>
        item.question.startsWith("How much does a security guard"),
      )!
      .paragraphs.join(" ");
    for (const rate of dallasFortWorth.pricing.rates) {
      expect(dallasAnswer).toContain(rate.service);
      if (rate.minimumPerHour !== null) {
        expect(dallasAnswer).toContain(formatRate(rate));
      }
    }
    const houstonAnswer = houstonSugarLand.faq.items
      .find((item) => item.question.startsWith("How much do security guards"))!
      .paragraphs.join(" ");
    expect(houstonAnswer).toContain("$28 to $45");
    for (const text of [
      "Personal Protection Officer – Level IV, $69–$89",
      "Emergency Response, $55–$125",
      "Off-Duty Law Enforcement, $85–$125",
    ]) {
      expect(houstonAnswer).toContain(text);
    }
  });

  it("keeps public-sector client names hidden", () => {
    for (const location of locations) {
      expect(location.showClientNames).toBe(false);
    }
  });

  it("links only to pages that exist", () => {
    for (const location of locations) {
      const links = [
        ...location.services.sections.flatMap((section) =>
          (section.links ?? []).map((link) => link.href),
        ),
        ...location.industries.sections.flatMap((section) =>
          (section.links ?? []).map((link) => link.href),
        ),
        location.government.link.href,
        location.pricing.link.href,
        location.training.link.href,
      ];
      for (const href of links) expect(existingPaths).toContain(href);
    }
  });

  it("links Houston to the specialist service and industry pages", () => {
    const houstonLinks = [
      ...houstonSugarLand.services.sections,
      ...houstonSugarLand.industries.sections,
    ].flatMap((section) => (section.links ?? []).map((link) => link.href));
    for (const href of [
      "/services/off-duty-police",
      "/services/detention-correctional-security",
      "/industries/chemical-petrochemical",
      "/industries/ports-of-entry",
      "/industries/data-centers",
    ]) {
      expect(houstonLinks).toContain(href);
    }
  });

  it("keeps the shared pricing and training detail off the location pages", () => {
    for (const location of locations) {
      expect(location.pricing.link.href).toBe("/security-guard-pricing");
      expect(location.training.link.href).toBe("/training-advantage");
    }
    expect(pricingGuide.costCategories).toHaveLength(8);
    expect(trainingAdvantage.academies.map((a) => a.licenseNumber)).toEqual([
      "F28377901",
      "Y07327301",
    ]);
  });

  it("hides the Houston region section until its topics have text", () => {
    const topics = houstonSugarLand.regionalFocus!.topics;
    expect(topics.map((topic) => topic.title)).toHaveLength(3);
    // TODO paragraphs are empty, so the page shows nothing yet.
    expect(topics.every((topic) => topic.paragraphs.length === 0)).toBe(true);
  });
});

describe("renamed location slugs", () => {
  it("still finds each location by its old slug, for old ?location= links", () => {
    expect(findLocationBySlug("houston-sugar-land")).toBe(houstonSugarLand);
    expect(findLocationBySlug("dallas-fort-worth")).toBe(dallasFortWorth);
    expect(findLocationBySlug("toString")).toBeUndefined();
  });

  it("only redirects old slugs to pages that exist, never to themselves", () => {
    const currentSlugs = locations.map((location) => location.slug);
    for (const [previousSlug, currentSlug] of Object.entries(
      previousLocationSlugs,
    )) {
      expect(currentSlugs).toContain(currentSlug);
      expect(currentSlugs).not.toContain(previousSlug);
    }
  });
});

describe("Locations menu", () => {
  it("lists the same location pages as the location data, in order", () => {
    expect(locationNavigationLinks).toEqual(
      locations.map((location) => ({
        label: location.name,
        href: `/locations/${location.slug}`,
      })),
    );
  });

  it("highlights Locations on the hub and on each location page", () => {
    const locationsItem = mainNavigationLinks.find(
      (item) => item.label === "Locations",
    )!;
    for (const path of [
      "/locations",
      "/locations/houston-metro-area",
      "/locations/dallas-fort-worth-metro",
    ]) {
      expect(isNavigationItemActive(path, locationsItem)).toBe(true);
    }
    expect(isNavigationItemActive("/about", locationsItem)).toBe(false);
  });
});

describe("location structured data", () => {
  it("describes the Dallas office as a branch of the company", () => {
    const business = buildLocationBusinessData(dallasFortWorth);
    expect(business["@type"]).toBe("LocalBusiness");
    expect(business["@id"]).toMatch(
      /\/locations\/dallas-fort-worth-metro#business$/,
    );
    expect(business.name).toBe("Deltacon Security Group – Dallas");
    expect(
      "parentOrganization" in business && business.parentOrganization,
    ).toMatchObject({ "@id": expect.stringMatching(/\/#organization$/) });
    expect(business.address.postalCode).toBe("75247");
    expect(business.areaServed).toHaveLength(
      allCities(dallasFortWorth).length + allCounties(dallasFortWorth).length,
    );
    expect(business.areaServed[0]).toMatchObject({
      "@type": "City",
      name: "Dallas",
    });
    expect("geo" in business).toBe(false);
  });

  it("describes the headquarters as the company itself, not a second business", () => {
    const business = buildLocationBusinessData(houstonSugarLand);
    expect(business["@id"]).toMatch(/\/#organization$/);
    expect(business.name).toBe("Deltacon Security Group");
    expect("parentOrganization" in business).toBe(false);
    expect(business.address.addressLocality).toBe("Sugar Land");
    expect(business.areaServed).toHaveLength(
      allCities(houstonSugarLand).length + allCounties(houstonSugarLand).length,
    );
    // Counties are named in full so "Austin" can't be read as the city.
    expect(business.areaServed).toContainEqual(
      expect.objectContaining({
        "@type": "AdministrativeArea",
        name: "Austin County",
      }),
    );
    expect("geo" in business).toBe(false);
  });

  it.each([
    ["Houston", houstonSugarLand, 15, 43],
    ["Dallas–Fort Worth", dallasFortWorth, 13, 40],
  ])(
    "lists the %s places served once each, with no county suffixes",
    (_name, location, countyCount, cityCount) => {
      const places = location.hero.placesServed!;
      expect(places.counties).toHaveLength(countyCount);
      expect(places.citiesAndTowns).toHaveLength(cityCount);
      expect(new Set(places.counties).size).toBe(countyCount);
      expect(new Set(places.citiesAndTowns).size).toBe(cityCount);
      expect(places.counties.some((name) => /county/i.test(name))).toBe(false);
      // Every hero city is also in the structured data, without repeats.
      const cities = allCities(location);
      expect(new Set(cities).size).toBe(cities.length);
      for (const city of places.citiesAndTowns) expect(cities).toContain(city);
    },
  );

  it("builds each FAQPage from the questions the page shows", () => {
    for (const location of locations) {
      const faqPage = buildFaqPageData(location.faq.items);
      expect(faqPage.mainEntity).toHaveLength(location.faq.items.length);
    }
  });
});
