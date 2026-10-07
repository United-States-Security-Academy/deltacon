"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import type { AssessmentQuestion } from "@/config/security-assessment";
import { cn } from "@/lib/utils";

type AssessmentQuestionStepProps = {
  question: AssessmentQuestion;
  questionNumber: number;
  numberOfQuestions: number;
  selectedAnswerId: string | undefined;
  /** "back" makes the question slide in from the left instead of the right. */
  direction: "forward" | "back";
  onAnswerSelected: (answerId: string) => void;
  onBack: () => void;
  onNext: () => void;
};

/**
 * One question with its answers as large, tappable cards. Answers are real
 * radio buttons, so arrow keys move between them and screen readers announce
 * them as a group. Focus moves to the question each time it changes.
 */
export function AssessmentQuestionStep({
  question,
  questionNumber,
  numberOfQuestions,
  selectedAnswerId,
  direction,
  onAnswerSelected,
  onBack,
  onNext,
}: AssessmentQuestionStepProps) {
  const questionHeadingRef = useRef<HTMLHeadingElement>(null);
  const isLastQuestion = questionNumber === numberOfQuestions;
  const progressPercentage = Math.round(
    ((questionNumber - 1) / numberOfQuestions) * 100,
  );

  useEffect(() => {
    questionHeadingRef.current?.focus();
  }, [question.id]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm font-medium text-navy-700">
          <span>
            Question {questionNumber} of {numberOfQuestions}
          </span>
          <span aria-hidden="true">{progressPercentage}% complete</span>
        </div>
        <div
          role="progressbar"
          aria-label="Assessment progress"
          aria-valuemin={0}
          aria-valuemax={numberOfQuestions}
          aria-valuenow={questionNumber - 1}
          aria-valuetext={`Question ${questionNumber} of ${numberOfQuestions}`}
          className="h-2 overflow-hidden rounded-full bg-navy-100"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-gold-600 to-gold-400 transition-[width] duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <form
        key={question.id}
        data-direction={direction}
        className="assessment-step flex flex-col gap-6"
        onSubmit={(event) => {
          event.preventDefault();
          if (selectedAnswerId) onNext();
        }}
      >
        <fieldset
          aria-labelledby={`${question.id}-heading`}
          className="flex flex-col gap-5"
        >
          <h2
            id={`${question.id}-heading`}
            ref={questionHeadingRef}
            tabIndex={-1}
            className="text-2xl leading-snug font-bold text-navy-900 outline-none sm:text-3xl"
          >
            {question.question}
          </h2>
          {question.hint && (
            <p className="text-muted-foreground">{question.hint}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {question.answers.map((answer) => {
              const answerInputId = `${question.id}-${answer.id}`;
              const isSelected = selectedAnswerId === answer.id;
              return (
                <label
                  key={answer.id}
                  htmlFor={answerInputId}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-white p-4 transition-[border-color,box-shadow,background-color] has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-gold-500/50",
                    isSelected
                      ? "border-gold-500 bg-gold-500/10 shadow-md"
                      : "border-border hover:border-navy-200 hover:shadow-sm",
                  )}
                >
                  <input
                    id={answerInputId}
                    type="radio"
                    name={question.id}
                    value={answer.id}
                    checked={isSelected}
                    onChange={() => onAnswerSelected(answer.id)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-gold-600 bg-gold-500 text-navy-950"
                        : "border-navy-200",
                    )}
                  >
                    {isSelected && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="font-medium text-navy-900">
                    {answer.label}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="text-navy-800"
          >
            <ArrowLeft aria-hidden="true" />
            Back
          </Button>
          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={!selectedAnswerId}
          >
            {isLastQuestion ? "See my results" : "Next question"}
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </form>
    </div>
  );
}
