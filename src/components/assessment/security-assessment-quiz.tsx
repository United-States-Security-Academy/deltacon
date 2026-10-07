"use client";

import { ArrowRight, Clock, ListChecks, Lock, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AssessmentQuestionStep } from "@/components/assessment/assessment-question-step";
import { AssessmentResults } from "@/components/assessment/assessment-results";
import { Button } from "@/components/ui/button";
import { assessmentQuestions } from "@/config/security-assessment";
import {
  isAssessmentComplete,
  scoreAssessment,
  type AssessmentAnswers,
} from "@/lib/security-assessment/score-assessment";

type QuizStage = "introduction" | "questions" | "results";

type SavedProgress = {
  stage: QuizStage;
  currentQuestionIndex: number;
  answers: AssessmentAnswers;
};

/** Progress is kept for this browser tab only, so a refresh doesn't lose it. */
const progressStorageKey = "deltacon-security-assessment";

function readSavedProgress(): SavedProgress | undefined {
  try {
    const savedText = window.sessionStorage.getItem(progressStorageKey);
    if (!savedText) return undefined;
    const saved = JSON.parse(savedText) as SavedProgress;
    const isValidIndex =
      Number.isInteger(saved.currentQuestionIndex) &&
      saved.currentQuestionIndex >= 0 &&
      saved.currentQuestionIndex < assessmentQuestions.length;
    if (!isValidIndex || typeof saved.answers !== "object") return undefined;
    if (saved.stage === "results" && !isAssessmentComplete(saved.answers)) {
      return undefined;
    }
    return saved;
  } catch {
    return undefined;
  }
}

function saveProgress(progress: SavedProgress) {
  try {
    window.sessionStorage.setItem(progressStorageKey, JSON.stringify(progress));
  } catch {
    // Storage can be unavailable (private browsing); the quiz still works.
  }
}

const introductionPoints = [
  { icon: ListChecks, text: `${assessmentQuestions.length} quick questions` },
  { icon: Clock, text: "About 3 minutes" },
  { icon: Sparkles, text: "Instant score and personalised recommendations" },
  { icon: Lock, text: "No sign-up needed" },
];

/** The "How secure is your business?" self-assessment, from start to results. */
export function SecurityAssessmentQuiz() {
  const [stage, setStage] = useState<QuizStage>("introduction");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [hasRestoredProgress, setHasRestoredProgress] = useState(false);

  // Restore any progress from earlier in this visit (browser-only, so it
  // happens after the first render).
  useEffect(() => {
    const saved = readSavedProgress();
    /* eslint-disable react-hooks/set-state-in-effect */
    if (saved) {
      setStage(saved.stage);
      setCurrentQuestionIndex(saved.currentQuestionIndex);
      setAnswers(saved.answers);
    }
    setHasRestoredProgress(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (hasRestoredProgress) {
      saveProgress({ stage, currentQuestionIndex, answers });
    }
  }, [hasRestoredProgress, stage, currentQuestionIndex, answers]);

  const result = useMemo(
    () => (stage === "results" ? scoreAssessment(answers) : undefined),
    [stage, answers],
  );

  function startAssessment() {
    setDirection("forward");
    setCurrentQuestionIndex(0);
    setStage("questions");
  }

  function goToNextQuestion() {
    setDirection("forward");
    if (currentQuestionIndex === assessmentQuestions.length - 1) {
      setStage("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentQuestionIndex((index) => index + 1);
    }
  }

  function goToPreviousQuestion() {
    setDirection("back");
    if (currentQuestionIndex === 0) {
      setStage("introduction");
    } else {
      setCurrentQuestionIndex((index) => index - 1);
    }
  }

  function retakeAssessment() {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setDirection("forward");
    setStage("introduction");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (stage === "results" && result) {
    return (
      <AssessmentResults
        result={result}
        answers={answers}
        onRetake={retakeAssessment}
      />
    );
  }

  if (stage === "questions") {
    const question = assessmentQuestions[currentQuestionIndex]!;
    return (
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-white p-6 shadow-sm sm:p-10">
        <AssessmentQuestionStep
          question={question}
          questionNumber={currentQuestionIndex + 1}
          numberOfQuestions={assessmentQuestions.length}
          selectedAnswerId={answers[question.id]}
          direction={direction}
          onAnswerSelected={(answerId) =>
            setAnswers((previousAnswers) => ({
              ...previousAnswers,
              [question.id]: answerId,
            }))
          }
          onBack={goToPreviousQuestion}
          onNext={goToNextQuestion}
        />
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 rounded-xl border border-border bg-white p-6 text-center shadow-sm sm:p-10">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-bold text-navy-900 uppercase sm:text-4xl">
          Find your security gaps in 3 minutes
        </h2>
        <p className="text-lg text-muted-foreground">
          Answer a few questions about your lighting, entry points, cameras,
          opening hours and past incidents. You&apos;ll get a score out of 100
          and practical recommendations you can act on straight away.
        </p>
      </div>
      <ul
        data-reveal-stagger
        className="grid w-full gap-3 text-left sm:grid-cols-2"
      >
        {introductionPoints.map((point) => {
          const Icon = point.icon;
          return (
            <li
              key={point.text}
              className="flex items-center gap-3 rounded-lg bg-paper p-4 font-medium text-navy-900"
            >
              <Icon
                aria-hidden="true"
                className="size-5 shrink-0 text-gold-600"
              />
              {point.text}
            </li>
          );
        })}
      </ul>
      <Button variant="accent" size="xl" onClick={startAssessment}>
        {answeredCount > 0 ? "Start again" : "Start the assessment"}
        <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );
}
