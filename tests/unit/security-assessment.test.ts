import { describe, expect, it } from "vitest";

import {
  assessmentQuestions,
  maximumRecommendationsShown,
} from "@/config/security-assessment";
import {
  assessmentAnswersSchema,
  buildSiteSurveyMessage,
  buildSiteSurveyPath,
  isAssessmentComplete,
  scoreAssessment,
} from "@/lib/security-assessment/score-assessment";

type Answer = { id: string; points: number };

/** Answers every question by picking one option per question. */
function answerEveryQuestion(pick: (answers: Answer[]) => Answer) {
  return Object.fromEntries(
    assessmentQuestions.map((question) => [
      question.id,
      pick(question.answers).id,
    ]),
  );
}
const bestAnswers = answerEveryQuestion((answers) =>
  answers.reduce((best, answer) =>
    answer.points > best.points ? answer : best,
  ),
);
const worstAnswers = answerEveryQuestion((answers) =>
  answers.reduce((worst, answer) =>
    answer.points < worst.points ? answer : worst,
  ),
);
/** Not every question has a 0-point answer, so the lowest score isn't always 0. */
const lowestPossibleScore = Math.round(
  (assessmentQuestions.reduce(
    (total, question) =>
      total + Math.min(...question.answers.map((answer) => answer.points)),
    0,
  ) /
    (assessmentQuestions.length * 3)) *
    100,
);

describe("security self-assessment scoring", () => {
  it("has 10 to 12 questions, each worth up to 3 points", () => {
    expect(assessmentQuestions.length).toBeGreaterThanOrEqual(10);
    expect(assessmentQuestions.length).toBeLessThanOrEqual(12);
    for (const question of assessmentQuestions) {
      expect(Math.max(...question.answers.map((answer) => answer.points))).toBe(
        3,
      );
    }
  });

  it("scores the best answers 100 with no recommendations", () => {
    const result = scoreAssessment(bestAnswers);
    expect(result.scorePercentage).toBe(100);
    expect(result.recommendations).toHaveLength(0);
    expect(
      result.categories.every((category) => category.scorePercentage === 100),
    ).toBe(true);
  });

  it("gives the worst answers the lowest score and the most urgent recommendations", () => {
    const result = scoreAssessment(worstAnswers);
    expect(result.scorePercentage).toBe(lowestPossibleScore);
    expect(lowestPossibleScore).toBeLessThan(10);
    expect(result.recommendations).toHaveLength(maximumRecommendationsShown);
    expect(result.recommendations[0]?.pointsEarned).toBe(0);
  });

  it("puts the weakest answers first", () => {
    const mixedAnswers = answerEveryQuestion((answers) => answers[1]!);
    const points = scoreAssessment(mixedAnswers).recommendations.map(
      (recommendation) => recommendation.pointsEarned,
    );
    expect(points).toEqual([...points].sort((first, second) => first - second));
  });

  it("gives a lower rating to a lower score", () => {
    expect(scoreAssessment(worstAnswers).rating.label).not.toBe(
      scoreAssessment(bestAnswers).rating.label,
    );
  });

  it("only accepts complete answers on the server", () => {
    const [firstQuestion] = assessmentQuestions;
    const partialAnswers = {
      [firstQuestion!.id]: firstQuestion!.answers[0]!.id,
    };
    expect(isAssessmentComplete(partialAnswers)).toBe(false);
    expect(assessmentAnswersSchema.safeParse(partialAnswers).success).toBe(
      false,
    );
    expect(assessmentAnswersSchema.safeParse(bestAnswers).success).toBe(true);
  });

  it("ignores answers that don't exist", () => {
    const tamperedAnswers = {
      ...bestAnswers,
      [assessmentQuestions[0]!.id]: "made-up",
    };
    expect(isAssessmentComplete(tamperedAnswers)).toBe(false);
  });
});

describe("booking a site survey from the results", () => {
  it("links to the request form with the score, service and focus areas", () => {
    const path = buildSiteSurveyPath(scoreAssessment(worstAnswers));
    const query = new URLSearchParams(path.split("?")[1]);
    expect(path.startsWith("/request-service?")).toBe(true);
    expect(query.get("assessment")).toBe(String(lowestPossibleScore));
    expect(query.get("service")).toBeTruthy();
    expect(query.get("focus")?.split(",").length).toBeLessThanOrEqual(4);
  });

  it("builds the pre-filled message only from known questions", () => {
    const knownQuestionId = assessmentQuestions[0]!.id;
    const message = buildSiteSurveyMessage(
      "40",
      `${knownQuestionId},<script>alert(1)</script>`,
    );
    expect(message).toContain("scored 40/100");
    expect(message).toContain(assessmentQuestions[0]!.recommendation.title);
    expect(message).not.toContain("<script>");
  });

  it.each(["999", "-1", "4.5", "abc", undefined])(
    "ignores a tampered score of %j",
    (score) => {
      expect(buildSiteSurveyMessage(score, undefined)).toBeUndefined();
    },
  );
});
