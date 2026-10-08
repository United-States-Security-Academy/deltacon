import { expect, test, type Page } from "@playwright/test";

import { assessmentQuestions } from "@/config/security-assessment";

type Answer = { label: string; points: number };

/** Answers every question, choosing one answer per question. */
async function answerAllQuestions(
  page: Page,
  pick: (answers: Answer[]) => Answer,
) {
  for (const [index, question] of assessmentQuestions.entries()) {
    const answer = pick(question.answers);
    // The answers are cards; the radio button inside is visually hidden.
    await page.getByText(answer.label, { exact: true }).click();
    const isLast = index === assessmentQuestions.length - 1;
    await page
      .getByRole("button", {
        name: isLast ? "See my results" : "Next question",
      })
      .click();
  }
}

const highestScoring = (answers: Answer[]) =>
  answers.reduce((best, answer) =>
    answer.points > best.points ? answer : best,
  );
const lowestScoring = (answers: Answer[]) =>
  answers.reduce((worst, answer) =>
    answer.points < worst.points ? answer : worst,
  );

test.use({ reducedMotion: "reduce" });

test("a well-protected site scores 100", async ({ page }) => {
  await page.goto("/security-assessment");
  await page.getByRole("button", { name: "Start the assessment" }).click();
  await answerAllQuestions(page, highestScoring);
  await expect(page.getByText("You scored 100 out of 100")).toBeVisible();
});

test("a weak result leads to a pre-filled site survey request", async ({
  page,
}) => {
  await page.goto("/security-assessment");
  await page.getByRole("button", { name: "Start the assessment" }).click();
  await answerAllQuestions(page, lowestScoring);
  await expect(page.getByText(/You scored \d out of 100/)).toBeVisible();

  await page.getByRole("link", { name: "Book a site survey" }).click();
  await expect(page).toHaveURL(/\/request-service\?.*assessment=/);
  await expect(page.getByLabel("Message")).toHaveValue(
    /self-assessment and scored \d\/100/,
  );
});

test("the Back button keeps earlier answers", async ({ page }) => {
  await page.goto("/security-assessment");
  await page.getByRole("button", { name: "Start the assessment" }).click();
  const firstAnswer = assessmentQuestions[0]!.answers[1]!;
  await page.getByText(firstAnswer.label, { exact: true }).click();
  await page.getByRole("button", { name: "Next question" }).click();
  await page.getByRole("button", { name: "Back" }).click();
  await expect(
    page.getByRole("radio", { name: firstAnswer.label, exact: true }),
  ).toBeChecked();
});
