import { z } from "zod";

import {
  assessmentCategories,
  assessmentQuestions,
  assessmentRatings,
  maximumRecommendationsShown,
  type AssessmentCategoryId,
  type AssessmentRating,
} from "@/config/security-assessment";
import { findServiceBySlug } from "@/config/services";

/** The visitor's choices: question id → answer id. */
export type AssessmentAnswers = Record<string, string>;

export type AssessmentRecommendationResult = {
  questionId: string;
  title: string;
  advice: string;
  serviceSlug: string;
  serviceName: string;
  /** Points the visitor's answer earned (lower = more urgent). */
  pointsEarned: number;
};

export type AssessmentCategoryResult = {
  id: AssessmentCategoryId;
  name: string;
  /** 0–100. */
  scorePercentage: number;
};

export type AssessmentResult = {
  /** 0–100. */
  scorePercentage: number;
  rating: AssessmentRating;
  categories: AssessmentCategoryResult[];
  recommendations: AssessmentRecommendationResult[];
};

const pointsAvailablePerQuestion = 3;

/** Points earned for one question, or undefined if it was not answered. */
function pointsForQuestion(
  questionId: string,
  answers: AssessmentAnswers,
): number | undefined {
  const question = assessmentQuestions.find(
    (candidate) => candidate.id === questionId,
  );
  return question?.answers.find((answer) => answer.id === answers[questionId])
    ?.points;
}

/** True when every question has a valid answer. */
export function isAssessmentComplete(answers: AssessmentAnswers): boolean {
  return assessmentQuestions.every(
    (question) => pointsForQuestion(question.id, answers) !== undefined,
  );
}

function toPercentage(pointsEarned: number, numberOfQuestions: number): number {
  if (numberOfQuestions === 0) return 0;
  return Math.round(
    (pointsEarned / (numberOfQuestions * pointsAvailablePerQuestion)) * 100,
  );
}

/**
 * Works out the score, rating, per-area scores and recommendations. Used both
 * in the browser (to show results) and on the server (for the results email),
 * so the two always agree and the score cannot be tampered with.
 */
export function scoreAssessment(answers: AssessmentAnswers): AssessmentResult {
  const totalPoints = assessmentQuestions.reduce(
    (runningTotal, question) =>
      runningTotal + (pointsForQuestion(question.id, answers) ?? 0),
    0,
  );
  const scorePercentage = toPercentage(totalPoints, assessmentQuestions.length);

  const rating =
    assessmentRatings.find((band) => scorePercentage >= band.minimumScore) ??
    assessmentRatings[assessmentRatings.length - 1]!;

  const categories = assessmentCategories.map((category) => {
    const questionsInCategory = assessmentQuestions.filter(
      (question) => question.categoryId === category.id,
    );
    const categoryPoints = questionsInCategory.reduce(
      (runningTotal, question) =>
        runningTotal + (pointsForQuestion(question.id, answers) ?? 0),
      0,
    );
    return {
      id: category.id,
      name: category.name,
      scorePercentage: toPercentage(categoryPoints, questionsInCategory.length),
    };
  });

  const recommendations = assessmentQuestions
    .flatMap((question) => {
      const pointsEarned = pointsForQuestion(question.id, answers);
      if (
        pointsEarned === undefined ||
        pointsEarned > question.recommendWhenPointsAtMost
      ) {
        return [];
      }
      return [
        {
          questionId: question.id,
          title: question.recommendation.title,
          advice: question.recommendation.advice,
          serviceSlug: question.recommendation.serviceSlug,
          serviceName:
            findServiceBySlug(question.recommendation.serviceSlug)?.name ??
            question.recommendation.serviceSlug,
          pointsEarned,
        },
      ];
    })
    // Weakest answers first; ties keep the question order.
    .sort((first, second) => first.pointsEarned - second.pointsEarned)
    .slice(0, maximumRecommendationsShown);

  return { scorePercentage, rating, categories, recommendations };
}

/** Validates answers sent from the browser before scoring them on the server. */
export const assessmentAnswersSchema = z
  .record(z.string().max(60), z.string().max(60))
  .refine(isAssessmentComplete, {
    message: "Please answer every question before sending your results.",
  });

/**
 * The service most worth discussing in a site survey: the one behind the
 * most urgent recommendation.
 */
export function mostUrgentServiceSlug(
  result: AssessmentResult,
): string | undefined {
  return result.recommendations[0]?.serviceSlug;
}

/** Most urgent areas passed to the site-survey request (keeps the URL short). */
const maximumFocusAreasInSurveyLink = 4;

/**
 * Link to the Request Service form, pre-filled with the score and the areas
 * that need attention, so booking a site survey takes one click.
 */
export function buildSiteSurveyPath(result: AssessmentResult): string {
  const searchParameters = new URLSearchParams();
  const serviceSlug = mostUrgentServiceSlug(result);
  if (serviceSlug) searchParameters.set("service", serviceSlug);
  searchParameters.set("assessment", String(result.scorePercentage));
  const focusAreas = result.recommendations
    .slice(0, maximumFocusAreasInSurveyLink)
    .map((recommendation) => recommendation.questionId);
  if (focusAreas.length > 0)
    searchParameters.set("focus", focusAreas.join(","));
  return `/request-service?${searchParameters.toString()}`;
}

/**
 * The message pre-filled on the Request Service form when the visitor comes
 * from the self-assessment. Built on the server from known question ids only,
 * so nothing typed into the URL appears in the form.
 */
export function buildSiteSurveyMessage(
  scoreText: string | undefined,
  focusText: string | undefined,
): string | undefined {
  const score = Number(scoreText);
  if (!scoreText || !Number.isInteger(score) || score < 0 || score > 100) {
    return undefined;
  }
  const rating =
    assessmentRatings.find((band) => score >= band.minimumScore) ??
    assessmentRatings[assessmentRatings.length - 1]!;
  const focusTitles = (focusText ?? "")
    .split(",")
    .map(
      (questionId) =>
        assessmentQuestions.find((question) => question.id === questionId)
          ?.recommendation.title,
    )
    .filter((title): title is string => Boolean(title))
    .slice(0, maximumFocusAreasInSurveyLink);

  const lines = [
    `I completed the online security self-assessment and scored ${score}/100 (${rating.label}). I'd like to book a site survey.`,
  ];
  if (focusTitles.length > 0) {
    lines.push(
      "",
      "Areas I'd like help with:",
      ...focusTitles.map((title) => `- ${title}`),
    );
  }
  return lines.join("\n");
}
