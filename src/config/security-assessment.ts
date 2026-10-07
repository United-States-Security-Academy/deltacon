import type { ServiceSlug } from "./services";

/**
 * "How secure is your business?" self-assessment.
 *
 * Every question has four answers worth 3 (best) to 0 (weakest) points. The
 * final score is the points earned as a percentage of the maximum. Weak
 * answers (0 or 1 point, and some 2-point answers) produce personalised
 * recommendations, each linked to a Deltacon service.
 *
 * Edit the wording, answers or recommendations here; the quiz, results page
 * and results email all update automatically.
 */

export type AssessmentCategoryId =
  | "perimeter"
  | "access"
  | "surveillance"
  | "after-hours"
  | "preparedness"
  | "risk-exposure";

export const assessmentCategories: {
  id: AssessmentCategoryId;
  name: string;
}[] = [
  { id: "perimeter", name: "Perimeter & lighting" },
  { id: "access", name: "Access control" },
  { id: "surveillance", name: "Cameras & alarms" },
  { id: "after-hours", name: "After-hours protection" },
  { id: "preparedness", name: "People & preparedness" },
  { id: "risk-exposure", name: "Risk exposure" },
];

export type AssessmentAnswerOption = {
  id: string;
  label: string;
  /** 3 = best practice, 0 = most vulnerable. */
  points: 0 | 1 | 2 | 3;
};

export type AssessmentRecommendation = {
  title: string;
  advice: string;
  /** The Deltacon service that addresses this gap. */
  serviceSlug: ServiceSlug;
};

export type AssessmentQuestion = {
  id: string;
  categoryId: AssessmentCategoryId;
  question: string;
  /** Optional extra explanation shown under the question. */
  hint?: string;
  answers: AssessmentAnswerOption[];
  /** Shown in the results when the answer scores 2 points or fewer. */
  recommendation: AssessmentRecommendation;
  /** Answers scoring this or less produce the recommendation. */
  recommendWhenPointsAtMost: 1 | 2;
};

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "exterior-lighting",
    categoryId: "perimeter",
    question:
      "How well lit are your entrances, parking areas and perimeter at night?",
    answers: [
      {
        id: "fully-lit",
        label:
          "Fully lit, with motion or timed lighting that is checked regularly",
        points: 3,
      },
      {
        id: "mostly-lit",
        label: "Mostly lit, with a few dark spots",
        points: 2,
      },
      {
        id: "entrance-only",
        label: "Only the main entrance is lit",
        points: 1,
      },
      {
        id: "little-lighting",
        label: "Little or no outside lighting",
        points: 0,
      },
    ],
    recommendation: {
      title: "Light up the dark spots",
      advice:
        "Dark parking areas, side doors and fence lines invite trespassing and break-ins. Light every entrance and walkway, and have patrol officers report failed lights as part of their checks.",
      serviceSlug: "mobile-patrol",
    },
    recommendWhenPointsAtMost: 2,
  },
  {
    id: "entry-points",
    categoryId: "perimeter",
    question:
      "How many entry points (doors, gates, loading docks) are left unlocked or unwatched?",
    answers: [
      {
        id: "none",
        label: "None. Every entry point is locked or monitored",
        points: 3,
      },
      { id: "one-or-two", label: "One or two", points: 2 },
      { id: "three-to-five", label: "Three to five", points: 1 },
      {
        id: "more-or-unsure",
        label: "More than five, or I'm not sure",
        points: 0,
      },
    ],
    recommendation: {
      title: "Secure every way in",
      advice:
        "Each unwatched door or gate is an opportunity. Reduce the number of active entrances, keep secondary doors locked, and place a uniformed officer at the main point of entry.",
      serviceSlug: "unarmed-security-officers",
    },
    recommendWhenPointsAtMost: 1,
  },
  {
    id: "access-control",
    categoryId: "access",
    question: "How do employees and visitors get into your building?",
    answers: [
      {
        id: "badges-and-sign-in",
        label: "Electronic badges or credentials, and visitors sign in",
        points: 3,
      },
      {
        id: "keys-and-sign-in",
        label: "Keys or door codes, and visitors sign in",
        points: 2,
      },
      { id: "keys-only", label: "Keys or door codes only", points: 1 },
      {
        id: "open-doors",
        label: "Doors are usually open during business hours",
        points: 0,
      },
    ],
    recommendation: {
      title: "Control who comes in",
      advice:
        "Know who is on site at all times. Visitor sign-in, credential checks and a staffed front desk stop unauthorised people before they reach your staff, stock or data.",
      serviceSlug: "unarmed-security-officers",
    },
    recommendWhenPointsAtMost: 2,
  },
  {
    id: "public-footfall",
    categoryId: "access",
    question:
      "How many members of the public visit your site on a typical day?",
    answers: [
      { id: "few", label: "Few or none", points: 3 },
      { id: "up-to-fifty", label: "Up to 50", points: 2 },
      { id: "fifty-to-five-hundred", label: "Between 50 and 500", points: 1 },
      {
        id: "more-than-five-hundred",
        label: "More than 500, or we host large events",
        points: 0,
      },
    ],
    recommendation: {
      title: "Plan for busy days",
      advice:
        "High footfall makes it harder to spot problems. A visible, customer-friendly security presence deters theft, manages queues and keeps crowds moving safely.",
      serviceSlug: "unarmed-security-officers",
    },
    recommendWhenPointsAtMost: 1,
  },
  {
    id: "security-cameras",
    categoryId: "surveillance",
    question: "What security camera (CCTV) coverage do you have?",
    answers: [
      {
        id: "full-and-monitored",
        label: "All entrances and key areas covered, and watched live",
        points: 3,
      },
      {
        id: "good-recorded",
        label: "Good coverage, footage reviewed after incidents",
        points: 2,
      },
      {
        id: "partial",
        label: "A few cameras, with blind spots or broken cameras",
        points: 1,
      },
      { id: "none", label: "No cameras", points: 0 },
    ],
    recommendation: {
      title: "Pair cameras with a response",
      advice:
        "Cameras record incidents; people stop them. Make sure entrances and high-value areas are covered, and that someone can respond quickly when something is spotted.",
      serviceSlug: "emergency-rapid-response",
    },
    recommendWhenPointsAtMost: 1,
  },
  {
    id: "alarm-response",
    categoryId: "surveillance",
    question: "Do you have an intruder or fire alarm, and who responds to it?",
    answers: [
      {
        id: "monitored-with-response",
        label: "Monitored alarm, with someone guaranteed to respond in person",
        points: 3,
      },
      {
        id: "monitored-no-response",
        label: "Monitored alarm, but nobody responds in person",
        points: 2,
      },
      {
        id: "local-only",
        label: "An alarm that only sounds on site",
        points: 1,
      },
      { id: "none", label: "No alarm", points: 0 },
    ],
    recommendation: {
      title: "Make sure alarms get a response",
      advice:
        "An alarm without a response is just noise. Our 24/7 Dispatch and Operations Command Center can send officers to verify alarms, secure the site and meet emergency services.",
      serviceSlug: "emergency-rapid-response",
    },
    recommendWhenPointsAtMost: 2,
  },
  {
    id: "after-hours-protection",
    categoryId: "after-hours",
    question: "What protects your site outside business hours?",
    answers: [
      {
        id: "officer-or-patrols",
        label: "An on-site officer or regular security patrols",
        points: 3,
      },
      {
        id: "occasional-checks",
        label: "Occasional checks by staff or a neighbour",
        points: 2,
      },
      { id: "alarm-only", label: "Only an alarm", points: 1 },
      { id: "nothing", label: "Nothing", points: 0 },
    ],
    recommendation: {
      title: "Protect the site when it's empty",
      advice:
        "Most break-ins happen when nobody is around. Randomised mobile patrols check doors, gates and lighting overnight and respond to alarms at a fraction of the cost of a full-time officer.",
      serviceSlug: "mobile-patrol",
    },
    recommendWhenPointsAtMost: 2,
  },
  {
    id: "opening-hours",
    categoryId: "after-hours",
    question: "When are you open or have staff on site?",
    answers: [
      { id: "daytime", label: "Standard daytime hours only", points: 3 },
      {
        id: "early-or-evening",
        label: "Early mornings or evenings as well",
        points: 2,
      },
      { id: "late-nights", label: "Late nights", points: 1 },
      {
        id: "around-the-clock",
        label: "24/7 or overnight with staff on site",
        points: 1,
      },
    ],
    recommendation: {
      title: "Keep late-shift staff safe",
      advice:
        "Employees working late or overnight are more exposed. A security officer on site, or patrols timed to opening and closing, protects staff during the riskiest hours.",
      serviceSlug: "unarmed-security-officers",
    },
    recommendWhenPointsAtMost: 1,
  },
  {
    id: "past-incidents",
    categoryId: "risk-exposure",
    question:
      "In the last 12 months, has your business had any theft, break-ins, vandalism, trespassing or aggressive behaviour?",
    answers: [
      { id: "none", label: "No incidents", points: 3 },
      { id: "one-minor", label: "One minor incident", points: 2 },
      {
        id: "several-or-serious",
        label: "Several minor incidents, or one serious one",
        points: 1,
      },
      { id: "frequent", label: "Incidents happen regularly", points: 0 },
    ],
    recommendation: {
      title: "Break the pattern of incidents",
      advice:
        "Repeated incidents usually mean your site has been identified as an easy target. A visible, professional presence, armed where the risk justifies it, is the fastest way to change that.",
      serviceSlug: "armed-security-officers",
    },
    recommendWhenPointsAtMost: 1,
  },
  {
    id: "valuables-on-site",
    categoryId: "risk-exposure",
    question:
      "Do you keep cash, high-value goods, equipment or sensitive data on site?",
    answers: [
      { id: "rarely", label: "Rarely or never", points: 3 },
      {
        id: "small-secured",
        label: "Small amounts, securely stored",
        points: 2,
      },
      {
        id: "regularly-some-safeguards",
        label: "Regularly, with some safeguards",
        points: 1,
      },
      {
        id: "regularly-few-safeguards",
        label: "Regularly, with few safeguards",
        points: 0,
      },
    ],
    recommendation: {
      title: "Protect high-value assets",
      advice:
        "Cash, stock and equipment attract planned crime. Licensed armed officers or off-duty law enforcement can protect high-value areas, deliveries and cash handling.",
      serviceSlug: "off-duty-police",
    },
    recommendWhenPointsAtMost: 1,
  },
  {
    id: "staff-training",
    categoryId: "preparedness",
    question:
      "Have your employees been trained on what to do in an emergency, such as a fire, medical emergency or active threat?",
    answers: [
      {
        id: "regular-training",
        label: "Yes, with regular training and drills",
        points: 3,
      },
      { id: "once", label: "Once, when they started", points: 2 },
      { id: "informally", label: "Only informally", points: 1 },
      { id: "no", label: "No", points: 0 },
    ],
    recommendation: {
      title: "Prepare your people",
      advice:
        "In an emergency, staff fall back on their training. On-site courses in active threat response, de-escalation, first aid and fire safety help them act quickly and safely.",
      serviceSlug: "mobile-training-team",
    },
    recommendWhenPointsAtMost: 2,
  },
  {
    id: "emergency-plan",
    categoryId: "preparedness",
    question: "Do you have a written emergency and evacuation plan?",
    answers: [
      {
        id: "written-and-practised",
        label: "Yes, written, up to date and practised",
        points: 3,
      },
      {
        id: "written-not-practised",
        label: "Written, but not practised",
        points: 2,
      },
      { id: "informal", label: "An informal plan only", points: 1 },
      { id: "none", label: "No plan", points: 0 },
    ],
    recommendation: {
      title: "Put an emergency plan in place",
      advice:
        "A clear, practised plan saves lives. We can help you write evacuation and lockdown procedures and run tabletop exercises and drills with your team.",
      serviceSlug: "mobile-training-team",
    },
    recommendWhenPointsAtMost: 2,
  },
];

export type AssessmentRating = {
  id: "well-protected" | "some-gaps" | "high-risk";
  label: string;
  /** Lowest score (out of 100) that earns this rating. */
  minimumScore: number;
  summary: string;
};

/** Highest band first. */
export const assessmentRatings: AssessmentRating[] = [
  {
    id: "well-protected",
    label: "Well protected",
    minimumScore: 80,
    summary:
      "Your business has strong security foundations. A professional review can confirm there are no hidden gaps and keep your protection up to date.",
  },
  {
    id: "some-gaps",
    label: "Some gaps to close",
    minimumScore: 55,
    summary:
      "You have some good measures in place, but there are gaps an opportunistic criminal could use. The recommendations below show where to focus first.",
  },
  {
    id: "high-risk",
    label: "Higher risk",
    minimumScore: 0,
    summary:
      "Your answers point to several vulnerabilities. The good news is that most can be fixed quickly. Start with the recommendations below, or let us survey your site.",
  },
];

/** At most this many recommendations are shown, weakest answers first. */
export const maximumRecommendationsShown = 6;
